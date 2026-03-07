import type * as THREE from 'three'
import type { ColorGroup, KeychainConfig } from '../types/keychain'

// TODO: Step 7 — merge geometries per color, write 3MF XML, ZIP with fflate, download
export function exportThreeMf(
  _baseMesh: THREE.Mesh | null,
  _colorGroups: ColorGroup[],
  _config: KeychainConfig,
): void {
  // stub
}
