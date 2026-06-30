# Improvement Roadmap

This document organizes proposed improvements into issue-sized work items. The highest-value path is to create GitHub issues for each item, then group them in a GitHub Project board with columns such as `Backlog`, `Ready`, `In Progress`, and `Done`.

## Recommended GitHub Organization

Use individual issues instead of one large tracking issue. These ideas touch different parts of the app: SVG parsing, geometry architecture, configuration validation, CI, examples, printability, and performance. Separate issues make it easier to prioritize, review, and ship incrementally.

Suggested labels:

- `area:svg`
- `area:geometry`
- `area:config`
- `area:ci`
- `area:docs`
- `area:printability`
- `area:performance`
- `type:enhancement`
- `type:refactor`

Suggested milestones:

- `MVP hardening`: SVG validation, config constraints, CI
- `Portfolio polish`: examples and fixtures, printability warnings
- `Architecture`: geometry/domain separation, performance guardrails

## GitHub CLI Notes

Yes, this can be done with GitHub CLI.

Create an issue:

```powershell
gh issue create --title "Add SVG validation and user-facing limitations" --label "type:enhancement,area:svg" --body-file docs/issues/svg-validation.md
```

Create a project:

```powershell
gh project create --owner <owner> --title "Keychain Maker Roadmap"
```

Add issues to a project:

```powershell
gh project item-add <project-number> --owner <owner> --url <issue-url>
```

GitHub Projects support through `gh project` can be a little clunky because project fields and item IDs require extra commands. A practical approach is to create issues with `gh issue create`, create the project with `gh project create`, then add or organize the issues either with `gh project item-add` or in the GitHub web UI.

## 1. Add SVG Validation And User-Facing Limitations

Priority: High

Type: Enhancement

Labels: `type:enhancement`, `area:svg`

### Problem

`svgToShapes` currently parses SVG input with `SVGLoader`, skips `fill="none"`, creates shapes, and groups them by normalized color. That is a reasonable foundation, but real-world SVGs often contain unsupported features or ambiguous styling. The current parser can collapse distinct problems into generic failures such as `Failed to parse SVG` or `No filled paths found`.

### Proposal

Introduce explicit SVG parse result types and map them to clear UI messages.

```ts
type SvgParseError =
  | 'EMPTY_SVG'
  | 'NO_FILLED_PATHS'
  | 'TEXT_NOT_CONVERTED'
  | 'UNSUPPORTED_EXTERNAL_IMAGE'
  | 'UNSUPPORTED_GRADIENT'
  | 'UNSUPPORTED_PATTERN'
  | 'UNSUPPORTED_CSS_STYLING'
  | 'TOO_COMPLEX'
  | 'ZERO_BOUNDS'
  | 'INVALID_SVG'
```

Handle at least:

- Empty SVG input
- SVG with only strokes and no fills
- Text elements not converted to paths
- External images inside SVG
- Gradient and pattern fills
- Huge SVGs or excessive path counts
- Unsupported CSS-based styling
- Very small or zero-width bounds

### Acceptance Criteria

- Parser returns structured success/error results instead of throwing or collapsing all failures into generic messages.
- UI displays specific, actionable messages for unsupported SVG features.
- Unit tests cover each major parse error.
- Existing valid SVG behavior is preserved.
- Unsupported SVG features fail loudly and visibly.

### Implementation Notes

- Keep validation close to `src/utils/svgToShapes.ts` or introduce a focused `src/utils/svgValidation.ts`.
- Avoid silently dropping unsupported content when that would produce a misleading model.
- Consider a max path/shape count before any expensive geometry work begins.

## 2. Separate Geometry Logic From Vue Composables

Priority: Medium-High

Type: Refactor

Labels: `type:refactor`, `area:geometry`

### Problem

`useKeychainBuilder` currently owns too many responsibilities:

- Disposes old scene objects
- Computes SVG bounds
- Scales and centers the SVG
- Creates logo cutout paths
- Builds the base plate
- Builds logo meshes
- Applies CSG cutouts
- Updates Vue state
- Attaches results to the Three.js scene

This makes the most important domain logic harder to test without Vue and a Three.js scene.

### Proposal

Split the builder into domain and rendering layers:

```text
src/domain/
  keychainLayout.ts       // width, height, scale, center, dimensions
  logoCutouts.ts          // SVG shape points -> cutout paths
  keychainModel.ts        // pure-ish model build orchestration

src/three/
  sceneLifecycle.ts       // add/remove/dispose scene objects
  materials.ts

src/composables/
  useKeychainBuilder.ts   // Vue wrapper only
```

### Acceptance Criteria

- Layout calculations are testable without Vue.
- Cutout path generation is testable without mounting the app.
- Scene lifecycle code is isolated from model-building orchestration.
- `useKeychainBuilder` becomes a thin Vue-facing wrapper.
- Existing model output is visually equivalent after refactor.

### Implementation Notes

- Do this incrementally to avoid destabilizing geometry.
- Preserve the mesh build order documented in `AGENTS.md`.
- Add tests around extracted calculations before moving more complex CSG orchestration.

## 3. Add Config Schema And Constraints

Priority: High

Type: Enhancement

Labels: `type:enhancement`, `area:config`

### Problem

Geometry depends heavily on configuration values such as target width, padding, base thickness, bevel, keyring diameter, hole diameter, and corner radius. There is already a `clampBevel` helper, but other geometry-sensitive settings need explicit validation or normalization.

### Proposal

Add a small dependency-light validator:

