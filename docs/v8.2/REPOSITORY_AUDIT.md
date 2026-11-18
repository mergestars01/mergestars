# MERGE V8.2 repository audit

Baseline inspected on 18 November 2026, Tbilisi time. Repository `mergestars01/mergestars`, `main` at `b2881b701c3b8413e6316cc186d8bef7f00bb77f`. The remote advertised one branch and no tags at discovery. The baseline contained 1,272 tracked files. Implementation uses `codex/v8.2-core-foundation`.

The V8.0 specification was read alongside the V8.2 directive. The R7.1 handoff's checksums and three-patch chain were verified in a detached worktree at the same baseline. Its reconstructed tree was `5387b8748aeead1b3f98dc54cfba6e8607e83236`. Its historical test reports are separate from the results in this branch.

## Architecture inventory

| Area | Entry points and evidence |
| --- | --- |
| CORE | NestJS starts at `backend/src/main.ts`, mounts `/api`, and wires application modules in `backend/src/app.module.ts`. `openapi.yaml` is the handoff API description. Controller decorators and integration tests are the source for route verification. |
| Main web application | Vite and React start at `frontend/src/main.tsx` and use the router in `frontend/src/App.tsx`. `frontend/src/router/index.tsx` defines another router outside that entry path. The main routes use the Living Museum and existing CORE API client. |
| V78 export | `museum-site/app/page.tsx`, `museum-site/app/api/`, `museum-site/lib/core-client.ts`, `museum-site/app/chatgpt-auth.ts`, `museum-site/db/`, and `museum-site/drizzle/` make up the separate Vinext/Cloudflare/D1 reference export. Its auth adapter and private data are specific to the original hosting environment. `HOSTED_SITE_HANDOFF.md` describes the export. The VPS build does not include it. |
| PostgreSQL | `backend/src/database/entities/index.ts` registers 24 entity classes. Data covers users, verification and recovery tokens, referrals, contacts, settings, notifications, metal prices, applications, orders, catalog orders, catalog collections and products, Brand Line profiles, historical wallet transactions, Fit profiles, design proposals, interactions, and material lab events/files. The 13 baseline migrations in `backend/src/database/migrations/` run from Initial Schema through Personal Museum Versions. `typeorm.options.ts` and `data-source.ts` are the runtime and CLI entry points. |
| Identity and operations | JWT/refresh handling and account creation are in `backend/src/modules/auth/`. KYC, user and role guards, storage, audit, dashboard, notifications, referrals, contact, and administration are in `backend/src/modules/`, `backend/src/common/`, and `backend/src/audit/`. `backend/scripts/` contains legacy account import code. |
| Deployment | `.github/workflows/ci.yml` runs builds, lint, tests, and PostgreSQL 16 checks. `.github/workflows/deploy.yml` is manual dispatch. It builds `main` and targets a VPS over SSH. `deploy/nginx/merge-stars.conf` serves the web bundle and proxies the API. `deploy/systemd/merge-stars-backend.service` runs the NestJS process. `deploy/` also includes PgBouncer, PostgreSQL setup, and email maintenance scripts. |
| Configuration and integrations | `.env.example`, `frontend/.env.example`, and `backend/src/config/security.ts` cover database, HTTPS/CORS, JWT, uploads, external identity, mail/SMS, OpenAI, Redis, Sentry, and feature settings. Mail supports Resend, Brevo and SMTP. SMS uses Twilio. The metals poller supports a configured spot source. Live credentials, provider accounts, and VPS configuration were outside the evidence available. |
| Assets | `frontend/public/living-museum/`, `frontend/public/museum/`, and `museum-site/public/assets/` hold original imagery, render derivatives and logo candidates. `frontend/src/components/MergeMasterLogo.tsx` and `museum-site/lib/company-identity.ts` are separate readers of existing assets. Founder confirmation is required to identify the exact MASTER CORE v2.2 source when the checked-in candidates lack approval provenance. |
| Tests | `backend/src/**.spec.ts`, `backend/test/`, `checks/frontend-session-tests.cjs`, `checks/postgres-integration.cjs`, `frontend/scripts/`, and `museum-site/tests/` are the checked-in suites or checks. Backend and frontend use npm lockfiles. The museum export uses pnpm. |

The public site and health endpoint responded during discovery. The health response reported application version 1.2.0 and database up. It contained no source commit. The production revision, hosted staging, server-side integrations and production backup status remain unverified.

## V8.0 / V8.2 gap analysis at the baseline

The rows describe the inspected commit. Code existence, local test coverage, and third-party activation are separate evidence.

