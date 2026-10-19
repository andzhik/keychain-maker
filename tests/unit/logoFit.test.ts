import { expect, test } from 'bun:test'
import { Vector2 } from 'three'
import { fitLogo } from '../../src/utils/logoFit'
import { DEFAULT_CONFIG } from '../../src/types/keychain'

const rectangle = [new Vector2(10, 20), new Vector2(30, 20), new Vector2(30, 30), new Vector2(10, 30)]

test('layout centers and uniformly scales an offset rectangle at printed size', () => {
  const fit = fitLogo([rectangle], DEFAULT_CONFIG)
  expect(fit.hasLogo).toBe(true)
  expect(fit.center.toArray()).toEqual([20, 25])
  expect(fit.scale).toBe(2)
  expect(fit.width).toBe(50)
  expect(fit.height).toBe(30)
})

test('circle layout fits the farthest logo point inside its padding', () => {
  const fit = fitLogo([rectangle], { ...DEFAULT_CONFIG, basePlateShape: 'circle' })
  expect(fit.width).toBe(50)
  expect(fit.height).toBe(50)
  for (const point of rectangle) expect(point.distanceTo(fit.center) * fit.scale).toBeCloseTo(20)
})

test('empty, degenerate and overpadded logos use the finite plain-plate layout', () => {
  for (const [rings, padding] of [[[], 5], [[Array(3).fill(new Vector2(1, 2))], 5], [[rectangle], 30]] as const) {
    const fit = fitLogo(rings as Vector2[][], { ...DEFAULT_CONFIG, padding })
    expect(fit.hasLogo).toBe(false)
    expect(fit.width).toBe(50)
    expect(fit.height).toBeCloseTo(100 / 3)
    expect(fit.scale).toBe(1)
  }
})
