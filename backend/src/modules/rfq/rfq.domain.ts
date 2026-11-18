import { BadRequestException, ConflictException } from '@nestjs/common';
import { createHash } from 'crypto';
import { industryDestinations } from '../catalog/industry-destinations';

export const industries = industryDestinations.map(({ code }) => code);
export const rfqStatuses = [
  'DRAFT',
  'RFQ_SUBMITTED',
  'UNDER_REVIEW',
  'BRAND_CONTACTED',
  'APPROVAL_PENDING',
  'OFFER_RECEIVED',
  'VERIFIED_OFFER',
  'ACCEPTED',
  'REJECTED',
  'CANCELLED',
] as const;
export type RfqStatus = (typeof rfqStatuses)[number];
export type ApprovalKind = 'BRAND' | 'TECHNICAL' | 'COMMERCIAL';
export type Approval = {
  decision: 'APPROVED' | 'REJECTED' | 'NOT_REQUIRED';
  evidenceFileId: string | null;
  evidenceHash: string | null;
  actorId: string;
  recordedAt: string;
  offerId: string | null;
  reason: string;
};
export type Approvals = Partial<Record<ApprovalKind, Approval>>;
export type RfqDetails = {
  industry: string;
  category: string;
  title: string;
  description?: string;
  requestedBrand?: string;
  referenceProduct?: string;
  referenceUrl?: string;
  material: string;
  finishes?: string;
  mosaic?: string;
  dimensions?: string;
  quantity: number;
  countryCode: string;
  city: string;
  preferredTimeframe?: string;
  specifications: Record<string, string>;
};
export type OfferSnapshot = {
  amountMinor: number;
  currency: string;
  currencyExponent: number;
  quantity: number;
  materials: string;
  deliveryDays: number;
  validUntil: string;
  terms: string;
  taxTreatment: string;
  shippingTerms: string;
  manufacturerReference: string;
  responseFileId: string;
  responseHash: string;
  pricingPolicy: 'rfq-reviewed-offer-2026-11-08-v1';
};
export function fingerprint(value: unknown): string {
  const stable = (v: unknown): unknown =>
    Array.isArray(v)
      ? v.map(stable)
      : v && typeof v === 'object'
        ? Object.fromEntries(
            Object.entries(v)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([k, x]) => [k, stable(x)]),
          )
        : v;
  return createHash('sha256')
    .update(JSON.stringify(stable(value)))
    .digest('hex');
}
export function checkDetails(details: RfqDetails) {
  if (details.referenceUrl) {
    let url: URL;
    try {
      url = new URL(details.referenceUrl);
    } catch {
      throw new BadRequestException('Invalid reference URL');
    }
    if (url.protocol !== 'https:' || url.username || url.password)
      throw new BadRequestException(
        'HTTPS reference without credentials required',
      );
  }
  const entries = Object.entries(details.specifications);
  if (
    entries.length > 12 ||
    entries.some(
      ([k, v]) =>
        !/^[a-zA-Z][a-zA-Z0-9_]{0,39}$/.test(k) ||
        typeof v !== 'string' ||
        v.length > 500,
    )
  )
    throw new BadRequestException('Invalid category specifications');
}
const transitions: Partial<
  Record<RfqStatus, Partial<Record<string, RfqStatus>>>
> = {
  RFQ_SUBMITTED: { START_REVIEW: 'UNDER_REVIEW' },
  UNDER_REVIEW: {
    CONTACT_RECORDED: 'BRAND_CONTACTED',
    AWAIT_APPROVAL: 'APPROVAL_PENDING',
  },
  BRAND_CONTACTED: {
    CONTACT_RECORDED: 'BRAND_CONTACTED',
    AWAIT_APPROVAL: 'APPROVAL_PENDING',
  },
  APPROVAL_PENDING: {
    CONTACT_RECORDED: 'BRAND_CONTACTED',
    AWAIT_APPROVAL: 'APPROVAL_PENDING',
  },
};
export function nextStaffState(status: RfqStatus, action: string): RfqStatus {
  if (
    action === 'REJECT' &&
    status !== 'DRAFT' &&
    !['REJECTED', 'CANCELLED'].includes(status)
  )
    return 'REJECTED';
  const next = transitions[status]?.[action];
  if (!next) throw new ConflictException('Invalid RFQ transition');
  return next;
}
export function assertOfferReady(
  approvals: Approvals,
  offerId: string,
  snapshot: OfferSnapshot,
  assignedId: string | null,
  authorId: string,
  now: number,
) {
  if (!assignedId || assignedId !== authorId)
    throw new ConflictException('Verified manufacturer assignment required');
  if (
    !['APPROVED', 'NOT_REQUIRED'].includes(approvals.BRAND?.decision ?? '') ||
    approvals.TECHNICAL?.decision !== 'APPROVED' ||
    approvals.COMMERCIAL?.decision !== 'APPROVED' ||
    approvals.COMMERCIAL.offerId !== offerId
  )
    throw new ConflictException(
      'Independent brand, technical and commercial approvals required',
    );
  if (
    !Number.isSafeInteger(snapshot.amountMinor) ||
    snapshot.amountMinor <= 0 ||
    !Number.isFinite(Date.parse(snapshot.validUntil)) ||
    Date.parse(snapshot.validUntil) <= now
  )
    throw new ConflictException('Valid, unexpired price snapshot required');
}