```ts
type ValidationSeverity = 'error' | 'warning' | 'info'

interface ValidationMessage {
  field: keyof KeychainConfig
  severity: ValidationSeverity
  code: string
  message: string
}

interface ValidationResult {
  config: KeychainConfig
  messages: ValidationMessage[]
  valid: boolean
}

function validateConfig(config: KeychainConfig): ValidationResult
```

Validate:

- `padding >= 0`
- `targetWidth > padding * 2`
- `baseThickness > 0`
- `keyringHoleDiameter < keyringRingDiameter`
- `cornerRadius <= min(width, height) / 2`
- Bevel clamping is surfaced to the UI if adjusted
- Max path count and max shape count are enforced

### Acceptance Criteria

- Invalid geometry settings are blocked before model generation.
- Automatically adjusted settings produce visible UI feedback.
- Validation messages are structured and testable.
- Unit tests cover important boundary cases.

### Implementation Notes

- Prefer a hand-written validator for now to keep dependencies light.
- Place config validation near `src/types/keychain.ts` or in `src/domain/configValidation.ts`.
- Treat errors and warnings differently: errors block build/export, warnings inform the user.

## 4. Improve CI Signal

Priority: High

Type: Tooling

Labels: `type:enhancement`, `area:ci`

### Problem

The repo has deploy and preview workflows, but it should also have a direct CI workflow that verifies changes on pull requests and pushes.

### Proposal

Add `.github/workflows/ci.yml`.

Initial version:

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [master]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun run test
      - run: bun run build
```

Future version once scripts exist:

```yaml
      - run: bun run format:check
      - run: bun run lint
```

### Acceptance Criteria

- CI runs on pull requests.
- CI runs on pushes to `master`.
- CI installs dependencies with the lockfile frozen.
- CI runs unit tests and production build.
- Lint and format checks are added once scripts are available.

### Implementation Notes

- Current `package.json` has `test` and `build`, but no `lint` or `format:check`.
- Avoid adding workflow steps for scripts that do not exist yet.

## 5. Add Examples And Fixtures

Priority: Medium

Type: Documentation / Test Assets

Labels: `type:enhancement`, `area:docs`, `area:svg`

### Problem

The repo already has SVG and render test folders, but examples are not yet first-class user-facing assets.

### Proposal

Add curated examples:

```text
examples/
  simple-logo.svg
  two-color-logo.svg
  text-converted-to-paths.svg
  complex-logo.svg

docs/
  examples.md
```

Each example should document:

- Expected behavior
- Screenshot
- Recommended settings
- Known caveats

### Acceptance Criteria

- Example SVGs are small, clear, and licensed for repo use.
- Documentation explains expected app behavior for each example.
- Screenshots are generated from the app or render script.
- Examples can double as manual regression fixtures.

### Implementation Notes

- Keep `test-svg/` and `test-render/` for tests unless intentionally reorganizing them.
- User-facing examples should live separately from test-only fixtures.

## 6. Add A Printability Layer

Priority: Medium-High

Type: Product Enhancement

Labels: `type:enhancement`, `area:printability`

### Problem

The app creates a 3D model, but users also need help understanding whether the model is practical to print.

### Proposal

Add printability warnings:

- Logo detail thinner than nozzle width
- Logo islands too small
- Keyring hole too close to edge
- Base too thin
- Bevel too large for thickness
- Unsupported tiny paths
- Model dimensions summary in millimeters

Example messages:

- Some logo details may be too thin for a 0.4 mm nozzle.
- Keyring wall thickness is below 2 mm; consider increasing ring diameter or reducing hole diameter.

### Acceptance Criteria

- App displays a model dimensions summary in millimeters.
- App warns when keyring wall thickness is too small.
- App warns when base thickness is below recommended minimum.
- App warns about likely unprintable tiny logo details where detectable.
- Warnings do not block export unless the model is invalid.

### Implementation Notes

- Start with config-derived checks before attempting complex geometric analysis.
- Allow nozzle width to be configurable later; use `0.4 mm` as the default assumption.
- This work can build on the config validation result shape.

## 7. Make Performance Behavior Explicit

Priority: Medium

Type: Enhancement

Labels: `type:enhancement`, `area:performance`

### Problem

The repo already has a `Profiler`, and CSG subtraction is known to be the dominant build cost. Performance behavior should become more systematic and user-aware.

### Proposal

Add explicit performance guardrails:

- Disable profiling logs in production unless debug mode is enabled.
- Expose render/build time in dev mode.
- Enforce complexity limits before CSG work begins.
- Debounce expensive rebuilds from sliders.
- Consider an `Apply` button for expensive settings instead of rebuilding on every input.

### Acceptance Criteria

- Expensive rebuilds are debounced or otherwise controlled.
- Complexity limits run before CSG work starts.
- Production console output is quiet by default.
- Development builds can surface build timing.
- UI remains responsive when users adjust sliders.

### Implementation Notes

- Start with pre-CSG shape/path count limits.
- Add debounce at the input/build boundary rather than deep in mesh generation.
- If adding an `Apply` button, reserve it for settings that cause expensive rebuilds.

## Suggested Issue Order

1. Add CI workflow for build and tests.
2. Add structured SVG validation errors.
3. Add config validation and geometry constraints.
4. Add performance guardrails before CSG.
5. Add printability warnings based on existing config and dimensions.
6. Extract layout and scene lifecycle from `useKeychainBuilder`.
7. Add curated examples and docs.

This order improves project safety first, then user-facing quality, then architecture and polish.
