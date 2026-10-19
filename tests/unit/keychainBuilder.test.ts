import { expect, spyOn, test } from 'bun:test'
import * as THREE from 'three'
import { useKeychainBuilder } from '../../src/composables/useKeychainBuilder'
import { DEFAULT_CONFIG, type ColorGroup, type KeychainConfig } from '../../src/types/keychain'
import { SVG_LIMITS } from '../../src/utils/svgValidation'

function config(overrides: Partial<KeychainConfig> = {}): KeychainConfig {
  return { ...DEFAULT_CONFIG, keyringEnabled: false, ...overrides }
}

// An "O": a 20-unit disc with a 10-unit counter. With the default 50 mm target
// width and 5 mm padding it is scaled ×2, so the counter has radius 10 mm.
function letterO(): ColorGroup {
  const shape = new THREE.Shape().absarc(0, 0, 10, 0, Math.PI * 2, false)
  shape.holes.push(new THREE.Path().absarc(0, 0, 5, 0, Math.PI * 2, true))
  return { id: '#ff0000', color: '#ff0000', shapes: [shape], pathCount: 1 }
}

test('over-budget direct builder calls clear the previous model before any outline or CSG work', () => {
  const scene = new THREE.Scene()
  const builder = useKeychainBuilder(() => scene)
  builder.build([letterO()], config({ edgeBevel: 0 }))
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  for (let i = 0; i <= SVG_LIMITS.points; i++) shape.lineTo(i, i % 2)
  const extract = spyOn(shape, 'extractPoints').mockImplementation(() => { throw new Error('must reject before tessellation') })
  try {
    for (const group of [
      { ...letterO(), pathCount: SVG_LIMITS.paths + 1 },
      { ...letterO(), shapes: Array.from({ length: SVG_LIMITS.shapes + 1 }, () => shape) },
      { ...letterO(), shapes: [shape] },
    ]) {
      expect(builder.build([group], config())).toBeNull()
      expect(builder.buildError.value?.code).toBe('TOO_COMPLEX')
      expect(scene.children).toHaveLength(0)
      expect(builder.dimensions.value.width).toBe(0)
    }
    expect(extract).not.toHaveBeenCalled()
  } finally {
    extract.mockRestore()
  }
})

test('invalid direct builder settings remove stale geometry before generating meshes', () => {
  const scene = new THREE.Scene()
  const builder = useKeychainBuilder(() => scene)
  builder.build([letterO()], config())
  expect(builder.build([letterO()], config({ baseThickness: -1 }))).toBeNull()
  expect(builder.buildError.value?.code).toBe('OUT_OF_RANGE')
  expect(scene.children).toHaveLength(0)
  expect(builder.dimensions.value.width).toBe(0)
})

test('a beveled build does not emit dependency deprecation warnings', () => {
  const warn = spyOn(console, 'warn').mockImplementation(() => {})
  try {
    useKeychainBuilder(() => new THREE.Scene()).build([letterO()], config())
    expect(warn).not.toHaveBeenCalled()
  } finally {
    warn.mockRestore()
  }
})

function hitsFromAbove(geometry: THREE.BufferGeometry, x: number, y: number): number {
  const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }))
  const ray = new THREE.Raycaster(new THREE.Vector3(x, y, 100), new THREE.Vector3(0, 0, -1))
  return ray.intersectObject(mesh).length
}

for (const edgeBevel of [0.6, 0]) {
  test(`logo counters stay as plate material (bevel ${edgeBevel})`, () => {
    const { build } = useKeychainBuilder(() => new THREE.Scene())
    const root = build([letterO()], config({ edgeBevel }))!
    const basePlate = root.children[0] as THREE.Mesh

    // Inside the counter: the plate is solid (top + bottom faces).
    expect(hitsFromAbove(basePlate.geometry, 0, 0)).toBeGreaterThan(0)
    // On the letter's stroke: the plate is cut away for the inlay.
    expect(hitsFromAbove(basePlate.geometry, 15, 0)).toBe(0)
  })
}

test('a hidden logo stays hidden across rebuilds', () => {
  const { build, setLogoVisible } = useKeychainBuilder(() => new THREE.Scene())
  build([letterO()], config())
  setLogoVisible(false)

  const root = build([letterO()], config({ baseThickness: 3 }))!
  const logoGroup = root.children[1]

  expect(logoGroup.visible).toBe(false)
})

test('a square logo fits inside a circle plate', () => {
  const square = new THREE.Shape()
  square.moveTo(0, 0)
  square.lineTo(20, 0)
  square.lineTo(20, 20)
  square.lineTo(0, 20)
  square.lineTo(0, 0)
  const group: ColorGroup = { id: '#ff0000', color: '#ff0000', shapes: [square], pathCount: 1 }
  const cfg = config({ basePlateShape: 'circle' })

  const { build, dimensions } = useKeychainBuilder(() => new THREE.Scene())
  const root = build([group], cfg)!
  const logo = root.children[1].children[0] as THREE.Mesh
  logo.geometry.computeBoundingSphere()

  expect(dimensions.value.width).toBeCloseTo(cfg.targetWidth + 2 * cfg.edgeBevel, 1)
  const position = logo.geometry.getAttribute('position')
  const maxRadius = cfg.targetWidth / 2 - cfg.padding
  for (let i = 0; i < position.count; i++) {
    expect(Math.hypot(position.getX(i), position.getY(i))).toBeLessThanOrEqual(maxRadius + 1e-6)
  }
})

