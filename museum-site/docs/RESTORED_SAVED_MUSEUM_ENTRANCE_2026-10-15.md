# Restore the existing Museum entrance — 15 October 2026

Existing project: appgprj_6ac2d9927d988191937a1887d59dfef8.
Starting source: ff7b09f0f4334cb7fa917486cb936e9c5505afce (saved Version 33).

## Evidence and scope

Inspected all 33 native saved versions and their source history. Version 21 / e915aebada1a4c26a8c7021c50aa8113583f625d introduced the actual CLOSED → opening leaves → existing Museum interaction; that original entrance component and the same assets remained through Version 29. Version 31 replaced the dual closed-door image and added another photograph/mask and layout overrides. By Version 29 the arrival destination was the Megapolis; Version 32 lengthened the transition.

Restored the saved Version 21 gate component (with an explicit MUSEUM destination attribute), original default main gate, existing 1.8-second transition, original entrance heading and entry copy. Removed only later entrance-specific overrides; original global entrance layout, gold/silver hinges and responsive rules remain. Both MERGE GATE and AURUM / ARGENTUM again enter the existing Museum overview, without selecting eyewear or another product. The existing Megabrand Polis remains accessible from the current navigation.

No images or inscriptions were generated, repainted or corrected in this restoration. The original image-embedded inscriptions are retained exactly. A separate prior lettering-correction revision could not be established from the saved source history; this report does not claim one was found.

## Preserved

- All original source images and optimized copies; the four closed/open gate images and museum-world.png were compared byte-for-byte against Version 21 and matched.
- Current official company identity assets and their exact-pixel tests.
- Current drafts, private atelier briefs, Museum navigation/exhibits, exact return positions, Megapolis/avatar functions and 12 HOUSE destinations.
- Current CORE/API code, database schema and migrations. No database change or rollback.
- Same project, same URL, Founder-only audience.

## Verification

PASS: TypeScript; actual gate component actions and parent entry function; ordinary/reduced-motion entry; repeated-click and pre-hydration guards; Museum overview/no automatic product; spatial navigation and exact camera return; unchanged original assets and CORE mutation boundary; current official logo; all 12 HOUSE callbacks; avatar/camera/quality regressions; git diff whitespace check.

An existing spatial test initially rejected Version 33's already-present experience-brief schema and the official-identity README. Updated only those invariant reference points to the exact Version 33 source; original photograph and CORE mutation references remain protected against the older baseline. The test then passed. No protected application file was changed to satisfy the test.

Production build and native private deployment are subsequent packaging/publication checks; their tool results are the release evidence. Browser/GPU/mobile visual QA was not run. No real CORE/Meshy/payment/production completion is asserted.
