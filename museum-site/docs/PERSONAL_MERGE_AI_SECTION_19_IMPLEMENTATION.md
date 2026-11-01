# PERSONAL MERGE AI — SECTION 19 correction

Baseline: existing private Site Version 45, source `53063dfec64c94d19bba80a12a41dca437d67931`. Target production platform remains the existing mergestars.com. This change to its existing private reference experience is not deployment to mergestars.com, a public launch, or a claim of completed CORE/social/AI integration.

## Prompt scope and identity

The actual Library-backed `MERGE_UNIFIED_CORE_MASTER_PROMPT_V22_7.txt` contains 71 numbered sections. Its original section 19 is **COIN & ENTRY PRICING BOUNDARY**, not social registration. Preserve that original section and all other original bytes. The Founder’s social correction is therefore a namespaced **SOCIAL EXTENSION · SECTION 19**, appended as an authoritative social addendum. It supersedes contradictory social-registration wording only; no financial rule is replaced by a registration feature.

The uploaded 01–16 social-network extension is likewise preserved byte for byte, then receives the same detailed addendum. The exact pre-change hashes/lengths and updated hashes are recorded in `SOCIAL_SECTION_19_PRESERVATION.json`. Validation confirms all 71 / 16 original section texts remain intact. Both replacements succeeded with the original identities retained. The master used the retained version-4 guard and is now Library version 5; the uploaded social prompt is now version 1. Local identity metadata was applied successfully. These are document versions, not a change to the CORE V22.7 release name.

## Implemented in the existing experience

The existing Museum navigation, Brand Museum atelier and Megapolis account menu open one Personal MERGE AI panel. The same city/door/logo/assets and navigation remain in place. Closing the panel uses the existing dialog and does not reset the city camera or chosen exhibit.

The panel provides SELF and AI-ASSISTED preparation modes; explicit channel selection for TikTok, Instagram, Facebook, LinkedIn, YouTube, Pinterest and X; bounded brand-name/description input; a deterministic profile-text brief with a proposed handle when a valid basic Latin candidate can be formed; full-brief copy with a manual-copy fallback; and official-site links. No handle availability is inferred.

Users indicate whether an account already exists. This is explicitly user-reported, not a verified connection or email enumeration. Opening an official site does not mark an account created or connected. Existing accounts have an existing-account handoff, not a second account-creation instruction.

The brief is labelled a template assembled from user text, not an LLM reply. It is transient and clears on identity-state change/unmount. No email/password/token input, credential persistence, chat history database, social-account database or external write transport is added. Unknown/forged owner responses cannot enable account setup or claim connection. The only private read reused here is the existing `/api/core/brand-house` boundary.

Actual AI chat, automatic registration, OAuth connection, publish/schedule/analytics, media generation, authorized STOP and public social-gallery data are honestly unavailable/pending. The view supplies no fake connection count, post, statistic, account ID, permission, created account, order or commission. The existing order path remains navigable.

## CORE and data changes

Database/schema/migration changes: NONE. CORE API/client/contract changes: NONE. No core user, House, Brand Line, social connection, session, product, QR attribution, order, payment, cohort, commission or financial entitlement is created or altered. The existing latest package/allocation/LIVE-price display rules remain unchanged.

## External integration requirements

Use the actual existing CORE contracts for shared identity, House ownership and social connections before private account data can be loaded. Approved provider app configuration, callbacks, user grants/scopes, server-side secret/token storage and revocation/expiry handling are required per provider capability. Do not invent an account-registration endpoint or infer universal account-creation support from login APIs. CAPTCHA, password, email/phone confirmation and 2FA remain with the user as required by the official flow.

Relevant primary documentation checked 15 October 2026:
- TikTok Login Kit web: https://developers.tiktok.com/docs/en/login-kit-web
- TikTok scope grants: https://developers.tiktok.com/docs/en/scopes-overview
- YouTube OAuth: https://developers.google.com/youtube/v3/guides/authentication
- LinkedIn access: https://learn.microsoft.com/en-us/linkedin/shared/authentication/getting-access

These documents support user-authorized access boundaries; they are not proof of a MERGE partnership or configured integration. No definitive claim of automatic Meta account registration is made.

Before real social/AI staging: connect an approved AI service with user/House authorization and history controls; implement verified connection/creation status, minimal scopes, token lifecycle, tenant isolation, user-confirmation handoff, idempotent publication, approved scheduling and functioning STOP; map authorized public media to existing products/QR; validate revoked access and provider failures. Actual publication, paid advertising and external account creation need the appropriate user authorization at execution time.

## Verification

PASS: TypeScript `--noEmit --incremental false`; `tests/personal-merge-ai.mjs`; `tests/coin-museum.mjs`; `tests/photo-megapolis.mjs`; `tests/museum-gate.mjs`; `tests/coin-sky-prices.mjs`; `git diff --check`; one-time SHA256/prefix validation of both complete prompts; both identity-preserving prompt replacements. No unresolved failure remains in those checks. Local preparation, route/SSR/contract and byte-preservation checks are separate from real provider operations. The production build is performed by the packaging workflow; this report does not pre-assert that build or a deployment result.

NOT RUN/BLOCKED: real shared CORE social identity, actual provider signup/OAuth/publish/revoke/STOP, AI chat and history, public-media gallery integration, permissions and order-attribution E2E. Browser/mobile/GPU visual QA and the HTTP preview runner are NOT RUN. This managed environment lacks the Sites browser-control capability; the [Sites skill](skill://sites@openai-curated-remote/root/.codex/plugins/cache/openai-curated-remote/sites/1.0.2-remix-a.1/skills/sites/SKILL.md) instructs: “If `$control-browser` is unavailable, skip browser QA”. No alternate browser/preview path was used.

Before public LIVE: real CORE staging and browser/mobile E2E pass, provider approvals and permissions, AI/privacy/publication evidence, existing payment/production protections and explicit Founder release approval. Current owner-only access must remain unchanged.

## Files changed

- `lib/social-brand-preparation.ts`
- `components/personal-merge-ai.tsx`
- `components/museum.tsx`
- `components/megapolis.tsx`
- `components/photo-megapolis.tsx`
- `components/coin-brand-museum.tsx`
- `app/globals.css`
- `tests/personal-merge-ai.mjs`
- `docs/V22_7_SECTION_19_PERSONAL_MERGE_AI_KA.md`
- `docs/SOCIAL_SECTION_19_PRESERVATION.json`
- `docs/PERSONAL_MERGE_AI_SECTION_19_IMPLEMENTATION.md`
- Existing Library master and uploaded social prompt: addendum-only replacements, not new CORE documents.
