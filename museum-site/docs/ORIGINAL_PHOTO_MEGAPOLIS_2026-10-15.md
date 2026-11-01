# Original photographic Megapolis — correction of Version 35

Same project: `appgprj_6ac2d9927d988191937a1887d59dfef8`.
Baseline: saved Version 35, source `1dbdfdf4c59b167368b1345b1cd95bd834011ae6`.

The founder rejected the procedural city and mannequin as visually different from the supplied picture. The default experience after entering now uses that exact picture as its photographic scene. It does not claim that a photograph has become a freely traversable 3D model.

## Actual image

Attachment: `Золотой мегаполис музея будущего (1)(2).png`.
It is byte-identical to the already retained `/assets/founder-megapolis-reference.png`:
`157915e622659b9f08fc785cc112fbfd4e7c5e76699e58710764e58084b685ef`.
Dimensions: 1536 × 1024. No image generation, cropping, avatar cutout, replacement architecture or redrawn company logo was used.

## Implemented

- The same architecture, dome, terraces, waterfall setting, camera composition and white/gold reference avatar are the default view. The rejected procedural city is hidden and its renderer disposed after entry. No procedural mannequin is superimposed on the picture.
- A Three.js shader performs small local optical movements of water, reflections, hair and the reference figure. These are photographic warps, not a walking skeleton or reconstructed geometry. Pause, reduced motion, visibility/intersection suspension, WebGL recovery and the original static image fallback are implemented.
- The gate opens toward a photographic backdrop of this same city. The old procedural city is suppressed during that opening. Both gate and backdrop assets must load before the normal ready state.
- Actual HTML buttons replace the drawing's account, price, tool, creation, navigation and thumbnail panels. Opaque aligned DOM masks and independent shader masks hide fictional account/price values. The source artwork remains unchanged on disk.
- Existing site identity, collection, order-status, passport, Brand Museum/atelier, measurements, community and Coin-rule routes remain the destinations. The artwork's user portrait, Master ID, sample prices and partner-looking product decorations are never used as authoritative records.
- House hotspots open the matching existing House/category picker: Watch, Jewelry, Fashion, Bags within Fashion, Interior, Art. Main Museum and Brand Museum navigation are separate actions. The complete 12-House navigator and filmstrip preserve all categories, including Game, Music, Mosaic and Robotics.
- Pan/zoom transform the picture and aligned controls together; reset restores the exact full frame. They are labelled camera/image controls, not avatar locomotion. Mobile scrolling and a separate touch toolbar retain access to all actions.
- Current photo camera state survives House dialogs, measurements and returning from the existing Museum. The existing Georgian church 3D concept and Nature catalog/information are still available from the House map, separately from the photographic main scene.
- Canonical `CompanyMark`/`CompanyWordmark` components remain unchanged. The source picture's embedded decorative branding remains artwork, not a replacement identity asset.

## Incomplete — no completion claim

The requested full 3D reconstruction is **not completed**. The reference avatar cannot walk through this photograph, turn around, enter its photographed buildings or try on a real product. Photo breathing/hair motion is not described as walking. Exact interior/hidden geometry and a reference-matching rigged GLB avatar are not supplied. These require actual 3D assets or an available generation/reconstruction workflow and device/browser validation.

The existing measurement preview remains a separate illustrative faceless model. Its draft is held in React memory and is lost on refresh; CORE saving and real product fitting remain unavailable. No new Fit Profile or measurement store was created.

CORE/Meshy identity, version creation, auto Brand House creation, verification, orders, payments, manufacturing, QC and Passport/QR retain their previous protected boundaries. No absent capability or approved live price was simulated. Runtime configuration was still empty when inspected. The metal-price button opens the existing `/api/core/prices` reference, not a second price engine or a live payable offer.

## Files and data

New: `lib/photo-megapolis.ts`, `lib/photo-megapolis-renderer.ts`, `components/photo-megapolis.tsx`, `app/photo-megapolis.css`, `tests/photo-megapolis.mjs`, this report.

Updated: `components/megapolis.tsx`, `components/museum.tsx`, `lib/megapolis-scene.ts`, `app/layout.tsx`.

No database change, migration, API mutation contract, price/payment/commission rule, existing stored design, canonical identity asset or uploaded reference was changed. The existing source repository and private Site identity are retained.

## Validation and release limits

PASS: exact image hash/dimensions; masks covering artwork identity/price/UI pixels while preserving the reference avatar and main architecture; actual hotspot callback routing and disabled guards; all 12 House navigation entries; bounded camera/reset; shared collection/order/passport callbacks; canonical logo; no added CORE storage. This is `node tests/photo-megapolis.mjs` and includes actual server-rendered markup and event-handler checks.

PASS: existing gate, royal assets/identity, personal-fit, House/brand/privacy, articulated-avatar, CORE-read and spatial-Museum regression tests. TypeScript and whitespace checks passed. These tests do not establish a browser/GPU result. The native packaging workflow requires the production build before saving this release.

Browser/GPU shader, exact screen layout, mobile touch, device performance, live authenticated CORE and manufacturing/payment end-to-end: **NOT RUN / BLOCKED**. The managed environment does not offer the required browser-control capability; no substitute browser/server was started. Therefore photographic animation is implemented in code but browser visual quality is not verified.

Release target: the same Founder-only Site and URL. No public domain/LIVE launch or audience change is authorized or performed.
