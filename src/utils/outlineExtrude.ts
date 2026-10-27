import { BufferGeometry, Float32BufferAttribute, Shape, ShapeUtils, Vector2 } from 'three'
import polygonClipping, { type MultiPolygon, type Pair } from 'polygon-clipping'
import { offsetPolygons } from './polygonOffset'
import { shapeToPolygon } from './svgToShapes'
import { OutlinePlateError } from '../domain/outlinePlate'
import { SVG_LIMITS } from './svgValidation'

/** Loft nested polygon offsets instead of Three's per-vertex bevel vectors.
 * Triangulating the bands also handles disappearing notches and changing point
 * counts. The flat face remains at the requested offset; the bevel bulges out.
 */
export function extrudeOutline(shape: Shape, thickness: number, bevel: number, segments: number): BufferGeometry {
  const surface: MultiPolygon = [shapeToPolygon(shape)]
  const positions: number[] = []
  const triangle = (a: number[], b: number[], c: number[]) => positions.push(...a, ...b, ...c)
  const key = (p: Pair) => `${p[0]},${p[1]}`
  function triangulate(polygons: MultiPolygon): Pair[][] {
    const triangles: Pair[][] = []
    for (const polygon of polygons) {
      const rings = polygon.map(ring => ring.slice(0, -1))
      const points = rings.flat()
      const vectors = rings.map(ring => ring.map(([x, y]) => new Vector2(x, y)))
      for (const ids of ShapeUtils.triangulateShape(vectors[0], vectors.slice(1))) {
        triangles.push(ids.map(i => points[i]))
      }
    }
    return triangles
  }
  function cap(triangles: Pair[][], z: (p: Pair) => number, up: boolean) {
    for (const [a, b, c] of triangles) {
      const positive = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) > 0
      const vertices = [a, b, c].map(p => [p[0], p[1], z(p)])
      triangle(vertices[0], vertices[positive === up ? 1 : 2], vertices[positive === up ? 2 : 1])
    }
  }
  const tooComplex = () => new OutlinePlateError('OUTLINE_TOO_COMPLEX',
    'The chamfer outline is too complex. Reduce Edge roundness or increase Simplify outline.')
  function section(distance: number) {
    const polygons = offsetPolygons(surface, distance)
    if (polygons.flat(2).length > SVG_LIMITS.points) throw tooComplex()
    return polygons
  }
  function band(inner: MultiPolygon, outer: MultiPolygon, d0: number, d1: number, z0: number, z1: number) {
    const triangles = triangulate(polygonClipping.difference(outer, inner))
    const innerPoints = new Set(inner.flatMap(polygon => polygon[0]).map(key))
    // A triangle spanning only the old boundary means a notch has closed.
    // Locate that event to 0.01 mm instead of capping the notch at the face
    // height. Extra sections interpolate the selected chamfer profile.
    if (d1 - d0 > 0.01 && triangles.some(t => t.every(p => innerPoints.has(key(p))))) {
      const distance = (d0 + d1) / 2, z = (z0 + z1) / 2
      const middle = section(distance)
      band(inner, middle, d0, distance, z0, z)
      band(middle, outer, distance, d1, z, z1)
      return
    }
    if (positions.length / 9 + triangles.length * 2 > SVG_LIMITS.points * 32) throw tooComplex()
    const outerPoints = new Set(outer.flat(2).map(key))
    const bandZ = (p: Pair) => outerPoints.has(key(p)) ? z1 : z0
    cap(triangles, bandZ, false)
    cap(triangles, p => thickness - 2 * bevel - bandZ(p), true)
  }
  const caps = triangulate(surface)
  cap(caps, () => -bevel, false)
  cap(caps, () => thickness - bevel, true)
  let inner = surface
  let previousZ = -bevel, previousDistance = 0
  for (let i = 1; i <= segments && bevel > 0; i++) {
    const angle = i / segments * Math.PI / 2
    const distance = bevel * Math.sin(angle)
    const outer = section(distance)
    const z = -bevel * Math.cos(angle)
    band(inner, outer, previousDistance, distance, previousZ, z)
    inner = outer
    previousZ = z
    previousDistance = distance
  }
  // The core's walls follow the largest (middle) offset, including the hole.
  for (const polygon of inner) for (let r = 0; r < polygon.length; r++) {
    const ring = polygon[r].slice(0, -1)
    if (ShapeUtils.isClockWise(ring.map(([x, y]) => new Vector2(x, y))) !== (r > 0)) ring.reverse()
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length]
      const low = 0, high = thickness - 2 * bevel
      triangle([...a, low], [...b, low], [...b, high])
      triangle([...a, low], [...b, high], [...a, high])
    }
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  // CSG consumes UVs as well as positions/normals.
  geometry.setAttribute('uv', new Float32BufferAttribute(new Float32Array(positions.length / 3 * 2), 2))
  geometry.computeVertexNormals()
  return geometry
}
