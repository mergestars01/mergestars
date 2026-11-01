import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import path from 'node:path';
import React,{createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import ts from 'typescript';
const root=fileURLToPath(new URL('../',import.meta.url)),require=createRequire(import.meta.url);
function loader(overrides={}){const cache=new Map();function load(relative){const file=path.join(root,relative);if(cache.has(file))return cache.get(file).exports;const module={exports:{}};cache.set(file,module);const code=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;new Function('require','module','exports',code)(name=>{if(name in overrides)return overrides[name];if(name.startsWith('.')||name.startsWith('@/')){let target=name.startsWith('@/')?path.join(root,name.slice(2)):path.resolve(path.dirname(file),name);if(!existsSync(target))target=['.ts','.tsx'].map(ext=>target+ext).find(existsSync);if(!target)throw Error('Missing '+name);return load(path.relative(root,target));}return require(name);},module,module.exports);return module.exports;}return load;}
const load=loader(),{cityHouses}=load('lib/megapolis-domain.ts'),room=load('lib/house-room.ts'),scene=load('lib/house-room-scene.ts'),{HouseShowroom}=load('components/house-showroom.tsx');
for(const house of cityHouses){
 const slots=room.houseRoomSlots(house.id);assert.equal(slots.length,house.categories.length);assert.equal(new Set(slots.map(s=>s.key)).size,slots.length);
 const model=scene.buildHouseRoom(house.id);assert.equal(model.showcases.length,house.categories.length);assert.equal(model.pickables.length,house.categories.length);
 let vertices=0;model.root.traverse(object=>{if(object.isMesh){for(const n of object.geometry.getAttribute('position').array)assert(Number.isFinite(n));vertices+=object.geometry.getAttribute('position').count;}});assert(vertices>0&&vertices<180000,'bounded actual room architecture');
 for(const [i,vitrine] of model.showcases.entries()){assert.equal(vitrine.userData.houseId,house.id);assert.equal(vitrine.userData.category,house.categories[i]);assert.equal(vitrine.userData.core_product_id,null);assert.equal(vitrine.userData.kind,'CATEGORY_SHOWCASE');assert(Math.abs(Math.hypot(vitrine.position.x,vitrine.position.z)-8.4)<1e-8);}
 const html=renderToStaticMarkup(createElement(HouseShowroom,{houseId:house.id,disabled:false,onCategory(){},onExit(){}}));assert(html.includes(house.title));assert(html.includes('interior and showcases'));assert.equal((html.match(/data-showcase-key=/g)||[]).length,house.categories.length);assert(html.includes('OPEN SHOWCASE'));assert(html.includes('CORE records'));assert(!html.includes('3D READY'));assert(!html.includes('house-room-welcome'),'reference mode uses a single caption');assert(html.includes('APPROVED_INTERIOR_PHOTOGRAPH'));assert(html.includes('Approved photo sequence'));assert(html.includes('3D room'));if(house.id==='fashion')assert(html.includes('/assets/founder-family-wardrobe-study.png'));
 load('lib/core-model-scene.ts').disposeModelObjects(model.root);
}
assert.throws(()=>room.houseRoomSlots('invented'));for(const n of [NaN,Infinity,-1,999])assert.equal(room.boundedRoomSnapshot('fashion',{houseId:'fashion',yaw:n,selected:999}).selected,null);
assert.equal(room.boundedRoomSnapshot('fashion',{houseId:'games',yaw:1,selected:0}).selected,null);assert.equal(room.roomSlotIndex(0,-1,8),7);assert.equal(room.roomSlotIndex(7,1,8),0);assert.equal(room.roomSlotIndex(5,1,0),0);
// Exercise the real House UI callbacks without claiming a browser or GPU render.
let states=[],cursor=0,refs=[],refCursor=0;const hooks={...React,useRef(initial){const i=refCursor++;if(!refs[i])refs[i]={current:initial};return refs[i];},useEffect(){},useState(initial){const i=cursor++;if(!(i in states))states[i]=typeof initial==='function'?initial():initial;return [states[i],v=>states[i]=typeof v==='function'?v(states[i]):v];}};
const Interactive=loader({'react':hooks})('components/house-showroom.tsx').HouseShowroom;
function nodes(value,out=[]){if(!value||typeof value!=='object')return out;if(Array.isArray(value)){value.forEach(v=>nodes(v,out));return out;}out.push(value);nodes(value.props?.children,out);return out;}
function text(value){return typeof value==='string'?value:Array.isArray(value)?value.map(text).join(''):value&&typeof value==='object'?text(value.props?.children):'';}
let visits=[],exits=0,disabled=false;const memory={current:null};function tree(){cursor=0;refCursor=0;return Interactive({houseId:'fashion',disabled,onCategory:category=>visits.push(category),onExit:()=>exits++,memory});}
let t=tree();const showcases=nodes(t).filter(n=>n.type==='button'&&n.props['data-showcase-key']);assert.equal(showcases.length,8);showcases[2].props.onClick();assert.equal(visits.at(-1),cityHouses.find(h=>h.id==='fashion').categories[2]);assert.equal(states[1],2);assert.equal(memory.current.selected,2);
t=tree();nodes(t).find(n=>n.type==='button'&&n.props['aria-label']==='Next showcase').props.onClick();assert.equal(states[1],3);assert.equal(visits.length,1,'arrows approach only; they do not open a category or create a product');t=tree();nodes(t).find(n=>n.type==='button'&&text(n).includes('OPEN SHOWCASE')).props.onClick();assert.equal(visits.at(-1),cityHouses.find(h=>h.id==='fashion').categories[3]);
disabled=true;t=tree();for(const button of nodes(t).filter(n=>n.type==='button'&&n.props['data-showcase-key'])){assert(button.props.disabled);button.props.onClick();}assert.equal(visits.length,2,'blocked room cannot open hidden categories');
disabled=false;t=tree();nodes(t).find(n=>n.type==='button'&&text(n).includes('Grand Museum')).props.onClick();assert.equal(exits,1);
const parent=readFileSync(path.join(root,'components/grand-atrium.tsx'),'utf8');assert(parent.includes('selected&&theme&&<HouseShowroom'));assert(parent.includes('selected&&theme&&showcaseOpen&&<Dialog'));assert(parent.includes('onCategory={openCategory}'));assert(parent.includes('onExit={closeHouse}'));
const museum=readFileSync(path.join(root,'components/museum.tsx'),'utf8');assert(museum.includes('onMuseum={showGrandMuseum}'));assert(museum.includes('onClick={showGrandMuseum}'));assert(museum.includes('setGrandVisit(value=>value+1)'));
console.log('PASS: all 12 Houses open an independent interior and all category vitrines without CORE data; exact approved Fashion photo; real bounded Three.js showcase geometry; category/arrow/open/disabled/return callbacks and retained snapshot; Grand Museum reset wiring. Browser/GPU E2E NOT RUN.');
