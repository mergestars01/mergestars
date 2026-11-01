import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import path from 'node:path';
import React,{createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import ts from 'typescript';
const root=fileURLToPath(new URL('../',import.meta.url)),require=createRequire(import.meta.url);
function loader(overrides={}){
 const cache=new Map();function load(relative){const file=path.join(root,relative);if(cache.has(file))return cache.get(file).exports;const module={exports:{}};cache.set(file,module);const code=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;new Function('require','module','exports',code)(name=>{if(name in overrides)return overrides[name];if(name.startsWith('.')||name.startsWith('@/')){let target=name.startsWith('@/')?path.join(root,name.slice(2)):path.resolve(path.dirname(file),name);if(!existsSync(target))target=['.ts','.tsx','.mjs'].map(ext=>target+ext).find(existsSync);if(!target)throw Error('Missing '+name);return load(path.relative(root,target));}return require(name);},module,module.exports);return module.exports;}return load;
}
const load=loader(),domain=load('lib/house-experience.ts'),{cityHouses}=load('lib/megapolis-domain.ts'),coin=load('lib/coin-museum.ts'),health=load('lib/system-health.ts');
assert.equal(cityHouses.length,12);
for(const house of cityHouses){assert.equal(domain.houseCategoryNames[house.id].length,house.categories.length);for(const category of house.categories){assert(domain.houseCategoryLabel(house.id,category));assert(!/[\u10a0-\u10ff]/.test(domain.houseCategoryLabel(house.id,category)));assert(domain.houseTypes(house.id,category).length);const intent={experience_house_id:house.id,experience_category:category,coin_line:'GOLD',description:'QA private design concept. No real product.',material_preference:{base_filament:'PLA',precious_metal:'gold',integration:'mosaic',intended_use:'QA material intent',details:''}};assert(coin.museumDesignIntentSchema.safeParse(intent).success);const brief=coin.prepareMuseumDesignBrief(intent,'en');assert(brief.includes(house.title));assert(brief.includes('ITEMS AND CASE'));assert(brief.includes('not assigned'));assert(!/[\u10a0-\u10ff]/.test(brief));}}
assert.equal(domain.fitCategoryForHouse('jewelry',cityHouses.find(h=>h.id==='jewelry').categories[0]),'ring');assert.equal(domain.fitCategoryForHouse('fashion',cityHouses.find(h=>h.id==='fashion').categories[1]),'shoes');assert.equal(domain.fitCategoryForHouse('music',''),'none');
const raw=[{id:'qa-chess',title:'Royal chess set',description:'Silver mosaic'},{id:'qa-watch',title:'Watch case',description:'Gold'},{id:'qa-georgian',title:'ჭადრაკი',description:null}];
assert.deepEqual(domain.filterCoreExhibits(raw,'CHESS').map(x=>x.id),['qa-chess']);assert.deepEqual(domain.filterCoreExhibits(raw,'silver chess').map(x=>x.id),['qa-chess']);assert.deepEqual(domain.filterCoreExhibits(raw,'ჭადრაკი').map(x=>x.id),['qa-georgian']);assert.equal(domain.filterCoreExhibits(raw,'missing').length,0);assert.equal(raw.length,3);
assert.deepEqual(domain.museumDestination({houseId:'invented',category:'bad',query:'x'.repeat(300),mode:'PAID'}),{houseId:null,category:'',query:'x'.repeat(120),mode:'browse'});
for(const [seeds,fanout,total] of [[12000,12000,144000000],[12000,12,144000],[0,12000,0]]){const scenario=health.growthScenario(seeds,fanout);assert.equal(scenario.possibleAdditionalOrders,total);assert.equal(scenario.realOrdersCreated,0);assert.equal(scenario.guaranteed,false);}
for(const value of [-1,NaN,Infinity,.1,1000001])assert.throws(()=>health.growthScenario(value,12));
assert.equal(health.goldMassReadiness(Array(12).fill(50),400).status,'WITHIN_MASS_LIMIT');assert.equal(health.goldMassReadiness(Array(12).fill(50),401).status,'EXCEEDS_MASS_LIMIT');assert.equal(health.goldMassReadiness([50],null).status,'CALCULATION_PENDING');assert.equal(health.goldMassReadiness([null],0).status,'CALCULATION_PENDING');assert.equal(health.goldMassReadiness([-1],30).status,'VERIFICATION_REQUIRED');assert.equal(health.goldMassReadiness(Array(13).fill(1),1).status,'VERIFICATION_REQUIRED');
const sharedCatalog={data:{collections:[]},retry(){}};
const core={useCoreRead:()=>sharedCatalog,CoreCatalogBrowser:()=>null};
let states=[],cursor=0;const effects=[];
const hooks={...React,useId:()=> 'qa-house-studio',useRef:initial=>({current:initial}),useMemo:fn=>fn(),useEffect:fn=>effects.push(fn),useState(initial){const i=cursor++;if(!(i in states))states[i]=typeof initial==='function'?initial():initial;return [states[i],v=>states[i]=typeof v==='function'?v(states[i]):v];}};
const ui=loader({'react':hooks,'./core-context':core,'@/components/core-context':core,'./ui/dialog':{Dialog:'dialog',DialogContent:'div',DialogTitle:'h2',DialogDescription:'p'},'./museum-design-studio':{MuseumDesignStudio:()=>null},'./core-community':{CoreCommunity:()=>null}});
const Grand=ui('components/grand-atrium.tsx').GrandAtrium;const props={blocked:false,signedIn:true,onCity(){},onLegacy(){},onCreate(){},onPlace(){},memory:{current:domain.emptyMuseumDestination}};
function nodes(v,out=[]){if(!v||typeof v!=='object')return out;if(Array.isArray(v)){v.forEach(x=>nodes(x,out));return out;}out.push(v);nodes(v.props?.children,out);return out;}
function textOf(v){if(typeof v==='string')return v;if(Array.isArray(v))return v.map(textOf).join('');return v&&typeof v==='object'?textOf(v.props?.children):'';}
function renderGrand(){cursor=0;return Grand(props);}
let tree=renderGrand();const nav=nodes(tree).find(n=>n.type==='nav'&&n.props['aria-label']==='Choose one of the 12 House industries');assert.equal(nodes(nav).filter(n=>n.type==='button').length,12);assert(!nodes(tree).some(n=>n.type==='dialog'));nodes(nav).find(n=>n.type==='button'&&n.props['aria-label']==='Enter GAME HOUSE').props.onClick();tree=renderGrand();assert.equal(states[0],'games');assert.equal(states[1],'');assert(!nodes(tree).some(n=>n.type==='dialog'),'entering a House shows its room, not the old text dialog');const room=nodes(tree).find(n=>n.type?.name==='HouseShowroom');assert.equal(room.props.houseId,'games');const category=cityHouses.find(h=>h.id==='games').categories[0];room.props.onCategory(category);tree=renderGrand();assert.equal(states[1],category);let create=nodes(tree).find(n=>n.type==='button'&&textOf(n)==='Create new design');assert(!create.props.disabled);create.props.onClick();tree=renderGrand();const studio=nodes(tree).find(n=>n.type?.name==='MuseumDesignStudio');assert.equal(studio.props.houseId,'games');assert.equal(studio.props.category,category);assert.equal(studio.props.signedIn,true);studio.props.onBack();tree=renderGrand();assert.equal(states[3],'browse');assert(nodes(tree).some(n=>n.type?.name==='MuseumDesignStudio'),'the hidden studio stays mounted when returning to browse');
// Reopening the actual category callback retains its query; a different category clears it.
tree=renderGrand();let currentRoom=nodes(tree).find(n=>n.type?.name==='HouseShowroom');
nodes(tree).find(n=>n.type==='input'&&n.props['aria-label']==='Search actual CORE exhibit titles and descriptions').props.onChange({target:{value:'coat'}});
tree=renderGrand();nodes(tree).find(n=>n.type==='dialog').props.onOpenChange(false);
tree=renderGrand();nodes(tree).find(n=>n.type?.name==='HouseShowroom').props.onCategory(category);assert.equal(states[2],'coat');
tree=renderGrand();nodes(tree).find(n=>n.type?.name==='HouseShowroom').props.onCategory(cityHouses.find(h=>h.id==='games').categories[1]);assert.equal(states[2],'');
tree=renderGrand();assert.equal(nodes(tree).find(n=>n.type===core.CoreCatalogBrowser).props.catalogRead,sharedCatalog,'House filters and collection browser must consume one shared CORE response');
// A failed House catalog read retries the same source used by its filters.
// Recovery must display the recovered records, without a second browser fetch.
const catalogUI=loader({'react':hooks,'@/components/core-model-viewer':{CoreModelViewer:()=>null}})('components/core-context.tsx');
let catalogRetries=0;let catalogRead={error:'CORE_UNAVAILABLE',retry(){catalogRetries++;}};
const catalogProps={presentation:'vitrine',collectionSlugs:['qa-recovered'],catalogRead};
states=[];cursor=0;let effectStart=effects.length;let catalogTree=catalogUI.CoreCatalogBrowser(catalogProps);
const retryState=nodes(catalogTree).find(n=>n.type?.name==='ReadState');assert.equal(retryState.props.error,'CORE_UNAVAILABLE');retryState.props.retry();assert.equal(catalogRetries,1);
const originalFetch=globalThis.fetch;let duplicateReads=0;globalThis.fetch=async()=>{duplicateReads++;throw Error('Unexpected duplicate catalog read in isolated test');};
try{for(const effect of effects.slice(effectStart)){const cleanup=effect();if(typeof cleanup==='function')cleanup();}}finally{globalThis.fetch=originalFetch;}
assert.equal(duplicateReads,0,'a supplied catalog read must suppress a competing fetch');
catalogProps.catalogRead={data:{collections:[{id:'qa-recovered-id',slug:'qa-recovered',title:'QA recovered catalog'},{id:'qa-other-id',slug:'qa-other',title:'QA other catalog'}]},retry:catalogRead.retry};
cursor=0;catalogTree=catalogUI.CoreCatalogBrowser(catalogProps);assert(!nodes(catalogTree).some(n=>n.type?.name==='ReadState'),'a recovered response replaces the stale error');
const recoveredPicker=nodes(catalogTree).find(n=>n.type?.name==='CoreRecordPicker');assert.deepEqual(recoveredPicker.props.records.map(record=>record.id),['qa-recovered-id']);recoveredPicker.props.onSelect('qa-recovered-id');
cursor=0;catalogTree=catalogUI.CoreCatalogBrowser(catalogProps);assert.equal(nodes(catalogTree).find(n=>n.type?.name==='CoreCollectionView').props.slug,'qa-recovered');
console.log('PASS: House catalog uses one shared CORE read; error retry and recovery retain matching collection filters, suppress duplicate fetches, and open the recovered authoritative collection. Isolated contract data only.');
// The actual saved-brief client rejects foreign/unvalidated responses and keeps retry identity.
let authenticated=true;const api=loader({'cloudflare:workers':{env:{DB:{prepare:()=>({bind:()=>({first:async()=>({count:7})})})}}},'@/lib/api-guards':{apiJson:(value,status=200)=>new Response(JSON.stringify(value),{status}),requireApiIdentity:async()=>authenticated?'qa-session':null},'@/lib/core-client':{readCoreCatalog:async()=>({collections:[{brandLineId:'qa-a'},{brandLineId:'qa-a'},{brandLineId:null}]}),readCorePrices:async()=>({quote_at:null})},'@/lib/core-public-cache':{corePublicReads:{read:async(_key,fn)=>fn()}}})('app/api/health/route.ts');
let response=await api.GET();assert.equal(response.status,200);let status=health.systemHealthSchema.parse(await response.json());assert.equal(status.overall,'DEGRADED');assert.equal(status.private_briefs,7);assert.equal(status.public_catalog.collections,3);assert.equal(status.public_catalog.brand_lines,1);assert.equal(status.verified_orders,null);assert.equal(status.verified_payments,null);assert.equal(status.services.find(s=>s.id==='metal-reference').status,'DEGRADED');assert.equal(status.services.find(s=>s.id==='generation').status,'SETUP_REQUIRED');assert(!JSON.stringify(status).includes('qa-session'));authenticated=false;assert.equal((await api.GET()).status,401);
// The image remains an image, external creation stays fail-closed, and no browser E2E is claimed.
const citySource=readFileSync(path.join(root,'components/megapolis.tsx'),'utf8');assert(citySource.includes("useState<'photo'|'spatial'>('photo')"));assert(citySource.includes('createMegapolisRenderer(element,buildings'));assert(citySource.includes('onIndustry(building.houseId)'));
const studioSource=readFileSync(path.join(root,'components/museum-design-studio.tsx'),'utf8');assert(studioSource.includes('language="en"'));assert(studioSource.includes('Generate 3D + register order · connection required'));
const inspector=readFileSync(path.join(root,'components/local-model-inspector.tsx'),'utf8');assert(inspector.includes('inspectCoreGLB(bytes)'));assert(inspector.includes('crypto.subtle.digest'));assert(!/fetch\(|localStorage|method:\s*['"]POST/.test(inspector));
console.log('PASS: all 12 Houses/category labels and valid scoped briefs; real-item search; invalid navigation rejection; contextual Grand Museum callbacks, preserved studio and explicit category selection; Gold items+case mass boundaries; honest growth arithmetic; authenticated real-health schema and unavailable service boundaries; local model import privacy. Browser/GPU and real CORE writes NOT RUN.');
// Execute the existing private-brief store SQL in an isolated in-memory SQLite DB.
// This is API/storage contract coverage, not a deployed Cloudflare D1 or CORE pass.
const {DatabaseSync}=await import('node:sqlite');
const sqlite=new DatabaseSync(':memory:');sqlite.exec(readFileSync(path.join(root,'drizzle/0001_happy_guardian.sql'),'utf8').replaceAll('--> statement-breakpoint',''));
const db={prepare(sql){let parameters=[];const statement=sqlite.prepare(sql);const result={bind(...values){parameters=values;return result;},async run(){statement.run(...parameters);return {success:true};},async first(){return statement.get(...parameters)??null;},async all(){return {results:statement.all(...parameters)};}};return result;}};
let currentUser='qa-owner-a';
const storageLoader=loader({'cloudflare:workers':{env:{DB:db}},'@/app/chatgpt-auth':{getChatGPTUser:async()=>currentUser?{userId:currentUser}:null}});
const routes=storageLoader('app/api/atelier/route.ts');
const qaIntent={experience_house_id:'games',experience_category:cityHouses.find(h=>h.id==='games').categories[0],coin_line:'SILVER',description:'QA isolated chess concept, never a CORE product.',material_preference:{base_filament:'PLA',precious_metal:'silver',integration:'mosaic',intended_use:'QA game pieces',details:''}};
const requestId=crypto.randomUUID();
function post(payload,origin='https://private.example'){return routes.POST(new Request('https://private.example/api/atelier',{method:'POST',headers:{'content-type':'application/json',origin},body:JSON.stringify(payload)}));}
let saved=await post({request_id:requestId,intent:qaIntent});assert.equal(saved.status,201);const first=(await saved.json()).draft;assert.equal(first.status,'CONCEPT');assert.equal(first.core_product_id,null);assert.equal(first.core_house_id,null);assert.equal(first.generation_status,'DEPENDENCY_REQUIRED');
let replay=await post({request_id:requestId,intent:qaIntent});assert.equal(replay.status,200);let replayed=await replay.json();assert.equal(replayed.draft.id,first.id);assert.equal(replayed.replayed,true);
assert.equal((await post({request_id:requestId,intent:{...qaIntent,description:'Changed QA payload, conflict expected.'}})).status,409);
assert.equal((await post({request_id:crypto.randomUUID(),intent:qaIntent},'https://other.example')).status,403);
assert.equal((await post({request_id:crypto.randomUUID(),intent:{...qaIntent,core_product_id:'forged'}})).status,400);
currentUser='qa-owner-b';saved=await post({request_id:requestId,intent:qaIntent});assert.equal(saved.status,201);assert.notEqual((await saved.json()).draft.id,first.id);
let own=await (await routes.GET()).json();assert.equal(own.drafts.length,1);assert(!own.drafts.some(d=>d.id===first.id));
currentUser='qa-owner-a';own=await (await routes.GET()).json();assert.equal(own.drafts.length,1);assert.equal(own.drafts[0].id,first.id);
for(let i=1;i<100;i++)assert.equal((await post({request_id:crypto.randomUUID(),intent:{...qaIntent,description:'QA isolated brief '+i+'; not a CORE order.'}})).status,201);
assert.equal((await post({request_id:crypto.randomUUID(),intent:qaIntent})).status,409);assert.equal((await post({request_id:requestId,intent:qaIntent})).status,200,'replay remains available at the experience limit');
currentUser=null;assert.equal((await routes.GET()).status,401);assert.equal((await post({request_id:requestId,intent:qaIntent})).status,401);
sqlite.close();
console.log('PASS: actual private-brief API and store SQL against isolated SQLite: authenticated server save/read, per-owner isolation, strict schema/CSRF rejection, idempotent retry, conflict and bounded storage; no CORE product/order/payment created.');
