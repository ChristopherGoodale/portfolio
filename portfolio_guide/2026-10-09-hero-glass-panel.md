# 2026-10-09 - Frosted glass pane behind the hero text

## The "Why" (Design Decisions)

Darkening the wave peaks ([2026-10-09-dark-mode-wave-color.md](2026-10-09-dark-mode-wave-color.md)) was not enough. The blurb (`#9aa2b1`) still crossed lit cubes and lost contrast. A pane that blurs and dims whatever is behind the text fixes the cause for any wave position, so the wave colors do not need to be tuned around the text.

The pane reuses the About/Contact glass look so the site has one glass style. The shared properties moved into one rule (`.slide-panel, .hero__glass`) instead of a second copy of the values. A shared utility class was skipped: it would have meant touching `SlideUpPanel.jsx` for no gain.

## Core Concepts

* **`backdrop-filter` blurs what is behind the element**, not the element. The canvas is a separate `position: fixed` layer at `z-index: 0`, and `.hero` sits above it at `z-index: 1`, so the pane has the canvas to blur. It needs a translucent background to show it (55% of `--bg-soft`).
* **Pointer events pass through.** `.hero__inner` is `pointer-events: none` so mouse moves reach the canvas and drive the wave trail. The pane inherits that, so the trail keeps working over it. Links and buttons still opt back in.
* **Negative margin to hold alignment.** The pane adds 40px of left padding. `margin-left: -40px` cancels it so the text keeps the same left edge as before and stays aligned with the footer.

## Implementation Breakdown

* `client/src/index.css`: glass surface shared by `.slide-panel` and `.hero__glass`. `.slide-panel` keeps only layout (position, size, padding, transform). `.hero__glass` adds `width: fit-content`, padding, and the negative margin. Under 700px the padding shrinks and the margin is removed, because `.hero` has `overflow: hidden` and would clip the pane silently. The `@supports not (backdrop-filter)` fallback covers both selectors.
* `client/src/components/sections/Hero.jsx`: the text and buttons are wrapped in one `<div className="hero__glass">`. No logic changes.
