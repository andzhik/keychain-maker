import ClipperLib from 'clipper-lib'
import type { MultiPolygon, Polygon } from 'polygon-clipping'

// Work in print-space integers: 0.00001 mm precision, with rounded joins
// tessellated to within 0.01 mm. Never offset in source SVG coordinates.
const SCALE = 100000
export const OFFSET_ARC_TOLERANCE = 0.01

export class OutlinePlateError extends Error {
  constructor(public code: string, message: string) { super(message) }
}

export function offsetPolygons(polygons: MultiPolygon, mm: number): MultiPolygon {
  if (mm === 0) return polygons
  const paths = polygons.flatMap(polygon => polygon.map((ring, i) => {
    const path = ring.map(([x, y]) => ({ X: Math.round(x * SCALE), Y: Math.round(y * SCALE) }))
    if (ClipperLib.Clipper.Orientation(path) !== (i === 0)) path.reverse()
    return path
  }))
  const offset = new ClipperLib.ClipperOffset(2, OFFSET_ARC_TOLERANCE * SCALE)
  offset.AddPaths(paths, ClipperLib.JoinType.jtRound, ClipperLib.EndType.etClosedPolygon)
  const tree = new ClipperLib.PolyTree()
  offset.Execute(tree, mm * SCALE)
  return ClipperLib.JS.PolyTreeToExPolygons(tree).map(({ outer, holes }) =>
    [outer, ...holes].map(path => {
      const ring = path.map(({ X, Y }) => [X / SCALE, Y / SCALE] as [number, number])
      ring.push([...ring[0]])
      return ring
    }) as Polygon)
}
