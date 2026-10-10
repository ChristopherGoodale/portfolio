# 2026-10-09 - Axiom Automation project entry

## The "Why" (Design Decisions)

Axiom Automation is a separate repo and a separate GitHub org (`Axiom-Automation-LLC`), so the portfolio only links to it. Nothing is copied or embedded. The entry lives in the same `rawProjects` array as every other project, which means it picks up filtering, the expand-on-hover card, and the live-demo CTA with no new component code.

**Category: `Engineer` only.** It is a built and deployed site, not a finance or data-analysis artifact. Adding `Data Specialist` or `Finance` would only be true of the services the LLC sells, not of this project.

**Placed first in the array.** It is the newest item and the one tied to the business. Order in `rawProjects` is display order.

**No snapshot yet.** `data/projects.js` matches images by slug, so the title `Axiom Automation` maps to `src/assets/axiom_automation_snapshot.png`. Until that file exists, the card uses the existing no-thumbnail layout (same path the Three-Statement Financial Model already takes).

## Core Concepts

No new concepts. This reuses the slug-to-snapshot convention and the `link` versus `repo` rule already documented: when `link !== repo`, `ProjectCard` shows "View live demo", otherwise "View on GitHub".

## Implementation Breakdown

- `client/src/data/projects.js`: one new object at the top of `rawProjects` with `link` set to `https://axiom-automation-llc.github.io` and `repo` set to the GitHub repo.
- To add the thumbnail later: save a screenshot as `client/src/assets/axiom_automation_snapshot.png`. No code change is needed.
