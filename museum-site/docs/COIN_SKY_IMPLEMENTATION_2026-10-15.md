# Gold / Silver LIVE Coin displays

Baseline: existing Founder-only Site, saved Version 40; source d99d4e34ede9ee7717d84180cab9610eb6fb4c4f.

## Implemented

- Two native, English Coin display controls in the existing photographic Megapolis: GOLD upper left; SILVER upper right. Canonical CompanyMark is reused unchanged. Their centre has a distinct COIN LIVE PRICE field and a separate metal LIVE reference.
- English labels: 1 kg / Au or Ag 999.9; 8K COMPOSITE / 333 g Au or Ag per 1 kg composite. These are declared reference/composite specifications, not certification of a particular physical Coin's weight or batch purity.
- Both controls and their English details consume one existing `/api/core/prices` read in the parent. No new CORE endpoint or external price vendor was introduced. The existing hook has opt-in 60-second polling, hidden-tab suspension, visibility refresh, cancellation and cleanup. Existing consumers retain on-demand reads by default.
- Source values are validated and displayed unchanged; missing metal, invalid payload, refresh and failure show an unavailable/loading state. No stored or synthetic price substitutes for a failed read. The final Coin amount remains CORE PRICE PENDING because the existing public metal contract supplies no Coin calculation, pricing-policy revision, quote snapshot expiry or commercial offer.
- Both controls remain visible in the mobile viewport while the photographic world can pan separately. Clicking opens existing-project details with manual refresh and the existing Gold/Silver rules action. No product or commercial operation is triggered.
- Full reusable English directive: `COIN_SKY_LIVE_PRICE_PROMPT.md`.

## Real source check

On 15 October 2026, the existing `https://mergestars.com/api/metals/live` endpoint returned HTTP 200 with JSON containing gold, silver and palladium and a versioned response timestamp. It supplies no original quote timestamp or expiry. A successful source read does not establish a verified sale price. The locked existing CORE client is checked separately; no alternative provider or calculation is substituted.

## Verification

PASS: TypeScript, `coin-sky-prices`, `photo-megapolis`, `museum-gate`, `personal-fit`, `core-read-contract`, `coin-museum`, and whitespace/diff validation. New checks cover unmodified rates, gold/silver isolation, invalid/forged payloads, no stale display after failure, declared English labels, exact logo source, House-anchor clearance, disabled entry controls, timer visibility behaviour and request cancellation.

Production build/package is required by the supported publishing workflow. Browser/GPU/mobile visual QA and final Coin-price CORE end-to-end testing are NOT RUN. No browser screenshot or commercial completion is claimed.

## Preserved

Exact gate assets, current city image and its photo animation, official identity, 12 Houses, existing navigation, saved drafts, API handlers, CORE contracts, Gold/Silver policies, authentication, payment/commission logic, database schema/migrations and Founder-only audience. No public deployment to mergestars.com.
