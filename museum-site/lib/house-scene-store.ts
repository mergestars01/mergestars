import {env} from 'cloudflare:workers';
import {houseSceneInputSchema,houseScenePayload,houseSceneVersionSchema,type HouseSceneInput} from './house-scene-contract';

type Row={id:string;parent_version_id:string|null;layout_json:string;created_at:string;request_hash:string};
function database(){if(!env.DB)throw Error('SCENE_STORAGE_UNAVAILABLE');return env.DB;}
function project(row:Row){return houseSceneVersionSchema.parse({id:row.id,parent_version_id:row.parent_version_id,layout:JSON.parse(row.layout_json),created_at:row.created_at,scope:'PRIVATE_SCENE_STUDY',core_house_id:null,publication_status:'PRIVATE'});}
export async function listHouseScenes(owner:string){
  const rows=await database().prepare('SELECT id, parent_version_id, layout_json, created_at, request_hash FROM experience_house_scene_versions WHERE owner_id = ? ORDER BY created_at DESC, id DESC LIMIT 80').bind(owner).all<Row>();
  return rows.results.map(project);
}
export async function saveHouseScene(owner:string,raw:HouseSceneInput){
  const input=houseSceneInputSchema.parse(raw),db=database();
  const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(houseScenePayload(input)))),v=>v.toString(16).padStart(2,'0')).join('');
  const existing=await db.prepare('SELECT id, parent_version_id, layout_json, created_at, request_hash FROM experience_house_scene_versions WHERE owner_id = ? AND request_id = ?').bind(owner,input.request_id).first<Row>();
  if(existing){if(existing.request_hash!==hash)throw Error('IDEMPOTENCY_CONFLICT');return {version:project(existing),replayed:true};}
  if(input.parent_version_id&&!await db.prepare('SELECT id FROM experience_house_scene_versions WHERE owner_id = ? AND id = ?').bind(owner,input.parent_version_id).first())throw Error('INVALID_SCENE_PARENT');
  const id=crypto.randomUUID(),created=new Date().toISOString();
  await db.prepare('INSERT OR IGNORE INTO experience_house_scene_versions (id, owner_id, parent_version_id, layout_json, request_id, request_hash, created_at) SELECT ?, ?, ?, ?, ?, ?, ? WHERE (SELECT COUNT(*) FROM experience_house_scene_versions WHERE owner_id = ?) < 80 AND (? IS NULL OR EXISTS (SELECT 1 FROM experience_house_scene_versions WHERE owner_id = ? AND id = ?))').bind(id,owner,input.parent_version_id,JSON.stringify(input.layout),input.request_id,hash,created,owner,input.parent_version_id,owner,input.parent_version_id).run();
  const row=await db.prepare('SELECT id, parent_version_id, layout_json, created_at, request_hash FROM experience_house_scene_versions WHERE owner_id = ? AND request_id = ?').bind(owner,input.request_id).first<Row>();
  if(!row)throw Error('SCENE_VERSION_LIMIT');
  if(row.request_hash!==hash)throw Error('IDEMPOTENCY_CONFLICT');
  return {version:project(row),replayed:row.id!==id};
}
