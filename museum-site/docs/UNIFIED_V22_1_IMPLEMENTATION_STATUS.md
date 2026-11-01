# Unified V22.1 implementation status — 2026-10-09

Baseline: saved Site Version 23, source 0f1108ff509baa76725562873336cbc885afc419. Prompt V22.1 and Site version numbers are independent. Existing project/URL retained; no deployment or audience changes.

## Implemented in the existing experience

Entrance now opens a four-stage profile-preparation panel: personal information, required delivery address, explicit purpose confirmation (BOTH default), and CORE/legal confirmation boundary. Bounded field validation, international telephone format, field-specific errors, step navigation and review work locally. No registration success, identity, consent, age/email verification or account/ID creation is fabricated. No PII is POSTed, serialized, logged or saved in local storage; transient component state is discarded on unmount. Approved legal documents and CORE country validation are required before actual completion. The connection-check button reads the existing authentication capability denial and cannot grant identity or registration on an arbitrary HTTP 200.

Existing entry and commercial panels now contain interactive informational PAY NOW / FROM COMMISSION choices. Selecting a path only explains its requirements; it does not create an order, payment or deferred obligation. Verified offer acceptance and CORE authorization are required to accept any real order. Phase-one deferred orders are not paid; phase-two settlement uses only real VERIFIED AVAILABLE commission, never pending/reserved/negative or expected income. Production requires funded/settled, technical and rights authorization.

VIP/commercial status descriptions now distinguish bank/PSP payment evidence from an authoritative internal commission settlement; a bank webhook is not required for every internal settlement. Both need underlying real evidence and audit/idempotency controls owned by CORE.

V22.1's proposed Gold pricing basis differs from the earlier 1 kg gold-only display rule. Display now explicitly marks 1 kg gold + 1 kg silver and 2 kg silver as pending founder requirements, not approved prices. Premium remains blocked. No CORE price rule, quote, amount, ledger or commission allocation is changed. The 2% allocation base still requires the existing versioned CORE rule.

## Preserved / database

Museum entrance, doors, eighteen original images plus additional approved assets, Three.js room/renderer, actual GLB/PBR vitrine, spatial routes/exact return, original logo, collection windows, existing drafts, API guards, backend CORE reads/proxy and mutation-denial boundaries remain unchanged. No schema changes/migrations, new accounts, Master IDs, Wallet, Fit Profile, generation queue or second CORE.

## Changed files

components/registration-preparation.tsx; lib/registration-preparation.ts; components/order-funding-path.tsx; components/museum.tsx; components/entry-payment-law.tsx; lib/entry-law.ts; components/item-coin-law.tsx; components/commercial-readiness.tsx; components/vip-journey.tsx; app/globals.css; tests/registration-funding.mjs; this report.

## Tests

PASS: TypeScript, production build, registration-funding validation/privacy/SSR contracts, actual Three projection/resource contract, spatial/source preservation, real GLTFLoader/PBR fixture and transfer contract, CORE read contract, entrance gate, Museum tour, diff whitespace.

These use fixture data and GPU transport mocks where noted; they are not production registration/payment or browser evidence. No full API suite or new database mutation was needed/run. Prior API harness timeout is not declared fixed. Build retains a warning about a shared lazy Three chunk over 500 kB.

| Prompt test | Result and evidence |
| --- | --- |
| 1 Door entry | PASS local gate contract; browser NOT RUN |
| 2 Three navigation / return | PASS camera/spatial contracts; GPU/browser NOT RUN |
| 3 18 photos / pixel view | PASS source preservation; browser pixel view NOT RUN |
| 4 GLB/GLTF browser | NOT RUN; bounded embedded GLB/PBR fixture PASS; external glTF resources blocked |
| 5 Registration / existing ID | BLOCKED: authoritative mutation/identity contract absent |
| 6 Mandatory address | PASS form validation; real CORE address validation BLOCKED |
| 7 BOTH / verification | PASS purpose confirmation; real verification BLOCKED |
| 8 First 1,000 real orders | BLOCKED: cohort/offer/order contracts absent |
| 9 PAY NOW / deferred | PASS informational separation; real transactions BLOCKED |
| 10 LIVE / Coins | BLOCKED: approved quote/calculation/pricing policy absent |
| 11 Allocation / double debit | BLOCKED: no authoritative commission mutation adapter |
| 12 Partial/full settlement | BLOCKED: approved settlement/partial policy absent |
| 13 Reversals/refunds | BLOCKED: no real transaction/provider integration |
| 14 Production authorization | BLOCKED real integration; existing denial unchanged |
| 15 QR/QC/Passport | BLOCKED authoritative integration |
| 16 Browser/mobile | NOT RUN |
| 17 Existing data | PASS byte-preserved assets/API/storage contract; no DB writes |
| 18 CORE unavailable | PASS read-error contract and UI no-submission boundary; runtime E2E NOT RUN |

## Staging blockers / required dependencies

Existing CORE source/API contracts and authorized staging access for shared identity/session, registration/profile completion, Master ID lookup/idempotent creation, addresses/country rules/snapshots, consent/document versions, three verification projections, cohort access, verified offers/orders, bank/PSP and atomic commission settlement, payout/ledger/reserves/reversals, source/rights/versions, Meshy jobs/credits/results, Fit, measurable calculation, production/QC/Passport/QR. No guessed endpoint or fake backend has been added. The only unchanged CORE-backed screens remain public catalog/collection/model and live-price/identity read projections where the external service returns valid data; this turn did not prove their live reachability.

The founder-private instruction in the supplied prompt is not deployment authorization. Before LIVE require approved versioned financial rules, real CORE staging and provider evidence, browser/mobile/GPU E2E and explicit founder approval. This version is save-only.

Browser QA was skipped per Sites SKILL.md: “If `$control-browser` is unavailable, skip browser QA”. No browser workaround or preview server was used.
