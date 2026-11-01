# Existing Museum door → same Megapolis

Founder clarification, 14 October 2026: embed all new work in the existing Museum entrance and Megapolis. No new Site, route, architecture, logo or CORE.

Both retained MERGE GATE and AURUM / ARGENTUM image/leaf compositions still invoke the same existing `enter()` action. That action now explicitly restores `worldMode = city` and `sceneId = coin` before opening. Previously, returning to the entrance after visiting the older interior could retain `worldMode = museum` and the old scene, so the next door entry did not reliably reach Megapolis.

The original door animation and its 1,800 ms completion remain. Reduced motion remains immediate. Initial exhibit selection is cleared by the existing overview transition, and repeated/unhydrated clicks remain blocked. Labels explicitly identify Megapolis as the destination.

The same existing Megapolis canvas receives keyboard focus on arrival when focus is on the page body and no modal is blocking. Existing form/control focus is not taken. The 12 House directions and Coin → Brand Museum atelier from the prior saved version are inside this same city. Existing interior, public CORE model viewer, street position reference, assets and drafts remain available; no image was replaced.

No auth, payment, database/schema, entitlement, generation or source-of-truth behavior is introduced. Real CORE Coin/House and Meshy generation integration remains unavailable as documented in `COIN_BRAND_MUSEUM_INTEGRATION.md`.

PASS: TypeScript (`tsc --noEmit --incremental false`), production build, `museum-gate`, `megapolis`, `coin-museum`, and `git diff --check`. `tests/museum-gate.mjs` exercises both original door controls and the actual parent entry function with local setter/timer fixtures, including re-entry from the old interior, repeated-click prevention and reduced motion. The existing Megapolis regression checks verify retained canonical assets, scene geometry, navigation and unavailable commerce boundaries. No executed check remains failing.

Browser/GPU/touch and real CORE/Meshy staging E2E remain NOT RUN / BLOCKED. The managed Sites instructions do not permit starting a preview without the unavailable browser-control skill. Existing client chunk-size warning remains. Source/logic checks do not certify actual GPU focus or visual performance.

Changed: `components/museum.tsx`, `components/museum-gate.tsx`, `components/megapolis.tsx`, `tests/museum-gate.mjs`, and this document. No assets, API routes, DB schema or hosting identity changed.

Save to the same project ID only. No LIVE deployment or audience change. Existing published URL does not automatically serve the newly saved source version.
