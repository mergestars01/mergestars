# Material preference — Founder addition, 11 October 2026

Keep Master Prompt V22.7 and all existing founder locks unchanged. Add this requirement to product selection and Create My Version:

Ask every user which base filament/material they want to combine with gold, silver or both, the desired integration (blend, mosaic, surface, separate component, or Material Lab recommendation), and the item's intended use. Ask for the exact base polymer, filament name and specification when known. Carbon-fiber-filled filament is an example supplied by the founder, never a pre-approved material or compatibility claim.

An answer expresses customer intent. The authoritative CORE Material Lab must resolve the approved material/specification ID and revision, permitted composition, partner/manufacturer capability, applicable rights, measurable geometry, calculation and verification. Do not derive manufacturing permission, density, metal quantity, weight, price or a verified offer from a form selection. Preserve protected original manufacturer components and the exclusive MERGE material requirement for approved MERGE-made components.

The current experience collects the same questions in the existing concept draft flow and public CORE catalog item view. New concept drafts require these answers in the UI and store them in the existing draft config JSON. Existing drafts remain readable with no backfill, database migration or invented approval. Old transport remains compatible; this UI requirement is not a security or commercial authorization boundary.

In the public CORE item view, the answers remain temporary browser component state. CORE request submission remains unavailable until an authoritative Material Lab and version/proposal contract is connected. No new material registry, CORE record or endpoint was created. No base filament or mixing recipe is approved by this implementation. No quantities, prices or commissioning rules were changed. No deployment is authorized by this addition.

Changed: components/filament-preference.tsx, components/museum.tsx, components/core-context.tsx, lib/museum-domain.ts, lib/draft-contract.ts, app/megapolis.css, tests/material-preference.mjs and this document.

Validation PASS: TypeScript (`tsc --noEmit --incremental false`); `tests/material-preference.mjs`; existing `tests/draft-client.mjs`; production build; `git diff --check`. The build retains the existing client chunk-size warning. No failing checks remain. Browser and real CORE Material Lab end-to-end verification remain NOT RUN / BLOCKED without the relevant contracts. No LIVE publication.
