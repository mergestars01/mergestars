# MERGE ⭐ STARS — Living Museum

Private experience layer for the existing MERGE CORE. This checkout does not replace or regenerate CORE.

## Implemented and preserved

- Canonical existing MERGE assets, animated entry, arrow/keyboard/touch exhibit selection, mosaic detail viewing.
- Account-isolated server-persisted design drafts using D1 and dispatch-owned ChatGPT identity.
- Immutable source references and parent-draft lineage. Draft identity is explicitly separate from CORE Product / House identity.
- Strict configuration validation, bounded JSON, same-origin writes, no-store API responses, idempotent saves, atomic creation events and a 200-draft per-account limit.
- Explicit feature statuses and evidence-gated commerce boundary.
- On-demand CORE public collection browsing and item source inspection inside the existing collection dialog; metal price references inside the existing system dialog. The entrance, halls, exhibit navigation and original concept images are retained.
- Fixed-origin, GET-only CORE adapters with schema validation, bounded responses, timeout and redirect rejection. CORE data is transient, never copied into authoritative local records.
- An existing CORE bearer can be checked only by CORE `/users/me`. No token is stored, no new login or Fit Profile is created, and this check does not authorize any Museum mutation. Positive production identity validation and a shared session remain unverified.

## Current CORE interfaces

| Museum route | Authoritative upstream | Museum use |
| --- | --- | --- |
| GET `/api/core/catalog` | `https://mergestars.com/api/catalog/public` | Public collection list in the existing collection dialog |
| GET `/api/core/collection?slug=...` | `/api/catalog/public/:slug` | Item IDs, collection IDs, Brand Line metadata and source inspection |
| GET `/api/core/prices` | `/api/metals/live` | Metal reference prices in the system dialog |
| GET `/api/core/identity` | `/api/users/me` with an existing CORE bearer | Validation boundary only; no browser session bridge |

Upstream contracts were observed in the deployed CORE client and captured public JSON, not inferred from an old proposed handoff. Projection of those captured responses passed for 6 collections, 12 items and 3 metals. This is captured contract evidence, not a successful live Worker connection.

The latest local Worker live-read test failed: this environment cannot resolve `mergestars.com`. The API returned 503 `CORE_UNAVAILABLE`, with no fallback records or prices. Consequently no real CORE data screen is claimed operational in a deployed build. No deployment was requested or performed in this cycle.

Public item `id` is exposed as a CORE **catalog item ID**; it is not fabricated as a production Product ID. `updatedAt` is not a source revision. ACTIVE, ownership and available imagery grant no creation rights or verification. Public account IDs, avatars and logos are excluded. Public Brand Line metadata is not a confirmed partnership.

The metal API response timestamp is not a verified quote timestamp. Quote validity, product physical weight, commercial pricing weight and VERIFIED OFFER remain unavailable; no product price is calculated.

## Fail-closed capabilities

Shared CORE authentication, authoritative product/Brand House registration, original-image-to-CORE mapping, Fit Profile / Digital Twin, design proposals, versions, rights, immutable history, consent, material calculation, verification, offers, orders, payments, notifications, production, QC, QR, Passport, Partner Registry / Museum Network, Pulse, likes/saves and AI generation remain unavailable. Only CORE may supply their records and permissions.

GET `/api/core/:operation` returns 503 for known missing dependencies and 404 for unknown operations. Mutation requests retain the existing identity/origin guards and fail with `CORE_NOT_CONNECTED`. No browser flag or saved draft can mark anything VERIFIED, GENERATED or paid. No partners or unauthorized logos are displayed.

Drafts reside only in `experience_design_drafts`; events reside in `experience_draft_events`. These are experience-layer records, not authoritative CORE product, financial, ownership or passport records. The application event log is not claimed to be WORM audit storage.

## Files changed in this cycle

