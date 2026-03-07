import type * as THREE from 'three'
import type { ColorGroup, KeychainConfig } from '../types/keychain'

// TODO: Steps 3–5 — ExtrudeGeometry for base plate and logo layers
export function buildBasePlate(_config: KeychainConfig, _width: number, _height: number): THREE.BufferGeometry | null {
  return null
}

export function buildLogoMeshes(_groups: ColorGroup[], _config: KeychainConfig): THREE.Mesh[] {
  return []
}
