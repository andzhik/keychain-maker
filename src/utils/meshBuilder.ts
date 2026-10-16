import * as THREE from 'three'
import { Brush, Evaluator, SUBTRACTION } from 'three-bvh-csg'
import type { ColorGroup, KeychainConfig } from '../types/keychain'
import type { Profiler } from './profiler'

/**
 * Mesh build pipeline (keep this order in code and callers):
 * 1. base-plate outline spline
 * 2. optional keyring loop on outline + keyring hole path → shape.holes before extrude
 * 3. base extrude with bevel (keyring hole beveled inside; flat path uses shape.holes + islands for logo too)
 * 4. logo extrude — no bevel (`buildLogoMeshes`, caller)
 * 5. CSG subtract logo cutouts from beveled base (`cutoutBasePlateHoles`, caller)
 */

/** Step 1: outer base-plate outline (spline path). */
function buildBasePlateOutline(
  config: KeychainConfig,
  w: number,
  h: number,
  r: number,
): THREE.Shape {
  if (config.basePlateShape === 'circle') return buildCirclePlateOutline(config, Math.min(w, h))

  const shape = new THREE.Shape()

  shape.moveTo(-w + r, -h)
  shape.lineTo(w - r, -h)
  shape.quadraticCurveTo(w, -h, w, -h + r)
  shape.lineTo(w, h - r)
  shape.quadraticCurveTo(w, h, w - r, h)

  if (config.keyringEnabled) {
    drawKeyringOutline(shape, config, w, h, r)
  }
  else {
    shape.lineTo(-w + r, h)
  }

  shape.quadraticCurveTo(-w, h, -w, h - r)
  shape.lineTo(-w, -h + r)
  shape.quadraticCurveTo(-w, -h, -w + r, -h)

  return shape
}

/** Step 2 (outline): extends the top edge with the keyring loop splines. */
function drawKeyringOutline(
  shape: THREE.Shape,
  config: KeychainConfig,
  w: number,
  h: number,
  r: number,
): void {
  const R = config.keyringRingDiameter / 2
  const maxFr = ((w - r) * (w - r) - R * R) / (2 * R)
  const fr = Math.min(R * 0.75, Math.max(0, maxFr))

  if (fr <= 0.01) {
    shape.lineTo(R, h)
    shape.absarc(0, h, R, 0, Math.PI, false)
    shape.lineTo(-w + r, h)
    return
  }

  const fx = Math.sqrt(R * R + 2 * R * fr)
  const ringStart = Math.atan2(fr, fx)
  const ringEnd = Math.PI - ringStart

  shape.lineTo(fx, h)
  shape.absarc(fx, h + fr, fr, -Math.PI / 2, Math.atan2(-fr, -fx), true)
  shape.absarc(0, h, R, ringStart, ringEnd, false)
  shape.absarc(-fx, h + fr, fr, Math.atan2(-fr, fx), -Math.PI / 2, true)
  shape.lineTo(-w + r, h)
}

/**
 * Steps 1–2 for circle plates: a true circle of radius `p`, unioned with the
 * keyring loop (centred on the top of the circle) through two concave fillets.
 * The square-plate keyring code assumes a flat top edge, which a circle lacks.
 */
