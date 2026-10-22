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
  messages: ConfigMessage[]
  valid: boolean
}

export interface ConfigMessage {
  field: keyof KeychainConfig
  severity: 'error' | 'warning'
  code: string
  message: string
}

/**
 * Clamps slider combinations that would break the geometry. The sliders are
 * independent, so e.g. a 10 mm hole in a 4 mm ring is reachable; the user's
 * raw values are kept in the UI and the model is built from the clamped ones.
 * Idempotent: constraining an already-constrained config changes nothing.
 */
export function validateConfig(input: KeychainConfig, plate?: { width: number; height: number }): ConstrainedConfig {
  const config = { ...input }
  const adjustments: ConfigAdjustment[] = []
  const messages: ConfigMessage[] = []
  const error = (field: keyof KeychainConfig, code: string, message: string) =>
    messages.push({ field, code, message, severity: 'error' })
  const nonnegative = ['padding', 'cornerRadius', 'edgeBevel'] as const
  const positive = ['targetWidth', 'baseThickness', 'logoDepth', 'bevelSegments',
    ...(config.keyringEnabled ? ['keyringHoleDiameter', 'keyringRingDiameter'] as const : [])] as const
  for (const field of [...nonnegative, ...positive]) {
    const value = config[field]
    if (!Number.isFinite(value)) error(field, 'NONFINITE_VALUE', `${field} must be a finite number.`)
    else if (value < 0 || (!(nonnegative as readonly string[]).includes(field) && value === 0)) {
      error(field, 'OUT_OF_RANGE', `${field} must be ${nonnegative.includes(field as typeof nonnegative[number]) ? 'zero or greater' : 'greater than zero'}.`)
    }
  }
  if (config.bevelSegments > 64) error('bevelSegments', 'TOO_MANY_SEGMENTS', 'Use at most 64 bevel segments.')
  if (config.basePlateShape !== 'square' && config.basePlateShape !== 'circle') {
    error('basePlateShape', 'INVALID_SHAPE', 'Choose a square or circle plate.')
  }
  if (!/^#[\da-f]{6}$/i.test(config.baseColor)) error('baseColor', 'INVALID_COLOR', 'Choose a six-digit hex plate color.')
  if (config.keyringEnabled && config.keyringRingDiameter <= 2 * MIN_KEYRING_WALL) {
    error('keyringRingDiameter', 'RING_TOO_SMALL', 'Increase the ring diameter above 2 mm to leave room for its hole and walls.')
  }
  if (messages.length) return { config, adjustments, messages, valid: false }

  const adjust = (field: 'keyringHoleDiameter' | 'padding' | 'edgeBevel' | 'cornerRadius' | 'bevelSegments' | 'logoDepth', value: number, message: string) => {
    config[field] = value
    // A later rule wins over an earlier one for the same field.
    const i = adjustments.findIndex(a => a.field === field)
    if (i >= 0) adjustments.splice(i, 1)
    adjustments.push({ field, value, message })
  }

  if (config.logoDepth > config.baseThickness / 2) {
    adjust('logoDepth', config.baseThickness / 2,
      `Limited to ${fmt(config.baseThickness / 2)} mm per face (half the plate thickness).`)
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

  if (config.keyringEnabled && config.padding < config.keyringHoleDiameter / 2 + MIN_KEYRING_WALL) {
    error('targetWidth', 'NO_ROOM_FOR_KEYRING', 'Increase the plate width or reduce the keyring hole to leave room for the logo and keyring wall.')
  }
  const bevel = Math.max(0, Math.min(config.edgeBevel, config.baseThickness / 2 - 0.05))
  if (bevel !== config.edgeBevel) adjust('edgeBevel', bevel, `Limited to ${fmt(bevel)} mm to fit the base thickness.`)
  const segments = Math.max(1, Math.round(config.bevelSegments))
  if (segments !== config.bevelSegments) adjust('bevelSegments', segments, `Rounded to ${segments} bevel segments.`)
  // The artwork determines square-plate height; callers with a logo supply its fitted size.
  if (plate && config.basePlateShape === 'square') {
    const radius = Math.min(config.cornerRadius, plate.width / 2, plate.height / 2)
    if (radius !== config.cornerRadius) adjust('cornerRadius', radius, `Limited to ${fmt(radius)} mm to fit the plate dimensions.`)
  }
  for (const adjustment of adjustments) messages.push({ ...adjustment, severity: 'warning', code: 'CONFIG_ADJUSTED' })
  return { config, adjustments, messages, valid: !messages.some(m => m.severity === 'error') }
}

/** Backward-compatible name for callers that also need normalized values. */
export const constrainConfig = validateConfig

function fmt(mm: number): string {
  return mm.toFixed(2).replace(/0$/, '')
}
