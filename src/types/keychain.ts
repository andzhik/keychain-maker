import type * as THREE from 'three'

export interface ColorGroup {
  id: string
  color: string // #RRGGBB
  shapes: THREE.Shape[]
  pathCount: number
}

export type BasePlateShape = 'square' | 'circle'

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
