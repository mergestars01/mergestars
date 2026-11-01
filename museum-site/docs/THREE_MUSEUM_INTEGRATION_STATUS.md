# Historical saved Version 22 — Three.js Museum integration

This report describes the independently saved Version 22 source. The integrated private update preserves its public camera/geometry APIs and adds in-scene CORE vitrines/PBR lighting; see [current update](MERGE_MUSEUM_THREEJS_UPDATE.md).

Baseline: saved Version 21, source e915aebada1a4c26a8c7021c50aa8113583f625d.

## Delivered

The existing continuous Museum world now uses Three.js 0.186.1 WebGLRenderer, Scene, PerspectiveCamera, BufferGeometry, Mesh and ShaderMaterial. Its approved geometry (floor, columns, vaulted features, chandeliers, plinths), reference facade crops, canonical medallion and eighteen exhibit silhouettes are reused, not redesigned. Existing gold/silver lighting and floor/reflection shader are preserved. A real Three projection matrix preserves the existing side-panel/mobile-sheet framing exactly.

Texture sampling now uses Three-managed mipmaps and bounded anisotropy. Shared optimized images load by proximity; approaching an exhibit requests the intact original. Pixel ratio is capped at 1.7, rendering remains on demand, identical canvas dimensions do not reallocate on every frame, navigation meshes are replaced instead of accumulated, and geometry/material/texture/context resources are released on teardown. Rendering errors and WebGL 2 incompatibility produce a visible unavailable state.

The baseline already uses Three.js GLTFLoader and a PBR-lit 360-degree stage for authoritative CORE models in its collection vitrine. This is preserved. Models are loaded through the existing guarded same-origin model proxy, not arbitrary direct URLs. Embedded GLB textures and materials remain supported; rotation, zoom, reset, progress, cancel, retry and context-loss controls remain intact. A generated Meshy model can be displayed after it becomes an authoritative CORE model asset. This change does not create a generation endpoint or pretend a job completed.

## Preserved

Entrance, doors, logo, eighteen original images and all additional approved assets; route graph, keyboard/touch navigation, exact return pose, categories, draft storage, collections, CORE public model/catalog/price/identity adapters, protected mutation boundaries and payment rules. No database changes, migrations, new CORE, generation queue, model registrations or paid operations. No deployment or access changes.

The former WebGL module remains as the shared geometry/shader source and legacy regression reference. The live Museum component imports museum-three; the old raw-WebGL renderer is no longer the world render path. The real-model vitrine retains its separate focused stage and existing CORE source ownership.

## Files changed

- lib/museum-three.ts (new world renderer)
- lib/museum-webgl.ts (exports preserved presentation geometry/shader)
- components/museum-spatial.tsx (Three renderer selection and visible graphics failures)
- tests/three-museum.mjs (new projection/resource lifecycle test)
- tests/museum-renderer.mjs (SSR import mock updated)
- this report

## Verification

PASS: TypeScript; production build; Three Museum projection/resource tests; Museum tour; canonical gate; spatial/source preservation contract; retained renderer regression; real GLTFLoader/PBR fixture and guarded model transfer contract; diff whitespace checks. The Three test uses actual Three cameras, meshes, geometry, materials and textures with a mocked GPU transport. It proves projection parity and disposal, not GPU shader compilation or browser visuals. Existing legacy renderer tests do not prove the new GPU path.

Build warns about a shared Three chunk larger than 500 kB; the Museum and model stages remain lazy-loaded. This is not a failed build. Full API suite was not rerun because routes/storage did not change; prior foundation timeout is not declared fixed.

## Unavailable and staging blockers

Browser/WebGL 2 rendering, texture decoding, GPU shader compilation, screenshots, mobile performance and browser end-to-end were not tested in this managed runtime. Sites SKILL.md instructs: “If `$control-browser` is unavailable, skip browser QA”. No browser workaround or local preview was started.

The photo silhouettes are still honestly VIEW ONLY, not reconstructed 360-degree product meshes. Approved reference photographs remain presentation textures on 3D architecture. Exact source architectural geometry cannot be inferred from a photograph. Replacing each image exhibit requires its authorized 3D asset and CORE product/exhibit/placement mapping.

Meshy job creation/results, authorisation/credits, server integration, source/rights/version registration, fitting, verified physical calculation, payment, production, QC and Passport remain dependent on the authoritative CORE contracts. No real CORE/Meshy browser end-to-end or manufacturing readiness is claimed. Persistent placement in a hall remains disabled until CORE records authorize it. Compressed Draco/Meshopt/KTX2 models still require approved decoders and fail closed.

Before LIVE: real CORE staging evidence, GPU/browser/mobile QA, financial/permission/production evidence and explicit founder approval. This change is saved only.

Official technical references: https://threejs.org/docs/pages/WebGLRenderer.html ; https://threejs.org/docs/pages/GLTFLoader.html ; https://threejs.org/manual/pages/how-to-dispose-of-objects.html
