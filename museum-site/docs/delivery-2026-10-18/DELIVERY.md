# MERGE Living Museum — verified private update, 18 October 2026

This is a bounded correction to the existing owner-private Site, based on
version 64 (`0a00b99f355b92538f920677f06e5e078300bfa6`). It is not a
declaration that the full commercial MERGE platform is complete.

## What changed

The House collection browser now consumes the exact catalog read already used
by its House and brand filters. Previously it issued an independent catalog
request. A failure/recovery could leave the parent filters empty while the
child had a different response, and two competing error/retry panels appeared.
There is now one catalog response, loading/error state and retry for that House.
The retry preserves the category and entered search. Standalone catalog
browsers continue to use their existing read. Collection detail/model reads
remain separate, authoritative CORE reads.

Application files changed:

- `components/grand-atrium.tsx`
- `components/core-context.tsx`
- `tests/connected-houses.mjs` — recovery/duplicate-request regression coverage

This directory contains the actual browser evidence and contract results.
No database schema, migration, financial rule, session or CORE record changed.
No new backend, brand database, generated object or order was created.

## Preserved

The gate source images and opening sequence, approved city and avatar artwork,
official company identity asset, all uploaded images, House architecture and
categories, original My Brand Museum destination, saved preparation APIs,
existing commercial boundaries and common luxury window frame are unchanged.
Optional architectural studies remain optional; they are not My Museum.

## Browser verification

The local supervised preview used the current application source. Desktop
browser viewport was 1363 × 926; these are local UI checks, not authenticated
CORE staging end-to-end tests.

| Check | Result | Observed evidence |
| --- | --- | --- |
| Closed entrance → opening → same city | PASS, presentation path | City navigation enabled after the opening sequence. GPU gate rendering was unavailable in this browser. |
| Grand Museum overview | PASS | Approved artwork, canonical identity composition and twelve entrances visible. |
| MOSAIC HOUSE | PASS | Interior, 6 category entries, first category collection opened. |
| GAME HOUSE | PASS | Interior, 12 category entries, chess/draughts/backgammon/domino collection opened. |
| FASHION HOUSE | PASS | Interior, 8 category entries, Clothing and Shoes collection windows opened. |
| MUSICAL INSTRUMENTS HOUSE | PASS | Interior, 7 category entries, Strings collection opened. |
| ROBOTICS HOUSE | PASS | Interior, 6 category entries, Humanoids collection opened. |
| NATURE HOUSE | PASS | Interior, 6 category entries, Trees collection opened. |
| JEWELRY HOUSE | PASS | Interior, 6 category entries, Rings collection opened. |
| WATCH HOUSE | PASS | Interior, 4 category entries, Wristwatches collection opened. |
| EYEWEAR HOUSE | PASS | Interior, 4 category entries, Frames collection opened. |
| INTERIOR HOUSE | PASS | Interior, 6 category entries, Furniture collection opened. |
| ART HOUSE | PASS | Interior, 4 category entries, Sculpture collection opened. |
| MOBILITY HOUSE | PASS | Interior, 5 category entries, Cars collection opened. |
| Fashion next showcase | PASS | Clothing selection advanced to Shoes without opening an exhibit automatically. |
| Category return and search | PASS | Shoes and `sneaker` search retained after closing/reopening its collection window. |
| Fit navigation | PASS, UI only | Shoes opened the existing measurement window with footwear selected; closing returned to Shoes. No personal measurements entered. |
| City → Fashion | PASS | City Fashion hotspot opened the Fashion interior, not a product. |
| City My Museum | PASS, UI only | Opened the existing My Brand Museum preparation window; no replacement layout study. |
| Catalog retry after correction | PASS, unavailable path | A single loading/error panel; `coat` search and Clothing selection retained during retry. |
| Real catalog recovery | BLOCKED in browser | CORE could not be read in this environment. Recovery and matching authoritative records passed isolated contract tests only. |
| GPU animation / real product 3D | BLOCKED | Browser showed honest unavailable states. Approved photos were not represented as generated 3D. |
| Mobile hardware | NOT RUN | No mobile-device browser verification in this pass. |

## Automated verification

- PASS — 18/18 existing contract suites (`contracts.json`).
- PASS — TypeScript typecheck.
- PASS — new regression checks: one shared catalog read, one retry source,
  no competing fetch, recovery clears stale error, matching recovered collection
  remains selectable. These checks use explicitly isolated contract data.
- Hosting framework build/deployment results are recorded by the native Site
  version/deployment history after packaging; do not infer them from this file.

## Real CORE data and unavailable functions

The House catalog/collection browser, source viewer, model relay and LIVE metal
reference use existing CORE read adapters. The current local browser received
unavailable states, so no Museum screen in this pass demonstrated a successfully
loaded live CORE product, profile or price. No demo catalog or price replaced it.

The existing CORE mutation bridge remains fail-closed. This pass does not prove
shared MERGE login, real Brand House resolution/creation, persisted CORE Fit,
Meshy generation, new authoritative versions/lineage, measured weight,
approved LIVE-price snapshot, verification, offers, orders, payments,
commissions, manufacturer dispatch, QC, passports or QR attribution.
Personal AI/social-provider external actions also remain unconfigured.
Private preparation records are not products or orders.

## Required before staging acceptance

1. Existing CORE owners must supply the current authorized identity/session and
   write contracts, roles and a real staging test account. Do not invent routes.
2. Provide approved product/model records and generation/material/calculation
   contracts, including measurable geometry, material recipe and price snapshot.
3. Verify creation/lineage, rights and per-owner isolation against real staging.
4. Connect existing offer/order/payment/commission/production/QC/passport/QR
   services and obtain their actual evidence. Do not implement a second engine.
5. Confirm real-device GPU and mobile visual/navigation behavior.

## Required before LIVE

Real CORE staging and complete browser flow must pass, with payment, permission
and production evidence, approved partner/rights documentation, an operational
rollback and explicit Founder approval. `mergestars.com` was not deployed or
modified by this update. The existing Site remains owner-private.