function buildCirclePlateOutline(config: KeychainConfig, p: number): THREE.Shape {
  const shape = new THREE.Shape()
  if (!config.keyringEnabled) {
    shape.absarc(0, 0, p, 0, Math.PI * 2, false)
    return shape
  }

  const R = config.keyringRingDiameter / 2
  // Fillet circle (radius f) tangent to the plate circle (0,0,p) and the ring
  // circle (0,p,R): its centre (cx, cy) is p+f from the origin and R+f from the
  // ring centre. With f = 0 the same formula gives the circles' intersection.
  const filletCenter = (f: number) => {
    const cy = (p * p + (p + f) * (p + f) - (R + f) * (R + f)) / (2 * p)
    return { cx: Math.sqrt((p + f) * (p + f) - cy * cy), cy }
  }
  let f = R * 0.75
  let { cx, cy } = filletCenter(f)
  if (!(cx > 0)) {
    f = 0
    ;({ cx, cy } = filletCenter(0))
  }

  // Tangent points on the plate circle and on the ring circle (right side).
  const plateAngle = Math.atan2(cy, cx)
  const ringAngle = Math.atan2(cy - p, cx)

  shape.absarc(0, 0, p, Math.PI - plateAngle, plateAngle, false)
  if (f > 0) shape.absarc(cx, cy, f, Math.atan2(-cy, -cx), Math.atan2(p - cy, -cx), true)
  shape.absarc(0, p, R, ringAngle, Math.PI - ringAngle, false)
  if (f > 0) shape.absarc(-cx, cy, f, Math.atan2(p - cy, cx), Math.atan2(-cy, cx), true)

  return shape
}

/** Step 2 (hole path): keyring hole pushed onto shape.holes before extrude so the inner edge bevels. */
function buildKeyringHolePath(config: KeychainConfig, h: number): THREE.Path {
  const hr = config.keyringHoleDiameter / 2
  const segs = 48
  const holePath = new THREE.Path()
  for (let i = 0; i <= segs; i++) {
    const a = (i / segs) * Math.PI * 2
    const x = Math.cos(a) * hr
    const y = h + Math.sin(a) * hr
    if (i === 0) holePath.moveTo(x, y)
    else holePath.lineTo(x, y)
  }
  return holePath
}

function clampBevel(config: KeychainConfig): number {
  const maxBevel = config.baseThickness / 2 - 0.05
  return Math.max(0, Math.min(config.edgeBevel, maxBevel))
}

/** Step 3: beveled base extrude (logo holes are CSG-cut in step 5; keyring hole is already in shape.holes). */
//
// bevelOffset is 0 (not -bevel): a negative offset insets the bevel and folds at
// the keyring loop's concave fillets — ExtrudeGeometry emits flipped cap triangles
// there, worse as bevel grows, which show as flat shards poking out of the loop
// edge. With offset 0 the top/bottom faces stay on the outline and the edge
// bulges outward by `bevel` instead, which is fold-free for every contour.
function buildBeveledGeometry(shape: THREE.Shape, config: KeychainConfig, bevel: number): THREE.ExtrudeGeometry {
  return new THREE.ExtrudeGeometry(shape, {
    depth: config.baseThickness - 2 * bevel,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelOffset: 0,
    bevelSegments: Math.max(1, Math.round(config.bevelSegments)),
  })
}

/** Steps 1–3: outline, optional keyring, base extrude (no logo CSG — that is step 5). */
export function buildBasePlate(
  config: KeychainConfig,
  width: number,
  height: number,
  logoCutouts: THREE.Shape[] = [],
  profiler?: Profiler,
): THREE.Mesh {
  const r = config.basePlateShape === 'circle'
    ? Math.min(width, height) / 2
    : Math.min(config.cornerRadius, width / 2, height / 2)
  const w = width / 2
  const h = height / 2

  const shape = buildBasePlateOutline(config, w, h, r)
  const keyringHole = config.keyringEnabled ? buildKeyringHolePath(config, h) : null

  const bevel = clampBevel(config)
  const material = new THREE.MeshStandardMaterial({ color: config.baseColor })

  if (keyringHole) shape.holes.push(keyringHole)

  if (bevel <= 0.01) {
    // Each cutout's outer contour becomes a plate hole; its own holes (the
    // counter of an "O") are re-filled as plate islands, matching what the CSG
    // path leaves behind.
    const islands: THREE.Shape[] = []
    for (const cutout of logoCutouts) {
      shape.holes.push(new THREE.Path(cutout.getPoints()))
      for (const inner of cutout.holes) islands.push(new THREE.Shape(inner.getPoints()))
    }
    const geometry = new THREE.ExtrudeGeometry(islands.length ? [shape, ...islands] : shape, {
      depth: config.baseThickness,
      bevelEnabled: false,
    })
    return new THREE.Mesh(geometry, material)
  }

  const baseGeometry = profiler
    ? profiler.measure('  bevel extrude', () => buildBeveledGeometry(shape, config, bevel))
    : buildBeveledGeometry(shape, config, bevel)

  return new THREE.Mesh(baseGeometry, material)
}

