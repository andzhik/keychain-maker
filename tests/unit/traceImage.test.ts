import { expect, test } from 'bun:test'
import { ShapeUtils, type Shape } from 'three'
import { logoOutline, svgToShapes as parseSvg } from '../../src/utils/svgToShapes'
import { parseGroups as svgToShapes } from '../helpers/parseGroups'
import { traceImage, type RasterImage } from '../../src/utils/traceImage'
import { installDomParserForSvgLoader } from '../helpers/svgDom'

installDomParserForSvgLoader()

type Rgba = [number, number, number, number]
const CLEAR: Rgba = [0, 0, 0, 0]
const WHITE: Rgba = [255, 255, 255, 255]
const BLACK: Rgba = [0, 0, 0, 255]
const RED: Rgba = [220, 30, 40, 255]
const BLUE: Rgba = [20, 60, 200, 255]

function image(width: number, height: number, paint: (x: number, y: number) => Rgba): RasterImage {
  const data = new Uint8ClampedArray(width * height * 4)
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) data.set(paint(x, y), (y * width + x) * 4)
  return { width, height, data }
}

function shapeArea(shape: Shape): number {
  const { shape: outer, holes } = shape.extractPoints(1)
  return Math.abs(ShapeUtils.area(outer)) - holes.reduce((sum, h) => sum + Math.abs(ShapeUtils.area(h)), 0)
}

function areas(svg: string): Record<string, number> {
  return Object.fromEntries(svgToShapes(svg).map(g => [g.color, g.shapes.reduce((s, sh) => s + shapeArea(sh), 0)]))
}

const inBox = (x: number, y: number, x0: number, y0: number, x1: number, y1: number) => x >= x0 && x < x1 && y >= y0 && y < y1

test('traceImage traces a flat shape on a transparent background', () => {
  const svg = traceImage(image(40, 40, (x, y) => (inBox(x, y, 10, 10, 30, 30) ? RED : CLEAR)), { colors: 4, removeBackground: true })
  expect(svg).toContain('viewBox="0 0 40 40"')
  expect(areas(svg)).toEqual({ '#dc1e28': 400 })
})

test('traceImage keeps counters and islands inside them', () => {
  // A red ring with a blue dot in its hole.
  const svg = traceImage(image(50, 50, (x, y) => {
    if (inBox(x, y, 20, 20, 30, 30)) return BLUE
    if (inBox(x, y, 15, 15, 35, 35)) return CLEAR
    return inBox(x, y, 5, 5, 45, 45) ? RED : CLEAR
  }), { colors: 4, removeBackground: true })

  const groups = svgToShapes(svg)
  const red = groups.find(g => g.color === '#dc1e28')!
  expect(red.shapes).toHaveLength(1)
  expect(red.shapes[0].holes).toHaveLength(1)
  expect(areas(svg)).toEqual({ '#dc1e28': 1600 - 400, '#143cc8': 100 })
})

test('traceImage removes an opaque background but keeps the same color inside the logo', () => {
  // White page, black square with a white square inside it.
  const svg = traceImage(image(40, 40, (x, y) => {
    if (inBox(x, y, 15, 15, 25, 25)) return WHITE
    return inBox(x, y, 5, 5, 35, 35) ? BLACK : WHITE
  }), { colors: 4, removeBackground: true })
  expect(areas(svg)).toEqual({ '#000000': 900 - 100, '#ffffff': 100 })

  const kept = traceImage(image(40, 40, (x, y) => (inBox(x, y, 5, 5, 35, 35) ? BLACK : WHITE)), { colors: 4, removeBackground: false })
  expect(areas(kept)).toEqual({ '#000000': 900, '#ffffff': 1600 - 900 })
})

test('traceImage counts printed colors, not a background it removes', () => {
  // Red and blue squares on a white page: two printed colors.
  const picture = image(40, 40, (x, y) => (inBox(x, y, 5, 5, 18, 35) ? RED : inBox(x, y, 22, 5, 35, 35) ? BLUE : WHITE))
  expect(Object.keys(areas(traceImage(picture, { colors: 2, removeBackground: true }))).sort()).toEqual(['#143cc8', '#dc1e28'])
  // Kept, the background is one of the colors.
  expect(Object.keys(areas(traceImage(picture, { colors: 2, removeBackground: false })))).toHaveLength(2)
})

test('traceImage keeps a frame drawn to the edge of a transparent image', () => {
  // Opaque everywhere on the border except the corners, as a rounded badge.
  const svg = traceImage(image(30, 30, (x, y) => {
    const corner = (x < 2 || x > 27) && (y < 2 || y > 27)
    if (corner) return CLEAR
    return inBox(x, y, 4, 4, 26, 26) ? BLUE : RED
  }), { colors: 4, removeBackground: true })
  expect(Object.keys(areas(svg)).sort()).toEqual(['#143cc8', '#dc1e28'])
})