- `lib/core-contract.ts`, `lib/core-client.ts`: upstream projection, transport and closed capability boundaries.
- `app/api/core/[operation]/route.ts`, `app/api/system/route.ts`: read routes, identity check and truthful status.
- `components/core-context.tsx`, `components/museum.tsx`, `app/globals.css`: scoped integration inside existing dialogs.
- `lib/draft-contract.ts`: clarify original visual concepts and read-interface availability.
- `tests/core-read-contract.mjs`, `tests/core-api.mjs`, `tests/run-api-local.mjs`, `tests/foundation-api.mjs`: adapter, boundary and optional strict live tests; clearer request failures.
- `README.md`: this implementation status.

Database/schema/migration changes: **none**. Local API QA created isolated test drafts/events in local D1. Production databases were not accessed for writes. All 18 PNG assets match the starting commit byte for byte. Draft storage, canonical source references, ChatGPT auth helper, hosting identity, dependencies and existing migrations are unchanged. The external CORE repository was not supplied and has not been modified.

## Validation

- PASS: `node node_modules/typescript/bin/tsc --noEmit`.
- PASS: `node tests/museum-contract.mjs` — immutable references, circular navigation, case identity.
- PASS: `node tests/core-read-contract.mjs` — fixed origin, GET-only/no credentials on public reads, redirect/timeout/body bounds, ID/collection validation, private-field filtering, missing rights/verification and unverified price freshness.
- PASS: Sites build helper.
- PASS: `node tests/run-api-local.mjs` — persisted drafts, ownership, lineage, idempotency/concurrency, strict input/CSRF, existing closed mutations, new missing-capability/identity boundaries, SSR and all image assets.
- FAIL / external blocker: `node tests/run-api-local.mjs core` — strict live-read integration; DNS lookup for `mergestars.com` fails in the local Worker. A Worker redirect compatibility defect found during testing was corrected and covered by the adapter tests.
- NOT RUN: browser interaction/visual QA (supported browser QA is unavailable), shared-login positive test, full creation-to-Passport flow, production/staging database tests.

The local API runner starts and stops its own built Worker. Its default suites are local foundation and boundary tests. The separate `core` argument retains strict live-read assertions; network failure is not converted into a passing connection test. Apply existing migrations only to local test D1 when starting from empty state.

## External blockers

Before staging: accessible authoritative CORE backend repository/current protected contracts; staging runtime, API egress/DNS and test accounts; same-domain routing and a CORE-owned session handoff; explicit canonical image-to-entity mappings; version-scoped source/rights/Fit consent contracts and safe production-data projections. Read routes must pass their strict live tests in that environment. No body data, partner records or historical consent may be invented to fill these gaps.

Before LIVE: a complete staging flow with backend authorization and immutable lineage; real quote source/freshness rules and verified offers; authorized partner/production/QC records and logo rights; payment-provider credentials, protection rules and validated webhook evidence; QR/Passport privacy validation; browser QA and founder approval. Neither LIVE publication nor production migrations are authorized by this cycle.

## Governance

Founder: Giorgi Revazishvili — business laws, identity and final decisions.
MERGE AI: system architecture, implementation and verification.
Developers: officially implement the approved MASTER CORE; critical rules are never changed silently.

BUILD EXACTLY. VERIFY EVERYTHING. PRESERVE THE CORE.

## Version 6 — incomplete integration checkpoint (2026-10-06)

Based on saved Version 5 (`92b48ac44a77dc40ccb112d866d9fce0ad9771cc`). Full end-to-end CORE integration is **not complete**. No LIVE deployment is authorized or performed. See `docs/MERGE_V6_INTEGRATION_STATUS.md` for all 20 criteria, executed evidence and specific blockers.

This checkpoint distinguishes CORE HTTP 401, 403 and 429, keeps permission denial as HTTP 403, includes truthful source/failure state in read errors, and presents those failures in the existing dialogs. No authoritative capability, shared session, write endpoint or second data source was added. Existing 18 PNG assets, Museum layout/controls, draft storage, identity helper, schema/migrations and dependency inputs remain byte-identical to Version 5.

