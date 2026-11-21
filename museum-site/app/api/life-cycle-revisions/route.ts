import {apiJson,boundedJson,sameOriginWrite} from '@/lib/api-guards';
import {CoreReadError} from '@/lib/core-client';
import {requireLifeCycleIdentity} from '@/lib/life-cycle-session';
import {lifeCycleRevisionInputSchema} from '@/lib/life-cycle-draft-contract';
import {listLifeCycleHistory,reviseLifeCycleDraft} from '@/lib/life-cycle-draft-store';

const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function failure(error:unknown){
  if(error instanceof CoreReadError)return apiJson({error:error.code},error.status);
  const code=error instanceof Error?error.message:'';
  if(code==='DRAFT_NOT_FOUND')return apiJson({error:'NOT_FOUND'},404);
  if(code==='IDEMPOTENCY_CONFLICT')return apiJson({error:code},409);
  if(code==='INVALID_CURSOR')return apiJson({error:code},400);
  return apiJson({error:'STORAGE_UNAVAILABLE'},503);
}
export async function GET(request:Request){
  try{
    const owner=await requireLifeCycleIdentity(request);
    const query=new URL(request.url).searchParams;
    const id=query.get('draft_id')??'',after=query.get('after');
    if(!uuid.test(id)||(after!==null&&!uuid.test(after)))return apiJson({error:'INVALID_DRAFT'},400);
    return apiJson(await listLifeCycleHistory(owner,id,after));
  }catch(error){return failure(error);}
}
export async function POST(request:Request){
  if(!sameOriginWrite(request))return apiJson({error:'ORIGIN_REJECTED'},403);
  try{
    const owner=await requireLifeCycleIdentity(request);
    let input;
    try{input=lifeCycleRevisionInputSchema.parse(await boundedJson(request,2048));}
    catch{return apiJson({error:'INVALID_REVISION'},400);}
    const saved=await reviseLifeCycleDraft(owner,input);
    return apiJson(saved,saved.replayed?200:201);
  }catch(error){return failure(error);}
}
