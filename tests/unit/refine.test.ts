import { expect, test } from 'bun:test'
import * as THREE from 'three'
import { DEFAULT_REFINEMENTS, type ColorGroup, type Refinements } from '../../src/types/keychain'
import { deltaE, refineColors, removeSpecks, shapeArea, shapeId } from '../../src/utils/refine'
import { findThinFeatures } from '../../src/utils/thinFeatures'

function rect(x: number, y: number, w: number, h: number): THREE.Shape {
  return new THREE.Shape([
    new THREE.Vector2(x, y), new THREE.Vector2(x + w, y),
    new THREE.Vector2(x + w, y + h), new THREE.Vector2(x, y + h),
  ])
}

function group(color: string, ...shapes: THREE.Shape[]): ColorGroup {
  return { id: color, color, shapes, pathCount: shapes.length }
}

function refine(overrides: Partial<Refinements> = {}): Refinements {
  return { ...DEFAULT_REFINEMENTS, ...overrides }
}

const area = (groups: ColorGroup[], color: string) =>
  groups.find(g => g.color === color)!.shapes.reduce((sum, s) => sum + shapeArea(s), 0)

// Two near-identical reds side by side, plus a blue square.
function logo(): ColorGroup[] {
  return [
    group('#ff0000', rect(0, 0, 10, 10)),
    group('#fe0101', rect(10, 0, 2, 10)),
    group('#0000ff', rect(20, 0, 5, 5), rect(30, 0, 5, 5)),
  ]
}

test('default refinements return the parsed array itself', () => {
  const parsed = logo()
  expect(refineColors(parsed, refine()).groups).toBe(parsed)
})

test('a refinement that changes nothing keeps the previous result', () => {
  const parsed = logo()
  const hidden = refineColors(parsed, refine({ hiddenColors: ['#0000ff'] }))
  // A tolerance below every distance merges nothing.
  const again = refineColors(parsed, refine({ hiddenColors: ['#0000ff'], mergeTolerance: 0.5 }))
  expect(again.groups).toBe(hidden.groups)
})

test('hiding a color or a shape leaves it out', () => {
  const parsed = logo()
  expect(refineColors(parsed, refine({ hiddenColors: ['#0000ff'] })).groups.map(g => g.color))
    .toEqual(['#ff0000', '#fe0101'])

  const { groups } = refineColors(parsed, refine({ hiddenShapes: [shapeId('#0000ff', 1)] }))
  expect(groups.find(g => g.color === '#0000ff')!.shapes).toHaveLength(1)
  // The parsed groups are untouched.
  expect(parsed[2].shapes).toHaveLength(2)
})

test('recoloring two sources to the same color merges them into one region', () => {
  const { groups, sources } = refineColors(logo(), refine({ recolor: { '#fe0101': '#ff0000' } }))
  expect(groups.map(g => g.color)).toEqual(['#ff0000', '#0000ff'])
  expect(sources.get('#ff0000')).toEqual(['#ff0000', '#fe0101'])
  // Touching pieces are unioned: one 12×10 rectangle.
  const red = groups[0]
  expect(red.shapes).toHaveLength(1)
  expect(area(groups, '#ff0000')).toBeCloseTo(120, 6)
  expect(red.pathCount).toBe(2)
})

test('similar colors merge into the larger one within the tolerance', () => {
  expect(deltaE('#ff0000', '#fe0101')).toBeLessThan(2)
  expect(deltaE('#ff0000', '#0000ff')).toBeGreaterThan(100)

  const { groups } = refineColors(logo(), refine({ mergeTolerance: 5 }))
  expect(groups.map(g => g.color)).toEqual(['#ff0000', '#0000ff'])
})

test('a color limit merges the closest colors first', () => {
  const parsed = [...logo(), group('#00ff00', rect(40, 0, 1, 1))]
  const { groups, sources } = refineColors(parsed, refine({ maxColors: 2 }))
  expect(groups).toHaveLength(2)
  // The two reds merge first; then green (smaller) joins its nearest color.
  expect(sources.get('#ff0000')).toContain('#fe0101')
  expect(groups.map(g => g.color)).not.toContain('#00ff00')
})

test('specks below the minimum area are dropped and small holes filled', () => {
  const ring = rect(0, 0, 10, 10)
  ring.holes.push(new THREE.Path(rect(4, 4, 1, 1).getPoints()))
  const parsed = [group('#000000', ring), group('#ffffff', rect(4, 4, 1, 1), rect(20, 0, 3, 3))]

  const { groups, removed } = removeSpecks(parsed, 2)
  // The 1×1 white dot and the matching hole in the black square.
  expect(removed).toBe(2)
  expect(area(groups, '#000000')).toBeCloseTo(100, 6)
  expect(groups.find(g => g.color === '#ffffff')!.shapes).toHaveLength(1)

  expect(removeSpecks(parsed, 2).groups).toBe(groups)
  expect(removeSpecks(parsed, 0.5).groups).toBe(parsed)
})

test('thin features are found in colors and in plate gaps', () => {
  // At scale 1 (mm per unit) and a 0.8 mm minimum: a wide bar, a 0.4 mm line,
  // and two bars 0.3 mm apart.
  const groups = [
    group('#000000', rect(0, 0, 10, 10)),
    group('#ff0000', rect(15, 0, 0.4, 10)),
    group('#0000ff', rect(20, 0, 3, 10), rect(23.3, 0, 3, 10)),
  ]
  expect(findThinFeatures(groups, 1, 0.8).count).toBe(2)
  expect(findThinFeatures([groups[0]], 1, 0.8)).toEqual({ count: 0, path: '' })
  // Scaled up 3×, the line is 1.2 mm and the gap 0.9 mm: both printable.
  expect(findThinFeatures(groups, 3, 0.8).count).toBe(0)
})
