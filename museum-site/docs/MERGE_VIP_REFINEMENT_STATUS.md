# MERGE ⭐ STARS — VIP refinement review checkpoint

Prepared 2026-10-06 UTC in the existing Living Museum project, from deployed Saved Version 12.

Project: `appgprj_6ac2d9927d988191937a1887d59dfef8`
Existing private URL: https://merge-living-museum-atelier.mergestars01.chatgpt.site/

This checkpoint refines the existing spatial experience. It is not a completed Version 6 CORE integration. It is saved for review without changing the deployed version or audience.

## Exact approved reference

The latest uploaded Museum image is the existing `public/assets/approved-mega-museum.png`, 1535 × 1024. Its SHA-256 remains:

`6fb0305a4bc5cf2f71d2fc4c9ffbe41e1fb051265f9055a0a49865497f1ec406`

The original image is unchanged. The renderer uses its architectural areas on curved gallery surfaces and its central medallion on the central display. No replacement image or logo was generated. The reference's embedded labels, material claims and QR illustrations remain concept artwork, not authoritative product data.

## Implemented refinements

- AURUM and ARGENTUM reference architecture surrounds the continuous world; the gold/silver medallion occupies one central location.
- Black marble, restrained photographic reflections, floor inlays, fluted columns, mosaic detailing, ceiling details and illuminated podium edges.
- Image exhibits retain their aspect ratios and face their approach nodes. The eyewear presentation uses the original object's crop; the complete source remains available in the existing image viewer.
- Distance-aware camera easing and smoothly interpolated object framing. Desktop focus leaves space for the contextual panel; mobile framing positions the object above the bottom sheet.
- Gold floor controls, explicit look-left/look-right, map navigation by click or keyboard, fullscreen, previous position and original-reference controls.
- Smaller glass panels and availability details, clear VIEW ONLY labels, image loading readiness and real failure states.
- Exact camera restoration after closing an exhibit. The scene remains mounted behind the existing contextual workflows.
- Offscreen and hidden-document GPU rendering pauses; pixel density stays capped; shared image textures and navigation buffer cleanup remain bounded.

## Verification

| Check | Result | Evidence and scope |
| --- | --- | --- |
| TypeScript | PASS | `node node_modules/typescript/bin/tsc --noEmit` |
| Production artifact build | PASS | Sites `build-site.mjs`; all five Vinext build phases completed |
| Renderer lifecycle and responsive framing | PASS | `tests/museum-renderer.mjs`: exact photo readiness, crop bounds, 18 VIEW ONLY exhibits, desktop/mobile projection, smooth focus, bounded textures/buffers, disposal, isolated model rendering |
| Initial React output | PASS | Actual component SSR: entry node, no selected exhibit, no object/map/offer panel |
| Spatial navigation and exact return | PASS | `tests/museum-spatial.mjs`: connected branches, all exhibit approaches, restored pose, no physical/commercial scene values |
| Canonical entrance | PASS | `tests/museum-gate.mjs`: both existing door images and retained entry button use the same action |
| Retained tour, reference and sharing behavior | PASS | `museum-tour.mjs`, `museum-contract.mjs`, `museum-sharing.mjs` |
| Draft client behavior | PASS | `draft-client.mjs`: source/parent integrity, bounded transport, stable manual replay, no blind writes |
| CORE contract boundaries | PASS — contract fixtures | `core-read-contract.mjs`: permission/session distinctions, trusted source restrictions, unavailable verification/quote gates. This is not a staging pass. |
| Real native GPU rendering | PASS | Actual application shaders, buffers, image textures and draw commands replayed through EGL/GLES: entry, AURUM, selected eyewear and mobile frame, plus an explicitly synthetic single-triangle model fixture. No GL errors. |
| Preserved original assets, APIs and storage | PASS | Spatial preservation test hashes baseline `public/assets`, `app/api`, `db`, `drizzle`; all unchanged |
| Browser E2E | UNVERIFIED | Supported control-browser capability is unavailable. No browser screenshots, layout-interaction pass, fullscreen compatibility pass or frame-rate measurement is asserted. |
| Protected real CORE staging chain | BLOCKED | Shared authenticated session, Digital Twin/Fit, authoritative version writes, rights/Meshy, measurable weight, approved pricing/verified offer, orders/payments, production/QC/passport/QR/history still require approved CORE contracts and staging access. |

The image exhibits are VIEW ONLY. The tested synthetic geometry is local test data and never presented as a real Museum product. No new authoritative product IDs, weight, price, engagement or generation state is invented. No database or CORE endpoint was added or altered.

## Review frames

These are actual native renders of the application scene, without browser HTML panels or browser antialiasing. They are not new concept images and do not substitute for browser E2E:

- `previews/vip-interior.png` — entrance overview.
- `previews/vip-aurum.png` — different position in the same world.
- `previews/vip-exhibit.png` — explicit eyewear approach, still VIEW ONLY.
- `previews/vip-mobile.png` — actual mobile projection, contextual sheet omitted from this native canvas render.

Reproduce renderer checks with `node tests/museum-renderer.mjs`. Native visual validation requires Python/Pillow and EGL/GLES:

```sh
node tests/capture-museum-render.mjs /tmp/museum-frame.json entry
python tests/render-museum-egl.py /tmp/museum-frame.json /tmp/museum-frame.png
```

The capture helper accepts an exhibit ID, `@aurum` or another spatial node, optional width/height, or `fixture` for the explicitly synthetic isolated model check.

## Deployment boundary

The Founder approval explicitly applies only to “Saved Version №12 → existing project → existing URL → private deployment → founder-only access.” This refinement is a new saved version and is not deployed under that limited exception. Approval of the concrete new version is required before replacing the existing private publication. Public launch, CORE launch, live payments and production remain outside the scope.

Read-only Sites access confirmation during this task: owner role, custom access, one allowed user, zero groups and zero external viewers. No access policy or production deployment was changed.
