import type { ColorGroup, KeychainConfig } from '../types/keychain'
import { shapeArea } from './refine'

export interface TinyIslands {
  count: number
  /** Filled area of a disc of the minimum feature width, in mm². */
  minAreaMm2: number
}

/**
 * Area check alongside the raster thin-feature check: subpixel islands and
 * components below its noise cutoff must still get advisory feedback.
 * Call with the final refined groups and the same fitted scale as the model.
 */
export function findTinyIslands(groups: ColorGroup[], scale: number, minWidthMm: number): TinyIslands {
  if (!(scale > 0 && Number.isFinite(scale) && minWidthMm > 0 && Number.isFinite(minWidthMm))) {
    return { count: 0, minAreaMm2: 0 }
  }
  const minAreaMm2 = Math.PI * (minWidthMm / 2) ** 2
  let count = 0
  for (const group of groups) {
    for (const shape of group.shapes) {
      const areaMm2 = shapeArea(shape) * scale * scale
      if (areaMm2 > 0 && areaMm2 < minAreaMm2) count++
    }
  }
  return { count, minAreaMm2 }
}

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