| Area | Status | Evidence and gap |
| --- | --- | --- |
| 1. CORE | IMPLEMENTED | NestJS/PostgreSQL and routing are present. Existing identity, financial history, files and migrations are integration anchors. The CLI path failed when invoked from the checkout root. |
| 2. Living Museum | PARTIALLY IMPLEMENTED | `frontend/src/living-museum/LivingMuseum.tsx`, `components/museum.tsx`, and `transport.ts` implement navigation and CORE reads. V78 has separate hosted identity and additional visual flows. |
| 3. Megapolis | PARTIALLY IMPLEMENTED | `frontend/src/living-museum/components/megapolis.tsx` renders photo-based city navigation, pan/zoom and catalog entry. A walking humanoid and the full entrance sequence are unverified. |
| 4. Twelve industries | PARTIALLY IMPLEMENTED | The city has legacy House labels and catalog-category links. The V8.2 grouping, dedicated Sacred Art, Sports and Beauty taxonomy and associated catalog data require an explicit mapping. |
| 5. Brand Houses | PARTIALLY IMPLEMENTED | `brand-line-profile.entity.ts` assigns a unique profile per user. Unlimited multi-House ownership, collaboration, and scoped publishing are gaps. |
| 6. Personal museums/catalogs | PARTIALLY IMPLEMENTED | `experience.service.ts` stores source-linked versions and lists them in the owner's museum. `catalog.service.ts` has private/public collections. A general first-design House transaction and per-House gallery are gaps. |
| 7. Design Studio | PARTIALLY IMPLEMENTED | `frontend/src/experience/CoreExperience.tsx` and the experience controller support proposals and review requests. `MergeExperience.tsx` also includes browser-local design drafts. The OpenAI assistant can fall back to preset responses. |
| 8. Digital Twin | PARTIALLY IMPLEMENTED | Fit measurement persistence requires consent in `experience.service.ts`. The Digital Twin route is a local draft. Verified geometry, consent version history and biometric safeguards need their own review. |
| 9. 3D | PARTIALLY IMPLEMENTED | The catalog supports model assets and viewers. `frontend/src/features/catalog/meshy.hooks.ts` documents a proposed API. A persistent server-side Meshy job adapter and provider verification are missing. |
| 10. Physical Coin | PARTIALLY IMPLEMENTED | `coin-application.entity.ts`, the Coins module, and museum Coin assets exist. Legacy estimated requests cannot create a payable order. The exact approved geometry/accessory plan needs source validation. |
| 11. Composite and metal references | PARTIALLY IMPLEMENTED | `backend/src/modules/material-lab/` tracks material verification evidence. `metals.service.ts`, `metals.controller.ts`, and `coin-pricing.ts` implement fresh spot feeds and estimates. A verified manufacturing-country Ag/Au 999.9 source, currency and contract binding are missing. V8.2 requires a 1 kg commercial reference for each metal, distinct from physical mass. |
| 12. Universal RFQ and Verified Offer | MISSING | The baseline experience service sets `verifiedOffer: null`. The separate R7.1 source contains a port candidate for staged CORE design versions, scoped RFQs, offers and audit evidence. |
| 13. Orders | PARTIALLY IMPLEMENTED | `orders.service.ts` lists historical records and closes the legacy creation path. A verified-offer-to-order handoff is missing. |
| 14. Payments and commissions | BLOCKED | `wallet.controller.ts` permits a legacy admin credit. Older order code includes an unreachable earnings debit and 50% royalty. The finance UI and analytics infer a 2% fee from order totals. Verified bank/PSP settlement, refunds, reversals, reconciliation, Silver commission policy application, and approved Gold/fee bases require integration work and provider or contract evidence. |
| 15. Manufacturing | PARTIALLY IMPLEMENTED | `coins.service.ts` rejects activation of legacy production statuses. Old Crystal/production screens exist. Supplier onboarding and a payment-verified manufacturer handoff are missing. |
| 16. Product QC and XRF | PARTIALLY IMPLEMENTED | Material Lab has batch evidence and QC. A product-level inspection chain linked to a paid order and a traceable physical ID is missing. |
| 17. QR passports | PARTIALLY IMPLEMENTED | Material passports and public identity QR screens exist. `productBoundary.passport` has no authoritative physical product passport. |
| 18. Translation/chat | PARTIALLY IMPLEMENTED | `frontend/src/i18n/` has locale dictionaries and Arabic resources. Notifications and Socket.IO are present. City chat advertises a pending connection. Translation service, real chat and document language/version need end-to-end work. |
| 19. International compliance | MISSING | Public legal content and some admin compliance screens exist. A country eligibility registry, versioned acceptance and a commerce gate are absent. Some admin panels use sample data. Qualified review is required for jurisdiction-dependent rules. |
| 20. Mobile and app readiness | PARTIALLY IMPLEMENTED | Responsive CSS, reduced motion, camera controls and a shared API exist. Lite mode, device/network loading evidence and native packaging are gaps. |
| Founding member eligibility | MISSING | `founding-offset.ts` is a pure helper with a legacy cohort cap. No registry records registration and published-ready catalog qualification by the Tbilisi cutoff. |
| Registration payment and IBAN | MISSING | `LoginPage.tsx` and `kyc.service.ts` support national ID or passport. Bank payment of 0.01 GEL and independently verified account ownership do not have a working CORE evidence route. |
| Production providers and backups | UNVERIFIED | VPS SSH settings, production migration head, live provider status, and production restore procedures could not be established from read-only source and public health. |

