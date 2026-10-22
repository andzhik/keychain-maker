import { expect, test } from 'bun:test'
import * as THREE from 'three'
import { buildKeychainModel } from '../../src/domain/keychainModel'
import { disposeObject } from '../../src/three/sceneLifecycle'
import { DEFAULT_CONFIG, type ColorGroup, type KeychainArtwork } from '../../src/types/keychain'
import { buildBasePlate } from '../../src/utils/meshBuilder'
import { fitFaces } from '../../src/utils/logoFit'

const shape = (points: number[][]) => new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x, y)))
// Path-based asymmetric F, and a wide L with a different color and proportions.
const front: ColorGroup[] = [{ id: 'f', color: '#ff0000', pathCount: 1,
  shapes: [shape([[0, 0], [20, 0], [20, 5], [5, 5], [5, 10], [15, 10], [15, 15], [5, 15], [5, 30], [0, 30]])] }]
const back: ColorGroup[] = [{ id: 'l', color: '#0000ff', pathCount: 1,
  shapes: [shape([[0, 0], [5, 0], [5, 7], [40, 7], [40, 10], [0, 10]])] }]
const counter = shape([[0, 0], [20, 0], [20, 20], [0, 20]])
counter.holes.push(new THREE.Path(shape([[5, 5], [15, 5], [15, 15], [5, 15]]).getPoints()))
const letterO = [{ ...front[0], shapes: [counter] }]
const cfg = { ...DEFAULT_CONFIG, keyringEnabled: false }

function volume(geometry: THREE.BufferGeometry) {
  const p = geometry.getAttribute('position'), index = geometry.index
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3()
  let result = 0
  for (let i = 0; i < (index?.count ?? p.count); i += 3) {
    a.fromBufferAttribute(p, index ? index.getX(i) : i)
    b.fromBufferAttribute(p, index ? index.getX(i + 1) : i + 1)
    c.fromBufferAttribute(p, index ? index.getX(i + 2) : i + 2)
    result += a.dot(b.cross(c)) / 6
  }
  return result
}

function crossings(mesh: THREE.Mesh, x: number, y: number) {
  const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
  const ray = new THREE.Raycaster(new THREE.Vector3(x, y, 100), new THREE.Vector3(0, 0, -1))
  const zs = ray.intersectObject(new THREE.Mesh(mesh.geometry, material)).map(h => h.point.z).sort((a, b) => a - b)
  material.dispose()
  return zs.filter((z, i) => i === 0 || Math.abs(z - zs[i - 1]) > 1e-5)
}

test('shared rectangle uses the taller fitted face and both independent scales; circles use padded radii', () => {
  const fit = fitFaces(front, back, cfg)
  expect([fit.width, fit.height, fit.front.scale, fit.back.scale]).toEqual([50, 70, 2, 1])
  const round = fitFaces(front, back, { ...cfg, basePlateShape: 'circle' })
  expect(round.height).toBe(50)
  for (const [groups, f] of [[front, round.front], [back, round.back]] as const) {
    for (const p of groups[0].shapes[0].getPoints()) expect(p.distanceTo(f.center) * f.scale).toBeLessThanOrEqual(20 + 1e-8)
  }
})

for (const edgeBevel of [0, 0.005, 0.6]) {
  for (const [baseThickness, logoDepth] of [[5, 0.6], [1.2, 0.6], [0.8, 1]]) {
    for (const scenario of ['different', 'front-only', 'back-only', 'mirrored-same', 'counter'] as const) {
      test(`face volumes partition the plate: ${scenario}, bevel ${edgeBevel}, thickness ${baseThickness}`, () => {
        const artwork: KeychainArtwork = {
          front: { groups: scenario === 'back-only' ? [] : scenario === 'counter' ? letterO : front, mirror: false },
          back: { groups: scenario === 'front-only' ? [] : scenario === 'mirrored-same' ? front : back, mirror: false },
        }
        const config = { ...cfg, edgeBevel, baseThickness, logoDepth }
        const result = buildKeychainModel(artwork, config)
        expect(result.ok).toBe(true)
        if (!result.ok) return
        const { root, logoGroup } = result.model
        const meshes = [root.children[0], ...logoGroup!.children] as THREE.Mesh[]
        const fit = fitFaces(artwork.front.groups, artwork.back.groups, config)
        const plain = buildBasePlate(config, fit.width, fit.height)
        try {
          const total = meshes.reduce((sum, mesh) => sum + volume(mesh.geometry), 0)
          expect(Math.abs(total - volume(plain.geometry)) / volume(plain.geometry)).toBeLessThan(1e-6)
          // Every interior column is completely filled exactly once, including
          // overlaps, one-face-only regions and regions neither face occupies.
          for (let x = -22.37; x < 23; x += 4.13) for (let y = -fit.height / 2 + 3.27; y < fit.height / 2 - 3; y += 4.31) {
            const intervals: number[][] = []
            for (const mesh of meshes) {
              const zs = crossings(mesh, x, y)
              expect(zs.length % 2).toBe(0)
              for (let i = 0; i < zs.length; i += 2) intervals.push([zs[i], zs[i + 1]])
            }
            intervals.sort((a, b) => a[0] - b[0])
            const expected = crossings(plain, x, y)
            expect(intervals[0][0]).toBeCloseTo(expected[0], 5)
            for (let i = 1; i < intervals.length; i++) expect(intervals[i][0]).toBeCloseTo(intervals[i - 1][1], 5)
            expect(intervals.at(-1)![1]).toBeCloseTo(expected.at(-1)!, 5)
          }
        } finally { disposeObject(root); disposeObject(plain) }
      })
    }
  }
}

test('outside-view mirror toggles change only their own inlay and matching recess, with outward winding', () => {
  for (const face of ['front', 'back'] as const) {
    const artwork = { front: { groups: front, mirror: false }, back: { groups: back, mirror: false } }
    const original = buildKeychainModel(artwork, cfg)
    artwork[face].mirror = true
    const mirrored = buildKeychainModel(artwork, cfg)
    if (!original.ok || !mirrored.ok) throw new Error('build failed')
    try {
      const i = face === 'front' ? 0 : 1
      const otherA = (original.model.logoGroup!.children[1 - i] as THREE.Mesh).geometry
      const otherB = (mirrored.model.logoGroup!.children[1 - i] as THREE.Mesh).geometry
      expect(otherA.getAttribute('position').array).toEqual(otherB.getAttribute('position').array)
      const mesh = mirrored.model.logoGroup!.children[i] as THREE.Mesh
      expect(mesh.matrix.determinant()).toBeGreaterThan(0)
      const p = mesh.geometry.getAttribute('position'), n = mesh.geometry.getAttribute('normal')
      for (let j = 0; j < p.count; j += 3) {
        const a = new THREE.Vector3().fromBufferAttribute(p, j)
        const b = new THREE.Vector3().fromBufferAttribute(p, j + 1)
        const c = new THREE.Vector3().fromBufferAttribute(p, j + 2)
        const normal = new THREE.Triangle(a, b, c).getNormal(new THREE.Vector3())
        if (normal.lengthSq()) expect(normal.dot(new THREE.Vector3().fromBufferAttribute(n, j))).toBeGreaterThan(0)
      }
    } finally { disposeObject(original.model.root); disposeObject(mirrored.model.root) }
  }
})
