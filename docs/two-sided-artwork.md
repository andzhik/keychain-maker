# Two-sided artwork validation

Issue [#14](https://github.com/andzhik/keychain-maker/issues/14) adds separate
Front and Back artwork, Empty faces and independent horizontal mirroring.
See the [user guide](user-guide.md#front-and-back-artwork) for fitting and orientation.

## Automated geometry and browser checks

Unit tests probe the base and inlays along interior columns and compare their
combined signed volume to a solid plate. They cover different aspect ratios,
logo counters, front-only/back-only artwork, independently mirrored outlines,
0/0.005/0.6 mm bevels, shallow recesses, exact meeting depths and thin plates.
The columns must fill the whole thickness exactly once. Mirrored triangle
winding must agree with outward normals, with positive node determinants.

Browser tests exercise both uploaders, delayed raster decoding across face
switches, failures scoped to a source, persistence of each source and edits,
reversible Empty/Same as Front selections, old-session migration, independent
mirror toggles and actual downloads. Exported triangles must exactly match the
preview; asymmetric path-based F/L glyphs verify outside-view X orientation.

## Bambu Studio CLI

Tested with the installed Bambu Studio **01.09.07.52** CLI, Bambu Lab X1 Carbon
0.4 mm nozzle, 0.20mm Standard @BBL X1C and Bambu PLA Basic profiles. First and
subsequent layers are 0.2 mm. The test resolves the profiles' inheritance,
loads them explicitly, and verifies actual model extrusion paths in G-code.

The exporter defaults to a Bambu 2.4 application header. For this older CLI,
the test copies set the application metadata to 1.9 and select the installed
X1 Carbon preset identifiers and flush settings, as in the earlier
[surface-inlay comparison](surface-inlays.md). Vertices, triangles, transforms,
part assignments and filament colors are unchanged. This checks geometry and
toolpaths with the installed CLI; it does not certify its handling of the
exporter's newer default project metadata.

Each of five workflows is sliced with a 5 mm base and 0.6 mm bevel, a 0.8 mm
unbeveled base, and a 0.8 mm base with 0.3 mm bevel: **15 cases** in total.
Logo depth is 0.6 mm, capped to 0.4 mm per face for the thin bases.

| Workflow | Front color layers, 5 mm / 0.8 mm | Back color layers, 5 mm / 0.8 mm |
| --- | --- | --- |
| Different images, normal outside orientation | 3 / 2 | 3 / 2 |
| Front mirrored independently | 3 / 2 | 3 / 2 |
| Back mirrored independently | 3 / 2 | 3 / 2 |
| Front only, Back Empty | 3 / 2 | 0 / 0 |
| Back only, Front Empty | 0 / 0 | 3 / 2 |

Every case must have base-material toolpaths on every layer. Front color is
restricted to the last three (or two) layers; Back color to the first three
(or two). Glyph stems must print on the expected side, including each
independent mirror state. The script also writes first/last-layer toolpath
SVGs with the Back reflected into an outside view, keyring at the top.

```powershell
bun run test:browser
bun run test:slicer
```

Generated input copies, sliced 3MFs, G-code, logs, toolpath SVGs and
`results.json` are under `test-output/face-slicer/` (excluded from Git).
