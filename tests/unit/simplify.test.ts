import { expect, test } from 'bun:test'
import * as THREE from 'three'
import polygonClipping, { type MultiPolygon, type Ring } from 'polygon-clipping'
import type { ColorGroup } from '../../src/types/keychain'
import { simplifyGroups } from '../../src/utils/simplify'
import { logoOutline, polygonToShape, shapeToPolygon } from '../../src/utils/svgToShapes'
import { shapeArea } from '../../src/utils/refine'

function circle(cx: number, cy: number, r: number, n: number): Ring {
  const ring: Ring = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    ring.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r])
  }
  ring.push(ring[0])
  return ring
}

const square = (x: number, y: number, s: number): Ring =>
  [[x, y], [x + s, y], [x + s, y + s], [x, y + s], [x, y]]

const group = (color: string, geom: MultiPolygon): ColorGroup =>
  ({ id: color, color, shapes: geom.map(polygonToShape), pathCount: 1 })

const area = (groups: ColorGroup[]) =>
  groups.reduce((sum, g) => sum + g.shapes.reduce((s, shape) => s + shapeArea(shape), 0), 0)

const pointCount = (groups: ColorGroup[]) => groups.reduce((sum, g) => sum + g.shapes.reduce((s, shape) => {
  const { shape: outer, holes } = shape.extractPoints(16)
  return s + outer.length + holes.reduce((h, ring) => h + ring.length, 0)
}, 0), 0)

/**
 * A square with a finely sampled circle painted over one corner, resolved the
 * way the parser does it: the shared arc ends in T-junctions on the square's
 * edges, which only one side has a vertex for.
 */
function overlapping(): ColorGroup[] {
  const disc: MultiPolygon = [[circle(10, 10, 6, 400)]]
  const back = polygonClipping.difference([[square(0, 0, 10)]], disc)
  return [group('#000000', back), group('#ff0000', disc)]
}

function overlapArea(groups: ColorGroup[]): number {
  let total = 0
  for (let i = 0; i < groups.length; i++) {
    for (let j = i + 1; j < groups.length; j++) {
      const inter = polygonClipping.intersection(
        groups[i].shapes.map(shapeToPolygon), groups[j].shapes.map(shapeToPolygon))
      total += inter.reduce((sum, poly) => sum + shapeArea(polygonToShape(poly)), 0)
    }
  }
  return total
}

test('a tolerance of zero returns the groups unchanged', () => {
  const groups = overlapping()
  const result = simplifyGroups(groups, 0)
  expect(result.groups).toBe(groups)
  expect(result.after).toBe(result.before)
  expect(result.before).toBe(pointCount(groups))
})

test('drops points while every original point stays within the tolerance', () => {
  const tolerance = 0.01
  const original = circle(0, 0, 5, 1000).slice(0, -1).map(([x, y]) => new THREE.Vector2(x, y))
  const groups = [group('#000000', [[circle(0, 0, 5, 1000)]])]
  const result = simplifyGroups(groups, tolerance)

  expect(result.before).toBe(1000)
  expect(result.after).toBeLessThan(100)
  expect(result.after).toBe(pointCount(result.groups))

  const ring = result.groups[0].shapes[0].extractPoints(16).shape
  const segment = new THREE.Line3()
  const closest = new THREE.Vector3()
  for (const p of original) {
    let best = Infinity
    for (let i = 0; i < ring.length; i++) {
      const [a, b] = [ring[i], ring[(i + 1) % ring.length]]
      segment.set(new THREE.Vector3(a.x, a.y), new THREE.Vector3(b.x, b.y))
      segment.closestPointToPoint(new THREE.Vector3(p.x, p.y), true, closest)
      best = Math.min(best, closest.distanceTo(new THREE.Vector3(p.x, p.y)))
    }
    expect(best).toBeLessThanOrEqual(tolerance + 1e-9)
  }
})

