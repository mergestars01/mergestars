import assert from 'node:assert/strict';
import { createCorePublicCache } from '../lib/core-public-cache.ts';
import { createMuseumFrameLoop } from '../lib/museum-frame-loop.ts';

// Local synthetic concurrency tests, not a hosted traffic/staging claim.
let now=0, reads=0, release;
const cache=createCorePublicCache(()=>now,3,2,256);
const load=()=>{reads++;return new Promise(resolve=>{release=()=>resolve({source_of_truth:'MERGE_CORE',test_only:true});});};
const requests=Array.from({length:200},()=>cache.read('catalog',load,20));
await Promise.resolve();assert.equal(reads,1);assert.equal(cache.stats().inflight,1);release();
const results=await Promise.all(requests);assert(results.every(value=>value===results[0]));assert.equal(cache.stats().inflight,0);
await cache.read('catalog',load,20);assert.equal(reads,1);
now=21;await assert.rejects(()=>cache.read('catalog',async()=>{throw Error('CORE_UNAVAILABLE');},20));assert.equal(cache.stats().entries,0,'Expired data must not silently mask failure');
await assert.rejects(()=>cache.read('identity:user',load,20));await assert.rejects(()=>cache.read('collection:../users',load,20));
const a=cache.read('collection:a',async()=>new Promise(resolve=>setTimeout(()=>resolve({a:true}),10)),20);
const b=cache.read('collection:b',async()=>new Promise(resolve=>setTimeout(()=>resolve({b:true}),10)),20);
await assert.rejects(()=>cache.read('collection:c',async()=>({c:true}),20),error=>error.status===429);
await Promise.all([a,b]);
for(let i=0;i<30;i++)await cache.read('collection:item-'+i,async()=>({value:'x'.repeat(80)}),20);
assert(cache.stats().entries<=3);assert(cache.stats().bytes<=256);assert.equal(cache.stats().inflight,0);
let prices=0;await cache.read('prices',async()=>({value:++prices}),999);await cache.read('prices',async()=>({value:++prices}),999);assert.equal(prices,2,'Material prices are never retained');

let id=0,calls=0,animate=false;const queued=new Map();
const loop=createMuseumFrameLoop(()=>{calls++;return animate;},callback=>{queued.set(++id,callback);return id;},n=>queued.delete(n));
loop.invalidate();loop.invalidate();assert.equal(queued.size,1,'Changes share one frame');
const flush=t=>{const batch=[...queued];queued.clear();for(const[,callback]of batch)callback(t);};
flush(0);assert.equal(calls,1);assert.equal(queued.size,0,'An idle Museum has no next GPU frame');
for(let i=1;i<100;i++)flush(i*16);assert.equal(calls,1);
animate=true;loop.invalidate();flush(1600);flush(1632);assert.equal(calls,3);assert.equal(queued.size,1);
animate=false;flush(1664);assert.equal(queued.size,0);loop.invalidate();loop.dispose();assert.equal(queued.size,0);loop.invalidate();assert.equal(queued.size,0);
console.log('PASS: 200 concurrent synthetic reads share one validated source request; expiry fails closed; identities rejected; bounded cache/inflight/memory; no stored price; idle GPU loop stops and animation resumes. Hosted visitor capacity remains unverified.');
