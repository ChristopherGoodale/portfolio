# 2026-10-09 - Secondary text to full contrast

## The "Why" (Design Decisions)

The blurb stayed hard to read even on the glass pane ([2026-10-09-hero-glass-panel.md](2026-10-09-hero-glass-panel.md)). The user chose to fix all grey text site-wide, not only the hero.

Every grey text rule reads `--text-dim` (14 rules in `index.css`), so the change is two variable values and no rule edits. Editing each rule would leave 14 places to keep in sync.

| Variable | Dark | Light |
| --- | --- | --- |
| `--text-dim` before | `#9aa2b1` | `#565d6b` |
| `--text-dim` after | `#ffffff` | `#000000` |

## Core Concepts

Trade-off accepted: `--text-dim` is now brighter than `--text` (`#eef0f4` dark, `#16181d` light), and "secondary" text no longer looks secondary (filters, tags, card taglines, footer). If the page looks flat, the next step is to set `--text` to pure white/black too and rebuild hierarchy with size and weight instead of color.

## Implementation Breakdown

* `client/src/index.css`: `--text-dim` changed in the dark `:root` block and in the `prefers-color-scheme: light` override. No other file changes.
