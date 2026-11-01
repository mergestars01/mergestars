import {env} from 'cloudflare:workers';
import {apiJson,boundedJson,requireApiIdentity,sameOriginWrite} from '@/lib/api-guards';
import {managerRequestSchema,managerResponseSchema} from '@/lib/ai-manager-contract';
import {answerManager,managerAvailability,ManagerServiceError} from '@/lib/ai-manager-service';
const recent=new Map<string,{fingerprint:string;expires:number;result:Promise<Response>}>();
const limits=new Map<string,{until:number;count:number}>();let inFlight=0;
export async function GET(){return apiJson(managerAvailability(env as unknown as Record<string,unknown>));}
export async function POST(request:Request){
 const owner=await requireApiIdentity();if(!owner)return apiJson({error:'AUTH_REQUIRED'},401);
 if(!sameOriginWrite(request))return apiJson({error:'ORIGIN_REJECTED'},403);
 let input;try{input=managerRequestSchema.parse(await boundedJson(request,1500000));}catch{return apiJson({error:'INVALID_AI_REQUEST'},400);}
 const now=Date.now();for(const [key,value]of recent)if(value.expires<now)recent.delete(key);for(const [key,value]of limits)if(value.until<now)limits.delete(key);
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(input)));
 const fingerprint=Array.from(new Uint8Array(digest),v=>v.toString(16).padStart(2,'0')).join(''),key=owner+':'+input.request_id,old=recent.get(key);
 if(old)return old.fingerprint===fingerprint?(await old.result).clone():apiJson({error:'IDEMPOTENCY_CONFLICT'},409);
 const limit=limits.get(owner);if(inFlight>=4||(limit?.count??0)>=8||recent.size>=128)return apiJson({error:'AI_RATE_LIMITED'},429);
 limits.set(owner,{until:limit?.until??now+60000,count:(limit?.count??0)+1});inFlight++;
 const result=(async()=>{try{return apiJson(managerResponseSchema.parse(await answerManager(input,env as unknown as Record<string,unknown>)));}catch(error){return error instanceof ManagerServiceError?apiJson({error:error.code},error.status):apiJson({error:'AI_PROVIDER_UNAVAILABLE'},503);}finally{inFlight--;}})();
 recent.set(key,{fingerprint,expires:now+120000,result});return (await result).clone();
}
