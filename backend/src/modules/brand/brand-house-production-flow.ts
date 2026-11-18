/**
 * MERGE Brand House: product publication workflow.
 * Pure domain guard; does not create orders, move money, or authorize production.
 * Persist transitions through the existing CORE audit and authorization layer.
 */
export type ProductStage =
  | 'IMAGE_DRAFT'
  | 'THREE_D_GENERATING'
  | 'THREE_D_READY'
  | 'VISUAL_REVIEW'
  | 'VISUAL_APPROVED'
  | 'PARTNER_RFQ'
  | 'PARTNER_RESPONSE'
  | 'VERIFIED_OFFER'
  | 'PUBLISHED'
  | 'ARCHIVED';

export interface ProductGate {
  ownerUserId: string;
  brandHouseOwnerUserId: string;
  hasOriginalImage: boolean;
  hasReady3D: boolean;
  visualApprovedByOwner: boolean;
  partnerResponseVerified: boolean;
  offerApprovedByOwner: boolean;
  publicationRightsConfirmed: boolean;
}

const transitions: Record<ProductStage, readonly ProductStage[]> = {
  IMAGE_DRAFT: ['THREE_D_GENERATING', 'ARCHIVED'],
  THREE_D_GENERATING: ['THREE_D_READY', 'IMAGE_DRAFT', 'ARCHIVED'],
  THREE_D_READY: ['VISUAL_REVIEW', 'ARCHIVED'],
  VISUAL_REVIEW: ['VISUAL_APPROVED', 'THREE_D_GENERATING', 'ARCHIVED'],
  VISUAL_APPROVED: ['PARTNER_RFQ', 'VISUAL_REVIEW', 'ARCHIVED'],
  PARTNER_RFQ: ['PARTNER_RESPONSE', 'ARCHIVED'],
  PARTNER_RESPONSE: ['VERIFIED_OFFER', 'PARTNER_RFQ', 'ARCHIVED'],
  VERIFIED_OFFER: ['PUBLISHED', 'PARTNER_RFQ', 'ARCHIVED'],
  PUBLISHED: ['ARCHIVED'],
  ARCHIVED: [],
};

export function assertProductTransition(
  from: ProductStage,
  to: ProductStage,
  actorUserId: string,
  gate: ProductGate,
): void {
  if (actorUserId !== gate.ownerUserId ||
      gate.ownerUserId !== gate.brandHouseOwnerUserId) {
    throw new Error('Brand House ownership required');
  }
  if (!transitions[from].includes(to)) {
    throw new Error('Invalid product stage transition');
  }
  if (to === 'THREE_D_GENERATING' && !gate.hasOriginalImage) {
    throw new Error('Original image required');
  }
  if (to === 'VISUAL_REVIEW' && !gate.hasReady3D) {
    throw new Error('Ready 3D model required');
  }
  if (to === 'VISUAL_APPROVED' && !gate.visualApprovedByOwner) {
    throw new Error('Owner visual approval required');
  }
  if (to === 'VERIFIED_OFFER' && !gate.partnerResponseVerified) {
    throw new Error('Verified partner response required');
  }
  if (to === 'PUBLISHED' &&
      (!gate.partnerResponseVerified ||
       !gate.offerApprovedByOwner ||
       !gate.publicationRightsConfirmed)) {
    throw new Error('Verified offer, owner approval and publication rights required');
  }
}
