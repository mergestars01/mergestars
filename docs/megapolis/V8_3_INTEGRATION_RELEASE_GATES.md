# MERGE ⭐ STARS — MEGAPOLIS V8.3 Integration & Release Gates
Status: **AUDIT IN PROGRESS — NOT DEPLOYABLE**
Repository: `mergestars01/mergestars`
Target: existing `https://mergestars.com` (no replacement website).
Branch: `feature/megapolis-v83-integration`

## Verified repository facts (2026-11-18)
- `backend/`: NestJS, TypeORM, PostgreSQL dependencies; existing API and domain state require source-level audit.
- `frontend/`: React, Vite, i18next, React Three Fiber.
- `museum-site/`: Vinext/Cloudflare Workers, D1, separate deployment and identity/storage model; export described as Site v78 in `HOSTED_SITE_HANDOFF.md`.
- `deploy/`: existing VPS deployment tools; documentation warns that these deploy the older frontend/backend, **not** `museum-site/`.
- The museum export does **not** include production D1 data or ready-to-use CORE authentication, payment, Meshy or manufacturing credentials.
- Historical tests in docs are not current CI evidence. No production, database or PSP verification has been performed in this branch.

## Non-negotiable invariants
1. Preserve CORE, original data, user IDs, order history, audit history, IP and exact official logo assets. No destructive migration.
2. CORE is authoritative for identity, product lineage, offers, orders, payments and commissions. Museum is experience layer; never trust client-supplied identity headers.
3. No payment verification = no production authorization. No internal wallets or fictitious balances.
4. Physical MERGE COIN = opening round luxury case, not cryptocurrency.
5. Silver Coin live commercial reference: 1 kg Ag 999.9; Gold Coin: 1 kg Au 999.9. A market reference is not a verified manufacturer offer.
6. Silver approved commission base: 33%, 16.5% source + 16.5% destination. Gold policy independent. Platform fee base must be formally approved; never duplicate fees.
7. No branch merge, production deploy, live PSP activation or production-data change without founder approval.

## Implementation sequence
### Gate 0 — Baseline & backups
- [ ] Identify deployed production commit, runtime, DNS/hosting and actual CORE schema.
- [ ] Secure database backup and tested restore; inventory assets and logo hashes.
- [ ] Run existing frontend/backend/museum builds, typecheck, lint, unit/contract and PostgreSQL tests; record logs and failing tests.
- [ ] Compare API contracts, session claims and entity ownership boundaries.

### Gate 1 — Unified identity and experience
- [ ] Define verified CORE session to Museum identity adapter (no mock auth in production).
- [ ] Same-origin routing on mergestars.com with preserved existing URLs and redirects.
- [ ] English canonical locale, browser-language suggestion, explicit language selector, saved preference and fallback; geography alone does not prove a user's language.
- [ ] Accessible mobile Lite mode and optional cinematic 3D; no mandatory heavy loading.

### Gate 2 — Product and House domains
- [ ] Twelve industry destinations and unlimited owner-scoped Brand Houses.
- [ ] Design save -> private museum -> versioned product lineage -> 3D queue; provider adapters with rate limits and clear failure states.
- [ ] Preserve approved original MERGE logo by exact source asset, not AI recreation.
- [ ] AI Creative Studio V8.3: storyboards, image/video/3D-to-video provider adapters, consent, rights, moderation, job status, quota, media provenance and publishing review.

### Gate 3 — Verified commerce
- [ ] Manufacturer/brand RFQ, signed and versioned verified offers, brand permissions.
- [ ] Real PSP/bank event verification, idempotency, refunds, chargebacks, commission reconciliation, direct bank payout records.
- [ ] Payment-confirmed production gate, manufacturer contract, QC evidence, product passport and QR.

### Gate 4 — International legal controls
- [ ] Country-by-country commerce release gates: entity/seller disclosures, local consumer terms, tax, customs, sanctions, product safety, privacy, data transfer and AI/IP consent.
- [ ] Legal document versioning and proof of acceptance; counsel review for each activated country.

### Gate 5 — Release
- [ ] Staging with isolated database and fake PSP/provider keys; end-to-end tests including ownership isolation, refunds and mobile.
- [ ] Rollback plan, monitoring, incident response, security review and written founder go-live approval.

## Immediate blockers
- Current production runtime and deployed commit not verified.
- Museum's Cloudflare/D1 model is incompatible with blindly copying it into the existing VPS app.
- Production CORE-to-Museum auth mapping and D1 migration need explicit design.
- Payment, manufacturer, QC and passport integrations need live-provider contracts and end-to-end tests.

**This document is an integration work order, not a claim that features are implemented or the domain is ready for deployment.**
