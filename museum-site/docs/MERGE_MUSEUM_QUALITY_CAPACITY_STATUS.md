# Living Museum — quality and capacity update

Date: 2026-10-09. Baseline: saved Version 19, commit `de4307df07000bd6004464e922a5149a30c3a33b`. This is an update to the existing Museum, not a replacement CORE or a new Site.

## Implemented

- Retained the entrance, canonical MERGE marks, halls, node graph, exhibit positions, collections, source assets, saved-draft implementation and existing access controls. Entry selects no product. Closing an exhibit restores its Museum pose.
- Added WebP presentation derivatives for 24 images without replacing, cropping or deleting the originals. The 26 existing PNG files remain byte-identical, including the original 18 exhibit images. The approved interior derivative is 875,426 bytes instead of 4,421,697 bytes; all derivatives total 14,820,104 bytes instead of 75,258,241 bytes. Dimensions and source hashes are recorded in `optimized-assets.json`.
- Rendered the spatial Museum only when movement, visibility, resizing or texture loading requires a frame. An idle Museum does not run a continuous GPU loop. Added deferred spatial-module loading and a recoverable load-error layer.
- Added exhibit search, searchable CORE collections, a 3D-asset filter and a 24-record visible page. Detailed model runtime and model bytes load only after an explicit inspection request.
- Added inspection of actual, approved CORE GLB assets using their real geometry, PBR materials and embedded textures. Supported models have drag/orbit, rotate, zoom, pause and reset controls. Presentation normalization is isolated from physical geometry and never used for weight, price or Fit.
- Image-only exhibits remain VIEW ONLY. A model becomes ready only after asset validation, loading and graphics-stage creation. Unsupported compressed assets, missing assets and graphics failures show real unavailable states. No AI or image-based replacement model is generated.
- Added bounded public-read request coalescing per Worker isolate: at most 16 retained projections, 12 distinct upstream reads and 2 MiB retained payloads. Catalog projections expire after 20 seconds; collection projections after 15 seconds. Expired or failed data is never substituted for CORE. Price reads can share an in-flight request but are not retained. Identity and all mutations bypass this cache.
- Preserved the Version 19 rule: 1 kg of CORE-approved physical weight corresponds to 1 MERGE Coin; item value uses approved CORE weight and live price; coverage requires confirmed available commission. Added the Founder allocation disclosure: same House 50/50, cross House 25/25/50, locked by CORE after payment confirmation. These are disclosures, not a new financial engine.

## Completed checks

- TypeScript type check and production build.
- Existing entrance, renderer, display, spatial navigation, tour, contracts, sharing, draft-client and public CORE read contract checks.
- Full local Worker API suite: authentication and CSRF boundaries, draft persistence, ownership isolation, immutable source lineage, idempotency and concurrent saves, validation, SSR/assets, and fail-closed commerce/generation gates.
- Synthetic public-read capacity checks: 200 simultaneous requests for one key share one upstream read; memory/in-flight bounds, expiry, rejected identity keys, unavailable states and non-retained prices pass. This is not a hosted 200-visitor test.
- Actual GLTFLoader geometry/PBR parsing with explicitly labelled test geometry. Checks reject external asset URLs, redirects, oversized data, cycles and unsupported required decoders. Browser texture decoding was not tested.
- Native EGL/GLES captures of the existing Museum renderer at desktop entrance and mobile fashion positions. These verify renderer output, not browser interactions or a fully hosted end-to-end flow.

## Preserved boundaries

The hosting identity, production bindings, database schema/migrations, authentication, draft store, CORE client/contract, original PNG files and original item/Coin law remain unchanged. The CORE route's mutation handler remains unchanged; only public reads gain a temporary bounded projection cache. Existing payment terms are extended with the Founder disclosure. No new authoritative product, user, payment, commission, production, QC, passport or QR database is created.

## Not verified or not available

- The existing CORE public catalog request timed out from this environment. This does not establish that the service is down. Real CORE staging authentication, Fit, saved-version creation, pricing, order/payment/production/QC/passport/QR and protected Meshy contracts have not passed here.
- Permanent installation of a selected Meshy model in a Museum hall requires the authoritative CORE exhibit-association and rights contract. It remains unavailable rather than saving a competing Museum product record. Actual generation completion and archive integration are not simulated.
- Hundreds of simultaneous visitors on the hosted service have not been load-tested. Optimizations reduce transfer, idle GPU work and duplicate public reads; they are not a hosted concurrency guarantee.
- Browser QA was skipped under the Sites skill: “If `$control-browser` is unavailable, skip browser QA”. No preview server or substitute browser-control path was started. Consequently this is not a full Version 6 staging/browser acceptance pass.

Release scope: same-project, same-URL, Founder-only interface update. Public access, payment launch and production launch are not authorized.
