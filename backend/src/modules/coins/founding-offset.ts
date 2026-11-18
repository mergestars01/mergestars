import { BadRequestException } from '@nestjs/common';
import {
  BrandLine,
  calculateBrandLinePrice,
  PRICING_RULE_VERSION,
} from './coin-pricing';

// Midnight at the start of 14 January in Tbilisi closes new qualification.
const qualificationDeadline = Date.parse('2027-01-14T00:00:00+04:00');

/** Calculate a possible offset from separately verified CORE evidence. */
export function foundingOffset(input: {
  registeredAt: number;
  houseReadyAt: number;
  catalogReadyAt: number;
  beneficiaryId: string;
  payerId: string;
  paymentVerified: boolean;
  commissionAvailableMinor: number;
  line: BrandLine;
  verifiedPricingWeightKg: string;
  eventAt: number;
  silverMinorPerKg: number;
  goldMinorPerKg?: number;
  sourceTimestamp: number;
  maxAgeMs: number;
  sourceApproved: boolean;
  lockedOutstandingMinor?: number;
}) {
  const i = input;
  const qualifiedBeforeCutoff = [
    i.registeredAt,
    i.houseReadyAt,
    i.catalogReadyAt,
  ].every(
    (at) =>
      Number.isSafeInteger(at) &&
      at > 0 &&
      at <= i.eventAt &&
      at < qualificationDeadline,
  );
  if (
    !Number.isFinite(i.eventAt) ||
    !qualifiedBeforeCutoff ||
    !i.beneficiaryId ||
    !i.payerId ||
    i.beneficiaryId === i.payerId ||
    !i.paymentVerified ||
    !Number.isSafeInteger(i.commissionAvailableMinor) ||
    i.commissionAvailableMinor <= 0
  )
    throw new BadRequestException(
      'Verified third-party payment and available founding commission required',
    );
  let outstanding = i.lockedOutstandingMinor;
  if (outstanding === undefined) {
    const age = i.eventAt - i.sourceTimestamp;
    if (
      !i.sourceApproved ||
      !Number.isFinite(age) ||
      age < 0 ||
      !Number.isFinite(i.maxAgeMs) ||
      i.maxAgeMs <= 0 ||
      age > i.maxAgeMs
    )
      throw new BadRequestException('Verified event-time price required');
    outstanding = calculateBrandLinePrice(
      i.line,
      i.verifiedPricingWeightKg,
      i.silverMinorPerKg,
      i.goldMinorPerKg,
    );
  }
  if (!Number.isSafeInteger(outstanding) || outstanding < 0)
    throw new BadRequestException('Invalid locked outstanding amount');
  const deductedMinor = Math.min(outstanding, i.commissionAvailableMinor);
  return {
    ruleVersion: PRICING_RULE_VERSION,
    lockedOutstandingBeforeMinor: outstanding,
    deductedMinor,
    outstandingMinor: outstanding - deductedMinor,
    remainingCommissionMinor: i.commissionAvailableMinor - deductedMinor,
    status: outstanding === deductedMinor ? 'SETTLED' : 'PARTIALLY_SETTLED',
  };
}
