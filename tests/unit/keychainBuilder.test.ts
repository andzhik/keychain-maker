import { expect, test } from 'bun:test'
import * as THREE from 'three'
import { useKeychainBuilder } from '../../src/composables/useKeychainBuilder'
import { DEFAULT_CONFIG, type ColorGroup, type KeychainConfig } from '../../src/types/keychain'

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

  expect(dimensions.value.width).toBe(cfg.targetWidth)
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
