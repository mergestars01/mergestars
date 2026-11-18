# MERGE V8.3 — Existing Member Preservation Contract

**Status:** design and source-level audit, NOT a completed migration. No production DB was accessed.

## Canonical identity
The existing PostgreSQL `users.id` UUID is the only canonical subject. Keep `merge_id`, `founder_id`, `brand_line_id`, `email`, `password_hash`, `roles`, `kyc_status`, `created_at`, and all foreign keys untouched. Do not import a museum identity as a new CORE user.

## Verified from source
- `backend/src/database/entities/user.entity.ts` defines `users` and its identifiers, with existing `orders` and `applications` relations.
- `backend/src/modules/auth/auth.service.ts` authenticates CORE members and signs access tokens with `sub: user.id`. It also includes a legacy PHP bcrypt compatibility normalization.
- `museum-site/app/chatgpt-auth.ts` reads `oai-authenticated-user-id` and email from headers. These are ChatGPT-hosted Site-specific and MUST NOT be accepted as production identity on mergestars.com.
- `museum-site/lib/core-client.ts` already contains a CORE `/users/me` bearer-validated read path. Extend this pattern with server-side sessions and scoped authorization.

## Required integration behavior
1. Existing members log in with their **existing CORE credentials**. Never force re-registration or password resets unless an account-specific security incident warrants it.
2. Server validates a CORE access token or secure CORE-owned session; derive the canonical user UUID from validated CORE response, never from an untrusted browser header or email match.
3. Museum drafts and House records must be scoped to this UUID. When importing old Site data, use a separately approved explicit account-linking ceremony; never silently merge two identities with matching emails.
4. Existing `users`, `orders`, `coin_applications`, `referrals`, `refresh_tokens`, `kyc_documents`, and catalog records remain intact. New features use additive migrations with foreign keys to existing users.
5. No data copying until backups are verified and a dry-run import on staging passes reconciliation.

## Required migration checks (staging, read-only baseline)
Record counts, duplicate IDs and orphaned foreign keys without exporting PII to reports. Compare before/after counts for users, orders, applications, referrals and KYC records. Validate sample member login, password compatibility, role permissions, private House isolation and full order history. Verify rollback by restoring a disposable test database.

## Acceptance criteria
- 100% existing user UUIDs preserved; zero missing users and zero new duplicate user accounts caused by migration.
- All existing MERGE IDs and account creation timestamps unchanged.
- All order/application and financial history unchanged and correctly linked.
- No user can read or write another user's private museum, designs or House.
- No unauthenticated request can spoof CORE user identity through HTTP headers.
- Login, logout, token refresh and password reset verified in staging.
- Production activation only after founder approval.

Run the repository's read-only `node checks/user-preservation-preflight.mjs` as an initial static check. It cannot prove that real database records are safe; only staging reconciliation and backups can.
