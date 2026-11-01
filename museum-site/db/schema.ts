import { index, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

// Experience-layer design drafts only. These never represent CORE products,
// orders, verified offers, payments, passports, or ownership rights.
export const designDrafts = sqliteTable("experience_design_drafts", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  rootReferenceId: text("root_reference_id").notNull(),
  sourceReferenceId: text("source_reference_id").notNull(),
  parentDraftId: text("parent_draft_id"),
  name: text("name").notNull(),
  configJson: text("config_json").notNull(),
  requestId: text("request_id").notNull(),
  requestHash: text("request_hash").notNull(),
  createdAt: text("created_at").notNull(),
}, (table) => [
  index("idx_experience_drafts_owner_created").on(table.ownerId, table.createdAt),
  uniqueIndex("idx_experience_drafts_owner_request").on(table.ownerId, table.requestId),
]);

// An append-only application event log; not represented as a WORM/security audit.
export const draftEvents = sqliteTable("experience_draft_events", {
  id: text("id").primaryKey(),
  draftId: text("draft_id").notNull().references(() => designDrafts.id),
  ownerId: text("owner_id").notNull(),
  event: text("event").notNull(),
  createdAt: text("created_at").notNull(),
}, (table) => [index("idx_experience_events_owner_created").on(table.ownerId, table.createdAt)]);

// Private customer briefs, isolated from CORE identity, products and jobs.
export const atelierBriefs = sqliteTable("experience_atelier_briefs", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  intentJson: text("intent_json").notNull(),
  requestId: text("request_id").notNull(),
  requestHash: text("request_hash").notNull(),
  createdAt: text("created_at").notNull(),
}, table => [
  index("idx_atelier_owner_created").on(table.ownerId, table.createdAt),
  uniqueIndex("idx_atelier_owner_request").on(table.ownerId, table.requestId),
]);

// Additive private scene snapshots only; no CORE identity or commercial state.
export const houseSceneVersions = sqliteTable("experience_house_scene_versions", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  parentVersionId: text("parent_version_id"),
  layoutJson: text("layout_json").notNull(),
  requestId: text("request_id").notNull(),
  requestHash: text("request_hash").notNull(),
  createdAt: text("created_at").notNull(),
}, table => [
  index("idx_scene_owner_created").on(table.ownerId, table.createdAt),
  uniqueIndex("idx_scene_owner_request").on(table.ownerId, table.requestId),
]);