test('logo geometry is Y-flipped without a mirrored node transform', () => {
  const { build } = useKeychainBuilder(() => new THREE.Scene())
  const root = build([letterO()], config())!
  const logoGroup = root.children[1]
  const logo = logoGroup.children[0] as THREE.Mesh
  logo.updateMatrixWorld(true)

  expect(logoGroup.matrix.determinant()).toBeGreaterThan(0)
  expect(logo.matrix.determinant()).toBeGreaterThan(0)

  // Every triangle's winding still agrees with its (outward) vertex normal.
  const position = logo.geometry.getAttribute('position')
  const normal = logo.geometry.getAttribute('normal')
  const [a, b, c, n] = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]
  for (let i = 0; i < position.count; i += 3) {
    a.fromBufferAttribute(position, i)
    b.fromBufferAttribute(position, i + 1)
    c.fromBufferAttribute(position, i + 2)
    const face = new THREE.Triangle(a, b, c).getNormal(new THREE.Vector3())
    if (face.lengthSq() === 0) continue
    n.fromBufferAttribute(normal, i)
    expect(face.dot(n)).toBeGreaterThan(0)
  }
})

for (const basePlateShape of ['square', 'circle'] as const) {
  test(`out-of-range padding still builds a finite ${basePlateShape} plate`, () => {
    const { build, dimensions } = useKeychainBuilder(() => new THREE.Scene())
    const root = build([letterO()], config({ basePlateShape, targetWidth: 20, padding: 20 }))!
    const basePlate = root.children[0] as THREE.Mesh
    basePlate.geometry.computeBoundingBox()

    expect(Number.isFinite(dimensions.value.height)).toBe(true)
    expect(dimensions.value.height).toBeGreaterThan(0)
    const { min, max } = basePlate.geometry.boundingBox!
    for (const v of [min.x, min.y, max.x, max.y]) expect(Number.isFinite(v)).toBe(true)
  })
}

test('a zero-width logo builds the plain plate instead of Infinity geometry', () => {
  const line = new THREE.Shape()
  line.moveTo(0, 0)
  line.lineTo(0, 10)
  line.lineTo(0, 20)
  const group: ColorGroup = { id: '#ff0000', color: '#ff0000', shapes: [line], pathCount: 1 }

  const { build, dimensions } = useKeychainBuilder(() => new THREE.Scene())
  build([group], config())

  expect(dimensions.value.width).toBeCloseTo(DEFAULT_CONFIG.targetWidth + 2 * DEFAULT_CONFIG.edgeBevel, 1)
  expect(Number.isFinite(dimensions.value.height)).toBe(true)
})

for (const edgeBevel of [0.6, 0]) {
  test(`dimensions include the outward bevel (bevel ${edgeBevel})`, () => {
    const { build, dimensions } = useKeychainBuilder(() => new THREE.Scene())
    build([letterO()], config({ basePlateShape: 'circle', edgeBevel }))

    // The bevel bulges the outline outward by `edgeBevel` on every side.
    expect(dimensions.value.width).toBeCloseTo(DEFAULT_CONFIG.targetWidth + 2 * edgeBevel, 1)
    expect(dimensions.value.height).toBeCloseTo(DEFAULT_CONFIG.targetWidth + 2 * edgeBevel, 1)
    expect(dimensions.value.depth).toBeCloseTo(DEFAULT_CONFIG.baseThickness, 5)
  })
}

test('several logo parts are all cut out of the beveled plate', () => {
  const square = (x: number) => {
    const shape = new THREE.Shape()
    shape.moveTo(x, 0)
    shape.lineTo(x + 4, 0)
    shape.lineTo(x + 4, 4)
    shape.lineTo(x, 4)
    return shape
  }
  // Two overlapping squares of different colors plus a separate one.
  const groups: ColorGroup[] = [
    { id: '#ff0000', color: '#ff0000', shapes: [square(0), square(16)], pathCount: 2 },
    { id: '#00ff00', color: '#00ff00', shapes: [square(2)], pathCount: 1 },
  ]
  const { build } = useKeychainBuilder(() => new THREE.Scene())
  const root = build(groups, config())!
  const basePlate = root.children[0] as THREE.Mesh

  // The logo spans x 0..20, scaled ×2 to -20..20 mm: red -20..-12, green
  // -16..-8 (overlapping it) and red 12..20; x = 0 lies between the parts.
  expect(hitsFromAbove(basePlate.geometry, -18, 0)).toBe(0)
  expect(hitsFromAbove(basePlate.geometry, -14, 0)).toBe(0)
  expect(hitsFromAbove(basePlate.geometry, 18, 0)).toBe(0)
  expect(hitsFromAbove(basePlate.geometry, 0, 0)).toBeGreaterThan(0)
})
