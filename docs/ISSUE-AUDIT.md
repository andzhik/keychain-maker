# GitHub issue audit — 2026-10-18

## Follow-up implementation

The audit below is a historical snapshot at `18ad387`. The follow-up started from
`0afe229` after confirming local and remote `master` matched. GitHub #2 is now
closed; nine issues were open at the recheck. That status change did not add a
dedicated CI workflow to this checkout.

Revalidated and addressed #10, #11, #3, and #5:

- **#10:** tracing already existed. Upload attempts now invalidate old artwork;
  read/decode/trace/validation failures clear parsed and persisted artwork and
  prevent stale exports. Generation checks discard late successes and failures.
- **#11:** desktop retains the parameter columns, tablet stacks the preview below
  two control columns, and phone screens use one scrolling column. Download,
  dimensions, readiness, and enlarged previews stay reachable. Export waits for
  the current successful build; thin-base/keyring advice uses a shared utility.
- **#3:** `svgToShapes` now returns a typed result with actionable unsupported-
  feature diagnostics. Inline styles, transforms, holes, white fills, local
  bounded xlink copies, and supported existing fixtures are covered.
- **#5:** profiling was already dev-only and rebuilds already used a **60 ms**
  debounce. Added budgets before SVGLoader, polygon clipping, and the builder's
  outline/CSG stages, including single-path tessellation and fragmentation.
  Explicit equivalent BVH setup also removes dependency deprecation warnings.

README now documents the actual 60 ms debounce, labels the old latency baseline
as historical, describes import budgets/readiness, and identifies `logo.svg` as
an unsupported live-text vector fixture and `broken logo.svg` as malformed XML.
The rasterized logo fixtures remain valid tracing inputs.

Follow-up verification:

- **99 unit tests** and **12 browser tests** pass; production type-check/build passes.
- Browser regressions cover stale raster failures, late upload successes/failures,
  SVG diagnostics and recovery, invalid persistence, current-model downloads,
  advisory printability, WebGL fallback, responsive/enlarged previews, and zoom.
- Production screenshots were inspected at 390, 768, and 1400 px, with no browser
  console messages during import and rebuild at any of those widths.
- Comparing the previous and current mesh builders across all five supported SVG
  fixtures, with bevel 0 and 0.6 mm, produced identical geometry attributes and indices.
- The existing Vite warning about a JavaScript chunk over 500 kB remains.

The work does not implement #9's cleanup/report workflow or #7's builder split.
Config validation gaps from #4 remain separate; printability advice is not a
geometry-validity check. Issue states and comments were not changed by this work.

## Original audit

