import type * as THREE from 'three'

export interface ColorGroup {
  id: string
  color: string // #RRGGBB
  shapes: THREE.Shape[]
  pathCount: number
}

export interface KeychainConfig {
  baseThickness: number
  cornerRadius: number
  padding: number
  targetWidth: number
  keyringEnabled: boolean
  keyringHoleDiameter: number
  keyringRingDiameter: number
  edgeBevel: number
  baseColor: string
}

export const DEFAULT_CONFIG: KeychainConfig = {
  baseThickness: 5,
  cornerRadius: 5,
  padding: 5,
  targetWidth: 50,
  keyringEnabled: true,
  keyringHoleDiameter: 5,
  keyringRingDiameter: 10,
  edgeBevel: 0.6,
  baseColor: '#FFFFFF',
}
