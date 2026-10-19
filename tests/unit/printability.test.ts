import { expect, test } from 'bun:test'
import { Path, Shape, Vector2 } from 'three'
import { DEFAULT_CONFIG, DEFAULT_REFINEMENTS, type ColorGroup } from '../../src/types/keychain'
import { findTinyIslands, printabilityWarnings } from '../../src/utils/printability'
import { findThinFeatures } from '../../src/utils/thinFeatures'
import { refineColors, removeSpecks } from '../../src/utils/refine'

const rect = (x: number, w: number, h = w) => new Shape([
  new Vector2(x, 0), new Vector2(x + w, 0), new Vector2(x + w, h), new Vector2(x, h),
])
const group = (...shapes: Shape[]): ColorGroup => ({ id: '#000000', color: '#000000', pathCount: shapes.length, shapes })

test('exact areas catch tiny islands below the raster noise cutoff', () => {
  const groups = [group(rect(0, 10), rect(20, 0.1))]
  expect(findThinFeatures(groups, 1, 0.8).count).toBe(0)
  expect(findTinyIslands(groups, 1, 0.8).count).toBe(1)
  expect(groups[0].shapes).toHaveLength(2)
})

test('tiny islands follow squared print scale and the chosen nozzle width', () => {
  const groups = [group(rect(0, 1))]
  expect(findTinyIslands(groups, 0.5, 0.8).count).toBe(1)
  expect(findTinyIslands(groups, 1, 0.8).count).toBe(0)
  expect(findTinyIslands(groups, 1, 1.6).count).toBe(1)
  expect(findTinyIslands(groups, 1, 0.8).minAreaMm2).toBeCloseTo(Math.PI * 0.4 ** 2)
})

test('island material excludes holes and ignores degenerate shapes', () => {
  const ring = rect(0, 1)
  ring.holes.push(new Path([new Vector2(0.05, 0.05), new Vector2(0.95, 0.05), new Vector2(0.95, 0.95), new Vector2(0.05, 0.95)]))
  expect(findTinyIslands([group(ring, rect(2, 0))], 1, 0.8).count).toBe(1)
})

test('only remaining refined islands contribute warnings', () => {
  const groups = [group(rect(0, 10), rect(20, 0.1))]
  const hidden = refineColors(groups, { ...DEFAULT_REFINEMENTS, hiddenShapes: ['#000000:1'] }).groups
  expect(findTinyIslands(hidden, 1, 0.8).count).toBe(0)
  expect(findTinyIslands(removeSpecks(groups, 0.1).groups, 1, 0.8).count).toBe(0)
})

test('empty artwork and unavailable print dimensions produce no island advice', () => {
  expect(findTinyIslands([], 1, 0.8).count).toBe(0)
  for (const value of [0, -1, NaN, Infinity]) {
    expect(findTinyIslands([group(rect(0, 1))], value, 0.8).count).toBe(0)
    expect(findTinyIslands([group(rect(0, 1))], 1, value).count).toBe(0)
  }
})

test('strength advice respects base, nozzle, and enabled-ring thresholds', () => {
  expect(printabilityWarnings(DEFAULT_CONFIG, 0.4)).toEqual([])
  expect(printabilityWarnings({ ...DEFAULT_CONFIG, baseThickness: 1.2, keyringRingDiameter: 9 }, 0.4)).toEqual([])
  expect(printabilityWarnings({ ...DEFAULT_CONFIG, baseThickness: 1.1, keyringRingDiameter: 8 }, 0.4).map(w => w.field))
    .toEqual(['baseThickness', 'keyringHoleDiameter'])
  expect(printabilityWarnings({ ...DEFAULT_CONFIG, baseThickness: 2 }, 0.8)[0].message).toContain('2.4 mm')
  expect(printabilityWarnings({ ...DEFAULT_CONFIG, keyringRingDiameter: 6, keyringEnabled: false }, 0.4)).toEqual([])
})
