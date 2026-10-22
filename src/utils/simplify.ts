import * as THREE from 'three'
import type { ColorGroup } from '../types/keychain'

/**
 * Outline simplification that keeps neighboring colors sealed.
 *
 * Each ring is reduced with Ramer–Douglas–Peucker: a point is dropped when
 * the outline moves by less than the tolerance without it. Simplifying every
 * ring on its own would open gaps and overlaps where two colors share a
 * border, because each side drops different points. So the rings are joined
 * into one planar graph first:
 *
 *   - points closer than a hair are merged into one vertex, and a vertex
 *     lying on another ring's edge is inserted into that edge (polygon-clipping
 *     leaves such T-junctions where three regions meet);
 *   - vertices where borders meet or split (not exactly two neighbors) are
 *     pinned, and the borders between them are simplified once, for every
 *     ring that runs along them.
 *
 * A ring left with under three points was thinner than the tolerance; it's
 * dropped, and its neighbors, simplified along the same borders, close over it.
 */

interface Graph {
  xs: Float64Array
  ys: Float64Array
  /** Rings as vertex ids, per group, per shape: [outer, ...holes]. */
  rings: number[][][][]
  /** Two distinct neighbors per degree-2 vertex; null for pinned vertices. */
  neighbors: ([number, number] | null)[]
  vertexCount: number
  pointCount: number
}

export interface SimplifyResult {
  groups: ColorGroup[]
  /** Outline points before and after. */
  before: number
  after: number
}

/**
 * "1,279 → 236 outline points (−82%)." The count can rise: shared borders gain
 * the T-junction vertices that keep neighbors sealed, so near-zero tolerances
 * on logos with many meeting colors may end up with more points than they had.
 */
export function outlinePointsNote({ before, after }: { before: number; after: number }): string {
  if (before === 0) return ''
  const fmt = (n: number) => n.toLocaleString('en-US')
  if (after === before) return `${fmt(before)} outline points.`
  const percent = Math.round(Math.abs(after - before) / before * 100)
  const change = percent ? ` (${after < before ? '−' : '+'}${percent}%)` : ''
  return `${fmt(before)} → ${fmt(after)} outline points${change}.`
}

const graphs = new WeakMap<ColorGroup[], Graph>()
const lastResult = new WeakMap<ColorGroup[], { keep: Uint8Array; result: SimplifyResult }>()

/**
 * Simplifies every outline to within `tolerance` (SVG units). Returns the same
 * array (by identity) as the last call for these groups when the same points
 * survive, and the groups themselves when the tolerance is off.
 */
export function simplifyGroups(groups: ColorGroup[], tolerance: number): SimplifyResult {
  const graph = graphFor(groups)
  if (!(tolerance > 0)) return { groups, before: graph.pointCount, after: graph.pointCount }

  const keep = keptVertices(graph, tolerance)
  const cached = lastResult.get(groups)
  if (cached && sameKeep(cached.keep, keep)) return cached.result

  let after = 0
  const simplified: ColorGroup[] = []
  groups.forEach((group, g) => {
    const shapes: THREE.Shape[] = []
    for (const [outer, ...holes] of graph.rings[g]) {
      const outerPoints = ringPoints(graph, outer, keep)
      if (!outerPoints) continue
      const shape = new THREE.Shape(outerPoints)
      after += outerPoints.length
      for (const hole of holes) {
        const points = ringPoints(graph, hole, keep)
        if (!points) continue
        shape.holes.push(new THREE.Path(points))
        after += points.length
      }
      shapes.push(shape)
    }
    if (shapes.length) simplified.push({ ...group, shapes })
  })

  const result = { groups: simplified, before: graph.pointCount, after }
  lastResult.set(groups, { keep, result })
  return result
}

function ringPoints(graph: Graph, ring: number[], keep: Uint8Array): THREE.Vector2[] | null {
  const points: THREE.Vector2[] = []
  for (const v of ring) if (keep[v]) points.push(new THREE.Vector2(graph.xs[v], graph.ys[v]))
  return points.length >= 3 ? points : null
}

function sameKeep(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false
  return true
}

