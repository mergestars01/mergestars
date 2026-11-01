import { env } from 'cloudflare:workers';
import { atelierRecordSchema, type AtelierInput } from './atelier-contract';
type Row = { id: string; intent_json: string; created_at: string; request_hash: string };
function database() { if (!env.DB) throw new Error('STORAGE_UNAVAILABLE'); return env.DB; }
function project(row: Row) {
  return atelierRecordSchema.parse({ id: row.id, intent: JSON.parse(row.intent_json), created_at: row.created_at, status: 'CONCEPT', generation_status: 'DEPENDENCY_REQUIRED', core_product_id: null, core_house_id: null });
}
export async function listAtelier(owner: string) {
  const rows = await database().prepare('SELECT id, intent_json, created_at, request_hash FROM experience_atelier_briefs WHERE owner_id = ? ORDER BY created_at DESC, id DESC LIMIT 100').bind(owner).all<Row>();
  return rows.results.map(project);
}
export async function saveAtelier(owner: string, input: AtelierInput) {
  const db = database(), payload = JSON.stringify(input.intent);
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(payload))), x => x.toString(16).padStart(2, '0')).join('');
  const id = crypto.randomUUID(), created = new Date().toISOString();
  await db.prepare('INSERT OR IGNORE INTO experience_atelier_briefs (id, owner_id, intent_json, request_id, request_hash, created_at) SELECT ?, ?, ?, ?, ?, ? WHERE (SELECT COUNT(*) FROM experience_atelier_briefs WHERE owner_id = ?) < 100').bind(id, owner, payload, input.request_id, hash, created, owner).run();
  const row = await db.prepare('SELECT id, intent_json, created_at, request_hash FROM experience_atelier_briefs WHERE owner_id = ? AND request_id = ?').bind(owner, input.request_id).first<Row>();
  if (!row) throw new Error('COLLECTION_LIMIT_REACHED');
  if (row.request_hash !== hash) throw new Error('IDEMPOTENCY_CONFLICT');
  return { draft: project(row), replayed: row.id !== id };
}
