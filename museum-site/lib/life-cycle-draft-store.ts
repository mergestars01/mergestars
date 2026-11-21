import { env } from 'cloudflare:workers';
import { type LifeCycleInput, type LifeCycleRevisionInput, type LifeCycleDraft, lifeCycleDraftSchema } from './life-cycle-draft-contract';

type RecordRow = {id:string;owner_id:string;cycle_id:string;line:string;brief:string;request_id:string;request_hash:string;created_at:string;parent_draft_id:string|null;root_draft_id:string;latest_brief?:string;revision_count?:number};
function db() { if (!env.DB) throw Error('STORAGE_UNAVAILABLE'); return env.DB; }
function asDraft(row: RecordRow): LifeCycleDraft {
  return lifeCycleDraftSchema.parse({id:row.id,cycle_id:row.cycle_id,line:row.line,brief:row.latest_brief??row.brief,created_at:row.created_at,version:1+(row.revision_count??0),
    parent_draft_id:row.parent_draft_id,root_draft_id:row.root_draft_id,
    artifact_type:'TEXT_BRIEF',generation_status:'NOT_YET_IMPLEMENTED',
    status:'CONCEPT',core_product_id:null,core_house_id:null,production_authorized:false});
}
export async function listLifeCycleDrafts(owner: string, after: string | null = null) {
  const database = db();
  let cursor: RecordRow | null = null;
  if (after) {
    cursor = await database.prepare('SELECT * FROM experience_life_cycle_drafts WHERE owner_id=? AND id=?').bind(owner, after).first<RecordRow>();
    if (!cursor) throw Error('INVALID_CURSOR');
  }
  const projection = 'SELECT d.*, (SELECT r.brief FROM experience_life_cycle_revisions r WHERE r.owner_id=d.owner_id AND r.draft_id=d.id ORDER BY r.rowid DESC LIMIT 1) AS latest_brief, (SELECT COUNT(*) FROM experience_life_cycle_revisions r WHERE r.owner_id=d.owner_id AND r.draft_id=d.id) AS revision_count FROM experience_life_cycle_drafts d';
  const rows = await (cursor
    ? database.prepare(projection+' WHERE d.owner_id=? AND (d.created_at<? OR (d.created_at=? AND d.id<?)) ORDER BY d.created_at DESC,d.id DESC LIMIT 51')
      .bind(owner,cursor.created_at,cursor.created_at,cursor.id)
    : database.prepare(projection+' WHERE d.owner_id=? ORDER BY d.created_at DESC,d.id DESC LIMIT 51').bind(owner)
  ).all<RecordRow>();
  const counts = await database.prepare("SELECT COUNT(*) AS total, COALESCE(SUM(line='GOLD'),0) AS gold, COALESCE(SUM(line='SILVER'),0) AS silver FROM experience_life_cycle_drafts WHERE owner_id=?")
    .bind(owner).first<{total:number;gold:number;silver:number}>();
  const page = rows.results.slice(0,50);
  return {drafts:page.map(asDraft),next_cursor:rows.results.length>50?page[page.length-1].id:null,counts:counts??{total:0,gold:0,silver:0}};
}
export async function saveLifeCycleDraft(owner: string, input: LifeCycleInput) {
  const database = db();
  const payload = JSON.stringify({cycle_id:input.cycle_id,line:input.line,brief:input.brief,parent_draft_id:input.parent_draft_id??null});
  const fingerprint = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(payload))),b=>b.toString(16).padStart(2,'0')).join('');
  const prior = await database.prepare('SELECT * FROM experience_life_cycle_drafts WHERE owner_id=? AND request_id=?').bind(owner,input.request_id).first<RecordRow>();
  if (prior) {
    if (prior.request_hash!==fingerprint) throw Error('IDEMPOTENCY_CONFLICT');
    return {draft:asDraft(prior),replayed:true};
  }
  let parent: RecordRow | null = null;
  if (input.parent_draft_id) {
    parent = await database.prepare('SELECT * FROM experience_life_cycle_drafts WHERE owner_id=? AND id=?').bind(owner,input.parent_draft_id).first<RecordRow>();
    if (!parent || parent.cycle_id!==input.cycle_id) throw Error('INVALID_PARENT');
  }
  const id = crypto.randomUUID(), now = new Date().toISOString();
  // No business capacity. D1 commits the immutable version and event together.
  await database.batch([
    database.prepare('INSERT OR IGNORE INTO experience_life_cycle_drafts (id,owner_id,cycle_id,line,brief,request_id,request_hash,created_at,parent_draft_id,root_draft_id) VALUES (?,?,?,?,?,?,?,?,?,?)')
      .bind(id,owner,input.cycle_id,input.line,input.brief,input.request_id,fingerprint,now,parent?.id??null,parent?.root_draft_id??id),
    database.prepare("INSERT INTO experience_life_cycle_events (id,draft_id,owner_id,event,created_at) SELECT ?,id,owner_id,'PRIVATE_DRAFT_CREATED',created_at FROM experience_life_cycle_drafts WHERE id=? AND owner_id=?")
      .bind(crypto.randomUUID(),id,owner),
  ]);
  const saved = await database.prepare('SELECT * FROM experience_life_cycle_drafts WHERE owner_id=? AND request_id=?').bind(owner,input.request_id).first<RecordRow>();
  if (!saved) throw Error('STORAGE_UNAVAILABLE');
  if (saved.request_hash!==fingerprint) throw Error('IDEMPOTENCY_CONFLICT');
  return {draft:asDraft(saved),replayed:saved.id!==id};
}

