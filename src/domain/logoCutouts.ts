import { Path, Shape, Vector2 } from 'three'
import type { LogoFit } from '../utils/logoFit'

/** Map the already-tessellated outline into plate coordinates, preserving counters. */
export function createLogoCutouts(outlines: { shape: Vector2[]; holes: Vector2[][] }[], fit: LogoFit): Shape[] {
  if (!fit.hasLogo) return []
  const toPlate = (points: Vector2[]) => points.map(point =>
    new Vector2((point.x - fit.center.x) * fit.scale, -(point.y - fit.center.y) * fit.scale))
  return outlines.map(points => {
    const cutout = new Shape(toPlate(points.shape))
    for (const hole of points.holes) cutout.holes.push(new Path(toPlate(hole)))
    return cutout
  })
}