test('colors sharing a border stay sealed: no overlap, no gap', () => {
  const groups = overlapping()
  for (const tolerance of [0.005, 0.05, 0.5]) {
    const result = simplifyGroups(groups, tolerance)
    expect(result.after).toBeLessThan(result.before)
    expect(overlapArea(result.groups)).toBeLessThan(1e-9)
    // A gap between the colors would be a hole in their union.
    const outline = logoOutline(result.groups)
    expect(outline).toHaveLength(1)
    expect(outline[0].holes).toHaveLength(0)
    expect(Math.abs(shapeArea(outline[0]) - area(result.groups))).toBeLessThan(1e-9)
  }
})

test('a color touching part of one edge keeps touching it', () => {
  // A small square straddles one edge of a 12-gon painted over it, so the
  // square's remainder borders only the middle of that edge. The 12-gon has
  // no vertex there; unless the square's corners on the edge are inserted
  // into it, simplifying the 12-gon pulls its edge away and opens a seam.
  const disc: MultiPolygon = [[circle(0, 0, 6, 12)]]
  const [px, py] = [(6 + 6 * Math.cos(Math.PI / 6)) / 2, 6 * Math.sin(Math.PI / 6) / 2]
  const back = polygonClipping.difference([[square(px - 1.2, py - 1.2, 2.4)]], disc)
  const groups = [group('#000000', back), group('#ff0000', disc)]

  const onRing = (p: THREE.Vector2, ring: THREE.Vector2[]) => ring.some((a, i) => {
    const b = ring[(i + 1) % ring.length]
    const line = new THREE.Line3(new THREE.Vector3(a.x, a.y), new THREE.Vector3(b.x, b.y))
    const q = new THREE.Vector3(p.x, p.y)
    return line.closestPointToPoint(q, true, new THREE.Vector3()).distanceTo(q) < 1e-9
  })
  const discRing = (gs: ColorGroup[]) => gs[1].shapes[0].extractPoints(16).shape
  const shared = groups[0].shapes[0].extractPoints(16).shape.filter(p => onRing(p, discRing(groups)))
  expect(shared).toHaveLength(2)

  const result = simplifyGroups(groups, 0.9)
  expect(result.after).toBeLessThan(result.before)
  for (const p of shared) expect(onRing(p, discRing(result.groups))).toBe(true)
})

test('an island and the hole it fills are simplified identically', () => {
  const dot: MultiPolygon = [[circle(5, 5, 2, 300)]]
  const groups = [
    group('#000000', polygonClipping.difference([[square(0, 0, 10)]], dot)),
    group('#ff0000', dot),
  ]
  const result = simplifyGroups(groups, 0.05)
  const hole = result.groups[0].shapes[0].holes[0].getPoints()
  const island = result.groups[1].shapes[0].extractPoints(16).shape
  const key = (points: THREE.Vector2[]) => points.map(p => `${p.x},${p.y}`).sort()
  expect(key(hole)).toEqual(key(island))
  expect(island.length).toBeLessThan(300)
})

test('a piece thinner than the tolerance is dropped and its neighbor closes over it', () => {
  const dot: MultiPolygon = [[circle(5, 5, 0.02, 32)]]
  const groups = [
    group('#000000', polygonClipping.difference([[square(0, 0, 10)]], dot)),
    group('#ff0000', dot),
  ]
  const result = simplifyGroups(groups, 0.1)
  expect(result.groups.map(g => g.color)).toEqual(['#000000'])
  expect(result.groups[0].shapes[0].holes).toHaveLength(0)
})

test('returns the previous array when the same points survive', () => {
  const groups = overlapping()
  const first = simplifyGroups(groups, 0.05)
  // Within the circle's sampling, a hair more tolerance drops nothing new.
  expect(simplifyGroups(groups, 0.05 + 1e-12).groups).toBe(first.groups)
  expect(simplifyGroups(groups, 0.5).groups).not.toBe(first.groups)
})
