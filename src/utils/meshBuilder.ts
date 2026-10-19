import * as THREE from 'three'
import { Brush, Evaluator, SUBTRACTION } from 'three-bvh-csg'
import { MeshBVH } from 'three-mesh-bvh'
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

// Segments per full turn when sampling outline arcs. ExtrudeGeometry's default
// (12 per curve, regardless of sweep) turns a full-circle plate into a 12-gon.
const ARC_SEGMENTS_PER_TURN = 128

/**
 * Appends an arc (same angle/direction semantics as `Path.absarc`) as straight
 * segments, with a count proportional to its sweep so big and small arcs are
 * equally smooth. Skips the start point if the path is already there.
 */
function arcTo(path: THREE.Path, cx: number, cy: number, radius: number, a0: number, a1: number, clockwise: boolean): void {
  const curve = new THREE.ArcCurve(cx, cy, radius, a0, a1, clockwise)
  const sweep = radius > 0 ? curve.getLength() / radius : 0
  const n = Math.max(2, Math.ceil((sweep / (Math.PI * 2)) * ARC_SEGMENTS_PER_TURN))
  const pts = curve.getPoints(n)
  if (path.curves.length === 0) path.moveTo(pts[0].x, pts[0].y)
  else if (pts[0].distanceTo(path.currentPoint) > 1e-6) path.lineTo(pts[0].x, pts[0].y)
  for (let i = 1; i < pts.length; i++) path.lineTo(pts[i].x, pts[i].y)
}

/**
 * Snaps the end of a path built by `arcTo` exactly onto its start. Arc
 * endpoints computed from different angles can miss by ~1e-15, and
 * ExtrudeGeometry only drops a closing point that is *exactly* equal to the
 * first — otherwise the zero-length edge left behind gets a garbage bevel
 * vector, which shows up as a notch in the beveled edge.
 */
function closeExactly(path: THREE.Path): void {
  const first = (path.curves[0] as THREE.LineCurve).v1
  const last = path.curves[path.curves.length - 1] as THREE.LineCurve
  if (last.v2.distanceTo(first) < 1e-6) last.v2.copy(first)
  path.currentPoint.copy(last.v2)
}

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
    arcTo(shape, 0, h, R, 0, Math.PI, false)
    shape.lineTo(-w + r, h)
    return
  }

  const fx = Math.sqrt(R * R + 2 * R * fr)
  const ringStart = Math.atan2(fr, fx)
  const ringEnd = Math.PI - ringStart

  shape.lineTo(fx, h)
  arcTo(shape, fx, h + fr, fr, -Math.PI / 2, Math.atan2(-fr, -fx), true)
  arcTo(shape, 0, h, R, ringStart, ringEnd, false)
  arcTo(shape, -fx, h + fr, fr, Math.atan2(-fr, fx), -Math.PI / 2, true)
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
    arcTo(shape, 0, 0, p, 0, Math.PI * 2, false)
    closeExactly(shape)
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

  arcTo(shape, 0, 0, p, Math.PI - plateAngle, plateAngle, false)
  if (f > 0) arcTo(shape, cx, cy, f, Math.atan2(-cy, -cx), Math.atan2(p - cy, -cx), true)
  arcTo(shape, 0, p, R, ringAngle, Math.PI - ringAngle, false)
  if (f > 0) arcTo(shape, -cx, cy, f, Math.atan2(p - cy, cx), Math.atan2(-cy, cx), true)
  closeExactly(shape)

  return shape
}

/** Step 2 (hole path): keyring hole pushed onto shape.holes before extrude so the inner edge bevels. */
function buildKeyringHolePath(config: KeychainConfig, h: number): THREE.Path {
  const hr = config.keyringHoleDiameter / 2
  const segs = 48
  const holePath = new THREE.Path()
  holePath.moveTo(hr, h)
  for (let i = 1; i < segs; i++) {
    const a = (i / segs) * Math.PI * 2
    holePath.lineTo(Math.cos(a) * hr, h + Math.sin(a) * hr)
  }
  // Close on the exact start point (see closeExactly).
  holePath.lineTo(hr, h)
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
    try {
      // CSG 0.0.17 still requests the deprecated maxLeafTris option. Supply
      // equivalent trees with the current spelling before Brush prepares them.
      for (const geometry of [baseGeometry, prisms]) {
        const useSharedArrayBuffer = typeof SharedArrayBuffer !== 'undefined'
        // CSG needs an explicit index even though an indirect BVH does not.
        if (!geometry.index) {
          const count = geometry.getAttribute('position').count
          const IndexArray = count > 65535 ? Uint32Array : Uint16Array
          const Buffer = useSharedArrayBuffer ? SharedArrayBuffer : ArrayBuffer
          const index = new IndexArray(new Buffer(count * IndexArray.BYTES_PER_ELEMENT) as ArrayBuffer)
          for (let i = 0; i < count; i++) index[i] = i
          geometry.setIndex(new THREE.BufferAttribute(index, 1))
        }
        geometry.boundsTree = new MeshBVH(geometry, {
          maxLeafSize: 3,
          indirect: true,
          useSharedArrayBuffer,
        })
      }
      const result = new Evaluator().evaluate(new Brush(baseGeometry), new Brush(prisms), SUBTRACTION)
      return result.geometry
    } finally {
      prisms.dispose()
    }
  }
  return profiler
    ? profiler.measure(`  CSG subtract (${cutouts.length} cutouts)`, cut)
    : cut()
}
