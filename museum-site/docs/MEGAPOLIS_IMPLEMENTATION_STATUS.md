# MERGE MEGAPOLIS — source implementation and verification

Founder direction, 11 October 2026: one city-museum for development and ecology; streets contain Brand Houses; a visitor avatar moves through the city; MOSAIC HOUSE is separate; GAME HOUSE includes games and the full toy taxonomy; Robotics and Musical Instruments have their own Houses; sculptural nature retains natural colors with gold/silver presentation accents. Canonical logo source files remain unchanged.

## Implemented in the existing Museum project

- A Three.js boulevard with volumetric buildings, trees, flowers, variable-size colored mosaic, gold/silver details, curtains, stone columns, architectural M-shaped palace ribs and a third-person visitor representation. PBR environment reflections, cached soft shadows, camera smoothing, gentle plant/curtain/water motion, keyboard/touch controls, bounded street movement, map navigation and cleanup are implemented. Animation is capped at 30 fps, pauses for hidden/offscreen views and dialogs, and respects reduced-motion preferences. Browser performance is not yet measured.
- The existing Museum remains reachable from the city. City position is retained when visiting the Museum. Real CORE model selection uses the existing viewer, relay and Museum vitrine placement flow.
- Themed HOUSE menus are presentation taxonomy; they do not create authoritative CORE categories, Products or Houses. GAME HOUSE includes textile, rubber-type, construction, infant, educational, outdoor, musical, interactive and conventional game categories. Fashion retains the founder's exclusions.
- The public brand district groups existing CORE public collections by actual `brandLineId`, with a maximum of 12 visible building projections per district page. It does not infer identity from brand names, claim a confirmed partnership or fabricate a House ID.
- Scene-projected arrow buttons resolve to the same House/Brand Line identity as their facade. Markers behind or outside the camera are hidden; the map lists all currently returned public Brand Lines, including other district pages.
- A Georgian cross-dome church concept is a separate virtual city landmark with its own camera view, orbit/zoom controls, gentle light variation and return to the retained street position. It is not an authoritative product, confirmed religious partnership or operational religious service.
- Chat/comment screens exist at city and House level and read the central CORE availability boundary. Both remain explicitly unavailable; no messages, comments, receipts, active-user counts, account mappings or storage are invented. The central contract now recognizes `comments` as a required capability and exposes the missing-contract state distinctly from an offline CORE.
- House menus filter the existing public CORE catalog using its existing collection slugs. Subcategory-specific taxonomy links remain unavailable. The existing API caps of 200 collections and 500 items per collection are preserved; unlimited retrieval is not claimed.
- Nature information shows physical dimensions pending, approximate kg `CALCULATION PENDING`, verified weight `VERIFICATION REQUIRED`, and material composition pending CORE Material Lab. Changing a scene tone does not certify physical composition.
- The city concept image is generated using the existing mark and wordmark as references and includes the Georgian church, richer multi-storey Houses, natural gardens and a clearly pending chat indicator. It is included in the architecture-concept section; it is not a runtime screenshot or video. Generated image branding is illustrative; runtime city signs load the original unchanged PNG assets directly.

## Preserved

Existing project identity, audience, source history, original uploaded assets, canonical mark/wordmark, entrance door interactions, Museum architecture and interactions, draft contracts/storage, registration preparation, existing Core public read contracts, Three model loader/relay, payment protections, order/production fail-closed boundaries and commercial readiness screens. The founder's locked V22.7 document is not replaced.

## Files changed

`components/museum.tsx`, `components/core-context.tsx`, `components/megapolis.tsx`, `components/core-community.tsx`, `lib/megapolis-domain.ts`, `lib/megapolis-scene.ts`, `lib/core-contract.ts`, `lib/core-read-state.ts`, `app/globals.css`, `app/megapolis.css`, `public/assets/megapolis-city-concept.png`, `tests/megapolis.mjs`, and this report.

## Database changes

None. No new user account, Brand House, product, payment engine, Fit Profile or source-of-truth store is created. The avatar and architectural plants are presentation geometry only.

## Remaining integration and evidence requirements

CORE shared authentication, authoritative House resolution/creation, private/public version writes, Meshy generation, Fit Profile/Digital Twin, real physical dimensions/geometry units, approved density/composition, authoritative weight calculation, approved live pricing snapshot, verification/offer/order/payment, production/QC, passport/QR and permissions are not completed by this city layer. None may be simulated as operational.

Chat delivery, comment persistence/moderation, notifications and live visitor/like/view counters require the authoritative CORE contracts and shared identity. No independent social database is added. No rendered video is generated by the application; it is a realtime Three.js scene, not a claimed AAA graphics result.

The public catalog supplies `brandLineId` but not authoritative `house_id` or partner authorization. Brand Line projections are explicitly distinguished from proven Brand House ownership. No unauthorized logos are used. The city-museum environmental mission is not a measured ecological certification.

## Validation

PASS: TypeScript (`tsc --noEmit`), production build, and eight executable checks: `megapolis`, `three-museum`, `museum-spatial`, `museum-tour`, `core-read-contract`, `core-textured-model`, `registration-funding`, `museum-gate`.

PASS: real `https://mergestars.com/api/catalog/public` returned HTTP 200 and passed the existing CORE contract validation: 6 public collections and 5 distinct Brand Line IDs at 2026-10-11 04:37 UTC. This is public-read evidence only, not shared authentication, creation, staging, payment or production evidence.

The first TypeScript check after the final church/community additions failed on an icon import shadowing the native `Map` constructor and an extra geometry argument. Both were corrected; the final TypeScript check, all eight checks and production build pass. Existing build warning: a Three.js client chunk exceeds 500 kB. Public category matching and subcategory assignment remain limited by the existing upstream taxonomy contract. Real CORE staging, browser GPU/touch rendering, authentication and financial/production evidence remain BLOCKED / NOT RUN until the required environments and contracts are available.

Before staging: provide shared CORE session/authorization and current contracts for the unavailable capabilities; prove private/public permissions; validate browser GPU, touch, visual quality and performance. Before LIVE: pass real staging end-to-end checks and payment/permission/production evidence, then obtain explicit founder approval. A fully functional tomorrow deadline is not claimed.

## Deployment

Save source/version only. No live deployment is authorized. This selected Sites Museum is an integration/reference project; `mergestars.com` remains the final platform target and has not been modified or deployed through these changes.
