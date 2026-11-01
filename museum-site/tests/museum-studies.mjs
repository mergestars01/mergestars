import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createRequire} from 'node:module';
import {randomUUID} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import ts from 'typescript';
const root=fileURLToPath(new URL('../',import.meta.url)),require=createRequire(import.meta.url);
function loader(overrides={}){const cache=new Map();function load(relative){const file=path.join(root,relative);if(cache.has(file))return cache.get(file).exports;const m={exports:{}};cache.set(file,m);const code=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;new Function('require','module','exports',code)(name=>{if(name in overrides)return overrides[name];if(name.startsWith('.')||name.startsWith('@/')){let target=name.startsWith('@/')?path.join(root,name.slice(2)):path.resolve(path.dirname(file),name);if(!existsSync(target))target=['.ts','.tsx','.mjs'].map(e=>target+e).find(existsSync);if(!target)throw Error('Missing '+name);return load(path.relative(root,target));}return require(name);},m,m.exports);return m.exports;}return load;}
const load=loader(),studies=load('lib/museum-studies.ts'),{cityHouses}=load('lib/megapolis-domain.ts'),THREE=require('three');
assert.equal(new Set(studies.museumStudies.map(s=>s.id)).size,studies.museumStudies.length);
assert(studies.museumStudies.length>200,'The House taxonomy should have individual studies, not empty category placeholders');
for(const house of cityHouses)for(const category of house.categories){const refs=studies.studiesFor(house.id,category);assert(refs.length>0,house.id+' '+category);for(const s of refs){assert.equal(s.houseId,house.id);assert.equal(s.category,category);assert.equal(s.status,'CONCEPT');assert.equal(s.coreProductId,null);assert(studies.studyKinds.includes(s.kind));assert.equal(studies.museumStudy(s.id),s);assert(studies.visualStudySchema.safeParse(studies.defaultVisualStudy(s.id)).success);}}
assert.equal(studies.museumStudy('CORE-FAKE'),null);assert.throws(()=>studies.defaultVisualStudy('CORE-FAKE'));
assert.equal(studies.studiesFor('music',undefined,'GUITAR').some(s=>s.kind==='guitar'),true);
const scene=load('lib/museum-study-scene.ts'),dispose=load('lib/core-model-scene.ts').disposeModelObjects;
const perKind=[...new Map(studies.museumStudies.map(s=>[s.kind,s])).values()];
for(const s of perKind){
 const config=studies.defaultVisualStudy(s.id),model=scene.buildStudyModel(config);model.updateMatrixWorld(true);
 const box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3());assert([...box.min,...box.max,...size].every(Number.isFinite),s.title+' bounds');assert(size.x>0&&size.y>0&&size.z>0,s.title+' has volume');assert(Math.max(...size)<10,s.title+' bounded display scale');
 let vertices=0,instances=0;model.traverse(v=>{if(v.isMesh){const position=v.geometry.getAttribute('position');for(const n of position.array)assert(Number.isFinite(n),s.title+' finite vertices');vertices+=position.count;if(v.isInstancedMesh){instances+=v.count;for(let i=0;i<v.count*16;i++)assert(Number.isFinite(v.instanceMatrix.array[i]));}}});
 assert(vertices>50&&vertices<120000,s.title+' bounded geometry budget');assert(instances<2500,'bounded selective mosaic');assert.equal(model.userData.manufacturing_ready,false);assert.equal(model.userData.weight,null);assert.equal(model.userData.core_product_id,null);
 dispose(model);
}
// Validate real JSON + the existing SQLite persistence path, including isolation and safe replay.
const sql=new DatabaseSync(':memory:');sql.exec(readFileSync(path.join(root,'drizzle/0001_happy_guardian.sql'),'utf8'));
const db={prepare(query){return {bind(...args){const statement=sql.prepare(query);return {async run(){return statement.run(...args);},async first(){return statement.get(...args)??null;},async all(){return {results:statement.all(...args)};}};}};}};
const data=loader({'cloudflare:workers':{env:{DB:db}}}),contract=data('lib/atelier-contract.ts'),store=data('lib/atelier-store.ts'),coin=data('lib/coin-museum.ts');
const s=studies.studiesFor('music')[0],visual={...studies.defaultVisualStudy(s.id),finish:'silver',mosaic:'architectural',style:'sculptural',variation:17};
const intent={experience_house_id:s.houseId,experience_category:s.category,coin_line:'SILVER',description:'QA private design with restored visual settings.',material_preference:{base_filament:'PLA',precious_metal:'silver',integration:'mosaic',intended_use:'QA only',details:''},visual_study:visual};
assert(coin.museumDesignIntentSchema.safeParse(intent).success);
for(const patch of [{visual_study:{...visual,reference_id:'fake'}},{visual_study:{...visual,variation:Infinity}},{visual_study:{...visual,weight:1000}},{experience_house_id:'fashion'},{experience_category:cityHouses.find(h=>h.id==='music').categories[1]}])assert(!coin.museumDesignIntentSchema.safeParse({...intent,...patch}).success,'reject incompatible or forged study facts');
const input=contract.atelierInputSchema.parse({request_id:randomUUID(),intent});
const saved=await store.saveAtelier('isolated-qa-owner-a',input);assert.equal(saved.replayed,false);assert.deepEqual(saved.draft.intent.visual_study,visual);assert.equal(saved.draft.core_product_id,null);assert.equal(saved.draft.core_house_id,null);
assert.deepEqual((await store.listAtelier('isolated-qa-owner-a'))[0].intent,intent);assert.equal((await store.listAtelier('isolated-qa-owner-b')).length,0);
const replay=await store.saveAtelier('isolated-qa-owner-a',input);assert.equal(replay.replayed,true);assert.equal(replay.draft.id,saved.draft.id);
await assert.rejects(()=>store.saveAtelier('isolated-qa-owner-a',{...input,intent:{...intent,visual_study:{...visual,variation:18}}}),/IDEMPOTENCY_CONFLICT/);
const version=await store.saveAtelier('isolated-qa-owner-a',{...input,request_id:randomUUID(),intent:{...intent,visual_study:{...visual,variation:18}}});assert.notEqual(version.draft.id,saved.draft.id);assert.equal((await store.listAtelier('isolated-qa-owner-a')).length,2);assert.deepEqual((await store.listAtelier('isolated-qa-owner-a')).find(v=>v.id===saved.draft.id).intent.visual_study,visual,'new version never overwrites its saved original');
const legacy={...intent};delete legacy.visual_study;assert(coin.museumDesignIntentSchema.safeParse(legacy).success,'pre-existing briefs remain compatible');
sql.close();
// Existing server AI adapters get only the selected, validated study context.
const ai=load('lib/ai-manager-contract.ts'),service=load('lib/ai-manager-service.ts');
const request=ai.managerRequestSchema.parse({request_id:randomUUID(),role:'design',message:'Refine this instrument.',study_id:s.id,consent:true});
assert(!ai.managerRequestSchema.safeParse({...request,study_id:'unrecognized-private-product'}).success);
let payload;await service.answerManager(request,{OPENAI_API_KEY:'isolated-qa-key',OPENAI_MODEL:'isolated-qa-model'},async(_url,options)=>{payload=JSON.parse(options.body);return new Response(JSON.stringify({output:[{content:[{type:'output_text',text:'Isolated fixture, not a live AI answer.'}]}]}),{headers:{'content-type':'application/json'}});});assert(JSON.stringify(payload).includes(s.id));assert(JSON.stringify(payload).includes('manufacturing_ready'));assert(!JSON.stringify(payload).includes('image_url'));
// Each House can render the catalogue shell without relying on CORE availability.
const Gallery=load('components/house-study-gallery.tsx').HouseStudyGallery;
for(const house of cityHouses){const html=renderToStaticMarkup(React.createElement(Gallery,{houseId:house.id,category:house.categories[0],onCreate(){}}));assert(html.includes('3D concept studies'));assert(html.includes('Create my version'));assert(html.includes('CONCEPT'));assert(!html.includes('ORDER NOW'));assert(html.includes('Rotate 3D study'));}
console.log(`PASS: ${studies.museumStudies.length} individual studies in all 12 Houses and every category; ${perKind.length} finite volumetric model families; actual SQLite save/reopen/new-version/replay/isolation; unknown and cross-category references rejected; legacy briefs preserved; selected study reaches AI context fixtures. Browser/GPU, live AI and CORE commerce are not asserted.`);
// The software view draws real projected triangles and responds to camera changes.
const oldWindow=globalThis.window;globalThis.window={devicePixelRatio:1};let paths=0,projectionHash=0;
const ctx={setTransform(){},clearRect(){},createRadialGradient(){return {addColorStop(){}};},fillRect(){},beginPath(){paths++;},moveTo(x,y){projectionHash+=x+y;},lineTo(x,y){projectionHash+=x+y;},closePath(){},fill(){},stroke(){}};
const canvas={clientWidth:640,clientHeight:400,width:0,height:0,getContext:()=>ctx};
const software=load('lib/museum-study-software.ts').createSoftwareStudyStage(canvas,visual);software.render();assert(paths>100,'compatibility view paints actual model triangles');const firstHash=projectionHash;projectionHash=0;software.orbit.yaw+=.7;software.render();assert(Math.abs(projectionHash-firstHash)>1,'camera rotation changes the projection');assert.equal(software.mode,'SOFTWARE');software.update({...visual,finish:'gold',variation:18});software.render();software.dispose();globalThis.window=oldWindow;
// Real binary glTF serialization; the test shim supplies only browser FileReader I/O.
const oldReader=globalThis.FileReader;globalThis.FileReader=class{readAsArrayBuffer(blob){void blob.arrayBuffer().then(result=>{this.result=result;this.onloadend?.();});}readAsDataURL(blob){void blob.arrayBuffer().then(result=>{this.result='data:'+blob.type+';base64,'+Buffer.from(result).toString('base64');this.onloadend?.();});}};
try{const {GLTFExporter}=require('three/addons/exporters/GLTFExporter.js');for(const kind of ['guitar','chair','chess']){const s=studies.museumStudies.find(s=>s.kind===kind),model=scene.buildStudyModel(studies.defaultVisualStudy(s.id)),bytes=await new GLTFExporter().parseAsync(model,{binary:true});assert(bytes instanceof ArrayBuffer);const view=new DataView(bytes);assert.equal(view.getUint32(0,true),0x46546c67);assert.equal(view.getUint32(4,true),2);assert.equal(view.getUint32(8,true),bytes.byteLength);const length=view.getUint32(12,true),json=JSON.parse(new TextDecoder().decode(new Uint8Array(bytes,20,length)));assert(json.meshes.length>0);assert(JSON.stringify(json).includes('MERGE_GEOMETRIC_STUDY'));assert(JSON.stringify(json).includes('manufacturing_ready'));dispose(model);}}
finally{globalThis.FileReader=oldReader;}
console.log('PASS: compatibility renderer projects actual triangles and rotation changes the projection; Guitar, Chair and Chess serialize as valid glTF 2.0 binaries retaining CONCEPT provenance. This validates serialization, not a browser download receipt.');
