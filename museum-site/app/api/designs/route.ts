import { apiJson, boundedJson, requireApiIdentity, sameOriginWrite } from "@/lib/api-guards";
import { createDraftSchema } from "@/lib/draft-contract";
import { listDrafts, saveDraft } from "@/lib/draft-store";

export async function GET() {
  const owner = await requireApiIdentity();
  if (!owner) return apiJson({ error: "AUTH_REQUIRED" }, 401);
  try { return apiJson({ drafts: await listDrafts(owner), scope: "EXPERIENCE_DRAFTS", core_connected: false }); }
  catch { console.error("Experience draft storage read failed"); return apiJson({ error: "DRAFT_STORAGE_UNAVAILABLE" }, 503); }
}

export async function POST(request: Request) {
  const owner = await requireApiIdentity();
  if (!owner) return apiJson({ error: "AUTH_REQUIRED" }, 401);
  if (!sameOriginWrite(request)) return apiJson({ error: "ORIGIN_REJECTED" }, 403);
  let input: ReturnType<typeof createDraftSchema.parse>;
  try { input = createDraftSchema.parse(await boundedJson(request)); }
  catch (error) { return apiJson({ error: error instanceof Error && error.message === "BODY_TOO_LARGE" ? "BODY_TOO_LARGE" : "INVALID_DESIGN" }, 400); }
  try { const result = await saveDraft(owner, input); return apiJson(result, result.replayed ? 200 : 201); }
  catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "IDEMPOTENCY_CONFLICT") return apiJson({ error: message }, 409);
    if (message === "INVALID_PARENT") return apiJson({ error: message }, 400);
    if (message === "COLLECTION_LIMIT_REACHED") return apiJson({ error: message }, 409);
    console.error("Experience draft storage write failed");
    return apiJson({ error: "DRAFT_STORAGE_UNAVAILABLE" }, 503);
  }
}
