import { expect, spyOn, test } from 'bun:test'
import { Color } from 'three'
import { useSvgParser } from '../../src/composables/useSvgParser'
import { normalizeColor } from '../../src/utils/svgToShapes'

test('normalizeColor returns lowercase CSS hex colors', () => {
  expect(normalizeColor(new Color('#A1B2C3'))).toBe('#a1b2c3')
})

test('useSvgParser exposes a friendly error and clears stale groups on parse failure', () => {
  const consoleError = spyOn(console, 'error').mockImplementation(() => {})
  const parser = useSvgParser()

  parser.colorGroups.value = [{
    id: '#ffffff',
    color: '#ffffff',
    shapes: [],
    pathCount: 1,
  }]

  try {
    parser.parse('<svg')

    expect(parser.error.value).toBe('Failed to parse SVG')
    expect(parser.colorGroups.value).toEqual([])
    expect(consoleError).toHaveBeenCalled()
  } finally {
    consoleError.mockRestore()
  }
})
