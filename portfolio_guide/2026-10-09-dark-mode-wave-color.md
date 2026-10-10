# 2026-10-09 - Separate wave color for dark mode

## The "Why" (Design Decisions)

Dark-mode hero text is light (`#eef0f4`, `#9aa2b1`, and a mint `#6ee7b7` eyebrow). The wave peaks blended toward that same mint, and the scene lighting (directional intensity 4.0) brightens it further. Light text on bright mint has almost no contrast, so the hero copy was hard to read wherever a peak passed behind it.

Lightening the green would have made this worse. Contrast against light text improves only by darkening the background behind it, so the wave's peak color went darker and less saturated in dark mode.

Alternatives not taken:
* Reusing `--accent` and darkening it globally. That variable also colors text and links, which need to stay bright on the dark page.
* Lowering light intensity in dark mode only. Kept as a second step if the new color is still too bright.
* A scrim behind the hero text. Kept as a third step, since it adds a visible panel.

## Core Concepts

The wave color and the text accent are now two variables. Same pattern as the earlier theme wiring (the shader reads CSS variables, so the palette lives in CSS and not in JS), with one more variable in the set.

| Variable | Dark | Light |
| --- | --- | --- |
| `--accent` (text, links) | `#6ee7b7` | `#0f9d68` |
| `--wave-accent` (wave peaks) | `#2f7f62` | `#0f9d68` |

Light mode is unchanged: `--wave-accent` equals the old `--accent` there.

## Implementation Breakdown

* `client/src/index.css`: `--wave-accent` added to the dark `:root` block and to the `prefers-color-scheme: light` override.
* `client/src/three/utils/colors.js`: `readThemeColors()` reads `--wave-accent` for `colorHigh` instead of `--accent`. The scheme-change watcher already calls `readThemeColors()`, so the live light/dark switch picks up the new variable with no other change.
* Shader and `Stage.setColors()` are untouched. They only receive a different `colorHigh`.