/** Which vertices survive simplification at `tolerance`. */
function keptVertices(graph: Graph, tolerance: number): Uint8Array {
  const { neighbors, vertexCount } = graph
  const keep = new Uint8Array(vertexCount)
  const visited = new Uint8Array(vertexCount)
  const tol2 = tolerance * tolerance

  // Walks a border from `start` through `first` until the next pinned vertex
  // (or back to `start`, for a loop) and simplifies it.
  const walk = (start: number, first: number) => {
    const chain = [start, first]
    let [prev, cur] = [start, first]
    visited[first] = 1
    for (;;) {
      const [a, b] = neighbors[cur]!
      const next = a === prev ? b : a
      chain.push(next)
      if (next === start || !neighbors[next]) break
      visited[next] = 1
      ;[prev, cur] = [cur, next]
    }
    simplifyChain(graph, chain, tol2, keep)
  }

  for (let v = 0; v < vertexCount; v++) {
    if (neighbors[v]) continue
    keep[v] = 1
  }
  // Borders between pinned vertices. Pinned vertices have no neighbor list, so
  // find each border from its first degree-2 vertex instead.
  for (let v = 0; v < vertexCount; v++) {
    const pair = neighbors[v]
    if (!pair || visited[v]) continue
    const pinnedEnd = pair.find(n => !neighbors[n])
    if (pinnedEnd !== undefined) walk(pinnedEnd, v)
  }
  // What's left are closed loops with no pinned vertex (an island, or a hole
  // filled by one other color): pin one point and walk round.
  for (let v = 0; v < vertexCount; v++) {
    if (!neighbors[v] || visited[v]) continue
    keep[v] = 1
    visited[v] = 1
    walk(v, neighbors[v]![0])
  }
  return keep
}

/** RDP over a chain of vertex ids with fixed ends; a loop (start = end) is split at its farthest point. */
function simplifyChain(graph: Graph, chain: number[], tol2: number, keep: Uint8Array) {
  const last = chain.length - 1
  if (last < 2) return
  const { xs, ys } = graph
  const stack: [number, number][] = []

  if (chain[0] === chain[last]) {
    const s = chain[0]
    let far = 1
    let farDist = -1
    for (let i = 1; i < last; i++) {
      const d = (xs[chain[i]] - xs[s]) ** 2 + (ys[chain[i]] - ys[s]) ** 2
      if (d > farDist) [far, farDist] = [i, d]
    }
    keep[chain[far]] = 1
    stack.push([0, far], [far, last])
  } else {
    stack.push([0, last])
  }

  while (stack.length) {
    const [i, j] = stack.pop()!
    if (j - i < 2) continue
    const a = chain[i]
    const b = chain[j]
    let worst = -1
    let worstDist = tol2
    for (let k = i + 1; k < j; k++) {
      const d = segmentDistance2(xs[chain[k]], ys[chain[k]], xs[a], ys[a], xs[b], ys[b])
      if (d > worstDist) [worst, worstDist] = [k, d]
    }
    if (worst < 0) continue
    keep[chain[worst]] = 1
    stack.push([i, worst], [worst, j])
  }
}

function segmentDistance2(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax
  const dy = by - ay
  const len2 = dx * dx + dy * dy
  const t = len2 > 0 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2)) : 0
  return (px - ax - t * dx) ** 2 + (py - ay - t * dy) ** 2
}

