import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash,randomUUID} from 'node:crypto';
import {createRequire} from 'node:module';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const root=fileURLToPath(new URL('../',import.meta.url)),require=createRequire(import.meta.url),cache=new Map();
function load(relative){const file=path.join(root,relative);if(cache.has(file))return cache.get(file).exports;const module={exports:{}};cache.set(file,module);new Function('require','module','exports',ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText)(name=>{if(name.startsWith('.')||name.startsWith('@/')){let target=name.startsWith('@/')?path.join(root,name.slice(2)):path.resolve(path.dirname(file),name);if(!existsSync(target))target=['.ts','.tsx','.mjs'].map(ext=>target+ext).find(existsSync);return load(path.relative(root,target));}return require(name);},module,module.exports);return module.exports;}
const registry=load('lib/ascension-exhibits.ts'),{cityHouses}=load('lib/megapolis-domain.ts'),{imageDetailLayout,imageDetailTransform}=load('lib/image-detail.ts');
assert.equal(registry.ascensionExhibits.length,3);assert.equal(new Set(registry.ascensionIds).size,3);
for(const item of registry.ascensionExhibits){
 const original=readFileSync(path.join(root,'public',item.original));assert.equal(createHash('sha256').update(original).digest('hex'),item.sourceSha256);
 for(const asset of [item.image,item.thumbnail]){const bytes=readFileSync(path.join(root,'public',asset));assert.equal(bytes.subarray(8,12).toString(),'WEBP');}
 assert.equal(original.subarray(1,4).toString(),'PNG');
 assert.equal(registry.ascensionPresentationImage(item.original),item.image);
 assert.equal(item.status,'CONCEPT');assert.equal(item.coreProductId,null);assert.equal(item.coreVersionId,null);assert.equal(item.price,null);assert.equal(item.qr,null);assert.equal(item.productionReady,false);
 const category=cityHouses.find(h=>h.id===item.houseId).categories[item.categoryIndex];assert.deepEqual(registry.ascensionForHouse(item.houseId,category),[item]);
 assert.equal(registry.ascensionForHouse('games',category).length,0);
 for(const [w,h] of [[390,400],[1280,620]]){const layout=imageDetailLayout(1254,1254,w,h);const native=imageDetailTransform(layout,layout.nativeZoom,0,0,w,h);assert.equal(Math.round(native.width),1254);assert.equal(Math.round(native.height),1254);}
 const context=JSON.parse(registry.ascensionAIContext(item.id));assert.equal(context.presentation_reference_id,item.id);assert.equal(context.core_product_id,null);assert.equal(context.verified_materials,false);
}
assert.throws(()=>registry.ascensionAIContext('forged'));
const before=JSON.parse(readFileSync(path.join(root,'docs/ascension/preserved-public-files.json'),'utf8'));
for(const [file,hash] of Object.entries(before))assert.equal(createHash('sha256').update(readFileSync(path.join(root,file))).digest('hex'),hash,'Preserve existing asset '+file);
const contract=load('lib/ai-manager-contract.ts'),service=load('lib/ai-manager-service.ts');
const request={request_id:randomUUID(),role:'design',message:'Refine the source while preserving its history.',history:[],consent:true,exhibit_id:'merge-ascension-watch'};
assert(contract.managerRequestSchema.safeParse(request).success);
for(const patch of [{exhibit_id:'another-user-product'},{product_id:'forged'},{house_id:'forged'},{verified:true},{consent:false}])assert(!contract.managerRequestSchema.safeParse({...request,...patch}).success);
let calls=0;await assert.rejects(()=>service.answerManager(request,{},async()=>{calls++;}));assert.equal(calls,0);
for(const provider of ['openai','anthropic','gemini']){
 const prefix=provider.toUpperCase();let payload;
 const replies={openai:{output:[{content:[{type:'output_text',text:'Fixture concept advice'}]}]},anthropic:{content:[{type:'text',text:'Fixture concept advice'}]},gemini:{candidates:[{content:{parts:[{text:'Fixture concept advice'}]}}]}};
 const result=await service.answerManager(request,{MERGE_AI_DEFAULT_PROVIDER:provider,[prefix+'_API_KEY']:'test-secret',[prefix+'_MODEL']:'test-model'},async(_url,options)=>{payload=JSON.parse(options.body);return new Response(JSON.stringify(replies[provider]),{headers:{'content-type':'application/json'}});});
 const serialized=JSON.stringify(payload);assert(serialized.includes('merge-ascension-watch'));assert(serialized.includes('CORE_CONFIRMATION_REQUIRED'));assert(!serialized.includes('merge-ascension-belt'));assert(!serialized.includes('image_url'));
 assert.equal(result.core_record_created,false);assert.equal(result.external_action_executed,false);
}
const UI=load('components/ascension-exhibits.tsx').AscensionExhibits;
for(const item of registry.ascensionExhibits){const html=renderToStaticMarkup(React.createElement(UI,{houseId:item.houseId}));assert(html.includes(item.title));assert(!html.includes('ORDER NOW'));assert(!html.includes('VERIFIED'));}
assert.equal(renderToStaticMarkup(React.createElement(UI,{houseId:'games'})),'');
console.log('PASS: exact 3 original SHA-256 hashes, 6 valid WebPs, 92 preserved assets, category placements, native 1:1 at desktop/mobile sizes, no forged CORE authority, no-provider fail closed and selected-exhibit context through all 3 existing provider adapters. External replies are isolated fixtures; browser and live provider results reported separately.');
