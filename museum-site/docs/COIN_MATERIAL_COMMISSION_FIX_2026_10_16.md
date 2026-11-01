# Live Coin material, order and commission clarification · 16 October 2026

## Corrected experience

The sky Coins and expanded market view now identify the LIVE value of 1 kg of the selected metal as a commercial **price basis**. That label does not describe the mass or composition of the delivered product. The authoritative CORE metal number is still displayed unchanged; no second payable-price engine, multiplier or synthetic quote has been added.

Material composition is visible immediately when opening a Coin, rather than hidden in a disclosure. The Founder formulation is a nominal 1:2 metal-input-to-selected-polymer-base mass ratio: 33⅓% and 66⅔%. A 1 kg formulation example is approximately 333.33 g metal input and 666.67 g base, not an item weight. Gold is labelled nominal 8K; silver is described by its mass fraction and fineness rather than assigned a gold karat assay. Declared Au/Ag 999.9 input purity, composite fraction and certified fine-metal content are separate. Actual recipe, fillers, material compatibility, measured weight and batch passport remain CORE Material Lab responsibilities. No unavailable certification is represented as verified.

Both Coins still open twelve Brand Lines. Gold remains up to twelve products with the combined finished gold-composite mass of items AND case limited to 1,000 g. Silver remains one physical item and approved case; no Gold mass limit is applied to Silver.

The order-law specification now records the latest Founder requirement: each successfully generated item must be registered as an unpaid authoritative CORE order within the user's authorized generation action. A second order-confirmation action after generation is not required. A private brief is not a generated item. Missing generation/order integration stays pending; the Museum never invents a CORE Order ID, paid sale or commission.

## Commission illustration

The new read-only, normalized calculator targets the value of one Coin. It assumes zero starting available commission, equally priced customer payments, and the existing separate platform fee of 2% **added to** the product base. In the default illustration, the customer total includes that fee and 18% VAT on both product and service:

`base = customer_total / 1.18 / 1.02`

`full_brand_share = base * 0.33`

`orders_needed = ceil(target_coin_value / full_brand_share)`

If each customer total equals the target Coin value, one full 33% share is approximately 0.27417747 Coin-price units; three equal eligible sales yield about 0.82253240 and four about 1.09670987. The answer is four fully paid sales whose commission becomes AVAILABLE, under these assumptions. It is not a promise that any four orders of any value fund a Coin.

For different Source and Destination Houses, the existing 16.5% + 16.5% division is preserved. An individual 16.5% recipient needs eight equally priced sales under the same illustration. One owner does not receive both shares unless attribution entitles them to the combined share. The calculator offers both cases and a different order-value input. VAT assumptions are explicit. It removes the included separate fee by dividing by 1.02, avoiding a second deduction from the base or a technical commission transfer.

The Georgia Revenue Service VAT information page confirms the general 18% rate: https://voice.rs.ge/Default.aspx?id=4331 . Actual transaction tax treatment, fee taxation, rounding, reserve, refunds, withholding, payout eligibility, target Coin offer and snapshot require CORE confirmation. This view cannot determine a customer's tax liability or available balance.

Doubling is isolated arithmetic: new orders 1 → 2 → 4, cumulative orders 1 → 3 → 7. It creates no records or earnings. Generated unpaid orders, visits, likes and registration events do not fund a Coin.

## Preservation and storage

The existing doors, approved city and museum assets, official logo, House interiors, vitrines, camera/navigation behavior and saved private briefs are preserved. No database changes, migrations, provider keys, payment integrations, ledger entries, historical settlement modifications, identity duplication or public audience changes.

New files: `lib/coin-material.ts`, `components/coin-material-summary.tsx`, `lib/commission-coin-scenario.ts`, `components/commission-coin-scenario.tsx`, `tests/coin-composition-commission.mjs`.

Affected existing files: sky Coin/pulse views; shared package preview and allocation panel; entry/funding/item rules; design brief and studio; AI workspace/order-law specification; commercial readiness/journey copy; scoped Coin styles and related tests. The change to `components/museum.tsx` is only the order-law text; House and entrance logic is untouched.

## Validation

PASS: new composition/commission test — known 4 / 8 order cases; varied order values, zero/invalid/out-of-range inputs; reconciliation of gross, VAT, separate fee and base; actual input/selection callbacks; English material labels and pending certification; no financial/API/storage side effects; unpaid CORE generation-order specification.

PASS: existing Coin sky tests, Coin/Museum policy and API-boundary tests, registration/funding tests, personal MERGE AI tests, connected-House tests (including isolated SQLite private-brief API/store behavior), all twelve House-interior tests, exact entrance gate tests and approved-photo Megapolis tests. TypeScript and diff validation passed before packaging. Final build is run by the Sites packaging helper.

Browser/GPU/mobile visual E2E is NOT RUN. The Sites skill explicitly says, "If `$control-browser` is unavailable, skip browser QA"; that capability is unavailable in this managed environment. Source: `/root/.codex/plugins/cache/openai-curated-remote/sites/1.0.2-remix-a.1/skills/sites/SKILL.md`.

## Remaining integration blockers

Real Meshy generation and authoritative CORE generation/order write contracts; verified payable Coin offer with price snapshot, pricing rule and tax treatment; actual entitlement/cohort, Brand House attribution and commission ledger; available-balance settlement endpoints and payment evidence. These screens do not activate any of them. Their unavailable state remains explicit.

This update is for the existing owner-private ChatGPT Site. It is not a deployment to the public mergestars.com backend or a completed financial/production integration.
