# User guide

[All documentation](README.md)

## What it makes

Keychain Maker takes a clean, filled SVG, separates its shapes by color, builds a beveled base plate with an optional keyring hole, and exports a slicer-ready `.3mf` file.

![SVG to 3D keychain to slicer preview](img/logo-steps.png)

## Controls and features

- Upload an SVG logo and preview it immediately in 3D
- Start with the basic controls; tick **Advanced options** in the header to see every setting (see [Basic and advanced options](#basic-and-advanced-options))
- Choose Front and Back artwork independently, reuse Front on Back, or set either face's image to None
- Mirror each populated face horizontally, with previews labeled as outside views with the keyring at the top
- Or upload a PNG, JPEG or WebP: it's traced into flat colors in the browser (choose whether to drop an opaque background; advanced options set the maximum number of printed colors, how much outlines are smoothed, how readily corners are rounded off, and whether nearly level edges are straightened)
- Preserve logo colors as separate printable materials, with overlapping shapes resolved in paint order
- Prepare the logo for printing: change, merge or remove colors, limit it to **Max colors**, remove small details below a size in mm, click shapes in the 2D preview to remove them, and see features too thin for your nozzle highlighted in red
- Toggle each face's red thin-area overlay from its inline or enlarged preview; those two views share the setting, while printability warnings stay visible
- **Simplify outlines** to a tolerance in mm (0.02 mm by default) to cut the model's polygon count, and compare the result against the original in an enlarged, zoomable 2D preview that opens in the right column, leaving both face editors usable
- Choose a square or circle base plate
- Tune the plate's width (diameter for a circle), thickness and color; advanced options add corner rounding, border, edge chamfer and edge roundness
- Set the inlay depth in mm on each face (0.6 mm by default), leaving the middle in the plate material to reduce filament changes and purging
- Add or remove the keyring loop, and set its hole and loop size
- Inspect the model with an interactive Three.js viewport
- Export a multi-color `.3mf` for modern slicers
- See actionable import errors and export readiness; failed imports clear the previous artwork, and downloads wait for the current model to finish building
- Configure the shared nozzle size and Single-line walls behavior in the Printer card
- Remember both images, artwork modes, mirror settings and refinements across reloads (browser localStorage)

## Front and Back artwork

Front and Back appear side by side on desktop, each with its own upload,
preview, colors and refinements. **Image: Own image** uses that face's own SVG or
traced raster. Back initially uses **Same as Front**, sharing Front's image,
colors and refinements while keeping an independent mirror setting. Its preview
is read-only; edit the visible Front controls to update both. Switching Back to
its own image and back again preserves its previous image and edits. **None**
leaves a solid face in the plate material; switching back restores the stored
artwork and refinements. **Reset edits** in a face's header undoes its color
changes, removed shapes and cleanup.

The narrower right column contains 3D inspection, downloads and the
**Keychain** settings (plate shape, size, thickness, color, edges, inlay depth
and keyring loop) plus, in advanced view, the **Printer** card. They apply to
both faces.

## Basic and advanced options

The app starts with the settings most keychains need. Tick **Advanced options**
in the header to show the rest; the choice is remembered in this browser and
**Start over** keeps it.

| Always shown | Advanced |
| --- | --- |
| Face: Image, upload, Remove background (pictures), preview, Thin areas, colors, Max colors | Face: tracing Colors, Smoothing, Corner rounding, Straighten edges; Mirror horizontally; Merge similar; Match Front/Back; Cleanup (Remove small details, Simplify outlines); import cleanup details |
| Keychain: Shape, Width or Diameter, Thickness, Plate color, Keyring loop | Keychain: Corner rounding, Border, Hole size, Loop size, Edge chamfer, Edge roundness, Inlay depth; Printer: Nozzle size, Single-line walls |

A hidden setting still appears when it matters: when it differs from its
default, when a warning or automatic adjustment refers to it (for example,
Inlay depth when it is limited by a thin plate), or, for tracing options, after
a trace fails. **Remove small details** is available only with **Advanced options** on;
its saved setting still applies when advanced options are off.

**Mirror horizontally** changes only that panel's face. The 2D preview shows
that face from outside, with the keyring at the top, matching the 3D model and
export. Fresh sessions leave Mirror off on both faces, so text reads normally
on each side. Older single-image saved sessions keep Back mirrored to preserve
their original orientation. Use **Front** and **Back** above the 3D view to
inspect either outside face; **Reset View** returns to the isometric view.

Each image is centered independently and keeps its aspect ratio. A rectangle
has the configured Width; each image fills the width remaining after Border on
both sides. The taller fitted image sets the shared plate height, including top
and bottom borders, so the shorter image has extra vertical space. A circle
keeps the configured diameter; each image's farthest outline point fits inside
the radius remaining after Border. Faces without an image do not affect the plate size.

Inlay depth applies independently inward from each populated face and is capped
at half the plate thickness. At that limit different inlays meet only where
their outlines overlap; other regions keep plate material. Faces set to None remain
solid even at maximum depth.

You can download a blank plate without uploading artwork, or by setting both
faces to None. A failed import
blocks export until repaired or that face is deliberately set to None (or its
unused source is replaced by Same as Front). Imports and tracing continue on
their original source while you edit the other face or change artwork modes.
Downloads wait for all active sources and the current model. Failures are remembered across reloads.
Reloading during a retrace restores the last valid artwork. Successful uploads
collapse to a filename and **Replace** row, which still accepts dropped files.

Blocking errors appear in red panels above the 3D preview, with the affected
source and an **Edit Front/Back artwork** button. A failed independent face
leaves the other face inspectable. **Partial preview** identifies omitted artwork;
its dimensions describe the displayed preview, and Download stays disabled until
all populated faces are valid. If both images together exceed the geometry budget,
Front stays visible while Back is omitted. Reduce detail on either image to recover.

The filament summary counts distinct colors across the plate and both faces;
matching colors share a filament. A warning above four colors helps you plan
for your printer's available slots. Downloads use the artwork filename when
available. **Start over** in the header clears both images and resets keychain
and printer settings after confirmation.

With independent Front and Back images, each color row offers **Match Front**
or **Match Back**. Choose a color from the other face (closest shades appear
first) to use the same exact filament color on both faces. Every source color
merged into that row is updated; the other face's artwork and edits stay intact.
**Shared with Front/Back** confirms a match. Matching is a saved color edit,
not a permanent link: later recolors remain independent. Use **Restore original
color** to undo it. Matching is an advanced option. Faces set to None and Back's **Same as Front** mode need no matching.

## Preparing artwork

Try the [curated example gallery](examples.md) for four small, reusable SVGs
with 3D screenshots, recommended settings, and manual regression checks.

For the cleanest geometry, use simple SVG artwork made from filled paths.

- Convert text to paths before uploading
- Convert visible strokes to filled outlines; mixed fills and strokes are rejected to avoid losing artwork
- Avoid gradients, filters, clip paths, masks, and embedded images
- Prefer logos with clear color regions and moderate path complexity
- A traced PNG works best for flat logos with a few solid colors; photos and gradients come out posterized. With an opaque background, white details touching the background are removed with it

**Remove background** starts enabled for each face's raster uploader. Turn it off
to keep the border-connected background as printed artwork. Each uploader keeps
its own choice while open. Changing trace options rebuilds the artwork; a failed
trace shows a source-specific error while keeping the valid opposite face visible.

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
The builder checks independent Front and Back geometry against a combined budget;
Back using **Same as Front** counts the shared source once. Complexity errors report
the measured count (or a lower bound for outline points) and the applicable limit.

## Printability warnings

Above 500 outline points after refinement (including holes), advice beside
Simplify outlines explains that updates may be slow and recommends increasing it. The
advice shows Simplify outlines even in basic view.
The warning follows the artwork being edited, excludes unused sources, and
does not block building or export; the hard safety budgets above still apply.

Amber warning panels identify filament capacity, small pieces,
slow artwork, and fragile plate/keyring settings near the relevant controls.
Warnings do not block Download. The icon beside **Thin areas** changes to an amber
warning triangle when thin areas are detected. Its tooltip shows the detected
count, minimum printable width, and overlay guidance,
including when the red overlay is turned off. Warning and information icons
show their explanations on hover, keyboard focus, or tap. Every setting keeps a
short label; an info icon beside it explains what it does the same way.

The minimum printable width is two nozzle widths, or one with **Single-line walls** on
(for slicers that print walls a single line wide, e.g. "Detect thin walls"). It
drives the thin-area overlay and the tiny-island check.
The Printer card applies to both faces, including when the selected face's image is None.

The base-thickness and keyring-wall messages are advisory: the base recommendation
is the larger of 1.2 mm or three nozzle widths, and the keyring-wall recommendation
is 2 mm. These strength guidelines do not block export of valid geometry.

Tiny logo islands are also flagged when their filled area (minus holes) is less
than a disc the minimum printable width across. This complements the raster thin-feature
overlay, which can miss very small pieces. The check uses the final refined logo
at its fitted print size, follows size/nozzle/cleanup changes, and does not block
export. Increase Width, merge colors, or use the warning's "remove them" link,
which sets Remove small details to that width. Remove small details is set as a width too: pieces and
holes with less area than a disc that wide are removed.

## Dimension validation

Configuration validation also runs independently of slider limits. Nonfinite,
negative, or impossible dimensions block model generation and export. Safe
padding, hole, bevel, and corner-radius adjustments keep the entered values in
the controls and show the effective values beside them; corner limits use the
actual fitted plate height. `validateConfig` returns structured field messages
and is also enforced for direct builder calls.
