import { expect, spyOn, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'
import polygonClipping from 'polygon-clipping'
import { svgToShapes } from '../../src/utils/svgToShapes'
import { SVG_LIMITS } from '../../src/utils/svgValidation'
import { installDomParserForSvgLoader } from '../helpers/svgDom'

installDomParserForSvgLoader()

const svg = (content: string) => `<svg xmlns="http://www.w3.org/2000/svg">${content}</svg>`
const square = '<path fill="#ffffff" d="M0 0H10V10H0Z"/>'

test('mixed filled and stroked artwork fails visibly instead of losing its strokes', () => {
  const result = svgToShapes(svg(`${square}<path fill="none" stroke="red" d="M20 0H30"/>`))
  expect(result).toMatchObject({ ok: false, error: { code: 'UNSUPPORTED_STROKE' } })
})

test('strokes on filled shapes and inherited, inline, and linked strokes are rejected before clipping', () => {
  const union = spyOn(polygonClipping, 'union')
  try {
    for (const content of [
      '<rect width="10" height="10" fill="white" stroke="red"/>',
      '<g stroke="red"><path fill="none" d="M20 0H30"/></g>',
      '<path fill="none" style="stroke:red;stroke-width:2" d="M20 0H30"/>',
      '<defs><path id="line" fill="none" d="M20 0H30"/></defs><use xlink:href="#line" stroke="red"/>',
    ]) {
      expect(svgToShapes(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">${square}${content}</svg>`))
        .toMatchObject({ ok: false, error: { code: 'UNSUPPORTED_STROKE' } })
    }
    expect(union).not.toHaveBeenCalled()
  } finally {
    union.mockRestore()
  }
})

test('non-painted strokes and unused stroke definitions preserve valid filled artwork', () => {
  for (const attributes of ['stroke="none"', 'stroke="transparent"', 'stroke="red" stroke-width="0"',
    'stroke="red" style="stroke-opacity:0"', 'stroke="red" style="stroke:none"']) {
    expect(svgToShapes(svg(`<rect width="10" height="10" fill="white" ${attributes}/>`))).toMatchObject({ ok: true })
  }
  expect(svgToShapes(svg(`<defs><path stroke="red" d="M20 0H30"/></defs>${square}`))).toMatchObject({ ok: true })
})

for (const [code, input] of [
  ['EMPTY_SVG', '   '],
  ['INVALID_SVG', '<svg'],
  ['INVALID_SVG', '<html/>'],
  ['NO_FILLED_PATHS', svg('<path fill="none" d="M0 0H10V10Z"/>')],
  ['UNSUPPORTED_STROKE', svg('<path fill="none" stroke="red" d="M0 0H10V10Z"/>')],
  ['TEXT_NOT_CONVERTED', svg(`${square}<text>Logo</text>`)],
  ['UNSUPPORTED_EXTERNAL_IMAGE', svg(`${square}<image href="logo.png"/>`)],
  ['UNSUPPORTED_GRADIENT', svg('<defs><linearGradient id="g"/></defs><path fill="url(#g)" d="M0 0H10V10Z"/>')],
  ['UNSUPPORTED_PATTERN', svg('<defs><pattern id="p"/></defs><path fill="url(#p)" d="M0 0H10V10Z"/>')],
  ['UNSUPPORTED_CSS_STYLING', svg(`<style>path:hover { fill: red }</style>${square}`)],
  ['UNSUPPORTED_CLIP_PATH', svg(`<g clip-path="url(#clip)">${square}</g>`)],
  ['UNSUPPORTED_MASK', svg(`<g mask="url(#mask)">${square}</g>`)],
  ['UNSUPPORTED_FILTER', svg(`<g filter="url(#shadow)">${square}</g>`)],
  ['UNSUPPORTED_CLIP_PATH', svg(`<g clip-path="none" style="clip-path:url(#clip)">${square}</g>`)],
  ['UNSUPPORTED_GRADIENT', svg('<defs><pattern id="p"/><linearGradient id="g"/></defs><path style="fill:url(#g)" d="M0 0H10V10Z"/>')],
  ['ZERO_BOUNDS', svg('<path d="M0 0L0 10L0 20Z"/>')],
  ['ZERO_BOUNDS', svg('<path d="M0 0H0.000000001V0.000000001H0Z"/>')],
  ['TOO_COMPLEX', svg(square.repeat(513))],
  ['TOO_COMPLEX', svg(`<path d="M0 0${'L1 1'.repeat(20001)}Z"/>`)],
] as const) {
  test(`SVG validation reports ${code}: ${input.slice(0, 65)}`, () => {
    const result = svgToShapes(input)
    expect(result).toMatchObject({ ok: false, error: { code } })
  })
}

test('oversized input is rejected before SVGLoader runs', () => {
  const parse = spyOn(SVGLoader.prototype, 'parse')
  try {
    expect(svgToShapes(svg(`<!--${'x'.repeat(SVG_LIMITS.bytes)}-->${square}`))).toMatchObject({ ok: false, error: { code: 'TOO_COMPLEX' } })
    expect(parse).not.toHaveBeenCalled()
  } finally {
    parse.mockRestore()
  }
})

test('shape and tessellation budgets reject a single complex path before polygon clipping', () => {
  const union = spyOn(polygonClipping, 'union')
  try {
    for (const path of [
      Array.from({ length: SVG_LIMITS.shapes + 1 }, (_, i) => `M${i * 2} 0h1v1h-1z`).join(''),
      `M0 0${'q1 1 2 0'.repeat(1300)}Z`,
    ]) {
      expect(svgToShapes(svg(`<path d="${path}"/>`))).toMatchObject({ ok: false, error: { code: 'TOO_COMPLEX' } })
    }
    expect(union).not.toHaveBeenCalled()
  } finally {
    union.mockRestore()
  }
})

test('paint-order fragmentation is bounded before model generation', () => {
  const stripes = Array.from({ length: 30 }, (_, i) =>
    `<rect fill="red" x="${i * 3 + 1}" width="1" height="100"/><rect fill="red" y="${i * 3 + 1}" width="100" height="1"/>`).join('')
  expect(svgToShapes(svg(`<rect width="100" height="100"/>${stripes}`))).toMatchObject({ ok: false, error: { code: 'TOO_COMPLEX' } })
})

test('element and nesting budgets apply to unused definitions too', () => {
  for (const content of ['<g>'.repeat(65) + square + '</g>'.repeat(65), `<defs>${'<path/>'.repeat(4097)}</defs>${square}`]) {
    expect(svgToShapes(svg(content))).toMatchObject({ ok: false, error: { code: 'TOO_COMPLEX' } })
  }
})

test('inline styles, transforms, holes and white fills retain their geometry', () => {
  const result = svgToShapes(svg('<g transform="translate(10,20)"><path style="fill:#ffffff;stroke-width:0px" fill-rule="evenodd" d="M0 0H10V10H0Z M2 2V8H8V2Z"/></g>'))
  expect(result.ok).toBe(true)
  if (!result.ok) throw new Error(result.error.message)
  expect(result.groups[0].color).toBe('#ffffff')
  expect(result.groups[0].shapes[0].holes).toHaveLength(1)
  const points = result.groups[0].shapes[0].getPoints()
  expect(Math.min(...points.map(p => p.x))).toBe(10)
  expect(Math.min(...points.map(p => p.y))).toBe(20)
})

test('unused paint definitions do not reject otherwise supported artwork', () => {
  expect(svgToShapes(svg(`<defs><linearGradient id="unused"/><text>Unused</text></defs>${square}`)).ok).toBe(true)
})

test('bounded local xlink copies remain supported and cyclic references are rejected early', () => {
  const wrap = (content: string) => `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">${content}</svg>`
  const result = svgToShapes(wrap('<defs><path id="s" fill="white" d="M0 0H10V10H0Z"/></defs><use xlink:href="#s"/><use xlink:href="#s" transform="translate(20,0)"/>'))
  expect(result).toMatchObject({ ok: true })
  if (result.ok) expect(result.groups[0].shapes).toHaveLength(2)
  const parse = spyOn(SVGLoader.prototype, 'parse')
  try {
    expect(svgToShapes(wrap('<defs><g id="loop"><use xlink:href="#loop"/></g></defs><use xlink:href="#loop"/>')))
      .toMatchObject({ ok: false, error: { code: 'TOO_COMPLEX' } })
    expect(parse).not.toHaveBeenCalled()
  } finally {
    parse.mockRestore()
  }
})

for (const file of ['c1.svg', 'coffee-badge.svg', 'hills-badge.svg', 'name-tag.svg', 'smile-heart.svg']) {
  test(`the path-based fixture ${file} remains supported`, () => {
    expect(svgToShapes(readFileSync(`test-svg/${file}`, 'utf8')).ok).toBe(true)
  })
}

test('invalid fixtures fail visibly instead of producing partial artwork', () => {
  for (const [file, code] of [['logo.svg', 'TEXT_NOT_CONVERTED'], ['broken logo.svg', 'INVALID_SVG']]) {
    expect(svgToShapes(readFileSync(`test-svg/${file}`, 'utf8'))).toMatchObject({ ok: false, error: { code } })
  }
})