/**
 * Swaps the last two vertices of every triangle in a non-indexed geometry
 * (ExtrudeGeometry is never indexed), turning its faces back outward after a
 * mirroring transform. Normals are already mirrored correctly by applyMatrix4.
 */
function flipWinding(geometry: THREE.BufferGeometry): void {
  for (const attribute of Object.values(geometry.attributes) as THREE.BufferAttribute[]) {
    const { array, itemSize } = attribute
    for (let i = 0; i < attribute.count; i += 3) {
      for (let k = 0; k < itemSize; k++) {
        const a = (i + 1) * itemSize + k
        const b = (i + 2) * itemSize + k
        const t = array[a]
        array[a] = array[b]
        array[b] = t
      }
    }
    attribute.needsUpdate = true
  }
}

/**
 * Step 4: un-beveled logo extrude (positioned flush with the beveled base).
 * `transform` (SVG → plate space, may mirror) is baked into the geometry.
 */
export function buildLogoMeshes(
  groups: ColorGroup[],
  config: KeychainConfig,
  transform?: THREE.Matrix4,
): THREE.Mesh[] {
  const bevel = clampBevel(config)
  const meshes: THREE.Mesh[] = []
  for (const group of groups) {
    if (group.shapes.length === 0) continue
    const geometry = new THREE.ExtrudeGeometry(group.shapes, {
      depth: config.baseThickness,
      bevelEnabled: false,
    })
    if (bevel > 0) geometry.translate(0, 0, -bevel)
    if (transform) {
      geometry.applyMatrix4(transform)
      if (transform.determinant() < 0) flipWinding(geometry)
    }
    const material = new THREE.MeshStandardMaterial({ color: group.color })
    meshes.push(new THREE.Mesh(geometry, material))
  }
  return meshes
}

/** Step 5: subtract straight vertical logo cutout prisms from the beveled base (keyring hole is step 2–3). */
export function cutoutBasePlateHoles(
  basePlate: THREE.Mesh,
  logoCutouts: THREE.Shape[],
  config: KeychainConfig,
  profiler?: Profiler,
): void {
  const bevel = clampBevel(config)
  if (bevel <= 0.01 || logoCutouts.length === 0) return

  const baseGeometry = basePlate.geometry as THREE.ExtrudeGeometry
  const geometry = subtractCutoutHoles(baseGeometry, logoCutouts, config, bevel, profiler)
  basePlate.geometry.dispose()
  basePlate.geometry = geometry
}

function subtractCutoutHoles(
  baseGeometry: THREE.ExtrudeGeometry,
  cutouts: THREE.Shape[],
  config: KeychainConfig,
  bevel: number,
  profiler?: Profiler,
): THREE.BufferGeometry {
  const cut = () => {
    // All cutter prisms go into one geometry and are subtracted in a single
    // pass — far cheaper than one CSG evaluation per cutout. The cutouts are
    // disjoint (they come from the logo outline union), so the merged cutter
    // is a set of separate closed bodies. Each keeps its holes, so a logo
    // counter stays as plate material.
    const prisms = new THREE.ExtrudeGeometry(cutouts, {
      depth: config.baseThickness + 2,
      bevelEnabled: false,
    })
    prisms.translate(0, 0, -bevel - 1)
    const result = new Evaluator().evaluate(new Brush(baseGeometry), new Brush(prisms), SUBTRACTION)
    prisms.dispose()
    return result.geometry
  }
  return profiler
    ? profiler.measure(`  CSG subtract (${cutouts.length} cutouts)`, cut)
    : cut()
}
