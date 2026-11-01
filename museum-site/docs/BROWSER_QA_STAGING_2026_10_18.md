# Museum QA, review and staging handover

Date: 18 October 2026, Tbilisi. Existing Site: `appgprj_6ac2d9927d988191937a1887d59dfef8`.
Baseline: private version 61, source `f0655cf7d169488ba99a6159a36fa4b1ace3c873`.

## Actual stack and CI/CD

| Layer | Verified code |
| --- | --- |
| UI | React 19.2.6, TypeScript 5.9.3 |
| Framework | Vinext 1.0.0-beta.5 / Vite 8.0.13, Next-compatible App Router |
| Style and 3D | Tailwind 4.2.1, Radix luxury windows, Three.js 0.186.1 |
| Backend | Cloudflare Workers, existing D1/Drizzle; no configured R2 binding |
| Toolchain | pnpm 11.25.0, Node >=22.13 |
| Delivery | Existing Sites-managed source/build/archive/private deployment |
| External CI | No existing GitHub Actions, GitLab, Bitbucket, Cypress or Storybook pipeline found |
| Added QA | Pinned `@playwright/test` 1.62.1, provider-neutral `qa:ci` entrypoint |

An external CI provider has not been connected. No new website, CORE, identity,
order database or financial engine is created by this change.

## Targeted fixes

1. Reopening the same category previously erased the query. Preserve search
   within the same category; choosing another category still clears it. Verified
   with the actual component callback and browser search `coat`.
2. Controlled category dialogs now retain the real opening element and restore
   its focus without scrolling if that element is still connected. Verified
   `OPEN SHOWCASE` focus return for all twelve Houses.
3. Approved photograph mode already has its own caption. Show the additional
   welcome panel only in separate 3D mode, removing the overlapping copy.

The current version 61 visual-journey buttons, photograph deduplication, new
approved assets, official logo, entrance sequence, shared window CSS and business
rules are preserved. No production authentication or database/schema changes.
No order, payment, commission or manufacturing record was created.

Official asset hashes remain:

| Asset | SHA-256 |
| --- | --- |
| Official logo | `639f3286858cfe9aa225ef1fa7251967c31aa734ff04a8ace6bd62e31a04c785` |
| Closed door | `6e6c3fd2147c5f082a16d35adc608c7d5592e955d5dbfd686249c0367d20081e` |
| Approved open door | `4c98cdbdcf9c202858f1c8989a767c53cc25e4bef26df445aeee72dfae0026d6` |

## Ready commands

Provision a supported QA runner using the frozen package lock and the official
Playwright browser distribution:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm run typecheck
pnpm run test:contracts
pnpm run test:browser:list
```

Start the existing application in a separate terminal. For portable local QA:

```sh
pnpm run dev --host 127.0.0.1 --port 4173
```

For Sites managed previews use the existing supervisor, `sites-preview start`,
and its supported browser entry point. Do not start a second server there.
`QA_BASE_URL` defaults to `http://127.0.0.1:4173`; override only with a local
preview origin reachable by that particular runner.

```sh
pnpm run test:browser:preflight
pnpm run test:browser
pnpm run qa:ci
```

`qa:ci` runs TypeScript, seventeen behavioral/component/storage contracts,
browser preflight, screenshot tests when possible, and the normal build. Reports
are in ignored `test-results/` and `playwright-report/`. Exit 1 means test/build
failure; exit 2 means infrastructure blocked. Neither is a passing release gate.
This command never deploys. It never grants Production approval.

### Screenshot baselines

Desktop Chromium: 1440×960. Mobile Chromium: 390×844. Locale/timezone and reduced
motion are fixed; the slow-door test separately enables normal motion. Test
browser software rendering is not evidence of real-device GPU performance.

The six scenarios cover exact entrance assets, slow opening/no auto-selected
product, every House/category window, Fashion filter retention, Coin material
disclosures, and system-window containment. They expand to twelve viewport tests.
The fixture intentionally returns CORE 503, rejects hosted test targets and
asserts that no CORE mutation was attempted. It is dependency-failure UI coverage,
not live CORE integration.

No golden baselines have been approved. On one consistent OS/browser runner:

```sh
pnpm run test:browser:baseline
```

Review all images in `tests/browser/__screenshots__`, then commit approved
baselines and rerun `pnpm run test:browser` without the update flag. Initial image
creation is not regression-comparison PASS. CI must never auto-update baselines.

Official references:
- https://playwright.dev/docs/test-snapshots
- https://playwright.dev/docs/test-configuration
- https://playwright.dev/docs/ci

## Actual validation

