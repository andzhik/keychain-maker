# SVG outline plates

[All documentation](README.md) · [Issue #15](https://github.com/andzhik/keychain-maker/issues/15)

Choose **SVG outline** in Keychain settings. **Outline offset** is always shown
and accepts 0–20 mm in 0.1 mm steps. Negative/invalid typed entries are constrained
by the number control; invalid restored/direct builder values block the model
with an explanation. The shape and offset are saved with other plate settings.

![Two-color concave star with a 2 mm outline offset, backed counter, chamfer and keyring](img/svg-outline.png)

## Sizing

Each populated face is independently centered and scaled to **Width**, preserving
its aspect ratio. That is the artwork width **before** the border. Border/padding
and Corner rounding do not apply in this mode; switching shapes preserves them.
Refinement tolerances and thin-feature checks use this same artwork scale.

The silhouette is the union of the visible, refined Front and Back artwork in
physical plate coordinates, including their independent outside-view mirrors.
Same as Front behaves like shared artwork; None contributes nothing. Hidden
colors/shapes and cleanup changes update the plate. Interior artwork holes are
filled for the silhouette, so they remain plate material, including holes formed
by the union of several paths. Internal color borders do not affect the perimeter.

The silhouette is expanded geometrically at print size using
[Clipper's polygon offset](https://github.com/junmer/clipper-lib/blob/master/Documentation.md),
with round joins and resolved intersections. It is not scaled, boxed or replaced
with a convex hull. Integer precision is 0.00001 mm; round-join chord error is at
most 0.01 mm. For example, Width 50 mm and offset 2 mm give approximately 54 mm at
the flat faces, before bevel/keyring. Zero follows the artwork; a 0.0001 mm
numerical clearance avoids coincident exterior walls in recess subtraction.

## Connections and edges

If the requested offset leaves multiple components (including point-only
contacts), the model and Download are unavailable. Increase Outline offset until
pieces overlap, hide a component, or choose Rectangle/Circle. No component is
silently discarded, and the keyring does not connect separate pieces.

![Disconnected artwork blocks Download and explains how to recover](img/svg-outline-disconnected.png)

The keyring attaches at the highest boundary point (closest to the center on a
tie), using a rounded, reinforced neck of the loop's diameter. The hole's bottom
sits 1 mm above the silhouette's top, clear of both faces' artwork. Loop/hole size
constraints still apply. Edge chamfer is also capped to keep the hole open.

The flat faces retain the requested border. The chamfer bulges outward by up to
its configured size, matching existing plate sizing conventions. For arbitrary
concavities, nested rounded polygon offsets are triangulated into bevel bands;
this handles closing notches without folding per-vertex bevels. Thickness, inlay
depth and recesses use the existing Z intervals. Finished dimensions include the
bevel and keyring. Preview and 3MF export share the exact same meshes.

## Verification

`bun run test` checks concave offsets numerically, filled holes, unions,
disconnected pieces, invalid settings, persistence, face fitting, and volume/ray
partitions across zero/positive offsets, bevels and keyrings.

`bun run test:browser` includes `tests/browser/outline.test.ts`. It exercises the
real controls, refinements, reload, independent faces and mirrors, disconnected
recovery, and compares every exported triangle to the preview. Screenshots and
actual downloads are written under `test-output/issue-15/`.

After browser tests, `bun run test:slicer:outline` slices those downloads with
Bambu Studio CLI, using installed X1 Carbon / 0.4 mm / PLA / 0.2 mm profiles.
It verifies layer counts, printed filaments, solid middle layers, per-face color
layers and plate material in the star's circular counter. Logs, G-code and
toolpath SVGs are under `test-output/face-slicer/outline-*/`.
The harness adjusts the exporter's version/profile metadata for the installed
Bambu 1.9 CLI; it preserves mesh coordinates, topology and part assignments.

Implementation validation: production build, 234 unit tests and 55 browser tests
passed (browser files run sequentially to avoid concurrent startup timeouts).
All 27 exports passed Bambu Studio CLI checks, including eight outline exports
at 25 layers each. Thin 0.8 mm plates with meeting inlays and backed counters
are also covered by outline geometry tests, with and without bevel.
The screenshots above are from the real desktop app, captured by these tests.
