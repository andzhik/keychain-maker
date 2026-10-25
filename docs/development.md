# Development

[All documentation](README.md)

Before changing geometry, rebuild timing, or rendering, read the
[Design Decisions & Gotchas](design-decisions.md).

## Local development

```bash
bun install
bun run dev
```

Then open the local URL printed by Vite, usually `http://localhost:5173`.

## Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the Vite dev server |
| `bun run test` | Run focused unit tests for geometry and SVG parsing |
| `bun run test:browser` | Check import failures/races, export readiness/downloads, side-by-side desktop editors, independent tracing, keychain settings, the basic/advanced view, and preview zoom in headless Chromium |
| `bun run test:slicer [Bambu Studio executable]` | Slice browser-test downloads in Bambu Studio CLI and verify color layers, outside-view orientation, blank plates, and filament counts before/after matching face colors |
| `bun run build` | Type-check and build for production |
| `bun run preview` | Preview the production build |
| `bun run render [svg] [config]` | Capture headless render snapshots |
| `bun run measure [svg] [gpu\|swiftshader]` | Measure slider-change → rendered-frame latency |
| `bun run rasterize [svg format size bg]` | Regenerate PNG/JPEG/WebP tracer fixtures in `test-images/` |

## Render snapshots

`bun run render` drives the real build pipeline in headless Chromium and writes PNG snapshots to `test-output/` for offline inspection. The default capture set includes isometric, back-isometric, top, bottom, front, and back views.

```bash
bunx playwright install chromium
bun run render
bun run render test-svg/c1.svg '{"edgeBevel":0}'
```

The render harness lives in `test-render/` and runs under Node because Playwright's browser pipe transport hangs under Bun.

Run `bun run test:browser` before `bun run test:slicer`. The latter defaults to
`C:/Program Files/Bambu Studio/bambu-studio.exe`, resolves the installed X1 Carbon
profiles, and writes G-code, logs and outside-view toolpath SVGs under
`test-output/face-slicer/`. See [two-sided artwork validation](two-sided-artwork.md)
for the cases and the installed CLI version compatibility adjustment.

## Raster test images

`test-images/` holds PNG, JPEG and WebP renders of the SVGs in `test-svg/` (same file names), for checking the image tracer against the original vector. The set covers transparent backgrounds, a solid white background, lossy JPEG/WebP noise, and sizes above and below the tracer's 512 px. `bun run rasterize` regenerates them; `bun run rasterize test-svg/logo.svg webp 512 none` renders a single file.

Not every SVG fixture is a supported vector import: `logo.svg` contains live text
and must report `TEXT_NOT_CONVERTED`; `broken logo.svg` has malformed XML and must
report `INVALID_SVG`. Browser rasterization can render text, so the raster versions
of `logo.svg` remain useful tracing fixtures. Use `c1.svg`, `coffee-badge.svg`,
`hills-badge.svg`, `name-tag.svg`, or `smile-heart.svg` for successful vector imports.

## Latency probe

`bun run measure` drives the real app in headless Chromium, moves sliders, and reports per change: debounce wait, mesh build, wait for the next frame, GPU render, and total. It also prints the dev profiler's build-phase breakdown and simulates a 1 s slider drag.

```bash
bun run measure test-svg/c1.svg gpu          # real GPU via ANGLE/D3D11
bun run measure test-svg/c1.svg swiftshader  # CPU-emulated WebGL; render times are inflated
```

Historical baseline with a 150 ms debounce (c1.svg, RTX 3070, 1100×814 canvas):
~155 ms debounce + ~435 ms build + ~13 ms render ≈ **600 ms** per change.
The current debounce is **60 ms**; run the probe for current timings. Almost all
of the historical build time was CSG subtraction (see [design decisions](design-decisions.md)).

## Tech stack

- Vue 3 with `<script setup>` and TypeScript
- Three.js for geometry, lighting, camera controls, and viewport rendering
- `three-bvh-csg` for logo cutouts in beveled bases
- `polygon-clipping` for resolving overlapping SVG shapes
- `three-3mf-exporter` for multi-color `.3mf` export
- Tailwind CSS v4
- Vite 6 and Bun

Model construction lives in `src/domain/keychainModel.ts`: it returns a detached
model and measured dimensions without Vue or a scene. `logoCutouts.ts` maps
outlines and counters to plate coordinates; shared layout remains in
`src/utils/logoFit.ts`. `src/three/sceneLifecycle.ts` owns attachment, visibility
and resource disposal. `useKeychainBuilder` connects these modules to Vue state.
The base, logo and CSG build order is unchanged.
