import * as THREE from 'three'
import type { ColorGroup, KeychainConfig } from '../types/keychain'

export function buildBasePlate(config: KeychainConfig, width: number, height: number): THREE.Mesh {
  const r = Math.min(config.cornerRadius, width / 2, height / 2)
  const w = width / 2
  const h = height / 2

  const shape = new THREE.Shape()
  shape.moveTo(-w + r, -h)
  shape.lineTo(w - r, -h)
  shape.quadraticCurveTo(w, -h, w, -h + r)
  shape.lineTo(w, h - r)
  shape.quadraticCurveTo(w, h, w - r, h)
  shape.lineTo(-w + r, h)
  shape.quadraticCurveTo(-w, h, -w, h - r)
  shape.lineTo(-w, -h + r)
  shape.quadraticCurveTo(-w, -h, -w + r, -h)

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: config.baseThickness,
    bevelEnabled: false,
  })

  const material = new THREE.MeshStandardMaterial({ color: config.baseColor })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = -Math.PI / 2
  return mesh
}

// TODO: Steps 4–5
export function buildLogoMeshes(_groups: ColorGroup[], _config: KeychainConfig): THREE.Mesh[] {
  return []
}
