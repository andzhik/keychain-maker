import * as THREE from 'three'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'
import polygonClipping, { type MultiPolygon, type Polygon, type Ring } from 'polygon-clipping'
import type { ColorGroup } from '../types/keychain'
import { prepareSvg } from './svgImport'
import { SVG_LIMITS, complexityError, svgError, validateGroupComplexity, type SvgParseError, type SvgParseResult } from './svgValidation'

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
export function svgToShapes(svgString: string): SvgParseResult {
  try {
    const prepared = prepareSvg(svgString)
    if (!prepared.ok) return prepared
    const result = parseFilledShapes(prepared.svg)
    return result.ok ? { ...result, report: prepared.report } : result
  } catch {
    return { ok: false, error: svgError('INVALID_SVG') }
  }
}

function parseFilledShapes(svgString: string): SvgParseResult {
  const loader = new SVGLoader()
  const svgData = loader.parse(svgString)
  if (svgData.paths.length > SVG_LIMITS.paths) {
    return { ok: false, error: complexityError(`Use at most ${SVG_LIMITS.paths} paths.`) }
  }

  let pointBudget = 0
  const bounds = new THREE.Box2()
  const prepared: { color: string; polygons: Polygon[] }[] = []
  const inputGroups: ColorGroup[] = []
  for (const path of svgData.paths) {
    // SVGLoader resolves inherited and inline styles, including local copies.
    // The solid-fill pipeline cannot reproduce strokes, even on filled paths.
    // Reject them before skipping fill=none or starting polygon operations.
    const style = path.userData?.style
    if (style?.stroke && !['none', 'transparent'].includes(style.stroke)
      && style.strokeWidth > 0 && style.strokeOpacity > 0 && style.opacity !== 0
      && !['hidden', 'collapse'].includes(style.visibility)
      && path.subPaths.some(subpath => subpath.curves.length > 0)) {
      return { ok: false, error: svgError('UNSUPPORTED_STROKE') }
    }
    if (style?.fill === 'none') continue
    for (const subpath of path.subPaths) {
      for (const curve of subpath.curves) pointBudget += curve.type === 'LineCurve' ? 1 : curve.type === 'EllipseCurve' ? 32 : 16
      pointBudget++
      if (pointBudget > SVG_LIMITS.points) {
        return { ok: false, error: complexityError(`Use at most ${SVG_LIMITS.points} outline points.`) }
      }
      for (const point of subpath.getPoints(CURVE_DIVISIONS)) {
        if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) return { ok: false, error: svgError('INVALID_SVG') }
        bounds.expandByPoint(point)
      }
    }
    const shapes = SVGLoader.createShapes(path)
    const color = normalizeColor(path.color)
    inputGroups.push({ id: color, color, shapes, pathCount: 1 })
    const error = validateGroupComplexity(inputGroups)
    if (error) return { ok: false, error }
    prepared.push({ color, polygons: shapes.map(shapeToPolygon).filter(p => p.length > 0) })
  }
  if (!bounds.isEmpty()) {
    const size = bounds.getSize(new THREE.Vector2())
    if (Math.min(size.x, size.y) <= 1e-7) return { ok: false, error: svgError('ZERO_BOUNDS') }
  }

  const regions = new Map<string, { geom: MultiPolygon; pathCount: number }>()

  for (const { color, polygons } of prepared) {
    if (polygons.length === 0) continue
    const painted = polygonClipping.union(polygons)
    if (painted.length === 0) continue

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
    const error = validatePolygonComplexity([...regions.values()].map(r => r.geom))
    if (error) return { ok: false, error }
  }

  const groups: ColorGroup[] = []
  for (const [color, { geom, pathCount }] of regions) {
    // A color painted over entirely contributes nothing to the model.
    if (geom.length === 0) continue
    groups.push({ id: color, color, shapes: geom.map(polygonToShape), pathCount })
  }
  if (groups.length === 0) return { ok: false, error: svgError('NO_FILLED_PATHS') }
  const error = validateGroupComplexity(groups)
  return error ? { ok: false, error } : { ok: true, groups }
}

function validatePolygonComplexity(regions: MultiPolygon[]): SvgParseError | null {
  let shapes = 0
  let points = 0
  for (const region of regions) {
    shapes += region.length
    for (const polygon of region) for (const ring of polygon) points += ring.length
    if (shapes > SVG_LIMITS.shapes || points > SVG_LIMITS.points) {
      return complexityError(`Resolved artwork must fit within ${SVG_LIMITS.shapes} shapes and ${SVG_LIMITS.points} outline points.`)
    }
  }
  return null
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
