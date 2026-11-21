# MERGE — one COIN, twelve portals, private Brand House

Date: 21 November 2026. Existing branch: `feature/life-cycles-journey-2026-11-21`, Draft PR #4.
The existing Museum, original company identity and CORE remain the foundation. No main merge, production release, live migration or financial activation is authorized by this work.

## Stage I: private creative journey

1. The `/life-cycles` entrance presents **one official MERGE COIN**, using the unchanged `CompanyMark` asset. Opening it reveals internal GOLD/SILVER choices.
2. Both choices lead to twelve portals, clockwise: Fashion & Luxury; Mobility & Transport; Architecture & Construction; Furniture & Interior; Home & Household; Electronics, Robotics & Industry; Stationery, Office & Education; Beauty & Perfumery; Nature & Green World; Wedding & Celebrations; Children's World; Art & Sacred Heritage. These groupings do not replace existing industry/catalog categories.
3. Central #13 is **MY BRAND HOUSE**, the user's private collection, rather than another industry. It shows saved text briefs and immutable versions. It is not automatically a public seller, verified product or authoritative CORE House.
4. **No 144/288 design capacity or twelve-per-line business limit.** Fifty records per page is a transport limit; owner-scoped keyset pagination exposes subsequent records. House counts explicitly include versions.
5. Save records the text brief, cycle, line, request ID and lineage in existing Museum D1 storage. Editing creates a new record with `parent_draft_id` and `root_draft_id`; it never overwrites the original. Retries of the same payload reuse the request ID.
6. The provider-gated studio can request twelve distinct text concepts, revise selected concepts and preserve append-only history. An explicitly consented multilingual chat request can dispatch to it once. This is a batch size, not a House capacity limit. Artifact type is `TEXT_BRIEF`; image and 3D generation are explicitly `NOT_YET_IMPLEMENTED`. Existing AI consultation remains subject to real provider, consent and budget controls. A saved brief does not establish that a model or product exists.
7. MERGE COIN WATCH, MERGE LUXURY PHONE and MERGE COMPACT SMART EYEWEAR are sample concept references, separate from saved records and public sellers. VERTU and Meta are possible manufacturers only; no confirmed partnership, approval or partner logos are claimed.

## Account and storage integration

- Reuse existing CORE login. This route does not collect passports, bank details, another password or create another identity database.
- `POST /api/life-cycle-session` validates the existing Bearer token through CORE's fixed `/api/users/me` read. It may reuse the existing frontend auth store **only on the same origin**. The cookie is HttpOnly, Secure on HTTPS, SameSite=Strict and restricted to `/api/`, with a maximum fifteen-minute lifetime. No token is returned in JSON or newly stored by Museum JavaScript.
- Every draft request validates the token again with CORE. Ownership is derived server-side as `core:<CORE UUID>`. Client owner IDs and ChatGPT headers cannot authorize these endpoints. An observed account switch clears private state; late requests cannot repopulate the previous owner's collection.
- D1 saves the immutable version and event atomically. The owner/request uniqueness constraint supplies idempotency; conflicting payload reuse is rejected. Lists, cursors and parents are owner scoped.
- `0005_life_cycle_versions.sql` is additive. Historical ChatGPT-owned drafts retain their original owners. Do not reassign them through guessed emails or matching IDs; an explicitly verified ownership migration is separate work.
- Recovery on a second device requires a genuine CORE session there and the **same configured D1 database**. An unrelated preview origin cannot read production browser storage. Show login/unavailable when the session bridge is absent.
- Isolated staging needs its own D1 binding, migrations and a supported existing CORE session path. This repair has not applied migrations to hosted databases or established a public staging URL.

## Stage II: CORE-authorized public commerce

Private draft, verified product, public House, sale permission and reproduction permission are distinct states. Display consent alone grants neither sale nor reproduction rights. An unapproved House must not appear as an actual Megapolis seller.

The public catalogue remains an existing CORE read. The frontend does not grant publication, approval, price locks, payment confirmation, commission or production permission.

Commercial progression remains: source/version and rights review → technical/manufacturer review → signed time-limited Verified Offer → explicit acceptance → real order → verified bank/PSP payment → separate CORE production authorization → manufacturing and appropriate QC/XRF → passport/QR and delivery → authorized exhibition → qualifying settled sale → verified bank payout.

- Draft ≠ order; created order ≠ confirmed payment; authorization ≠ settlement; deferred privilege ≠ paid order.
- Existing policy rates, entitlements and accounting rules are unchanged. GOLD rules must not be inferred from SILVER. No frontend commission calculation is introduced.
- Refunds, chargebacks, reversals and audit remain CORE responsibilities. Public legacy payment endpoints remain closed without a verified fulfillment offer.
- Founder-discussed qualification dates, deferred-order privileges and bank identity verification must be validated against current CORE; this route does not activate them.

## Review target and evidence

25 November 2026 is the **target for a reviewable private journey**, not enabled financial/manufacturing operations. Acceptance requires save → leave → genuine account login → recover → new version, demonstrated in isolated staging with two authorized accounts and a second browser/device.

Local route/store tests use actual SQL and controlled CORE responses. Desktop/mobile tests use explicitly offline API fixtures. These do not prove hosted CORE authentication, live generation or manufacturing integration. See `MERGE_PR4_VERIFICATION_2026_11_21.md` for checks and limits.
