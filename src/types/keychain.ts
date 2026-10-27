import type * as THREE from 'three'

export interface ColorGroup {
  id: string
  color: string // #RRGGBB
  shapes: THREE.Shape[]
  pathCount: number
}

export type Face = 'front' | 'back'
export type FaceMode = 'artwork' | 'same' | 'empty'

/** Mirror is relative to looking at this face from outside, keyring at the top. */
export interface FaceArtwork { groups: ColorGroup[]; mirror: boolean }
export interface KeychainArtwork { front: FaceArtwork; back: FaceArtwork }

/** An empty face retains its source and edits so switching back is reversible. */
export interface FaceSettings {
  mode: FaceMode
  svg: string | null
  refinements: Refinements
  mirror: boolean
  importFailed: boolean
  fileName: string | null
}

export type BasePlateShape = 'square' | 'circle' | 'outline'

export type BuildStatus = 'pending' | 'ready' | 'error' | 'unavailable'

export interface KeychainConfig {
  basePlateShape: BasePlateShape
  baseThickness: number
  /** Depth of the colored inlay on each face, in mm; capped at half the thickness. */
  logoDepth: number
  cornerRadius: number
  padding: number
  /** Outward silhouette offset in mm; outline plates size the artwork before this border. */
  outlineOffset: number
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
  /**
   * Pieces (and holes) with less area than a disc this wide, in mm at the
   * printed size, are dropped; 0 = off.
   */
  minSpeckSize: number
  /** Outline points are dropped while the outline moves less than this, in mm at the printed size; 0 = off. */
  simplifyTolerance: number
}

/** Shared printer capabilities used by both faces' printability checks. */
export interface PrinterSettings {
  nozzleDiameter: number
  /**
   * The slicer prints walls down to one nozzle width ("detect thin walls"),
   * so the minimum feature width is one nozzle width instead of two.
   */
  thinWalls: boolean
}

export const DEFAULT_REFINEMENTS: Refinements = {
  recolor: {},
  hiddenColors: [],
  hiddenShapes: [],
  mergeTolerance: 0,
  maxColors: 0,
  minSpeckSize: 0,
  // Far below what a nozzle can resolve, and drops most of the points curves
  // are tessellated into (16 per curve, however small).
  simplifyTolerance: 0.02,
}

export const DEFAULT_PRINTER: PrinterSettings = { nozzleDiameter: 0.4, thinWalls: false }

export const DEFAULT_CONFIG: KeychainConfig = {
  basePlateShape: 'square',
  baseThickness: 5,
  logoDepth: 0.6,
  cornerRadius: 5,
  padding: 5,
  outlineOffset: 2,
  targetWidth: 50,
  keyringEnabled: true,
  keyringHoleDiameter: 5,
  keyringRingDiameter: 10,
  edgeBevel: 0.6,
  bevelSegments: 2,
  baseColor: '#FFFFFF',
}
