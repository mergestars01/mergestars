import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniversalRfq1794132000000 implements MigrationInterface {
  async up(q: QueryRunner): Promise<void> {
    await q.query(
      `ALTER TABLE brand_line_profiles ADD COLUMN visibility varchar NOT NULL DEFAULT 'PUBLIC' CHECK (visibility IN ('PUBLIC','PRIVATE'))`,
    );
    await q.query(`CREATE TABLE brand_rfqs (
      id uuid PRIMARY KEY, owner_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
      house_id uuid NOT NULL REFERENCES brand_line_profiles(id) ON DELETE RESTRICT,
      design_id uuid NOT NULL REFERENCES design_proposals(id) ON DELETE RESTRICT,
      idempotency_key varchar(100) NOT NULL, payload_hash varchar(64) NOT NULL,
      revision int NOT NULL DEFAULT 0, status varchar NOT NULL CHECK (status IN ('DRAFT','RFQ_SUBMITTED','UNDER_REVIEW','BRAND_CONTACTED','APPROVAL_PENDING','OFFER_RECEIVED','VERIFIED_OFFER','ACCEPTED','REJECTED','CANCELLED')),
      details jsonb NOT NULL, approvals jsonb NOT NULL DEFAULT '{}', consent jsonb,
      manufacturer_id uuid REFERENCES users(id) ON DELETE RESTRICT, manufacturer_evidence_id uuid,
      accepted_offer_id uuid, accepted_snapshot jsonb, submitted_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
      UNIQUE(owner_id,idempotency_key)
    )`);
    await q.query(
      `CREATE INDEX brand_rfqs_owner_created ON brand_rfqs(owner_id,created_at DESC)`,
    );
    await q.query(
      `CREATE INDEX brand_rfqs_status_created ON brand_rfqs(status,created_at DESC)`,
    );
    await q.query(`CREATE TABLE brand_rfq_files (
      id uuid PRIMARY KEY, rfq_id uuid NOT NULL REFERENCES brand_rfqs(id) ON DELETE RESTRICT,
      actor_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT, kind varchar NOT NULL CHECK (kind IN ('REFERENCE','MODEL','EVIDENCE')),
      name varchar NOT NULL, mime varchar NOT NULL, size int NOT NULL CHECK(size>0 AND size<=20971520),
      hash varchar(64) NOT NULL, bytes bytea NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
    )`);
    await q.query(
      `CREATE INDEX brand_rfq_files_parent ON brand_rfq_files(rfq_id)`,
    );
    await q.query(`CREATE TABLE brand_rfq_offers (
      id uuid PRIMARY KEY, rfq_id uuid NOT NULL REFERENCES brand_rfqs(id) ON DELETE RESTRICT,
      manufacturer_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
      snapshot jsonb NOT NULL, hash varchar(64) NOT NULL, status varchar NOT NULL DEFAULT 'RECEIVED' CHECK(status IN ('RECEIVED','VERIFIED','REVOKED')),
      verified_by uuid REFERENCES users(id) ON DELETE RESTRICT, verified_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now()
    )`);
    await q.query(
      `CREATE INDEX brand_rfq_offers_parent ON brand_rfq_offers(rfq_id)`,
    );
    await q.query(
      `ALTER TABLE brand_rfqs ADD FOREIGN KEY(manufacturer_evidence_id) REFERENCES brand_rfq_files(id) ON DELETE RESTRICT, ADD FOREIGN KEY(accepted_offer_id) REFERENCES brand_rfq_offers(id) ON DELETE RESTRICT`,
    );
    await q.query(`CREATE TABLE brand_rfq_events (
      id uuid PRIMARY KEY, rfq_id uuid NOT NULL REFERENCES brand_rfqs(id) ON DELETE RESTRICT,
      revision int NOT NULL, actor_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
      action varchar NOT NULL, payload jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(rfq_id,revision)
    )`);
    await q.query(
      `CREATE FUNCTION rfq_immutable_row() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'RFQ evidence and events are append-only'; END $$`,
    );
    await q.query(
      `CREATE TRIGGER rfq_events_immutable BEFORE UPDATE OR DELETE ON brand_rfq_events FOR EACH ROW EXECUTE FUNCTION rfq_immutable_row()`,
    );
    await q.query(
      `CREATE TRIGGER rfq_files_immutable BEFORE UPDATE OR DELETE ON brand_rfq_files FOR EACH ROW EXECUTE FUNCTION rfq_immutable_row()`,
    );
    await q.query(`CREATE FUNCTION rfq_offer_snapshot_guard() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN
      IF NEW.snapshot IS DISTINCT FROM OLD.snapshot OR NEW.hash IS DISTINCT FROM OLD.hash OR NEW.rfq_id<>OLD.rfq_id OR NEW.manufacturer_id<>OLD.manufacturer_id THEN RAISE EXCEPTION 'Offer snapshot is immutable'; END IF; RETURN NEW; END $$`);
    await q.query(
      `CREATE TRIGGER rfq_offer_snapshot BEFORE UPDATE ON brand_rfq_offers FOR EACH ROW EXECUTE FUNCTION rfq_offer_snapshot_guard()`,
    );
    await q.query(`CREATE FUNCTION rfq_request_snapshot_guard() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN
      IF NEW.owner_id<>OLD.owner_id OR NEW.house_id<>OLD.house_id OR NEW.design_id<>OLD.design_id OR NEW.payload_hash<>OLD.payload_hash OR NEW.idempotency_key<>OLD.idempotency_key OR (OLD.status<>'DRAFT' AND NEW.details IS DISTINCT FROM OLD.details) OR (OLD.accepted_snapshot IS NOT NULL AND (NEW.accepted_snapshot IS DISTINCT FROM OLD.accepted_snapshot OR NEW.accepted_offer_id IS DISTINCT FROM OLD.accepted_offer_id)) THEN RAISE EXCEPTION 'RFQ lineage and accepted snapshot are immutable'; END IF; RETURN NEW; END $$`);
    await q.query(
      `CREATE TRIGGER rfq_request_snapshot BEFORE UPDATE ON brand_rfqs FOR EACH ROW EXECUTE FUNCTION rfq_request_snapshot_guard()`,
    );
  }
  async down(q: QueryRunner): Promise<void> {
    await q.query(
      `DO $$ BEGIN IF EXISTS(SELECT 1 FROM brand_rfqs) OR EXISTS(SELECT 1 FROM brand_line_profiles WHERE visibility='PRIVATE') THEN RAISE EXCEPTION 'Retain RFQ records and private-house guards; schema rollback with data is blocked'; END IF; END $$`,
    );
    await q.query(
      `ALTER TABLE brand_rfqs DROP CONSTRAINT brand_rfqs_manufacturer_evidence_id_fkey, DROP CONSTRAINT brand_rfqs_accepted_offer_id_fkey`,
    );
    await q.query(
      `DROP TABLE brand_rfq_events, brand_rfq_files, brand_rfq_offers, brand_rfqs`,
    );
    await q.query(
      `DROP FUNCTION rfq_immutable_row(), rfq_offer_snapshot_guard(), rfq_request_snapshot_guard()`,
    );
    await q.query(`ALTER TABLE brand_line_profiles DROP COLUMN visibility`);
  }
}
