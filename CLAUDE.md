# CLAUDE.md

## Rules

- Ignore tests unless explicitly asked to run or modify.
- Use Windows PowerShell.

## Commands

- `bun run dev` — start the dev server
- `bun run build` — typecheck (`vue-tsc`) + production build
- `bun run preview` — preview the production build
- Quick typecheck only: `npx vue-tsc --noEmit`

## Gotchas

- `src/components/ThreeViewer.vue` intentionally calls `import.meta.hot.decline()`
  (full reload on HMR, not in-place swap). Do NOT remove it — it guards a cluster
  of WebGL lifecycle leaks. See `docs/CODE-REVIEW-TECH-DEBT.md`.
- Export uses `three-3mf-exporter`; the keyring hole uses `three-bvh-csg` (CSG
  boolean subtraction) in `src/utils/meshBuilder.ts`.
- Deploy is GitHub Pages (`.github/workflows/`); the Vite `base` path is driven by
  the `VITE_BASE_PATH` env var.
