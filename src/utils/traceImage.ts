import polygonClipping, { type Polygon } from 'polygon-clipping'
import { polygonToShape } from './svgToShapes'
import type { ColorGroup } from '../types/keychain'

/**
 * Basic raster → SVG tracing, for logos that only exist as a PNG.
 *
 *   1. Colors are quantized with k-means. Clusters that are only anti-aliasing
 *      (a blend of two bigger colors, found along their borders) or
 *      near-duplicates are folded into their neighbors, so `colors` is a
 *      maximum, not a target.
 *   2. Lone pixels and one-pixel hairlines are smoothed away, and the
 *      background (the corners' color, where it touches the border) is
 *      dropped unless the image is already transparent.
 *   3. The borders between colors are traced along pixel edges as one shared
 *      graph and smoothed once each, for the colors on both sides, so
 *      neighbors stay sealed: Gaussian smoothing and simplification take out
 *      the pixel staircase, corners are found and put back where their edges
 *      meet, and the rest is rounded off with curves (as Potrace does).
 *
 * Coordinates are pixels; the app sizes the logo to the plate anyway.
 */

export interface RasterImage {
  width: number
  height: number
  /** RGBA, row by row, as in `ImageData`. */
  data: Uint8ClampedArray
}

export interface TraceOptions {
  /** At most this many printed colors: a background that is removed doesn't count. */
  colors: number
  /** Drop the color that fills the image border. */
  removeBackground: boolean
  /**
   * How much outlines are smoothed, in pixels (a Gaussian's sigma). From about
   * 0.5 the pixel staircase is gone; more evens out wobbles, and past 2 starts
   * to soften small corners too.
   */
  smoothing: number
  /**
   * Corners standing out less than this many times the outline tolerance from
   * a smooth curve through their neighbors are rounded off; higher rounds more.
   */
  roundness: number
  /** Snap edges within a few degrees of level or plumb to exactly level or plumb. */
  straighten: boolean
}

export const DEFAULT_TRACE_OPTIONS: TraceOptions = {
  colors: 5,
  removeBackground: true,
  smoothing: 1,
  roundness: 3,
  straighten: true,
}

/** Images are scaled so their longer side is this many pixels before tracing. */
export const TRACE_SIZE = 512

const TRANSPARENT = -1

export function traceImage(image: RasterImage, options: Partial<TraceOptions> = {}): string {
  const opts = { ...DEFAULT_TRACE_OPTIONS, ...options }
  const { width, height } = image
  // The background gets its own cluster when it's going to be dropped.
  const dropsBackground = opts.removeBackground && !hasTransparentBorder(image)
  const { labels, palette } = quantize(image, Math.max(1, Math.round(opts.colors)) + (dropsBackground ? 1 : 0))
  smoothLabels(labels, width, height)
  if (opts.removeBackground) removeBackground(labels, width, height)

  const outline = smoothOutlines(labels, width, height, opts)
  const groups: ColorGroup[] = []
  palette.forEach((color, label) => {
    const rings = traceLabel(labels, width, height, label)
      .map(ring => ringPoints(ring, outline))
      .filter(ring => ring.length >= 3)
    if (rings.length === 0) return
    // The rings are the region's edges split into loops; even-odd over them is the region.
    const [first, ...rest] = rings.map((r): Polygon => [r])
    const geom = polygonClipping.xor(first, ...rest)
    if (geom.length === 0) return
    groups.push({ id: color, color, shapes: geom.map(polygonToShape), pathCount: 1 })
  })

  return toSvg(groups, width, height)
}

// ─── Color quantization ──────────────────────────────────────────────────────

/** Center distance below which two clusters are one color (RGB, 0–255). */
const SAME_COLOR = 28
/** An anti-aliasing cluster lies within this distance of the line between two others… */
const BLEND_DISTANCE = 32
/** …and most of its pixels sit on a border, where colors blend. */
const BLEND_EDGE_SHARE = 0.6
/** Clusters with fewer pixels than this share are merged into their nearest neighbor. */
const MIN_SHARE = 0.002
const SAMPLE_COUNT = 20000
const ITERATIONS = 10

type Rgb = [number, number, number]

function quantize(image: RasterImage, maxColors: number): { labels: Int16Array; palette: string[] } {
  const { width, height, data } = image
  const pixelCount = width * height
  const labels = new Int16Array(pixelCount).fill(TRANSPARENT)

  const opaque: number[] = []
  for (let i = 0; i < pixelCount; i++) if (data[i * 4 + 3] >= 128) opaque.push(i)
  if (opaque.length === 0) return { labels, palette: [] }

  const stride = Math.max(1, Math.floor(opaque.length / SAMPLE_COUNT))
  const samples: Rgb[] = []
  for (let s = 0; s < opaque.length; s += stride) samples.push(rgbAt(data, opaque[s]))

  const centers = pruneCenters(image, opaque, labels, kMeans(samples, maxColors))
  const palette = centers.map(c => '#' + c.map(v => Math.round(v).toString(16).padStart(2, '0')).join(''))
  return { labels, palette }
}

