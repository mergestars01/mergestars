# Visual continuity correction after version 63

The V25 consolidation introduced an unrelated green application frame, a separate
brand heading and a redirect from the existing city My Museum action into an
architectural study. Those choices confused the approved Museum experience with
an optional layout tool.

Corrected:

- Restored `components/megapolis.tsx` byte-for-byte to its pre-V25 version62
  routing. The city My Museum and Create actions open the existing Brand Museum.
- Removed the additional top-bar shortcut into the study. The Grand Museum's
  original House directory stays primary; study tools are behind a collapsed,
  explicitly labeled optional section.
- The study reuses the existing compact `MergeWindowChrome`. Its independent
  company heading and tagline are removed; room palette preferences cannot
  replace the application frame.
- The active Grand Museum artwork composition suppresses its baked navigation
  and approximate central mark, then references the unchanged canonical company
  logo asset. Original reference files remain intact.
- Added repository continuity instructions so later functional work preserves
  these boundaries rather than introducing another visual system.

The canonical SVG remains SHA-256
`639f3286858cfe9aa225ef1fa7251967c31aa734ff04a8ace6bd62e31a04c785`.
The original source image remains SHA-256
`550ebda50a5b03b3827dcbf7825a39325177134369b9f7947c2bdd71f4bcd5c9`.

All 18 existing contract suites and TypeScript pass. The managed preview reports
running, but the cloud browser cannot connect (`ERR_CONNECTION_REFUSED`), so new
browser visual verification is BLOCKED. No screenshot is presented as fresh
evidence for this correction. The framework build must pass before private
deployment. Database and authoritative CORE contracts are unchanged.

The prior V25 delivery report describes version63 history. For current entry
routes and presentation, this correction supersedes its new top-bar/city Brand
Room directions. The architectural tools remain available as optional studies.
