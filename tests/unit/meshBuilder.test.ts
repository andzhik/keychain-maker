import { expect, test } from 'bun:test'
import * as THREE from 'three'
import { buildBasePlate, buildLogoMeshes } from '../../src/utils/meshBuilder'
import { DEFAULT_CONFIG, type ColorGroup, type KeychainConfig } from '../../src/types/keychain'

function config(overrides: Partial<KeychainConfig> = {}): KeychainConfig {
  return { ...DEFAULT_CONFIG, ...overrides }
}

function rectangleShape(width = 10, height = 6): THREE.Shape {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.lineTo(width, 0)
  shape.lineTo(width, height)
  shape.lineTo(0, height)
  shape.lineTo(0, 0)
  return shape
}

function ringShape(outer = 10, inner = 5): THREE.Shape {
  const shape = new THREE.Shape().absarc(0, 0, outer, 0, Math.PI * 2, false)
  shape.holes.push(new THREE.Path().absarc(0, 0, inner, 0, Math.PI * 2, true))
  return shape
}

// Even-odd point-in-polygon test.
function contains(polygon: THREE.Vector2[], p: THREE.Vector2): boolean {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i]
    const b = polygon[j]
    if ((a.y > p.y) !== (b.y > p.y) && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) {
      inside = !inside
    }
  }
  return inside
}

test('buildBasePlate puts the keyring hole in the extruded shape', () => {
  const base = buildBasePlate(config({ keyringEnabled: true }), 50, 30)
  const shape = base.geometry.parameters.shapes as THREE.Shape

  expect(shape.holes).toHaveLength(1)
  expect(base.geometry.parameters.options.bevelEnabled).toBe(true)
})

test('flat base extrude includes logo cutout outlines as shape holes', () => {
  const cutout = rectangleShape()
  const base = buildBasePlate(
    config({ edgeBevel: 0, keyringEnabled: false }),
    50,
    30,
    [cutout],
  )
  const shape = base.geometry.parameters.shapes as THREE.Shape

  expect(shape.holes).toHaveLength(1)
  expect(shape.holes[0].getPoints()).toEqual(cutout.getPoints())
  expect(base.geometry.parameters.options.bevelEnabled).toBe(false)
})

test('flat base extrude refills logo counters as plate islands', () => {
  const base = buildBasePlate(
    config({ edgeBevel: 0, keyringEnabled: false }),
    50,
    30,
    [ringShape(10, 5)],
  )
  const [plate, island] = base.geometry.parameters.shapes as THREE.Shape[]

  expect(plate.holes).toHaveLength(1)
  expect(island).toBeDefined()
  expect(Math.max(...island.getPoints().map(p => p.length()))).toBeCloseTo(5, 5)
})

for (const basePlateShape of ['square', 'circle'] as const) {
  test(`${basePlateShape} plate keeps the keyring ring attached to the plate`, () => {
    const cfg = config({ basePlateShape, keyringEnabled: true })
    const base = buildBasePlate(cfg, 50, 50)
    const shape = base.geometry.parameters.shapes as THREE.Shape
    const outline = shape.getPoints(32)

    // Every point of the ring material around the hole (midway between the
    // hole and the ring edge) must lie inside the outline — including just
    // below the plate's top, where the loop joins the plate.
    const midRadius = (cfg.keyringHoleDiameter + cfg.keyringRingDiameter) / 4
    for (let i = 0; i < 360; i++) {
      const a = (i / 360) * Math.PI * 2
      const p = new THREE.Vector2(Math.cos(a) * midRadius, 25 + Math.sin(a) * midRadius)
      expect(contains(outline, p)).toBe(true)
    }
  })
}

test('circle plate outline is a true circle', () => {
  const base = buildBasePlate(config({ basePlateShape: 'circle', keyringEnabled: false }), 50, 50)
  const shape = base.geometry.parameters.shapes as THREE.Shape

  for (const p of shape.getPoints(32)) expect(p.length()).toBeCloseTo(25, 5)
})

test('base bevel is clamped so extrusion depth never goes negative', () => {
  const base = buildBasePlate(config({ baseThickness: 1, edgeBevel: 10 }), 50, 30)

  expect(base.geometry.parameters.options.depth).toBeCloseTo(0.1, 5)
})

test('logo meshes are un-beveled and shifted flush by the base bevel', () => {
  const group: ColorGroup = {
    id: '#ff0000',
    color: '#ff0000',
    shapes: [rectangleShape()],
    pathCount: 1,
  }
  const [mesh] = buildLogoMeshes([group], config({ baseThickness: 5, edgeBevel: 0.6 }))

  mesh.geometry.computeBoundingBox()

  expect(mesh.geometry.parameters.options.bevelEnabled).toBe(false)
  expect(mesh.geometry.boundingBox?.min.z).toBeCloseTo(-0.6, 5)
  expect(mesh.geometry.boundingBox?.max.z).toBeCloseTo(4.4, 5)
})

test('circle plate and keyring hole outlines close exactly (no zero-length bevel edges)', () => {
  for (let d = 20; d <= 80; d += 0.5) {
    for (const keyringEnabled of [true, false]) {
      const base = buildBasePlate(
        config({ basePlateShape: 'circle', keyringEnabled, keyringHoleDiameter: 5, keyringRingDiameter: 7 }),
        d,
        d,
      )
      const { shape, holes } = (base.geometry.parameters.shapes as THREE.Shape).extractPoints(12)
      for (const contour of [shape, ...holes]) {
        // ExtrudeGeometry drops a closing point only if it equals the first exactly.
        const pts = contour[contour.length - 1].equals(contour[0]) ? contour.slice(0, -1) : contour
        for (let i = 0; i < pts.length; i++) {
          expect(pts[i].distanceTo(pts[(i + 1) % pts.length])).toBeGreaterThan(1e-6)
        }
      }
    }
  }
})