function rgbAt(data: Uint8ClampedArray, pixel: number): Rgb {
  return [data[pixel * 4], data[pixel * 4 + 1], data[pixel * 4 + 2]]
}

function dist2(a: Rgb, b: Rgb): number {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2
}

function nearest(centers: Rgb[], c: Rgb): number {
  let best = 0
  let bestDist = Infinity
  for (let k = 0; k < centers.length; k++) {
    const d = dist2(centers[k], c)
    if (d < bestDist) [best, bestDist] = [k, d]
  }
  return best
}

/** Lloyd's k-means, seeded deterministically with farthest-point picks. */
function kMeans(samples: Rgb[], k: number): Rgb[] {
  const mean: Rgb = [0, 0, 0]
  for (const s of samples) for (let c = 0; c < 3; c++) mean[c] += s[c] / samples.length
  const centers: Rgb[] = [samples[nearest(samples, mean)]]
  const closest = samples.map(s => dist2(s, centers[0]))
  while (centers.length < k) {
    let far = 0
    for (let i = 1; i < samples.length; i++) if (closest[i] > closest[far]) far = i
    if (closest[far] === 0) break // fewer distinct colors than k
    centers.push(samples[far])
    for (let i = 0; i < samples.length; i++) closest[i] = Math.min(closest[i], dist2(samples[i], samples[far]))
  }

  let current = centers.map(c => [...c] as Rgb)
  for (let iter = 0; iter < ITERATIONS; iter++) {
    const { sums, counts } = accumulate(samples, current)
    let moved = false
    current = current.map((c, k) => {
      if (counts[k] === 0) return c
      const next: Rgb = [sums[k][0] / counts[k], sums[k][1] / counts[k], sums[k][2] / counts[k]]
      if (dist2(next, c) > 0.25) moved = true
      return next
    })
    if (!moved) break
  }
  return current
}

function accumulate(samples: Rgb[], centers: Rgb[]) {
  const sums = centers.map(() => [0, 0, 0] as Rgb)
  const counts = centers.map(() => 0)
  for (const s of samples) {
    const k = nearest(centers, s)
    counts[k]++
    for (let c = 0; c < 3; c++) sums[k][c] += s[c]
  }
  return { sums, counts }
}

interface ClusterStats {
  /** Mean color of the cluster's pixels. */
  center: Rgb
  size: number
  /** Share of its pixels with a 4-neighbor of another label (or transparency). */
  edgeShare: number
}

/**
 * Labels every opaque pixel, folding away near-duplicate, anti-aliasing and
 * negligible clusters one at a time (smallest first), relabeling after each.
 * Returns the mean color of each surviving label.
 */
function pruneCenters(image: RasterImage, opaque: number[], labels: Int16Array, initial: Rgb[]): Rgb[] {
  let centers = initial
  for (;;) {
    for (const i of opaque) labels[i] = nearest(centers, rgbAt(image.data, i))
    const stats = clusterStats(image, opaque, labels, centers.length)
    if (stats.some(s => s.size === 0)) {
      centers = centers.filter((_, k) => stats[k].size > 0)
      continue
    }
    const order = stats.map((_, k) => k).sort((a, b) => stats[a].size - stats[b].size)
    const victim = centers.length > 1 ? order.find(k => isRedundant(k, stats, opaque.length)) : undefined
    if (victim === undefined) return stats.map(s => s.center)
    centers = stats.map(s => s.center).filter((_, k) => k !== victim)
  }
}

function clusterStats(image: RasterImage, opaque: number[], labels: Int16Array, count: number): ClusterStats[] {
  const { width, height, data } = image
  const sums = Array.from({ length: count }, () => [0, 0, 0] as Rgb)
  const sizes = new Array<number>(count).fill(0)
  const edges = new Array<number>(count).fill(0)
  for (const i of opaque) {
    const l = labels[i]
    sizes[l]++
    for (let c = 0; c < 3; c++) sums[l][c] += data[i * 4 + c]
    const x = i % width
    const y = (i - x) / width
    if (
      (x > 0 && labels[i - 1] !== l) || (x < width - 1 && labels[i + 1] !== l)
      || (y > 0 && labels[i - width] !== l) || (y < height - 1 && labels[i + width] !== l)
    ) edges[l]++
  }
  return sums.map((sum, k) => ({
    center: sum.map(v => v / Math.max(1, sizes[k])) as Rgb,
    size: sizes[k],
    edgeShare: sizes[k] ? edges[k] / sizes[k] : 1,
  }))
}

