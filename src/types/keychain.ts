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
  keyringEnabled: boolean
  keyringHoleDiameter: number
  keyringRingDiameter: number
  baseColor: string
}

export const DEFAULT_CONFIG: KeychainConfig = {
  baseThickness: 2,
  cornerRadius: 3,
  padding: 3,
  keyringEnabled: true,
  keyringHoleDiameter: 4,
  keyringRingDiameter: 8,
  baseColor: '#FFFFFF',
}
