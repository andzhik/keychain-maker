import { Shape } from 'three'
import polygonClipping, { type MultiPolygon, type Polygon } from 'polygon-clipping'
import type { KeychainConfig } from '../types/keychain'
import { MIN_KEYRING_WALL } from '../utils/configConstraints'
import { offsetPolygons } from '../utils/polygonOffset'
import { shapeToPolygon, polygonToShape } from '../utils/svgToShapes'
import { SVG_LIMITS } from '../utils/svgValidation'

export class OutlinePlateError extends Error {
  constructor(public code: string, message: string) { super(message) }
}

function circle(x: number, y: number, radius: number): Polygon {
  return shapeToPolygon(new Shape().absarc(x, y, radius, 0, Math.PI * 2, false))
}

/** The union is in physical plate coordinates, after both faces' fit/mirror.
 * Fill counters before AND after union/offset: artwork holes are always backed.
 * Separate pieces are rejected before adding a keyring; it never bridges them.
 */
export function createOutlinePlate(faces: Shape[], config: KeychainConfig): Shape {
  if (!faces.length) throw new OutlinePlateError('OUTLINE_NEEDS_ARTWORK',
    'SVG outline needs visible artwork. Upload an image, show a color, or choose Rectangle or Circle.')
  const filled = faces.map(shape => [shapeToPolygon(shape)[0]] as Polygon)
  const union = polygonClipping.union(filled).map(polygon => [polygon[0]])
  // A sub-micron clearance avoids coincident exterior/cutter walls at zero
  // border in the recess CSG. Far below the 0.01 mm offset tessellation error.
  // Check connectivity on the requested silhouette first, never on clearance.
  let plate: MultiPolygon = offsetPolygons(union, config.outlineOffset).map(polygon => [polygon[0]])
  if (plate.length !== 1) throw new OutlinePlateError('DISCONNECTED_OUTLINE',
    `SVG outline has ${plate.length} disconnected pieces. Increase Outline offset, hide separate components, or choose Rectangle or Circle to make one connected plate.`)
  if (config.outlineOffset === 0) plate = offsetPolygons(plate, 0.0001).map(polygon => [polygon[0]])

  if (config.keyringEnabled) {
    const points = plate[0][0]
    // A real boundary point anchors even asymmetric logos or a notch at x=0.
    const top = points.reduce((best, p) => p[1] > best[1] || p[1] === best[1] && Math.abs(p[0]) < Math.abs(best[0]) ? p : best)
    const [x, y] = top
    const holeY = y + config.keyringHoleDiameter / 2 + MIN_KEYRING_WALL
    const r = config.keyringRingDiameter / 2
    // Reinforced capsule neck intersects the highest tip with positive area.
    const neck: Polygon = [[[x - r, y], [x + r, y], [x + r, holeY], [x - r, holeY], [x - r, y]]]
    plate = polygonClipping.union(plate, circle(x, y, r), circle(x, holeY, r), neck)
    plate = polygonClipping.difference(plate, circle(x, holeY, config.keyringHoleDiameter / 2))
  }
  if (plate.length !== 1) throw new OutlinePlateError('INVALID_OUTLINE',
    'The outline could not form one plate. Increase Outline offset or reduce the keyring size.')
  const count = plate.flat(2).length
  if (count > SVG_LIMITS.points) throw new OutlinePlateError('OUTLINE_TOO_COMPLEX',
    'The offset outline is too complex. Increase Simplify outline or hide small details.')
  return polygonToShape(plate[0])
}