/** Builds (once per groups array) the shared-vertex graph of every ring. */
function graphFor(groups: ColorGroup[]): Graph {
  let graph = graphs.get(groups)
  if (graph) return graph

  const raw = groups.map(group => group.shapes.map((shape) => {
    const { shape: outer, holes } = shape.extractPoints(16)
    return [outer, ...holes]
  }))

  const box = new THREE.Box2()
  let pointCount = 0
  for (const shapes of raw) for (const rings of shapes) for (const ring of rings) {
    for (const p of ring) box.expandByPoint(p)
    pointCount += ring.length
  }
  const size = box.isEmpty() ? 1 : Math.max(box.max.x - box.min.x, box.max.y - box.min.y) || 1
  // Points this close are the same point, computed twice by polygon-clipping.
  const snap = size * 1e-9

  const xs: number[] = []
  const ys: number[] = []
  const snapGrid = new Map<string, number[]>()
  const vertexId = (p: THREE.Vector2): number => {
    const cx = Math.floor(p.x / snap)
    const cy = Math.floor(p.y / snap)
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
      for (const v of snapGrid.get(`${cx + i},${cy + j}`) ?? []) {
        if (Math.abs(xs[v] - p.x) <= snap && Math.abs(ys[v] - p.y) <= snap) return v
      }
    }
    const v = xs.length
    xs.push(p.x)
    ys.push(p.y)
    const key = `${cx},${cy}`
    const cell = snapGrid.get(key)
    if (cell) cell.push(v)
    else snapGrid.set(key, [v])
    return v
  }

  let rings = raw.map(shapes => shapes.map(shapeRings => shapeRings.map((ring) => {
    const ids: number[] = []
    for (const p of ring) {
      const v = vertexId(p)
      if (ids[ids.length - 1] !== v) ids.push(v)
    }
    while (ids.length > 1 && ids[0] === ids[ids.length - 1]) ids.pop()
    return ids
  })))

  rings = insertTJunctions(rings, xs, ys, size, snap)

  // Distinct neighbors per vertex; anything but exactly two is pinned.
  const vertexCount = xs.length
  const adjacent: Set<number>[] = Array.from({ length: vertexCount }, () => new Set())
  for (const shapes of rings) for (const shapeRings of shapes) for (const ring of shapeRings) {
    if (ring.length < 3) continue
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i]
      const b = ring[(i + 1) % ring.length]
      adjacent[a].add(b)
      adjacent[b].add(a)
    }
  }
  const neighbors = adjacent.map(set => (set.size === 2 ? [...set] as [number, number] : null))

  graph = { xs: Float64Array.from(xs), ys: Float64Array.from(ys), rings, neighbors, vertexCount, pointCount }
  graphs.set(groups, graph)
  return graph
}

/** Splits every ring edge at the vertices (from any ring) that lie on it. */
function insertTJunctions(rings: number[][][][], xs: number[], ys: number[], size: number, snap: number): number[][][][] {
  const n = xs.length
  if (n === 0) return rings
  const cell = size / Math.max(1, Math.sqrt(n))
  const grid = new Map<string, number[]>()
  for (let v = 0; v < n; v++) {
    const key = `${Math.floor(xs[v] / cell)},${Math.floor(ys[v] / cell)}`
    const bucket = grid.get(key)
    if (bucket) bucket.push(v)
    else grid.set(key, [v])
  }

  const onEdge = (a: number, b: number): number[] => {
    const [ax, ay, bx, by] = [xs[a], ys[a], xs[b], ys[b]]
    const dx = bx - ax
    const dy = by - ay
    const len2 = dx * dx + dy * dy
    if (len2 === 0) return []
    const found: { v: number; t: number }[] = []
    const [x0, x1] = [Math.floor((Math.min(ax, bx) - snap) / cell), Math.floor((Math.max(ax, bx) + snap) / cell)]
    const [y0, y1] = [Math.floor((Math.min(ay, by) - snap) / cell), Math.floor((Math.max(ay, by) + snap) / cell)]
    for (let cx = x0; cx <= x1; cx++) for (let cy = y0; cy <= y1; cy++) {
      for (const v of grid.get(`${cx},${cy}`) ?? []) {
        if (v === a || v === b) continue
        const t = ((xs[v] - ax) * dx + (ys[v] - ay) * dy) / len2
        if (t <= 0 || t >= 1) continue
        if ((xs[v] - ax - t * dx) ** 2 + (ys[v] - ay - t * dy) ** 2 <= snap * snap) found.push({ v, t })
      }
    }
    return found.sort((p, q) => p.t - q.t).map(f => f.v)
  }

  return rings.map(shapes => shapes.map(shapeRings => shapeRings.map((ring) => {
    if (ring.length < 3) return ring
    const out: number[] = []
    for (let i = 0; i < ring.length; i++) {
      out.push(ring[i])
      for (const v of onEdge(ring[i], ring[(i + 1) % ring.length])) out.push(v)
    }
    return out
  })))
}
