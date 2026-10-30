import { Shape } from 'three'
import polygonClipping, { type MultiPolygon, type Pair, type Polygon } from 'polygon-clipping'
import type { KeychainConfig } from '../types/keychain'
import { KEYRING_ARTWORK_CLEARANCE } from '../utils/configConstraints'
import { clampBevel } from '../utils/meshBuilder'
import { OFFSET_ARC_TOLERANCE, OutlinePlateError, offsetPolygons } from '../utils/polygonOffset'
import { shapeToPolygon, polygonToShape } from '../utils/svgToShapes'
import { SVG_LIMITS } from '../utils/svgValidation'

export { OutlinePlateError }

// How far zero-border recess cutters reach past a flat plate's edge, both ways.
const RECESS_RIM = 0.001
// Far below the 0.01 mm offset tessellation error.
const CHAMFER_CLEARANCE = 0.0001
// Clipping tangent, rotated arcs can leave adjacent points ~1e-15 mm apart.
// Merge those before triangulation, far below the offset's 0.00001 mm precision.
const COINCIDENT_TOLERANCE = 1e-8
// Bury the cap/side junction just inside the boundary, avoiding coincident
// clipping events at the ends of an edge. Far below print/offset chord tolerances.
const ATTACHMENT_OVERLAP = 0.0001

function circle(x: number, y: number, radius: number): Polygon {
  // Exact axis crossings keep capsule tangencies shared with its straight sides.
  return shapeToPolygon(new Shape().absarc(x, y, radius, 0, Math.PI * 2, false)).map(ring =>
    ring.map(([px, py]): Pair => [Math.abs(px - x) < 1e-12 ? x : px, Math.abs(py - y) < 1e-12 ? y : py]))
}

/** The union is in physical plate coordinates, after both faces' fit/mirror.
 * Fill counters before AND after union/offset: artwork holes are always backed.
 * Separate pieces are rejected before adding a keyring; it never bridges them.
 */
export function createOutlinePlate(faces: Shape[], config: KeychainConfig): Shape {
  // Degenerate pieces (under three points) have no area to add.
  const filled = faces.map(shapeToPolygon).filter(polygon => polygon.length).map(polygon => [polygon[0]] as Polygon)
  if (!filled.length) throw new OutlinePlateError('OUTLINE_NEEDS_ARTWORK',
    'SVG outline needs visible artwork. Upload an image, show a color, or choose Rectangle or Circle.')
  const union = polygonClipping.union(filled).map(polygon => [polygon[0]])
  // Check connectivity on the requested silhouette first, never on clearance.
  let plate: MultiPolygon = offsetPolygons(union, config.outlineOffset).map(polygon => [polygon[0]])
  if (plate.length !== 1) throw new OutlinePlateError('DISCONNECTED_OUTLINE',
    `SVG outline has ${plate.length} disconnected pieces. Increase Outline offset, hide separate components, or choose Rectangle or Circle to make one connected plate.`)
  // At zero border a chamfered face edge would lie exactly on the cutter
  // walls, which CSG mishandles. The chamfer thins to a wedge there anyway, so
  // a sub-micron clearance leaves no wall. Flat plates use recess rims instead.
  if (config.outlineOffset === 0 && clampBevel(config) > 0) {
    plate = offsetPolygons(plate, CHAMFER_CLEARANCE).map(polygon => [polygon[0]])
  }

  if (config.keyringEnabled) {
    // Work in a frame whose +Y points outward in the selected direction.
    // Only the attachment is mapped back; the silhouette/artwork never rotate.
    const angle = (config.keyringAngle % 360) * Math.PI / 180
    const cos = Math.abs(Math.cos(angle)) < 1e-12 ? 0 : Math.cos(angle)
    const sin = Math.abs(Math.sin(angle)) < 1e-12 ? 0 : Math.sin(angle)
    const world = ([x, y]: Pair): Pair => [cos * x + sin * y, -sin * x + cos * y]
    const ring = plate[0][0].map(([x, y]): Pair => [cos * x - sin * y, sin * x + cos * y])
    const x = keyringLineX(ring)
    // A convex clearance envelope keeps radial movement continuous across
    // concavities without letting a distant sideways tip lengthen the neck.
    // Only this placement envelope is convex; the plate keeps its silhouette.
    const holeY = keyringHoleHeight(convexHull(ring), x, config.keyringHoleDiameter / 2 + KEYRING_ARTWORK_CLEARANCE)
    const r = config.keyringRingDiameter / 2
    const [ax, ay] = closestBoundaryPoint(ring, x, holeY)
    const dx = x - ax, dy = holeY - ay, distance = Math.hypot(dx, dy)
    const nx = dx / distance, ny = dy / distance, length = distance + ATTACHMENT_OVERLAP
    // Join the nearest edge along its normal, rather than reaching toward the
    // artwork's centre. Build in this frame to keep circle/side tangencies exact.
    const attachmentWorld = ([u, v]: Pair): Pair => world([ax + u * ny + (v - ATTACHMENT_OVERLAP) * nx, ay - u * nx + (v - ATTACHMENT_OVERLAP) * ny])
    const loopCircle = (y: number, radius: number): Polygon => circle(0, y, radius).map(points => points.map(attachmentWorld))
    // One capsule contour avoids boolean seams between tangent circles/sides.
    const arc = circle(0, 0, r)[0].slice(0, -1)
    const half = arc.findIndex(([x, y]) => x === -r && y === 0)
    const neck: Polygon = [[...arc.slice(half), [r, 0] as Pair,
      ...arc.slice(0, half + 1).map(([x, y]): Pair => [x, y + length]), arc[half]].map(attachmentWorld)]
    // Bridging a concavity can enclose small pockets; back them like artwork
    // counters before cutting the one intentional through-hole.
    plate = polygonClipping.union(plate, neck).map(polygon => [polygon[0]])
    plate = polygonClipping.difference(plate, loopCircle(length, config.keyringHoleDiameter / 2))
    plate = plate.map(polygon => polygon.map(cleanRing))
    if (plate.length !== 1 || plate[0].length !== 2) throw new OutlinePlateError('INVALID_KEYRING_POSITION',
      'The keyring could not form a connected loop with an open hole. Change Keyring position or reduce the loop size.')
  }
  if (plate.length !== 1) throw new OutlinePlateError('INVALID_OUTLINE',
    'The outline could not form one plate. Increase Outline offset or reduce the keyring size.')
  const count = plate.flat(2).length
  if (count > SVG_LIMITS.points) throw new OutlinePlateError('OUTLINE_TOO_COMPLEX',
    'The offset outline is too complex. Increase Simplify outline or hide small details.')
  return polygonToShape(plate[0])
}

