# 2026-09-24 - Slide-up panels: fill the space, embossed glass

## The "Why"

Follow-up to the slide-up panel extraction earlier the same day: the cards were still reading as a compact corner widget. The ask was to make them fill most of the right side of the viewport and push the glass effect toward a more "embossed pane" look (referencing a classic glassmorphism card: strong blur, a soft diagonal light sheen, a bright edge highlight).

## Core Concepts (new since the last entry)

**`top` + `bottom` both set, no explicit height.** Previously sizing was `bottom: 56px` plus a `max-height: calc(100vh - Npx)` fallback. Setting both `top: 64px` and `bottom: 64px` on a `position: fixed` element lets the browser compute the height automatically as "whatever fits between those two edges" - it grows and shrinks with the viewport with no JS and no calc() needed. Width uses the same idea in the inline dimension: `width: min(760px, 46vw)` scales with the viewport up to a cap, rather than a single fixed `max-width`.

**Layering a gradient over a `color-mix()` background.** CSS's `background` shorthand accepts a comma-separated list of layers, painted in listed order from top to bottom: `background: linear-gradient(...), color-mix(...)` puts the gradient (a soft diagonal sheen, suggesting light catching a glass surface) on top of the translucent tint, both showing through the same `backdrop-filter: blur()`.

**Inset `box-shadow` as an edge highlight.** `inset 0 1px 0 rgba(255,255,255,.45)` and `inset 1px 0 0 rgba(255,255,255,.18)`, stacked alongside the existing outer drop-shadow in one `box-shadow` list, draw thin bright lines just inside the top and left edges - a standard trick for suggesting a lit edge on a glass/acrylic surface, and the main thing that shifted the look from "translucent box" toward "pane of glass" alongside the blur increase (20px → 36px).

## Implementation

Everything is in `client/src/index.css`'s `.slide-panel` rule and its `max-width: 700px` breakpoint (bumped up from `560px` since the panel is now wide enough to need the mobile fallback sooner). No component/JS changes - purely a sizing and visual-treatment change on top of the panel shell built earlier.