function isRedundant(k: number, stats: ClusterStats[], total: number): boolean {
  const { center, size, edgeShare } = stats[k]
  if (size < total * MIN_SHARE) return true
  for (let j = 0; j < stats.length; j++) {
    if (j === k || stats[j].size < size) continue
    if (dist2(center, stats[j].center) < SAME_COLOR ** 2) return true
    if (edgeShare < BLEND_EDGE_SHARE) continue
    for (let l = j + 1; l < stats.length; l++) {
      if (l === k || stats[l].size < size) continue
      if (blendDistance2(center, stats[j].center, stats[l].center) < BLEND_DISTANCE ** 2) return true
    }
  }
  return false
}

/** Squared distance from `p` to the segment a–b, excluding its ends (a blend lies between). */
function blendDistance2(p: Rgb, a: Rgb, b: Rgb): number {
  let dot = 0
  let len2 = 0
  for (let c = 0; c < 3; c++) {
    dot += (p[c] - a[c]) * (b[c] - a[c])
    len2 += (b[c] - a[c]) ** 2
  }
  const t = len2 > 0 ? dot / len2 : 0
  if (t <= 0.1 || t >= 0.9) return Infinity
  let d = 0
  for (let c = 0; c < 3; c++) d += (p[c] - a[c] - t * (b[c] - a[c])) ** 2
  return d
}

// ─── Label cleanup ───────────────────────────────────────────────────────────

/**
 * Clears away specks and hairlines: a pixel with at most one same-label
 * neighbor (of 8), or one pixel thin (no same label on either side, across
 * or down), takes its neighbors' most common other label. Hairlines are
 * mostly anti-aliasing that happened to match a real color, and too thin to
 * print anyway.
 */
function smoothLabels(labels: Int16Array, width: number, height: number) {
  const source = labels.slice()
  const counts = new Map<number, number>()
  const at = (x: number, y: number) => (x >= 0 && y >= 0 && x < width && y < height ? source[y * width + x] : TRANSPARENT - 1)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const own = source[y * width + x]
      counts.clear()
      let same = 0
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue
        const nx = x + dx
        const ny = y + dy
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
        const l = source[ny * width + nx]
        if (l === own) same++
        else counts.set(l, (counts.get(l) ?? 0) + 1)
      }
      const thin = (at(x - 1, y) !== own && at(x + 1, y) !== own) || (at(x, y - 1) !== own && at(x, y + 1) !== own)
      if (same > 1 && !thin) continue
      let best = own
      let bestCount = 0
      for (const [l, n] of counts) if (n > bestCount) [best, bestCount] = [l, n]
      labels[y * width + x] = best
    }
  }
}

/**
 * Clears the background: the color most of the image's corners share, where
 * it's connected to the border. The same color inside the logo (white letters
 * on a white page) stays. An image with any transparency on its border has
 * no background left to remove; a frame drawn to the edge there is the logo.
 */
/** Whether a border pixel is transparent, in which case there is no background to remove. */
function hasTransparentBorder({ width, height, data }: RasterImage): boolean {
  const transparent = (x: number, y: number) => data[(y * width + x) * 4 + 3] < 128
  for (let x = 0; x < width; x++) if (transparent(x, 0) || transparent(x, height - 1)) return true
  for (let y = 1; y < height - 1; y++) if (transparent(0, y) || transparent(width - 1, y)) return true
  return false
}

function removeBackground(labels: Int16Array, width: number, height: number) {
  const border: number[] = []
  for (let x = 0; x < width; x++) border.push(x, (height - 1) * width + x)
  for (let y = 1; y < height - 1; y++) border.push(y * width, y * width + width - 1)
  if (border.some(i => labels[i] === TRANSPARENT)) return

  const corners = [0, width - 1, (height - 1) * width, height * width - 1].map(i => labels[i])
  const votes = (l: number) => corners.filter(c => c === l).length
  const background = corners.reduce((best, l) => (votes(l) > votes(best) ? l : best))

  // Flood fill (4-connected) from every border pixel of the background color.
  const stack = border.filter(i => labels[i] === background)
  for (const i of stack) labels[i] = TRANSPARENT
  while (stack.length) {
    const i = stack.pop()!
    const x = i % width
    for (const n of [x > 0 ? i - 1 : -1, x < width - 1 ? i + 1 : -1, i - width, i + width]) {
      if (n < 0 || n >= labels.length || labels[n] !== background) continue
      labels[n] = TRANSPARENT
      stack.push(n)
    }
  }
}

