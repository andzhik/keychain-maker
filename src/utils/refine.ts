import * as THREE from 'three'
import polygonClipping from 'polygon-clipping'
import type { ColorGroup, Refinements } from '../types/keychain'
import { polygonToShape, shapeToPolygon } from './svgToShapes'

/**
 * Refinements run on the parsed color groups, never on the SVG:
 *
 *   parsed → refineColors (hide shapes/colors, recolor, merge) → removeSpecks → model
 *
 * Each step returns a new groups array when its output changes and the same
 * array when it doesn't, because the viewer and the outline cache compare
 * groups by identity (see README, "colorGroups is compared by identity").
 */

/** Stable id of a parsed shape: its source color and index within that group. */
export function shapeId(color: string, index: number): string {
  return `${color}:${index}`
}

export interface RefinedColors {
  groups: ColorGroup[]
  /** Final color → the source colors printed in it, in parse order. */
  sources: Map<string, string[]>
}

interface Cluster {
  color: string
  area: number
  members: { group: ColorGroup; kept: number[] }[]
}

// The last result per parsed array, so a refinement that changes nothing (a
// tolerance below every color distance, say) keeps the groups' identity and
// doesn't trigger a rebuild.
const lastRefined = new WeakMap<ColorGroup[], { key: string; result: RefinedColors }>()

/** Applies the color refinements (hidden shapes and colors, recolor, merging). */
export function refineColors(parsed: ColorGroup[], refinements: Refinements): RefinedColors {
  const hiddenColors = new Set(refinements.hiddenColors)
  const hiddenShapes = new Set(refinements.hiddenShapes)

  // Sources mapped to the same color become one cluster.
  const clusters: Cluster[] = []
  for (const group of parsed) {
    if (hiddenColors.has(group.color)) continue
    const kept = group.shapes.map((_, i) => i).filter(i => !hiddenShapes.has(shapeId(group.color, i)))
    if (kept.length === 0) continue
    const color = refinements.recolor[group.color] ?? group.color
    const area = kept.reduce((sum, i) => sum + shapeArea(group.shapes[i]), 0)
    const existing = clusters.find(c => c.color === color)
    if (existing) {
      existing.members.push({ group, kept })
      existing.area += area
    } else {
      clusters.push({ color, area, members: [{ group, kept }] })
    }
  }

  mergeClusters(clusters, refinements.mergeTolerance, refinements.maxColors)

  const key = JSON.stringify(clusters.map(c => [c.color, c.members.map(m => [m.group.color, m.kept])]))
  const cached = lastRefined.get(parsed)
  if (cached?.key === key) return cached.result

  const sources = new Map(clusters.map(c => [c.color, c.members.map(m => m.group.color)]))
  const unchanged = clusters.length === parsed.length && clusters.every(c =>
    c.members.length === 1 && c.color === c.members[0].group.color
    && c.members[0].kept.length === c.members[0].group.shapes.length)

  const groups = unchanged ? parsed : clusters.map(clusterToGroup)
  const result = { groups, sources }
  lastRefined.set(parsed, { key, result })
  return result
}

function clusterToGroup(cluster: Cluster): ColorGroup {
  const pathCount = cluster.members.reduce((sum, m) => sum + m.group.pathCount, 0)
  const shapes = cluster.members.flatMap(m => m.kept.map(i => m.group.shapes[i]))
  if (cluster.members.length === 1) return { id: cluster.color, color: cluster.color, shapes, pathCount }
  // Parsed regions never overlap, but merged colors often touch; the union
  // joins them so the inlay has no internal walls.
  const polygons = shapes.map(shapeToPolygon).filter(p => p.length > 0)
  const merged = polygons.length ? polygonClipping.union(polygons).map(polygonToShape) : []
  return { id: cluster.color, color: cluster.color, shapes: merged, pathCount }
}

/**
 * Agglomerative merge: while the two closest colors are within `tolerance` or
 * there are more than `maxColors`, the smaller (by area) joins the larger and
 * takes its color, so the result keeps colors that are really in the logo.
 */