| Check | Result | Scope/limit |
| --- | --- | --- |
| TypeScript | PASS | Current source and test configuration |
| Unit/component/storage contracts | PASS | 17/17, including isolated SQLite and CORE read schemas |
| Build | PASS | `qa:ci` normal Vinext build completed |
| Test discovery | PASS | Twelve Playwright tests discovered |
| Chromium provisioning | BLOCKED | Official download repeatedly returned invalid/truncated ZIP bytes |
| Automated screenshot comparison | NOT RUN | No browser executable or approved golden baselines |
| Cloud-browser desktop sanity | PASS for listed paths | Real supervised local preview, viewport 1363×936 |
| Mobile visual/touch tests | NOT RUN | Mobile runner prepared; current cloud API has no viewport emulation |
| Hardware GPU/motion fidelity | NOT VERIFIED | Actual device testing still required |
| Genuine CORE, payment and production E2E | BLOCKED | Authoritative contracts/session/provider evidence missing |

The full local gate correctly exited 2 with `local_qa: NOT_READY`, despite passing
contracts and build. It did not silently skip browser QA and report green.

All twelve House interiors and their first category dialogs were exercised in
the actual desktop browser. Every measured dialog fit its viewport, its body had
no horizontal overflow, and close returned focus to `OPEN SHOWCASE`:

| House | Category controls | First opened category |
| --- | ---: | --- |
| Mosaic | 6 | Panels & surfaces |
| Game | 12 | Chess, draughts, backgammon & dominoes |
| Fashion | 8 | Clothing |
| Musical Instruments | 7 | Strings & bowed instruments |
| Robotics | 6 | Humanoids |
| Nature | 6 | Trees |
| Jewelry | 6 | Rings |
| Watch | 4 | Wristwatches |
| Eyewear | 4 | Frames |
| Interior | 6 | Furniture |
| Art | 4 | Sculpture |
| Mobility | 5 | Cars |

Also confirmed: CLOSED → OPENING → city; Fashion retained `coat` after reopening;
generation/order action stayed disabled; Silver and Gold disclose the composite
fraction and pending payable offer; Gold shows 8K; no removed metal label was in
the Coin text. The Coin window scrolls, and six Tab actions retained modal focus.

Evidence files:
- `qa/2026-10-18/desktop-browser.json`
- `qa/2026-10-18/contracts.json`
- `qa/2026-10-18/local-gate.json`
- `qa/2026-10-18/fashion-window.jpg` — actual screenshot, not a golden baseline.

## Review of tests and remaining risks

The earlier AI harness assumed the brief was the first state value. Version 61
has a navigation state before it; the fixture is aligned without changing the
application. House tests retain geometry/disabled/return assertions and add the
single-caption check. The connected-House suite now exercises same-category
query retention and different-category clearing through real callbacks.

HTTP `core-api`/`foundation-api` suites require a designated local Worker origin
and isolated test storage. They are not invoked as unit contracts or represented
as real staging passes. No real owner authentication was forged. Build warnings
include a client chunk over 500 kB; device performance remains to be measured.
Legacy Georgian body copy remains in some existing components; this change does
not claim that the entire interface has been translated.

## Staging and rollback

1. Package with the existing Sites source helper and keep the baseline artifact.
   Update only the same one-owner private preview. Do not change the audience or
   deploy to `mergestars.com` Production.
2. Run an actual owner-session sanity pass on that private deployment: reload
   entrance, enter, open Fashion and another House, reopen query, inspect both
   Coins, AI and Passport; close returns to the same context. Local cloud-browser
   observations are not hosted owner-session proof.
3. On a supported desktop/mobile runner, approve baselines and run comparisons;
   exercise keyboard, touch, scroll/close and actual GPU behavior.
4. Connect genuine staging CORE session/identity, Brand House/products, rights,
   Fit revision, version/generation and automatic unpaid-order contracts,
   measurable geometry/weight, approved price snapshot and verified offer.
5. Prove sandbox payment, permission failures, webhook idempotency, available
   commissions, manufacturer authorization, production/QC and Passport/QR using
   designated staging records. Registration/views/unpaid orders remain separate
   from verified money and production authorization.
6. Production needs those results and explicit Founder approval. It remains
   blocked now. Real Meshy, social/email providers, payment and manufacturer
   connections cannot be declared working from local UI tests.

Rollback: restore retained private Site version 61
(`appgprj_6ac2d9927d988191937a1887d59dfef8~appgver_7da0f6963af48191ba31bd3867c8b001`)
through Sites, preserving its one-owner audience. No migration rollback or CORE
history/ledger modification is needed for this change.

## Changed files

- `components/grand-atrium.tsx`, `components/house-showroom.tsx` — scoped UI fixes.
- `playwright.config.ts`, `tests/browser/museum.spec.ts` — portable browser QA.
- `scripts/browser-preflight.mjs`, `scripts/test-contracts.mjs`, `scripts/run-qa.mjs`.
- `package.json`, `pnpm-lock.yaml`, `.gitignore` — pinned dependency and commands.
- `tests/connected-houses.mjs`, `tests/house-interiors.mjs`, `tests/personal-merge-ai.mjs`.
- This handover, PR-ready review text and evidence files.

Database changes: **none**. CORE commercial writes remain fail-closed. Final
private deployment/source identifiers are supplied by the Sites publishing result.