// ─── Outline tracing ─────────────────────────────────────────────────────────

interface Outline {
  /** Each pixel corner's position (corner id: y * (width + 1) + x), after smoothing. */
  xs: Float64Array
  ys: Float64Array
  /** Corners that are outline points after simplification. */
  keep: Uint8Array
  /**
   * Kept corners that are rounded off: the points of the curve that replaces
   * them (flat x, y), running from the side of `curveFrom`'s corner.
   */
  curves: Map<number, number[]>
  curveFrom: Map<number, number>
}

/**
 * Smooths every border between two regions (or a region and transparency)
 * once, for the regions on both sides, so neighboring colors stay sealed.
 *
 * The borders form a graph on the pixel-corner grid. Corners where three or
 * more regions meet, or where diagonal pixels touch, are junctions and stay
 * put. Each border between junctions (or each loop) is processed on its own,
 * in `smoothChain`.
 */
function smoothOutlines(labels: Int16Array, width: number, height: number, opts: TraceOptions): Outline {
  const stride = width + 1
  const count = stride * (height + 1)
  const xs = new Float64Array(count)
  const ys = new Float64Array(count)
  for (let v = 0; v < count; v++) {
    xs[v] = v % stride
    ys[v] = Math.floor(v / stride)
  }
  const keep = new Uint8Array(count)
  const outline: Outline = { xs, ys, keep, curves: new Map(), curveFrom: new Map() }
  const at = (x: number, y: number) => (x >= 0 && y >= 0 && x < width && y < height ? labels[y * width + x] : TRANSPARENT)

  // The two border neighbors of each corner on exactly one border; junctions are pinned.
  const links = new Int32Array(count * 2).fill(NONE)
  const pinned = new Uint8Array(count)
  for (let y = 0; y <= height; y++) {
    for (let x = 0; x <= width; x++) {
      const v = y * stride + x
      const [a, b, c, d] = [at(x - 1, y - 1), at(x, y - 1), at(x - 1, y), at(x, y)]
      let n = 0
      const link = (w: number) => { if (n < 2) links[2 * v + n] = w; n++ }
      if (a !== b) link(v - stride)
      if (c !== d) link(v + stride)
      if (a !== c) link(v - 1)
      if (b !== d) link(v + 1)
      if (n > 2) pinned[v] = keep[v] = 1
    }
  }
  const onBorder = (v: number) => links[2 * v] !== NONE && !pinned[v]

  const visited = new Uint8Array(count)
  const walk = (start: number, first: number) => {
    const chain = [start, first]
    visited[first] = 1
    let [prev, cur] = [start, first]
    for (;;) {
      const a = links[2 * cur]
      const next = a === prev ? links[2 * cur + 1] : a
      chain.push(next)
      if (next === start || pinned[next]) break
      visited[next] = 1
      ;[prev, cur] = [cur, next]
    }
    smoothChain(chain, !pinned[start], outline, opts)
  }
  for (let v = 0; v < count; v++) {
    if (!onBorder(v) || visited[v]) continue
    const end = [links[2 * v], links[2 * v + 1]].find(n => pinned[n])
    if (end !== undefined) walk(end, v)
  }
  // Loops with no junction: an island, or a hole filled by one other color.
  for (let v = 0; v < count; v++) {
    if (!onBorder(v) || visited[v]) continue
    visited[v] = 1
    walk(v, links[2 * v])
  }
  return outline
}

/**
 * Smooths and simplifies one border, writing the new corner positions, marking
 * the kept ones, and recording the curves that round off all but its corners.
 * A chain runs junction to junction, or round a loop (`closed`, first id
 * repeated at the end) with no fixed point.
 *
 * The pixel staircase is Gaussian-smoothed with the ends fixed and reduced
 * with Ramer–Douglas–Peucker, which leaves a polygon. Its corners are found
 * (`sharpenCorners`) and put back where their edges meet (`placeVertices`),
 * since smoothing rounds them off; every other point becomes a curve.
 */
