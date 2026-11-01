# MERGE STARS · Unified Museum consolidation variant

> Historical version-63 report. Version 64 restored the original city My Museum
> destination and removed the extra top-bar/layout invitation. Architectural
> tools are now optional and collapsed in the Grand Museum overview. The shared
> company frame remains black/silver/gold. See `VISUAL_CONTINUITY_CORRECTION.md`
> and `delivery-2026-10-18/DELIVERY.md` for the later corrections and verification.
> The descriptions below record that historical variant; they are not a current
> instruction to replace the entrance, personal Museum or visual theme.

The existing private Living Museum now has one shared spatial workspace for its Grand Atrium, panoramic elevator, personal gallery, House layout editor and storyboard navigation. This is an implemented experience-layer change to the same Site, not a rebuilt commercial CORE or a production release to mergestars.com.

## A. What was combined

| Source | Retained / integrated | Excluded or unresolved |
| --- | --- | --- |
| Existing Site version 62 | Exact entrance images and opening sequence, approved city/avatar artwork, all 12 industry Houses, category showcases, existing private design briefs, catalog/model read contracts, Material Lab, Fit preparation and personal AI workspace | No working CORE function was replaced |
| V22.7 | Original document copied without edits into `v25/sources` | Business contradictions were not silently rewritten |
| V23.1 and V23.3 | Safety boundaries, single CORE, shared scene mapping, private/public distinction and exact source provenance | These documents are requirements, not proof of implemented backend services |
| V25 founder attachment | Grand Atrium, central lift, 12-position clock gallery, Zodiac passage, one House editor, shared scenes 25–36 | Exact final Zodiac character models and real CORE writes are unavailable |
| Historical cinematic / preview / V5 prototypes | Reviewed for spatial navigation and presentation patterns | Standalone demo websites, hardcoded prices, fake entitlement/order/commission data and independent local-storage truth were not imported |

## B. Assets and identity

`v25/asset-manifest.json` inventories 77 existing assets. Every baseline asset retains the same Git blob and SHA-256 content. There are no GLB/GLTF files in the existing asset inventory. The official company logo is reused through the existing company identity component and as the Three.js architectural mark. No substitute star or redrawn logo was introduced. Embedded markings in old reference artwork are not adopted as company identity.

`v25/identity-report.json` records the canonical image hashes. `v25/source-provenance.json` records untouched source documents and reviewed historical archives.

## C. One spatial journey

The old entrance still opens into the same approved Megapolis. Grand Museum retains its original overview and House interiors. New entry points are **Enter Grand Atrium**, **My Brand Room**, **Build my House**, and the top-bar **MY BRAND HOUSE**. The city’s existing personal-museum action opens this same shared workspace.

The workspace contains:

- Ground-level Grand Atrium with 12 industry portals using the existing House taxonomy.
- Glass central lift, closing doors before travel, precise floor arrival, opening after arrival and a reduced-motion path.
- Upper gallery with 12 clock-position display places. These are layout slots, not invented Brand Line IDs.
- A separate Zodiac passage with six abstract 3D studies on each side. These are architectural studies, not final manufactured statues.
- One House editor with selection, bounded translation, rotation, undo/redo, palette, lighting, mosaic preference and preview.
- Explicit private layout-file export and validated restore. No ownership, finance, product or publication fields can be imported.
- A 36-scene navigator resolving repeated scenes to 30 canonical entries and existing shared workspaces.

Real Three.js geometry is implemented. On a device without WebGL, the approved image and accessible interactive plan remain available with an explicit **2D reference** label. A photograph is never reported as a loaded 3D model. Empty plinths remain empty until linked to authorized CORE models.

## D. Shared services and data

`v25/core-route-map.json` lists the actual integration boundaries. New quick actions open the existing Material Lab, Fit preparation, private design library, catalog reader, Personal MERGE AI and commercial readiness screens. Returning from a tool restores the editor’s layout and selection in the same account scope.

The existing public CORE catalog/model relay is preserved. Existing authoritative records remain the source of product identity and real model assets. The new architectural gallery has no fabricated product assignments. Layout studies are session state plus an explicit downloaded file, not a second CORE or a duplicate Brand House database.

**Database changes: none. No migrations.** No new auth, user, House, payment, commission or product table was added. Original drafts and the existing authenticated preparation store remain intact. The Site identity/session is not represented as a proven shared MERGE CORE identity.

## E. Changed code

| Files | Purpose |
| --- | --- |
| `components/museum-world-workspace.tsx` | Shared spatial workspace, accessible fallback, layout editor and storyboard navigator |
| `lib/world-layout.ts` | Strict layout schema, collision/circulation limits, immutable history and elevator state machine |
| `lib/unified-world.ts` | Canonical scene routes and the three distinct groups of twelve |
| `lib/grand-atrium-scene.ts` | Existing unmounted renderer completed and connected to real Three.js architecture |
| `components/museum.tsx` | Account-scoped workspace memory and routes to existing tools |
| `components/grand-atrium.tsx` | Spatial entry points while preserving the old House/category workflow |
| `components/megapolis.tsx` | Existing city Brand Room action reuses the shared workspace |
| `lib/luxury-windows.ts` | Existing Museum window context reused |
| `app/museum-world.css`, `app/layout.tsx` | Scoped responsive luxury styling |
| `tests/unified-world.mjs`, `scripts/test-contracts.mjs` | New behavioral contract suite alongside all previous suites |
| `scripts/build-v25-manifests.mjs`, `docs/v25/*` | Reproducible asset, scene, source, identity and acceptance records |

