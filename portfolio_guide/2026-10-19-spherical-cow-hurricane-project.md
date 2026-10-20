# 2026-10-19 - Spherical Cow Hurricane project entry

## The "Why" (Design Decisions)

Spherical Cow Hurricane is a separate repo deployed to Cloudflare Pages (`spherical-cow-hurricane.pages.dev`). The portfolio only links to it, using the same `rawProjects` entry shape as the Axiom Automation card.

**Categories: `Finance` and `Engineer`, not `Data Specialist`.** The core of the project is numerical methods borrowed from quant finance (Monte Carlo tracers, an OU/Vasicek gust process, a Crank-Nicolson pricer checked against Black-Scholes) plus a WebGPU rendering engine. Nothing in it cleans, analyzes, or models a real dataset, so the data filter would overclaim.

**Tags: `TypeScript`, `three.js`, `Monte Carlo`.** Two tags name the stack and one names the method, which is the link between the finance and engineering sides.

**Placed first in the array.** It is the newest project, and `rawProjects` order is display order.

**Description is written against the full phase plan.** It names the OU gusts and the Crank-Nicolson pricer, which are still stubs in phases 3 and 7 of the repo. If the card has to reflect only shipped features, cut it down to the Holland vortex, the Monte Carlo debris, and Black-Scholes.

## Core Concepts

No new concepts. This reuses the slug-to-snapshot convention and the `link !== repo` rule that shows "View live demo".

## Implementation Breakdown

- `client/src/data/projects.js`: one new object at the top of `rawProjects`.
- `client/src/assets/spherical_cow_hurricane_snapshot.png`: renamed from `spherical_cow_snapshot.png`. `slugify('Spherical Cow Hurricane')` returns `spherical_cow_hurricane`, so the old filename never matched and the card would have used the no-thumbnail layout.
