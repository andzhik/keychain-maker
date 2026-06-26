import * as THREE from 'three'
import { Brush, Evaluator, SUBTRACTION } from 'three-bvh-csg'
import type { ColorGroup, KeychainConfig } from '../types/keychain'
import type { Profiler } from './profiler'

/** Step 1: outer base-plate outline (spline path). */
function buildBasePlateOutline(
  config: KeychainConfig,
  w: number,
  h: number,
  r: number,
): THREE.Shape {
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

/** Extends the top edge with the keyring loop splines. */
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
 * Circular keyring hole as an explicit polygon — matches the SVG hole paths so the
 * CSG cutter prism stays light. Not pushed onto shape.holes before bevel extrude:
 * ExtrudeGeometry would bevel this small inner contour and the offset cap would
 * self-intersect (worse as bevel grows toward the hole radius).
 */
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

// Step 3: beveled extrude (SVG/logo holes are cut later via CSG).
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

/** Step 5: subtract straight vertical cutout prisms (logo + keyring hole) from the beveled base. */
function subtractCutoutHoles(
  baseGeometry: THREE.ExtrudeGeometry,
  cutoutHoles: THREE.Path[],
  config: KeychainConfig,
  bevel: number,
  profiler?: Profiler,
): THREE.BufferGeometry {
  const evaluator = new Evaluator()
  let result = new Brush(baseGeometry)

  for (let i = 0; i < cutoutHoles.length; i++) {
    const hole = cutoutHoles[i]
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
    if (profiler) profiler.measure(`  CSG subtract #${i + 1}/${cutoutHoles.length}`, cut)
    else cut()
  }

  return result.geometry
}

export function buildBasePlate(
  config: KeychainConfig,
  width: number,
  height: number,
  logoHoles: THREE.Path[] = [],
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

  if (bevel <= 0.01) {
    for (const hole of logoHoles) shape.holes.push(hole)
    if (keyringHole) shape.holes.push(keyringHole)
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: config.baseThickness,
      bevelEnabled: false,
    })
    return new THREE.Mesh(geometry, material)
  }

  const baseGeometry = profiler
    ? profiler.measure('  bevel extrude', () => buildBeveledGeometry(shape, config, bevel))
    : buildBeveledGeometry(shape, config, bevel)

  const csgHoles = keyringHole ? [...logoHoles, keyringHole] : logoHoles
  if (csgHoles.length === 0) {
    return new THREE.Mesh(baseGeometry, material)
  }

  const geometry = subtractCutoutHoles(baseGeometry, csgHoles, config, bevel, profiler)
  return new THREE.Mesh(geometry, material)
}

// Step 4: un-beveled logo extrude (positioned flush with the beveled base in the caller).
export function buildLogoMeshes(groups: ColorGroup[], config: KeychainConfig): THREE.Mesh[] {
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
