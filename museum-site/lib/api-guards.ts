import { getChatGPTUser } from "@/app/chatgpt-auth";

export const privateHeaders = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };
export function apiJson(data: unknown, status = 200) { return Response.json(data, { status, headers: privateHeaders }); }

export async function requireApiIdentity() {
  const user = await getChatGPTUser();
  return user?.userId ?? null;
}

export function sameOriginWrite(request: Request) {
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  return !!origin && origin === new URL(request.url).origin && fetchSite !== "cross-site";
}

export async function boundedJson(request: Request, limit = 4096): Promise<unknown> {
  if (!request.headers.get("content-type")?.split(";")[0].trim().match(/^application\/json$/i)) throw new Error("INVALID_CONTENT_TYPE");
  if (Number(request.headers.get("content-length") ?? 0) > limit) throw new Error("BODY_TOO_LARGE");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("INVALID_JSON");
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > limit) { await reader.cancel(); throw new Error("BODY_TOO_LARGE"); }
      chunks.push(part.value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    return JSON.parse(new TextDecoder().decode(bytes));
  } finally { reader.releaseLock(); }
}
