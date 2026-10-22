# User guide

[All documentation](README.md)

## What it makes

Keychain Maker takes a clean, filled SVG, separates its shapes by color, builds a beveled base plate with an optional keyring hole, and exports a slicer-ready `.3mf` file.

![SVG to 3D keychain to slicer preview](img/logo-steps.png)

## Controls and features

- Upload an SVG logo and preview it immediately in 3D
- Choose Front and Back artwork independently, reuse Front on Back, or leave either face Empty
- Mirror each populated face horizontally, with previews labeled as outside views with the keyring at the top
- Or upload a PNG, JPEG or WebP: it's traced into flat colors in the browser (pick the maximum number of colors and whether to drop an opaque background, and tune how much outlines are smoothed, how readily corners are rounded off, and whether nearly level edges are straightened)
- Preserve logo colors as separate printable materials, with overlapping shapes resolved in paint order
- Refine the logo for printing: change, merge or remove colors, limit it to N filaments, remove small bits below a size in mm, click shapes in the 2D preview to remove them, and see features too thin for your nozzle highlighted in red
- Toggle the red thin-area overlay from either 2D preview; both previews share the setting, while printability warnings stay visible
- Simplify outlines to a tolerance in mm (0.02 mm by default) to cut the model's polygon count, and compare the result against the original in an enlarged, zoomable 2D preview that opens over the settings and 3D view, so the logo and refine controls stay usable
- Choose a square or circle base plate
- Tune base thickness, bevel, corner radius, margin, and target size
- Set logo depth in mm on each face (0.6 mm by default), leaving the middle in the plate material to reduce filament changes and purging
- Add or remove the keyring hole
- Inspect the model with an interactive Three.js viewport
- Export a multi-color `.3mf` for modern slicers
- See actionable import errors and export readiness; failed imports clear the previous artwork, and downloads wait for the current model to finish building
- Configure the shared nozzle diameter and Thin walls behavior in the Printer card
- Remember both images, face selections, mirror settings and refinements across reloads (browser localStorage)

## Front and Back artwork

Select **Front** or **Back** in the Logo card. **Upload image** uses that face's
own SVG or traced raster and its own refinements. Back initially uses **Same as
Front**, sharing Front's image and refinements while keeping an independent
mirror setting. Switching Back to its own image and back again preserves its
previous image and edits. **Empty** leaves a solid face in the plate material;
switching back restores the stored artwork and refinements.
The shared Back preview is read-only: use **Edit on Front →** to change its
colors or shapes. Mirroring remains independent on Back.

**Mirror horizontally** changes only the selected face. The 2D preview shows
that face from outside, with the keyring at the top, matching the 3D model and
export. Fresh sessions leave Mirror off on both faces, so text reads normally
on each side. Older single-image saved sessions keep Back mirrored to preserve
their original orientation. Use **Front** and **Back** above the 3D view to
inspect either outside face; **Reset View** returns to the isometric view.

Each image is centered independently and keeps its aspect ratio. A rectangle
has the configured Width; each image fills the width remaining after Margin on
both sides. The taller fitted image sets the shared plate height, including top
and bottom margins, so the shorter image has extra vertical space. A circle
keeps the configured diameter; each image's farthest outline point fits inside
the radius remaining after Margin. Empty faces do not affect the plate size.

Logo depth applies independently inward from each populated face and is capped
at half the plate thickness. At that limit different inlays meet only where
their outlines overlap; other regions keep plate material. Empty faces remain
solid even at maximum depth. Turning off **Print logo** exports a solid base
with the same dimensions.

You can download a blank plate without uploading artwork. A failed import
blocks export until repaired or that face is deliberately set to Empty (or its
unused source is replaced by Same as Front). Imports and tracing continue on
their original source when you switch face controls; downloads wait for all
active sources and the current model. Failures are remembered across reloads.
Reloading during a retrace restores the last valid artwork. Successful uploads
collapse to a filename and **Replace** row, which still accepts dropped files.

The filament summary counts distinct colors across the plate and both faces;
matching colors share a filament. A warning above four colors helps you plan
for your printer's available slots. Downloads use the artwork filename when
available. **Start over** in the header clears both images and resets keychain
and printer settings after confirmation.

