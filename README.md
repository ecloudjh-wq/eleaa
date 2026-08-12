# ELEA 4-page integrated prototype

Pages:
- `index.html` — Main
- `data-moat.html` — Data Moat
- `digital-human.html` — Digital Human
- `learning-experience.html` — Learning Experience

Common header update:
- Main page header/navigation is shared across all four pages.
- Shared header styles: `assets/css/shared-header.css`
- Shared header interactions: `assets/js/shared-header.js`
- ELEA logo: Figma MCP SVG requested by user.

This pass intentionally focuses on common navigation/logo integration only. Detailed visual refinement can continue from this package.

- ELM visual motion v3: fixed top beam overflow, added base shockwaves, rising light streams, staged deck launch, core ignition/spark burst, data-column runners, faster live-data traces, and continuous ring/stack motion.

## ELM visual position adjustment
- Desktop ELM source visual moved upward by 120px (`bottom: 74px` → `194px`).
- Mobile/tablet normal-flow positioning preserved.

V7: Removed stray horizontal/circuit lines and rebuilt ELM decks as rounded glass diamonds with stronger perimeter strokes.


## Unified top navigation
- Main top navigation shared across all four pages.
- Desktop: no menu button; centered GNB always visible.
- Mobile: hamburger only; opens a compact vertical version of the desktop GNB style.
- Language UI: KOR | ENG, with KOR active and ENG disabled for the Korean-first build.
