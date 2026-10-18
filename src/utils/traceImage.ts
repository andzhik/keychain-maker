import polygonClipping, { type Polygon } from 'polygon-clipping'
import { polygonToShape } from './svgToShapes'
import { simplifyGroups } from './simplify'
import type { ColorGroup } from '../types/keychain'

/**
 * Basic raster → SVG tracing, for logos that only exist as a PNG.
 *
 *   1. Colors are quantized with k-means. Clusters that are only anti-aliasing
 *      (a blend of two bigger colors, found along their borders) or
 *      near-duplicates are folded into their neighbors, so `colors` is a
 *      maximum, not a target.
 *   2. Lone pixels are smoothed away, and the background (the corners' color,
 *      where it touches the border) is dropped unless the image is already
 *      transparent.
 *   3. Each color's region is traced along pixel edges, then all outlines are
 *      simplified together with `simplifyGroups`, which keeps the borders
 *      between neighboring colors shared, so smoothing the pixel staircase
 *      opens no gaps.
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
  /** At most this many colors (background included, before it's removed). */
  colors: number
  /** Drop the color that fills the image border. */
  removeBackground: boolean
}

export const DEFAULT_TRACE_OPTIONS: TraceOptions = { colors: 6, removeBackground: true }

/** Images are scaled so their longer side is this many pixels before tracing. */
export const TRACE_SIZE = 512

/** Outline tolerance in pixels: enough to turn pixel staircases into straight edges. */
const SMOOTHING = 1

const TRANSPARENT = -1

export function traceImage(image: RasterImage, options: TraceOptions = DEFAULT_TRACE_OPTIONS): string {
  const { width, height } = image
  const { labels, palette } = quantize(image, Math.max(1, Math.round(options.colors)))
  smoothLabels(labels, width, height)
  if (options.removeBackground) removeBackground(labels, width, height)

  const groups: ColorGroup[] = []
  palette.forEach((color, label) => {
    const rings = traceLabel(labels, width, height, label)
    if (rings.length === 0) return
    // The rings are the region's edges split into loops; even-odd over them is the region.
    const [first, ...rest] = rings.map((r): Polygon => [r])
    const geom = polygonClipping.xor(first, ...rest)
    if (geom.length === 0) return
    groups.push({ id: color, color, shapes: geom.map(polygonToShape), pathCount: 1 })
  })

  const simplified = simplifyGroups(groups, SMOOTHING).groups
  return toSvg(simplified, width, height)
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

/** A pixel with at most one same-label neighbor (of 8) takes its neighbors' most common label. */
function smoothLabels(labels: Int16Array, width: number, height: number) {
  const source = labels.slice()
  const counts = new Map<number, number>()
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
        counts.set(l, (counts.get(l) ?? 0) + 1)
      }
      if (same > 1) continue
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

// Directions on the pixel-corner grid (y down): east, south, west, north.
const DX = [1, 0, -1, 0]
const DY = [0, 1, 0, -1]
const NONE = -1

/**
 * The boundary of one label's region as closed rings of pixel corners. Every
 * boundary edge is directed with the region on its left, so the edges form
 * loops; at a corner where two diagonal pixels touch, turning left keeps them
 * apart. Straight runs are collapsed to their ends.
 */
function traceLabel(labels: Int16Array, width: number, height: number, label: number): [number, number][][] {
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

  const rings: [number, number][][] = []
  for (const start of starts) {
    if (out1[start] === NONE) continue
    const ring: [number, number][] = []
    let v = start
    const firstDir = take(v, out1[start])
    let dir = firstDir
    let prevDir = NONE
    for (;;) {
      if (dir !== prevDir) ring.push([v % stride, Math.floor(v / stride)])
      v += DY[dir] * stride + DX[dir]
      prevDir = dir
      if (v === start) break
      dir = take(v, dir)
    }
    // The start sits mid-run when the ring enters it heading the way it left.
    if (dir === firstDir) ring.shift()
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
