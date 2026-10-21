# Surface inlay validation

Issue [#12](https://github.com/andzhik/keychain-maker/issues/12) limits colored
inlays to the two faces. **Logo depth** is the depth on each face, in millimeters.
The default is 0.6 mm: three layers at a 0.2 mm layer height. The slicer still
controls actual layer placement; choose a depth divisible by its layer height.

The remaining middle thickness is `max(0, thickness - 2 × logo depth)`.
When the requested depths meet or overlap, they become one through-inlay.
The controls retain the requested value and explain the effective cap.
The keyring hole always passes through the plate.

## Slicer comparison

Measured on 2026-10-21 with Bambu Studio **01.09.07.52** CLI. The baseline was
built using the geometry from commit `5449600`; the updated model used the same
SVG, plate settings, colors, exporter, and slicing profiles.

- Artwork: `test-svg/c1.svg`, parsed without refinements; white plate, black and blue logo.
- Plate: rectangle, 50 mm nominal width, 5 mm thickness, 5 mm margin,
  5 mm corner radius, 0.6 mm bevel with two segments, default keyring enabled.
- Printer: Bambu Lab X1 Carbon, 0.4 mm nozzle.
- Process: installed **0.20mm Standard @BBL X1C** profile, 0.2 mm first layer
  and subsequent layers, two walls, 15% infill, support off, prime tower off.
- Filaments: **Bambu PLA Basic @BBL X1C** for all three colors, 1.75 mm diameter,
  1.26 g/cm³ density. Every off-diagonal flush matrix entry was 280 mm³,
  with a flush multiplier of 1; flushing into infill/objects was off.
- Both models sliced into 25 layers. The updated model used 0.6 mm inlays
  on each face and a 3.8 mm continuous middle in the plate material.

| Measurement | Through-inlay baseline | Surface inlays | Reduction |
| --- | ---: | ---: | ---: |
| Filament changes during printing | 50 | 13 | 74% |
| Filament extruded in tool-change flush blocks | 17.95 g | 4.67 g | 74% |
| Total filament, including the model and flushing | 28.49 g | 12.78 g | 55% |
| Estimated total print time | 1h 47m 39s | 41m 56s | 61% |

Filament changes count transitions among `T0`, `T1`, and `T2`, excluding initial
loading and final unloading. Flush mass sums extrusion inside the generated
`; FLUSH_START` / `; FLUSH_END` blocks, converted from filament length using the
diameter and density above; startup purging is excluded. Total time and total
filament are the slicer's estimates from `Metadata/slice_info.config`.
These are estimates for this fixture and profile, not physical print measurements.

The generated G-code selects only the white plate filament for layers 4–22;
logo colors appear on layers 1–3 and 23–25. The baseline changes filaments
throughout all 25 layers.

To repeat with the updated app, export `c1.svg` with **Logo depth** set to 2.5 mm
for the through-inlay case, then 0.6 mm for the surface case, leaving all other
settings unchanged. Apply the same printer, process, filament and flush settings
to both files. This through-inlay case reproduces the old geometry behavior.
For a CLI comparison, resolve the installed profiles' `inherits` chains into
standalone machine, process and filament JSON files, then use the same files
for each input:

```powershell
$slicer = 'C:/Program Files/Bambu Studio/bambu-studio.exe'
& $slicer --load-settings 'machine.json;process.json' `
  --load-filaments 'filament.json;filament.json;filament.json' `
  --slice 0 --outputdir before --export-3mf before-sliced.3mf before.3mf
& $slicer --load-settings 'machine.json;process.json' `
  --load-filaments 'filament.json;filament.json;filament.json' `
  --slice 0 --outputdir after --export-3mf after-sliced.3mf after.3mf
```

The local comparison inputs, resolved profiles, sliced 3MFs and G-code are in
`test-output/slicer-comparison/` (generated artifacts, excluded from Git).

## Geometry and preview checks

- Unit tests probe both colors through both faces, the recess floors, the solid
  middle, a logo counter, the plate margin, and the keyring hole. They also
  compare the sum of signed base/inlay volumes with the uncut plate.
- Cases include 0, 0.005 and 0.6 mm bevels, 0.1 and 0.6 mm surface depths,
  exact meeting at 1.2 mm thickness, overlapping requests at 0.8 mm thickness,
  and a depth request larger than the whole plate.
- Browser tests change the depth slider, reload the saved session, download
  actual 3MF files, and compare every exported triangle against the current
  preview, including flat, beveled and thin bases.
- `bun run render test-svg/c1.svg` captures both top and underside views.
  Both faces and the through keyring hole were inspected with the default bevel
  and without bevel. The flat variant takes `'{"edgeBevel":0}'` as the second argument.
