# Keychain Maker — Claude Code Prompts

> **How to use:** Feed each prompt to Claude Code one at a time. Always attach `KEYCHAIN-MAKER-MVP.md` as context with every prompt. Verify each step builds and runs before moving to the next.

---

## Step 1 — Project Scaffold

```
Reference the attached KEYCHAIN-MAKER-MVP.md for all specs.

Scaffold the project:
- Vite + Vue 3 (<script setup>, TypeScript) + Tailwind CSS + Three.js
- Use the exact folder structure from the spec
- Create stub/empty files for all components, composables, and utils
- tsconfig.json, vite.config.ts, package.json with all dependencies (three, fflate, @types/three)
- index.html entry point
- App.vue with the two-panel layout: fixed 300px left sidebar + flexible 3D viewport area
- Light theme (white/light gray background, dark text, subtle borders). Always use light theme — no dark mode, no theme switching.
- No functionality yet — just the skeleton

It should build and run with `bun install && bun run dev` showing the empty layout.
```

**Verify:** `bun run dev` serves a page with a clean light two-panel layout. No errors in console.

---

## Step 2a — SVG Upload (Drag & Drop + File Picker)

```
Reference the attached spec.

Implement SvgUploader.vue:
- Drag-and-drop zone + click-to-browse file input (accept .svg only)
- Read the file as text (FileReader / readAsText)
- Store the raw SVG string in a reactive ref that App.vue can access (emit or provide/inject)
- Show the uploaded SVG as a small 2D inline preview in the left panel (render it in an <img> tag via a data URI or blob URL)
- Show a UI note below the upload zone: "For best results, use flat SVGs without gradients, filters, clip-paths, or text elements."
- Style the drop zone to fit the light theme — dashed border, hover highlight

Don't parse the SVG with Three.js yet. Just upload, store the string, and show the 2D preview.
```

**Verify:** Drag an SVG onto the drop zone. It appears as a small preview image in the left panel.

---

## Step 2b — SVG Parsing + Color Extraction

```
Reference the attached spec.

Implement useSvgParser.ts and svgToShapes.ts:
- Take the raw SVG string from the uploader
- Use SVGLoader.parse(svgString) to parse it
- Iterate svgData.paths, use SVGLoader.createShapes(path) (NOT path.toShapes())
- Skip paths where fill is "none"
- Keep white fills — they're meaningful for keychains
- Normalize each fill color to #RRGGBB via '#' + path.color.getHexString()
- Group shapes by color into ColorGroup[] (matching the type definition from the spec)
- Return the color groups as reactive state

Implement the color swatch list in the left panel (ControlPanel.vue or a section in App.vue):
- Show each detected color as a small colored square + hex code + path count
- Read-only, no interaction needed

Handle errors:
- If SVGLoader fails to parse, show an error message and clear previous state
- If 0 usable paths are found, show "No filled paths found"
```

**Verify:** Upload a multi-color SVG. The color list shows each unique fill color with its hex code and path count. Upload an empty/broken SVG and confirm error messages appear.

---

## Step 3a — Three.js Scene Setup

```
Reference the attached spec.

Implement useThreeScene.ts and wire it into ThreeViewer.vue:
- Create a PerspectiveCamera, WebGLRenderer (antialias), and a Scene
- Add DirectionalLight + AmbientLight
- Add OrbitControls (rotate, pan, zoom)
- Mount the renderer's canvas into the ThreeViewer component's container div
- Handle window/container resize (update camera aspect + renderer size)
- Use requestAnimationFrame loop for rendering
- Light background for the 3D viewport (e.g. #f0f0f0 or similar light gray)
- WebGL unavailable → show a fallback message instead of the canvas

Dispose renderer, controls, and animation frame on component unmount.
No meshes yet — just an empty lit scene with orbit controls.
```

**Verify:** The right panel shows a light 3D viewport. You can click and drag to orbit. No errors on resize or unmount.

---

## Step 3b — Base Plate Geometry

