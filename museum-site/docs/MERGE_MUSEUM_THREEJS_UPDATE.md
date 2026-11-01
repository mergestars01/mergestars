# MERGE ⭐ STARS — Three.js Museum / integrated private update

Private Founder update of the existing Living Museum, 9 October 2026.

## Implemented

- The main spatial Museum now uses Three.js WebGLRenderer, a genuine 3D architecture buffer with more than 200,000 vertices, PBR materials, a reflective material floor, environmental reflections, warm/cool lighting and a bounded shadow map. Existing room proportions, nodes and navigation remain in use.
- MERGE gold/silver presentation mosaic uses 1,100 instanced tiles. Render-only geometry and materials are not manufacturing specifications.
- The canonical medallion, approved facade imagery and all 18 image exhibits remain their exact existing assets. Source images remain flat VIEW ONLY displays; they are not claimed to be reconstructed 3D products or statues.
- Four personal 3D vitrines are part of the same Museum scene. Choose a real public CORE catalog item, then “ჩემს 3D ვიტრინაში განთავსება”. The scene approaches its vitrine and loads the actual supported GLB with GLTFLoader, original geometry and embedded textures. No generic product page replaces the Museum.
- The in-scene model supports drag rotation, left/right rotation, zoom, automatic 360-degree rotation and returning to the preceding exact camera view. Keyboard left/right and +/- also work. The object is READY only after parsing, attachment and an actual render call succeed.
- Existing CORE collection search and 24-row pagination remain available. A completed Meshy model can use this path when its file has been saved in an accessible authoritative CORE collection. A generation request or hasModel3d flag alone does not establish READY.
- Private layout storage contains only slot + catalog item ID + collection slug. It is local browser presentation state, not a product/version database. On restoration each reference must resolve again through CORE; no copied file or stale local product metadata substitutes for CORE.
- One active model download at a time; one resident model on narrow/mobile canvases and at most two on desktop. Models outside this bound retain their CORE references and load when selected again. The still scene does not run a continuous animation loop.
- Existing read-only, fixed-origin CORE relay with streaming backpressure, 64 MiB file bound, 90-second timeout and no forwarded credentials is retained. Missing assets, unsupported decoders and unavailable CORE responses remain explicit failure states.
- The initially closed entrance, opening animation, original detail inspector, drafts, authentication boundaries, payments, production/QC/passport gates and hosting audience are preserved.

## Validation

- TypeScript noEmit passes.
- `tests/museum-three.mjs`: actual Three scene geometry/PBR/instancing; 72 desktop/mobile projection comparisons with established camera math; four vitrines clear all connected node routes; actual GLTFLoader test fixture; original mesh bytes/transforms remain unchanged under display scale and 360-degree rotation; CORE source matching and sanitized layout references.
- Existing renderer/SSR tests pass, including no automatic exhibit/product/price selection on entry.
- Spatial, display, closed-door, original-detail, tour, GLTF, model relay and public CORE read contract tests pass.
- Synthetic capacity checks pass for 200 concurrent reads and bounded cache/inflight state. This is not proof of hosted capacity for 200 simultaneous visitors or mobile GPU performance.
- Official five-phase production build passes. Full local Worker/API validation passes: identity/CSRF, owner isolation, persistence, immutable draft lineage, idempotent concurrent saves, closed commerce/generation gates, SSR and original assets. The initial local request to `/api/system` stalled once; the unchanged build passed on a fresh test-harness run. This does not establish hosted concurrent-visitor capacity.
- A current real public CORE read of `merge-renesans-247e4d` resolves MERGE COIN item `058c38c1-7deb-4ca6-9429-cc5ba08dec71` and passes the new exact CORE model-reference matcher. This is read/source evidence, not browser rendering or physical verification.

## Boundaries

MERGE CORE remains the system of record. No new product, commercial license, rights snapshot, physical geometry, weight, price, order, payment, QR or authoritative Museum association is created by personal layout placement. Public or permanent platform-wide exhibition publication still requires the corresponding CORE permission/association endpoint. CORE-private Meshy jobs are not exposed without the shared authenticated read contract.

Browser/GPU E2E is not asserted. The Sites skill states: “If `$control-browser` is unavailable, skip browser QA”. The control-browser skill is unavailable in this session, so no preview server or improvised browser path is used. See `/root/.codex/plugins/cache/openai-curated-remote/sites/1.0.0-c/skills/sites/SKILL.md`.

This is a Founder-only deployment to the existing project and URL. It is not a public or commercial CORE launch.

## Parallel source reconciliation

The remotely saved Version 22 Three integration (`9a24070106641986a639156d17cddb47c1038c4f`) was merged without overwriting remote history. Its public camera/geometry/renderer entry points are retained in `lib/museum-three.ts`; the one active world implementation now includes the extended PBR room and CORE vitrines in `lib/museum-three-scene.ts`. Both implementations are not run as separate worlds. Current local projection/resource tests are updated for the integrated scene, and the build/API checks are rerun after reconciliation.
