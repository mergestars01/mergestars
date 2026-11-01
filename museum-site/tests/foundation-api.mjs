import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import http from 'node:http';
import { museumVisuals } from '../lib/museum-visuals.ts';

const base = process.argv[2];
if (!base || !/^http:\/\/(terminal\.local|127\.0\.0\.1|localhost):\d+$/.test(base)) throw new Error('Explicit local preview origin required');
const alice = `qa-alice-${randomUUID()}`, bob = `qa-bob-${randomUUID()}`;
// Fresh local sockets avoid the reproduced Node fetch/Wrangler pooled-connection
// stall after rejected request bodies. Keep the same requests, timeout and
// response assertions; production authentication and routes are unchanged.
function localFetch(url, options={}) {
  if (new URL(url).origin !== base) throw new Error('Local API test origin required');
  return new Promise((resolve,reject) => {
    const request=http.request(url,{agent:false,method:options.method ?? 'GET',headers:options.headers,signal:options.signal ?? AbortSignal.timeout(12000)},response => {
      const chunks=[];
      response.on('data',chunk => chunks.push(chunk));
      response.on('error',reject);
      response.on('end',() => resolve(new Response(Buffer.concat(chunks),{status:response.statusCode,headers:new Headers(Object.entries(response.headers).flatMap(([key,value]) => Array.isArray(value) ? value.map(item => [key,item]) : value === undefined ? [] : [[key,value]]))})));
    });
    request.on('error',reject);
    request.end(options.body);
  });
}
async function call(path, {user=alice, method='GET', payload, origin=base, rawBody, headers:extra={}} = {}) {
  const headers = { connection:'close', ...(user ? {'oai-authenticated-user-id':user,'oai-authenticated-user-email':`${user}@sites.test`} : {}), ...extra };
  if (method !== 'GET') { headers['content-type']='application/json'; if(origin) headers.origin=origin; }
  const options={method,headers,signal:AbortSignal.timeout(12000),body:rawBody ?? (payload ? JSON.stringify(payload) : undefined)};
  for(let attempt=0;attempt<2;attempt++){
    const response=await localFetch(base+path,options).catch(error=>{throw new Error(`${method} ${path}: request failed`,{cause:error});});
    const text=await response.text();
    if(text.startsWith('Your worker restarted mid-request.')&&attempt===0) continue;
    assert(response.headers.get('content-type')?.includes('application/json'), `${method} ${path}: ${response.status} ${text.slice(0,150)}`);
    return {status:response.status,body:JSON.parse(text),headers:response.headers};
  }
}
const atelierIntent={experience_house_id:'games',experience_category:'ჭადრაკი',coin_line:'GOLD',description:'Private QA modular chess design',material_preference:{base_filament:'PLA',precious_metal:'gold',integration:'mosaic',intended_use:'QA board game',details:''}};
// Select the current taxonomy instead of hardcoding a mutable display label.
const { cityHouses } = await import('../lib/megapolis-domain.ts');
atelierIntent.experience_category=cityHouses.find(h=>h.id==='games').categories[0];
const briefInput={request_id:randomUUID(),intent:atelierIntent};
assert.equal((await call('/api/atelier',{user:null})).status,401);
assert.equal((await call('/api/atelier',{method:'POST',payload:briefInput,origin:'https://foreign.example'})).status,403);
assert.equal((await call('/api/atelier',{method:'POST',payload:{...briefInput,owner_id:bob}})).status,400);
assert.equal((await call('/api/atelier',{method:'POST',payload:{...briefInput,intent:{...atelierIntent,payment_verified:true}}})).status,400);
assert.equal((await call('/api/atelier',{method:'POST',rawBody:'x'.repeat(21000)})).status,400);
const savedBrief=await call('/api/atelier',{method:'POST',payload:briefInput});
assert.equal(savedBrief.status,201);assert.equal(savedBrief.body.draft.status,'CONCEPT');
assert.equal(savedBrief.body.draft.generation_status,'DEPENDENCY_REQUIRED');assert.equal(savedBrief.body.draft.core_house_id,null);
const replayBrief=await call('/api/atelier',{method:'POST',payload:briefInput});
assert.equal(replayBrief.status,200);assert.equal(replayBrief.body.draft.id,savedBrief.body.draft.id);
assert.equal((await call('/api/atelier',{method:'POST',payload:{...briefInput,intent:{...atelierIntent,description:'Different QA design with same request ID'}}})).status,409);
const [concurrentA,concurrentB]=await Promise.all([call('/api/atelier',{method:'POST',payload:{...briefInput,request_id:briefInput.request_id}}),call('/api/atelier',{method:'POST',payload:briefInput})]);
assert.equal(concurrentA.body.draft.id,concurrentB.body.draft.id);
const loadedBriefs=await call('/api/atelier');assert.equal(loadedBriefs.body.drafts.length,1);assert.deepEqual(loadedBriefs.body.drafts[0].intent,atelierIntent);
assert.equal((await call('/api/atelier',{user:bob})).body.drafts.length,0);
assert.match(loadedBriefs.headers.get('cache-control'),/no-store/);
const input=()=>({source_reference_id:'MERGE-EYE-001',parent_draft_id:null,request_id:randomUUID(),config:{material:'silver',scale:'fine',name:'MERGE QA'}});
assert.equal((await call('/api/designs',{user:null})).status,401);
assert.equal((await call('/api/designs',{user:null,method:'POST',payload:input()})).status,401);
assert.equal((await call('/api/designs',{method:'POST',payload:input(),origin:'https://foreign.example'})).status,403);
assert.equal((await call('/api/designs',{method:'POST',payload:input(),origin:null})).status,403);
assert.equal((await call('/api/designs',{method:'POST',rawBody:'{bad'})).status,400);
assert.equal((await call('/api/designs',{method:'POST',rawBody:'x'.repeat(5000)})).status,400);
for(const patch of [ {owner_id:bob}, {status:'VERIFIED'}, {core_product_id:'fake'}, {source_reference_id:'unknown'}, {config:{material:'plastic',scale:'fine',name:''}}, {config:{material:'gold',scale:'medium',name:''}} ]) {
  assert.equal((await call('/api/designs',{method:'POST',payload:{...input(),...patch}})).status,400);
}
const body=input();
const created=await call('/api/designs',{method:'POST',payload:body});
assert.equal(created.status,201);assert.equal(created.body.draft.status,'CONCEPT');
assert.equal(created.body.draft.core_product_id,null);assert.equal(created.body.draft.core_house_id,null);
assert.equal(created.body.draft.generation_status,'NOT_YET_IMPLEMENTED');
assert(created.headers.get('cache-control').includes('no-store'));
const id=created.body.draft.draft_id;
const replay=await call('/api/designs',{method:'POST',payload:body});
assert.equal(replay.status,200);assert.equal(replay.body.draft.draft_id,id);assert.equal(replay.body.replayed,true);
const conflict=await call('/api/designs',{method:'POST',payload:{...body,config:{...body.config,name:'different'}}});
assert.equal(conflict.status,409);
const list=await call('/api/designs');assert.equal(list.body.drafts.length,1);assert.equal(list.body.drafts[0].draft_id,id);
const separate=await call('/api/designs',{user:bob});assert.equal(separate.body.drafts.length,0);
assert.equal((await call('/api/designs',{user:bob,method:'POST',payload:{...input(),parent_draft_id:id}})).status,400);
assert.equal((await call('/api/designs',{method:'POST',payload:{...input(),source_reference_id:'MERGE-CASE-001',parent_draft_id:id}})).status,400);
const child=await call('/api/designs',{method:'POST',payload:{...input(),parent_draft_id:id,config:{material:'gold',scale:'fine',name:'Second version'}}});
assert.equal(child.status,201);assert.equal(child.body.draft.parent_draft_id,id);assert.notEqual(child.body.draft.draft_id,id);
const after=await call('/api/designs');assert.equal(after.body.drafts.find(x=>x.draft_id===id).config.material,'silver');
const concurrentBody=input();
const concurrent=await Promise.all(Array.from({length:5},()=>call('/api/designs',{method:'POST',payload:concurrentBody})));
assert(concurrent.every(x=>[200,201].includes(x.status)));assert.equal(new Set(concurrent.map(x=>x.body.draft.draft_id)).size,1);
assert.equal((await call('/api/designs')).body.drafts.length,3);
for(const operation of ['orders','verify','payments','production','generate','passport']) {
  const blocked=await call(`/api/core/${operation}`,{method:'POST',payload:{status:'VERIFIED',checks:[true,true,true],payment_verified:true}});
  assert.equal(blocked.status,503);assert.equal(blocked.body.error,'CORE_NOT_CONNECTED');
  for(const key of ['order_created','payment_verified','production_authorized','model_generated','passport_verified']) assert.equal(blocked.body[key],false);
}
const system=await call('/api/system');assert.equal(system.status,200);assert.equal(system.body.core_connected,false);assert.equal(system.body.real_orders_enabled,false);
const invalidModel=await call('/api/core/model?id=not-a-core-uuid');assert.equal(invalidModel.status,400);assert.equal(invalidModel.body.error,'INVALID_CORE_ITEM');
console.log('PASS: API ownership, persistence, lineage, idempotency, validation and closed CORE gates.');
const page=await localFetch(base+'/',{signal:AbortSignal.timeout(12000),headers:{'oai-authenticated-user-id':alice,'oai-authenticated-user-email':`${alice}@sites.test`}});
assert.equal(page.status,200);console.log('SSR response status', page.status);const html=await page.text();assert(html.includes('Living'));assert(html.includes('/assets/official-company-logo.svg'));
assert(html.includes('Gold / Silver'));
assert(html.includes('class="gate-portal"')&&html.includes('გახსენი კარი და შედი MERGE-ის მეგაპოლისში'),'Canonical door must be an actual entry button');
assert(html.includes('data-door-state="CLOSED"')&&html.includes('/assets/official-aurum-argentum.png'),'First rendered entrance has closed leaves');
const transparency=await localFetch(base+'/transparency');assert.equal(transparency.status,200);
const policyHtml=await transparency.text();
for(const copy of ['Silver Line','Gold Line','ვერცხლის LIVE კურსი','ოქროს LIVE კურსი','price snapshot','პირველი 1,000','რეგისტრირებული ≠ შეკვეთილი ≠ გადახდილი'])assert(policyHtml.includes(copy),`Entry/payment law missing: ${copy}`);
assert.equal((policyHtml.slice(policyHtml.indexOf('class="transparency-questions"')).match(/<details\b/g)||[]).length,7,'All existing financial disclosure accordions remain');
for(const copy of ['GOLD COIN CASE = 12 PRODUCTS','SILVER COIN CASE = 1 PRODUCT','გადახდა ნებაყოფლობითია','AVAILABLE','CORE-ის დაკავშირების მოლოდინში']) assert(policyHtml.includes(copy),`Item/commission disclosure missing: ${copy}`);
for(const copy of ['1 GOLD COIN = 12 BRAND LINES','1 SILVER COIN = 12 BRAND LINES','1,000 გ'])assert(policyHtml.includes(copy),'Distinct commercial package policy missing: '+copy);
assert.equal((policyHtml.match(/data-planning-slot=/g)||[]).length,24,'Both lines have twelve specification placeholders, not fabricated confirmed records');
for(const copy of ['16.5%','ფიზიკური მეგაპოლისის სამშენებლო ფონდი','GOLD და SILVER-ის ერთიანი განაწილება']) assert(policyHtml.includes(copy),`Allocation disclosure missing: ${copy}`);
assert(!/<form\b|<input\b|payment_reference=|checkout_session=/i.test(policyHtml),'Read-only payment requirements cannot collect money or fabricate payment evidence');
for(const asset of ['official-company-logo.svg','official-aurum-argentum.png','merge-mark.png','merge-wordmark.png','entrance.png','entrance-closed.png','entrance-dual-closed.png','optimized/entrance-closed.webp','optimized/entrance-dual-closed.webp','eyewear.png','coin-case.png','entrance-dual.png','coin-reference.png','museum-world.png','museum-coin-world.png','approved-mega-museum.png',...museumVisuals.map(photo=>photo.image.slice('/assets/'.length))]) { const response=await localFetch(`${base}/assets/${asset}`);assert.equal(response.status,200);assert(response.headers.get('content-type').startsWith('image/')); }
console.log('PASS: authentication, CSRF/origin checks, bounded body, strict design validation, durable reload, account isolation, immutable parent lineage, idempotent/concurrent saves, all commerce/generation gates fail closed, SSR and assets.');
console.log(JSON.stringify({qaOwnerId:alice,expectedDrafts:3}));
