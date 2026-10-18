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
- Refine the logo for printing: change, merge or remove colors, limit it to N filaments, drop specks below a size in mm², click shapes in the 2D preview to remove them, and see features too thin for your nozzle highlighted in red
- Choose a square or circle base plate
- Tune base thickness, bevel, corner radius, padding, logo height, and target size
- Add or remove the keyring hole
- Inspect the model with an interactive Three.js viewport
- Export a multi-color `.3mf` for modern slicers
- Remember the last SVG, settings and refinements across reloads (browser localStorage)

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
- **Refinements never edit the SVG.** They're stored as settings (`Refinements` in `src/types/keychain.ts`) and applied to the parsed color groups before the model is built (`src/utils/refine.ts`, wired up in `useLogoRefinement`). The parser doesn't know about them, and every edit can be undone. Recolors and hidden shapes refer to the current logo (shapes by `color:index`), so they reset on a new upload; the cleanup settings carry over.
- **Each refinement step returns a new array only when its output changes.** Because groups are compared by identity (below), `refineColors` and `removeSpecks` keep their last result per input and return it again when nothing changed (e.g. a merge tolerance below every color distance). Otherwise every slider tick would trigger a ~400 ms rebuild.
- **Speck sizes and thin features are measured at the printed size.** Both use the logo scale from `fitLogo` (`src/utils/logoFit.ts`), the same function the builder sizes the plate with, so they follow width, padding and plate shape. Specks use the scale before they're removed; removing them barely moves it.
- **Thin features are only flagged, not fixed, and the check is raster-based.** Thickening needs a polygon offset, which polygon-clipping can't do (Clipper2 could). `findThinFeatures` rasterizes the colors and the plate gaps and runs a morphological opening with exact distance transforms (~30 ms, debounced). Every acute corner fails by a sliver, so areas under a quarter of the minimum width squared are ignored; tips sharper than ~45° are still flagged, because they really do print blunt.
- **The camera refits for a new SVG, not for refinements.** `ThreeViewer`'s `fitKey` is the parsed groups array, so hiding a shape or merging colors rebuilds the model without resetting your view.
- **Config changes are debounced, not throttled.** `ThreeViewer.vue` waits for 150 ms with no input before rebuilding. While a slider is being dragged nothing rebuilds; the model updates after you pause. Because the build itself takes ~400 ms, rebuilding mid-drag would stall the UI.
- **Rendering is on demand.** `useThreeScene` only draws when `requestRender()` is called (or while orbit damping settles). Any code that changes the scene must call `requestRender()` or `fitCamera()`, or the change won't appear until the next mouse move.
- **`colorGroups` is compared by identity.** The viewer's watcher isn't deep, and the logo outline union is cached per array instance (in `logoOutline`). A new SVG or refinement must produce a new array; changing the old one in place won't trigger a rebuild or a new outline.
- **The logo's mirror and scale are baked into the geometry.** The SVG's Y flip is a negative scale. Putting it on a group transform would export to 3MF as a mirrored node, which slicers handle inconsistently, so it's applied to the vertices instead.
- **The model is built from clamped config, not the slider values.** `constrainConfig()` clamps combinations that break the geometry (e.g. a keyring hole bigger than its ring, or padding that would eat the whole logo). The UI keeps your raw values.
- **`ThreeViewer.vue` edits force a full page reload in dev.** It owns a WebGL context that can't be hot-swapped safely; swapping it in place would leak a context on every save.
- **The build profiler only runs in dev.** `src/utils/profiler.ts` logs a collapsed `[keychain build]` table to the console on every rebuild in `bun run dev`, and does nothing in production builds.

## Deployment

GitHub Pages is served from the `gh-pages` branch. In GitHub, set **Settings -> Pages -> Build and deployment -> Source** to **Deploy from a branch**, `gh-pages`, `/ (root)`.

- `.github/workflows/deploy.yml` runs on every push to `master`: it tests, builds, and publishes production to the branch root, keeping any existing previews.
- `.github/workflows/preview.yml` is manual (**Actions -> Deploy Branch Preview -> Run workflow**): it publishes the selected branch under `preview/<branch-slug>/`.

The Vite base path is controlled by `VITE_BASE_PATH`, so the same build can target local preview, production, or a branch preview path.
