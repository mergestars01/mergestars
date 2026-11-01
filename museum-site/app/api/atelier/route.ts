import { apiJson, boundedJson, requireApiIdentity, sameOriginWrite } from '@/lib/api-guards';
import { atelierInputSchema } from '@/lib/atelier-contract';
import { listAtelier, saveAtelier } from '@/lib/atelier-store';
export async function GET() {
  const owner = await requireApiIdentity();
  if (!owner) return apiJson({ error: 'AUTH_REQUIRED' }, 401);
  try { return apiJson({ drafts: await listAtelier(owner) }); }
  catch { return apiJson({ error: 'STORAGE_UNAVAILABLE' }, 503); }
}
export async function POST(request: Request) {
  const owner = await requireApiIdentity();
  if (!owner) return apiJson({ error: 'AUTH_REQUIRED' }, 401);
  if (!sameOriginWrite(request)) return apiJson({ error: 'ORIGIN_REJECTED' }, 403);
  let input;
  try { input = atelierInputSchema.parse(await boundedJson(request, 20000)); }
  catch (error) { return apiJson({ error: error instanceof Error && error.message === 'BODY_TOO_LARGE' ? 'BODY_TOO_LARGE' : 'INVALID_DESIGN' }, 400); }
  try { const result = await saveAtelier(owner, input); return apiJson(result, result.replayed ? 200 : 201); }
  catch (error) {
    const code = error instanceof Error ? error.message : '';
    return ['IDEMPOTENCY_CONFLICT', 'COLLECTION_LIMIT_REACHED'].includes(code) ? apiJson({ error: code }, 409) : apiJson({ error: 'STORAGE_UNAVAILABLE' }, 503);
  }
}