### Existing supporting modules

| Module or surface | Status at baseline | Evidence |
| --- | --- | --- |
| Authentication and user profile | IMPLEMENTED | `backend/src/modules/auth/` and `modules/users/` implement CORE identities, JWT sessions, refresh and account/profile operations. External identity and delivery providers are unverified. |
| KYC intake | PARTIALLY IMPLEMENTED | `backend/src/modules/kyc/` handles protected identity document intake and staff status changes. Bank ownership and external KYB evidence are separate gaps. |
| Public and owner catalog | IMPLEMENTED | `backend/src/modules/catalog/` supports collection and product records, asset access, public filtering and ownership checks. The baseline taxonomy predates V8.2. |
| Brand and public member views | PARTIALLY IMPLEMENTED | `backend/src/modules/brand/` uses the existing per-account profile and public identity path. Per-House permissions and private default initialization need work. |
| Audit, administration and dashboard | PARTIALLY IMPLEMENTED | `backend/src/audit/`, `modules/admin/`, and `modules/dashboard/` provide local request audit, role-scoped views and operational summaries. They lack provider reconciliation evidence. |
| Contacts and referrals | PARTIALLY IMPLEMENTED | `backend/src/modules/contact/` and `modules/referrals/` have persisted contact and referral routes. Attribution and verified settlement are separate capabilities. |
| Settings and service health | IMPLEMENTED | `backend/src/modules/settings/` and `modules/health/` implement configuration readers and a database health status. |
| Notifications, mail, SMS and Redis | PARTIALLY IMPLEMENTED | `backend/src/modules/notifications/`, `modules/mail/`, `modules/sms/`, and `modules/redis/` contain server adapters. Live provider/account and delivery behavior remain unverified. |
| Historical investments screen | PARTIALLY IMPLEMENTED | `backend/src/modules/investments/` and `frontend/src/pages/dashboard/InvestmentsPage.tsx` are legacy application/reporting surfaces. They do not establish a payable order or commission entitlement. |
| Stand-alone previews and demo panels | MOCK / DEMO | `frontend/src/pages/CoCreationPreview.tsx`, `/material-lab/demo-admin` in `App.tsx`, browser-local Digital Twin drafts, and sample admin compliance views contain example or local data. |
| Hosted V78 source and prior implementations | UNVERIFIED | `museum-site/` and the V79 and R7.1 handoff material contain previous implementations. The GitHub VPS workflow builds the root backend and frontend. Runtime operation of the other versions was outside this audit. |

## Executed baseline checks

- Backend build passed. Jest passed 74 unit tests and one health E2E test. Backend lint reported 81 existing errors.
- Frontend typecheck/build passed. Five session regression scenarios passed. Frontend lint reported 33 existing errors and 12 warnings.
- PostgreSQL 16.15, repository-root invocation failed because no application migrations were found. The backend-directory invocation applied all 13 migrations and then failed at the obsolete wallet-payment expectation.
- The baseline test cluster was shut down, archived, checksum-verified and restored to a second loopback instance. The restored database had 13 migration rows, two synthetic accounts and two historical ledger entries.
- The npm production-dependency audit reported findings in both applications. Security verification must include a fresh audit and dependency review at release.

## Implementation priorities

1. Close legacy stored-value writes and misleading financial displays while preserving historical rows and read routes. Share PostgreSQL migration configuration and verify rollback with synthetic data.
2. Adapt and test the recovered RFQ/offer implementation in the existing NestJS and Vite entry points. Preserve existing catalog/design identities and keep the staged workflow disabled by default.
3. Connect the V8.2 industry and House workflows to authorized CORE routes. Verify mobile navigation and preserve the existing assets.
4. Complete provider, contract and country prerequisites before the order/settlement/production path can be enabled. Verify deployment, data backups and staging with the operator before requesting release approval.