Reviewed all ten GitHub issues (#2–#11) against `master` at
[`18ad3878a785cb345f7de8649211c393c095be63`](https://github.com/andzhik/keychain-maker/commit/18ad3878a785cb345f7de8649211c393c095be63).
The remote branch and local checkout matched. The repository's #1 is a closed
pull request and was excluded from the issue audit.

**Result:** eight issues have partial implementation or supporting groundwork;
two have no implementation of their requested feature. None meets every stated
acceptance criterion, so all ten remain open. Eight progress comments link the
implementing commits and explain what remains.

## Issue-by-issue findings

| Issue | Status | Implemented evidence | Remaining acceptance gaps |
| --- | --- | --- | --- |
| [#2: CI workflow](https://github.com/andzhik/keychain-maker/issues/2) | Partial | [848ac7d] adds tests to deployment workflows. Production uses a frozen lockfile, tests, and build on pushes to `master`. | No dedicated CI workflow or automatic `pull_request` verification. |
| [#3: Structured SVG errors](https://github.com/andzhik/keychain-maker/issues/3) | Requested feature absent | Existing generic parser-error handling and tests. | No structured success/error result, actionable unsupported-feature diagnostics, or complexity limits. `useSvgParser.ts` still reports only “No filled paths found” or “Failed to parse SVG”. |
| [#4: Config validation](https://github.com/andzhik/keychain-maker/issues/4) | Partial | [62f2b27] adds keyring/padding constraints, field-specific adjustment messages, and boundary tests. Mesh generation also clamps bevel and corner radius. | Bevel/corner-radius changes are silent; the validator does not independently reject negative padding or nonpositive thickness; path/shape limits are absent. |
| [#5: Performance guardrails](https://github.com/andzhik/keychain-maker/issues/5) | Partial | [62f2b27] gates profiling to development and combines CSG subtraction; [0dbcc6b] shows build timing; [fd0c0f0] sets a 60 ms rebuild debounce; [be3a8e5] simplifies outlines. | No enforced complexity limits before CSG. Simplification reduces work without bounding excessive input. |
| [#6: Printability warnings](https://github.com/andzhik/keychain-maker/issues/6) | Partial | [9f7b713] reports measured dimensions; [e273530] adds nozzle-based thin-feature warnings/overlays and speck removal; [62f2b27] enforces a 1 mm keyring wall. | No recommended-minimum base-thickness warning or keyring-wall warning for geometrically valid but thin walls. |
| [#7: Builder separation](https://github.com/andzhik/keychain-maker/issues/7) | Partial | [e273530] extracts shared fitting calculations into `src/utils/logoFit.ts` and caches outlines. | `useKeychainBuilder.ts` still owns scene disposal/attachment, cutout construction, and base/logo/CSG orchestration. Scene lifecycle is not isolated and the Vue wrapper remains substantial. |
| [#8: Curated examples](https://github.com/andzhik/keychain-maker/issues/8) | Groundwork only | [e7a0baf] adds printable SVG fixtures; [8507fb6] adds raster fixtures. README documents the capture tools and input caveats. | No user-facing example collection/catalog documenting expected behavior, screenshots, recommended settings, and caveats per example. |
| [#9: SVG import preparation](https://github.com/andzhik/keychain-maker/issues/9) | Requested feature absent | Existing SVGLoader parsing, color normalization, and paint-order resolution. | No import-preparation/report stage, safe cleanup workflow, actionable unsupported-feature report, or requested cleanup/diagnostic test coverage. |
| [#10: Raster import](https://github.com/andzhik/keychain-maker/issues/10) | Largely implemented; acceptance gap reproduced | [221d4fd] adds PNG/JPEG/WebP tracing, SVG preview integration, and color/background controls; [4b33bef] adds smoothing/corner/straightening controls; [7137d53] preserves zoom while retracing. | Failed raster replacement leaves the previous logo model loaded and exportable. See reproduction below. |
| [#11: Parameters-first UI](https://github.com/andzhik/keychain-maker/issues/11) | Partial | [c09a0e9] introduces settings-first cards; [ab80d02] introduces the compact three-column layout; [e273530] adds refinement feedback; [9f7b713] improves dimensions and error feedback. | Narrow layouts clip the preview/export controls; export readiness does not account for failed raster replacement; remaining printability guidance from #6 is absent. |

## Verification

- `bun run test`: **66 passed, 0 failed** across eight unit-test files.
- `bun run test:browser`: **1 passed, 0 failed**.
- `bun run build`: **passed**, including TypeScript checking. Vite reports its
  existing warning about a JavaScript chunk larger than 500 kB.
- Read all workflow definitions and traced parser, validator, refinement, builder,
  uploader, layout, and export code against each issue's acceptance criteria.
- Ran additional read-only Playwright probes for raster failures and narrow
  viewports. These probes were for the audit and did not change application code.

### #10: Failed raster replacement preserves stale geometry

1. Upload `test-images/logo-white.png`.
2. Wait until the scene group contains both the plate and logo children.
3. Upload `broken.png` with MIME type `image/png` and invalid PNG bytes.

Observed in headless Chromium:

- The visible error is `Could not read "broken.png".`.
- The same Three.js group UUID remains, including the logo child.
- The previous SVG remains in localStorage.
- Download remains enabled.

The decode/trace catches in `src/components/SvgUploader.vue` update a local
error without notifying the parent to clear or invalidate the loaded artwork.
`src/App.vue` enables export based on whether parsed groups exist. This fails
the issue's explicit requirement that import failures leave no stale geometry.

### #11: Export controls are clipped at narrow widths

At viewport widths of **768 px** and **390 px**, the Download button's bounding
box begins at approximately **x = 909 px**, with a width of 192 px. The preview
begins at x = 717 px. Both widths retain the 300 px logo column, 380 px settings
column, and minimum 320 px preview.

The app container hides horizontal overflow, so the offscreen Download button
cannot be reached through a horizontal scrollbar. The layout therefore does
not meet the issue's narrow-screen usability criterion.

## GitHub updates

Posted progress comments with implementing commits and outstanding criteria:

- [#2 comment](https://github.com/andzhik/keychain-maker/issues/2#issuecomment-6257105467)
- [#4 comment](https://github.com/andzhik/keychain-maker/issues/4#issuecomment-6257106117)
- [#5 comment](https://github.com/andzhik/keychain-maker/issues/5#issuecomment-6257106645)
- [#6 comment](https://github.com/andzhik/keychain-maker/issues/6#issuecomment-6257107102)
- [#7 comment](https://github.com/andzhik/keychain-maker/issues/7#issuecomment-6257107639)
- [#8 comment](https://github.com/andzhik/keychain-maker/issues/8#issuecomment-6257108094)
- [#10 comment](https://github.com/andzhik/keychain-maker/issues/10#issuecomment-6257108791)
- [#11 comment](https://github.com/andzhik/keychain-maker/issues/11#issuecomment-6257109359)

No comment was added to #3 or #9 because their requested features have no
implementing commit to cite. No issue was closed.

The connector could read issues but returned “Resource not accessible by
integration” when posting a comment. The authenticated GitHub CLI successfully
posted all eight comments.

[848ac7d]: https://github.com/andzhik/keychain-maker/commit/848ac7d45036990dd05a52ef581e1806d5698a93
[62f2b27]: https://github.com/andzhik/keychain-maker/commit/62f2b27368244ba91804c613e1b88567a30ed1cf
[0dbcc6b]: https://github.com/andzhik/keychain-maker/commit/0dbcc6b3324cc2f1979ae6044b6eeb71d549cdea
[fd0c0f0]: https://github.com/andzhik/keychain-maker/commit/fd0c0f022c155e878c91a0698df2467c41ed398b
[be3a8e5]: https://github.com/andzhik/keychain-maker/commit/be3a8e5221321f24ab45c98c0c7015209f266494
[9f7b713]: https://github.com/andzhik/keychain-maker/commit/9f7b7131396e499deedf95ceb5929a6e054ce4d3
[e273530]: https://github.com/andzhik/keychain-maker/commit/e27353049bd4dbe4735e062a990930e2a9d68479
[e7a0baf]: https://github.com/andzhik/keychain-maker/commit/e7a0baf58993a6b1eddc4891727e16efc5bc6479
[8507fb6]: https://github.com/andzhik/keychain-maker/commit/8507fb63d749e976cc5a375e95a80f45b05e9762
[221d4fd]: https://github.com/andzhik/keychain-maker/commit/221d4fd8116c00cee906b0b946c7d75caa91f5a9
[4b33bef]: https://github.com/andzhik/keychain-maker/commit/4b33bef30e398c20e1e9ab47c391b01a04ec3837
[7137d53]: https://github.com/andzhik/keychain-maker/commit/7137d5357ecefe6e4591cf8174fd804b46db20b4
[c09a0e9]: https://github.com/andzhik/keychain-maker/commit/c09a0e94cd1afd1be94a915a185975aaeb75170a
[ab80d02]: https://github.com/andzhik/keychain-maker/commit/ab80d02893780fc7beaf688f9ae4e64fb35d8814
