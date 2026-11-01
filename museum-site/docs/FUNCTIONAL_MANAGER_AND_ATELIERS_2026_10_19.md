# Museum, ateliers and MERGE AI — implementation and evidence

Date: 2026-10-19. Existing project: `appgprj_6ac2d9927d988191937a1887d59dfef8`.
Baseline: private version 66, source `6c327ecd78386be7887b9db4b6b7a124d783c7cc`.

This is a bounded implementation in the existing Site. It is not certification
that the entire Founder platform, live AI, Meshy, CORE commerce or real production
is operational. The existing private audience is retained. No change to
`mergestars.com` or public launch is included.

## What the supplied screens now do

| Reference | Implemented behavior | Remaining boundary |
| --- | --- | --- |
| Portal / Museum | Approved Aurum/Argentum interior is the initial Grand Museum view. Existing Grand Atrium remains selectable. The canonical logo is overlaid on the entrance landmark. Closed gate → opening → existing Megapolis is retained. | Interior artwork is an architectural reference, not a newly generated full 3D world. Embedded certificates/captions do not establish rights, assay or access rules. |
| 19 · Watch studio | Case, dial, movement, strap, engraving, mosaic scale, palette and requested dimensions are editable and applied to the existing private design brief. | Changes do not alter geometry or original manufacturer components. Real generation and fit need their authoritative services. |
| 20 · Jewelry | Setting, gemstone preference, engraving and shared configuration fields enter the private brief. Existing category / Fit entry remains. | No invented gemstone approval, body fit or production verification. |
| 21 · Fashion | Silhouette, pattern, buttons/hardware, monogram and shared fields enter the brief. Existing Fashion room, categories and measurement flow remain. | No cloth simulation or certified Fit result is manufactured from the illustration. |
| 22 · Accessories | Category-specific eyewear and Fashion settings, material integration, color and monogram/details use the same brief flow. | Lenses, protected mechanisms and manufacturer permissions remain separately approved. |
| 23 · Coin / order | Existing Gold/Silver package, material choice, order-before-payment rules and verified-settlement gates are preserved. | No fake order, payment, commission or price was created. CORE writes remain unavailable. |
| 24 · Brand Room | Existing private design library, 12-line planning and public CORE collection routes are preserved. Restored design briefs remount their configuration editor so saved preferences are reflected. | Planning slots are not authoritative Brand Line / Product / Order IDs. |
| 31 · Build my House | Existing optional architectural workspace / layout study remains available. | It is not a newly authorized CORE Brand House. |
| 32 · Personal MERGE AI | Functional strategy, collection plan, caption, video script, campaign plan, production checklist and growth-review documents. Editable titles/bodies, local review state, review date, copy/TXT, strict JSON export/restore and ICS review-calendar output. Six real server AI adapters/roles and image-review input are implemented. | Prepared templates explicitly say they are templates, not AI answers. Runtime provider configuration is absent, so live answers remain blocked. Documents are session working state; export a copy for durability. |
| 33 · Social / email | Existing channel selection and official provider handoffs remain. No false connected badges or demo metrics. | Provider OAuth, mailbox provisioning, publishing permissions and callbacks must be configured and verified. |
| 34 · Showroom | All 12 existing House interiors and category navigators remain. Each has a direct “Design this category” entry into its scoped atelier. | Empty/unavailable CORE collections are not filled with fabricated products. |
| 35 · Orders | Existing protected order journey and funding information remain. | No payment transaction, paid status or manufacturer order is simulated. |
| 36 · House in Megapolis | Existing city navigation, My Museum and source/category routes remain. | Photo animation and procedural room studies do not constitute photoreal rebuilt 3D assets. |

## Real AI integration boundary

`GET /api/ai-manager` returns server configuration readiness, never API keys or
model IDs. Readiness is not provider confirmation. `POST /api/ai-manager` requires
the existing authenticated Site session, same origin, an explicit consent flag
and a strict bounded request. This session does not impersonate MERGE CORE.

Six roles: Museum concierge, brand strategy, marketing/social, product/3D briefs,
orders/support and still-image review. Provider adapters support OpenAI Responses,
Anthropic Messages and Gemini GenerateContent. A provider key and an explicit
actual model ID are required. There is no guessed model fallback.

Requests have a 25-second provider timeout, bounded JSON, fixed provider URLs,
redirect rejection and sanitized errors. The assistant has no tools, external
publishing, spending, CORE writes or production authority. OpenAI requests use
`store: false`. Conversation context is submitted only after UI consent; no
assistant response is substituted if the provider is unavailable.

Transient guards: 4 concurrent requests, 8 requests per owner/minute and at most
128 recent results. Identical owner/request UUID retries reuse a result for 120
seconds; changed payloads conflict. The cache stores a SHA-256 fingerprint, not
the submitted reference image. **These guards are Worker-isolate scoped, not a
durable global billing/rate-limit guarantee.** Public/multi-instance activation
needs the authoritative entitlement, durable budget and global replay policy.

No secrets were added or changed. Runtime environment metadata returned zero
configured entries during this work. No real AI provider call or bill was made.

## Preserved code and records

- Exact canonical logo source and the approved closed/open gate source pixels.
- Existing city, avatar/reference controls, My Museum and optional layout tools.
- Existing CORE public catalog/collection/model/metal-reference reads and their
  fail-closed contract checks. The single shared House catalog read is retained.
