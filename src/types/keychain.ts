import type * as THREE from 'three'

export interface ColorGroup {
  id: string
  color: string // #RRGGBB
  shapes: THREE.Shape[]
  pathCount: number
}

export type BasePlateShape = 'square' | 'circle'

export type BuildStatus = 'pending' | 'ready' | 'error' | 'unavailable'

export interface KeychainConfig {
  basePlateShape: BasePlateShape
  baseThickness: number
  cornerRadius: number
  padding: number
  targetWidth: number
  keyringEnabled: boolean
  keyringHoleDiameter: number
  keyringRingDiameter: number
  edgeBevel: number
  bevelSegments: number
  baseColor: string
}

/**
 * Print-oriented edits applied to the parsed logo before the model is built.
 * The uploaded SVG itself is never changed, so every edit can be undone.
 * Colors are the parser's normalized `#rrggbb` source colors.
 */
export interface Refinements {
  /** Source color → color to print it in. Sources mapped to the same color merge. */
  recolor: Record<string, string>
  /** Source colors left out of the model (the plate shows through). */
  hiddenColors: string[]
  /** Individual parsed shapes left out, by `shapeId()`. */
  hiddenShapes: string[]
  /** Colors closer than this CIE76 ΔE are merged; 0 = off. */
  mergeTolerance: number
  /** Merge the closest colors until at most this many remain; 0 = no limit. */
  maxColors: number
  /** Pieces (and holes) smaller than this, in mm² at the printed size, are dropped; 0 = off. */
  minSpeckArea: number
  /** Outline points are dropped while the outline moves less than this, in mm at the printed size; 0 = off. */
  simplifyTolerance: number
  /** Features narrower than two nozzle widths are flagged as unprintable. */
  nozzleDiameter: number
}

export const DEFAULT_REFINEMENTS: Refinements = {
  recolor: {},
  hiddenColors: [],
  hiddenShapes: [],
  mergeTolerance: 0,
  maxColors: 0,
  minSpeckArea: 0,
  // Far below what a nozzle can resolve, and drops most of the points curves
  // are tessellated into (16 per curve, however small).
  simplifyTolerance: 0.02,
  nozzleDiameter: 0.4,
}

export const DEFAULT_CONFIG: KeychainConfig = {
  basePlateShape: 'square',
  baseThickness: 5,
  cornerRadius: 5,
  padding: 5,
  targetWidth: 50,
  keyringEnabled: true,
  keyringHoleDiameter: 5,
  keyringRingDiameter: 10,
  edgeBevel: 0.6,
  bevelSegments: 2,
  baseColor: '#FFFFFF',
}
