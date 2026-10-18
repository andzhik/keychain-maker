# Keychain Maker

Turn a flat SVG logo into a 3D-printable, multi-color keychain directly in the browser.

[Try the live app](https://andzhik.github.io/keychain-maker/)

![Keychain Maker interface](docs/img/UI.png)

## What it makes

Keychain Maker takes a clean, filled SVG, separates its shapes by color, builds a beveled base plate with an optional keyring hole, and exports a slicer-ready `.3mf` file.

![SVG to 3D keychain to slicer preview](docs/img/logo-steps.png)

## Highlights

- Upload an SVG logo and preview it immediately in 3D
- Preserve logo colors as separate printable materials, with overlapping shapes resolved in paint order
- Choose a square or circle base plate
- Tune base thickness, bevel, corner radius, padding, logo height, and target size
- Add or remove the keyring hole
- Inspect the model with an interactive Three.js viewport
- Export a multi-color `.3mf` for modern slicers
- Remember the last SVG and settings across reloads (browser localStorage)

## Best SVG Inputs

For the cleanest geometry, use simple SVG artwork made from filled paths.

- Convert text to paths before uploading
- Avoid gradients, filters, clip paths, masks, and embedded images
- Prefer logos with clear color regions and moderate path complexity

## Tech Stack

- Vue 3 with `<script setup>` and TypeScript
- Three.js for geometry, lighting, camera controls, and viewport rendering
- `three-bvh-csg` for logo cutouts in beveled bases
- `polygon-clipping` for resolving overlapping SVG shapes
- `three-3mf-exporter` for multi-color `.3mf` export
- Tailwind CSS v4
- Vite 6 and Bun

## Local Development

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
| `bun run build` | Type-check and build for production |
| `bun run preview` | Preview the production build |
| `bun run render [svg] [config]` | Capture headless render snapshots |
| `bun run measure [svg] [gpu\|swiftshader]` | Measure slider-change → rendered-frame latency |

## Render Snapshots

`bun run render` drives the real build pipeline in headless Chromium and writes PNG snapshots to `test-output/` for offline inspection. The default capture set includes isometric, back-isometric, top, front, and back views.

```bash
bunx playwright install chromium
bun run render
bun run render test-svg/c1.svg '{"edgeBevel":0}'
```

The render harness lives in `test-render/` and runs under Node because Playwright's browser pipe transport hangs under Bun.

## Latency Probe

`bun run measure` drives the real app in headless Chromium, moves sliders, and reports per change: debounce wait, mesh build, wait for the next frame, GPU render, and total. It also prints the dev profiler's build-phase breakdown and simulates a 1 s slider drag.

```bash
bun run measure test-svg/c1.svg gpu          # real GPU via ANGLE/D3D11
bun run measure test-svg/c1.svg swiftshader  # CPU-emulated WebGL; render times are inflated
```

Baseline (c1.svg, RTX 3070, 1100×814 canvas): ~155 ms debounce + ~435 ms build + ~13 ms render ≈ **600 ms** per change. Almost all of the build is the CSG subtraction (see Gotchas).

## Design Decisions & Gotchas

Things that look wrong or slow but are deliberate. Read before "fixing" them.

- **Logo cutouts are cut with CSG, not `shape.holes`.** Putting the cutouts into the plate shape before extruding would be ~200× faster, but `ExtrudeGeometry` bevels every contour, including holes, so the logo cutouts would get beveled edges and the inlaid logo wouldn't sit flush. The plate is extruded with only the outer edge and keyring hole beveled, then the cutouts are subtracted with `three-bvh-csg` (`cutoutBasePlateHoles` in `src/utils/meshBuilder.ts`). This one step is ~95% of the rebuild time (~440 ms for c1.svg). Exception: when the bevel is ≤ 0.01 mm there is nothing to protect, so the cutouts go straight into `shape.holes` and CSG is skipped.
- **The keyring hole *is* beveled on purpose.** It's added to `shape.holes` before extruding so its inner edge gets the bevel. Only the logo cutouts go through CSG.
- **Config changes are debounced, not throttled.** `ThreeViewer.vue` waits for 150 ms with no input before rebuilding. While a slider is being dragged nothing rebuilds; the model updates after you pause. Because the build itself takes ~400 ms, rebuilding mid-drag would stall the UI.
- **Rendering is on demand.** `useThreeScene` only draws when `requestRender()` is called (or while orbit damping settles). Any code that changes the scene must call `requestRender()` or `fitCamera()`, or the change won't appear until the next mouse move.
- **`colorGroups` is compared by identity.** The viewer's watcher isn't deep, and the logo outline union is cached per array instance. A new SVG must produce a new array; changing the old one in place won't trigger a rebuild or a new outline.
- **The logo's mirror and scale are baked into the geometry.** The SVG's Y flip is a negative scale. Putting it on a group transform would export to 3MF as a mirrored node, which slicers handle inconsistently, so it's applied to the vertices instead.
- **The model is built from clamped config, not the slider values.** `constrainConfig()` clamps combinations that break the geometry (e.g. a keyring hole bigger than its ring, or padding that would eat the whole logo). The UI keeps your raw values.
- **`ThreeViewer.vue` edits force a full page reload in dev.** It owns a WebGL context that can't be hot-swapped safely; swapping it in place would leak a context on every save.
- **The build profiler only runs in dev.** `src/utils/profiler.ts` logs a collapsed `[keychain build]` table to the console on every rebuild in `bun run dev`, and does nothing in production builds.

## Deployment

GitHub Pages is served from the `gh-pages` branch. In GitHub, set **Settings -> Pages -> Build and deployment -> Source** to **Deploy from a branch**, `gh-pages`, `/ (root)`.

- `.github/workflows/deploy.yml` runs on every push to `master`: it tests, builds, and publishes production to the branch root, keeping any existing previews.
- `.github/workflows/preview.yml` is manual (**Actions -> Deploy Branch Preview -> Run workflow**): it publishes the selected branch under `preview/<branch-slug>/`.

The Vite base path is controlled by `VITE_BASE_PATH`, so the same build can target local preview, production, or a branch preview path.
