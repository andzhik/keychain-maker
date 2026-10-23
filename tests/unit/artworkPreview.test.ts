import { expect, test } from 'bun:test'
import { Shape, Vector2 } from 'three'
import { planArtworkPreview } from '../../src/utils/artworkPreview'
import { validateGroupComplexity } from '../../src/utils/svgValidation'
import type { ColorGroup, KeychainArtwork } from '../../src/types/keychain'

const groups = (paths: number): ColorGroup[] => [{ id: '#ff0000', color: '#ff0000', pathCount: paths,
  shapes: [new Shape([new Vector2(0, 0), new Vector2(10, 0), new Vector2(0, 10)])] }]
const artwork = (front: ColorGroup[], back: ColorGroup[]): KeychainArtwork => ({ front: { groups: front, mirror: false }, back: { groups: back, mirror: false } })

test('the combined budget keeps a current face inspectable without changing source arrays', () => {
  const original = artwork(groups(257), groups(256))
  const result = planArtworkPreview(original)
  expect(result.error?.faces).toEqual(['front', 'back'])
  expect(result.error?.message).toContain('Found 513 paths')
  expect(result.omittedFaces).toEqual(['back'])
  expect(result.artwork.front).toEqual(original.front)
  expect(result.artwork.back.groups).toEqual([])
  expect(original.back.groups[0].pathCount).toBe(256)
  expect(validateGroupComplexity([...result.artwork.front.groups, ...result.artwork.back.groups])).toBeNull()
})

test('an individually invalid face is omitted while the opposite face remains usable', () => {
  for (const failed of ['front', 'back'] as const) {
    const original = artwork(groups(1), groups(1))
    original[failed].groups = groups(513)
    const result = planArtworkPreview(original)
    expect(result.error?.faces).toEqual([failed])
    expect(result.error?.message).toContain('Found 513 paths')
    expect(result.omittedFaces).toEqual([failed])
    expect(result.artwork[failed].groups).toEqual([])
    const other = failed === 'front' ? 'back' : 'front'
    expect(result.artwork[other]).toBe(original[other])
  }
})

test('shared sources count once, and resolving complexity restores the original complete artwork', () => {
  const shared = groups(512)
  const original = artwork(shared, shared)
  const result = planArtworkPreview(original)
  expect(result.artwork).toBe(original)
  expect(result.error).toBeNull()
  expect(result.omittedFaces).toEqual([])
  expect(planArtworkPreview(artwork(groups(256), groups(256))).error).toBeNull()
})

test('two invalid faces leave an explicitly partial base without sending invalid input to the builder', () => {
  const result = planArtworkPreview(artwork(groups(513), groups(513)))
  expect(result.omittedFaces).toEqual(['front', 'back'])
  expect(result.artwork.front.groups).toEqual([])
  expect(result.artwork.back.groups).toEqual([])
})
