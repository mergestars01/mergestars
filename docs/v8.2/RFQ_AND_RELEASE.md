# V8.2 RFQ integration and review

This change integrates selected R7.1 source into the existing NestJS CORE and Vite entry points. The migration adds four RFQ tables and Brand House visibility. It preserves account, catalog, design, historical order and historical ledger records. The checked-in logo files and Museum reference export keep their existing Git blobs.

## Review the implemented path

1. Sign in through the existing MERGE identity. Open an industry from the city directory and browse its CORE catalog. Open `/rfq/new` from an industry, an existing owned design, or My Museum.
2. Create a private draft. CORE creates a source-linked version and reuses or creates the owner's private default House. Requests with the same owner, idempotency key and payload return the same record. Existing House profiles retain their visibility. Owners can select profile visibility in the Brand House dashboard.
3. Submit explicit rights and sharing declarations. Staff can review and explicitly assign an active, identity-verified manufacturer using scoped evidence. The assigned account can propose a dated offer. Manufacturer and customer views expose only their permitted information.
4. Staff record brand rights, technical review and commercial approval separately. Commercial review applies to one exact offer. Verification and acceptance check the offer's availability, price snapshot, assignment and evidence again. Acceptance records the immutable snapshot. The endpoint reports checkout, payment and production as unavailable.
5. Browse private versions in My Museum. Standard saves from an existing catalog exhibit also initialize the default private profile in the same database transaction when needed.

The city and RFQ form read the same industry definitions in `backend/src/modules/catalog/industry-destinations.ts`. The city catalog filters use the existing public catalog API. Lite mode skips the heavy city image and exposes an industry directory and museum link. Data Saver and low device memory select Lite automatically where the browser supplies those signals. User choice can override it. Language uses an explicit saved preference, then supported browser preferences, then English. The RFQ UI supports English, Georgian, Russian and Arabic, with Arabic directionality.

## API and enforcement

All RFQ routes use the existing JWT identity. Staff routes require admin or manager permission. Manufacturer actions require current identity verification and explicit assignment to the request. Write routes require `RFQ_ENABLED=true`; the shipped default is false.

| Route | Effect |
| --- | --- |
| `GET /api/catalog/public/industries` | Public industry code, English and Georgian labels, and scoped catalog categories. |
| `POST /api/rfqs` | Private draft and design version. Send an `Idempotency-Key` of 8–100 letters, digits, underscores or hyphens. |
| `GET /api/rfqs/capabilities`, `/mine`, `/:id` | Feature and catalog metadata, owner listing, and scoped request reads. |
| `POST /api/rfqs/:id/submit`, `/:id/cancel` | Explicit consent or cancellation recorded against the request. |
| `GET /api/rfqs/staff/inbox`, `/:id/brief` | Staff workflow and consented brief. Exporting a brief performs no external transmission. |
| `POST /api/rfqs/:id/staff-action`, `/:id/manufacturer`, `/:id/approvals` | Scoped review actions, manufacturer assignment, and the three approval types. |
| `GET /api/rfqs/manufacturer/inbox`, `POST /api/rfqs/:id/offers` | Assigned requests and immutable manufacturer responses. |
| `POST /api/rfqs/:id/offers/:offerId/verify`, `/accept` | Staff verification and owner acceptance of an exact unexpired offer. |
| `POST /api/rfqs/:id/files/:kind`, `GET /api/rfqs/:id/files/:fileId` | Controlled private upload and attachment download. Contents are hashed and limited. |
| `GET /api/wallet/me` | Existing owner-scoped history. `readOnly: true` identifies the historical balance field and transaction list. |
| `POST /api/admin/wallet/credit` | Authorized requests receive HTTP 410. Historical rows are retained. |
| `POST /api/orders` | Legacy writes reject with HTTP 400 pending the CORE verified-offer handoff. Existing read routes retain historical orders. |

The metal reference formula uses one kilogram for both lines, and the historical two-kilogram Silver pricing rule remains versioned for replay. The current feed identifies itself as global spot. The manufacturing-country Ag/Au 999.9 source and contractual quote path require independent approval. Finance screens display historical recorded amounts and application statuses. The previous 2% arithmetic and manual credit controls are retired.

The Founding offset calculation checks registration, House readiness and catalog readiness against midnight after 13 January 2027, Tbilisi time. It takes no cohort rank. Qualification records and provider-confirmed use of deferred commissions still require a durable workflow tied to published terms.

## Migration and rollback

- Local verification used PostgreSQL 16.15 with a restored synthetic baseline, a fresh database for the RFQ suite, and a normal NestJS startup. Check `checks/postgres-integration.cjs` and `checks/rfq-postgres-integration.cjs` for the assertions and disposable connection settings.
- Obtain the actual environment's PostgreSQL version and migration history. Rehearse on an approved isolated staging restore, including existing identifiers, order totals and any production uploads that must survive. Verify encrypted database and upload backups and run a restore drill before production approval.
- Run `npm run migration:show` from `backend/`. After authorization run `npm run migration:run` with schema synchronization disabled. Keep `RFQ_ENABLED=false` until compatibility, privacy and provider boundaries are verified on hosted staging.
- Roll back application access by setting `RFQ_ENABLED=false`. Retain the additive tables and the Brand House privacy guards if any private House or RFQ exists. The down migration permits reversal only when those data constraints are satisfied. Reverting to the previous complete application after RFQ data exists would restore unsafe legacy paths and weaker privacy.
- Confirm hosted staging, the bank/PSP settlement contract and sandbox, payment/commission/fulfillment mappings, country eligibility, and the logo's approved source file before the relevant release. Production deployment, merging, and payment activation each require founder approval.

## Test evidence and remaining work

The baseline and its failures are recorded in [the repository audit](REPOSITORY_AUDIT.md). The branch's real PostgreSQL runs cover migration discovery from the repository root, migration retry, legacy history, role isolation, file access, concurrent draft creation, immutable quotes, and rejection of unsafe rollback. PostgreSQL HTTP tests use synthetic people, evidence and offers. The standalone Jest health test uses a test module, and the loopback smoke check uses the normal backend startup.

Repository-wide lint continues to report inherited errors in older backend and 3D Museum code. The critical `proxy-addr` advisory no longer appears after the lockfile update. Remaining dependency advisories require remediation before production review.

Separate remaining delivery work covers multi-House ownership and collaboration, real Meshy jobs, qualified Digital Twin processing, the verified offer-to-order transition, bank/PSP settlement and reconciliation, the Silver commission and separately approved Gold/fee policies, supplier authorization, product QC and QR passports, live multilingual chat, and country compliance. Those areas need independent feature and acceptance testing before release.
