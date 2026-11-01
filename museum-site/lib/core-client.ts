import { CORE_API, identityEnvelope, projectCatalog, projectCollection, projectPrices } from "./core-contract";

export class CoreReadError extends Error {
  constructor(public code: string, public status: number = 503) { super(code); }
}
type Transport = typeof fetch;

async function requestCore(path: string, transport: Transport, bearer?: string) {
  // Paths come only from the fixed public read functions below. No caller URL,
  // admin token, cookie, ChatGPT identity or guessed mutation is forwarded.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await transport(`${CORE_API}${path}`, {
      method: "GET", redirect: "manual", cache: "no-store", credentials: "omit",
      headers: { Accept: "application/json", ...(bearer ? { Authorization: bearer } : {}) }, signal: controller.signal,
    });
    // Worker's Fetch supports manual/follow, not redirect:error. Manual keeps a
    // CORE token from following a redirect to any other origin.
    if (response.status >= 300 && response.status < 400) throw new CoreReadError("CORE_REDIRECT_REJECTED");
    if (response.status === 401) throw new CoreReadError("CORE_SESSION_REQUIRED", 401);
    if (response.status === 403) throw new CoreReadError("CORE_PERMISSION_DENIED", 403);
    if (response.status === 404) throw new CoreReadError("CORE_ENTITY_NOT_FOUND", 404);
    if (response.status === 429) throw new CoreReadError("CORE_RATE_LIMITED", 429);
    if (!response.ok) throw new CoreReadError("CORE_UNAVAILABLE");
    if (response.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") throw new CoreReadError("CORE_CONTRACT_INVALID");
    const reader = response.body?.getReader();
    if (!reader) throw new CoreReadError("CORE_CONTRACT_INVALID");
    let size = 0; const chunks: Uint8Array[] = [];
    try {
      while (true) {
        const value = await reader.read(); if (value.done) break;
        size += value.value.byteLength;
        if (size > 1024 * 1024) { await reader.cancel(); throw new CoreReadError("CORE_RESPONSE_TOO_LARGE"); }
        chunks.push(value.value);
      }
    } finally { reader.releaseLock(); }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    try { return JSON.parse(new TextDecoder().decode(bytes)) as unknown; }
    catch { throw new CoreReadError("CORE_CONTRACT_INVALID"); }
  } catch (error) {
    if (error instanceof CoreReadError) throw error;
    throw new CoreReadError(controller.signal.aborted ? "CORE_TIMEOUT" : "CORE_UNAVAILABLE");
  } finally { clearTimeout(timer); }
}
function validated<T>(project: () => T): T {
  try { return project(); } catch { throw new CoreReadError("CORE_CONTRACT_INVALID"); }
}
export async function readCoreCatalog(transport: Transport = fetch) {
  const raw = await requestCore("/catalog/public", transport);
  return { ...validated(() => projectCatalog(raw)), retrieved_at: new Date().toISOString() };
}
export async function readCoreCollection(slug: string, transport: Transport = fetch) {
  if (!/^[a-zA-Z0-9_-]{1,120}$/.test(slug)) throw new CoreReadError("INVALID_CORE_SLUG", 400);
  const raw = await requestCore(`/catalog/public/${encodeURIComponent(slug)}`, transport);
  return { ...validated(() => projectCollection(raw, slug)), retrieved_at: new Date().toISOString() };
}
export async function readCorePrices(transport: Transport = fetch) {
  const raw = await requestCore("/metals/live", transport);
  return { ...validated(() => projectPrices(raw)), retrieved_at: new Date().toISOString() };
}
export async function readCoreIdentity(authorization: string | null, transport: Transport = fetch) {
  if (!authorization || !/^Bearer [A-Za-z0-9._~-]{16,8192}$/.test(authorization)) throw new CoreReadError("CORE_SESSION_REQUIRED", 401);
  const raw = await requestCore("/users/me", transport, authorization);
  const record = validated(() => identityEnvelope.parse(raw));
  // A CORE subject is accepted only after CORE itself validates the token.
  return { core_user_id: record.data.id, source_of_truth: "MERGE_CORE", response_at: record.meta.timestamp };
}
