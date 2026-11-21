// Real routes and store; disposable SQLite plus a deterministic CORE transport.
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {dirname,resolve} from 'node:path';
import ts from 'typescript';
const require=createRequire(import.meta.url),root=resolve(import.meta.dirname,'..');
const db=new DatabaseSync(':memory:');db.exec('PRAGMA foreign_keys=ON');
db.exec(readFileSync(resolve(root,'drizzle/0003_life_cycle_drafts.sql'),'utf8'));
const legacy=crypto.randomUUID();
db.prepare('INSERT INTO experience_life_cycle_drafts VALUES (?,?,?,?,?,?,?,?)').run(legacy,'old-chatgpt-owner','fashion','GOLD','Preserved original',crypto.randomUUID(),'old-hash','2026-11-20T00:00:00Z');
db.exec(readFileSync(resolve(root,'drizzle/0004_life_cycle_revisions.sql'),'utf8'));
db.exec(readFileSync(resolve(root,'drizzle/0005_life_cycle_versions.sql'),'utf8'));
assert.equal(db.prepare('SELECT root_draft_id FROM experience_life_cycle_drafts WHERE id=?').get(legacy).root_draft_id,legacy);
let failEvent=false;
function statement(sql,args=[]){return {
 bind(...values){return statement(sql,values);},
 async first(){return db.prepare(sql).get(...args)??null;},
 async all(){return {results:db.prepare(sql).all(...args)};},
 run(){if(failEvent&&sql.startsWith('INSERT INTO experience_life_cycle_events'))throw Error('Injected event failure');return db.prepare(sql).run(...args);}
};}
const d1={prepare:statement,async batch(queries){db.exec('BEGIN');try{const result=queries.map(q=>q.run());db.exec('COMMIT');return result;}catch(e){db.exec('ROLLBACK');throw e;}}};
const a=crypto.randomUUID(),b=crypto.randomUUID(),tokenA='test-only-owner-a-000000000',tokenB='test-only-owner-b-000000000';
let offline=false;
async function coreFetch(url,options){
 assert.equal(url,'https://mergestars.com/api/users/me');assert.equal(options.method,'GET');assert.equal(options.redirect,'manual');
 if(offline)throw Error('Offline');
 const token=options.headers.Authorization,who=token==='Bearer '+tokenA?a:token==='Bearer '+tokenB?b:null;
 return Response.json(who?{data:{id:who},meta:{timestamp:new Date().toISOString(),version:'1.0.0'}}:{error:'Unauthorized'},{status:who?200:401});
}
const cache=new Map();
function load(filename){
 const path=filename.endsWith('.ts')?filename:filename+'.ts';if(cache.has(path))return cache.get(path).exports;
 const module={exports:{}};cache.set(path,module);
 const localRequire=name=>{
  if(name==='cloudflare:workers')return {env:{DB:d1}};
  if(name==='@/app/chatgpt-auth')return {getChatGPTUser:()=>{throw Error('Life Cycle routes must not trust ChatGPT identity');}};
  if(name.startsWith('@/'))return load(resolve(root,name.slice(2)));
  if(name.startsWith('.'))return load(resolve(dirname(path),name));
  return require(name);
 };
 const js=ts.transpileModule(readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
 new Function('require','module','exports','fetch',js)(localRequire,module,module.exports,coreFetch);return module.exports;
}
const route=load(resolve(root,'app/api/life-cycle-drafts/route.ts'));
const session=load(resolve(root,'app/api/life-cycle-session/route.ts'));
const revisions=load(resolve(root,'app/api/life-cycle-revisions/route.ts'));
const host='https://fixture.invalid';
function req(method='GET',token=null,input=null,extra={}){
 return new Request(host+'/api/life-cycle-drafts',{method,headers:{...(method==='GET'?{}:{Origin:host,'Content-Type':'application/json'}),...(token?{Authorization:'Bearer '+token}:{}),...extra},...(input?{body:JSON.stringify(input)}:{})});
}
const forged={'oai-authenticated-user-id':a,'oai-authenticated-user-email':'not-a-real-user@example.test'};
assert.equal((await route.GET(req('GET',null,null,forged))).status,401);
assert.equal((await route.GET(req('GET','invalid-token-000000',null,forged))).status,401);
assert.equal((await route.POST(req('POST',tokenA,{},{Origin:'https://other.invalid'}))).status,403);
const connected=await session.POST(req('POST',tokenA));assert.equal(connected.status,200);
const cookie=connected.headers.get('set-cookie');for(const flag of ['HttpOnly','SameSite=Strict','Secure'])assert.ok(cookie.includes(flag));
assert.ok(!JSON.stringify(await connected.json()).includes(tokenA));
assert.equal((await route.GET(req('GET',null,null,{Cookie:cookie.split(';')[0]}))).status,200);
const input={request_id:crypto.randomUUID(),cycle_id:'fashion',line:'GOLD',brief:'First private brief'};
assert.equal((await route.POST(req('POST',tokenA,{...input,owner_id:b}))).status,400);
let response=await route.POST(req('POST',tokenA,input));assert.equal(response.status,201);const first=(await response.json()).draft;
response=await route.POST(req('POST',tokenA,input));assert.equal(response.status,200);const replay=await response.json();assert.equal(replay.replayed,true);assert.equal(replay.draft.id,first.id);
assert.equal(db.prepare('SELECT COUNT(*) AS n FROM experience_life_cycle_events WHERE draft_id=?').get(first.id).n,1);
assert.equal((await route.POST(req('POST',tokenA,{...input,brief:'Changed with old request'}))).status,409);
const variant={...input,request_id:crypto.randomUUID(),parent_draft_id:first.id,brief:'Second version'};
response=await route.POST(req('POST',tokenA,variant));assert.equal(response.status,201);const version=(await response.json()).draft;
assert.equal(version.root_draft_id,first.id);assert.equal(version.parent_draft_id,first.id);
assert.equal(db.prepare('SELECT brief FROM experience_life_cycle_drafts WHERE id=?').get(first.id).brief,input.brief);
assert.equal((await route.POST(req('POST',tokenB,variant))).status,400);
assert.deepEqual((await (await route.GET(req('GET',tokenB))).json()).drafts,[]);
assert.equal((await route.GET(new Request(host+'/api/life-cycle-drafts?after='+first.id,{headers:{Authorization:'Bearer '+tokenB}}))).status,400);
for(let i=0;i<301;i++)assert.equal((await route.POST(req('POST',tokenA,{...input,request_id:crypto.randomUUID(),brief:'Brief '+i}))).status,201);
let next=null,ids=new Set(),pages=0;
do{
 const page=await (await route.GET(new Request(host+'/api/life-cycle-drafts'+(next?'?after='+next:''),{headers:{Authorization:'Bearer '+tokenA}}))).json();
 assert.equal(page.counts.total,303);assert.ok(page.drafts.length<=50);assert.equal(page.identity_source,'MERGE_CORE');assert.equal(page.core_connected,false);
 for(const d of page.drafts){assert.ok(!ids.has(d.id));ids.add(d.id);assert.equal(d.status,'CONCEPT');assert.equal(d.artifact_type,'TEXT_BRIEF');assert.equal(d.core_product_id,null);assert.equal(d.production_authorized,false);}
 next=page.next_cursor;pages++;
}while(next);
assert.equal(ids.size,303);assert.equal(pages,7);assert.ok(ids.has(first.id));assert.ok(!ids.has(legacy));
const simultaneous={...input,request_id:crypto.randomUUID()};
const concurrent=await Promise.all([route.POST(req('POST',tokenA,simultaneous)),route.POST(req('POST',tokenA,simultaneous))]);
assert.equal((await concurrent[0].json()).draft.id,(await concurrent[1].json()).draft.id);
const before=db.prepare('SELECT COUNT(*) AS n FROM experience_life_cycle_drafts').get().n;
failEvent=true;assert.equal((await route.POST(req('POST',tokenA,{...input,request_id:crypto.randomUUID()}))).status,503);failEvent=false;
assert.equal(db.prepare('SELECT COUNT(*) AS n FROM experience_life_cycle_drafts').get().n,before);
// Concurrently added revision API must use the same CORE identity, remain
// append-only, replay the exact revision, and never silently truncate history.
assert.equal((await revisions.GET(req('GET',null,null,forged))).status,401);
const revisionInput={request_id:crypto.randomUUID(),draft_id:first.id,brief:'Append revision 1'};
response=await revisions.POST(req('POST',tokenA,revisionInput));assert.equal(response.status,201);
assert.equal((await response.json()).revision.version,2);
response=await revisions.POST(req('POST',tokenA,revisionInput));assert.equal(response.status,200);
assert.equal((await response.json()).replayed,true);
assert.equal((await revisions.POST(req('POST',tokenB,revisionInput))).status,404);
assert.equal((await revisions.POST(req('POST',tokenA,{...revisionInput,brief:'Conflicting revision'}))).status,409);
for(let i=0;i<504;i++){
 response=await revisions.POST(req('POST',tokenA,{...revisionInput,request_id:crypto.randomUUID(),brief:'Append revision '+(i+2)}));
 assert.equal(response.status,201);assert.equal((await response.json()).revision.version,i+3);
}
next=null;let versions=[];
do{
 const page=await (await revisions.GET(new Request(host+'/api/life-cycle-revisions?draft_id='+first.id+(next?'&after='+next:''),{headers:{Authorization:'Bearer '+tokenA}}))).json();
 assert.ok(page.revisions.length<=50);versions.push(...page.revisions);next=page.next_cursor;
}while(next);
assert.equal(versions.length,506);assert.equal(versions[0].brief,input.brief);
assert.deepEqual(versions.map(r=>r.version),Array.from({length:506},(_,i)=>i+1));
response=await revisions.POST(req('POST',tokenA,revisionInput));assert.equal((await response.json()).revision.version,2);
assert.equal(db.prepare('SELECT brief FROM experience_life_cycle_drafts WHERE id=?').get(first.id).brief,input.brief);
const revisionCount=db.prepare('SELECT COUNT(*) AS n FROM experience_life_cycle_revisions').get().n;
failEvent=true;assert.equal((await revisions.POST(req('POST',tokenA,{...revisionInput,request_id:crypto.randomUUID()}))).status,503);failEvent=false;
assert.equal(db.prepare('SELECT COUNT(*) AS n FROM experience_life_cycle_revisions').get().n,revisionCount);
const switched=await session.POST(req('POST','invalid-token-000000',null,{Cookie:cookie.split(';')[0]}));assert.equal(switched.status,401);assert.match(switched.headers.get('set-cookie'),/Max-Age=0/);
assert.match((await session.DELETE(req('DELETE'))).headers.get('set-cookie'),/Max-Age=0/);
offline=true;response=await route.GET(req('GET',tokenA));assert.equal(response.status,503);assert.match(response.headers.get('cache-control'),/no-store/);
db.close();
console.log('PASS: real routes/store, CORE validation, forged-header rejection, owner isolation, immutable versions, lost-response retry, concurrency, atomic rollback, >288 paginated records, 506 history versions and legacy ownership');