Types, contract checks and build passed. Local foundation/boundary, SSR and asset tests passed on rerun; the first foundation run timed out at `/api/system`. Direct public CORE GETs returned HTTP 200, but the strict local Worker -> CORE test **failed** with DNS resolution failure and HTTP 503. That failure is retained. CORE staging, positive shared-session, payment/permission/production evidence and browser E2E remain unavailable, so this version must not be represented as completed integration.

## Existing Museum experience refinement

The saved Version 6 architecture and all 18 images are retained. Clicking either existing interactive concept now opens its exhibit information inside the existing Museum dialog: presentation source, selected concept parameters, local draft lineage when saved, and truthful weight/value/QC/Passport/QR availability. The original-photo reader, detail zoom, doors, halls and existing collection windows remain available.

Repeatedly choosing Create My Version no longer resets an unsaved customization or its parent link. Draft requests are bounded, validate returned concept records and source/parent configuration, and preserve the existing request ID for a manual retry after a lost response. A request timeout cannot keep the save controls locked indefinitely. No draft can be represented as VERIFIED or as a CORE product by a malformed response.

No CORE authentication, product mapping, geometry, calculation, rights, order, payment, production, QC or Passport connection was invented. The configured CORE origin remains exactly `https://mergestars.com`. No database changes or LIVE deployment. See `docs/MUSEUM_EXPERIENCE_REFINEMENT.md` for evidence and remaining integration blockers.

## House-first Museum journey

The door opens the existing uploaded House & Museum scene with no exhibit automatically selected. Arrows, keyboard navigation and markers approach individual exhibit anchors in this ONE scene, including art, musical instruments, stationery, fashion and watches. The scene image remains the same at every anchor. This is bounded image-based 2D pan/zoom, not a claimed 3D reconstruction, physical fitting or measured product scale.

The two retained interactive concept references have presentation vitrines using the original uploaded images. Approaching a vitrine does not open its item; explicit selection opens the existing concept/customization experience. Returning preserves the exact exhibit anchor, zoom and pan. The original source has no selling price. A derivative's weight and calculated price remain pending real geometry, CORE Fit Profile, composition and approved pricing contracts. The enlarged watch view remains an unmapped visual: no watch Product ID, wrist measurement or quote is fabricated.

Existing collection windows, original-photo reader, saved drafts, authentication/ownership guards and closed CORE boundaries are retained. No second profile, catalog or CORE was created. No LIVE publication. `node tests/museum-tour.mjs` checks whole-house entry, no automatic eyewear, all anchors reachable in the same scene, strict explicit concept selection, exact camera restoration and camera bounds. See `docs/HOUSE_MUSEUM_JOURNEY.md` for evidence and verification limits.

## Commercial transparency

`/transparency` is a read-only Georgian disclosure page reachable from the existing entrance and Museum footer. It covers metal suppliers, price locking and ownership, manufacturing, the initial 1,000-participant programme and prepayments, Earnings Wallet, referral rewards and patent/application evidence. It distinguishes the current Museum's unavailable financial capabilities from unverified operations in the authoritative CORE. It publishes no private agreement or invoice and creates no supplier registry, ledger, account, payment flow or database.

The reviewed development agreement, proposed commercial rules and draft material certificate do not establish metal purchases, production agreements, effective payout terms or patent rights. Missing evidence is labelled pending; historical/proposed commission rates are not presented as approved terms. The entrance still opens the whole House & Museum, with explicit exhibit selection. This is a saved revision only, not a LIVE publication. See `docs/COMMERCIAL_TRANSPARENCY_REVIEW.md` for the evidence boundary and required documents.

## Museum creation and Pulse

