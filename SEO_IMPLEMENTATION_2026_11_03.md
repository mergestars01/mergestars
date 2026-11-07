# V1.5 section 29 - implementation checkpoint

Scope: existing official Vite frontend and nginx template, not the owner-private
ChatGPT Museum. CORE data/schema, images and the private Site noindex remain intact.

## Production audit observed on 3 November 2026

robots.txt: HTTP 200, text/plain, sitemap pointer present.
sitemap.xml: HTTP 200, text/xml, fourteen URLs including /login.
The existing sitemap is not missing, but login should be excluded. No Search
Console or production server account was accessed. No live configuration changed.

## Local implementation

- Thirteen static public informational routes have initial HTML with semantic
  text and real links before JavaScript/WebGL loads. The same approved overview
  is visible to all users after React loads; no user-agent-specific content.
- Unique titles/descriptions, canonical HTTPS apex URLs, sharing metadata and
  Organization/WebPage JSON-LD. No invented prices, offers, ratings or partners.
- Build generates robots.txt and sitemap.xml from a conservative static allowlist.
  No fabricated lastmod values or unimplemented hreflang translations.
- Non-allowlisted routes use a noindex app shell in the nginx template and
  noindex client metadata. API responses have X-Robots-Tag in that template.
- nginx checks generated .html pages without redirecting to directory paths;
  www redirects to HTTPS apex. These template changes need staging/nginx validation.
- Public content is English-only at this checkpoint. No new language routes or
  translations are falsely declared. Existing application languages are retained.

This is a static editorial foundation, not a new CORE or a public product registry.
Dynamic catalog indexing is deliberately excluded until the real CORE contracts
expose explicit publication, visibility, rights and revocation evidence.

## Verification

PASS: TypeScript and production build (rerun after final changes).
PASS: fourteen local foundation checks in frontend/scripts/seo-foundation.test.mjs.
PASS: repeated generation uses a clean app-shell template, not previously rendered
root-page content. These checks are NOT the fourteen full AT-SEO acceptance tests.
NOT RUN: browser/mobile, nginx -t, live new-route headers/status, Rich Results Test.

## Required acceptance status

| Criterion | Status | Remaining work |
| --- | --- | --- |
| AT-SEO-01 | PARTIAL | Validate domain redirects and true 404/410 on staging; unknown SPA routes still return shell 200. |
| AT-SEO-02 | PARTIAL | Local generated files checked; production uses old files until approved deployment. |
| AT-SEO-03 | PARTIAL | Static informational routes covered; entity pages and localization pending. |
| AT-SEO-04 | PARTIAL | General museum text works without JS; individual CORE product projections pending. |
| AT-SEO-05 | BLOCKED | Requires authoritative CORE visibility/rights contracts and integration tests. |
| AT-SEO-06 | BLOCKED | Requires verified public entity projection, not ACTIVE or image presence alone. |
| AT-SEO-07 | PARTIAL | No partner claims added; dynamic entity attribution tests pending. |
| AT-SEO-08 | BLOCKED | Real localized URL/content and reciprocal hreflang rollout pending. |
| AT-SEO-09 | PARTIAL | JSON syntax checked locally; external Rich Results/Inspection not run. |
| AT-SEO-10 | PASS (STATIC ONLY) | No Offer generated; real commerce schema remains unimplemented. |
| AT-SEO-11 | PARTIAL | Static rebuild refreshes pages; CORE publication/revocation events pending. |
| AT-SEO-12 | PARTIAL | No private records exported; deployed auth/noindex and leakage E2E pending. |
| AT-SEO-13 | BLOCKED | Owner Search Console verification/access and measurements needed. |
| AT-SEO-14 | NOT RUN | Field p75/Android/iPhone/browser measurements needed. |

## Deployment and rollback

Not deployed and not pushed to GitHub by this task. Do not deploy only the new
frontend without its matching nginx app-shell routing. Stage both together,
validate every allowlisted URL and private response, then obtain owner approval.
Retain previous dist and nginx configuration; rollback both as a pair.
Do not claim SEO completion, ranking, indexing or full V1.5 acceptance from this
checkpoint. robots/noindex do not replace authorization or ownership isolation.

Official references consulted:
- https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
