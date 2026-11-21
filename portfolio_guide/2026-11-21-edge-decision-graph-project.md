# 2026-11-21: Edge Decision Graph project entry

## The "Why" (Design Decisions)

**Public source, served straight from the repo.** Edge Decision Graph is a single self-contained `index.html` with mock data and made-up scenarios. It holds no hostnames, credentials or private systems, so unlike System Atlas it needs no split into a private source repo and a public site repo, and no redaction step. The public repo `ChristopherGoodale/edge_decision_graph` holds the source, and GitHub Pages serves it from `main` at `christophergoodale.github.io/edge_decision_graph/`.

**The ordinary card state.** It has both a live demo and a public repo, so the card sets `link` and `repo` like most others. No component or CSS change was needed.

**Categories: `Data Specialist` and `Engineer`.** The subject is data modelling (knowledge graphs, decision lineage) and the build is a WebGL app. `Finance` is left off: credit is one of five example businesses, but the project is not a finance tool.

**Honest framing.** The description says it is a concept mockup on mock data, so nobody reads it as a production system. The credit flow was deliberately drawn so that lending decisions go to a validated underwriting model rather than an on-device or cross-business model, which matches how regulated credit decisioning works.

**Thumbnail.** It's a 1280x640 headless Chrome screenshot of the overview, the same size as the other cards. The command was `chrome --headless=new --window-size=1280,640 --use-angle=swiftshader --enable-unsafe-swiftshader --virtual-time-budget=5000 --screenshot`. The SwiftShader flags give headless Chrome a software WebGL renderer.

## Core Concepts

**Headless Chrome barely runs `requestAnimationFrame`.** In headless mode, and in a browser window that's in the background, animation frames almost stop, so a WebGL page can look frozen in screenshots. To check that the simulation actually advances, a test copy replaced `requestAnimationFrame` with a 16 ms `setTimeout`, which virtual time does drive. With that change the decision counter rose as expected.

## Implementation Breakdown

- `client/src/data/projects.js`: a new object at the top of `rawProjects` (newest first). `slugify('Edge Decision Graph')` gives `edge_decision_graph`, which matches the thumbnail.
- `client/src/assets/edge_decision_graph_snapshot.png`: the thumbnail.
