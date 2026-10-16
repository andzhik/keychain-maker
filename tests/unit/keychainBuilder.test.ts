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
