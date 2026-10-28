import { Shape } from 'three'
import polygonClipping, { type MultiPolygon, type Pair, type Polygon } from 'polygon-clipping'
import type { KeychainConfig } from '../types/keychain'
import { MIN_KEYRING_WALL } from '../utils/configConstraints'
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

function circle(x: number, y: number, radius: number): Polygon {
  return shapeToPolygon(new Shape().absarc(x, y, radius, 0, Math.PI * 2, false))
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
    const loopCircle = (cx: number, cy: number, radius: number): Polygon => circle(cx, cy, radius).map(points => points.map(world))
    const ring = plate[0][0].map(([x, y]): Pair => [cos * x - sin * y, sin * x + cos * y])
    const [x, y] = keyringAnchor(ring)
    const top = ring.reduce((max, p) => Math.max(max, p[1]), -Infinity)
    const holeY = top + config.keyringHoleDiameter / 2 + MIN_KEYRING_WALL
    const r = config.keyringRingDiameter / 2
    // The support line keeps the hole clear of the entire silhouette, including
    // concavities and independent faces. The capsule overlaps a tip with area.
    const neck: Polygon = [[world([x - r, y]), world([x + r, y]), world([x + r, holeY]), world([x - r, holeY]), world([x - r, y])]]
    plate = polygonClipping.union(plate, loopCircle(x, y, r), loopCircle(x, holeY, r), neck)
    plate = polygonClipping.difference(plate, loopCircle(x, holeY, config.keyringHoleDiameter / 2))
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

/** A real boundary point on the highest edges, nearest the centre line. Flat
 * tops only have vertices at their ends, so the anchor may lie mid-edge; an
 * asymmetric logo's single highest tip or a notch at x=0 still anchors on the
 * boundary. Edges within the offset tessellation tolerance count as highest. */
function keyringAnchor(ring: Pair[]): Pair {
  let anchor = ring.reduce((best, p) => p[1] > best[1] || p[1] === best[1] && Math.abs(p[0]) < Math.abs(best[0]) ? p : best)
  const top = anchor[1]
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i + 1) % ring.length]
    if (Math.min(a[1], b[1]) < top - OFFSET_ARC_TOLERANCE) continue
    const x = Math.max(Math.min(a[0], b[0]), Math.min(Math.max(a[0], b[0]), 0))
    const y = a[0] === b[0] ? Math.max(a[1], b[1]) : a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0])
    if (Math.abs(x) < Math.abs(anchor[0])) anchor = [x, y]
  }
  return anchor
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
