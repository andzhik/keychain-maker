import { expect, test } from 'bun:test'
import { DEFAULT_CONFIG, type KeychainConfig } from '../../src/types/keychain'
import { MIN_KEYRING_WALL, MIN_LOGO_SIZE, constrainConfig, validateConfig } from '../../src/utils/configConstraints'

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

test('invalid numeric settings return structured errors without modifying the input', () => {
  for (const overrides of [
    { padding: -1 }, { baseThickness: 0 }, { baseThickness: -1 },
    { targetWidth: 0 }, { edgeBevel: NaN }, { cornerRadius: Infinity },
    { keyringHoleDiameter: 0 }, { keyringRingDiameter: 2 }, { bevelSegments: 1000000 },
    { logoDepth: 0 }, { logoDepth: -1 }, { logoDepth: NaN }, { logoDepth: Infinity },
  ]) {
    const input = config(overrides)
    const snapshot = { ...input }
    const result = validateConfig(input)
    expect(result.valid).toBe(false)
    expect(result.messages.some(m => m.severity === 'error' && !!m.code && !!m.field)).toBe(true)
    expect(input).toEqual(snapshot)
  }
})

test('impossible hole clearance blocks generation instead of reversing the padding correction', () => {
  const result = validateConfig(config({ targetWidth: 5, padding: 0 }))
  expect(result.valid).toBe(false)
  expect(result.messages.some(m => m.code === 'NO_ROOM_FOR_KEYRING')).toBe(true)
})

test('bevel and corner limits use the actual plate size and report effective values', () => {
  const result = validateConfig(config({ baseThickness: 0.4, edgeBevel: 2, cornerRadius: 20 }), { width: 50, height: 12 })
  expect(result.valid).toBe(true)
  expect(result.config.edgeBevel).toBeCloseTo(0.15)
  expect(result.config.cornerRadius).toBe(6)
  expect(result.adjustments.map(a => a.field)).toEqual(['logoDepth', 'edgeBevel', 'cornerRadius'])
  expect(result.messages.every(m => m.severity === 'warning')).toBe(true)
  expect(validateConfig(result.config, { width: 50, height: 12 }).adjustments).toEqual([])
})

test('surface depth is capped at half the thickness without changing the requested value', () => {
  const input = config({ baseThickness: 0.8, logoDepth: 0.6 })
  const result = validateConfig(input)
  expect(result.valid).toBe(true)
  expect(result.config.logoDepth).toBe(0.4)
  expect(input.logoDepth).toBe(0.6)
  expect(result.adjustments.find(a => a.field === 'logoDepth')?.message).toContain('half the plate thickness')
  expect(validateConfig(result.config).adjustments).toEqual([])
})
