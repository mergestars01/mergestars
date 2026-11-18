# MERGE AI — Integrated Assistant and Social Automation Contract (V8.5 draft)

Status: design contract only; not implemented, tested, deployed, or connected to external accounts.

## Architecture
Extend existing MERGE STARS repository and CORE. One identity system, one audit trail, one Brand House authorization model. MERGE AI is a site-embedded assistant backed by an authorized AI API, NOT a transfer of the ChatGPT conversation, account, or model instance into production.

## Agents
1. Museum guide: exhibits, products, history and approved references.
2. Brand House copilot: catalogs, descriptions, localization, authorized asset edits.
3. Creative studio: storyboard, images, 3D/video provider jobs, subtitles and dubbing, with asset lineage.
4. Social publisher: prepare, preview, schedule and publish approved media through official platform APIs where permissions permit.
5. Customer support: answer from approved catalog and order records with user-scoped permissions.
6. Operations assistant: flag verification, order, payment and QC status; cannot override CORE gates.

## Social connections
Use per-user OAuth authorization for Instagram/Facebook, TikTok, YouTube and future providers. Store access/refresh tokens encrypted server-side, never in browser storage or AI prompts. Scope each connection to one authorized user/Brand House and only the granted pages/accounts. Support disconnect/revoke, token expiry, permission failure, provider review requirements, and audit logs. Do not assume every API supports automatic publishing, direct messages, analytics or advertisements.

## Publish workflow
DRAFT -> GENERATED -> REVIEW_REQUIRED -> APPROVED -> QUEUED -> PUBLISHING -> PUBLISHED / FAILED / REVOKED.
Approval must identify platform, target account, asset version, caption, language and schedule. Require explicit authorization before initial publication; configurable standing approval can apply only to bounded future actions. Enforce rate limits, retries with idempotency, platform policy and copyright/consent checks. No password scraping, cookie automation or unauthorized posting.

## Existing-user safety
Preserve existing users, orders, IDs, history and CORE. Offer re-verification / terms acceptance without deleting accounts. The 0.01 GEL bank microtransfer is separate from product payment, requires a unique reference and verified bank receipt, and cannot authorize production. Never email a payment instruction until company beneficiary details and reconciliation are approved and tested.

## CORE boundary
AI can draft and request actions but cannot independently mark payments VERIFIED, authorize manufacturing, issue commission payouts, edit ledger history or change production data. Server-side policies and human-approved workflows enforce these gates.

## Acceptance criteria before demo
- Existing user can sign in without losing data and complete required re-verification.
- Authorized user can create or update a Brand House and prepare a social post.
- OAuth test connection succeeds with provider-supported scopes.
- Preview, explicit approval, queue, publish result and error handling work in sandbox/test accounts.
- Disconnect removes access; cross-user access is denied; audit events recorded.
- Mobile UI works; automated tests and staging smoke tests pass.
- No production deploy, live payments, bulk email or live social publishing without founder approval.
