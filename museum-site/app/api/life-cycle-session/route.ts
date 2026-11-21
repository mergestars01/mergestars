import { apiJson, sameOriginWrite } from '@/lib/api-guards';
import { CoreReadError } from '@/lib/core-client';
import { coreAuthorization, requireLifeCycleIdentity, sessionCookie } from '@/lib/life-cycle-session';

export async function POST(request: Request) {
  if (!sameOriginWrite(request)) return apiJson({ error: 'ORIGIN_REJECTED' }, 403);
  try {
    await requireLifeCycleIdentity(request);
    // Reuse CORE login, with no second account database or token in responses.
    const token = coreAuthorization(request)?.slice(7) ?? '';
    const response = apiJson({ authenticated: true, identity_source: 'MERGE_CORE' });
    response.headers.set('Set-Cookie', sessionCookie(request, token));
    return response;
  } catch (error) {
    const failure = error instanceof CoreReadError ? error : new CoreReadError('CORE_UNAVAILABLE');
    const response = apiJson({ error: failure.code }, failure.status);
    // A failed account switch must never keep the previous account's cookie.
    if (request.headers.has('authorization')) response.headers.set('Set-Cookie', sessionCookie(request, null));
    return response;
  }
}
export async function DELETE(request: Request) {
  if (!sameOriginWrite(request)) return apiJson({ error: 'ORIGIN_REJECTED' }, 403);
  const response = apiJson({ authenticated: false });
  response.headers.set('Set-Cookie', sessionCookie(request, null));
  return response;
}
