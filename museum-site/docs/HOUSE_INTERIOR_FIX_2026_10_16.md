# HOUSE interior fix · 16 October 2026

## Reported problem and cause

Entering Fashion House or another House opened only a category text/form dialog. The previous update did not mount a House interior at all. This was an experience-layer omission, independent of CORE availability. The Grand Museum artwork was present, but it did not supply House rooms.

## Change

- Entering any of the twelve House industries now mounts a dedicated `HouseShowroom` on the page. The main Grand Museum view is hidden while inside. No product or studio opens automatically.
- Fashion opens the Founder’s existing approved `founder-atrium-fashion.png` interior region, with its gold/silver vitrines. The original image bytes and company identity are preserved. The view is explicitly labelled approved interior artwork.
- Every House includes a real Three.js architectural room option: circular floor, textile accent, gold/silver columns and trim, dome/light installation, glass vitrines and display plinths. Materials and geometry are reused per room; category positions are bounded and deterministic. These architectural slots do not create CORE products or Brand Lines.
- Each category has a labelled, working showcase control. A showcase opens that House/category’s existing CORE catalog and design studio. Empty or unavailable CORE collections do not suppress the room itself or get replaced with invented products.
- Previous/next arrows select and approach showcases; Enter/Open explicitly opens the category. Mouse drag orbits the 3D room. Mobile controls, category strip, overview, fullscreen and return actions remain available.
- Closing a category returns to the same mounted House room and camera snapshot. The existing private brief workflow, material preference, Fit preparation and public CORE model viewing remain intact.
- Grand Museum navigation now explicitly resets the Grand overview instead of retaining a stale selected House/legacy view. Leaving the room restores the twelve House entrances.
- If WebGL cannot initialize, architectural fallback vitrines and every category control remain available. No `3D READY` or generated product state is fabricated.

## Verification

PASS: `tests/house-interiors.mjs` — real component SSR and actual callbacks for all twelve Houses; every category showcase exists without CORE data; exact Fashion asset is referenced; bounded finite Three.js room/vitrine geometry; no invented Product IDs; explicit category opening; arrow navigation without auto-opening; disabled guards; retained room snapshot; exit and Grand-reset wiring.

PASS: `tests/connected-houses.mjs`, including actual private Atelier API/store SQL against isolated SQLite; `tests/museum-gate.mjs`; `tests/personal-merge-ai.mjs`; `tests/photo-megapolis.mjs`; TypeScript and diff validation.

The final package builds from the exact pushed source. Browser/GPU/mobile visual E2E is NOT RUN: the Sites skill requires skipping browser QA when control-browser is unavailable. A successful build does not prove visual fidelity on every device.

## Preservation and limitations

No database migrations, CORE record writes, payment changes, new identity store, environment secrets or public audience changes. The approved entrance, Megapolis, canonical logo and saved private briefs remain unchanged.

The approved Fashion interior photograph is not described as a volumetric GLB. The new procedural 3D room is a reusable architectural implementation, not a claim of exact photorealistic reconstruction. Category vitrines are navigation/display architecture; actual catalog exhibits, generation, fitting, offers, orders, payment and production retain the existing authoritative CORE boundaries.

Main files: `components/house-showroom.tsx`, `lib/house-room.ts`, `lib/house-room-scene.ts`, `app/house-showroom.css`, `components/grand-atrium.tsx`, `components/museum.tsx`, `app/layout.tsx`, `tests/house-interiors.mjs`, `tests/connected-houses.mjs`.
