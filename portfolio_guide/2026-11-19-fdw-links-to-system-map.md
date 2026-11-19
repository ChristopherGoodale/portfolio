# 2026-11-19: The Financial Data Warehouse card opens its 3D explanation

## The "Why" (Design Decisions)

**The map explains the warehouse; it isn't a separate project.** The System Atlas visualization was added as its own card earlier today. The user decided it reads better as the explanation of what they built than as a portfolio piece. So:
- The **Financial Data Warehouse** card now links to it at `christophergoodale.github.io/system_atlas/`.
- The separate System Atlas card and its thumbnail are removed.

Before this, the warehouse card was a non-clickable `div` ("Repo available on request"), because the repo is private. Now it has somewhere useful to go, and the code is still private.

**The page presents itself as the warehouse.** The visualization's header reads "Financial Data Warehouse", and it opens on the 3D building view. "System Atlas" is the name of the tool that generates it, and appears only in its About panel and its URL.

**A named call to action.** "View live demo →" undersells it: the page explains a system rather than demoing an app. Cards can now set an optional `cta`, which the warehouse card uses for "Explore how it's built →".

**The source note still applies.** The card has a `link` and no `repo`. That is the "public page, private code" state added earlier, so it shows "Source code available on request" under the call to action.

## Core Concepts

**Optional overrides with `??`.** `project.cta ?? (derived label)` uses the project's own text when it has one and falls back to the rule otherwise. Nullish coalescing only falls back on `null` or `undefined`. It never falls back on an empty string, unlike `||`.

## Implementation Breakdown

- `client/src/data/projects.js`:
  - The System Atlas entry is removed.
  - The warehouse entry gets `link`, `cta` and one more sentence in its description, pointing to the 3D map.
  - It keeps its existing thumbnail.
- `client/src/components/project/ProjectCard.jsx`: `cta` reads `project.cta` first. Other cards don't change.
- `client/src/assets/system_atlas_snapshot.png`: deleted.
- `portfolio_guide/2026-11-19-system-atlas-project.md`: kept as history. This note supersedes it.
