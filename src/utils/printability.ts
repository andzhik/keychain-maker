import type { KeychainConfig } from '../types/keychain'

export interface PrintabilityWarning {
  field: 'baseThickness' | 'keyringHoleDiameter'
  message: string
}

/** Advisory thresholds for a keychain; valid thin models remain exportable. */
export function printabilityWarnings(config: KeychainConfig, nozzleDiameter: number): PrintabilityWarning[] {
  const warnings: PrintabilityWarning[] = []
  const minBase = Math.max(1.2, 3 * nozzleDiameter)
  if (config.baseThickness < minBase - 1e-6) {
    warnings.push({ field: 'baseThickness', message: `The base is thin. Consider at least ${minBase.toFixed(1)} mm for a stronger keychain.` })
  }
  const wall = (config.keyringRingDiameter - config.keyringHoleDiameter) / 2
  if (config.keyringEnabled && wall < 2) {
    warnings.push({ field: 'keyringHoleDiameter', message: `The keyring wall is ${wall.toFixed(1)} mm. Consider at least 2 mm by increasing the ring or reducing the hole.` })
  }
  return warnings
}
