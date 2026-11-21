import {apiJson,boundedJson,requireApiIdentity,sameOriginWrite} from '@/lib/api-guards';
import {lifeCycleRevisionInputSchema} from '@/lib/life-cycle-draft-contract';
import {listLifeCycleHistory,reviseLifeCycleDraft} from '@/lib/life-cycle-draft-store';

export async function GET(request:Request){
 const owner=await requireApiIdentity();
 if(!owner)return apiJson({error:'AUTH_REQUIRED'},401);
 const draftId=new URL(request.url).searchParams.get('draft_id')??'';
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(draftId))return apiJson({error:'INVALID_DRAFT'},400);
 try{return apiJson(await listLifeCycleHistory(owner,draftId));}
 catch(e){return e instanceof Error&&e.message==='DRAFT_NOT_FOUND'?apiJson({error:'NOT_FOUND'},404):apiJson({error:'STORAGE_UNAVAILABLE'},503);}
}
export async function POST(request:Request){
 const owner=await requireApiIdentity();
 if(!owner)return apiJson({error:'AUTH_REQUIRED'},401);
 if(!sameOriginWrite(request))return apiJson({error:'ORIGIN_REJECTED'},403);
 let input;
 try{input=lifeCycleRevisionInputSchema.parse(await boundedJson(request,2048));}
 catch{return apiJson({error:'INVALID_REVISION'},400);}
 try{return apiJson(await reviseLifeCycleDraft(owner,input),201);}
 catch(e){
  const code=e instanceof Error?e.message:'STORAGE_UNAVAILABLE';
  if(code==='DRAFT_NOT_FOUND')return apiJson({error:'NOT_FOUND'},404);
  if(code==='IDEMPOTENCY_CONFLICT')return apiJson({error:code},409);
  return apiJson({error:'STORAGE_UNAVAILABLE'},503);
 }
}
