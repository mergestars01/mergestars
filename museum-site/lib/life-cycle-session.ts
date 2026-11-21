import { CoreReadError, readCoreIdentity } from './core-client';

// Every subject is validated by the existing CORE, never by a client owner ID
// or ChatGPT proxy headers. Old ChatGPT drafts are not reassigned implicitly.
export const LIFE_CYCLE_COOKIE = 'merge_life_cycle_core';
export function coreAuthorization(request: Request): string | null {
  const header = request.headers.get('authorization');
  if (header) return header;
  const cookie = request.headers.get('cookie')?.split(';').map(v => v.trim())
    .find(v => v.startsWith(LIFE_CYCLE_COOKIE + '='));
  if (!cookie) return null;
  try { return 'Bearer ' + decodeURIComponent(cookie.slice(LIFE_CYCLE_COOKIE.length + 1)); }
  catch { throw new CoreReadError('CORE_SESSION_REQUIRED', 401); }
}
export async function requireLifeCycleIdentity(request: Request, transport: typeof fetch = fetch) {
  const identity = await readCoreIdentity(coreAuthorization(request), transport);
  return 'core:' + identity.core_user_id;
}
export function sessionCookie(request: Request, token: string | null): string {
  const url = new URL(request.url);
  const local = ['127.0.0.1', 'localhost'].includes(url.hostname);
  if (url.protocol !== 'https:' && !local) throw new CoreReadError('HTTPS_REQUIRED', 400);
  if (token && !/^[A-Za-z0-9._~-]{16,3500}$/.test(token)) throw new CoreReadError('CORE_SESSION_REQUIRED', 401);
  return `${LIFE_CYCLE_COOKIE}=${token ? encodeURIComponent(token) : ''}; Path=/api/; HttpOnly; SameSite=Strict; Max-Age=${token ? 900 : 0}${local && url.protocol === 'http:' ? '' : '; Secure'}`;
}