```
Reference the attached spec (see "Geometry Construction — Base plate" section).

Implement the base plate in meshBuilder.ts and useKeychainBuilder.ts:
- Create a rounded rectangle Shape using the exact approach from the spec (moveTo, lineTo, quadraticCurveTo pattern)
- Extrude it with ExtrudeGeometry (depth = baseThickness, bevelEnabled = false)
- Use default parameter values from the spec: baseThickness=2, cornerRadius=3, padding=3
- The base plate size should auto-calculate from the SVG bounding box + padding. For now, if no SVG is loaded, use a placeholder size (e.g. 40×30mm)
- Apply a MeshStandardMaterial with the default base color (#FFFFFF)
- Add the mesh to the scene
- Center it at the origin
- Position the camera to frame the model

When the SVG changes or parameters change, dispose old geometry and rebuild.
```

**Verify:** A white rounded rectangle slab appears in the 3D viewport. You can orbit around it.

---

## Step 4 — Logo Flush Inlays

```
Reference the attached spec.

Create flush inlays for the SVG color groups in the base plate:
- For each ColorGroup, add its outer contours as holes to the base plate Shape before extrusion (so the base plate has cutouts where the inlays go)
- Extrude each ColorGroup's shapes with ExtrudeGeometry (depth = baseThickness, bevelEnabled: false) — same depth as the base plate
- Apply MeshStandardMaterial with the group's fill color
- IMPORTANT: Flip Y axis for SVG coordinates (SVG Y goes down, Three.js Y goes up). Apply scale.y = -1 on the SVG group or invert Y on the shapes.
- Center the SVG artwork on the base plate (compute the SVG bounding box, offset so it's centered)
- Position inlay meshes at z=0 (flush with the base plate — same height, filling the cutouts)
- Auto-size the base plate from the SVG bounding box + padding (replace the placeholder size from step 3b)

Dispose and rebuild all meshes when the SVG or any parameter changes. Use a debounce (150ms) before rebuilding geometry on parameter changes.
```

Also add a "Show logo" checkbox in the Parameters section of ControlPanel.vue:
- Prop `showLogo: boolean` (default `true`) passed from App.vue via `v-model:showLogo`
- When unchecked, the logo group's `.visible` is set to `false` in Three.js (only the base plate with cutouts shows)
- Implement by exposing a `setLogoVisible(visible: boolean)` method from `useKeychainBuilder`, and watching the prop in `ThreeViewer.vue` to call it

**Verify:** Upload a multi-color SVG. The colored inlay shapes are flush with the white base plate (same z-height). Colors match the SVG. The base plate auto-sizes to fit the artwork. Unchecking "Show logo" hides the inlays; the base plate with cutouts remains visible.

---

## Step 5a — Keyring Hole

```
Reference the attached spec.

Add the keyring hole to the base plate:
- When keyringEnabled is true (default), add a circular hole at top-center of the base plate
- Implement as a THREE.Path hole added to the base plate Shape BEFORE extrusion (see spec's "Keyring hole" section)
- The hole center should be positioned at the top edge of the base plate
- Use default parameters: holeDiameter=4mm, ringDiameter=8mm
- The reinforcement ring: extend the base plate shape upward around the hole position so there's solid material surrounding the hole. The ring outer edge should be a circle of radius ringDiameter/2, blended into the top of the rounded rectangle.

When keyringEnabled is toggled off, rebuild without the hole or ring extension.
```

**Verify:** The base plate has a circular hole at the top with a reinforcement ring around it. Toggling the keyring off removes it.

---

## Step 5b — Refine Keyring Ring Geometry

```
If the reinforcement ring from step 5a doesn't look right (common issue: it may appear as a disconnected circle or have artifacts), refine it:

- The reinforcement ring should smoothly extend the base plate's top edge upward into a rounded tab that contains the hole
- One approach: create the base plate shape as a union of the rounded rectangle + a circle centered at the hole position with radius = ringDiameter/2. Then subtract the hole.
- Make sure the ring seamlessly connects to the base plate — no gaps, no overlaps
- The overall base plate height (for bounding box / dimension display) should include the ring extension

Test with different padding and ring diameter values to make sure it looks correct across the parameter range.
```

