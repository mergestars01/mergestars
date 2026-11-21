# MERGE ⭐ STARS — Global launch architecture and founder release gate
Date: 2026-11-21
Owner: MERGE STAR'S LLC, Georgia
Canonical destination: https://mergestars.com
Code: mergestars01/mergestars
Status: PLAN + DRAFT PWA CODE; NOT LIVE AUTHORIZATION

## Non-negotiable technical boundary
- Never replace or regenerate the MERGE CORE, users, orders, database, logos, history or owned designs.
- Experience layer (Museum) must use CORE as source of truth. A generated concept is NOT a verified product.
- Never hold value internally. Bank/PSP verifies financial events. Never authorize manufacture without a verified payment and applicable lawful exception/approval.
- Do not silently change commission rules, price basis or Phase-1 entitlement terms.
- Founder reviews and explicitly approves production merge, public publishing, migrations, provider spending and live financial activation.

## One application, not many separate websites
1. Existing domain and CORE: authoritative identity, catalog, House ownership, payment state, offers, audit, QC and Passport.
2. Living Museum: approved Gold/Silver COIN identity, twelve portals, central private #13 House and source/history lineage.
3. Responsive mobile web shell: PWA install on Android/iOS and desktop; uses existing identity. Never cache private CORE data offline.
4. Later native packages: Android and iOS share the same API/backend and retain approved brand assets; both stores require vendor accounts, reviews and compliance.

## AI integrations: capability-driven, not 'install every model'
Each provider is an optional adapter, never a second authoritative product or payment system.
- AI conductor / coding: ChatGPT/Codex + GitHub; code changes require CI and review, never directly auto-deploy.
- 3D generation: Meshy (or approved alternative) with QUEUED/GENERATING/READY/FAILED; preserve original product/parent lineage.
- Image generation / editing: approved API with user rights and asset provenance; no brand-logo replacement.
- Cinema / video: Runway or fal adapter, usage quotas and consent for likeness/voices. HeyGen optional for consented avatars/dubbing.
- UX/design: Figma approved master assets and mobile layouts.
- Translation: Google Cloud Translation or approved provider; preserve numbers, IDs, original text and financial strings.
- Analytics/monitoring: PostHog and/or existing Sentry; consent, privacy boundaries, no sensitive data in analytics.
- Operations: GitHub Actions checks, optional Linear/Slack notifications, Google Drive specification archive.

Use only connected/approved providers. A ChatGPT plugin connection does NOT itself deploy an API adapter into MERGE production.

## Release gate checklist: evidence required
- [ ] Canonical domain served behind HTTPS with correct routing, rollback and monitored backups.
- [ ] Existing CORE login from same origin; two REAL accounts across two devices, ownership isolation and session logout.
- [ ] Additive schema migrations proven safe in staging with rollback plan; no live database overwritten.
- [ ] Founder-approved canonical company logo and existing assets unchanged; no synthetic partner endorsements.
- [ ] Installable Android/iOS PWA; network-first offline-only page; low-memory performance and accessibility checks.
- [ ] PR #4 Museum tests PASS at actual head; PR #5 frontend/mobile checks PASS at actual head.
- [ ] Genuine live/staging catalog, original-history/consent flows and correct provider availability.
- [ ] Payments and manufacturer/QC/Passport remain CLOSED unless each separate integration has passed independently.
- [ ] Public pages SEO-reviewed; keep drafts/private rooms noindex; legal/privacy/terms/contact and KYC review.
- [ ] Founder formally signs off on deployment target, release commit, approved functionality and rollback.
- [ ] For store apps: developer accounts, Android signing, iOS certificates, app metadata, privacy disclosure, beta testing, and Apple/Google approval.

## First-day achievable target (conditional)
A safe, installable mobile WEB app using the existing public platform and existing private Museum demo journeys, if CI/device/staging validation and domain access succeed. Existing hosted financial features are not newly enabled. First-day Google Play and Apple App Store PUBLIC listings are NOT promised or represented as completed.

## Usage and spend guardrails
- No 'unlimited' provider is assumed; ChatGPT subscription != API billing, video/3D calls are usage-metered.
- Expense controls: per-provider ceiling, queues, retry limits, per-account rate limits, alarms, idempotency and admin approval for increases.
- No purchases, subscriptions, external account connections or credentials provisioned by this document.
- Provider choice made by supported capabilities, data ownership, required permissions, unit economics and contingency plans.

## Verification evidence (2026-11-21)
- PR #4 `feature/life-cycles-journey-2026-11-21`: CI and Museum workflows succeeded on head `5d04d120...`; STILL DRAFT, no staging two-user proof.
- PR #5 `feature/mobile-pwa-shell-2026-11-21`: installable PWA shell; separate mobile QA workflow; tests to be checked on latest commit.
- Deployment workflow remains `workflow_dispatch`: manual production release gate; do not bypass.
