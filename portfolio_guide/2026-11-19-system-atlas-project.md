# 2026-11-19: System Atlas project entry

## The "Why" (Design Decisions)

**Public demo, private source.** System Atlas reads the warehouse, the trading lab and the alerting repos, which are private. The user wanted the demo to be clickable and the code kept private, available on request. So the built site alone is published:
- A separate public repo, `ChristopherGoodale/system_atlas`, holds only the built site: minified JS, CSS and a redacted `snapshot.json`.
- It is served on GitHub Pages at `christophergoodale.github.io/system_atlas/`.
- The source repo never leaves the tower.

The card therefore has a `link` and `repo: null`. The portfolio repo gets no build files.

**A new card state, not a new data field.** Cards had three states:
- a link to a demo
- a link to the repo only
- no link (a private repo: "Repo available on request")

This card is a fourth: a live link with no public repo. It is detected from the existing fields (`link && !repo`) and adds a muted "Source code available on request" line under "View live demo →". No other card matches, so none of them change.

**Categories: `Data Specialist` and `Engineer`.** It is a picture of data flows and lineage, built as a generator plus a WebGL app. `Finance` is left off: the warehouse and trading lab appear in it, but it isn't a finance project.

**Thumbnail.** It's a 1280x640 headless Chrome screenshot of the map view, the same size as the warehouse card. The command was `chrome --headless=new --window-size=1280,640 --screenshot`.

## Core Concepts

**Deriving UI state from data you already have.** A `sourceNote` boolean in the data would be redundant: `link` and `repo` already say whether the demo is public and the code is not. Deriving it keeps a single source of truth, so it can't drift.

## Implementation Breakdown

- `client/src/data/projects.js`: a new object at the top of `rawProjects` (newest first). `slugify('System Atlas')` gives `system_atlas`, which matches the thumbnail.
- `client/src/assets/system_atlas_snapshot.png`: the thumbnail.
- `client/src/components/project/ProjectCard.jsx`: `sourceNote` is set when `link && !repo`, and rendered under the call to action inside the measured expand layer, so `--expand-h` includes it.
- `client/src/index.css`: `.project-card__source`, a small line in `--text-dim`.