**Verify:** The keyring tab looks like a natural extension of the base plate — a smooth tab protruding from the top with a hole through it.

---

## Step 6 — Parameter Controls UI

```
Reference the spec's Parameters table.

Implement ControlPanel.vue with all parameter controls:
- Base thickness: slider, default 2, range 0.4–10, unit mm
- Corner radius: slider, default 3, range 0–20, unit mm
- Padding: slider, default 3, range 0–20, unit mm
- Keyring hole on/off: toggle switch, default on
- Keyring hole diameter: slider, default 4, range 2–10, unit mm (disabled/hidden when keyring is off)
- Keyring ring diameter: slider, default 8, range 4–15, unit mm (disabled/hidden when keyring is off)
- Base plate color: color picker input, default #FFFFFF
- Show logo: checkbox, default checked — toggles visibility of the SVG inlay meshes without rebuilding geometry

Each slider should show its current value + unit label.
All parameter changes should be reactive (via a shared KeychainConfig reactive object).
The 3D scene should rebuild (debounced 150ms) when any parameter changes.
Style everything for the light theme — sliders, labels, toggles, color picker. No dark mode.

Add a dimensions readout at the bottom of the page (or bottom of sidebar): "Dimensions: W × H × D mm" computed from the actual mesh bounding box.
```

**Verify:** Every slider updates the 3D model after a short debounce. Dimensions readout updates. The keyring controls hide when the toggle is off. Color picker changes the base plate color.

---

## Step 7a — 3MF Writer (XML Generation)

```
Reference the spec's "3MF Export" section carefully — follow the XML structure exactly.

Implement threeMfWriter.ts — the function that takes the scene meshes and produces a .3mf file:

FIRST, implement just the XML generation (no ZIP yet, no download):
- Accept an array of meshes with their associated color hex strings
- For each mesh: call mesh.updateMatrixWorld(), get position and index attributes from the BufferGeometry, transform each vertex by mesh.matrixWorld
- CRITICAL: 3MF is Z-up, Three.js is Y-up. Swap Y and Z axes when writing vertices.
- Merge geometries per color group using BufferGeometryUtils.mergeGeometries()
- Build the <m:basematerials> block with one <m:base> per color (base plate color first, then SVG colors)
- Build the <vertices> and <triangles> blocks. Each triangle gets pid="1" and p1 referencing its color's material index.
- Use pindex on <object> for the default material, p1 on <triangle> to override per-triangle
- Generate the full 3dmodel.model XML string matching the spec's template exactly
- Also generate [Content_Types].xml and _rels/.rels exactly as shown in the spec

Write a quick test: log the generated XML to the console for inspection. Make sure vertex coordinates look reasonable (in millimeters, Z-up).
```

**Verify:** Console-log the generated XML after uploading an SVG. Check that vertices have swapped Y/Z, material colors are listed, and triangle indices reference the correct material.

---

## Step 7b — 3MF ZIP Packaging + Download

```
Reference the spec's "ZIP packaging" section.

Complete the 3MF export pipeline:
- Use fflate's zipSync and strToU8 to package the three XML files into a ZIP:
  - [Content_Types].xml
  - _rels/.rels
  - 3D/3dmodel.model
- Create a Blob with type 'application/vnd.ms-package.3dmanufacturing-3dmodel+xml'
- Trigger a browser download with filename "keychain.3mf"

Implement ExportButton.vue:
- A prominent "Download .3mf" button in the left panel
- Disabled when no SVG is loaded
- On click, run the export and trigger the download
- Show a brief loading state during export
- Catch and display any export errors

Remove the console.log from step 7a.
```

**Verify:** Upload an SVG, click Download .3mf. Open the file in PrusaSlicer or BambuStudio. It should load with the correct shape and each color as a separate material/extruder. If you don't have a slicer, at minimum unzip the .3mf and inspect the XML files manually.

---

## Step 8 — Polish & Error Handling

