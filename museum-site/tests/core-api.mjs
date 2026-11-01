import assert from 'node:assert/strict';
import { coreDependencies } from '../lib/core-contract.ts';
const base=process.argv[2];
if(!base||!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base)) throw new Error('Explicit local Worker origin required');
async function call(path,headers={}){
  const result=await fetch(base+path,{headers,signal:AbortSignal.timeout(12000)}).catch(error=>{throw new Error(`Local request timed out or failed: ${path}`,{cause:error});});
  assert(result.headers.get('cache-control')?.includes('no-store'));
  assert(result.headers.get('content-type')?.includes('application/json'));
  return {status:result.status,body:await result.json()};
}
assert.equal((await call('/api/system')).status,401);
const system=await call('/api/system',{'oai-authenticated-user-id':'qa-core-system','oai-authenticated-user-email':'qa-core-system@sites.test'});
assert.equal(system.status,200);assert.equal(system.body.shared_session_connected,false);assert.equal(system.body.unavailable_capabilities.length,coreDependencies.length);
assert.equal((await call('/api/core/identity')).status,401);
assert.equal((await call('/api/core/collection?slug=..%2Fusers')).status,400);
assert.equal((await call('/api/core/unknown')).status,404);
for(const operation of coreDependencies){const denied=await call(`/api/core/${operation}`);assert.equal(denied.status,503);assert.equal(denied.body.available,false);assert.equal(denied.body.source_of_truth,'MERGE_CORE');}
console.log('PASS: local Worker identity boundary, malformed IDs, unknown operations, system status and all unavailable CORE capabilities denied.');
if(process.argv[3]==='--boundaries') process.exit(0);
const [catalog,prices]=await Promise.all([call('/api/core/catalog'),call('/api/core/prices')]);
assert.equal(catalog.status,200,`Live CORE catalog read failed: ${JSON.stringify(catalog.body)}`);
assert.equal(prices.status,200,`Live CORE metal reference read failed: ${JSON.stringify(prices.body)}`);
assert.equal(catalog.body.source_origin,'https://mergestars.com');assert.equal(prices.body.verified_offer,false);assert.equal(prices.body.quote_at,null);
let total=0;
await Promise.all(catalog.body.collections.map(async(record)=>{
  for(const privateField of ['userId','email','logoUrl','avatarUrl']) assert(!(privateField in record));
  const detail=await call(`/api/core/collection?slug=${encodeURIComponent(record.slug)}`);
  assert.equal(detail.status,200);assert.equal(detail.body.collection.id,record.id);
  for(const item of detail.body.items){assert.equal(item.source.entity_id,item.id);assert.equal(item.source.collection_id,record.id);assert.equal(item.source.source_revision,null);assert.equal(item.rights_state,'UNAVAILABLE');assert.equal(item.verification_state,'UNAVAILABLE');}
  total+=detail.body.items.length;
}));
console.log(`PASS: local Worker -> real CORE, ${catalog.body.collections.length} public collections, ${total} items, ${prices.body.prices.length} metal references; shared identity missing and unsupported actions denied.`);
