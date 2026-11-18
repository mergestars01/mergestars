import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import type {
  Approvals,
  OfferSnapshot,
  RfqDetails,
  RfqStatus,
} from './rfq.domain';

@Entity('brand_rfqs')
@Unique(['ownerId', 'idempotencyKey'])
export class BrandRfq {
  @PrimaryColumn('uuid') id: string;
  @Column({ name: 'owner_id', type: 'uuid' }) ownerId: string;
  @Column({ name: 'house_id', type: 'uuid' }) houseId: string;
  @Column({ name: 'design_id', type: 'uuid' }) designId: string;
  @Column({ name: 'idempotency_key' }) idempotencyKey: string;
  @Column({ name: 'payload_hash' }) payloadHash: string;
  @Column({ type: 'int', default: 0 }) revision: number;
  @Column({ type: 'varchar' }) status: RfqStatus;
  @Column({ type: 'jsonb' }) details: RfqDetails;
  @Column({ type: 'jsonb', default: {} }) approvals: Approvals;
  @Column({ type: 'jsonb', nullable: true }) consent: {
    version: string;
    at: string;
  } | null;
  @Column({ name: 'manufacturer_id', type: 'uuid', nullable: true })
  manufacturerId: string | null;
  @Column({ name: 'manufacturer_evidence_id', type: 'uuid', nullable: true })
  manufacturerEvidenceId: string | null;
  @Column({ name: 'accepted_offer_id', type: 'uuid', nullable: true })
  acceptedOfferId: string | null;
  @Column({ name: 'accepted_snapshot', type: 'jsonb', nullable: true })
  acceptedSnapshot: OfferSnapshot | null;
  @Column({ name: 'submitted_at', type: 'timestamptz', nullable: true })
  submittedAt: Date | null;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
@Entity('brand_rfq_files')
export class RfqFile {
  @PrimaryColumn('uuid') id: string;
  @Column({ name: 'rfq_id', type: 'uuid' }) rfqId: string;
  @Column({ name: 'actor_id', type: 'uuid' }) actorId: string;
  @Column() kind: string;
  @Column() name: string;
  @Column() mime: string;
  @Column({ type: 'int' }) size: number;
  @Column() hash: string;
  @Column({ type: 'bytea', select: false }) bytes: Buffer;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
@Entity('brand_rfq_offers')
export class RfqOffer {
  @PrimaryColumn('uuid') id: string;
  @Column({ name: 'rfq_id', type: 'uuid' }) rfqId: string;
  @Column({ name: 'manufacturer_id', type: 'uuid' }) manufacturerId: string;
  @Column({ type: 'jsonb' }) snapshot: OfferSnapshot;
  @Column() hash: string;
  @Column({ type: 'varchar', default: 'RECEIVED' })
  status: 'RECEIVED' | 'VERIFIED' | 'REVOKED';
  @Column({ name: 'verified_by', type: 'uuid', nullable: true }) verifiedBy:
    | string
    | null;
  @Column({ name: 'verified_at', type: 'timestamptz', nullable: true })
  verifiedAt: Date | null;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
@Entity('brand_rfq_events')
@Unique(['rfqId', 'revision'])
export class RfqEvent {
  @PrimaryColumn('uuid') id: string;
  @Column({ name: 'rfq_id', type: 'uuid' }) rfqId: string;
  @Column({ type: 'int' }) revision: number;
  @Column({ name: 'actor_id', type: 'uuid' }) actorId: string;
  @Column() action: string;
  @Column({ type: 'jsonb' }) payload: Record<string, unknown>;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
