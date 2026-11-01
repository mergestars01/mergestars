import {apiJson,boundedJson,requireApiIdentity,sameOriginWrite} from '@/lib/api-guards';
import {houseSceneInputSchema} from '@/lib/house-scene-contract';
import {listHouseScenes,saveHouseScene} from '@/lib/house-scene-store';

export async function GET(){
  const owner=await requireApiIdentity();if(!owner)return apiJson({error:'AUTH_REQUIRED'},401);
  try{return apiJson({versions:await listHouseScenes(owner)});}catch{return apiJson({error:'SCENE_STORAGE_UNAVAILABLE'},503);}
}
export async function POST(request:Request){
  const owner=await requireApiIdentity();if(!owner)return apiJson({error:'AUTH_REQUIRED'},401);
  if(!sameOriginWrite(request))return apiJson({error:'ORIGIN_REJECTED'},403);
  let input;
  try{input=houseSceneInputSchema.parse(await boundedJson(request,20000));}
  catch(error){return apiJson({error:error instanceof Error&&error.message==='BODY_TOO_LARGE'?'BODY_TOO_LARGE':'INVALID_SCENE'},400);}
  try{const result=await saveHouseScene(owner,input);return apiJson(result,result.replayed?200:201);}
  catch(error){const code=error instanceof Error?error.message:'';return ['IDEMPOTENCY_CONFLICT','INVALID_SCENE_PARENT','SCENE_VERSION_LIMIT'].includes(code)?apiJson({error:code},409):apiJson({error:'SCENE_STORAGE_UNAVAILABLE'},503);}
}