function smoothChain(ids: number[], closed: boolean, outline: Outline, opts: TraceOptions) {
  const { xs, ys, keep } = outline
  const n = ids.length - 1 // points, not counting a closed loop's repeat
  const px = Float64Array.from(ids, v => xs[v])
  const py = Float64Array.from(ids, v => ys[v])
  const [rx, ry] = [px.slice(), py.slice()]
  const smoothing = Math.max(0, opts.smoothing)
  // Enough to drop the stairs the smoothing leaves (a pixel's worth unsmoothed);
  // more smoothing also lets edges straighten over longer wobbles.
  const tolerance = 0.4 + 0.35 * smoothing
  const tol2 = tolerance * tolerance
  const iterations = Math.round(2 * smoothing * smoothing)
  const sharp = new Set<number>()
  if (closed) {
    smoothRun(px, py, 0, n, iterations, true)
    // Pin one point and its farthest, as the ends of two open halves.
    let far = 1
    let farDist = -1
    for (let i = 1; i < n; i++) {
      const d = (px[i] - px[0]) ** 2 + (py[i] - py[0]) ** 2
      if (d > farDist) [far, farDist] = [i, d]
    }
    px[n] = px[0]
    py[n] = py[0]
    for (const i of [0, far]) keep[ids[i]] = 1
    rdp(ids, px, py, 0, far, tol2, keep)
    rdp(ids, px, py, far, n, tol2, keep)
  } else {
    smoothRun(px, py, 0, n, iterations, false)
    rdp(ids, px, py, 0, n, tol2, keep)
    keep[ids[0]] = keep[ids[n]] = 1
    sharp.add(0).add(n)
  }

  // The simplified polygon, as indices into the chain (cyclic when closed).
  let kept: number[] = []
  for (let i = 0; i < (closed ? n : ids.length); i++) if (keep[ids[i]]) kept.push(i)
  const blunt = BLUNT_CORNER + smoothing
  kept = sharpenCorners(kept, closed, px, py, sharp, opts.roundness * tolerance, blunt, keep, ids)
  placeVertices(kept, closed, rx, ry, px, py, sharp, blunt, 2 * tolerance)
  if (opts.straighten) straighten(kept, closed, px, py)

  for (let i = 0; i < (closed ? n : ids.length); i++) {
    xs[ids[i]] = px[i]
    ys[ids[i]] = py[i]
  }

  // Round off every kept point but the corners.
  const m = kept.length
  if (m < 3) return
  for (let k = closed ? 0 : 1; k < (closed ? m : m - 1); k++) {
    const [a, v, b] = [kept[(k + m - 1) % m], kept[k], kept[(k + 1) % m]]
    if (sharp.has(v)) continue
    outline.curves.set(ids[v], roundCorner(px[a], py[a], px[v], py[v], px[b], py[b]))
    outline.curveFrom.set(ids[v], ids[a])
  }
}

/**
 * A corner that anti-aliasing cut off (and smoothing rounded) is restored when
 * its edges meet within this distance of the cut, plus the smoothing (pixels)…
 */
const BLUNT_CORNER = 2
/** …and the cut's two points together turn at least this much (degrees). */
const BLUNT_TURN = 60

/** Signed turn at b from a→b to b→c, in degrees. */
function turnAt(px: Float64Array, py: Float64Array, a: number, b: number, c: number): number {
  const [ux, uy, vx, vy] = [px[b] - px[a], py[b] - py[a], px[c] - px[b], py[c] - py[b]]
  return (Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy) * 180) / Math.PI
}

/**
 * Finds the polygon's corners, adding them to `sharp`. A point is a corner
 * when it stands out more than `threshold` pixels from the line between the
 * middles of its two edges, which a smooth curve sampled within the
 * simplification tolerance never does (Potrace's test). A corner that
 * anti-aliasing cut off shows up as two close points between long edges; it's
 * restored by moving the first to where those edges meet and dropping the
 * second. Returns the polygon left.
 */
