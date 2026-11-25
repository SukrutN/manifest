# Design notes

The live page follows the visual system of pzstudio.design, rebuilt in
this repo's own stack (Next.js static export, no CSS framework) and
carrying this repo's own words and figures throughout. This note states
what was lifted and what was approximated, so a copy is never mistaken
for the original.

## Lifted verbatim from the reference's shipped CSS

- Color tokens: the near-black canvas `#0e0e0e`, white type, `#222222`
  panels, warm bone `#f4f1ec` light cards, and black-on-white pills.
- The fractal-noise veil: the reference's exact SVG feTurbulence data
  URI at 0.06 opacity on the body, and the same URI as an overlay
  blend on the dark stack cards.
- Radii: 20px on cards and panels, stepping to 15px under 768px and
  12px under 600px; 100px pills.
- Easing curves: `cubic-bezier(0.22, 1, 0.36, 1)` for fades,
  `cubic-bezier(0.34, 1.12, 0.64, 1)` for the springy panel and
  curtain moves, `cubic-bezier(0.25, 1, 0.5, 1)` for the backdrop.
- Set-piece anatomy, rebuilt with this page's own content: the
  preloader with its percentage counter and split curtain; the fixed
  header with its center claim, white pill burger, and gradient fade;
  the modal menu panel with giant uppercase links and sibling dimming;
  the giant hero wordmark over a five-word row; the scroll-scrubbed
  word-by-word introduction; sticky full-height stacking cards with
  numbered counters and a progress bar; the `#222222` rounded marquee;
  the white rounded footer card with a giant wordmark bleeding off the
  bottom; the 2px white scrollbar thumb.
- Sora in both shipped roles (Light for display, Regular for body):
  the reference's own face, which is SIL Open Font License, loaded
  through next/font like every other face this site uses.

## Approximated, and why

- The reference sizes type from a vw root scale (`html` at `1vw`).
  This page keeps a fixed root and bounds each step in `clamp()`
  instead, because the day cards carry tables of locked figures whose
  wrapping must stay predictable at every width.
- The reference's buttons carry an SVG arrow asset that inverts on
  hover. This page uses a text arrow that inherits the button color,
  so no image asset ships.
- The reference's hero entrance and word scrub run on GSAP. This page
  runs them on a small scroll-scrubbed driver (`site/src/lib/scrub.ts`)
  that writes only opacity and transform, so the static export ships
  settled, an element a flick skips past still settles, and reduced
  motion is fully static with no from-states anywhere.
- The reference's case-study grid (two-column staggered photography
  with parallax) is deliberately not reproduced: this page has no
  photography, and its dense data cards need a different grid.
- The custom cursor (a ring and a dot in difference blend) is
  reproduced as it behaves, not as it is drawn: two divs, no assets,
  pointer events off, and off entirely for touch pointers and reduced
  motion.

Nothing of the reference's words, font files, or imagery ships in
this repository.
