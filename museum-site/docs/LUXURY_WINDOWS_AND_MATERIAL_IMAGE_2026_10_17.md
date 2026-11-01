# Approved-image window system and material-image correction

## Delivered scope

The existing owner-private Living Museum Site is updated in place. All thirteen existing dialog call sites use the same architectural window shell, with context-specific image headers. The main Museum dialog covers its eighteen existing panels through a single context map. Shared sheet, alert, select, dropdown, popover and tooltip surfaces use the same black, warm-gold and silver visual language.

The shell adds the exact official SVG logo, refined serif titles, thin architectural borders, an image-led header, six place/context labels, a separately scrolling body and a fixed accessible close control. Standard, wide and expanded widths follow the actual task. Small screens receive compact headers, wrapped context labels and one-column controls; reduced-motion preferences remain supported.

Existing Radix primitives, title/description associations, callbacks, disabled guards, child components, custom close actions and focus-return handlers are preserved. The journey strip describes location/context only: it is not a completed-step indicator, a financial status or an authorization gate.

## References inspected

The founder's current four Library references were materialized and visually inspected: the combined Grand Museum / Fashion composition; the approved MERGE AI brand-manager board; the museum entrance/city reference; and the current Megapolis image. Existing material library and passport artwork were inspected as well.

| Reference | Applied relationship |
| --- | --- |
| Closed gate → open gate → Megapolis | Original entrance behavior and initial reference order |
| Grand Museum atrium | House, exhibit, collection and order-window architecture |
| Fashion interior | Atelier context and gold/silver display language |
| AI manager board | Black working panels, fine gold borders and existing AI workspace composition |
| Current Megapolis | City, identity, settings, community and system-window headers |
| Material and passport artwork | Coin/material context and product-history context |

The photo reader now orders approved references as closed entrance → open entrance → current Megapolis → Grand Museum → Fashion → Brand House → MERGE AI → Fit → materials/passport. Other approved images remain in stable order. Duplicate paths are removed without mutating the original records. The existing image zoom, 1:1 view and previous/next actions are retained.

## Removed material label

Frontend source text and material selectors were checked. No such additional precious metal was present there; the two unwanted labels were baked into `public/assets/material-library.png`.

OCR checked all 44 original PNG assets. Only that material image contained the two labels. A precise built-in imagegen edit replaced both with `SILVER`, retaining the same product-column composition. The PNG and its WebP presentation derivative were both updated. OCR on both final assets found no unwanted label and read eight SILVER labels in each.

Saved project assets:

- `/workspace/scratch/96043a39dcf6/museum-delivery/public/assets/material-library.png`
- `/workspace/scratch/96043a39dcf6/museum-delivery/public/assets/optimized/material-library.webp`

Edited PNG: 1536 × 1024; SHA-256 `10d09c6ca6ce10a80c2f6d2044423db44d7f8bbd25daabe6ba832190862780e7`.

Image method: built-in imagegen, `text-localization` edit of the existing asset. Final prompt: replace the two large labels under the third filament spool and yarn bundle with the exact word `SILVER`; preserve all other text, products, layout, lighting, borders, logos and emblems. No new composition or logo design. The exact submitted prompt is recorded with the image-generation result in the conversation. The initial generated output was copied from `generated_images/exec-b953de47-0583-4d14-a0f4-772fa9e25b3b.png`; the original output remains present.

## Main changed files

- New: `lib/luxury-windows.ts`, `components/merge-window-chrome.tsx`, `app/luxury-windows.css`, `tests/luxury-windows.mjs`.
- Shared primitives: `components/ui/dialog.tsx`, `components/ui/sheet.tsx`, `components/ui/alert-dialog.tsx`.
- Existing contexts: `components/museum.tsx`, `components/megapolis.tsx`, `components/photo-megapolis.tsx`, `components/grand-atrium.tsx`.
- Ordering and styling: `lib/museum-visuals.ts`, `components/founder-visual-references.tsx`, `app/layout.tsx`.
- The two material presentation assets above.

## Validation

PASS: window-context mapping for all existing dialog call sites, all context image paths, exact official company asset, one current context per frame, six ordered context labels, stable photo ordering/de-duplication, preserved actual child-action callbacks, close/focus handler forwarding, shared sheets/alerts, English frame labels, and responsive/scroll/focus CSS boundaries.

PASS: existing House-interior tests; connected-House tests including isolated SQLite private-brief API/store tests; exact gate tests; photo Megapolis tests; original image-detail tests for all 18 exhibits; personal Fit tests; personal MERGE AI tests; Coin material/commission, sky Coin, Coin/Museum, registration/funding and material-preference tests. TypeScript and diff validation passed. The final build is run by the Sites packaging helper.

NOT RUN: browser/GPU/mobile visual and real Radix focus E2E. The managed environment has no `control-browser` capability. The Sites instruction says, "If `$control-browser` is unavailable, skip browser QA". Source: `/root/.codex/plugins/cache/openai-curated-remote/sites/1.0.2-remix-a.1/skills/sites/SKILL.md`. No unsupported browser workaround or screenshot substitute was used.

## Preserved boundaries

No database changes or migrations. No edits to financial formulas, allocations, price sources, snapshots, official order-registration policy, payment/commission state, identity, CORE authorization or provider secrets. Existing gates, approved city, House interiors, saved private drafts and official logo source remain unchanged. The new look does not activate unavailable CORE/Meshy/payment integrations. The audience remains owner-private; this is not a public mergestars.com release.