function sharpenCorners(
  kept: number[], closed: boolean, px: Float64Array, py: Float64Array,
  sharp: Set<number>, threshold: number, blunt: number, keep: Uint8Array, ids: number[],
): number[] {
  const m = kept.length
  if (m < 3) return kept
  const at = (k: number) => kept[closed ? (k + m) % m : k]
  const dist = (i: number, j: number) => Math.hypot(px[i] - px[j], py[i] - py[j])
  const dropped = new Set<number>()
  const [first, last] = closed ? [0, m] : [1, m - 1] // interior points, end exclusive

  for (let k = first; k + (closed ? 0 : 1) < last; k++) {
    const [a, v, w, b] = [at(k - 1), at(k), at(k + 1), at(k + 2)]
    if (closed && m < 4) break
    if (sharp.has(v) || sharp.has(w) || dropped.has(v) || dropped.has(w)) continue
    // Straight edges on both sides, much longer than the cut (a curve has even steps).
    const gap = dist(v, w)
    if (dist(a, v) < 2 * gap || dist(w, b) < 2 * gap) continue
    const t1 = turnAt(px, py, a, v, w)
    const t2 = turnAt(px, py, v, w, b)
    if (Math.sign(t1) !== Math.sign(t2) || Math.abs(t1 + t2) < BLUNT_TURN) continue
    const meet = intersect(px[a], py[a], px[v], py[v], px[w], py[w], px[b], py[b])
    if (!meet || Math.hypot(meet[0] - px[v], meet[1] - py[v]) > blunt) continue
    if (Math.hypot(meet[0] - px[w], meet[1] - py[w]) > blunt) continue
    ;[px[v], py[v]] = meet
    sharp.add(v)
    dropped.add(w)
    keep[ids[w]] = 0
  }
  const left = dropped.size ? kept.filter(i => !dropped.has(i)) : kept

  const n = left.length
  for (let k = closed ? 0 : 1; k < (closed ? n : n - 1); k++) {
    const [a, v, b] = [left[(k + n - 1) % n], left[k], left[(k + 1) % n]]
    if (sharp.has(v)) continue
    // Distance from v to the line through the middles of its edges: half the
    // distance from v to the line a–b, because that line is parallel and halfway.
    const [dx, dy] = [px[b] - px[a], py[b] - py[a]]
    const len = Math.hypot(dx, dy)
    const off = len > 0 ? Math.abs((px[v] - px[a]) * dy - (py[v] - py[a]) * dx) / len / 2 : dist(v, a) / 2
    if (off > threshold) sharp.add(v)
  }
  return left
}

/** Edges within this many degrees of level or plumb are straightened… */
const STRAIGHTEN_ANGLE = 3
/** …if at least this long (pixels): shorter ones can't tell a tilt from a curve. */
const STRAIGHTEN_MIN = 6

/**
 * Snaps nearly level or plumb edges to exactly level or plumb, by moving both
 * ends to their mean. A traced vertical stroke otherwise leans by a pixel or
 * so, wherever anti-aliasing tipped a column one way.
 */
function straighten(kept: number[], closed: boolean, px: Float64Array, py: Float64Array) {
  const m = kept.length
  const limit = Math.tan((STRAIGHTEN_ANGLE * Math.PI) / 180)
  for (let k = 0; k < (closed ? m : m - 1); k++) {
    const [a, b] = [kept[k], kept[(k + 1) % m]]
    const [dx, dy] = [Math.abs(px[b] - px[a]), Math.abs(py[b] - py[a])]
    if (Math.hypot(dx, dy) < STRAIGHTEN_MIN) continue
    if (dy <= dx * limit) py[a] = py[b] = (py[a] + py[b]) / 2
    else if (dx <= dy * limit) px[a] = px[b] = (px[a] + px[b]) / 2
  }
}

/** Points this close (steps along the border) to a corner are left out of its edges' line fits. */
const FIT_MARGIN = 2

/**
 * Moves each polygon point to where lines fitted to its two edges meet, as
 * Potrace does. A corner's edges are fitted to the unsmoothed pixel border
 * (smoothing rounded it off, and the polygon then cut it short), and it moves
 * at most `cornerReach`. A rounded-off point's edges are fitted to the
 * smoothed border, which they otherwise cut inside of, so curves would shrink;
 * it moves at most `curveReach`. Points whose edges are too short to fit, or
 * that would move too far, stay.
 */
function placeVertices(
  kept: number[], closed: boolean, rx: Float64Array, ry: Float64Array,
  px: Float64Array, py: Float64Array, sharp: Set<number>, cornerReach: number, curveReach: number,
) {
  const m = kept.length
  const n = closed ? rx.length - 1 : rx.length
  if (m < 3) return
  // A least-squares line through points i..j (stepping forward, wrapping when closed).
  const fit = (xs: Float64Array, ys: Float64Array, i: number, j: number, margin: number) => {
    if (j < i) j += n
    const from = i + margin
    const to = j - margin
    if (to - from < 2) return null
    let [sx, sy] = [0, 0]
    for (let k = from; k <= to; k++) [sx, sy] = [sx + xs[k % n], sy + ys[k % n]]
    const count = to - from + 1
    const [cx, cy] = [sx / count, sy / count]
    let [sxx, sxy, syy] = [0, 0, 0]
    for (let k = from; k <= to; k++) {
      const [dx, dy] = [xs[k % n] - cx, ys[k % n] - cy]
      ;[sxx, sxy, syy] = [sxx + dx * dx, sxy + dx * dy, syy + dy * dy]
    }
    const angle = Math.atan2(2 * sxy, sxx - syy) / 2
    return [cx, cy, cx + Math.cos(angle), cy + Math.sin(angle)] as const
  }
  const moves: [number, [number, number]][] = []
  for (let k = closed ? 0 : 1; k < (closed ? m : m - 1); k++) {
    const v = kept[k]
    const corner = sharp.has(v)
    const [xs, ys, margin] = corner ? [rx, ry, FIT_MARGIN] : [px, py, 0]
    const before = fit(xs, ys, kept[(k + m - 1) % m], v, margin)
    const after = fit(xs, ys, v, kept[(k + 1) % m], margin)
    if (!before || !after) continue
    const meet = intersect(...before, ...after)
    if (meet && Math.hypot(meet[0] - px[v], meet[1] - py[v]) <= (corner ? cornerReach : curveReach)) moves.push([v, meet])
  }
  for (const [v, [x, y]] of moves) [px[v], py[v]] = [x, y]
}

