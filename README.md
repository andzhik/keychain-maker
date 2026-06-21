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
