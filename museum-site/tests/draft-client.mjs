import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

// Synthetic local contract fixtures. No CORE data, accounts or rights are created.
const compile = source => ts.transpileModule(source, {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
const dataUrl = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const zodUrl = new URL('../node_modules/zod/index.js',import.meta.url).href;
const contract = compile(await readFile(new URL('../lib/draft-contract.ts',import.meta.url),'utf8'))
  .replace('from "zod"',`from ${JSON.stringify(zodUrl)}`)
  .replace('from "./museum-domain"',`from ${JSON.stringify(new URL('../lib/museum-domain.ts',import.meta.url).href)}`);
const clientSource = compile(await readFile(new URL('../lib/draft-client.ts',import.meta.url),'utf8'))
  .replace('from "zod"',`from ${JSON.stringify(zodUrl)}`)
  .replace('from "./draft-contract"',`from ${JSON.stringify(dataUrl(contract))}`);
const {loadDesignDrafts,saveDesignDraft} = await import(dataUrl(clientSource));
const input = {source_reference_id:'MERGE-EYE-001',parent_draft_id:null,request_id:'10000000-0000-4000-8000-000000000001',config:{material:'silver',scale:'fine',name:'MERGE test'}};
const draft = {draft_id:'20000000-0000-4000-8000-000000000001',root_reference_id:input.source_reference_id,source_reference_id:input.source_reference_id,parent_draft_id:null,name:input.config.name,config:input.config,status:'CONCEPT',core_product_id:null,core_house_id:null,generation_status:'NOT_YET_IMPLEMENTED',created_at:'2026-10-06T10:00:00.000Z'};
const response=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json'}});
const list=()=>response({drafts:[draft],scope:'EXPERIENCE_DRAFTS',core_connected:false});
const rejects=(call,code)=>assert.rejects(call,error=>error.code===code);
assert.deepEqual(await loadDesignDrafts(async(path,options)=>{
  assert.equal(path,'/api/designs');assert.equal(options.method,'GET');assert.equal(options.credentials,'same-origin');
  assert.equal(options.redirect,'error');assert.equal(options.cache,'no-store');assert.equal(options.body,undefined);
  return list();
}),[draft]);
assert.deepEqual(await saveDesignDraft(input,async(path,options)=>{
  assert.equal(path,'/api/designs');assert.equal(options.method,'POST');assert.deepEqual(JSON.parse(options.body),input);
  assert.equal(options.headers['Content-Type'],'application/json');return response({draft,replayed:false},201);
}),draft);
for(const change of [{status:'VERIFIED'},{core_product_id:'fake'},{core_house_id:'fake'},{generation_status:'READY'},{root_reference_id:'MERGE-CASE-001'},{parent_draft_id:draft.draft_id},{config:{...input.config,scale:'medium'}},{owner_id:'other'}]) {
  await rejects(()=>loadDesignDrafts(async()=>response({drafts:[{...draft,...change}],scope:'EXPERIENCE_DRAFTS',core_connected:false})),'DRAFT_RESPONSE_INVALID');
}
await rejects(()=>loadDesignDrafts(async()=>response({drafts:[draft,draft],scope:'EXPERIENCE_DRAFTS',core_connected:false})),'DRAFT_RESPONSE_INVALID');
await rejects(()=>loadDesignDrafts(async()=>response({drafts:[draft],scope:'MERGE_CORE',core_connected:true})),'DRAFT_RESPONSE_INVALID');
await rejects(()=>saveDesignDraft(input,async()=>response({draft:{...draft,config:{...input.config,material:'gold'}},replayed:false})),'DRAFT_RESPONSE_INVALID');
await rejects(()=>saveDesignDraft(input,async()=>response({draft:{...draft,parent_draft_id:'30000000-0000-4000-8000-000000000001'},replayed:false})),'DRAFT_RESPONSE_INVALID');
await rejects(()=>loadDesignDrafts(async()=>response({},401)),'AUTH_REQUIRED');
await rejects(()=>saveDesignDraft(input,async()=>response({error:'IDEMPOTENCY_CONFLICT'},409)),'IDEMPOTENCY_CONFLICT');
await rejects(()=>saveDesignDraft(input,async()=>response({error:'<script>private failure</script>'},500)),'DRAFT_STORAGE_UNAVAILABLE');
await rejects(()=>loadDesignDrafts(async()=>new Response('<html>sign in</html>',{headers:{'content-type':'text/html'}})),'DRAFT_RESPONSE_INVALID');
await rejects(()=>loadDesignDrafts(async()=>new Response('{bad',{headers:{'content-type':'application/json'}})),'DRAFT_RESPONSE_INVALID');
await rejects(()=>loadDesignDrafts(async()=>response({value:'x'.repeat(512*1024)})),'DRAFT_RESPONSE_INVALID');
let writes=0;const requestIds=[];
const lostResponse=async(_,options)=>{writes++;requestIds.push(JSON.parse(options.body).request_id);throw new TypeError('Response lost after server commit');};
await rejects(()=>saveDesignDraft(input,lostResponse),'DRAFT_STORAGE_UNAVAILABLE');assert.equal(writes,1,'No blind mutation retry');
const replay=await saveDesignDraft(input,async(_,options)=>{writes++;requestIds.push(JSON.parse(options.body).request_id);return response({draft,replayed:true});});
assert.equal(replay.draft_id,draft.draft_id);assert.equal(writes,2);assert.deepEqual(requestIds,[input.request_id,input.request_id]);
await rejects(()=>saveDesignDraft(input,async()=>response({draft:{...draft,config:{...draft.config,material_preference:{base_filament:'PLA',precious_metal:'gold',integration:'mosaic',intended_use:'unexpected change',details:''}}},replayed:false})),'DRAFT_RESPONSE_INVALID');
const originalSetTimeout=globalThis.setTimeout;
try {
  // Accelerate only the production timeout in this isolated test process.
  globalThis.setTimeout=(callback,ms,...args)=>originalSetTimeout(callback,ms===12000?20:ms,...args);
  await rejects(()=>loadDesignDrafts(async(_,options)=>new Promise((_,reject)=>options.signal.addEventListener('abort',()=>reject(new Error('aborted')),{once:true}))),'DRAFT_TIMEOUT');
  await rejects(()=>loadDesignDrafts(async(_,options)=>new Response(new ReadableStream({start(controller){options.signal.addEventListener('abort',()=>controller.error(new Error('body aborted')),{once:true});}}),{headers:{'content-type':'application/json'}})),'DRAFT_TIMEOUT');
} finally {globalThis.setTimeout=originalSetTimeout;}
assert.deepEqual(await loadDesignDrafts(async()=>list()),[draft],'Requests recover after timeout');
console.log('PASS: bounded draft transport, honest CONCEPT validation, source/parent integrity, duplicate rejection, timeout recovery, no blind writes and stable manual replay.');