/** Where line a1–a2 meets line b1–b2, or null if they're (nearly) parallel. */
function intersect(
  a1x: number, a1y: number, a2x: number, a2y: number, b1x: number, b1y: number, b2x: number, b2y: number,
): [number, number] | null {
  const [dax, day, dbx, dby] = [a2x - a1x, a2y - a1y, b2x - b1x, b2y - b1y]
  const denom = dax * dby - day * dbx
  if (Math.abs(denom) < 1e-9 * Math.hypot(dax, day) * Math.hypot(dbx, dby)) return null
  const t = ((b1x - a1x) * dby - (b1y - a1y) * dbx) / denom
  return [a1x + t * dax, a1y + t * day]
}

/** Max distance of a rounded-off curve from its polyline, in pixels. */
const CURVE_FLATNESS = 0.05

/**
 * The curve that rounds off corner v between a and b: a quadratic Bézier with
 * v as its control point, from the middle of a–v to the middle of v–b, where
 * the next corner's curve takes over, so a run of rounded corners is one
 * smooth curve. It strays at most half as far from the polygon as v stands
 * out from the line between those middles, which `sharpenCorners` bounds.
 */
function roundCorner(ax: number, ay: number, vx: number, vy: number, bx: number, by: number): number[] {
  const [x0, y0, x2, y2] = [(ax + vx) / 2, (ay + vy) / 2, (vx + bx) / 2, (vy + by) / 2]
  // With its control point h off the chord, a quadratic split into n even
  // steps strays about h / (2n²) from them.
  const chord = Math.hypot(x2 - x0, y2 - y0)
  const h = chord > 0 ? Math.abs((vx - x0) * (y2 - y0) - (vy - y0) * (x2 - x0)) / chord : 0
  const steps = Math.max(1, Math.ceil(Math.sqrt(h / (2 * CURVE_FLATNESS))))
  const points: number[] = []
  for (let s = 0; s <= steps; s++) {
    const t = s / steps
    const [w0, w1, w2] = [(1 - t) * (1 - t), 2 * t * (1 - t), t * t]
    points.push(w0 * x0 + w1 * vx + w2 * x2, w0 * y0 + w1 * vy + w2 * y2)
  }
  return points
}

/**
 * Laplacian smoothing (weights 1/4, 1/2, 1/4) of points i..j, repeated:
 * `iterations` passes approximate a Gaussian with sigma √(iterations / 2).
 * The ends stay fixed, unless `cyclic` (then i..j-1 is a loop).
 */
function smoothRun(px: Float64Array, py: Float64Array, i: number, j: number, iterations: number, cyclic: boolean) {
  const len = j - i + (cyclic ? 0 : 1)
  if (len < 3) return
  const x = px.slice(i, i + len)
  const y = py.slice(i, i + len)
  const nx = new Float64Array(len)
  const ny = new Float64Array(len)
  for (let it = 0; it < iterations; it++) {
    for (let k = 0; k < len; k++) {
      if (!cyclic && (k === 0 || k === len - 1)) {
        nx[k] = x[k]
        ny[k] = y[k]
        continue
      }
      const a = cyclic ? (k + len - 1) % len : k - 1
      const b = cyclic ? (k + 1) % len : k + 1
      nx[k] = (x[a] + 2 * x[k] + x[b]) / 4
      ny[k] = (y[a] + 2 * y[k] + y[b]) / 4
    }
    x.set(nx)
    y.set(ny)
  }
  px.set(x, i)
  py.set(y, i)
}