function cleanRing(ring: Pair[]): Pair[] {
  const points: Pair[] = []
  const near = (a: Pair, b: Pair) => Math.hypot(a[0] - b[0], a[1] - b[1]) < COINCIDENT_TOLERANCE
  for (const point of ring.slice(0, -1)) {
    if (!points.length || !near(point, points[points.length - 1])) points.push(point)
  }
  if (points.length > 1 && near(points[0], points[points.length - 1])) points.pop()
  return [...points, points[0]]
}

/** Keep the hole on the selected radial line instead of following the highest
 * tip, which can jump between distant vertices as the direction changes.
 * Clamp to the silhouette's span for callers with artwork away from the origin. */
function keyringLineX(ring: Pair[]): number {
  const minX = ring.reduce((min, p) => Math.min(min, p[0]), Infinity)
  const maxX = ring.reduce((max, p) => Math.max(max, p[0]), -Infinity)
  return Math.max(minX, Math.min(maxX, 0))
}

function closestBoundaryPoint(ring: Pair[], x: number, y: number): Pair {
  let closest: Pair = ring[0], distanceSquared = Infinity
  for (let i = 1; i < ring.length; i++) {
    const a = ring[i - 1], b = ring[i]
    const dx = b[0] - a[0], dy = b[1] - a[1]
    const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy || 1)))
    const point: Pair = [a[0] + t * dx, a[1] + t * dy]
    const distance = (x - point[0]) ** 2 + (y - point[1]) ** 2
    if (distance < distanceSquared) { closest = point; distanceSquared = distance }
  }
  return closest
}

function convexHull(ring: Pair[]): Pair[] {
  const sorted = ring.slice(0, -1).sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cross = (a: Pair, b: Pair, c: Pair) =>
    (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const chain = (points: Pair[]) => {
    const result: Pair[] = []
    for (const point of points) {
      while (result.length > 1 && cross(result[result.length - 2], result[result.length - 1], point) <= 0) result.pop()
      result.push(point)
    }
    return result.slice(0, -1)
  }
  const hull = [...chain(sorted), ...chain([...sorted].reverse())]
  return [...hull, hull[0]]
}

/** Beyond a convex boundary, distance increases monotonically along this ray.
 * Solve against exact segments rather than a tessellated rounded offset, so
 * the hole retains its full clearance without adding another polygon offset. */
function keyringHoleHeight(hull: Pair[], x: number, clearance: number): number {
  let low = -Infinity
  for (let i = 1; i < hull.length; i++) {
    const a = hull[i - 1], b = hull[i]
    if (x < Math.min(a[0], b[0]) || x > Math.max(a[0], b[0])) continue
    low = Math.max(low, a[0] === b[0] ? Math.max(a[1], b[1]) : a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]))
  }
  let high = Math.max(...hull.map(p => p[1])) + clearance
  for (let step = 0; step < 40; step++) {
    const y = (low + high) / 2
    let distanceSquared = Infinity
    for (let i = 1; i < hull.length; i++) {
      const a = hull[i - 1], b = hull[i]
      const dx = b[0] - a[0], dy = b[1] - a[1]
      const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy)))
      distanceSquared = Math.min(distanceSquared, (x - a[0] - t * dx) ** 2 + (y - a[1] - t * dy) ** 2)
    }
    if (distanceSquared < clearance * clearance) low = y
    else high = y
  }
  return high
}

/** Recess cutters for an outline plate. Below the offset tessellation
 * tolerance, a flat plate's walls would coincide with the artwork's (or leave
 * a sub-printable sliver), so the cutters reach just past the plate edge where
 * they meet it. Inlays keep the exact artwork outline. A chamfered plate's
 * edge meets the cutters only along the face boundary, so it needs no rim.
 */
export function outlineRecessCutters(cutouts: Shape[], plate: Shape, config: KeychainConfig): Shape[] {
  if (!cutouts.length || config.outlineOffset >= OFFSET_ARC_TOLERANCE || clampBevel(config) > 0) return cutouts
  const art = cutouts.map(shapeToPolygon).filter(polygon => polygon.length)
  const rim = polygonClipping.difference(offsetPolygons(art, config.outlineOffset + RECESS_RIM),
    offsetPolygons([shapeToPolygon(plate)], -RECESS_RIM))
  return polygonClipping.union(art, rim).map(polygonToShape)
}
