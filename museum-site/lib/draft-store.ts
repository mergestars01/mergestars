import { env } from "cloudflare:workers";
import { canonicalDraftPayload, draftName, type DesignDraft, type DraftInput } from "./draft-contract";

type DraftRow = { id: string; root_reference_id: string; source_reference_id: string; parent_draft_id: string | null; name: string; config_json: string; created_at: string; request_hash: string };
function db() { if (!env.DB) throw new Error("DRAFT_STORAGE_UNAVAILABLE"); return env.DB; }
function asDraft(row: DraftRow): DesignDraft {
  return { draft_id: row.id, root_reference_id: row.root_reference_id, source_reference_id: row.source_reference_id, parent_draft_id: row.parent_draft_id, name: row.name, config: JSON.parse(row.config_json), status: "CONCEPT", core_product_id: null, core_house_id: null, generation_status: "NOT_YET_IMPLEMENTED", created_at: row.created_at };
}
export async function listDrafts(ownerId: string) {
  const rows = await db().prepare("SELECT * FROM experience_design_drafts WHERE owner_id = ? ORDER BY created_at DESC, id DESC LIMIT 200").bind(ownerId).all<DraftRow>();
  return rows.results.map(asDraft);
}

export async function saveDraft(ownerId: string, input: DraftInput) {
  const database = db();
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonicalDraftPayload(input)));
  const hash = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
  const existing = await database.prepare("SELECT * FROM experience_design_drafts WHERE owner_id = ? AND request_id = ?").bind(ownerId, input.request_id).first<DraftRow>();
  if (existing) {
    if (existing.request_hash !== hash) throw new Error("IDEMPOTENCY_CONFLICT");
    return { draft: asDraft(existing), replayed: true };
  }
  if (input.parent_draft_id) {
    const parent = await database.prepare("SELECT source_reference_id FROM experience_design_drafts WHERE id = ? AND owner_id = ?").bind(input.parent_draft_id, ownerId).first<{ source_reference_id: string }>();
    if (!parent || parent.source_reference_id !== input.source_reference_id) throw new Error("INVALID_PARENT");
  }
  const id = crypto.randomUUID(), createdAt = new Date().toISOString();
  // Atomic, bounded insertion also protects against simultaneous cap checks.
  await database.batch([
    database.prepare("INSERT OR IGNORE INTO experience_design_drafts (id, owner_id, root_reference_id, source_reference_id, parent_draft_id, name, config_json, request_id, request_hash, created_at) SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ? WHERE (SELECT COUNT(*) FROM experience_design_drafts WHERE owner_id = ?) < 200")
      .bind(id, ownerId, input.source_reference_id, input.source_reference_id, input.parent_draft_id ?? null, draftName(input), JSON.stringify(input.config), input.request_id, hash, createdAt, ownerId),
    database.prepare("INSERT INTO experience_draft_events (id, draft_id, owner_id, event, created_at) SELECT ?, id, owner_id, 'DESIGN_DRAFT_CREATED', created_at FROM experience_design_drafts WHERE id = ? AND owner_id = ?")
      .bind(crypto.randomUUID(), id, ownerId),
  ]);
  const saved = await database.prepare("SELECT * FROM experience_design_drafts WHERE owner_id = ? AND request_id = ?").bind(ownerId, input.request_id).first<DraftRow>();
  if (!saved) throw new Error("COLLECTION_LIMIT_REACHED");
  if (saved.request_hash !== hash) throw new Error("IDEMPOTENCY_CONFLICT");
  return { draft: asDraft(saved), replayed: saved.id !== id };
}