/** Ramer–Douglas–Peucker over points i..j (ends kept by the caller). */
function rdp(ids: number[], px: Float64Array, py: Float64Array, i0: number, j0: number, tol2: number, keep: Uint8Array) {
  const stack: [number, number][] = [[i0, j0]]
  while (stack.length) {
    const [i, j] = stack.pop()!
    if (j - i < 2) continue
    const [ax, ay, dx, dy] = [px[i], py[i], px[j] - px[i], py[j] - py[i]]
    const len2 = dx * dx + dy * dy
    let worst = -1
    let worstDist = tol2
    for (let k = i + 1; k < j; k++) {
      const t = len2 > 0 ? Math.max(0, Math.min(1, ((px[k] - ax) * dx + (py[k] - ay) * dy) / len2)) : 0
      const d = (px[k] - ax - t * dx) ** 2 + (py[k] - ay - t * dy) ** 2
      if (d > worstDist) [worst, worstDist] = [k, d]
    }
    if (worst < 0) continue
    keep[ids[worst]] = 1
    stack.push([i, worst], [worst, j])
  }
}

/** A traced ring's outline: its kept corners, with rounded-off ones replaced by their curves. */
function ringPoints(ring: number[], outline: Outline): [number, number][] {
  const kept = ring.filter(v => outline.keep[v])
  const points: [number, number][] = []
  const push = (x: number, y: number) => {
    const last = points[points.length - 1]
    if (!last || last[0] !== x || last[1] !== y) points.push([x, y])
  }
  kept.forEach((v, i) => {
    const curve = outline.curves.get(v)
    if (!curve) return push(outline.xs[v], outline.ys[v])
    const forward = outline.curveFrom.get(v) === kept[(i + kept.length - 1) % kept.length]
    const count = curve.length / 2
    for (let s = 0; s < count; s++) {
      const k = forward ? s : count - 1 - s
      push(curve[2 * k], curve[2 * k + 1])
    }
  })
  const [first, last] = [points[0], points[points.length - 1]]
  if (points.length > 1 && first[0] === last[0] && first[1] === last[1]) points.pop()
  return points
}

// Directions on the pixel-corner grid (y down): east, south, west, north.
const DX = [1, 0, -1, 0]
const DY = [0, 1, 0, -1]
const NONE = -1

/**
 * The boundary of one label's region as closed rings of corner ids. Every
 * boundary edge is directed with the region on its left, so the edges form
 * loops; at a corner where two diagonal pixels touch, turning left keeps them
 * apart.
 */
function traceLabel(labels: Int16Array, width: number, height: number, label: number): number[][] {
  const stride = width + 1
  // Up to two outgoing edges per corner (two only where diagonal pixels touch).
  const out1 = new Int8Array(stride * (height + 1)).fill(NONE)
  const out2 = new Int8Array(stride * (height + 1)).fill(NONE)
  const starts: number[] = []
  const addEdge = (x: number, y: number, dir: number) => {
    const v = y * stride + x
    if (out1[v] === NONE) out1[v] = dir
    else out2[v] = dir
    starts.push(v)
  }
  const is = (x: number, y: number) => x >= 0 && y >= 0 && x < width && y < height && labels[y * width + x] === label

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (labels[y * width + x] !== label) continue
      if (!is(x, y - 1)) addEdge(x + 1, y, 2)
      if (!is(x - 1, y)) addEdge(x, y, 1)
      if (!is(x, y + 1)) addEdge(x, y + 1, 0)
      if (!is(x + 1, y)) addEdge(x + 1, y + 1, 3)
    }
  }

  const take = (v: number, incoming: number): number => {
    let dir: number
    if (out2[v] === NONE) {
      dir = out1[v]
      out1[v] = NONE
    } else {
      // Two ways out: prefer the left turn.
      const left = (incoming + 3) % 4
      if (out1[v] === left) { dir = out1[v]; out1[v] = out2[v] } else dir = out2[v]
      out2[v] = NONE
    }
    return dir
  }

  const rings: number[][] = []
  for (const start of starts) {
    if (out1[start] === NONE) continue
    const ring: number[] = []
    let v = start
    let dir = take(v, out1[start])
    for (;;) {
      ring.push(v)
      v += DY[dir] * stride + DX[dir]
      if (v === start) break
      dir = take(v, dir)
    }
    if (ring.length >= 4) rings.push(ring)
  }
  return rings
}

// ─── Output ──────────────────────────────────────────────────────────────────

function toSvg(groups: ColorGroup[], width: number, height: number): string {
  const paths = groups.map((group) => {
    const rings = group.shapes.flatMap(shape => [shape.getPoints(), ...shape.holes.map(h => h.getPoints())])
    const d = rings
      .map(points => 'M' + points.map(p => `${round(p.x)} ${round(p.y)}`).join('L') + 'Z')
      .join('')
    return `  <path fill="${group.color}" fill-rule="evenodd" d="${d}"/>`
  })
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`,
    ...paths,
    '</svg>',
    '',
  ].join('\n')
}

function round(n: number): number {
  return Math.round(n * 100) / 100
}