## Preparing artwork

Try the [curated example gallery](examples.md) for four small, reusable SVGs
with 3D screenshots, recommended settings, and manual regression checks.

For the cleanest geometry, use simple SVG artwork made from filled paths.

- Convert text to paths before uploading
- Convert visible strokes to filled outlines; mixed fills and strokes are rejected to avoid losing artwork
- Avoid gradients, filters, clip paths, masks, and embedded images
- Prefer logos with clear color regions and moderate path complexity
- A traced PNG works best for flat logos with a few solid colors; photos and gradients come out posterized. With an opaque background, white details touching the background are removed with it

## Import validation and limits

The SVG parser returns a structured success/error result. Unsupported text,
images, gradient/pattern fills, stylesheets, clipping, masks, filters, and unsupported
linked copies produce visible instructions instead of silently losing artwork.
Inline fills/styles, transforms, holes, white fills, and bounded local `xlink:href`
copies of paths or groups remain supported. Unused paint definitions are ignored.

The Import report shows parsed color/shape counts and conservative cleanup:
non-rendering metadata, titles and descriptions are removed from the parsing
copy, and simple inline fills, fill rules and opacity are normalized to attributes.
CSS priorities and mixed duplicate declarations stay intact. Unsupported artwork
is rejected with repair instructions before cleanup. The uploaded SVG stays
unchanged in the saved session; cleanup never flattens or discards visible artwork.

The shared budgets in `src/utils/svgValidation.ts` apply to uploads, raster-generated
SVGs, and restored sessions:

| Budget | Limit |
| --- | --- |
| SVG file size | 2 MiB |
| Elements, including expanded local references | 4,096 |
| Nesting depth | 64 |
| Paths or primitive shapes | 512 |
| Filled shapes after conversion/paint-order resolution | 512 |
| Tessellated outline points, including holes | 20,000 |
| Numeric values in path, point, and transform attributes | 40,000 |

Markup limits run before SVGLoader. Tessellation and shape limits run before
polygon clipping; resolved geometry is checked again, and the builder independently
checks its input before outline unions, extrusion, or CSG. Degenerate/nonfinite
geometry and filled bounds of 0.0000001 SVG units or less are rejected. Simplify
the source artwork or trace a smaller image with fewer colors when a limit is reached.

## Printability warnings

Above 500 outline points after refinement (including holes), advice beside
Simplify explains that updates may be slow and recommends increasing it.
The warning follows the artwork being edited, excludes unused sources, and
does not block building or export; the hard safety budgets above still apply.

Thin-area advice appears in a warning tooltip beside Thin areas. The warning icons
show their explanations on hover, keyboard focus, or tap. Every setting keeps a
short label; an info icon beside it explains what it does the same way.

The minimum printable width is two nozzle widths, or one with **Thin walls** on
(for slicers that print walls a single line wide, e.g. "Detect thin walls"). It
drives the thin-area overlay and the tiny-island check.
The Printer card applies to both faces, including when the selected face is Empty.

The base-thickness and keyring-wall messages are advisory: the base recommendation
is the larger of 1.2 mm or three nozzle widths, and the keyring-wall recommendation
is 2 mm. These strength guidelines do not block export of valid geometry.

Tiny logo islands are also flagged when their filled area (minus holes) is less
than a disc the minimum printable width across. This complements the raster thin-feature
overlay, which can miss very small pieces. The check uses the final refined logo
at its fitted print size, follows size/nozzle/cleanup changes, and does not block
export. Increase Width, merge colors, or use the warning's "remove them" link,
which sets Small bits to that width. Small bits is set as a width too: pieces and
holes with less area than a disc that wide are removed.

## Dimension validation

Configuration validation also runs independently of slider limits. Nonfinite,
negative, or impossible dimensions block model generation and export. Safe
padding, hole, bevel, and corner-radius adjustments keep the entered values in
the controls and show the effective values beside them; corner limits use the
actual fitted plate height. `validateConfig` returns structured field messages
and is also enforced for direct builder calls.
