# MERGE ⭐ STARS — One-app mobile PWA release gate

This is an **additive installable web-app shell**, not a native Android/iOS store release and not an authorization to deploy. The canonical domain is `https://mergestars.com`. The existing React/Vite frontend, CORE sessions, accounts, brand identity and server data remain authoritative. The Living Museum stays in the existing repo and must be integrated onto the canonical origin before a unified public launch.

## Included

- Installable web manifest with existing brand assets (no regenerated logo).
- Standalone/safe-area mobile metadata and existing 180px Apple icon.
- A network-first service worker for **top-level navigations only**.
- The service worker caches **only one generic offline notice**, never private routes, API responses, payments, metal prices, identity, session tokens or user designs.
- Nothing is deployed and no financial feature gate is opened.

## Acceptance before any live launch

1. On HTTPS, verify `/manifest.webmanifest`, `/favicon.png`, `/museum/merge-master-logo-canonical.png`, `/sw.js`, `/offline.html` respond correctly with correct content types.
2. Android Chrome: install as an app, launch from home screen, navigate entrance → living museum → House, close/reopen, test back/forward and private account handling.
3. iOS Safari: Share → Add to Home Screen; verify icon, standalone launch, safe-area insets, scroll, keyboard and camera/file access if used.
4. Test 320px and 390px widths and a mid-range Android phone on mobile data. Audit image payloads, progressive 3D loading, memory, Lighthouse/INP and accessibility.
5. Real staging: test existing CORE authentication (two accounts, two devices), catalog, creation rights, save/history, logout, invalid session and failed API calls.
6. Offline: after an online visit, a new navigation displays only the offline notice; no cached private pages, prices, QR passports or data from the previous user.
7. Run frontend build/lint, Museum and backend CI. Confirm PR #4 staging requirements; do not infer successful integration from unit fixtures.
8. Obtain founder approval **before** merging, production deployment, payment, production authorization or public claim that an App Store / Play Store package is approved.

## Store distribution

The PWA is installable via supported browsers after deployment. A Google Play Android build (for example Trusted Web Activity) and iOS App Store build require separate packaging, developer accounts, policy review and store approval. Store publication cannot be guaranteed within one day. Do not misrepresent the browser-installable PWA as a store-listed app.

## Rollback

The release is additive. Remove the manifest link / service-worker registration to stop future installation; any already-installed worker must also be unregistered or sunset on the domain. No CORE data migration is needed.
