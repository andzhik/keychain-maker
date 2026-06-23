# Keychain Maker

Turn an SVG logo into a 3D-printable, multi-color keychain. Upload an SVG, tweak the
base plate and logo extrusion, add a keyring hole, and export a `.3mf` file ready for
your slicer.

## Tech Stack

- **Vue 3** (script setup + TypeScript)
- **Three.js** — 3D viewport and geometry building
- **Tailwind CSS v4**
- **Vite 6** + **Bun**
- **three-3mf-exporter** — multi-color `.3mf` export

## Getting Started

```bash
bun install
bun run dev
```

Then open the local URL Vite prints (default http://localhost:5173).

## Scripts

- `bun run dev` — start the dev server
- `bun run build` — type-check and build for production
- `bun run preview` — preview the production build
- `bun run render [svg] [config]` — headless render to PNGs (see below)

## Render snapshots

`bun run render` drives the real build pipeline in headless Chromium and writes PNG
snapshots (iso, iso-back, top, front, back) to `test-output/`, for inspecting and
diffing a render offline.

```bash
bunx playwright install chromium          # one-time browser download
bun run render                            # defaults to test-svg/c1.svg
bun run render test-svg/c1.svg '{"edgeBevel":0}'   # with config overrides
```

The harness lives in `test-render/`. It runs under Node (not Bun) because Playwright's
browser pipe transport hangs under Bun.
