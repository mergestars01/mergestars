import { lifeCycleListSchema, lifeCycleSaveSchema, type LifeCycleInput } from './life-cycle-draft-contract';
export class LifeCycleRequestError extends Error {}
async function responseJSON(response: Response) {
  if (response.status === 401 || response.status === 403) throw new LifeCycleRequestError('AUTH_REQUIRED');
  if (!response.headers.get('content-type')?.includes('application/json')) throw new LifeCycleRequestError('INVALID_RESPONSE');
  const text = await response.text();
  if (text.length > 128 * 1024) throw new LifeCycleRequestError('INVALID_RESPONSE');
  let value;
  try { value = JSON.parse(text); } catch { throw new LifeCycleRequestError('INVALID_RESPONSE'); }
  if (!response.ok) throw new LifeCycleRequestError(typeof value.error === 'string' ? value.error : 'STORAGE_UNAVAILABLE');
  return value;
}
function requestSignal(signal?: AbortSignal) {
  const timeout = AbortSignal.timeout(12000);
  return signal ? AbortSignal.any([signal, timeout]) : timeout;
}
export async function connectExistingCoreSession(transport: typeof fetch = fetch, signal?: AbortSignal) {
  // Only reuse the existing frontend session on the same origin. No new login,
  // guessed owner IDs, cross-origin storage bridge or stored Museum token.
  let token: unknown;
  let signedOut = false;
  if (typeof window !== 'undefined') {
    try {
      const existing = sessionStorage.getItem('merge-stars-auth') ?? localStorage.getItem('merge-stars-auth');
      if (existing) {
        const state = JSON.parse(existing)?.state;
        token = state?.accessToken;
        signedOut = state?.accessToken === null;
      }
    } catch { /* A previously verified HttpOnly session may still be available. */ }
  }
  if (signedOut) {
    await transport('/api/life-cycle-session', { method: 'DELETE', credentials: 'same-origin', signal: requestSignal(signal) });
    throw new LifeCycleRequestError('AUTH_REQUIRED');
  }
  await responseJSON(await transport('/api/life-cycle-session', {
    method: 'POST', credentials: 'same-origin', redirect: 'error', cache: 'no-store', signal: requestSignal(signal),
    headers: { Accept: 'application/json', ...(typeof token === 'string' ? { Authorization: 'Bearer ' + token } : {}) },
  }));
}
export async function loadLifeCycleDrafts(cursor: string | null = null, transport: typeof fetch = fetch, signal?: AbortSignal) {
  return lifeCycleListSchema.parse(await responseJSON(await transport('/api/life-cycle-drafts' + (cursor ? '?after=' + encodeURIComponent(cursor) : ''), {
    credentials: 'same-origin', redirect: 'error', cache: 'no-store', signal: requestSignal(signal), headers: { Accept: 'application/json' },
  })));
}
export async function saveLifeCycleDraft(input: LifeCycleInput, transport: typeof fetch = fetch, signal?: AbortSignal) {
  const result = lifeCycleSaveSchema.parse(await responseJSON(await transport('/api/life-cycle-drafts', {
    method: 'POST', credentials: 'same-origin', redirect: 'error', cache: 'no-store', signal: requestSignal(signal),
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(input),
  })));
  if (result.draft.brief !== input.brief || result.draft.line !== input.line || result.draft.cycle_id !== input.cycle_id ||
      result.draft.parent_draft_id !== (input.parent_draft_id ?? null)) throw new LifeCycleRequestError('INVALID_RESPONSE');
  return result;
}