```
Reference the spec's Error Handling section and UI Layout.

Final polish pass:
1. Camera fit-to-model: after any geometry rebuild, reposition the camera to frame the entire keychain nicely (compute bounding box, set camera distance accordingly)
2. Error states: make sure all these work gracefully:
   - Upload an invalid file (not SVG) → clear error message
   - Upload SVG with no filled paths → "No filled paths found" message
   - WebGL not available → fallback message in the viewport area
   - 3MF export failure → error toast/message
3. Light theme cleanup: make sure all elements (drop zone, sliders, buttons, swatches, text) look cohesive with a clean light theme. No dark mode, no theme switching. Consistent spacing, font sizes, border colors.
4. Upload a new SVG should cleanly replace the old one — dispose all old meshes, reset preview
5. The header bar should show "Keychain Maker" on the left and the [Upload SVG] button on the right (matching the spec layout)
6. Make sure the dimensions readout at the bottom updates correctly and shows reasonable mm values
7. Add a subtle grid or ground plane in the 3D scene for spatial reference (optional but nice)

Do a final check: the full flow should work — upload SVG → see 3D preview → adjust parameters → download .3mf.
```

**Verify:** Complete end-to-end flow with 2–3 different SVGs. Try edge cases (very small SVG, SVG with only white fills, SVG with many colors). All parameter sliders work. Export opens in a slicer. No console errors.

---

## Troubleshooting Prompts

If things go wrong at any step, here are targeted fix prompts:

### SVG shapes are mirrored or upside down
```
The SVG artwork appears mirrored/flipped in the 3D view. SVG coordinate system has Y increasing downward, Three.js has Y increasing upward. Make sure we apply scale.y = -1 to the SVG group, and that the centering logic accounts for this flip. Check that the bounding box calculation happens AFTER the flip.
```

### Inlay shapes are misaligned or not flush with the base plate
```
The SVG inlay meshes should be flush with the base plate — same z-position (z=0) and same extrusion depth (baseThickness). The base plate must have matching cutouts: add each SVG shape's outer contour as a hole to the base plate Shape before extrusion. If inlays appear above/below the base, check that both the base plate and inlay meshes use depth=baseThickness and start at z=0. Make sure we're consistent about which axis is "up" — in our scene, Z should be up if we're matching 3MF conventions, or Y up if matching Three.js conventions. Pick one and be consistent.
```

### 3MF file won't open in slicer
```
The .3mf file fails to open in PrusaSlicer/BambuStudio. Common issues:
1. Check the ZIP structure — it must have [Content_Types].xml at the root, _rels/.rels, and 3D/3dmodel.model
2. Check XML encoding — must be UTF-8, no BOM
3. Check that vertex coordinates are in millimeters and use Z-up (Y and Z swapped from Three.js)
4. Check that triangle vertex indices (v1, v2, v3) are valid — they must reference existing vertices, 0-indexed
5. Check that pid references on triangles match the basematerials id
6. Make sure there are no NaN or Infinity values in vertex coordinates
7. Unzip the .3mf and paste the 3dmodel.model XML here so I can inspect it.
```

### Colors are wrong in slicer
```
The 3MF opens in the slicer but colors are wrong or everything is one color. Check:
1. Each triangle's p1 attribute must correctly index into the basematerials list (0-indexed)
2. The basematerials displaycolor values should be #RRGGBB format
3. Make sure we're tracking which triangles belong to which color group when merging geometries — don't lose the color association during merge
4. Verify pindex on the <object> tag and p1 on each <triangle> are set correctly
```

### Keyring hole doesn't appear or geometry is broken
```
The keyring hole isn't cutting through the base plate, or the geometry has artifacts. The hole must be added as a THREE.Path to baseShape.holes BEFORE calling ExtrudeGeometry. Make sure:
1. The hole path is created with absarc (full circle, 0 to Math.PI * 2)
2. The hole is positioned relative to the shape's local coordinates (not world coordinates)
3. The hole diameter is smaller than the ring diameter
4. The reinforcement ring extension is part of the outer shape, not a separate mesh
```
