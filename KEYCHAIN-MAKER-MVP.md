# Keychain Maker — MVP Specification

## Goal

Upload an SVG, preview it in 3D, download a multi-color `.3mf` file ready for slicing.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Bun |
| Build | Vite + `@vitejs/plugin-vue` |
| UI | Vue 3 (`<script setup>`, TypeScript) |
| 3D | Three.js (raw) |
| SVG parsing | `three/addons/loaders/SVGLoader.js` |
| 3MF ZIP | fflate |
| Styling | Tailwind CSS |

---

## Project Structure

```
keychain-maker/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── types/
│   │   └── keychain.ts
│   ├── components/
│   │   ├── SvgUploader.vue
│   │   ├── ThreeViewer.vue
│   │   ├── ControlPanel.vue
│   │   └── ExportButton.vue
│   ├── composables/
│   │   ├── useSvgParser.ts
│   │   ├── useKeychainBuilder.ts
│   │   └── useThreeScene.ts
│   └── utils/
│       ├── svgToShapes.ts
│       ├── meshBuilder.ts
│       └── threeMfWriter.ts
```

---

## Data Flow

```
SVG file
  → SVGLoader.parse()
  → Group paths by fill color (normalize to #RRGGBB, skip fill="none")
  → For each color group: ExtrudeGeometry
  → Build rounded-rect base plate + keyring hole (Shape.holes)
  → Render in Three.js scene
  → On export: merge geometry per color, write 3MF XML, ZIP with fflate, trigger download
```

---

## Type Definitions

```typescript
export interface ColorGroup {
  id: string;
  color: string;            // #RRGGBB
  shapes: THREE.Shape[];
  pathCount: number;
}

export interface KeychainConfig {
  baseThickness: number;
  cornerRadius: number;
  padding: number;
  extrusionHeight: number;
  keyringEnabled: boolean;
  keyringHoleDiameter: number;
  keyringRingDiameter: number;
  baseColor: string;
}
```

---

## Parameters

| Parameter | Control | Default | Range | Unit |
|---|---|---|---|---|
| Base thickness | Slider | 2 | 0.4–10 | mm |
| Corner radius | Slider | 3 | 0–20 | mm |
| Padding | Slider | 3 | 0–20 | mm |
| Logo extrusion height | Slider | 1.5 | 0.2–5 | mm |
| Keyring hole on/off | Toggle | On | — | — |
| Keyring hole diameter | Slider | 4 | 2–10 | mm |
| Keyring ring diameter | Slider | 8 | 4–15 | mm |
| Base plate color | Color picker | #FFFFFF | — | — |

Base shape is always a rounded rectangle, auto-sized from the SVG bounding box plus padding. Keyring hole is always top-center.

---

## UI Layout

```
┌──────────────────────────────────────────┐
│  Keychain Maker         [Upload SVG]     │
├─────────────┬────────────────────────────┤
│             │                            │
│  2D SVG     │      3D Viewport           │
│  preview    │      (OrbitControls)        │
│  (small)    │                            │
│             │                            │
│  Color list │                            │
│  (read-only │                            │
│   swatches) │                            │
│             │                            │
│  Controls   │                            │
│  (sliders)  │                            │
│             │                            │
│  [Download  │                            │
│   .3mf]     │                            │
│             │                            │
├─────────────┴────────────────────────────┤
│  Dimensions: W × H × D mm               │
└──────────────────────────────────────────┘
```

Left panel ~300px fixed. 3D viewport fills remaining space. Dark theme.

---

## SVG Parsing

- Use `SVGLoader.parse(svgString)`, iterate `svgData.paths`
- Use `SVGLoader.createShapes(path)` (not `path.toShapes()`)
- Skip paths with `fill="none"`
- Keep white fills (meaningful for keychains even if invisible in SVG)
- Normalize colors via `'#' + path.color.getHexString()`
- Show a UI note: "For best results, use flat SVGs without gradients, filters, clip-paths, or text elements."

---

## 3D Scene

- `PerspectiveCamera`, positioned to frame the model on load
- `OrbitControls` (rotate, pan, zoom)
- `DirectionalLight` + `AmbientLight`
- Each color group → `MeshStandardMaterial` with the SVG fill color
- Base plate → its own mesh with the user-chosen base color
- Keyring hole → `THREE.Path` hole added to base plate Shape before extrusion
- Y-flip for SVG coordinates: `group.scale.y *= -1`
- Center the keychain at the origin
- Debounce parameter changes (150ms) before geometry rebuild
- Dispose old geometries on rebuild

---

## 3MF Export

