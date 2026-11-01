import { CORE_API } from "./core-contract";
import { CoreReadError } from "./core-client";
import { MAX_CORE_MODEL_BYTES, CORE_MODEL_TIMEOUT_MS } from "./core-model-limits";

/** Read-only streaming projection of an existing PUBLIC CORE model.
 * No credentials, supplied URLs, redirects, permanent asset copy or product record.
 */
export async function relayCorePublicModel(id: string, signal: AbortSignal, transport: typeof fetch = fetch) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) throw new CoreReadError("INVALID_CORE_ITEM", 400);
  const controller = new AbortController(), abort = () => controller.abort();
  const timer = setTimeout(abort, CORE_MODEL_TIMEOUT_MS);
  signal.addEventListener("abort", abort, { once: true }); if (signal.aborted) abort();
  const cleanup = () => { clearTimeout(timer); signal.removeEventListener("abort", abort); };
  try {
    const response = await transport(`${CORE_API}/catalog/public/items/${id}/model3d`, { method: "GET", signal: controller.signal, credentials: "omit", redirect: "manual", cache: "no-store", headers: { Accept: "model/gltf-binary, application/octet-stream" } });
    if (response.status >= 300 && response.status < 400) { await response.body?.cancel(); throw new CoreReadError("CORE_REDIRECT_REJECTED"); }
    if (!response.ok) { await response.body?.cancel(); throw new CoreReadError(response.status === 404 ? "CORE_ENTITY_NOT_FOUND" : response.status === 403 ? "CORE_PERMISSION_DENIED" : "CORE_MODEL_UNAVAILABLE", response.status === 404 || response.status === 403 ? response.status : 503); }
    const type = response.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
    if (!["model/gltf-binary", "application/octet-stream"].includes(type ?? "")) { await response.body?.cancel(); throw new CoreReadError("CORE_MODEL_FORMAT_INVALID"); }
    const length = Number(response.headers.get("content-length") ?? 0);
    if (!Number.isSafeInteger(length) || length < 0 || length > MAX_CORE_MODEL_BYTES || !response.body) { await response.body?.cancel(); throw new CoreReadError("CORE_MODEL_SIZE_INVALID"); }
    const reader = response.body.getReader(), header = new Uint8Array(12);
    let received = 0, headerBytes = 0, declared = 0;
    const stream = new ReadableStream<Uint8Array>({
      async pull(output) {
        try {
          const next = await reader.read();
          if (next.done) { if (headerBytes < 12 || received !== declared) throw Error("CORE_MODEL_TRUNCATED"); cleanup(); output.close(); return; }
          received += next.value.byteLength;
          if (received > MAX_CORE_MODEL_BYTES) throw Error("CORE_MODEL_SIZE_INVALID");
          if (headerBytes < 12) { const count = Math.min(12 - headerBytes, next.value.length); header.set(next.value.subarray(0, count), headerBytes); headerBytes += count;
            if (headerBytes === 12) { const view = new DataView(header.buffer); declared = view.getUint32(8, true); if (view.getUint32(0, true) !== 0x46546c67 || view.getUint32(4, true) !== 2 || declared < 20 || declared > MAX_CORE_MODEL_BYTES) throw Error("CORE_MODEL_FORMAT_INVALID"); }
          }
          if (declared && received > declared) throw Error("CORE_MODEL_SIZE_INVALID");
          output.enqueue(next.value);
        } catch (error) { controller.abort(); cleanup(); await reader.cancel().catch(() => {}); output.error(error); }
      },
      async cancel(reason) { controller.abort(); cleanup(); await reader.cancel(reason).catch(() => {}); },
    });
    // Private same-origin transfer solves the missing public CORS response.
    // Backpressure keeps the Worker from buffering an entire ~50 MiB model.
    return new Response(stream, { headers: { "Content-Type": "model/gltf-binary", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", "X-MERGE-Source": "MERGE_CORE" } });
  } catch (error) { controller.abort(); cleanup(); if (error instanceof CoreReadError) throw error; throw new CoreReadError("CORE_MODEL_UNAVAILABLE"); }
}
