import { expect, test } from 'bun:test'
import * as THREE from 'three'
import { buildKeychainModel } from '../../src/domain/keychainModel'
import { disposeObject } from '../../src/three/sceneLifecycle'
import { DEFAULT_CONFIG, type ColorGroup } from '../../src/types/keychain'
import { buildBasePlate } from '../../src/utils/meshBuilder'

function rectangle(x0: number, y0: number, x1: number, y1: number) {
  return new THREE.Shape([
    new THREE.Vector2(x0, y0), new THREE.Vector2(x1, y0),
    new THREE.Vector2(x1, y1), new THREE.Vector2(x0, y1),
  ])
}

// Adjacent colors and a counter, scaled to a 40 mm square on a 50 mm plate.
const left = rectangle(-10, -10, 0, 10)
left.holes.push(new THREE.Path(rectangle(-7, -3, -3, 3).getPoints()))
const groups: ColorGroup[] = [
  { id: '#ff0000', color: '#ff0000', shapes: [left], pathCount: 1 },
  { id: '#00ff00', color: '#00ff00', shapes: [rectangle(0, -10, 10, 10)], pathCount: 1 },
]

function crossings(mesh: THREE.Mesh, x: number, y: number): number[] {
  const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
  const probe = new THREE.Mesh(mesh.geometry, material)
  const ray = new THREE.Raycaster(new THREE.Vector3(x, y, 100), new THREE.Vector3(0, 0, -1))
  const zs = ray.intersectObject(probe).map(hit => hit.point.z).sort((a, b) => a - b)
  material.dispose()
  return zs.filter((z, i) => i === 0 || Math.abs(z - zs[i - 1]) > 1e-5)
}

function expectCrossings(mesh: THREE.Mesh, x: number, y: number, expected: number[]) {
  const actual = crossings(mesh, x, y)
  expect(actual).toHaveLength(expected.length)
  actual.forEach((z, i) => expect(z).toBeCloseTo(expected[i], 5))
}

function volume(geometry: THREE.BufferGeometry) {
  const positions = geometry.getAttribute('position')
  const index = geometry.index
  const vertices = index?.count ?? positions.count
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3()
  let result = 0
  for (let i = 0; i < vertices; i += 3) {
    a.fromBufferAttribute(positions, index ? index.getX(i) : i)
    b.fromBufferAttribute(positions, index ? index.getX(i + 1) : i + 1)
    c.fromBufferAttribute(positions, index ? index.getX(i + 2) : i + 2)
    result += a.dot(b.cross(c)) / 6
  }
  return result
}

for (const edgeBevel of [0, 0.005, 0.6]) {
  for (const [baseThickness, logoDepth] of [[5, 0.6], [5, 0.1], [1.2, 0.6], [0.8, 0.6], [5, 5]]) {
    test(`surface inlays exactly fill recesses: bevel ${edgeBevel}, thickness ${baseThickness}, depth ${logoDepth}`, () => {
      const config = { ...DEFAULT_CONFIG, edgeBevel, baseThickness, logoDepth }
      const built = buildKeychainModel(groups, config)
      expect(built.ok).toBe(true)
      if (!built.ok) return
      const { root, logoGroup, dimensions } = built.model
      const plate = root.children[0] as THREE.Mesh
      const bevel = Math.min(edgeBevel, baseThickness / 2 - 0.05)
      const bottom = bevel <= 0.01 ? 0 : -bevel
      const top = bottom + baseThickness
      const depth = Math.min(logoDepth, baseThickness / 2)
      const through = depth * 2 >= baseThickness
      try {
        expect(dimensions.depth).toBeCloseTo(baseThickness, 5)
        expect(logoGroup!.children).toHaveLength(2)
        for (const [i, x] of [-16, 12].entries()) {
          expectCrossings(plate, x, 1.7, through ? [] : [bottom + depth, top - depth])
          expectCrossings(logoGroup!.children[i] as THREE.Mesh, x, 1.7,
            through ? [bottom, top] : [bottom, bottom + depth, top - depth, top])
          expectCrossings(logoGroup!.children[1 - i] as THREE.Mesh, x, 1.7, [])
        }
        expectCrossings(plate, -10, 0.7, [bottom, top]) // Counter remains plate material.
        expectCrossings(logoGroup!.children[0] as THREE.Mesh, -10, 0.7, [])
        expectCrossings(plate, 23, 0.7, [bottom, top]) // Outside the logo.
        expectCrossings(plate, 0, 25, []) // Keyring is still a through-hole.

        // The partition has the same signed volume as the original plate.
        const plain = buildBasePlate(config, 50, 50)
        const expected = volume(plain.geometry)
        const actual = volume(plate.geometry) + logoGroup!.children.reduce((sum, mesh) => sum + volume((mesh as THREE.Mesh).geometry), 0)
        expect(Math.abs(actual - expected) / expected).toBeLessThan(1e-6)
        plain.geometry.dispose()
        ;(plain.material as THREE.Material).dispose()
      } finally {
        disposeObject(root)
      }
    })
  }
}
