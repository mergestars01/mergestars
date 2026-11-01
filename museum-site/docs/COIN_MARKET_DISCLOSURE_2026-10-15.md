# LIVE metals market and transparent Coin illustration

Existing Founder-only Site; baseline Version 41, source `3e7ddf9c35eb1aee0f1411ff459a8d23e57441f0`.

## Founder clarification

The latest instruction asks for one visible combined Coin figure, with a transparent explanation of why it differs from the metal market. The read-only display illustrates P + 100% of P = 2P. The additional P is described as the Brand House fund: 100% of the base, 50% of the combined illustration. It is already included, never added again. No payout or earned commission is created.

The founder explicitly mentions silver and gold. The same indicative illustration is shown for each metal, but this does not silently activate a new Gold settlement policy. The older Gold three-part allocation conflicts with the newly requested display model; Gold sales remain blocked pending an approved reconciled CORE policy. Existing Silver 25/25/50 settlement disclosure is preserved. Updated entry/allocation copy makes these boundaries explicit.

## Implemented

- Upper sky Coins show the combined **INDICATIVE COIN TOTAL**, with the raw CORE metal reference per kg and per troy ounce beneath it, and an included-fund label.
- Clicking a Coin opens the matching gold/silver tab in the existing Site's **LIVE METALS MARKET** dialog. No second site or exchange execution is created.
- The reference-unit controls support troy ounces, kilograms and grams. Unit changes affect the reference only; the per-Coin illustration does not change.
- The breakdown shows the 1 kg commercial reference base, the equally sized Brand House fund, and the combined total. Display-cent rounding keeps the visible rows additive. Invalid, missing, zero, non-finite or excessive values remain unavailable.
- One existing CORE metal feed is shared by both Coins and the panel. Same 60-second visibility-aware refresh, abort behaviour and no cached/demo substitution. No new price vendor, API endpoint, database record, payment or financial calculation engine is introduced; the arithmetic is an explicitly non-payable presentation illustration.
- A direct external LBMA benchmark-market reference and NIST conversion reference support comparison. No third-party quotes/charts/logos are embedded or imported. LBMA is identified as an auction benchmark, not a streaming feed, confirmed partner or interchangeable CORE source.
- The verified payable offer still reads **CORE PRICE PENDING**. Quote origin time/expiry remain unknown. No price lock, metal reservation, tax inclusion, shipping inclusion, order eligibility or production authorization is inferred.
- Declared 1 kg / 999.9 reference and 8K / 333 g per kg composite are distinguished from actual contained metal and a certified product weight.

## Primary references checked

- NIST OWM, Conversion Factors for Precious Metal Sales: https://www.nist.gov/document/precious-metals-conversion-information-march2015pdf — exactly 31.1034768 g per troy ounce.
- LBMA Precious Metal Prices: https://www.lbma.org.uk/prices-and-data/lbma-precious-metal-prices — gold and silver auction benchmarks; not a streaming CORE feed. Only an outbound reference link is provided.

## Verification boundaries

The targeted Coin tests cover exact unit conversion; the founder's synthetic 2,000 + 2,000 = 4,000 illustration; additive cents; 100%-of-base versus 50%-of-total; invalid/overflow rejection; clicked-metal selection; Gold policy disclosure; pending verified amount; no stale raw/derived figures; existing identity, polling and cancellation.

TypeScript, entrance/photo navigation, entry/funding and CORE-contract regressions are checked before packaging. Native production build is required before the same owner-only Site is published. Browser/mobile visual QA and real CORE verified-offer/payment/production E2E remain NOT RUN. No changes to the real mergestars.com backend, API contracts, source imagery, doors, identity or database schema/migrations.
