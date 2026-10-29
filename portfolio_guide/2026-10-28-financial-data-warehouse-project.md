# 2026-10-28: Financial Data Warehouse project entry

## The "Why" (Design Decisions)

**First card with no link.** `financial_data_warehouse` is a private repo, and every other card's repo is public. Linking to it would send visitors to a GitHub 404. The user chose to keep the repo private: its handoff docs name the tower host and tailnet details. So the card has `link: null` and `repo: null` and shows "Repo available on request".

**`div` instead of `a` when there is no link.** An anchor with no `href` is not keyboard focusable and reads oddly to screen readers. A `div` with `tabIndex={0}` still receives focus, so keyboard users can reveal the description overlay the same way hover does. The ↗ arrow is hidden because nothing opens.

**Categories: `Data Specialist` and `Finance`.** The project is a data warehouse of market prices with reconciliation checks. It has engineering in it (Docker, an MCP server), but the card's story is the data and its correctness, so `Engineer` is left off to keep the filter honest.

**Plain-language description.** The user asked for the purpose and tools without heavy detail. It leads with what the warehouse is for (one verified source for other projects), then gives one concrete proof (backtests match trade for trade, 23 trades), then the tool list.

## Core Concepts

**Polymorphic element via a variable tag.** `const Tag = link ? 'a' : 'div'` with JSX `<Tag ...>`: React treats a capitalized variable as the element type, so one component renders either element. Link-only props (`href`, `target`, `rel`) are spread in only when there is a link.

## Implementation Breakdown

- `client/src/data/projects.js`: new object at the top of `rawProjects` (newest first). `slugify('Financial Data Warehouse')` gives `financial_data_warehouse`, which matches the snapshot file.
- `client/src/assets/financial_data_warehouse_snapshot.png`: copied from `financial_data_warehouse/docs/img/thumbnail.png` (1280x640).
- `client/src/components/project/ProjectCard.jsx`: `Tag`, `linkProps` and `cta` handle the no-link case. Existing cards render exactly as before.
- `client/src/index.css`: `div.project-card { cursor: default; }` so the pointer does not suggest a click.
