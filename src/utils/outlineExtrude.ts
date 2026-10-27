import { BufferGeometry, Float32BufferAttribute, Shape, ShapeUtils, Vector2 } from 'three'
import type { MultiPolygon, Pair, Ring } from 'polygon-clipping'
import { OFFSET_ARC_TOLERANCE, OutlinePlateError, offsetPolygons } from './polygonOffset'
import { shapeToPolygon } from './svgToShapes'
import { SVG_LIMITS } from './svgValidation'

type Vertex = [number, number, number]

// Clipper's chords stay within OFFSET_ARC_TOLERANCE of the true offset, so
// sections at least twice that far apart nest strictly: band rings never
// cross or touch, and each band triangulates from the section rings as-is.
const MIN_BAND = 2 * OFFSET_ARC_TOLERANCE

/** Loft nested polygon offsets instead of Three's per-vertex bevel vectors.
 * Triangulating the bands also handles disappearing notches and changing point
 * counts. The flat face remains at the requested offset; the bevel bulges out.
 */
export function extrudeOutline(shape: Shape, thickness: number, bevel: number, segments: number): BufferGeometry {
  const surface = openRings([shapeToPolygon(shape)])
  const core = thickness - 2 * bevel
  const positions: number[] = []
  function cap(triangles: Vertex[][], up: boolean) {
    for (const [a, b, c] of triangles) {
      const positive = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) > 0
      positions.push(...a, ...(positive === up ? [...b, ...c] : [...c, ...b]))
    }
  }
  // Each bottom vertex has its mirror image on the top bevel.
  function caps(triangles: Vertex[][]) {
    cap(triangles, false)
    cap(triangles.map(t => t.map(([x, y, z]) => [x, y, core - z] as Vertex)), true)
  }
  const tooComplex = () => new OutlinePlateError('OUTLINE_TOO_COMPLEX',
    'The chamfer outline is too complex. Reduce Edge roundness or increase Simplify outline.')
  function section(distance: number) {
    const polygons = openRings(offsetPolygons(surface, distance))
    if (polygons.flat(2).length > SVG_LIMITS.points) throw tooComplex()
    return polygons
  }
  function band(inner: MultiPolygon, outer: MultiPolygon, d0: number, d1: number, z0: number, z1: number) {
    const innerRings = new Set(inner.flat())
    const triangles = bandRegions(inner, outer).flatMap(rings => triangulate(rings, ring => innerRings.has(ring) ? z0 : z1))
    // Locate a closing notch to within MIN_BAND instead of capping the notch at
    // the face height. Extra sections interpolate the selected chamfer profile.
    if ((d1 - d0) / 2 >= MIN_BAND && notchCloses(triangles, outer, d1 - d0, z0)) {
      const distance = (d0 + d1) / 2, z = (z0 + z1) / 2
      const middle = section(distance)
      band(inner, middle, d0, distance, z0, z)
      band(middle, outer, distance, d1, z, z1)
      return
    }
    if (positions.length / 9 + triangles.length * 2 > SVG_LIMITS.points * 32) throw tooComplex()
    caps(triangles)
  }
  for (const polygon of surface) caps(triangulate(polygon, () => -bevel))
  let inner = surface
  let previousZ = -bevel, previousDistance = 0
  for (const { distance, z } of bevelProfile(bevel, segments)) {
    const outer = section(distance)
    band(inner, outer, previousDistance, distance, previousZ, z)
    inner = outer
    previousZ = z
    previousDistance = distance
  }
  // The core's walls follow the largest (middle) offset, including the hole.
  for (const polygon of inner) for (let r = 0; r < polygon.length; r++) {
    const ring = [...polygon[r]]
    if (ShapeUtils.isClockWise(ring.map(([x, y]) => new Vector2(x, y))) !== (r > 0)) ring.reverse()
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length]
      positions.push(a[0], a[1], 0, b[0], b[1], 0, b[0], b[1], core)
      positions.push(a[0], a[1], 0, b[0], b[1], core, a[0], a[1], core)
    }
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  // CSG consumes UVs as well as positions/normals.
  geometry.setAttribute('uv', new Float32BufferAttribute(new Float32Array(positions.length / 3 * 2), 2))
  geometry.computeVertexNormals()
  return geometry
}

