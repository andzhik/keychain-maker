import type { KeychainConfig } from '../types/keychain'

/** Thinnest plate material left between the keyring hole and anything else. */
export const MIN_KEYRING_WALL = 1
/** Smallest logo extent (mm) the padding may shrink the logo to. */
export const MIN_LOGO_SIZE = 4

export interface ConfigAdjustment {
  field: keyof KeychainConfig
  /** The value the model is actually built with. */
  value: number
  message: string
}

export interface ConstrainedConfig {
  config: KeychainConfig
  adjustments: ConfigAdjustment[]
}

/**
 * Clamps slider combinations that would break the geometry. The sliders are
 * independent, so e.g. a 10 mm hole in a 4 mm ring is reachable; the user's
 * raw values are kept in the UI and the model is built from the clamped ones.
 * Idempotent: constraining an already-constrained config changes nothing.
 */
export function constrainConfig(input: KeychainConfig): ConstrainedConfig {
  const config = { ...input }
  const adjustments: ConfigAdjustment[] = []
  const adjust = (field: 'keyringHoleDiameter' | 'padding', value: number, message: string) => {
    config[field] = value
    // A later rule wins over an earlier one for the same field.
    const i = adjustments.findIndex(a => a.field === field)
    if (i >= 0) adjustments.splice(i, 1)
    adjustments.push({ field, value, message })
  }

  if (config.keyringEnabled) {
    // The hole must stay inside the ring, or it crosses the outer edge.
    const maxHole = config.keyringRingDiameter - 2 * MIN_KEYRING_WALL
    if (config.keyringHoleDiameter > maxHole) {
      adjust('keyringHoleDiameter', maxHole,
        `Limited to ${fmt(maxHole)} mm to leave a ${fmt(MIN_KEYRING_WALL)} mm wall inside the ring.`)
    }
  }

  // The keyring hole is centred on the plate's top edge, so the padding must
  // keep the logo clear of it.
  if (config.keyringEnabled) {
    const minPadding = config.keyringHoleDiameter / 2 + MIN_KEYRING_WALL
    if (config.padding < minPadding) {
      adjust('padding', minPadding,
        `Raised to ${fmt(minPadding)} mm so the logo clears the keyring hole.`)
    }
  }

  // Padding on both sides must leave room for the logo, or its scale goes ≤ 0.
  const maxPadding = Math.max(0, (config.targetWidth - MIN_LOGO_SIZE) / 2)
  if (config.padding > maxPadding) {
    adjust('padding', maxPadding,
      `Limited to ${fmt(maxPadding)} mm to leave room for the logo at this width.`)
  }

  return { config, adjustments }
}

function fmt(mm: number): string {
  return mm.toFixed(1)
}
