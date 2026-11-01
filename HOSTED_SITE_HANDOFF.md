# Exact private Museum Site export - version 78

This is the version the owner specifically requested for the developer.

- Source URL: https://merge-living-museum-atelier.mergestars01.chatgpt.site/
- Saved Site version: 78.
- Source commit: `8a6f9c6e2a1b93c11e4443f93b5efeaf129f7e3b`.
- Export folder: `museum-site/`.
- Export date: 1 November 2026.
- The matching private deployment was confirmed succeeded before export.

## Integrity and contents

554 tracked source/assets/configuration files were exported. Every copied file
was compared by SHA-256 against the clean source checkout: zero mismatches.
The source code, asset paths, official logo, tests, lockfile, build adapters,
schema and migration files are preserved. Only the generated TypeScript build
cache was excluded. Git metadata, credentials and runtime data are not included.
No Site source was edited or republished during this export.

The repository's existing frontend/backend remain untouched. They are a separate
application: use `museum-site/`, not `frontend/`, to work on this private version.

## Stack and local setup

This is a Vinext/Next-compatible React app targeting Cloudflare Workers with D1.
It is NOT a plain static HTML bundle or an ordinary NestJS application.
`museum-site/package.json` declares Node >=22.13 and pnpm 11.25.0.

```sh
git clone https://github.com/mergestars01/mergestars.git
cd mergestars/museum-site
# Install the exact Node/pnpm versions supported by package.json.
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run test:contracts
pnpm run build
pnpm run dev
```

Use the scripts and selected execution profile supplied in this folder. A clean
clone defaults to the portable profile; the dev wrapper defaults to port 5173.
Read package scripts for Worker preview and browser-test commands. Do not confuse
the owner's existing frontend port 5198 with this separate application.
Export verification did not rerun installation, build or all tests in a clean
Linux environment. Historical test claims in README/docs remain historical.

## Deploying outside ChatGPT Sites

Do not copy these sources over the running CORE. First stage a separate build.
The developer must preserve or replace these platform dependencies explicitly:

1. Worker request/runtime adapter and Cloudflare bindings. `.openai/hosting.json`
   identifies the original Site and its D1 binding; it is not a GitHub credential
   or a ready VPS deployment configuration.
2. D1-backed private draft/version storage and migrations. No live D1 data was
   exported. Back up and migrate any data through a separately approved process.
3. ChatGPT dispatch-owned identity (`app/chatgpt-auth.ts`, `lib/api-guards.ts`).
   A VPS cannot safely trust a client-supplied user header. Implement a verified
   CORE-owned session mapping and ownership checks; never enable mock auth in
   production or replace every user with one demo account.
4. Runtime provider configuration and existing protected CORE contracts. Secrets
   must be provisioned separately. The export does not grant bank/AI/CORE access.
5. Routing, static assets, cookies, HTTPS, same-origin write guards and API egress.

Cloudflare deployment can retain the intended Worker/D1 model after proper
configuration. A conventional VPS deployment requires a compatible runtime and
storage/auth adapters, not only nginx pointing at an HTML file. Existing root
deployment scripts build the older frontend/backend, NOT this exported Site.

## Functional boundaries

Version 78 includes the private House transformation experience and saved draft
workflows as implemented in its source. Concept transformations and financial
planning calculations are not real Meshy jobs, payable offers or bank receipts.
Actual CORE registration/activation, bank settlement, protected design saving,
Meshy generation and production E2E must be verified separately.

Do not treat the source export as completion of those integrations. Test the
entrance, all House/category paths, Coin source/error states, private ownership,
save/restore, responsive layout and full provider flow on staging before domain
cutover. This GitHub push does not deploy or change either live domain.
