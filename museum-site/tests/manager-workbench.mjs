import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {randomUUID,webcrypto} from 'node:crypto';
import ts from 'typescript';
const root=fileURLToPath(new URL('../',import.meta.url)),require=createRequire(import.meta.url);
function loader(overrides={}){const cache=new Map();function load(relative){const file=path.join(root,relative);if(cache.has(file))return cache.get(file).exports;const module={exports:{}};cache.set(file,module);const code=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;new Function('require','module','exports',code)(name=>{if(Object.hasOwn(overrides,name))return overrides[name];if(name.startsWith('.')||name.startsWith('@/')){let target=name.startsWith('@/')?path.join(root,name.slice(2)):path.resolve(path.dirname(file),name);if(!existsSync(target))target=['.ts','.tsx'].map(ext=>target+ext).find(existsSync);if(!target)throw Error('Missing '+name);return load(path.relative(root,target));}return require(name);},module,module.exports);return module.exports;}return load;}
const load=loader(),contract=load('lib/ai-manager-contract.ts'),service=load('lib/ai-manager-service.ts');
const cryptoDescriptor=Object.getOwnPropertyDescriptor(globalThis,'crypto');
try{Object.defineProperty(globalThis,'crypto',{configurable:true,value:{getRandomValues:webcrypto.getRandomValues.bind(webcrypto)}});const makeId=load('lib/client-request-id.ts').clientRequestId;const ids=Array.from({length:100},makeId);assert.equal(new Set(ids).size,100);assert(ids.every(id=>/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/.test(id)));}finally{if(cryptoDescriptor)Object.defineProperty(globalThis,'crypto',cryptoDescriptor);else delete globalThis.crypto;}
const request={request_id:randomUUID(),role:'brand',message:'Prepare a collection brief',history:[],consent:true};
assert(contract.managerRequestSchema.safeParse(request).success);
for(const patch of [{consent:false},{user_id:'forged'},{house_id:'forged'},{authorized_session:true},{OPENAI_API_KEY:'not-allowed'},{role:'admin'},{message:' '},{message:'x'.repeat(4001)},{history:Array(9).fill({role:'user',content:'x'})},{history:Array(5).fill({role:'user',content:'x'.repeat(5000)})},{image:'data:image/png;base64,YQ=='}])assert(!contract.managerRequestSchema.safeParse({...request,...patch}).success,Object.keys(patch).join());
assert(contract.managerRequestSchema.safeParse({...request,role:'vision',image:'data:image/png;base64,YQ=='}).success);
assert.equal(service.managerAvailability({}).status,'CONFIGURATION_REQUIRED');
assert(service.managerAvailability({MERGE_AI_DEFAULT_PROVIDER:'__proto__',OPENAI_API_KEY:'fixture-secret',OPENAI_MODEL:'fixture-model'}).roles.every(r=>!r.available));
const response=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json'}});
const fixtures={openai:{output:[{content:[{type:'output_text',text:'An editable fixture draft.'}]}]},anthropic:{content:[{type:'text',text:'An editable fixture draft.'}]},gemini:{candidates:[{content:{parts:[{text:'An editable fixture draft.'}]}}]}};
const endpoints={openai:'https://api.openai.com/v1/responses',anthropic:'https://api.anthropic.com/v1/messages',gemini:'https://generativelanguage.googleapis.com/v1beta/models/fixture-model:generateContent'};
for(const provider of Object.keys(fixtures)){
 const prefix=provider.toUpperCase(),env={MERGE_AI_DEFAULT_PROVIDER:provider,[prefix+'_API_KEY']:'fixture-secret',[prefix+'_MODEL']:'fixture-model'};
 const ready=service.managerAvailability(env);assert.equal(ready.status,'READY_TO_REQUEST');assert(!JSON.stringify(ready).includes('fixture-secret'));assert(!JSON.stringify(ready).includes('fixture-model'));
 for(const role of ['brand','vision']){
  const input=contract.managerRequestSchema.parse({...request,role,...(role==='vision'?{image:'data:image/png;base64,YQ=='}:{})});let sent;
  const result=await service.answerManager(input,env,async(url,options)=>{assert.equal(url,endpoints[provider]);assert.equal(options.method,'POST');assert.equal(options.redirect,'error');assert(options.signal instanceof AbortSignal);sent=JSON.parse(options.body);return response(fixtures[provider]);});
  assert(contract.managerResponseSchema.safeParse(result).success);assert.equal(result.provider,provider);assert.equal(result.reply,'An editable fixture draft.');assert.equal(result.core_record_created,false);assert.equal(result.external_action_executed,false);
  if(provider==='openai')assert.equal(sent.store,false);assert(!('tools' in sent));
  if(role==='vision')assert(JSON.stringify(sent).includes('YQ=='));
 }
}
const configured={OPENAI_API_KEY:'fixture-secret',OPENAI_MODEL:'fixture-model'};
const fails=(fn,code)=>assert.rejects(fn,e=>e instanceof service.ManagerServiceError&&e.code===code);
await fails(()=>service.answerManager(request,{},async()=>{throw Error('should not call');}),'AI_CONFIGURATION_REQUIRED');
for(const [status,code]of [[401,'AI_PROVIDER_AUTH_REQUIRED'],[403,'AI_PROVIDER_AUTH_REQUIRED'],[429,'AI_RATE_LIMITED'],[500,'AI_PROVIDER_UNAVAILABLE']])await fails(()=>service.answerManager(request,configured,async()=>response({secret:'must not leak'},status)),code);
await fails(()=>service.answerManager(request,configured,async()=>new Response('not JSON',{headers:{'content-type':'text/plain'}})),'AI_INVALID_RESPONSE');
await fails(()=>service.answerManager(request,configured,async()=>new Response('{broken',{headers:{'content-type':'application/json'}})),'AI_INVALID_RESPONSE');
await fails(()=>service.answerManager(request,configured,async()=>response({output:[]})),'AI_INVALID_RESPONSE');
await fails(()=>service.answerManager(request,configured,async()=>response({output:[{content:[{type:'output_text',text:'x'.repeat(16001)}]}]})),'AI_INVALID_RESPONSE');
await fails(()=>service.answerManager(request,configured,async()=>response({text:'x'.repeat(1048577)})),'AI_RESPONSE_TOO_LARGE');
await fails(()=>service.answerManager(request,configured,async()=>{throw Error('fixture-secret');}),'AI_PROVIDER_UNAVAILABLE');
// Real guards and route logic, isolated provider fixture: no network or billing.
let owner=null,calls=0;
// Return the exact response contract, without any input-only keys.
const providerOverride={...service,answerManager:async input=>{calls++;return {request_id:input.request_id,role:input.role,reply:'Fixture reply',provider:'openai',status:'ANSWERED',external_action_executed:false,core_record_created:false};}};
const api=loader({'cloudflare:workers':{env:{}},'@/app/chatgpt-auth':{getChatGPTUser:async()=>owner?{userId:owner}:null},'@/lib/ai-manager-service':providerOverride})('app/api/ai-manager/route.ts');
const post=(body=request,origin='https://qa.merge.test')=>api.POST(new Request('https://qa.merge.test/api/ai-manager',{method:'POST',headers:{'Content-Type':'application/json',...(origin?{Origin:origin}:{})},body:JSON.stringify(body)}));
assert.equal((await post()).status,401);assert.equal(calls,0);owner='fixture-owner-a';assert.equal((await post(request,'https://other.test')).status,403);assert.equal((await post(request,null)).status,403);assert.equal((await post({...request,core_user_id:'forged'})).status,400);assert.equal(calls,0);
let [first,replay]=await Promise.all([post(),post()]);assert.equal(first.status,200);assert.equal(replay.status,200);assert.deepEqual(await first.json(),await replay.json());assert.equal(calls,1,'same in-isolate request reuses one provider call');
assert.equal((await post({...request,message:'Changed'})).status,409);assert.equal(calls,1);
owner='fixture-owner-b';assert.equal((await post()).status,200);assert.equal(calls,2,'another owner cannot receive the first owner cached response');
for(let i=0;i<7;i++)assert.equal((await post({...request,request_id:randomUUID()})).status,200);assert.equal((await post({...request,request_id:randomUUID()})).status,429);
assert.equal((await api.GET()).headers.get('cache-control'),'private, no-store');
const work=load('lib/brand-manager-workbench.ts'),brief={brand_name:'QA Brand',description:'A real user supplied collection direction.',channels:['youtube'],registration_mode:'SELF',industry:'Fashion',email_setup:'EXISTING',content_language:'English',tone:'Refined & editorial',deliverables:['Product captions']};
for(const kind of work.workKinds.filter(k=>k!=='AI response')){const text=work.prepareBrandWork(brief,kind);assert(text.includes('not an AI answer'));assert(text.includes(brief.brand_name));}
assert.equal(work.prepareBrandWork({...brief,authorized_session:true},'Strategy'),null);
const posts=work.preparePostDrafts(brief);assert.equal(posts.length,12);assert.equal(new Set(posts.map(p=>p.title)).size,12);assert(posts.every(p=>p.review==='DRAFT'&&p.body.includes('not AI-generated')));
const item={...posts[0],local_id:randomUUID(),date:'2026-10-20'};
const bundle={kind:'MERGE_PRIVATE_BRAND_WORKSPACE',version:1,brief,items:[item]};assert(work.brandWorkspaceSchema.safeParse(bundle).success);
for(const patch of [{items:[item,item]},{user_id:'forged'},{items:[{...item,order_id:'forged'}]},{items:[{...item,date:'2026-02-30'}]},{items:[{...item,review:'VERIFIED'}]}])assert(!work.brandWorkspaceSchema.safeParse({...bundle,...patch}).success);
const ics=work.calendarICS([{...item,title:'Review, private;\nNew line',body:'Gold; silver,\n'+('🎨'.repeat(90))}]);
assert(ics.includes('STATUS:TENTATIVE'));assert(ics.includes('DTSTART;VALUE=DATE:20261020'));assert(ics.includes('Review\\, private\\;\\nNew line'));assert(!ics.includes('\nNew line\r\n'));assert(ics.split('\r\n').every(line=>Buffer.byteLength(line)<=73));
const config=load('lib/product-studio-configuration.ts');
for(const house of ['watches','jewelry','fashion','mosaic','games','music','robotics','nature','eyewear','interior','art','mobility']){
 const fields=config.productConfigurationFields(house),values=Object.fromEntries(fields.map(f=>[f.id,f.options?.[0]??'User preference']));
 const next=config.applyProductConfiguration(house,'Original source brief.',values);assert(next.startsWith('Original source brief.'));assert.deepEqual(config.readProductConfiguration(house,next),values);
 const again=config.applyProductConfiguration(house,next,{palette:'Black, gold and silver'});assert.equal(again.split('[Configuration preferences]').length,2);assert(again.startsWith('Original source brief.'));assert.equal(config.readProductConfiguration(house,again).palette,'Black, gold and silver');
 assert.equal(config.applyProductConfiguration(house,'',{unknown:'value'}),null);assert.equal(config.applyProductConfiguration(house,'',{mosaic:'invented'}),null);assert.equal(config.applyProductConfiguration(house,'',{palette:'line1\nline2'}),null);assert.equal(config.applyProductConfiguration(house,'x'.repeat(3000),{palette:'Gold'}),null);
}
console.log('PASS: strict AI authority/consent boundaries; fixed provider adapters and sanitized failures; authenticated same-origin route, in-isolate replay/conflict/owner/rate gates; real editable draft/backup/calendar contracts; all 12 House configurations round-trip without changing source records. All external responses are explicit test fixtures; live provider E2E BLOCKED by configuration.');
