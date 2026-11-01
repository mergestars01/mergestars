# Living Museum — 15 October 2026

Starting source: a710ea4be1ed842a8f758c4f5edce2305baba1c4 (Sites version 32).

## Implemented

- Brand Museum design briefs for all 12 thematic HOUSE directions now support authenticated private server storage, reopening and text download. Existing source exhibits and stored design drafts are preserved.
- Separate `experience_atelier_briefs` table; additive schema-only migration. This is experience data, never a CORE Product, Brand House, generation job, verified offer or order.
- The server derives the owner from authentication, rejects unknown/forged fields, checks category/HOUSE and GOLD/SILVER material consistency, limits each account to 100 briefs and bounds request bodies. Same-origin writes required.
- Request IDs are stable for manual retries after uncertain responses. Unique account/request indexing prevents duplicates. A changed payload cannot reuse an accepted request ID.
- Reopening a brief restores the line, HOUSE, category, description and material preference. Changes save a new snapshot.
- Existing draft response validation now also compares material preferences with the submitted snapshot.
- Founder rule stated explicitly: first successful CORE save creates Brand House / Brand Line if absent; subsequent items attach to the existing brand. This rule is not falsely implemented as a local brand activation.

## Architecture gaps still requiring the primary CORE backend

Public CORE catalog, collection, price and model read interfaces exist. Protected writes remain closed. No primary CORE credentials, shared-session contract, production-write API contract or Meshy account was supplied in this task.

| Capability | Actual state / remaining dependency |
|---|---|
| Immutable CORE | No CORE writes introduced. All new storage is isolated experience data. |
| Item choice | Existing concept and public CORE selection preserved. |
| Fit to Me | Needs consent-based existing CORE Fit Profile, rights and fitting service. No body measurements collected here. |
| Create My Version | Private concept preparation/storage works. Needs CORE Product/Version IDs and source authorization for actual registration. |
| Generation queue | No job falsely enqueued. Needs authorized provider submission, job ownership, statuses, bounded concurrency and idempotent callbacks. |
| Verified offer | Needs server-generated version-bound verification, material/weight/price evidence and expiry. |
| Orders | Needs authorized acceptance and current production contract; order/payment/commission/production states remain distinct. |
| QR / Passport | Needs actual CORE IDs, lineage and verified manufacturing/QC evidence. No fake QR/passport issued. |
| Brand Line | Automatic on first successful CORE save per founder rule; cannot truthfully create primary CORE ownership in an experience database. |

## Validation

TypeScript and production build checked. API tests exercise ownership isolation, reload, idempotency, conflicts, bounded bodies, forged authority rejection and the existing protected CORE gates using synthetic local accounts only. Contract/SSR tests cover the Coin lines and immutable CONCEPT status. Browser interaction/visual QA was unavailable in this environment; no production order/payment/generation E2E claimed. Official logo assets and museum graphics were not changed.
