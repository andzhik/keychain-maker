import type * as THREE from 'three'
import type { ColorGroup } from '../types/keychain'

export interface ThinFeatures {
  /** Separate thin areas found. */
  count: number
  /** SVG path data, in the logo's SVG units, covering every thin area. */
  path: string
}

const NONE: ThinFeatures = { count: 0, path: '' }
const INF = 1e20
// Raster resolution: cells per minimum width, and a cap on the grid's long side.
const CELLS_PER_WIDTH = 6
const MAX_GRID = 800
// Every acute corner fails the check by a sliver; areas below this fraction of
// minWidth² are ignored. Right angles leave ~0.05, a 45° tip ~0.25, while a
// line at half the minimum width only needs to be minWidth/2 long to count.
const MIN_AREA_FACTOR = 0.25

/**
 * Finds parts of the logo narrower than `minWidthMm` once printed: places no
 * disc of that diameter fits, in each color region and in the plate gaps
 * between them (counters, gaps between letters). Works on a raster: a
 * morphological opening per region, with exact Euclidean distance transforms.
 * Only a warning — fixing them needs a polygon offset, which polygon-clipping
 * doesn't do.
 */
export function findThinFeatures(groups: ColorGroup[], scale: number, minWidthMm: number): ThinFeatures {
  if (!(scale > 0) || !(minWidthMm > 0)) return NONE
  const regions = groups.map(group => group.shapes.map(shape => {
    const { shape: outer, holes } = shape.extractPoints(16)
    return [outer, ...holes]
  }))

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const rings of regions.flat()) {
    for (const p of rings[0]) {
      minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x)
      minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y)
    }
  }
  if (!(maxX > minX && maxY > minY)) return NONE

  const extentMm = Math.max(maxX - minX, maxY - minY) * scale
  const cellMm = Math.max(minWidthMm / CELLS_PER_WIDTH, extentMm / MAX_GRID)
  const cell = cellMm / scale
  const radius = minWidthMm / 2 / cellMm
  // Wide enough that the plate band around the logo passes the check itself.
  const margin = Math.ceil(2 * radius) + 2
  const width = Math.ceil((maxX - minX) / cell) + 2 * margin
  const height = Math.ceil((maxY - minY) / cell) + 2 * margin
  const x0 = minX - margin * cell
  const y0 = minY - margin * cell

  // 0 is the plate, k + 1 is groups[k]. Regions never overlap.
  const labels = new Uint16Array(width * height)
  regions.forEach((shapes, k) => {
    for (const rings of shapes) fillRings(labels, width, height, rings, x0, y0, cell, k + 1)
  })

  const thin = new Uint8Array(width * height)
  const field = new Float64Array(width * height)
  for (let label = 0; label <= groups.length; label++) {
    markThin(labels, label, width, height, radius, field, thin)
  }

  const minPixels = (MIN_AREA_FACTOR * minWidthMm * minWidthMm) / (cellMm * cellMm)
  const count = keepLargeComponents(thin, width, height, minPixels)
  if (count === 0) return NONE
  return { count, path: runsToPath(thin, width, height, x0, y0, cell) }
}

/** Even-odd scanline fill of one shape (outer ring + holes), sampled at cell centres. */
function fillRings(
  labels: Uint16Array, width: number, height: number,
  rings: THREE.Vector2[][], x0: number, y0: number, cell: number, label: number,
) {
  const crossings: number[][] = Array.from({ length: height }, () => [])
  for (const ring of rings) {
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i]
      const b = ring[(i + 1) % ring.length]
      if (a.y === b.y) continue
      const [lo, hi] = a.y < b.y ? [a, b] : [b, a]
      // Rows whose centre lies in [lo.y, hi.y): half-open, so a shared vertex counts once.
      const first = Math.max(0, Math.ceil((lo.y - y0) / cell - 0.5))
      const last = Math.min(height - 1, Math.ceil((hi.y - y0) / cell - 0.5) - 1)
      for (let row = first; row <= last; row++) {
        const y = y0 + (row + 0.5) * cell
        crossings[row].push(lo.x + ((y - lo.y) / (hi.y - lo.y)) * (hi.x - lo.x))
      }
    }
  }
  for (let row = 0; row < height; row++) {
    const xs = crossings[row].sort((p, q) => p - q)
    for (let i = 0; i + 1 < xs.length; i += 2) {
      const from = Math.max(0, Math.ceil((xs[i] - x0) / cell - 0.5))
      const to = Math.min(width, Math.ceil((xs[i + 1] - x0) / cell - 0.5))
      labels.fill(label, row * width + from, row * width + to)
    }
  }
}

