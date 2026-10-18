import { expect, test } from 'bun:test'
import { ShapeUtils, type Shape } from 'three'
import { logoOutline, svgToShapes } from '../../src/utils/svgToShapes'
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
  // ...and the shared border is a few straight edges, not ~2 points per pixel.
  const points = shapes.reduce((n, s) => n + s.extractPoints(1).shape.length, 0)
  expect(points).toBeLessThan(20)
})

test('traceImage returns an empty SVG for a fully transparent image', () => {
  const svg = traceImage(image(10, 10, () => CLEAR), { colors: 4, removeBackground: true })
  expect(svgToShapes(svg)).toEqual([])
})
