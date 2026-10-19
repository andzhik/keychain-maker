import { expect, test } from 'bun:test'
import { prepareSvg } from '../../src/utils/svgImport'
import { svgToShapes } from '../../src/utils/svgToShapes'
import { useSvgParser } from '../../src/composables/useSvgParser'
import { installDomParserForSvgLoader } from '../helpers/svgDom'

installDomParserForSvgLoader()
const svg = (content: string) => `<svg xmlns="http://www.w3.org/2000/svg">${content}</svg>`

test('safe preparation removes metadata and normalizes inline white fills without changing geometry', () => {
  const original = svg('<metadata><editor:settings xmlns:editor="urn:editor"/></metadata><title>Logo</title><g transform="translate(2 3)"><path fill="black" style="fill:#ffffff;fill-rule:evenodd" d="M0 0H20V20H0Z M5 5H15V15H5Z"/></g>')
  const prepared = prepareSvg(original)
  expect(prepared.ok).toBe(true)
  if (!prepared.ok) return
  expect(prepared.report).toEqual({ removedMetadata: 2, normalizedStyles: 1 })
  expect(prepared.svg).not.toContain('<metadata')
  expect(prepared.svg).not.toContain('style=')
  const result = svgToShapes(original)
  const expected = svgToShapes(svg('<g transform="translate(2 3)"><path fill="#ffffff" fill-rule="evenodd" d="M0 0H20V20H0Z M5 5H15V15H5Z"/></g>'))
  expect(result.ok && expected.ok).toBe(true)
  if (result.ok && expected.ok) {
    expect(result.groups.map(g => ({ color: g.color, points: g.shapes.map(s => s.extractPoints()) })))
      .toEqual(expected.groups.map(g => ({ color: g.color, points: g.shapes.map(s => s.extractPoints()) })))
    expect(result.groups[0].color).toBe('#ffffff')
    expect(result.groups[0].shapes[0].holes).toHaveLength(1)
  }
})

test('unsupported artwork is rejected before cleanup with actionable diagnostics', () => {
  for (const [content, code, message] of [
    ['<text>Logo</text>', 'TEXT_NOT_CONVERTED', 'Convert text to paths'],
    ['<defs><linearGradient id="g"/></defs><rect fill="url(#g)" width="10" height="10"/>', 'UNSUPPORTED_GRADIENT', 'flat fills'],
    ['<style>path { fill: red }</style><path d="M0 0H10V10Z"/>', 'UNSUPPORTED_CSS_STYLING', 'inline fills'],
  ]) {
    const result = prepareSvg(svg(`<metadata/>${content}`))
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe(code)
      expect(result.error.message).toContain(message)
    }
  }
})

test('style cascade and unrecognized CSS values stay intact', () => {
  for (const style of ['fill:rgb(0,0,0);fill:#fff', 'fill:white!important;fill:red', 'fill:invalidColor;fill:#fff']) {
    const result = prepareSvg(svg(`<rect width="10" height="10" style="${style}"/>`))
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.report.normalizedStyles).toBe(0)
      expect(result.svg).toContain(`style="${style}"`)
    }
  }
})

test('a new failure or cleared import removes the previous success report', () => {
  const parser = useSvgParser()
  parser.parse(svg('<metadata/><rect width="10" height="10" style="fill:white"/>'))
  expect(parser.report.value?.normalizedStyles).toBe(1)
  parser.parse(svg('<text>Unsupported</text>'))
  expect(parser.report.value).toBeNull()
  parser.parse(svg('<rect width="10" height="10"/>'))
  parser.clear()
  expect(parser.report.value).toBeNull()
})

test('cleanup preserves shapes referenced from non-rendering metadata', () => {
  const source = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><metadata><path id="copy" fill="red" d="M0 0H10V10H0Z"/></metadata><use xlink:href="#copy"/></svg>'
  const prepared = prepareSvg(source)
  expect(prepared.ok && prepared.report.removedMetadata).toBe(0)
  const result = svgToShapes(source)
  expect(result.ok).toBe(true)
  if (result.ok) expect(result.groups[0].color).toBe('#ff0000')
})
