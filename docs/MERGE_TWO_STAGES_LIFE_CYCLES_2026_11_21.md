# MERGE STARS — 12 Life Cycles → Brand Megapolis
Date: 2026-11-21. Target: EXISTING mergestars.com and current museum-site experience layer.
Branch: feature/life-cycles-journey-2026-11-21. **NO LIVE DEPLOY, NO MAIN MERGE, NO CORE ALTERATION.**

## Stage I — free creative experience
1. Open cinematic official MERGE entrance with original, immutable artwork and two MERGE Coins (Gold/Silver). No generated substitute for approved 13-point logo.
2. Greeting by multilingual MERGE AI living coin-goldsmith. Voice, translation and generative capabilities require real provider integration; never simulate proof they are connected.
3. Register with ID card OR passport; consent and ownership are essential. 0.01 GEL bank IBAN ownership confirmation and overseas alternative, statuses separated from product payment. No purchase required to start designing.
4. Tap either Coin. Gold and Silver experience both allow free creative exploration of the 12 clock-placed life-cycle portals; commercial line entitlements await founder-approved CORE policy.
5. Clock position 1 to 12 clockwise: Fashion/Personal Luxury; Mobility/Transport; Architecture/Construction; Furniture/Interior; Home/Household; Electronics/Robotics/Industry; Stationery/Office/Education; Beauty/Perfumery; Nature/Green World; Wedding/Celebrations; Children; Art/Culture/Sacred Heritage.
6. Every portal permits choice of any matching physical item, with 12 GOLD and 12 SILVER draft slots per cycle: 144 each line, 288 total potential designs per private House; not 288 physical products, Coins or paid orders.
7. Idea → visual/sketch → 3D optional → maker and materials choice → fit/measurements with consent → lineage and private saved draft. Third-party brands need independent authorization/price/technical confirmation.
8. Central #13 is user's round Coin **MY BRAND HOUSE** and garden, **not a thirteenth industry**. House starts 0, receives the user's creations automatically via secure account mapping; then qualifies for 0→1 only after ready catalog, rights check, explicit publication consent and CORE verification.
9. Stage-1 qualification privilege discussed by founder: registration + launch-ready Brand House/catalog by **13 Jan 2027 inclusive, Tbilisi timezone** (no registration count cap); eligible deferred preliminary Coin order is real but NOT paid until actually funded. It must not authorize production before genuine payment.
10. Coin live pricing references: 1 kg Au 999.9 for GOLD, 1 kg Ag 999.9 for SILVER, from actual manufacturing-country reference (currently China). Separate reference, product physical weight, material composition, and final signed product quote.

## Stage II — verified Brand Megapolis
A completed House is published only after CORE authorization. The Megapolis lists rights-approved exhibits and authorized sale offers. An **exclusive one-of-a-kind item** may be exhibited only with consent; this does not grant reproduction or general resale rights. A buyer need not walk around Megapolis to commission a private exclusive.

Customer → design/source/version → RFQ → separate brand/rights + technical + commercial approval → server-signed Verified Offer → accept terms → real CORE order → bank/PSP confirmed payment → separate CORE production authorization → manufacturer → QC/XRF if relevant → product passport/QR → delivery → approved exhibit → qualifying sale/settlement → verified commission → direct bank payout.

**Hard rules**
- CORE NEVER GETS REGENERATED; NO SECOND IDENTITY OR FINANCIAL LEDGER.
- THE SYSTEM NEVER HOLDS VALUE — ONLY PROCESSES VALUE; no internal wallet/withdraw balance.
- No production authorization without signed accepted offer, verified bank payment, manufacturer verification and CORE authorization.
- Draft ≠ Order; Order Created ≠ Payment Confirmation; payment authorization ≠ settlement; deferred privilege ≠ paid order.
- Refund, chargeback, reserve, negative adjustment, maker errors and missing evidence must reverse/block commission and be audit logged with idempotency.
- Applicable Silver Brand Line commission base: 33%, source 16.5% and destination 16.5%. Gold policy separate, not silently copied. Existing platform fee charter separately governs; validate against current CORE, never recalculate it in UI.
- Final commission is based ONLY on qualifying paid/settled real operation, verified and paid by bank to verified IBAN, not likes or registration.
- All users, regardless of wealth, have equal commercial, legal, consent and privacy requirements.
- No live price, artificial revenue promise, live voice, bank charge, manufacturer fulfillment, transfer or production status is asserted by the frontend demonstration.

## Preview implementation and checks
- New nontransactional route: `/life-cycles`, reuses existing `companyIdentity.mark`.
- The frontend only stores drafts in local memory for THIS VIEW. It does not modify an authoritative CORE House or product, does not open an order or save private user data to browser storage.
- `museum-site/lib/life-cycle-2026.ts` provides 12 exact titles, clock geometry, capacity and conservative publication/payment/commission gates.
- Real application must use secure CORE identity, existing Museum APIs and D1/CORE bridge only with verified ownership; do not use ChatGPT-only identity in production.
- Staging release needs ownership isolation, legal permissions, real price source, manufacturer RFQ, signed offer, payment webhook idempotency, reversal, bank receipts, QC, passport, i18n, mobile performance/accessibility, browser e2e and PostgreSQL integration tests.
- Historical test counts are NOT evidence of this new route passing end-to-end.
- `main`, production data, payment processing and deployment remain unchanged until the founder reviews staging tests and explicitly approves.