import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

const root=fileURLToPath(new URL('../',import.meta.url)),require=createRequire(import.meta.url),cache=new Map();
function load(relative){
 const file=path.join(root,relative);if(cache.has(file))return cache.get(file).exports;
 const module={exports:{}};cache.set(file,module);
 const code=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 new Function('require','module','exports',code)(name=>{
  if(!name.startsWith('.')&&!name.startsWith('@/'))return require(name);
  let target=name.startsWith('@/')?path.join(root,name.slice(2)):path.resolve(path.dirname(file),name);
  if(!existsSync(target))target=['.ts','.tsx'].map(ext=>target+ext).find(existsSync);
  if(!target)throw Error(name);return load(path.relative(root,target));
 },module,module.exports);return module.exports;
}
const scenario=load('lib/photo-scenario.ts'),routes=load('lib/unified-world.ts'),{cityHouses}=load('lib/megapolis-domain.ts');
const {storyboardStage,storyboardStudio,photosForContext,placedPhotographs,studioPhotoStage}=scenario;
assert.equal(placedPhotographs.length,45);
assert.equal(new Set(placedPhotographs.map(p=>p.image)).size,45);
for(const photo of placedPhotographs){assert(existsSync(path.join(root,'public',photo.image)));assert(photo.context);if(photo.context==='house')assert(cityHouses.some(h=>h.id===photo.houseId));}
for(const context of new Set(placedPhotographs.map(p=>p.context))){
 const photos=photosForContext(context);assert(photos.length);for(const photo of photos)assert.equal(photo.context,context);
}
assert(photosForContext('brand').some(p=>p.image.endsWith('brand-house-tbilisi.png')));
assert(photosForContext('brand').some(p=>p.image.endsWith('brand-manager-dashboard.png')));
assert(photosForContext('house','robotics').some(p=>p.image.endsWith('smart-key.png')));
assert.equal(photosForContext('house','nonexistent').length,0);
const expected=new Map([[19,'studio'],[20,'studio'],[21,'fit'],[22,'studio'],[23,'orders'],[24,'collection'],[31,'brand'],[32,'ai'],[33,'social'],[34,'collection'],[35,'orders'],[36,'city']]);
for(const [id,target] of expected){const stage=storyboardStage(id);assert.equal(stage.target,target);assert(stage.column>=0&&stage.column<(stage.group==='brand'?3:2));assert(stage.row>=0&&stage.row<(stage.group==='brand'?2:3));const [x,y,w,h]=scenario.storyboardCrop(stage);assert(x>=0&&y>=0&&w>0&&h>0&&x+w<=1448&&y+h<=1086);assert(existsSync(path.join(root,'public',stage.image)));}
assert.equal(storyboardStage(0),null);assert.equal(storyboardStudio(0),null);
for(const [id,houseId] of [[19,'watches'],[20,'jewelry'],[22,'fashion']]){const destination=storyboardStudio(id);assert.equal(destination.houseId,houseId);assert.equal(destination.mode,'create');assert(cityHouses.find(h=>h.id===houseId).categories.includes(destination.category));}
assert.equal(storyboardStudio(21),null);assert.equal(studioPhotoStage('games',cityHouses.find(h=>h.id==='games').categories[0]),null);
for(const id of [19,20,21,22,23,24])assert.equal(routes.worldScene(id).image,storyboardStage(id).image);

