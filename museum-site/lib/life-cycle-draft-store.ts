import {env} from 'cloudflare:workers';
import {type LifeCycleInput,type LifeCycleRevisionInput,type LifeCycleDraft,lifeCycleDraftSchema} from './life-cycle-draft-contract';

type RecordRow={id:string;owner_id:string;cycle_id:string;line:string;brief:string;request_id:string;request_hash:string;created_at:string;latest_brief?:string;revision_count?:number};
function db(){if(!env.DB)throw Error('STORAGE_UNAVAILABLE');return env.DB;}
function asDraft(row:RecordRow):LifeCycleDraft{
 return lifeCycleDraftSchema.parse({id:row.id,cycle_id:row.cycle_id,line:row.line,brief:row.latest_brief??row.brief,created_at:row.created_at,version:1+(row.revision_count??0),
   status:'CONCEPT',core_product_id:null,core_house_id:null,production_authorized:false});
}
export async function listLifeCycleDrafts(owner:string):Promise<LifeCycleDraft[]>{
 const result=await db().prepare('SELECT d.*, (SELECT r.brief FROM experience_life_cycle_revisions r WHERE r.owner_id=d.owner_id AND r.draft_id=d.id ORDER BY r.rowid DESC LIMIT 1) AS latest_brief, (SELECT COUNT(*) FROM experience_life_cycle_revisions r WHERE r.owner_id=d.owner_id AND r.draft_id=d.id) AS revision_count FROM experience_life_cycle_drafts d WHERE d.owner_id=? ORDER BY d.created_at DESC,d.id DESC LIMIT 288').bind(owner).all<RecordRow>();
 return result.results.map(asDraft);
}
export async function saveLifeCycleDraft(owner:string,input:LifeCycleInput){
 const database=db(),payload=JSON.stringify({cycle_id:input.cycle_id,line:input.line,brief:input.brief});
 const fingerprint=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(payload))),b=>b.toString(16).padStart(2,'0')).join('');
 const prior=await database.prepare('SELECT * FROM experience_life_cycle_drafts WHERE owner_id=? AND request_id=?').bind(owner,input.request_id).first<RecordRow>();
 if(prior){
  if(prior.request_hash!==fingerprint)throw Error('IDEMPOTENCY_CONFLICT');
  return {draft:asDraft(prior),replayed:true};
 }
 const id=crypto.randomUUID(),now=new Date().toISOString();
 await database.batch([
  database.prepare('INSERT OR IGNORE INTO experience_life_cycle_drafts (id,owner_id,cycle_id,line,brief,request_id,request_hash,created_at) SELECT ?,?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM experience_life_cycle_drafts WHERE owner_id=? AND cycle_id=? AND line=?) < 12')
   .bind(id,owner,input.cycle_id,input.line,input.brief,input.request_id,fingerprint,now,owner,input.cycle_id,input.line),
  database.prepare("INSERT INTO experience_life_cycle_events (id,draft_id,owner_id,event,created_at) SELECT ?,id,owner_id,'PRIVATE_DRAFT_CREATED',created_at FROM experience_life_cycle_drafts WHERE id=? AND owner_id=?")
   .bind(crypto.randomUUID(),id,owner)
 ]);
 const saved=await database.prepare('SELECT * FROM experience_life_cycle_drafts WHERE owner_id=? AND request_id=?').bind(owner,input.request_id).first<RecordRow>();
 if(!saved)throw Error('CYCLE_SLOT_LIMIT_REACHED');
 if(saved.request_hash!==fingerprint)throw Error('IDEMPOTENCY_CONFLICT');
 return {draft:asDraft(saved),replayed:saved.id!==id};
}

type RevisionRow={id:string;owner_id:string;draft_id:string;brief:string;request_id:string;request_hash:string;created_at:string};
async function hashRevision(input:LifeCycleRevisionInput):Promise<string>{
 const payload=JSON.stringify({draft_id:input.draft_id,brief:input.brief});
 const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(payload));
 return Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('');
}
export async function listLifeCycleHistory(owner:string,draftId:string){
 const database=db();
 const original=await database.prepare('SELECT * FROM experience_life_cycle_drafts WHERE id=? AND owner_id=?').bind(draftId,owner).first<RecordRow>();
 if(!original)throw Error('DRAFT_NOT_FOUND');
 const rows=await database.prepare('SELECT * FROM experience_life_cycle_revisions WHERE draft_id=? AND owner_id=? ORDER BY rowid ASC LIMIT 499')
  .bind(draftId,owner).all<RevisionRow>();
 return {revisions:[
   {draft_id:draftId,version:1,brief:original.brief,created_at:original.created_at},
   ...rows.results.map((r,i)=>({draft_id:draftId,version:i+2,brief:r.brief,created_at:r.created_at}))
 ],scope:'PRIVATE_EXPERIENCE' as const};
}
export async function reviseLifeCycleDraft(owner:string,input:LifeCycleRevisionInput){
 const database=db(),fingerprint=await hashRevision(input);
 const prior=await database.prepare('SELECT * FROM experience_life_cycle_revisions WHERE owner_id=? AND request_id=?').bind(owner,input.request_id).first<RevisionRow>();
 if(prior){
  if(prior.request_hash!==fingerprint)throw Error('IDEMPOTENCY_CONFLICT');
  const history=await listLifeCycleHistory(owner,prior.draft_id);
  const match=history.revisions.find(r=>r.brief===prior.brief&&r.created_at===prior.created_at);
  return {revision:match??history.revisions[history.revisions.length-1],replayed:true};
 }
 const original=await database.prepare('SELECT id FROM experience_life_cycle_drafts WHERE id=? AND owner_id=?')
  .bind(input.draft_id,owner).first<{id:string}>();
 if(!original)throw Error('DRAFT_NOT_FOUND');
 const id=crypto.randomUUID(),now=new Date().toISOString();
 await database.batch([
  database.prepare('INSERT OR IGNORE INTO experience_life_cycle_revisions (id,owner_id,draft_id,brief,request_id,request_hash,created_at) SELECT ?,?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM experience_life_cycle_drafts WHERE id=? AND owner_id=?)')
   .bind(id,owner,input.draft_id,input.brief,input.request_id,fingerprint,now,input.draft_id,owner),
  database.prepare("INSERT INTO experience_life_cycle_events (id,draft_id,owner_id,event,created_at) SELECT ?,draft_id,owner_id,'PRIVATE_DRAFT_REVISED',created_at FROM experience_life_cycle_revisions WHERE id=? AND owner_id=?")
   .bind(crypto.randomUUID(),id,owner)
 ]);
 const saved=await database.prepare('SELECT * FROM experience_life_cycle_revisions WHERE owner_id=? AND request_id=?')
  .bind(owner,input.request_id).first<RevisionRow>();
 if(!saved)throw Error('STORAGE_UNAVAILABLE');
 if(saved.request_hash!==fingerprint)throw Error('IDEMPOTENCY_CONFLICT');
 const history=await listLifeCycleHistory(owner,saved.draft_id);
 const match=history.revisions.find(r=>r.brief===saved.brief&&r.created_at===saved.created_at);
 return {revision:match??history.revisions[history.revisions.length-1],replayed:saved.id!==id};
}