function mergeClusters(clusters: Cluster[], tolerance: number, maxColors: number) {
  while (clusters.length > 1) {
    let best = { i: 0, j: 1, distance: Infinity }
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const distance = deltaE(clusters[i].color, clusters[j].color)
        if (distance < best.distance) best = { i, j, distance }
      }
    }
    const overLimit = maxColors > 0 && clusters.length > maxColors
    if (!overLimit && !(tolerance > 0 && best.distance <= tolerance)) break

    const [a, b] = [clusters[best.i], clusters[best.j]]
    const [keep, drop] = a.area >= b.area ? [a, b] : [b, a]
    keep.members.push(...drop.members)
    keep.area += drop.area
    clusters.splice(clusters.indexOf(drop), 1)
  }
}

/** CIE76 color difference between two `#rrggbb` colors (≈2.3 is just noticeable). */
export function deltaE(a: string, b: string): number {
  const [l1, a1, b1] = hexToLab(a)
  const [l2, a2, b2] = hexToLab(b)
  return Math.hypot(l1 - l2, a1 - a2, b1 - b2)
}

function hexToLab(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  // sRGB → XYZ (D65), normalized by the white point.
  const x = (0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047
  const y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b
  const z = (0.0193339 * r + 0.119192 * g + 0.9503041 * b) / 1.08883
  const f = (t: number) => (t > (6 / 29) ** 3 ? Math.cbrt(t) : t / (3 * (6 / 29) ** 2) + 4 / 29)
  const [fx, fy, fz] = [f(x), f(y), f(z)]
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)]
}

const areaCache = new WeakMap<THREE.Shape, number>()

/** Filled area of a shape (outer minus holes), in SVG units². */
export function shapeArea(shape: THREE.Shape): number {
  let area = areaCache.get(shape)
  if (area === undefined) {
    const { shape: outer, holes } = shape.extractPoints(16)
    area = ringArea(outer) - holes.reduce((sum, hole) => sum + ringArea(hole), 0)
    areaCache.set(shape, area)
  }
  return area
}

function ringArea(points: THREE.Vector2[]): number {
  return Math.abs(THREE.ShapeUtils.area(points))
}

export interface SpeckResult {
  groups: ColorGroup[]
  /** Pieces dropped plus holes filled. */
  removed: number
}

const lastSpecks = new WeakMap<ColorGroup[], { key: string; result: SpeckResult }>()

/**
 * Drops pieces smaller than `minArea` (SVG units²) and fills holes smaller
 * than it. A hole is at least as big as everything inside it, so filling one
 * never overlaps a piece that was kept. The caller converts mm² to SVG units
 * with the scale the logo is printed at.
 */
export function removeSpecks(groups: ColorGroup[], minArea: number): SpeckResult {
  if (!(minArea > 0)) return { groups, removed: 0 }

  const plan = groups.map(group => group.shapes.map((shape) => {
    const { shape: outer, holes } = shape.extractPoints(16)
    if (ringArea(outer) < minArea) return null
    return holes.map((hole, i) => (ringArea(hole) < minArea ? i : -1)).filter(i => i >= 0)
  }))
  const removed = plan.flat().reduce((sum, filled) => sum + (filled === null ? 1 : filled.length), 0)
  if (removed === 0) return { groups, removed }

  const key = JSON.stringify(plan)
  const cached = lastSpecks.get(groups)
  if (cached?.key === key) return cached.result

  const result: SpeckResult = {
    removed,
    groups: groups.flatMap((group, g) => {
      const shapes = group.shapes.flatMap((shape, s) => {
        const filled = plan[g][s]
        if (filled === null) return []
        if (filled.length === 0) return [shape]
        const { shape: outer, holes } = shape.extractPoints(16)
        const kept = new THREE.Shape(outer)
        holes.forEach((hole, i) => { if (!filled.includes(i)) kept.holes.push(new THREE.Path(hole)) })
        return [kept]
      })
      return shapes.length ? [{ ...group, shapes }] : []
    }),
  }
  lastSpecks.set(groups, { key, result })
  return result
}
