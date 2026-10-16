import { expect, test } from 'bun:test'
import { DEFAULT_CONFIG, type KeychainConfig } from '../../src/types/keychain'
import { MIN_KEYRING_WALL, MIN_LOGO_SIZE, constrainConfig } from '../../src/utils/configConstraints'

function config(overrides: Partial<KeychainConfig> = {}): KeychainConfig {
  return { ...DEFAULT_CONFIG, ...overrides }
}

test('the default config needs no adjustment', () => {
  const { config: out, adjustments } = constrainConfig(config())

  expect(adjustments).toEqual([])
  expect(out).toEqual(config())
})

test('the keyring hole is kept inside the ring', () => {
  const { config: out, adjustments } = constrainConfig(config({ keyringHoleDiameter: 10, keyringRingDiameter: 4 }))

  expect(out.keyringHoleDiameter).toBe(4 - 2 * MIN_KEYRING_WALL)
  expect(adjustments.map(a => a.field)).toContain('keyringHoleDiameter')
})

test('padding keeps the logo clear of the keyring hole', () => {
  const { config: out } = constrainConfig(config({ padding: 0, keyringHoleDiameter: 8, keyringRingDiameter: 12 }))

  expect(out.padding).toBe(4 + MIN_KEYRING_WALL)
})

test('padding is not raised for the hole when the keyring is off', () => {
  const { config: out, adjustments } = constrainConfig(config({ padding: 0, keyringEnabled: false }))

  expect(out.padding).toBe(0)
  expect(adjustments).toEqual([])
})

test('padding always leaves room for the logo', () => {
  const { config: out, adjustments } = constrainConfig(config({ targetWidth: 20, padding: 15 }))

  expect(out.padding).toBe((20 - MIN_LOGO_SIZE) / 2)
  expect(adjustments).toHaveLength(1)
})

test('every slider combination stays consistent within the slider ranges', () => {
  for (const targetWidth of [20, 50, 150]) {
    for (const padding of [0, 10, 20]) {
      for (const keyringHoleDiameter of [2, 10]) {
        for (const keyringRingDiameter of [4, 15]) {
          const { config: out } = constrainConfig(
            config({ targetWidth, padding, keyringHoleDiameter, keyringRingDiameter }),
          )
          expect(out.keyringHoleDiameter).toBeLessThan(out.keyringRingDiameter)
          expect(out.padding).toBeGreaterThan(out.keyringHoleDiameter / 2)
          expect(out.targetWidth - 2 * out.padding).toBeGreaterThan(0)
          // Idempotent.
          expect(constrainConfig(out).adjustments).toEqual([])
        }
      }
    }
  }
})