// Preserve the concurrently added append-only revision API. Revisions of a
// record and new immutable branches both retain the original creation row.
type RevisionRow = {id:string;owner_id:string;draft_id:string;brief:string;request_id:string;request_hash:string;created_at:string;version:number};
const revisionProjection = 'SELECT r.*, 1+(SELECT COUNT(*) FROM experience_life_cycle_revisions n WHERE n.owner_id=r.owner_id AND n.draft_id=r.draft_id AND n.rowid<=r.rowid) AS version FROM experience_life_cycle_revisions r';
function asRevision(row: RevisionRow) {
  return {draft_id:row.draft_id,version:row.version,brief:row.brief,created_at:row.created_at};
}
export async function listLifeCycleHistory(owner: string, draftId: string, after: string | null = null) {
  const database = db();
  const original = await database.prepare('SELECT * FROM experience_life_cycle_drafts WHERE id=? AND owner_id=?').bind(draftId,owner).first<RecordRow>();
  if (!original) throw Error('DRAFT_NOT_FOUND');
  let cursor: {sequence:number} | null = null;
  if (after) {
    cursor = await database.prepare('SELECT rowid AS sequence FROM experience_life_cycle_revisions WHERE id=? AND draft_id=? AND owner_id=?').bind(after,draftId,owner).first<{sequence:number}>();
    if (!cursor) throw Error('INVALID_CURSOR');
  }
  const pageSize = after ? 50 : 49;
  const rows = await database.prepare(revisionProjection+' WHERE r.draft_id=? AND r.owner_id=? AND r.rowid>? ORDER BY r.rowid ASC LIMIT ?')
    .bind(draftId,owner,cursor?.sequence??0,pageSize+1).all<RevisionRow>();
  const page = rows.results.slice(0,pageSize);
  return {revisions:[
    ...(!after ? [{draft_id:draftId,version:1,brief:original.brief,created_at:original.created_at}] : []),
    ...page.map(asRevision),
  ],next_cursor:rows.results.length>pageSize?page[page.length-1].id:null,scope:'PRIVATE_EXPERIENCE' as const};
}
export async function reviseLifeCycleDraft(owner: string, input: LifeCycleRevisionInput) {
  const database = db(), payload = JSON.stringify({draft_id:input.draft_id,brief:input.brief});
  const hash = await crypto.subtle.digest('SHA-256',new TextEncoder().encode(payload));
  const fingerprint = Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('');
  const prior = await database.prepare(revisionProjection+' WHERE r.owner_id=? AND r.request_id=?').bind(owner,input.request_id).first<RevisionRow>();
  if (prior) {
    if (prior.request_hash!==fingerprint) throw Error('IDEMPOTENCY_CONFLICT');
    return {revision:asRevision(prior),replayed:true};
  }
  const original = await database.prepare('SELECT id FROM experience_life_cycle_drafts WHERE id=? AND owner_id=?').bind(input.draft_id,owner).first<{id:string}>();
  if (!original) throw Error('DRAFT_NOT_FOUND');
  const id = crypto.randomUUID(), now = new Date().toISOString();
  await database.batch([
    database.prepare('INSERT OR IGNORE INTO experience_life_cycle_revisions (id,owner_id,draft_id,brief,request_id,request_hash,created_at) SELECT ?,?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM experience_life_cycle_drafts WHERE id=? AND owner_id=?)')
      .bind(id,owner,input.draft_id,input.brief,input.request_id,fingerprint,now,input.draft_id,owner),
    database.prepare("INSERT INTO experience_life_cycle_events (id,draft_id,owner_id,event,created_at) SELECT ?,draft_id,owner_id,'PRIVATE_DRAFT_REVISED',created_at FROM experience_life_cycle_revisions WHERE id=? AND owner_id=?")
      .bind(crypto.randomUUID(),id,owner),
  ]);
  const saved = await database.prepare(revisionProjection+' WHERE r.owner_id=? AND r.request_id=?').bind(owner,input.request_id).first<RevisionRow>();
  if (!saved) throw Error('STORAGE_UNAVAILABLE');
  if (saved.request_hash!==fingerprint) throw Error('IDEMPOTENCY_CONFLICT');
  return {revision:asRevision(saved),replayed:saved.id!==id};
}
