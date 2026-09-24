# 2026-09-24 - 3D Wave-Grid Hero Background

## The "Why" (Design Decisions)

The Hero section was plain text on a solid background. The goal was the "interface lifted over tiles" look from [franky-adl/3d-wave-grid](https://github.com/franky-adl/3d-wave-grid): a full-viewport grid of tall cubes, viewed from a tilted top-down angle, rippling with mouse-driven waves, with the existing Hero copy sitting on top.

**Scope: Hero-only, not the whole page.** The canvas is fixed full-viewport, but it's only ever visible through the Hero section. `main` was given an explicit opaque `background: var(--bg)` and a `z-index` above the canvas, so About/Projects/Footer occlude it automatically once scrolled past, with zero changes to those sections. A persistent whole-page background was considered and rejected: 1,600 instances animating continuously behind content the visitor is no longer looking at is wasted GPU work for no visual benefit.

**Kept the existing Hero content unchanged.** The reference's own layout (fixed top-nav, centered bio, bottom bar with a Hong Kong clock widget) is the reference author's personal branding, not a mechanic worth porting. Only the *background* and *layering* changed; the eyebrow/name/`CategoryFilter`/blurb/CTA buttons are untouched, including all of `CategoryFilter`'s hover/pin/dim logic, which stays wired exactly as before for a later iteration where it may drive the 3D scene.

**Dependency footprint: added only `three`.** The reference also pulls in `mitt` (generic pub/sub), `lil-gui` + `stats.js` (a debug/tuning panel), and `gsap` (entrance tweening). None of those pull their weight here:
- A generic event emitter is overkill when only two things ever subscribe to a resize event (Camera, Renderer) — a plain array of callbacks does the same job in a few lines.
- A production portfolio doesn't need a runtime parameter-tuning UI; the reference's already-tuned values were hardcoded instead.
- GSAP for a one-off fade-in is a full animation library for something a CSS `@keyframes` stagger can do.

The post-processing vignette/RGB-shift pass *was* kept despite adding visual complexity, because it ships inside the `three` package itself (`three/addons/postprocessing/*`) — no extra dependency cost — and it's a meaningful chunk of what makes the effect read as "matching the demo" rather than a flatter, cheaper-looking clone.

**No singleton.** The reference's `Orchestrator` is a hard module-level singleton (`if (instance) return instance`). This app renders `<App/>` inside `<StrictMode>` (`main.jsx`), whose dev-mode double-invoke of effects (mount → unmount → mount) would otherwise resurrect a stale singleton holding disposed GPU resources. The orchestrator here is constructed fresh per mount and fully torn down in `destroy()` instead.

**Color scheme: on-brand, not copied.** The reference's wave colors are white→blue. This port reads the portfolio's own `--bg-soft`/`--accent` CSS custom properties at runtime instead, so the effect uses the site's actual mint-green accent and follows the existing `prefers-color-scheme` light/dark toggle live, rather than shipping a second, disconnected color system.

## Core Concepts

**Instanced meshes + a per-instance attribute.** A single `THREE.BoxGeometry` is drawn 1,600 times via `THREE.InstancedMesh`, with per-cube world position baked into the instance matrix *and* duplicated into a custom `aOffset` vertex attribute — the matrix positions the cube, but the shader needs the raw world XZ as a plain attribute it can read cheaply per-vertex without decomposing a matrix.

**`onBeforeCompile` shader injection.** Rather than writing a full custom `ShaderMaterial` from scratch (losing all of Phong's lighting math for free), the wave logic is spliced into `MeshPhongMaterial`'s generated shader via string replacement of `#include <common>` and `#include <begin_vertex>`/`#include <color_fragment>` markers. This is how you extend a built-in material's behavior without reimplementing lighting, and it's why the exact same displacement code is re-run on a separate `MeshDepthMaterial` set as `customDepthMaterial` — the shadow-map render pass uses a different shader entirely, so without duplicating the displacement there, shadows would be cast from the *undisplaced* geometry and visibly disagree with the waving surface.

**A DataTexture as a GPU-side ring buffer.** `MouseTrail` doesn't send each mouse move to the GPU as a uniform (there's no fixed number of "recent points" a uniform array could hold efficiently); instead it maintains a 128-slot `Float32Array`, encodes `(worldX, worldZ, age, distDelta)` per trail point into RGBA texels, and re-uploads the whole texture once a frame. The vertex shader loops over live texels and sums each point's contribution — a Gaussian ring expanding outward from the point at `waveSpeed`, faded by time and distance. This is a standard technique for feeding a bounded, frequently-changing list into a shader without a uniform array size limit.

**Orbit camera via the up-vector trick.** The camera sits at a fixed radius from the origin and always `lookAt(0,0,0)`, but `camera.up` is set to `(0, 0, -1)` instead of the default `(0, 1, 0)`. Combined with positioning the camera mostly along +Y (above the grid), this produces the tilted, looking-down-at-a-tabletop framing, rather than the camera rolling sideways the way a naive "up = Y" orbit would.

**React portal + effect-cleanup for an imperative library.** Three.js is fundamentally imperative (construct objects, mutate them, run a render loop) — the opposite of React's declarative model. `WaveGridBackground.jsx` bridges this the standard way: a `useEffect` constructs the imperative `Orchestrator` on mount and the effect's cleanup function calls its `destroy()`, so React's lifecycle fully owns the Three.js object graph's lifetime. The canvas itself is portaled to `document.body` via `createPortal`, sidestepping any layout/stacking-context surprises from wherever `<WaveGridBackground/>` happens to be declared in the JSX tree.

**CSS stacking order for "canvas behind content, occluded on scroll."** A `position: fixed` element with no explicit `z-index` still paints above normal in-flow content and isn't reliably hidden by a later sibling's implicit background. Getting the occlusion right required giving `main` its own `z-index: 1` and explicit `background: var(--bg)`, so it out-stacks the canvas (`z-index: 0`) regardless of DOM order — relying on paint order alone would have left gaps or flicker at section boundaries.

## Implementation Breakdown

`client/src/three/` — the ported scene, one module per reference file, each constructed with its dependencies passed in explicitly instead of pulled from a singleton:
- `Sizes.js` — viewport size/pixel-ratio tracking with a plain resize-callback list.
- `Camera.js` — the orbit camera; owns its own `pointermove` listener for parallax.
- `Renderer.js` — `WebGLRenderer` + `EffectComposer` (render → vignette/RGB-shift → output).
- `Stage.js` — the grid, lighting, and the `onBeforeCompile` wave shader injection; owns `MouseTrail` since it needs `mouseTrail.uniforms` at material-compile time.
- `MouseTrail.js` — the 128-point trail buffer, DataTexture upload, and the raycast-against-an-invisible-plane technique for turning pointer coordinates into world XZ.
- `effects/VignetteRGBShiftShader.js` — ported verbatim, self-contained GLSL.
- `utils/webgl.js` — a `try/catch` WebGL-context probe.
- `utils/colors.js` — reads `--bg-soft`/`--accent` via `getComputedStyle`, and a `prefers-color-scheme` change listener that re-reads them so `Stage.setColors()` can update the wave uniforms live.
- `Orchestrator.js` — wires the above together, runs the animation loop, and is the one object with a `destroy()` that fully tears everything down.

`client/src/components/three/WaveGridBackground.jsx` — the React boundary: bails out under `prefers-reduced-motion: reduce` or missing WebGL support (rendering nothing further, leaving the Hero's plain transparent background visible with no fallback styling needed), otherwise constructs/destroys an `Orchestrator` around a portaled `<canvas>`.

`client/src/components/sections/Hero.jsx` — renders `<WaveGridBackground/>` plus the existing content, now wrapped in a `.hero__inner` div.

`client/src/index.css` — `.wave-grid-canvas` (fixed, full-viewport, `z-index: 0`); `main` given `position: relative; z-index: 1; background: var(--bg)`; `.hero` broken out to full viewport width via the `width: 100vw; margin-left/right: calc(50% - 50vw)` technique (verified to cancel out correctly regardless of `main`'s constrained width, because of the project's global `box-sizing: border-box`) with a transparent background; `.hero__inner` re-applying `main`'s max-width breakpoint ladder so the text column doesn't move, set to `pointer-events: none` with `a`/`.category-filter__button` opted back into `pointer-events: auto` — the mechanism that lets pointer moves reach the canvas's raycaster everywhere except actual clickable controls. `body` also gained `overflow-x: hidden` to absorb the sub-pixel overflow the `100vw` breakout can introduce when a scrollbar is present.
