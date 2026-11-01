# Item weight, Coin and commission settlement — 2026-10-09

Baseline: saved Version 18, source `0ec7aeb69f9ef686f638c1cac67fb5064ed7e468`.

## Delivered

One shared Georgian disclosure now appears in Museum exhibit dossiers, Gold/Silver entry rules (also /transparency), and the existing commercial-readiness panel. Founder examples: 1 kg item = 1 MERGE Coin; 10 kg = 10 MERGE Coins. Money must come from the authoritative approved material LIVE snapshot and pricing rule. Specific-item payment from earned commission requires CORE-confirmed available balance and a settlement record tied to the verified offer/order.

The existing Silver entry basis (2 kg silver value per minimum Coin) and Gold entry basis (1 kg gold value) remain distinct from the item weight and physical Coin mass. No client calculation, balance, quote, order, ledger, payment evidence or price source was introduced. No payment action becomes enabled by these disclosures.

## Preserved

Entrance, doors, halls, spatial renderer, original uploaded images, navigation, collection windows, logo, existing drafts, existing CORE read adapters and all API security boundaries are untouched. No database changes or migrations; no deployment or audience changes.

## Files

- components/item-coin-law.tsx (new shared disclosure)
- components/entry-payment-law.tsx
- components/museum-point-dossier.tsx
- components/commercial-readiness.tsx
- app/globals.css (responsive styling within existing palette)
- tests/foundation-api.mjs (existing SSR disclosure check extended)
- this report

## Required CORE contract before staging

Obtain the existing commission/settlement endpoint and authenticated identity/permissions mapping; approved item/pricing weight definition for multi-material and original-manufacturer components; fractional Coin precision and rounding; line-specific versioned pricing policy; approved LIVE quote with currency/source/timestamp/expiry; immutable product/version/verified-offer/order IDs; available balance accounting after reserves, negative balances and reversals; atomic idempotent settlement tied to the order; authoritative payment evidence and audit/reversal handling. Partial settlement is unspecified and must remain blocked until approved. Museum must never debit locally or turn displayed examples into live prices.

## Unavailable

Real commission debit, CORE order/payment/production/QC/Passport, shared CORE session, authoritative fitting/version creation and Meshy generation remain unavailable in the current adapters. Existing public catalog/collection/material-price/identity read routes remain unchanged; this change does not prove the external service is reachable or its price snapshot approved. No supplier, manufacturer, patent or partner evidence is fabricated.

## Verification

TypeScript and production build passed. Local API/SSR and Museum navigation contract results recorded below after execution. Browser QA unavailable in this managed runtime; no browser end-to-end or real CORE staging/payment evidence is claimed. LIVE requires staging, browser and financial evidence plus explicit founder approval.

- PASS: TypeScript, production build, Museum tour, canonical gate, spatial contract and diff whitespace checks.
- PASS: isolated authenticated /api/system read and /transparency SSR with the item/commission rule, original line rules, seven preserved disclosure accordions and no payment form.
- Full foundation API suite: initial run failed because the fresh local test D1 schema was uninitialized. Existing migration was applied locally only; rerun passed the draft ownership/lineage/idempotency and commerce-denial assertions, then timed out on GET /api/system. Isolated authenticated system read passed. Full API suite remains NOT PASSED; boundary suite was not reached. No production DB change or fix is claimed for this harness timeout.
- Browser, real CORE staging, payment and production evidence: NOT RUN / dependencies required.