test('traceImage folds anti-aliased edge pixels into the colors they blend', () => {
  // Red | one column of red-blue blend | blue, on many rows.
  const blend: Rgba = [120, 45, 120, 255]
  const svg = traceImage(image(41, 40, x => (x < 20 ? RED : x === 20 ? blend : BLUE)), { colors: 6, removeBackground: false })
  // The blend pixels join red or blue, nudging its mean color.
  const result = Object.values(areas(svg))
  expect(result).toHaveLength(2)
  expect(result[0] + result[1]).toBeCloseTo(41 * 40)
})

test('traceImage smooths staircases without opening gaps between colors', () => {
  // Two colors split along a diagonal: a staircase at pixel level.
  const size = 60
  const svg = traceImage(image(size, size, (x, y) => (x > y ? RED : BLUE)), { colors: 4, removeBackground: false })
  const shapes = svgToShapes(svg).flatMap(g => g.shapes)
  expect(shapes).toHaveLength(2)
  // The colors neither overlap nor open a gap: their union is one hole-free piece...
  const union = logoOutline(svgToShapes(svg))
  expect(union).toHaveLength(1)
  expect(union[0].holes).toHaveLength(0)
  expect(shapeArea(union[0])).toBeCloseTo(shapes.reduce((s, sh) => s + shapeArea(sh), 0), 6)
  // ...and the shared border is a few edges and curves, not ~2 points per pixel.
  const points = shapes.reduce((n, s) => n + s.extractPoints(1).shape.length, 0)
  expect(points).toBeLessThan(40)
})

test('traceImage returns an empty SVG for a fully transparent image', () => {
  const svg = traceImage(image(10, 10, () => CLEAR), { colors: 4, removeBackground: true })
  expect(parseSvg(svg)).toMatchObject({ ok: false, error: { code: 'NO_FILLED_PATHS' } })
})

test('traceImage follows a curve, not the pixel staircase', () => {
  // A disk of radius 20; its pixel outline strays up to ~0.7 px from the circle,
  // and which pixels are in already decides its edge only to half a pixel.
  const [cx, cy, r] = [30, 30, 20]
  const svg = traceImage(image(60, 60, (x, y) => ((x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 < r * r ? RED : CLEAR)))
  const [shape] = svgToShapes(svg)[0].shapes
  const points = shape.extractPoints(1).shape
  // Rounded off with curves rather than cut into a few straight edges...
  expect(points.length).toBeGreaterThan(40)
  // ...that stay close to the circle all the way round.
  for (const p of points) expect(Math.abs(Math.hypot(p.x - cx, p.y - cy) - r)).toBeLessThan(0.45)
  expect(Math.abs(shapeArea(shape) / (Math.PI * r * r) - 1)).toBeLessThan(0.02)
})

test('traceImage keeps curved borders between colors sealed', () => {
  // A red disk on a blue square: the border between them is smoothed and rounded once, for both.
  const svg = traceImage(image(50, 50, (x, y) => ((x - 25) ** 2 + (y - 25) ** 2 < 15 * 15 ? RED : BLUE)), { colors: 4, removeBackground: false })
  const groups = svgToShapes(svg)
  expect(groups).toHaveLength(2)
  const union = logoOutline(groups)
  expect(union).toHaveLength(1)
  expect(union[0].holes).toHaveLength(0)
  expect(shapeArea(union[0])).toBeCloseTo(50 * 50, 6)
  const total = groups.flatMap(g => g.shapes).reduce((s, sh) => s + shapeArea(sh), 0)
  expect(total).toBeCloseTo(50 * 50, 6)
})

test('traceImage straightens an edge that leans by a pixel, when asked', () => {
  // A bar whose top edge steps down one pixel halfway along: traced, a slight slope.
  const bar = image(60, 30, (x, y) => (x >= 10 && x < 50 && y >= (x < 30 ? 10 : 11) && y < 20 ? RED : CLEAR))
  const topYs = (straighten: boolean) => {
    const [shape] = svgToShapes(traceImage(bar, { straighten }))[0].shapes
    return shape.extractPoints(1).shape.filter(p => p.y < 15).map(p => p.y)
  }
  const straight = topYs(true)
  expect(new Set(straight).size).toBe(1)
  expect(straight[0]).toBeCloseTo(10.5, 1)
  expect(new Set(topYs(false)).size).toBeGreaterThan(1)
})
