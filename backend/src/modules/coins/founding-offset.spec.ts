import { foundingOffset } from './founding-offset';
const input = {
  registeredAt: Date.parse('2026-11-15T11:00:00+04:00'),
  houseReadyAt: Date.parse('2027-01-13T23:30:00+04:00'),
  catalogReadyAt: Date.parse('2027-01-13T23:59:59.999+04:00'),
  beneficiaryId: 'house',
  payerId: 'customer',
  paymentVerified: true,
  commissionAvailableMinor: 500000,
  line: 'silver' as const,
  verifiedPricingWeightKg: '1',
  eventAt: Date.parse('2027-01-14T11:00:00+04:00'),
  silverMinorPerKg: 200000,
  sourceTimestamp: Date.parse('2027-01-14T10:59:50+04:00'),
  maxAgeMs: 60000,
  sourceApproved: true,
};
describe('Founding commission offset decision', () => {
  it('deducts Coin price at the commission event and retains excess', () =>
    expect(foundingOffset(input)).toMatchObject({
      deductedMinor: 200000,
      remainingCommissionMinor: 300000,
      outstandingMinor: 0,
      status: 'SETTLED',
    }));
  it('does not treat insufficient commission as paid', () =>
    expect(
      foundingOffset({ ...input, commissionAvailableMinor: 100000 }),
    ).toMatchObject({ outstandingMinor: 100000, status: 'PARTIALLY_SETTLED' }));
  it('does not reprice an existing lock when the market moves', () =>
    expect(
      foundingOffset({
        ...input,
        lockedOutstandingMinor: 300000,
        silverMinorPerKg: 900000,
      }),
    ).toMatchObject({ deductedMinor: 300000 }));
  it.each([
    { paymentVerified: false },
    { payerId: 'house' },
    { houseReadyAt: 0 },
    { catalogReadyAt: Date.parse('2027-01-14T00:00:00+04:00') },
    { sourceApproved: false },
    { sourceTimestamp: 0 },
    { commissionAvailableMinor: -1 },
    { commissionAvailableMinor: 0 },
  ])('rejects unverified eligibility/event/price %p', (patch) =>
    expect(() => foundingOffset({ ...input, ...patch })).toThrow(),
  );
});
