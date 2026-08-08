# Dev Cosmo 0.4.0 design QA

## Visual truth and scope

- Source: `/Users/jcfrane/Downloads/Bopli Dev Cosmo.zip`, rendered from the supplied `Landing Page.dc.html`, `Blogs.dc.html`, `Post.dc.html`, and `About.dc.html` handoff files.
- Implementation: `http://jcfrane.localhost:28080/`, using the live Bopli `ThemeHost` and Dev Cosmo watch build.
- Templates checked: `home`, `blog`, `post`, and `about`.
- Source state: light mode, 1440 × 1000 CSS viewport, DPR 2.
- Implementation state: light mode unless named otherwise, 1440 × 1000 CSS viewport, DPR 1. The browser screenshot surface omits a 15 px scrollbar gutter in captures with a visible scrollbar, so the comparison normalizes both images before judging layout.

## Evidence

- Combined source/implementation Home comparison: `design-qa/home-top-comparison.png` (source left, implementation right).
- Home full-view coverage: `design-qa/implementation-home-top.png` and `design-qa/implementation-home-lower.png`. Two viewport captures are used because the browser's full-page capture did not consistently paint the dynamically mounted theme; together they cover the complete page from navigation through footer.
- Dark mode: `design-qa/implementation-home-dark.png`.
- Blog search/filter state: `design-qa/implementation-blog-top.png`.
- Post and CMS-rich-text rendering: `design-qa/implementation-post-top.png`.
- Live About page and generated author portrait: `design-qa/implementation-about-top.png`.

The implementation matches the handoff's Ubuntu/Ubuntu Mono typography, 1080 px navigation/hero grid, 880 px archive measure, aubergine terminal surfaces, Ubuntu-orange punctuation, one-pixel borders, radii, filesystem tree hierarchy, article measure, and light/dark token behavior. The live CMS headline, excerpt, categories, dates, read times, filenames, and feature art deliberately differ from the placeholder source content. The shorter live hero is a direct result of the shorter projected excerpt; spacing and component dimensions remain source-faithful.

## Interaction and accessibility checks

- The theme switch changed the document state and accessible label from `--theme=light` / “Switch to dark theme” to `--theme=dark` / “Switch to light theme,” then returned cleanly to light mode.
- Filesystem directory buttons expose expanded state, collapse their child rows, and reopen without losing the remaining groups.
- Blog search reduced the live archive to `1 file, 1 directory` for `editor`.
- The `tooling` tag filter reduced the archive to `1 file, 1 directory` and toggled off again.
- Internal Home, Blogs, article, and About navigation rendered through the Bopli adapter. The current local tenant was given its missing `/about` page without resetting its existing content.
- The Post template exposes a labelled reading-progress bar, semantic article structure, a labelled adjacent-post navigation region, figure captions, image alt text, and the author-card About link.
- Navigation, buttons, search, headings, main/article/footer landmarks, images, and stateful controls were present in the browser accessibility snapshot. No unexpected console error was present during the verified Home, Blog, Post, or About states.

## Comparison history

| Severity | Finding | Resolution | Final state |
| --- | --- | --- | --- |
| P1 | The production Vue ESM emitted by the currently published CLI reads `process.env.NODE_ENV`, which is absent when a remote browser module is imported directly. | `ThemeHost` now supplies a frozen, production-only compatibility value before importing the verified theme module. Theme source remains unable to access environment data. App type-check, lint, and production build pass. | Resolved |
| P1 | The handoff adds an About route, while an already-provisioned local tenant only had Home and Blog. | Fresh provisioning now creates published `/about`; focused tests cover it. The existing `jcfrane` local tenant was backfilled idempotently without resetting content. | Resolved |
| P2 | Full-page browser capture painted an empty dynamic mount even though normal viewport screenshots and the accessibility tree were complete. | Captured top and lower viewport evidence and verified the entire live flow instead of treating the capture artifact as an implementation defect. | Resolved |
| P2 | Source placeholder copy made the Home hero taller than the real CMS projection. | Accepted the content-driven height while preserving the source grid, padding, image slot, typography, and responsive rules. | Accepted product constraint |

## Final result

passed
