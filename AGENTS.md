# AGENTS.md

Browser app that turns an SVG logo into a 3D-printable, multi-color keychain (`.3mf` export).
Vue 3 + Three.js + Tailwind v4, built with Bun and Vite 6.

## Agent workflow

- Ignore tests (`test-render/`, `test-svg/`) unless explicitly asked to run or modify them.
- Do **not** commit unless the user explicitly asks. When a change is complete, you may
  suggest a concise commit message — do not run `git commit` on your own.
- Use the project shell (bash/zsh on macOS/Linux). Prefer `bun` scripts over ad-hoc tooling.

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

```bash
bun install              # install deps
bun run dev              # dev server (default http://localhost:5173)
bun run build            # typecheck (vue-tsc) + production build
bun run preview          # preview the production build
npx vue-tsc --noEmit     # quick typecheck only
bun run render [svg] [config]   # headless PNG snapshots → test-output/ (Playwright)
```

Headless render needs Chromium once: `bunx playwright install chromium`.

## Where things live

Non-obvious files only (the rest are self-describing):

- `src/utils/meshBuilder.ts` — base plate (CSG keyring hole) + logo meshes + 3MF export
- `src/composables/useThreeScene.ts` — camera, OrbitControls, lights
- `src/utils/profiler.ts` — perf instrumentation, threaded into `buildBasePlate`
- `src/types/keychain.ts` — `KeychainConfig` + `DEFAULT_CONFIG`, the config shape everything builds from

## Gotchas

- `src/components/ThreeViewer.vue` intentionally calls `import.meta.hot.decline()`
  (full reload on HMR, not in-place swap). Do **not** remove it — it guards a cluster
  of WebGL lifecycle leaks. See `docs/CODE-REVIEW-TECH-DEBT.md`.
- Export uses `three-3mf-exporter`; the keyring hole uses `three-bvh-csg` (CSG
  boolean subtraction) in `src/utils/meshBuilder.ts`.
- Deploy is GitHub Pages (`.github/workflows/`); the Vite `base` path is driven by
  the `VITE_BASE_PATH` env var.

## Docs

- `docs/KEYCHAIN-MAKER-MVP.md` — product scope
- `docs/KEYCHAIN-MAKER-PROMPTS.md` — implementation prompts / history
- `CLAUDE.md` — parallel agent notes (PowerShell-oriented); prefer this file in Cursor
