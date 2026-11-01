# MERGE Living Museum — closed entrance and original-detail update

2026-10-09. Existing project, based on privately deployed Version 20 / `bef3b19f5287530764e984dac32826490c820b1c`.

## Changes

- Both entrance variants now start in an explicit CLOSED state. Generated closed leaves are masked onto the original entrance composition; the original architecture remains underneath. Touch/click/keyboard activation opens the gold and silver leaves, then enters the same Museum overview after 1.8 seconds. Reduced-motion entry is immediate. Repeated activation is guarded before the next React render. Returning to the entrance resets it to CLOSED.
- No product is selected on entry, and no product/price/passport panel opens automatically. Existing halls, routes, exact camera-return behavior, source photographs, logos, drafts and commercial boundaries remain.
- Every one of the 18 spatial exhibits has an original-detail action. It focuses the selected source crop and loads the original PNG, with bounded zoom, panning, touch pinch, keyboard controls, exact 1:1 pixels, reset, loading and retry states. Closing the layer does not change the Museum node or camera.
- Original-photo browsing uses the same detail inspector. The source resolution is shown rather than making an unsupported HD claim. Small source crops do not gain invented detail; real 360-degree inspection still requires an actual model.
- Approaching a photo exhibit promotes its shared GPU texture from the presentation derivative to the intact original. Obsolete derivative loads cannot overwrite the original. There are still only three shared source textures, not 18 model preloads. Higher UV precision preserves texture sampling detail.
- The selected-exhibit tools now open the existing CORE 3D collection vitrine directly. It resolves public CORE records and uses the existing real-GLB viewer. This does not permanently associate an unrelated Museum photo with a CORE product or grant creation/commerce rights.
- Fixed two concrete real-model loading blockers: the existing public model responses have no browser CORS permission and the inspected files exceed the old 32 MiB bound. The same-origin, read-only model relay streams the fixed public CORE endpoint with backpressure, no forwarded credentials, no redirects, no stored model record, a 64 MiB bound and a 90-second timeout. Client loading allocates one exact-size model buffer from its GLB header and shows actual download progress/cancellation. Source materials and geometry are not replaced or simplified.

## Assets

Generated with the built-in Imagegen tool; no source image was overwritten. Project assets:

- `/workspace/sites/merge-living-museum/public/assets/entrance-closed.png`
- `/workspace/sites/merge-living-museum/public/assets/entrance-dual-closed.png`
- Lossless WebP copies at the same names inside `public/assets/optimized/`, preserving full dimensions and decoded image detail. Main: 1672 × 941, 2,120,040 bytes. Dual: 1536 × 1024, 2,210,806 bytes.

These are entrance animation frames, not 3D product assets, certification, material verification or a new Museum design. The exact canonical header marks remain their original files.

## Imagegen prompts

### Main entrance

Use case: precise-object-edit. Asset type: closed entrance frame for the existing interactive MERGE luxury museum. EDIT TARGET: the supplied image /assets/entrance.png. Change ONLY the state of the pair of monumental gold and silver semicircular entrance door leaves: bring them together so the central gap is completely CLOSED, forming one continuous closed round portal. There must be no view through the entrance into the hall. Preserve EXACTLY the same architecture, black marble walls, floor, gold and silver materials, rich engraved gold female portrait and silver male portrait, certification plaque artwork, inscriptions, existing company symbols, camera position, framing, lighting and atmosphere. Do not create or reinterpret any logo or letters. Preserve the outer logo plaques and floor logo from the input. The closed door must plausibly match this exact entrance; the gold left and silver right leaves meet with a straight vertical seam at the exact center. Preserve all intricate surface detail, chain engravings, beads and metallic reflections at maximum crisp photographic quality. No people, no new objects, no new lettering, no new Museum concept, no stylistic redesign. Output the same wide image composition as the reference, edge-to-edge, without added borders. This is only an initial closed state for a real opening interaction implemented in code; it is not a new website or a 3D product model.

### AURUM / ARGENTUM

Use case: precise-object-edit. Edit the supplied EXISTING AURUM / ARGENTUM entrance image. Create its CLOSED door state, not a new Museum. Preserve the gold female statue at left, silver male statue at right, every marble wall, plaque, framing, typography, lighting and exact existing symbols unchanged. Only change the large central circular two-leaf gold-left/silver-right MERGE COIN portal to be FULLY CLOSED, its semicircular leaves fitting together at a narrow centered vertical seam. No glimpse of the halls through that portal; opaque engraved gold and silver metal. The same circular chain-mosaic ornament, source door artwork, source company logo geometry and inscriptions must remain intact. Do NOT add, redraw, reinterpret or invent logos, signs, objects or writing. Match source camera, perspective, proportions and existing luxurious black/gold/silver architecture. Maximum crisp detail of existing material. Keep the wide 3:2 composition, with all original edges and no borders. This image is only the closed starting frame of the existing Museum entrance; actual opening and entry will be implemented in code.

## Verification and limits

- TypeScript, entrance, image-detail, renderer, spatial navigation, display/tour, capacity and textured GLB-loader checks passed. Native EGL/GLES successfully compiled and rendered the updated Museum shaders, commands and textures; it does not prove browser behavior.
- Public CORE catalog returned HTTP 200 with six collections during inspection. Three public collection responses validated against the existing contract, including ten actual records with model URLs. Another catalog request timed out: service access was intermittent. These reads do not prove protected identity, generation or commerce integration.
- The actual CORE MERGE COIN model `058c38c1-7deb-4ca6-9429-cc5ba08dec71` passed the complete read relay/client download and GLB validation: 52,428,464 bytes, 114,730 position vertices, four embedded textures. The existing silver-case header declares 52,683,216 bytes. These are observed source-file properties, not physical weight, dimensions, verification or evidence of browser-stage rendering.
- Relay tests verify backpressure, cancellation, approved origin, UUID validation, missing/denied/redirected/malformed/truncated sources and transfer bounds. The actual API mutation handler remains unchanged; the new route serves only public model reads.
- All pre-existing original PNGs and protected CORE, storage and payment files are retained. No database schema or authoritative product/version record is created.
- Browser QA is unavailable under the Sites instruction: “If `$control-browser` is unavailable, skip browser QA”. No substitute browser-control path was used. Hosted multi-visitor capacity and the complete CORE staging acceptance chain remain unverified.

Release remains Founder-only at the existing URL. No public, financial or production launch.
