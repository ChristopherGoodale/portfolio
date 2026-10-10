# 2026-10-09 - Projects folded into the landing page

## The "Why" (Design Decisions)

The separate `/projects` route made "See my work" a hard page change. The goal was one continuous scene: the banner moves aside and the cards take the space it leaves. Everything is driven by one piece of state, `view` (`'home' | 'projects'`), written to `data-view` on the hero. CSS transitions do the rest, so React does no animation work.

Alternatives not taken:
* FLIP (measure, then animate `transform`). The banner changes size as well as position, and scaling would distort the text. Animating real layout properties avoids that.
* A router transition between two pages. It would have kept the page split and added a library for one effect.

## Core Concepts

* **Animating layout with `flex-grow`.** `.hero__inner` is a flex column: spacer, banner, card area, spacer. In home view the spacers have `flex-grow: 1` and the card area has `0`, so the banner is centered and the cards are 0 tall. In projects view the spacers go to `0` and the card area to `1`. Because `flex-grow` interpolates, the banner glides to the top while the card area opens beneath it, with no measurement code.
* **Fold wrappers.** Eyebrow and blurb sit in a grid that goes `1fr` to `0fr` (same trick as `.project-card__expand`), so they collapse smoothly and give back their space.
* **Same element, two roles.** The role line is always the `CategoryFilter` component. In home view it is `inert` and styled as plain text. In projects view it is the live filter. "Becomes filters" is a state change, not a swap. Filter state (`pinned`, `hovered`, `active`) moved up from `Projects` into `Hero`, since the filter is in the banner and the cards it dims are below.
* **Hidden cards stay out of tab order.** The card area uses `visibility: hidden` in home view. The `visibility` transition is delayed on the way out so the fade finishes first.
* **Pointer events.** `.hero__inner` stays `pointer-events: none` so the wave trail works. The card area opts back in only in projects view.

## Implementation Breakdown

* `Hero.jsx`: `view` state, lifted filter state, the primary button is now a `<button>` that toggles the view (`See my work` / `Back`, with `aria-expanded`). The other four buttons are untouched.
* `Projects.jsx`: grid only, takes `activeCategory` as a prop.
* `App.jsx`: the `/projects` route is replaced by a catch-all `<Navigate to="/" replace />`. `ProjectsPage.jsx` and `BackLink.jsx` were deleted.
* `index.css`: `.hero__spacer`, `.hero__projects`, `.hero__fold`, and `data-view` rules for the name size, role margin and hero top padding. `.page-back` and `.projects__hint` removed. Transitions are off under `prefers-reduced-motion`.
* Not done: browser Back and a shareable URL for the projects view. State is local, so a refresh returns to the home view.
