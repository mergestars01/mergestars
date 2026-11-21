import { apiJson, boundedJson, sameOriginWrite } from '@/lib/api-guards';
import { CoreReadError } from '@/lib/core-client';
import { requireLifeCycleIdentity } from '@/lib/life-cycle-session';
import { lifeCycleInputSchema } from '@/lib/life-cycle-draft-contract';
import { listLifeCycleDrafts, saveLifeCycleDraft } from '@/lib/life-cycle-draft-store';
import { z } from 'zod';
function failure(error: unknown) {
  if (error instanceof CoreReadError) return apiJson({error:error.code},error.status);
  const code = error instanceof Error ? error.message : 'STORAGE_UNAVAILABLE';
  if (code==='IDEMPOTENCY_CONFLICT') return apiJson({error:code},409);
  if (code==='INVALID_PARENT'||code==='INVALID_CURSOR') return apiJson({error:code},400);
  return apiJson({error:'STORAGE_UNAVAILABLE'},503);
}
export async function GET(request: Request) {
  try {
    const owner = await requireLifeCycleIdentity(request);
    const after = new URL(request.url).searchParams.get('after');
    if (after && !z.string().uuid().safeParse(after).success) return apiJson({error:'INVALID_CURSOR'},400);
    return apiJson({...await listLifeCycleDrafts(owner,after),scope:'PRIVATE_EXPERIENCE',core_connected:false,identity_source:'MERGE_CORE'});
  } catch (error) { return failure(error); }
}
export async function POST(request: Request) {
  if (!sameOriginWrite(request)) return apiJson({error:'ORIGIN_REJECTED'},403);
  try {
    const owner = await requireLifeCycleIdentity(request);
    let input;
    try { input = lifeCycleInputSchema.parse(await boundedJson(request,4096)); }
    catch { return apiJson({error:'INVALID_DRAFT'},400); }
    const saved = await saveLifeCycleDraft(owner,input);
    return apiJson(saved,saved.replayed?200:201);
  } catch (error) { return failure(error); }
}
