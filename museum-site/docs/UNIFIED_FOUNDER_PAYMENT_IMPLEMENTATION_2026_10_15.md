# Unified Founder payment / package correction — 15 October 2026

Baseline: native saved Version 44, pushed source `12da157cbc1ef567ebabce895fdd119afab61696`, same existing owner-private Site. No new Site, access change or public launch is part of this update.

## What changed

Both SILVER and GOLD specification previews show twelve Brand Lines within one Brand House/catalog. Silver commercial order and physical case contain one product. Gold commercial package and physical case contain twelve products, retaining the prior combined 1,000 g finished MERGE 8K composite cap. That cap is not assigned to Silver; no equal item weight is invented. Gold physical case/package count remains pending when verified weights or packing are unknown.

The first 1,000 registrations are described as eligible for deferred payment, from real earned, verified AVAILABLE commissions / MERGE Coin credit recorded by CORE. The Museum cannot grant a cohort place, convert currency/Coin, mint balances, accept payment, create an order or authorize production. NOW and FROM COMMISSION controls display terms only. Pending/reserved/negative balances remain excluded.

Both lines share the latest Founder allocation specification: company 33%, metal 33%, Source 16.5%, Destination 16.5%, physical construction 1% = 100% of the product base. A single Source/Destination House receives the combined 33% once. Platform service 2% is separate, with no repeated charge on the same sale's internal technical/commission transfers. Actual fee base/mode, tax base/inclusion, currency, contract version and settlement require authoritative CORE confirmation.

The obsolete automatic P+P metal-price illustration is removed, together with the conflicting Silver 25/25/50 and common one-product physical-case statements. No historical accepted CORE order/contract is repriced. The unchanged raw CORE metal reference remains visible per kilogram and troy ounce. Coin base and verified payable price remain pending; the Museum derives no new offer from spot price or allocation percentages. The Founder-supplied USD 2,000 / USD 130,000 examples are explicitly labelled illustrative and independent of the live feed.

## Preserved

Exact official company logo; closed/open entrance assets and sequence; current city/avatar artwork; all twelve thematic Houses; original navigation/hotspot actions; saved private drafts and immutable intent schema; shared polling/cancellation/error behavior; authoritative identity, price, permission and commerce boundaries. No new image or logo was generated.

## Data and integration boundaries

Database/schema/migration changes: NONE. API/CORE client/contract changes: NONE. No CORE ownership, cohort, Brand Line, financial, price-source, payment, production, Passport or history record is written. Existing Site draft storage remains a private experience brief, not another CORE catalog or ledger.

Real data still used by these screens: the sky Coins, clicked-metal details and MERGE PULSE read the existing CORE metal-price projection through `/api/core/prices`. This task does not prove original quote freshness or add a verified Coin-pricing endpoint. Museum artwork and private request drafts remain presentation/user intent, not authoritative paid entitlements.

## Verification

PASS: TypeScript `--noEmit --incremental false`; `tests/coin-museum.mjs`; `tests/coin-sky-prices.mjs`; `tests/registration-funding.mjs`; `tests/photo-megapolis.mjs`; `tests/museum-gate.mjs`; `tests/core-read-contract.mjs`; `git diff --check`.

The package/case checks include both twelve-line previews, Silver/Gold contents, unknown Gold weights, unconfirmed entitlements, strict intent and blocked commerce writes. Financial checks confirm exact basis-point sums and both supplied examples in integer cents, the single 33% same-House share and separate 2% example fee. These are specification/contract/SSR checks, not evidence of real payments or distribution.

The production build is required by the source packaging workflow; this document does not pre-assert its outcome. The final native deployment result and user-facing version number must be reported only after they return.

FAIL: no unresolved failure in the checks above. One whitespace issue found by diff validation was corrected before final verification.

NOT RUN: preview-dependent HTTP `tests/foundation-api.mjs`, browser/GPU/mobile visual QA, real CORE staging identity/cohort/entitlement/settlement, payment/permission/production/QC/Passport end-to-end proof. Its HTTP assertions were updated for the new specification, but the HTTP runner was not started. In this managed environment the Sites browser-control capability is absent; the [Sites skill](skill://plugin_connector_1p_689987207de08191979cf68eca2941c6/sites/SKILL.md) instructs: “If `$control-browser` is unavailable, skip browser QA”. No alternate preview/browser path was used.

## External dependencies and release blockers

Before commercial staging: approved existing CORE contracts for registration order/cohort/access, twelve actual Brand Line records, Product/case membership and verified weights, geometry/material calculation, final Coin price/offer, approved contract/fee/tax determination, QR attribution and construction-fund accounting. Also required: atomic available-commission Coin settlement with idempotency and concurrency proof, PSP/payment evidence, reserve/refund/reversal/chargeback controls, manufacturer acceptance, production/QC and Passport. Supplier/manufacturer/material/legal documents remain unverified by this implementation.

Before public LIVE: real CORE staging pass, browser/mobile end-to-end pass, payment/permission/production evidence, approved commercial/refund/material terms, reconciled offers/taxes and explicit Founder public-release approval. The private experience update is not a public launch or activation of commercial settlement.

## Files changed

- `lib/founder-payment-law.ts`
- `lib/coin-product-law.ts`
- `lib/entry-law.ts`
- `lib/coin-museum.ts`
- `lib/coin-market-disclosure.ts`
- `components/entry-payment-law.tsx`
- `components/item-coin-law.tsx`
- `components/gold-package-preview.tsx`
- `components/commercial-allocation-law.tsx`
- `components/order-funding-path.tsx`
- `components/coin-brand-museum.tsx`
- `components/atelier-library.tsx`
- `components/coin-sky-prices.tsx`
- `components/coin-pulse-panel.tsx`
- `app/transparency/page.tsx`
- `app/globals.css`
- `app/photo-megapolis.css`
- `docs/COIN_SKY_LIVE_PRICE_PROMPT.md`
- `docs/V22_7_GOLD_SILVER_PACKAGE_EXTENSION.md`
- `tests/coin-museum.mjs`
- `tests/coin-sky-prices.mjs`
- `tests/registration-funding.mjs`
- `tests/photo-megapolis.mjs`
- `tests/foundation-api.mjs`
- `docs/UNIFIED_FOUNDER_PAYMENT_IMPLEMENTATION_2026_10_15.md` (this report)