Creation now starts at an exhibit in the ONE Museum. The two existing interactive concepts open the current editor directly from their vitrines; other visual anchors open a close-up dossier with a pending source/rights/generation boundary. There is no second Brand House generator in this experience. Existing CORE Brand House code is outside this checkout and was not removed or modified. The original product/draft lineage and all saved drafts are retained.

The Museum now has explicit Meshy-generation availability and Pulse surfaces. They read the existing `/api/core/generate` and `/api/core/pulse` boundaries, which currently deny the capabilities. No Meshy task, generated file, like, counter, presence session, analytics database or demo population is created. An unexpected 200/count/task payload cannot enable the capability. Real functionality still needs the authoritative CORE session, product/version/rights mapping, generation service and Pulse contracts.

Vitrine bookmarks use only `#museum=<point>` and exclude query credentials, user/draft/House IDs and QR/source attribution. A recipient still starts at the original door and whole-house view, then explicitly approaches the bookmarked vitrine. Shared links preserve existing Site access. Movement has reduced-motion support, keyboard zoom/Home, active-path scrolling and pointer-capture cleanup. This remains uploaded-image-based 2D movement, not physical 3D reconstruction, animated object mechanisms, avatar fitting or measured weight. See `docs/MUSEUM_CREATION_PULSE.md`.

The owner's newly supplied MERGE COIN Museum photograph is an additional, byte-identical asset and the initial scene view. The existing MERGE HOUSE scene remains selectable and all original 18 PNGs remain unchanged. Both views have their own presentation camera anchors. Text, profiles, counters and certificates embedded in the photograph are conceptual imagery, not actual records or working DOM controls.

The in-Museum collection vitrine reuses the existing public CORE catalog/collection adapter and shows one authoritative catalog item at a time, with source state and explicit refresh. It does not depend on the fixed photograph anchors. Newly generated versions can appear only when CORE registers and publicly returns them. Unlimited scale is not implemented: current 200-collection/500-item/1 MiB read bounds and the original 200-draft limit remain; CORE cursor/pagination contracts are required. No independent publication, generation or collection database was added.

BABE / RUMI is an owner-requested children's concept corner for strollers, cradles/beds, toys, game characters and dolls. Its category controls work, but actual CORE products/House mapping, authorized character rights and generation remain pending. Collections are not automatically assigned by brand names.

The entrance and `/transparency#entry-law` now display the founder's minimum requirements: Silver, 1 Coin on a 2 kg silver VALUE basis; Gold, 1 Coin on a 1 kg gold VALUE basis. This is not physical coin weight or an independent payable calculation. CORE must supply its approved price source/snapshot, rule version/currency, verified offer, order and payment evidence. Registration, first-1,000 cohort eligibility, payment, settlement and earned commission remain separate; no registration is presented as free coins or payment. Both real payment lines and paid Museum access are still unconnected. No new payment records or database changes.

Final local API verification uses fresh `node:http` sockets after reproducing the Node fetch/Wrangler pooled-connection stall. Request bodies, authentication/CSRF/ownership assertions and the 12-second timeout remain. The full foundation + boundaries sequence passes; production auth/system code is unchanged. Browser keep-alive and real CORE staging remain unverified. No LIVE publication.

### Continuous Mega Museum spatial layer (Version 6 request)

The existing MERGE COIN experience now includes a native WebGL exhibition scene, connected spatial routes, floor navigation, camera approach/return snapshots and a discovery map. Image-only exhibits remain VIEW ONLY. The existing CORE collection vitrine can explicitly load supported authoritative static GLB assets for actual rotation/zoom; URLs and files are validated and bounded. Display geometry never supplies physical calculations. Existing entrance, source images, draft/API/storage and fail-closed commerce boundaries are retained. The source-only checkpoint has not been deployed. See `docs/MERGE_MEGA_MUSEUM_SPATIAL_STATUS.md` for the 22-item evidence matrix and unavailable staging/browser/CORE requirements.
