import { assertProductTransition, ProductGate } from './brand-house-production-flow';

const approved: ProductGate = {
  ownerUserId: 'owner-1',
  brandHouseOwnerUserId: 'owner-1',
  hasOriginalImage: true,
  hasReady3D: true,
  visualApprovedByOwner: true,
  partnerResponseVerified: true,
  offerApprovedByOwner: true,
  publicationRightsConfirmed: true,
};

describe('Brand House product workflow gates', () => {
  it('allows image to 3D generation', () => {
    expect(() => assertProductTransition('IMAGE_DRAFT', 'THREE_D_GENERATING', 'owner-1', approved)).not.toThrow();
  });
  it('rejects publishing without partner verification', () => {
    expect(() => assertProductTransition('VERIFIED_OFFER', 'PUBLISHED', 'owner-1', { ...approved, partnerResponseVerified: false })).toThrow();
  });
  it('rejects publishing without owner approval', () => {
    expect(() => assertProductTransition('VERIFIED_OFFER', 'PUBLISHED', 'owner-1', { ...approved, offerApprovedByOwner: false })).toThrow();
  });
  it('rejects publishing without publication rights', () => {
    expect(() => assertProductTransition('VERIFIED_OFFER', 'PUBLISHED', 'owner-1', { ...approved, publicationRightsConfirmed: false })).toThrow();
  });
  it('rejects cross-user changes', () => {
    expect(() => assertProductTransition('VERIFIED_OFFER', 'PUBLISHED', 'other-user', approved)).toThrow();
  });
  it('rejects bypassing visual review and partner RFQ', () => {
    expect(() => assertProductTransition('IMAGE_DRAFT', 'PUBLISHED', 'owner-1', approved)).toThrow();
  });
  it('allows approved product publication', () => {
    expect(() => assertProductTransition('VERIFIED_OFFER', 'PUBLISHED', 'owner-1', approved)).not.toThrow();
  });
});