1. Merge all color-group meshes into one vertex/triangle buffer
2. Tag each triangle with `pid`/`p1` referencing its color's material index
3. Apply mesh world transforms to vertices (Y-up → Z-up coordinate swap)
4. Generate `3dmodel.model` XML with `<m:basematerials>` block
5. Package with `[Content_Types].xml` and `_rels/.rels` into a ZIP via `fflate`
6. Trigger browser download of the `.3mf` blob

### 3MF XML structure (`3dmodel.model`)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<model unit="millimeter"
       xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02"
       xmlns:m="http://schemas.microsoft.com/3dmanufacturing/material/2015/02">
  <resources>
    <m:basematerials id="1">
      <m:base name="Base - White" displaycolor="#FFFFFF" />
      <m:base name="Color 1 - Red" displaycolor="#FF0000" />
    </m:basematerials>
    <object id="2" type="model" pid="1" pindex="0">
      <mesh>
        <vertices>
          <vertex x="0" y="0" z="0" />
        </vertices>
        <triangles>
          <triangle v1="0" v2="1" v3="2" pid="1" p1="0" />
        </triangles>
      </mesh>
    </object>
  </resources>
  <build>
    <item objectid="2" />
  </build>
</model>
```

### Supporting files

`[Content_Types].xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" />
  <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml" />
</Types>
```

`_rels/.rels`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Target="/3D/3dmodel.model" Id="rel0"
    Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel" />
</Relationships>
```

### ZIP packaging

```typescript
import { zipSync, strToU8 } from 'fflate';

const files = {
  '[Content_Types].xml': strToU8(contentTypesXml),
  '_rels/.rels': strToU8(relsXml),
  '3D/3dmodel.model': strToU8(modelXml),
};
const zipped = zipSync(files);
const blob = new Blob([zipped], { type: 'application/vnd.ms-package.3dmanufacturing-3dmodel+xml' });
```

### Key implementation details

- Extract triangle data from `BufferGeometry` via `geometry.getAttribute('position')` and `geometry.getIndex()`
- Call `mesh.updateMatrixWorld()` and transform each vertex by `mesh.matrixWorld` before writing
- 3MF is Z-up; Three.js is Y-up — swap Y and Z axes when exporting
- `pindex` on `<object>` sets default material; `p1` on `<triangle>` overrides per-triangle
- Merge geometries per color group with `BufferGeometryUtils.mergeGeometries()` before export

---

## Geometry Construction

### Base plate (rounded rectangle)

```typescript
const shape = new THREE.Shape();
const w = width / 2, h = height / 2, r = cornerRadius;
shape.moveTo(-w + r, -h);
shape.lineTo(w - r, -h);
shape.quadraticCurveTo(w, -h, w, -h + r);
shape.lineTo(w, h - r);
shape.quadraticCurveTo(w, h, w - r, h);
shape.lineTo(-w + r, h);
shape.quadraticCurveTo(-w, h, -w, h - r);
shape.lineTo(-w, -h + r);
shape.quadraticCurveTo(-w, -h, -w + r, -h);

const geometry = new THREE.ExtrudeGeometry(shape, {
  depth: baseThickness,
  bevelEnabled: false,
});
```

### Keyring hole

Add as a `THREE.Path` hole in the base plate shape before extrusion:

```typescript
const holePath = new THREE.Path();
holePath.absarc(holeX, holeY, holeDiameter / 2, 0, Math.PI * 2, false);
baseShape.holes.push(holePath);
```

The reinforcement ring extends the base plate around the hole position.

### Logo extrusion

```typescript
const colorShapes = colorGroup.shapes;
const meshes = colorShapes.map(shape => {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: extrusionHeight,
    bevelEnabled: false,
  });
  return new THREE.Mesh(geo, material);
});
```

Position extruded logos on top of the base plate (translate Z by `baseThickness`).

---

## Error Handling

- Invalid/unparseable SVG → show error message, clear previous state
- SVG with 0 usable paths → "No filled paths found" message
- WebGL unavailable → fallback message
- 3MF export failure → catch and display error

---

## Implementation Order

1. **Project scaffold** — Vite + Vue + Tailwind + Three.js, empty shell with layout
2. **SVG upload + parse** — drag-and-drop, SVGLoader, display 2D preview + color list
3. **3D base plate** — rounded rectangle ExtrudeGeometry, render in ThreeViewer
4. **Logo extrusion** — extrude each color group, position on top of base plate
5. **Keyring hole** — add hole via Shape.holes, reinforcement ring geometry
6. **Parameter controls** — wire up sliders to reactive state, debounced rebuild
7. **3MF export** — threeMfWriter, download trigger
8. **Polish** — error states, camera fit-to-model, dark theme cleanup