- Existing Fit measurements, source/history, private draft APIs and storage.
- Existing versioned financial composition/allocation rules and order gates.
- All approved image sources; four new originals are added with WebP display
  derivatives. The deduplicated photo registry now contains 42 images.

No database table, migration, user identity, Brand House, CORE Product/Version,
order, payment, settlement, commission, passport or independent QR record was
created by this change. Working-document UUIDs and request UUIDs are local/transport
identifiers only. Existing private design storage remains unchanged.

## Validation

| Check | Result / evidence |
| --- | --- |
| TypeScript | PASS · `pnpm typecheck` |
| Existing + new contract suites | PASS · 19/19 · `node scripts/test-contracts.mjs` |
| New modules ESLint | PASS · the ten new implementation modules, 0 errors/warnings |
| Wider changed-component ESLint | Existing baseline issues remain in Grand Atrium, House renderer, workspace navigation and import-mode synchronization; not a repository-wide lint pass. No claim of production readiness is based on this check. |
| Gate / canonical identity regression | PASS · exact source-hash and transition/guard contract suites; actual browser closed/open/city flow exercised |
| Twelve House interiors | PASS · browser opened and returned from all 12, with category counts 6/12/8/7/6/6/6/4/4/6/4/5 and enabled scoped design entry |
| Watch configuration | PASS · browser selected case/dial/manufacturer movement/strap/engraving/mosaic, applied them to the original brief and completed material preferences; brief copy became enabled |
| Manager working documents | PASS · browser created strategy + 12 post templates (13 distinct documents), edited title, marked one reviewed and downloaded a 7,808-byte JSON workspace with 13 items |
| Close/reopen retention | PASS · same Museum session reopened the manager with all 13 documents and entered brand details retained |
| Review date | PASS · browser confirmed controlled input value `2026-10-22` and enabled calendar export after the event-binding fix |
| ICS output | PASS · contract checks date, escaping, UTF-8 line folding and tentative/private reminders. Browser download receipt NOT CONFIRMED: download observation timed out; no calendar-provider scheduling is claimed. |
| Workspace JSON restore | PASS · strict contract rejects duplicate IDs, forged authority fields, invalid dates and unsupported states. Browser upload E2E NOT RUN. |
| AI adapter / permission tests | PASS · explicit isolated provider fixtures cover all 3 adapters, images, auth/origin/consent/schema/replay/conflict/rate guards and sanitized failures. Fixtures never appear in the product UI. |
| Real provider answer | BLOCKED · no runtime key/model configuration |
| Real CORE identity / Fit / Brand House / creation / commercial writes | BLOCKED · authorized CORE session and approved write contracts missing |
| Full GPU / mobile / photoreal 3D | NOT CERTIFIED · cloud browser displayed the original artwork fallback when its animation renderer was unavailable; no real-device mobile/GPU test was performed |
| Payments / production / QC / passport | BLOCKED · no verified staging integration/evidence |

Two defects found in browser testing were corrected: secure request/local UUID
generation now works on HTTP previews via `getRandomValues`, and review-date
changes update React state through input/change events. Clipboard failure is
caught with a manual-copy message. Configuration editor restoration is keyed.

## Dependencies before real staging and LIVE

1. Configure the selected AI provider secret and an approved model ID through the
   authorized server setup. For an OpenAI key, use the OpenAI Developers setup
   flow; never paste a key into chat or frontend code. Verify a real permitted
   provider answer and the intended data-handling/budget policy.
2. Supply the existing CORE authentication bridge, authorized Brand House/Fit
   read contracts and actual write contracts for generation/version/order. Keep
   source/revision/rights lineage and historical records authoritative.
3. Configure Meshy server credentials and actual task/model contracts. Supply
   approved GLB assets and test their real visual/geometry results.
4. Connect social/mailbox OAuth, revocation, scoped publication authorization and
   provider evidence. No account is “connected” merely because it was selected.
5. Prove calculation from measurable geometry, approved recipes/prices, verified
   offers, settlement, commission availability, manufacturer authorization,
   production, QC, passport and QR in real CORE staging.
6. Finish real-device mobile/GPU and authenticated owner browser E2E; resolve
   remaining baseline lint debt and verify recovery, monitoring and rollback.
7. Obtain explicit Founder approval before public/LIVE release.

## Files changed

New code: `app/api/ai-manager/route.ts`, `app/manager-workbench.css`,
`components/approved-museum-portal.tsx`, `components/brand-manager-workbench.tsx`,
`components/manager-live-chat.tsx`, `components/product-studio-configurator.tsx`,
`lib/ai-manager-contract.ts`, `lib/ai-manager-service.ts`,
`lib/brand-manager-workbench.ts`, `lib/client-request-id.ts`,
`lib/product-studio-configuration.ts`.

Existing integration points: `app/layout.tsx`, `components/atelier-library.tsx`,
`components/grand-atrium.tsx`, `components/house-showroom.tsx`,
`components/merge-ai-panels.tsx`, `components/merge-ai-workspace.tsx`,
`components/museum-design-studio.tsx`, `components/museum.tsx`,
`components/personal-merge-ai.tsx`, `lib/luxury-windows.ts`,
`lib/museum-visuals.ts`, `lib/visual-routes.ts`.

Checks: `tests/manager-workbench.mjs`, `tests/personal-merge-ai.mjs`,
`tests/photo-identity.mjs`, `scripts/test-contracts.mjs`.

Assets: four `public/assets/founder-*` PNG sources and their corresponding
`public/assets/optimized/*.webp` derivatives. See the adjacent manifest for
their hashes. No official company logo file was altered.
