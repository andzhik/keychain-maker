import * as THREE from 'three'
import { Brush, Evaluator, SUBTRACTION } from 'three-bvh-csg'
import type { ColorGroup, KeychainConfig } from '../types/keychain'
import type { Profiler } from './profiler'

// Draws the keyring loop onto the shape's top edge. Returns the circular keyring
// hole as a polygon path (caller decides whether to cut it as a flat shape hole
// or via CSG), or null when there's no room for the loop and we fall back to a
// solid semicircle. The hole is NOT pushed onto shape.holes here: when beveled,
// ExtrudeGeometry would bevel this small inner contour and the offset cap would
// self-intersect (see buildBasePlate), so it must be cut as a vertical prism.
function applyKeyring(shape: THREE.Shape, config: KeychainConfig, w: number, h: number, r: number): THREE.Path | null {
  const R = config.keyringRingDiameter / 2
  const maxFr = ((w - r) * (w - r) - R * R) / (2 * R)
  const fr = Math.min(R * 0.75, Math.max(0, maxFr))

  if (fr <= 0.01) {
    // Fallback: simple semicircle when no room for fillets
    shape.lineTo(R, h)
    shape.absarc(0, h, R, 0, Math.PI, false)
    shape.lineTo(-w + r, h)
    return null
  }

  const fx = Math.sqrt(R * R + 2 * R * fr)
  const ringStart = Math.atan2(fr, fx)
  const ringEnd = Math.PI - ringStart

  // Top edge to right fillet start
  shape.lineTo(fx, h)
  // Right concave fillet arc (clockwise)
  shape.absarc(fx, h + fr, fr, -Math.PI / 2, Math.atan2(-fr, -fx), true)
  // Ring arc over the top (counter-clockwise)
  shape.absarc(0, h, R, ringStart, ringEnd, false)
  // Left concave fillet arc (clockwise)
  shape.absarc(-fx, h + fr, fr, Math.atan2(-fr, fx), -Math.PI / 2, true)
  // Continue to top-left corner
  shape.lineTo(-w + r, h)

  // Keyring hole as an explicit polygon (matches the SVG hole paths, so the CSG
  // cutter prism stays light — getPoints() returns exactly these vertices).
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

// Clamp the requested edge bevel so the extrude depth (baseThickness - 2*bevel) stays positive.
function clampBevel(config: KeychainConfig): number {
  const maxBevel = config.baseThickness / 2 - 0.05
  return Math.max(0, Math.min(config.edgeBevel, maxBevel))
}

// Beveled outer-perimeter extrude (no SVG holes — those are cut later via CSG).
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

export function buildBasePlate(config: KeychainConfig, width: number, height: number, holes: THREE.Path[] = [], profiler?: Profiler): THREE.Mesh {
  const r = Math.min(config.cornerRadius, width / 2, height / 2)
  const w = width / 2
  const h = height / 2

  const shape = new THREE.Shape()

  // Bottom-left start, trace counterclockwise
  shape.moveTo(-w + r, -h)
  // Bottom edge
  shape.lineTo(w - r, -h)
  // Bottom-right corner
  shape.quadraticCurveTo(w, -h, w, -h + r)
  // Right edge
  shape.lineTo(w, h - r)
  // Top-right corner
  shape.quadraticCurveTo(w, h, w - r, h)

  let keyringHole: THREE.Path | null = null
  if (config.keyringEnabled) {
    keyringHole = applyKeyring(shape, config, w, h, r)
  }
  else {
    // Straight top edge
    shape.lineTo(-w + r, h)
  }
  // Top-left corner
  shape.quadraticCurveTo(-w, h, -w, h - r)
  // Left edge
  shape.lineTo(-w, -h + r)
  // Bottom-left corner
  shape.quadraticCurveTo(-w, -h, -w + r, -h)

  const bevel = clampBevel(config)
  const material = new THREE.MeshStandardMaterial({ color: config.baseColor })

  // No bevel: the extruder produces vertical walls everywhere, so the SVG
  // cutouts and the keyring hole can be cut directly as shape holes.
  if (bevel <= 0.01) {
    for (const hole of holes) shape.holes.push(hole)
    if (keyringHole) shape.holes.push(keyringHole)
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: config.baseThickness,
      bevelEnabled: false,
    })
    return new THREE.Mesh(geometry, material)
  }

  // Beveled: ExtrudeGeometry bevels every contour, so cutting holes as shape
  // holes would flare their walls. For the SVG cutouts that leaves a gap around
  // the logo; for the small keyring hole the offset bevel cap self-intersects
  // (worse as bevel grows toward the hole radius), producing a triangulated
  // artifact. So bevel only the outer perimeter, then subtract straight vertical
  // prisms for every cutout — SVG and keyring alike — via CSG.
  const baseGeometry = profiler
    ? profiler.measure('  bevel extrude', () => buildBeveledGeometry(shape, config, bevel))
    : buildBeveledGeometry(shape, config, bevel)

  const csgHoles = keyringHole ? [...holes, keyringHole] : holes
  if (csgHoles.length === 0) {
    return new THREE.Mesh(baseGeometry, material)
  }

  // The beveled plate spans Z [-bevel, baseThickness - bevel]; make the cutter
  // prisms over-tall so they pierce both faces for a clean subtraction.
  //
  // Subtract one prism at a time. Counterintuitively this is ~3x faster than
  // merging all cutters and subtracting once: three-bvh-csg handles many small
  // local boolean ops far better than one op against a high-triangle cutter.
  const evaluator = new Evaluator()
  let result = new Brush(baseGeometry)
  for (let i = 0; i < csgHoles.length; i++) {
    const hole = csgHoles[i]
    const cut = () => {
      const holeShape = new THREE.Shape(hole.getPoints())
      const prism = new THREE.ExtrudeGeometry(holeShape, {
        depth: config.baseThickness + 2,
        bevelEnabled: false,
      })
      prism.translate(0, 0, -bevel - 1)
      result = evaluator.evaluate(result, new Brush(prism), SUBTRACTION)
      prism.dispose()
    }
    if (profiler) profiler.measure(`  CSG subtract #${i + 1}/${csgHoles.length}`, cut)
    else cut()
  }

  return new THREE.Mesh(result.geometry, material)
}

export function buildLogoMeshes(groups: ColorGroup[], config: KeychainConfig): THREE.Mesh[] {
  // The beveled base plate spans Z [-bevel, baseThickness - bevel], so shift the
  // (un-beveled) logo down by the same amount to keep it flush with the base faces.
  const bevel = clampBevel(config)
  const meshes: THREE.Mesh[] = []
  for (const group of groups) {
    if (group.shapes.length === 0) continue
    const geometry = new THREE.ExtrudeGeometry(group.shapes, {
      depth: config.baseThickness,
      bevelEnabled: false,
    })
    if (bevel > 0) geometry.translate(0, 0, -bevel)
    const material = new THREE.MeshStandardMaterial({ color: group.color })
    meshes.push(new THREE.Mesh(geometry, material))
  }
  return meshes
}
