# MERGE Living Museum — 22 October 2026

Existing private Site: https://merge-living-museum-atelier.mergestars01.chatgpt.site

Baseline: saved version 72, source `4392f4de7e3d4a9a972c4dfeac5f43161c5985f0`.
This is an additive Museum experience update. It is not completion of external CORE, Meshy, AI, pricing, financial or manufacturing services. Public mergestars.com was not deployed.

## Delivered experience

The same approved entrance leads through the Megapolis to all twelve existing House interiors. A category now has inspectable geometric design studies even when the authoritative CORE catalog is unavailable. Every existing category has at least one study: 235 presentation references use 53 volumetric model families. Similar product types can share a family; these are not 235 individually AI-generated reconstructions.

| House | Example study families |
| --- | --- |
| Mosaic | Panels, curtains, rugs |
| Game | Chess, dominoes, puzzles, dolls, textile toys, construction sets |
| Fashion | Garments, shoes, bags, hats, belts, scarves |
| Musical Instruments | Guitar, violin, harp, winds, piano, percussion |
| Robotics | Humanoids and robot housings |
| Nature | Trees and flowers |
| Jewelry | Rings, earrings, necklaces, bracelets, crowns |
| Watches | Watches, clocks, cases |
| Eyewear | Frames, sunglasses, cases |
| Interior | Furniture, lighting, decor and room-object studies |
| Art | Sculpture, writing and collection studies |
| Mobility | Cars, motorcycles, bicycles, boats |

Each study has orbit/zoom/reset, keyboard and pointer controls, Gold/Silver visual finishes, three mosaic scales, three design languages and bounded variations. Variable-size mosaic tiles follow sampled geometry surfaces. Optional automatic rotation respects reduced motion. Rendering stops for inactive or hidden views.

Three.js provides the geometry and normal GPU rendering. If WebGL cannot initialize, the same geometric model is projected with a software triangle renderer. The UI identifies compatibility mode. This is interactive geometry, not a cropped photo. It is also not a scanned or manufacturing-verified model.

GLB export serializes the actual concept geometry and its CONCEPT provenance. Files have no verified physical scale, composition, weight or manufacturing approval. The normalized display scale is independent of real dimensions.

Approved photos, the official logo, entrance assets, city geometry and existing public CORE catalog/mesh pathways remain. On devices without WebGL the city shows the approved photo with misleading baked-in UI masked, alongside working navigation. Free avatar walking still requires WebGL. The approved entrance remains a photo-based closed/open sequence; no exact city/door reconstruction is claimed.

## Create, retain and save

Create My Version transfers the chosen reference, finish, mosaic, style and variation into the existing private design studio. Its description can be refined, a polymer candidate and integration method selected, and the brief saved through the existing authenticated Atelier API. My Museum reopens the stored visual configuration. New saves remain separate immutable briefs.

Per-House room memory and partial studio memory survive navigating within the open Museum session. Continue private draft restores incomplete inputs after closing the category. This transient memory is reset when the user session changes; refresh requires a server-saved brief. Technical configuration and package-planning details are collapsible.

The optional `visual_study` field is strictly validated against the House/category reference. Arbitrary CORE IDs, material approvals, price or weight cannot be supplied through it. Saved data uses the existing private experience-brief table, owner isolation, request hash, idempotent retry and limit of 100 briefs. No user database, CORE entity or production order was created. Existing briefs without the new field remain readable.

Compatibility note for rollback: older code with a strict pre-update intent schema does not recognize `visual_study` in newly saved JSON. Export new briefs or retain a compatible reader before reverting to old application code. No existing row is rewritten by this update.

## MERGE AI

The design gallery and studio open the existing personal manager with the selected study reference. The server resolves that reference into unverified presentation context. Existing authentication, consent, fixed provider adapters and fail-closed availability remain.

Live replies require configured provider credentials and model IDs. No live AI response, Meshy task, social publication, CORE registration, payment, commission or production authorization was performed. A locally constructed study must not be described as an AI generation job.

## Evidence

- PASS: 22/22 contract suites.
- PASS: TypeScript and production build.
- PASS: 235 unique study references across all existing House categories, finite volumetric geometry in 53 model families, bounded mosaic instances and display geometry.
- PASS: actual isolated SQLite save/read/new-version/replay/conflict/owner-isolation checks, legacy brief compatibility and rejection of forged or cross-category study facts.
- PASS: software renderer draws actual triangles; orbit changes the projection. Guitar, Chair and Chess serialize as valid binary glTF 2.0 with concept metadata.
- PASS: existing logo, source-photo and ASCENSION original hash checks. No baseline public asset was edited.
- PASS: Cloud Chrome desktop preview — approved closed/open entry; all twelve House interiors; first category and compatibility-rendered study in each House; rotation controls; return to House. Mouse and keyboard close paths were exercised.
- PASS: desktop UI changes to finish, mosaic and style; Create My Version receives them. Close/reopen/Continue restores Gold tone, Architectural mosaic, Sculptural style and variation 1.
- PASS: selected Guitar reference and truthful provider readiness/consent appear in the personal AI panel.
- LIMIT: WebGL was disabled by the managed browser, so GPU rendering, free city walking and GPU room cameras were not visually verified. Compatibility rendering was visually inspected.
- NOT RUN: mobile-browser/touch/pinch tests, authenticated hosted save, live provider and CORE commerce/production E2E.
- NOT VERIFIED: browser download receipt. The export UI completed and binary serialization passed, but the browser tool's download-event wait timed out.

The preview initially refused connections because the restored checkout lacked its ignored execution profile. The supported profile helper repaired it to managed-linux, and the managed preview then opened successfully. No alternative browser or unsupervised server was used.

`browser-qa.json` contains the twelve-House observation matrix and explicit limits. `gallery.jpg` is an actual managed-preview screenshot. The checked-in Playwright suite was aligned with the current city route and expanded for studio restoration, but was not run as a separate browser process in the managed environment.

Private publication is reported from the native Sites deployment result. Retain founder-only audience; public launch requires the founder's authorization.