## F. Validation and observed limits

All **18 contract suites pass**, including the previous 17 suites. TypeScript passes. The build is required by the packaging workflow before private deployment.

The new suite exercises scene aliases, independent groups of twelve, strict import rejection, source immutability, undo/redo branching, invalid geometry/collision guards, lift interlocks, arrival/return, reduced motion and finite bounded Three.js geometry. Component rendering checks English text and disabled CORE save/publication controls.

Observed in the desktop cloud browser: the existing entrance opens; the new Brand workspace opens; display selection/movement/rotation/undo work; layout export produces a real 1,211-byte valid JSON file; Material Lab opens and returning retains edited coordinates. The lift height reaches level 01. Browser restore encountered an automation timeout; the stale error-page tab could not be inspected under the browser URL policy. A fresh authorized HTTP preview then recovered successfully. The optional Playwright runner preflight also reports Chromium missing. No second browser installation was attempted. its browser result is **BLOCKED**, while the strict importer and round-trip data validation pass in contract tests. The final recovered desktop browser confirms no horizontal dialog overflow at 1363×936, exact official-logo source, 12 gallery positions, elevator arrival at level 01, actual editor Undo/Redo and the shared 30-card scene navigator. Reopening the shared editor retains the modified 75° display rotation. Floor 00 switches to the matching Atrium view while closing the doors. Its Fashion entrance opens the preserved Fashion House and Clothing category window without horizontal overflow. New screenshots are included in `v25/brand-room.jpg` and `v25/house-editor.jpg`.

Cloud WebGL initialization is unavailable. GPU appearance, actual avatar locomotion in the new atrium, mobile rendering, assistive-technology behavior and frame-rate targets are not certified. The 3D city/avatar replacement requested by the complete master specification is not claimed complete: the existing approved city presentation is preserved. Legacy panels and embedded raster captions can still contain Georgian; the newly implemented workspace is English.

The detailed matrix is `v25/acceptance-matrix.csv`; service status is `v25/release-status.json`. Historical version62 browser evidence remains in `docs/qa/2026-10-18` and is not relabeled as new-version evidence.

## G. Missing external dependencies

- MERGE CORE shared-session and authorized House/Brand Line resolution/creation contracts.
- CORE Fit Profile revision writes and authorized version/source/rights/publication services.
- Real CORE/Meshy generation service, server-held credentials and production GLB assets.
- Measured geometry, approved material recipes, batch passports, density/composition and approved pricing rules/snapshots.
- Verified offers, order registration, payment evidence, available-commission settlement, manufacturer/production/QC and authoritative Passport/QR endpoints.
- Real AI chat, mailbox/social OAuth providers and authorized external account operations.
- A real CORE staging tenant and desktop/mobile WebGL test devices.

No unavailable dependency is replaced by demo financial data or a fake success state.

## H. Decision register

| Item | Treatment in this variant |
| --- | --- |
| Coin price basis / surcharge contradictions across archives | Existing version62 behavior preserved; historical hardcoded demo prices excluded. Final payable amount remains CORE offer-owned. |
| 33%/33%/16.5%/16.5%/1% and separate 2% | Existing versioned financial specification preserved; no settlement implementation changed. |
| Material fraction vs actual product purity | Existing nominal formulation and batch-verification boundary retained. No certification inferred from a palette, photograph or polymer choice. |
| Auto Brand House creation | Remains required at the authorized eligible CORE save. A local layout file cannot create or certify a House. |
| Save vs publish | Local study export works. CORE save/publication remain explicitly disabled pending approved services. |
| 144-million growth scenario | Not converted into real orders, revenue or guaranteed demand. |
| Personal 12 lines vs industry Houses vs Zodiac | Separate presentation concepts, separate routes; no identifier or entitlement duplication. |

## I. Private release and rollback

This variant belongs to the existing Site project `appgprj_6ac2d9927d988191937a1887d59dfef8`. Preserve its owner-only audience and external visitor count zero. No public release or mergestars.com deployment is authorized by this delivery.

Rollback target: existing Site version62, source commit `6a4ed107a31bb8e3acf3fdbe5b71f5c559d7b69e` (the exact baseline is also recorded from Git in the asset manifest). Re-deploy that saved version privately with the Sites version tool if rollback is needed. There are no new database migrations to reverse. Private exported layout files remain user-owned studies and are not imported automatically into CORE.

## J. Staging blockers

The visual/private consolidation can be reviewed now. A real CORE staging pass still needs the contracts, test identities, provider configuration and actual source models listed above. Browser restore, full keyboard/focus regression, mobile and GPU visual checks must be completed on the staging build before calling the complete V25 flow passed.

## K. Live blockers

Production readiness remains **false**. Require real CORE end-to-end evidence, payment/permission/production checks, approved material/partner records, performance and recovery evidence, resolution of financial policy conflicts, a rollback rehearsal and explicit Founder approval before LIVE.

**One existing experience. One authoritative CORE. One history. No fabricated integration.**