/** Quarter-round sections, merging any closer than MIN_BAND. The last one is
 * exactly the full bevel at the core height, so it meets the core's walls. */
function bevelProfile(bevel: number, segments: number) {
  const profile: { distance: number; z: number }[] = []
  for (let i = 1; i <= segments && bevel > 0; i++) {
    const last = i === segments
    const angle = i / segments * Math.PI / 2
    const distance = last ? bevel : bevel * Math.sin(angle)
    const previous = profile[profile.length - 1]?.distance ?? 0
    if (distance - previous < MIN_BAND) {
      if (!last) continue
      if (profile.length) profile.pop()
    }
    profile.push({ distance, z: last ? 0 : -bevel * Math.cos(angle) })
  }
  return profile
}

// Clipper and polygon-clipping close rings by repeating the first point;
// Three's shape points do not. Use open rings throughout.
function openRings(polygons: MultiPolygon): MultiPolygon {
  return polygons.map(polygon => polygon.map(ring => {
    const first = ring[0], last = ring[ring.length - 1]
    return ring.length > 1 && first[0] === last[0] && first[1] === last[1] ? ring.slice(0, -1) : ring
  }).filter(ring => ring.length >= 3)).filter(polygon => polygon.length)
}

function triangulate(rings: Ring[], z: (ring: Ring) => number): Vertex[][] {
  const vertices = rings.flatMap(ring => ring.map(([x, y]) => [x, y, z(ring)] as Vertex))
  const vectors = rings.map(ring => ring.map(([x, y]) => new Vector2(x, y)))
  return ShapeUtils.triangulateShape(vectors[0], vectors.slice(1)).map(ids => ids.map(i => vertices[i]))
}

/** The area between strictly nested sections, as contours with holes: each
 * outer exterior around the inner exteriors, and each inner hole around the
 * outer holes it still contains. Outer holes outside every inner hole (a notch
 * closed at its mouth) are holes of the exterior region. */
function bandRegions(inner: MultiPolygon, outer: MultiPolygon): Ring[][] {
  const holeRegions = inner.flatMap(polygon => polygon.slice(1)).map(hole => [hole])
  const regions: Ring[][] = []
  for (const [exterior, ...holes] of outer) {
    const region = [exterior, ...inner.map(polygon => polygon[0]).filter(ring => contains(exterior, ring[0]))]
    regions.push(region)
    for (const hole of holes) (holeRegions.find(([ring]) => contains(ring, hole[0])) ?? region).push(hole)
  }
  return [...regions, ...holeRegions]
}

/** A triangle spanning only the band's inner rings is flat at their height.
 * That is harmless along a concave curve, where the band is no wider than its
 * offset. A notch closing inside the band instead leaves area deeper than the
 * band's width inside the outer section (its morphological closing). */
function notchCloses(triangles: Vertex[][], outer: MultiPolygon, width: number, z0: number): boolean {
  const candidates = triangles.filter(t => t.every(v => v[2] === z0) && inradius(t) > OFFSET_ARC_TOLERANCE)
  if (!candidates.length) return false
  const deep = offsetPolygons(outer, -(width + 2 * OFFSET_ARC_TOLERANCE))
  return candidates.some(t => {
    const p = incenter(t)
    return deep.some(([exterior, ...holes]) => contains(exterior, p) && !holes.some(hole => contains(hole, p)))
  })
}

function sides([a, b, c]: Vertex[]) {
  return [Math.hypot(b[0] - c[0], b[1] - c[1]), Math.hypot(c[0] - a[0], c[1] - a[1]), Math.hypot(a[0] - b[0], a[1] - b[1])]
}

function inradius(t: Vertex[]): number {
  const [a, b, c] = t
  const area = Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])) / 2
  const perimeter = sides(t).reduce((sum, side) => sum + side, 0)
  return perimeter ? 2 * area / perimeter : 0
}

function incenter(t: Vertex[]): Pair {
  const weights = sides(t), total = weights[0] + weights[1] + weights[2]
  return [0, 1].map(axis => t.reduce((sum, v, i) => sum + v[axis] * weights[i], 0) / total) as Pair
}

function contains(ring: Ring, [x, y]: Pair): boolean {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j]
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside
  }
  return inside
}
