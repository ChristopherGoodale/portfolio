# 2026-10-09 - Thumbnail overlays the expanding project text

## The "Why" (Design Decisions)

Before, the thumbnail and the text were two stacked siblings: the image dissolved in place and the description grew in below it. The wanted effect is one region that changes from image to text. The thumbnail now sits on top of the text, the card grows, and the image dissolves to fully transparent so the text underneath shows through. It does not fade to a dark fill.

That last part is why `.project-card__thumb` lost its `background: var(--bg)`. A background would show as a dark layer once the canvas reached zero opacity and would cover the text.

## Core Concepts

* **One box, two layers.** `.project-card__media` holds the text (absolute, underneath) and the thumbnail (absolute, `inset: 0`, on top). Neither layer adds height, so the box height is set explicitly.
* **Resting height with container units.** `.project-card` is now `container-type: inline-size`, so `100cqw * 2 / 3` gives the old 3:2 thumbnail height (cqw is a percentage of the card's content width).
* **Open height with `max()`.** On hover the box becomes `max(3:2 height, --expand-h)`. A short description never shrinks the card, and a long one grows it. `height` transitions between the two because both resolve to plain lengths.
* **`--expand-h` is measured.** The text layer is absolute, so CSS cannot know its wrapped height. A `ResizeObserver` in `ProjectCard.jsx` writes the height to the card as a CSS variable and updates it on resize.
* **Existing canvas dissolve is reused.** `ProjectThumbnail` already resizes its canvas on a `ResizeObserver`, so the image keeps its `cover` framing as the box grows. Its opacity fade (`1 - progress`) now ends on transparent with nothing behind it.

## Implementation Breakdown

* `ProjectCard.jsx`: cards with a `snapshot` render `.project-card__media` containing the text layer then the thumbnail. Cards without one render the text block as before. Two refs (`cardRef`, `textRef`) and one effect set `--expand-h`.
* `index.css`: new `.project-card__media` rules (height, transition, hover height), absolute positioning for `.project-card__thumb` and `.project-card__expand--overlay`, and `transition: none` on the media box under `prefers-reduced-motion`.
* Risk to watch: the canvas resizes and redraws on every frame of the 250ms height transition. If it stutters, size the canvas once at the open height and let the box clip it.

## Follow-up: thumbnail sometimes did not come back after hover

Likely cause (from reading the code, not reproduced): the animation loop in `ProjectThumbnail.jsx` computed `dt = now - last` with `last = performance.now()` taken when the loop started. If the first frame timestamp was slightly earlier than that, `dt` was negative, progress went below 0, `STEPS[-1]` was `undefined`, and `drawFrame` threw after clearing the canvas. Because `rafRef` still held the already-fired frame id, the `if (rafRef.current) return` guard then blocked every later hover animation for that card, so the canvas stayed blank.

Fixes, all in the same file:
* The tick clears `rafRef.current` first, so a throw can never leave a stale id behind.
* The first tick uses `dt = 0` and later ticks use `Math.max(0, now - last)`.
* `applyProgress` clamps progress to 0 to 1 before indexing `STEPS`.

## Follow-up: tags moved above the thumbnail

The tag pills used to live in the hover-reveal text layer. They now render directly under the tagline, always visible, on every card (including the no-thumbnail Three-Statement card). The text layer holds only the description and the call-to-action link, so the measured `--expand-h` is about one tag row shorter and the open card grows slightly less. Cost: each resting card is about 40px taller.