// Exercise the actual application routing handler with real stage metadata.
// No CORE network calls, writes, orders, payment, or provider jobs are run.
const source=readFileSync(path.join(root,'components/museum.tsx'),'utf8'),ast=ts.createSourceFile('museum.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
let handler;function visit(node){if(ts.isFunctionDeclaration(node)&&node.name?.text==='openStoryboardStep')handler=node;ts.forEachChild(node,visit);}visit(ast);assert(handler);
const handlerCode=ts.transpileModule(handler.getText(ast),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
for(const locked of [false,true])for(const [id,target] of expected){
 const events=[],grandMemory={current:null};
 const bindings={saving:locked,inFlight:{current:false},entered:true,worldReturn:{current:true},storyboardStage,storyboardStudio,grandMemory,
 returnToSpace:()=>events.push('space'),setLegacyMuseum:()=>{},setGrandVisit:()=>{},setWorldMode:value=>events.push(value),load:()=>events.push('load'),setPanel:value=>events.push(value),openFit:value=>events.push('fit:'+value),showBrandMuseum:()=>events.push('brand'),showManager:section=>events.push('ai:'+section)};
 const execute=new Function(...Object.keys(bindings),handlerCode+'\nreturn openStoryboardStep;')(...Object.values(bindings));execute(id);
 if(locked){assert.deepEqual(events,[]);assert.equal(grandMemory.current,null);continue;}
 if(target==='studio'){assert.equal(grandMemory.current.houseId,storyboardStudio(id).houseId);assert.equal(grandMemory.current.mode,'create');assert(events.includes('museum'));}
 else if(target==='fit')assert(events.includes('fit:fashion'));
 else if(target==='brand')assert(events.includes('brand'));
 else if(target==='collection'){assert(events.includes('collection'));assert(events.includes('load'));}
 else if(target==='orders')assert(events.includes('commercial'));
 else if(target==='social')assert(events.includes('ai:mai-social'));
 else if(target==='ai')assert(events.includes('ai:mai-chat'));
 else if(target==='city')assert(events.includes('city'));
}
const {FounderStoryboard,ContextPhotoSequence}=load('components/photo-scenario.tsx');
for(const group of ['atelier','brand']){
 const clicked=[],tree=FounderStoryboard({group,onStage:id=>clicked.push(id)}),buttons=[];
 function collect(node){if(!node||typeof node!=='object')return;if(Array.isArray(node)){node.forEach(collect);return;}if(node.type==='button')buttons.push(node);collect(node.props?.children);}collect(tree);
 assert.equal(buttons.length,6);for(const button of buttons)button.props.onClick();assert.deepEqual(clicked,scenario.storyboardStages.filter(s=>s.group===group).map(s=>s.id));
 const markup=renderToStaticMarkup(React.createElement(FounderStoryboard,{group,onStage:()=>{}}));assert.equal((markup.match(/data-storyboard-panel=/g)||[]).length,6);
 const disabledMarkup=renderToStaticMarkup(React.createElement(FounderStoryboard,{group,disabled:true,onStage:()=>{}}));assert.equal((disabledMarkup.match(/disabled=""/g)||[]).length,6);
}
for(const context of ['city','museum','brand','ai','fit','materials','journey','collection']){
 const markup=renderToStaticMarkup(React.createElement(ContextPhotoSequence,{context}));
 if(photosForContext(context).length)assert(markup.includes('data-photo-context="'+context+'"'));
}
// The first Museum view must show the actual interior, with immediately
// available House and Lab navigation rather than another entrance photograph.
const {GrandAtrium}=load('components/grand-atrium.tsx');
const props={blocked:false,signedIn:false,onCity(){},onLegacy(){},onCreate(){},onPlace(){},onStage(){}};
const interior=renderToStaticMarkup(React.createElement(GrandAtrium,props));
assert(interior.includes('data-primary-museum-image="/assets/approved-mega-museum.png"'));
assert(interior.includes('/assets/official-company-logo.svg'));
assert(interior.includes('Studio / Lab · 19–24'));
assert(!interior.includes('approved-museum-portal'),'the Museum cannot default to another door');
for(const house of cityHouses)assert(interior.includes('aria-label="Enter '+house.title+'"'));
const labs=renderToStaticMarkup(React.createElement(GrandAtrium,{...props,initialView:'labs'}));
assert.equal((labs.match(/data-storyboard-step=/g)||[]).length,6);
assert(!labs.includes('data-primary-museum-image='),'direct Studio route shows the studios immediately');
console.log('PASS: all 45 curated photos have a primary context; original assets resolve; 19–24 and 31–36 actual handlers open the matching existing Studio/Fit/Brand/AI/social/order/city paths; blocked routes do nothing; six functional image panels per storyboard; scoped photo readers. Browser/GPU and external CORE/provider operations NOT RUN.');
