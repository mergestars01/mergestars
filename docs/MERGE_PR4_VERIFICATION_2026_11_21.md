# PR #4 repair verification

Date: 21 November 2026. Starting head: `5bb456a1aa1a8e843e73572bc117ac3d9e60fa32`.
Scope: repair the existing branch while preserving the Museum and CORE.

## Changes

- Fix the AI concierge apostrophe syntax error.
- Resolve PostgreSQL migrations relative to the datasource module, for source TypeScript and built JavaScript. Running checks from the repository root now discovers migrations, including `fit_profiles`.
- Apply existing backend formatter rules without changing commission rates or payment gates.
- Repair frontend lint errors through state/ref lifecycle corrections, derived catalog selection, keyed share state, explicit GLB types and removal of unused component-file exports. No lint rules are disabled. Existing hook dependency warnings remain visible.
- Add one entry COIN, internal lines, twelve portals and central private House using unchanged company assets.
- Add CORE-validated private sessions, owner-scoped D1 briefs, immutable versions, atomic events, replay protection and pagination without the 288 cap.
- Distinguish text briefs, generation and public/commerce rights. Label the three proposed MERGE products as concept references.

The branch received concurrent work during repair, through `10dd95234e2a75305d52003e5452fcef45241553`. Those commits are preserved: the twelve-concept studio, multilingual chat dispatch, selected revisions and migration 0004. They now share CORE session validation; revision history is paginated instead of truncating at 500, retry requests retain IDs, and account changes cancel old batch operations. Lineage migration follows as 0005.

## Local checks

| Check | Observed result |
| --- | --- |
| Backend lint/build | PASS |
| Backend unit tests | PASS: 15 suites, 74 tests |
| Backend health E2E | PASS |
| PostgreSQL integration | PASS on disposable local PostgreSQL 18.7: migrations/repeatability, every entity column, concurrent registration/credits, closed payment gates, idempotent ledger/royalty and rollback |
| Frontend build/lint | PASS; zero lint errors, existing dependency warnings |
| Frontend session regressions | PASS: five scenarios |
| Museum typecheck/contracts/build | PASS; 24 existing contract suites; portable Vinext build |
| Life-cycle gates | PASS: twelve portals, central #13 and conservative CORE gates |
| SQLite migration compatibility | PASS: preserved historical rows/owners; lineage, foreign key and index |
| Actual private routes/store | PASS with transactional SQLite D1 adapter and controlled CORE responses |

The API test covers forged-header rejection, two-owner isolation, foreign parent/cursor rejection, immutable originals, lost-response replay, payload conflicts, concurrency, event rollback, failed account switch, logout, CORE outage all 303 records across seven pages, and all 506 history versions with exact original-revision replay.

The PostgreSQL test previously attempted a legacy public payment path now intentionally closed by CORE. It now asserts that gate remains closed and exercises existing ledger methods with explicit disposable fixtures. Production payment code and rates are unchanged. GitHub CI uses PostgreSQL 16; its result must be read separately from local PostgreSQL 18.7.

## Browser evidence

The local preview was inspected through the browser: one official entry COIN → internal lines → twelve portals → studio. Signed-out visitors see the existing CORE login link and cannot save. Original logo assets are unchanged.

`playwright.life-cycles.config.ts` defines desktop 1440×960 and mobile 390×844 fixture tests, including 320px overflow/touch targets, history/focus, lost-response retry, reload recovery and immutable versions. CI uploads screenshots and report as `life-cycles-browser-evidence`. Definitions or manual local inspection do not substitute for an observed completed CI run.

## Remaining integration requirements

- Configure isolated staging D1, apply the additive migration there and provide a genuine existing CORE login path on that origin. No hosted migration or production deployment was performed.
- Demonstrate real two-account/second-device recovery in staging. Offline fixtures cannot prove a production session bridge.
- Explicitly verify ownership before migrating historical ChatGPT-owned briefs; no automatic reassignment is implemented.
- Image/3D generation, complete public House publication, offers, payment/manufacturing integrations and partner agreements remain separate work. No false availability, partner approval or financial activation is introduced.

`main`, production data, active payments and the live domain remain unchanged. The PR stays Draft; no merge or production deployment is included.
