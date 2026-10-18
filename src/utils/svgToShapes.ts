import * as THREE from 'three'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'
import polygonClipping, { type MultiPolygon, type Polygon, type Ring } from 'polygon-clipping'
import type { ColorGroup } from '../types/keychain'

// Curves are tessellated once, here. Every later consumer (logo extrude, plate
// cutouts) then sees the same straight-edged outlines, so the inlaid logo walls
// line up exactly with the cutout walls.
const CURVE_DIVISIONS = 16

/**
 * Parses filled SVG paths into one group per color. Overlaps are resolved in
 * paint order, as a browser draws them: each path is cut out of every
 * earlier-painted region of another color (a background shape keeps only its
 * visible part), and same-color paths are merged. The resulting regions never
 * overlap, so the logo volumes neither z-fight nor intersect in the 3MF.
 */
export function svgToShapes(svgString: string): ColorGroup[] {
  const loader = new SVGLoader()
  const svgData = loader.parse(svgString)

  const regions = new Map<string, { geom: MultiPolygon; pathCount: number }>()

  for (const path of svgData.paths) {
    const fill = path.userData?.style?.fill
    if (fill === 'none') continue

    const polygons = SVGLoader.createShapes(path).map(shapeToPolygon).filter(p => p.length > 0)
    if (polygons.length === 0) continue
    const painted = polygonClipping.union(polygons)
    if (painted.length === 0) continue

    const color = normalizeColor(path.color)

    for (const [other, region] of regions) {
      if (other !== color) region.geom = polygonClipping.difference(region.geom, painted)
    }

    const existing = regions.get(color)
    if (existing) {
      existing.geom = polygonClipping.union(existing.geom, painted)
      existing.pathCount += 1
    } else {
      regions.set(color, { geom: painted, pathCount: 1 })
    }
  }

  const groups: ColorGroup[] = []
  for (const [color, { geom, pathCount }] of regions) {
    // A color painted over entirely contributes nothing to the model.
    if (geom.length === 0) continue
    groups.push({ id: color, color, shapes: geom.map(polygonToShape), pathCount })
  }
  return groups
}

// Keyed by array identity (groups are replaced, never mutated), so the app's
// logo sizing and the mesh builder share one union per logo.
const outlineCache = new WeakMap<ColorGroup[], THREE.Shape[]>()

/**
 * The logo's footprint: the union of every color region, with its counters as
 * holes. Adjacent colors merge into one outline, so the plate gets one cutout
 * per connected logo part rather than overlapping or edge-sharing ones.
 * Cached per array; callers must not modify the returned shapes.
 */
export function logoOutline(groups: ColorGroup[]): THREE.Shape[] {
  let outline = outlineCache.get(groups)
  if (!outline) {
    const polygons = groups.flatMap(group => group.shapes.map(shapeToPolygon)).filter(p => p.length > 0)
    outline = polygons.length === 0 ? [] : polygonClipping.union(polygons).map(polygonToShape)
    outlineCache.set(groups, outline)
  }
  return outline
}

export function normalizeColor(color: THREE.Color): string {
  return '#' + color.getHexString()
}

/** Shape → polygon (outer ring, then holes); empty if the outer ring is degenerate. */
export function shapeToPolygon(shape: THREE.Shape): Polygon {
  const { shape: outer, holes } = shape.extractPoints(CURVE_DIVISIONS)
  if (outer.length < 3) return []
  return [outer, ...holes.filter(h => h.length >= 3)].map(toRing)
}

function toRing(points: THREE.Vector2[]): Ring {
  return points.map(p => [p.x, p.y])
}

export function polygonToShape(polygon: Polygon): THREE.Shape {
  const [outer, ...holes] = polygon.map(ringToPoints)
  const shape = new THREE.Shape(outer)
  for (const hole of holes) shape.holes.push(new THREE.Path(hole))
  return shape
}

// polygon-clipping closes each ring by repeating its first point; drop it.
function ringToPoints(ring: Ring): THREE.Vector2[] {
  return ring.slice(0, -1).map(([x, y]) => new THREE.Vector2(x, y))
}