/**
 * Marks the pixels of one label that a disc of `radius` (in cells) can't
 * reach while staying inside the label: the label minus its morphological
 * opening. Half a cell of slack on both steps absorbs the rasterization.
 */
function markThin(
  labels: Uint16Array, label: number, width: number, height: number, radius: number,
  field: Float64Array, thin: Uint8Array,
) {
  const n = width * height
  let any = false
  for (let i = 0; i < n; i++) {
    const inside = labels[i] === label
    any ||= inside
    field[i] = inside ? INF : 0
  }
  if (!any) return

  const reach = (radius + 0.5) ** 2
  // Erode: centres of discs that fit inside the label.
  distanceTransform(field, width, height)
  for (let i = 0; i < n; i++) field[i] = labels[i] === label && field[i] >= reach ? 0 : INF
  // Dilate them back: everything such a disc covers.
  distanceTransform(field, width, height)
  for (let i = 0; i < n; i++) {
    if (labels[i] === label && field[i] > reach) thin[i] = 1
  }
}

/** In place: squared distance to the nearest zero cell (Felzenszwalb & Huttenlocher). */
function distanceTransform(grid: Float64Array, width: number, height: number) {
  const size = Math.max(width, height)
  const f = new Float64Array(size)
  const d = new Float64Array(size)
  const v = new Int32Array(size)
  const z = new Float64Array(size + 1)
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) f[y] = grid[y * width + x]
    edt1d(f, height, d, v, z)
    for (let y = 0; y < height; y++) grid[y * width + x] = d[y]
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) f[x] = grid[y * width + x]
    edt1d(f, width, d, v, z)
    for (let x = 0; x < width; x++) grid[y * width + x] = d[x]
  }
}

function edt1d(f: Float64Array, n: number, d: Float64Array, v: Int32Array, z: Float64Array) {
  let k = 0
  v[0] = 0
  z[0] = -INF
  z[1] = INF
  for (let q = 1; q < n; q++) {
    let s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k])
    while (s <= z[k]) {
      k--
      s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k])
    }
    k++
    v[k] = q
    z[k] = s
    z[k + 1] = INF
  }
  k = 0
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++
    d[q] = (q - v[k]) ** 2 + f[v[k]]
  }
}

/** Clears 4-connected components smaller than `minPixels`; returns how many remain. */
function keepLargeComponents(mask: Uint8Array, width: number, height: number, minPixels: number): number {
  const seen = new Uint8Array(mask.length)
  const stack: number[] = []
  let count = 0
  for (let start = 0; start < mask.length; start++) {
    if (!mask[start] || seen[start]) continue
    const component: number[] = []
    stack.push(start)
    seen[start] = 1
    while (stack.length) {
      const i = stack.pop()!
      component.push(i)
      const x = i % width
      const neighbours = [x > 0 ? i - 1 : -1, x < width - 1 ? i + 1 : -1, i - width, i + width]
      for (const j of neighbours) {
        if (j >= 0 && j < mask.length && mask[j] && !seen[j]) {
          seen[j] = 1
          stack.push(j)
        }
      }
    }
    if (component.length < minPixels) for (const i of component) mask[i] = 0
    else count++
  }
  return count
}

/** One rectangle per horizontal run of marked cells. */
function runsToPath(mask: Uint8Array, width: number, height: number, x0: number, y0: number, cell: number): string {
  const r = (n: number) => +n.toFixed(4)
  const parts: string[] = []
  for (let y = 0; y < height; y++) {
    let x = 0
    while (x < width) {
      if (!mask[y * width + x]) { x++; continue }
      const from = x
      while (x < width && mask[y * width + x]) x++
      parts.push(`M${r(x0 + from * cell)} ${r(y0 + y * cell)}h${r((x - from) * cell)}v${r(cell)}h${r(-(x - from) * cell)}z`)
    }
  }
  return parts.join('')
}
