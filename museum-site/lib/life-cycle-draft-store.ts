import {env} from 'cloudflare:workers';
import {type LifeCycleInput,type LifeCycleDraft,lifeCycleDraftSchema} from './life-cycle-draft-contract';

type RecordRow={id:string;owner_id:string;cycle_id:string;line:string;brief:string;request_id:string;request_hash:string;created_at:string};
function db(){if(!env.DB)throw Error('STORAGE_UNAVAILABLE');return env.DB;}
function asDraft(row:RecordRow):LifeCycleDraft{
 return lifeCycleDraftSchema.parse({id:row.id,cycle_id:row.cycle_id,line:row.line,brief:row.brief,created_at:row.created_at,
   status:'CONCEPT',core_product_id:null,core_house_id:null,production_authorized:false});
}
export async function listLifeCycleDrafts(owner:string):Promise<LifeCycleDraft[]>{
 const result=await db().prepare('SELECT * FROM experience_life_cycle_drafts WHERE owner_id=? ORDER BY created_at DESC,id DESC LIMIT 288').bind(owner).all<RecordRow>();
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
