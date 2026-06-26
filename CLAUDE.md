# CLAUDE.md

## Rules

- Ignore tests unless explicitly asked to run or modify.
- Use Windows PowerShell.
- Every time you finished a change and it is complete, generate a concise commit message, but do not commit
- If no simple fix is apparent, do not brute-force a solution — investigate carefully and
  highlight likely causes, trade-offs, and options to the user before making large or
  speculative changes.

## Conventions

- Comments answer **why**, not what. No redundant comments that just restate the code.
- Optimize for long-term maintainability over short-term convenience.
- Never swallow errors. Make failures loud and visible — surface, don't catch-and-ignore.
- When running the app via scripts (headless/automated), surface UI and browser-console
  errors too, not just process exit codes — otherwise client-side failures pass silently.

## Stack

- Bun runtime, Vite 6, Vue 3 (`<script setup>` + TS), Tailwind CSS v4, Three.js (0.170).
- Tailwind v4: `@tailwindcss/vite` plugin + `@import "tailwindcss"` in CSS — there is no
  `tailwind.config.js`.
- Entry: `index.html` → `src/main.ts` → `src/App.vue`.
- Light theme only (no dark mode). Layout: left sidebar fixed 300px, right pane `flex-1`
  for the Three.js viewport, footer shows keychain dimensions.

## Commands

- `bun run dev` — start the dev server
- `bun run build` — typecheck (`vue-tsc`) + production build
- `bun run preview` — preview the production build
- Quick typecheck only: `npx vue-tsc --noEmit`

## Where things live

Non-obvious files only (the rest are self-describing):

- `utils/meshBuilder.ts` — base plate + logo meshes + 3MF export.
  **Mesh build order (do not reorder):** (1) base-plate spline, (2) optional keyring + hole
  (`shape.holes` before extrude), (3) base bevel extrude, (4) logo extrude (no bevel),
  (5) CSG logo cutout only.
- `composables/useThreeScene.ts` — camera, OrbitControls, lights
- `utils/profiler.ts` — perf instrumentation, threaded into `buildBasePlate`
- `types/keychain.ts` — `KeychainConfig` + `DEFAULT_CONFIG`, the config shape everything builds from

## Gotchas

- `src/components/ThreeViewer.vue` intentionally calls `import.meta.hot.decline()`
  (full reload on HMR, not in-place swap). Do NOT remove it — it guards a cluster
  of WebGL lifecycle leaks. See `docs/CODE-REVIEW-TECH-DEBT.md`.
- Export uses `three-3mf-exporter`; logo cutouts use `three-bvh-csg` (CSG boolean
  subtraction) in `src/utils/meshBuilder.ts`. The keyring hole is a `shape.holes`
  contour before bevel extrude (inner bevel), not CSG.
- Deploy is GitHub Pages (`.github/workflows/`); the Vite `base` path is driven by
  the `VITE_BASE_PATH` env var.
