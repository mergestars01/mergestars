# Approved entrance, faceless avatars and measurement map

Existing MERGE Living Museum project: appgprj_6ac2d9927d988191937a1887d59dfef8.
Starting source: 588f3cb324a71114ab54576d7e14689c79a8fe11, saved Version 34.
Scope: the founder's supplied three-image sequence and ten-section avatar/Fit addendum. Existing MASTER PROMPT and authoritative CORE were not replaced.

## Source references

The actual attachments existed locally despite the earlier image-reading messages. Copied intact into this same Site; no image, text or logo was regenerated.

| Role | Original | Site asset | SHA-256 |
|---|---|---|---|
| Closed gate | Золотые врата города звёзд.png | founder-entry-closed.png | 6e6c3fd2147c5f082a16d35adc608c7d5592e955d5dbfd686249c0367d20081e |
| Open gate | Золотые врата города Merge Stars (1).png | founder-entry-open.png | 5d94a6d764ad7789cdc091050dad1c26ee29fc6bc755ee29c9a4711921b001bd |
| City/avatar architecture | Золотой мегаполис музея будущего (1)(1).png | founder-megapolis-reference.png | 157915e622659b9f08fc785cc112fbfd4e7c5e76699e58710764e58084b685ef |

The reference images have different perspective and ornament arrangements. The single articulated 3D gate retains the original closed-reference ornament pixels while physically opening; the second image remains the approved opening reference and explicit image fallback. No claim of a pixel-identical three-frame reconstruction. Image 3's account portrait, prices and interface are concept artwork only, not live data; the full image is available in the clearly labelled architectural reference viewer.

## Implemented

- One retained Three.js city canvas/renderer owns CLOSED → OPENING → INSIDE. Thick semicircular leaves have separate real hinges. The camera waits for the opening and then passes the gate into the same city. Entry does not create/select a product. Reduced motion goes directly inside. Loading/failed-WebGL views identify the actual image fallback.
- Public catalog arrival no longer changes the canvas key or reconstructs the thematic city during entry; geometry identity, avatar/quality choice and explicit context recovery control reconstruction.
- City rotundas, ivory/dark stone, gold/silver cornices, domed central Museum, railings, water, gardens and distant mountains are procedural 3D. The main Museum has an identity-linked marker and route; existing 12 HOUSE/CORE collection navigation, brand districts, Georgian church, exhibits and saved data remain.
- Woman/man avatars have smooth anonymous heads and neutral fitted bodysuits. No eyes, nose, hair, recognizable facial features or face-photo input. Same model builder is used in the city and measurement editor. The walking rig retains ground contact across supported leg-length previews.
- A rotatable/zoomable 3D measurement map, touch drag/pinch, accessible field list, missing-value labels, units and per-field guidance. Includes height, shoulders, chest, waist, hips, neck, arm/leg, both wrists, selected hand/finger, both foot lengths/widths, shoe system and eyewear/head parameters.
- Explicit temporary-processing consent. Revocation clears entered measurements. No browser storage, profile database, face photos, guessed measurements, inferred shoe sizes or invented CORE revision. Origin tags distinguish user-entered, computed and CORE-verified values; computed values cannot satisfy measured-input requirements.
- Valid entered dimensions change bounded display proportions. The display is labelled illustrative, not a scan or manufacturing-grade fit. Body, wrist and foot proportions are separate from source-product geometry.
- The editor can open from the city, a HOUSE, a selected concept or registration. Closing it does not unmount the city, discard registration input or change the selected exhibit/position/camera. Draft measurements remain in the parent React state until the page/session ends.
- Category checks distinguish finger/hand, wrist, apparel, bilateral feet and eyewear. Missing required fields link directly to their editor. Unknown product requirements remain unavailable. A completed form never authorizes fitting, a verified offer or an order.

## Explicitly incomplete / blocked

| Requirement | Status and evidence |
|---|---|
| Save/load the user's real CORE Fit Profile | BLOCKED: existing `/api/core/fit` reports dependency required; no authenticated read/write contract, shared CORE identity mapping or runtime configuration is supplied. Save is visibly disabled. No profile or revision was fabricated. |
| Bind an order to its Fit Profile revision | BLOCKED until an authoritative revision, consent and product-specific measurement requirements exist. `fitReadiness` always denies order/actual-fit eligibility in this state. |
| Real product fitting or fitted manufacturing geometry | UNAVAILABLE; display proportions are illustrative only. No product geometry/weight/price was inferred. |
| Create a new authoritative version / automatic Brand House on first CORE save | Existing founder rule retained; protected CORE writes remain closed. No local brand activation or duplicate product was created. |
| Meshy queue/generation and verified offer/order/payment/production/QC/passport | Existing pending/unavailable boundaries retained. Runtime variables were empty (revision 0); no live generation or financial success asserted. |
| Freely walk inside every HOUSE | PARTIAL: exterior architecture/hinged doors and contextual existing CORE collection views work in code. Complete freely traversable 3D interiors for every HOUSE are not implemented. |
| Reference-level photographic/AAA appearance on a browser/phone | NOT PROVEN. Procedural architecture and PBR materials are implemented; browser, device GPU and mobile visual/performance QA were not available. |

The requested end-to-end completion criteria are therefore not all met. This is a Founder-private experience update, not commercial activation or public launch.

## Preservation and changed files

No API handler, CORE contract, identity source asset, database schema/migration, pricing rule, payment logic, stored design draft or atelier record was changed.

New: `lib/megapolis-entrance.ts`, `lib/fit-measurements.ts`, `lib/fit-preview.ts`, `components/measurement-map.tsx`, `app/personal-megapolis.css`, `tests/personal-fit.mjs`, this report and the three intact reference images.

Updated: `components/museum.tsx`, `components/museum-gate.tsx`, `components/megapolis.tsx`, `lib/presentation-avatar.ts`, `lib/megapolis-scene.ts`, `lib/megapolis-motion.ts`, `lib/megapolis-domain.ts`, `app/layout.tsx`, `tests/museum-gate.mjs`, `tests/megapolis.mjs`.

## Validation

PASS: TypeScript; consent/range/unit tests; left/right hand and finger isolation; bilateral feet and shoe-system requirements; computed-input/unknown-requirement rejection; no invented revision/order; faceless finite-geometry avatars and planted gait across leg proportions; entry timing/real-leaf movement before camera travel; one mounted city scene; approved source image hashes; retained original assets and exact official identity; HOUSE/brand privacy; bounded geometry; camera/return/quality regression tests; CORE read contracts and unchanged mutation/storage boundaries.

A geometry-budget failure was fixed by instancing the repeated cornices. Current presentation geometry: 479 mesh nodes and 158,226 triangles; highest tested avatar: 28,354 triangles. These are geometry checks, not measured browser FPS.

The HTTP `foundation-api` runner was not executed successfully: its guard requires an explicit local preview origin. Browser preview was unavailable under the Sites managed-environment rules; no substitute server/browser path was started. This is NOT RUN/BLOCKED, not a real CORE end-to-end pass. No production identity, profile persistence, payment, permission, manufacturing or mobile-browser E2E evidence is claimed.

The exact source is built/packaged and published through the native Site workflow; final build and private deployment results are separate release evidence. Same URL and owner-only audience are preserved.
