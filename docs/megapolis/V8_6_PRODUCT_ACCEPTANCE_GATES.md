# MERGE ⭐ STARS — V8.6 implementation acceptance gates

Status: DEVELOPMENT SPECIFICATION — not deployed or verified end-to-end.

## Founder-approved product journey
1. Registration creates or provisions one personal Brand House and MERGE AI assistant, with idempotent retries.
2. Existing account records, orders and financial evidence remain preserved; account upgrade never deletes legacy data.
3. Museum design image is retained as source and submitted for asynchronous 3D generation. Generation failures must be recoverable.
4. Interactive 3D visual review records explicit user approval; visual review is not engineering certification.
5. Approved designs may be submitted to authorized manufacturing partners; capture technical feasibility, final visual, materials, lead time and quoted price.
6. The Brand House owner must approve the partner's final offer before publishing a sellable product.
7. TikTok-like mobile-first discovery feed shows approved products, Brand House attribution, media, comments and likes, without equating engagement with sales.
8. Real orders follow CORE states; no verified payment means no production authorization.
9. MERGE AI is available in every Brand House, subject to tenant isolation, user permissions, rate limits and audit trails.
10. Social publishing requires account OAuth permissions, platform API support and a user-approved publishing policy.

## Mandatory tests before claiming the site works
- Registration creates exactly one House on retries; no cross-user data access.
- Legacy accounts and orders survive migration, backup restore and rollback.
- 0.01 GEL verification is distinct from product payment; no false paid status.
- Image-to-3D pending/success/failure and provenance are persisted.
- No public listing without partner response and owner approval.
- No production without payment verification.
- Mobile 360px and desktop UX, accessibility and localization pass.
- AI actions cannot transfer money or publish externally without delegated authorization.
- Staging deployment smoke tests and monitored rollback pass.

## Deployment boundary
Only implement and test on feature/megapolis-v83-integration. Do not modify production data, merge main, deploy to mergestars.com, send mass emails, or activate payments without explicit founder approval.
