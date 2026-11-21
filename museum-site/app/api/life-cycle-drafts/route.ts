import {apiJson,boundedJson,requireApiIdentity,sameOriginWrite} from '@/lib/api-guards';
import {lifeCycleInputSchema} from '@/lib/life-cycle-draft-contract';
import {listLifeCycleDrafts,saveLifeCycleDraft} from '@/lib/life-cycle-draft-store';
export async function GET(){
 const owner=await requireApiIdentity();
 if(!owner)return apiJson({error:'AUTH_REQUIRED'},401);
 try{return apiJson({drafts:await listLifeCycleDrafts(owner),scope:'PRIVATE_EXPERIENCE',core_connected:false});}
 catch{console.error('Life cycles private drafts unavailable');return apiJson({error:'STORAGE_UNAVAILABLE'},503);}
}
export async function POST(request:Request){
 const owner=await requireApiIdentity();
 if(!owner)return apiJson({error:'AUTH_REQUIRED'},401);
 if(!sameOriginWrite(request))return apiJson({error:'ORIGIN_REJECTED'},403);
 let data;
 try{data=lifeCycleInputSchema.parse(await boundedJson(request,2048));}
 catch{return apiJson({error:'INVALID_DRAFT'},400);}
 try{
  const saved=await saveLifeCycleDraft(owner,data);
  return apiJson(saved,saved.replayed?200:201);
 }catch(e){
  const code=e instanceof Error?e.message:'STORAGE_UNAVAILABLE';
  if(code==='IDEMPOTENCY_CONFLICT'||code==='CYCLE_SLOT_LIMIT_REACHED')return apiJson({error:code},409);
  console.error('Life cycles private draft write unavailable');
  return apiJson({error:'STORAGE_UNAVAILABLE'},503);
 }
}