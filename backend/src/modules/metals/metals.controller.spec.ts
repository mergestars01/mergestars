import { MetalsController } from './metals.controller';
import { MetalsService } from './metals.service';
import { PRICING_RULE_VERSION } from '../coins/coin-pricing';

describe('Brand Line reference under corrected rule', () => {
  it('quotes Gold from gold alone, even when silver is unavailable', () => {
    const service = {
      getLive: () => [{ metal: 'gold', pricePerKgUsd: 100000 }],
    } as unknown as MetalsService;
    expect(new MetalsController(service).reference()).toMatchObject({
      ruleVersion: PRICING_RULE_VERSION,
      goldMinor: 10000000,
      silverMinor: null,
      finalOrderAllowed: false,
      kind: 'REFERENCE_ONLY',
    });
  });
  it('quotes Silver at one kg without doubling the reference', () => {
    const service = {
      getLive: () => [{ metal: 'silver', pricePerKgUsd: 2000 }],
    } as unknown as MetalsService;
    expect(new MetalsController(service).reference()).toMatchObject({
      ruleVersion: PRICING_RULE_VERSION,
      silverMinor: 200000,
    });
  });
  it('does not invent a quote when neither metal is available', () => {
    const service = { getLive: () => [] } as unknown as MetalsService;
    expect(new MetalsController(service).reference()).toMatchObject({
      goldMinor: null,
      silverMinor: null,
    });
  });
});
