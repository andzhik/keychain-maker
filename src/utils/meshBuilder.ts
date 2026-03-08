import * as THREE from 'three'
import type { ColorGroup, KeychainConfig } from '../types/keychain'

export function buildBasePlate(config: KeychainConfig, width: number, height: number, holes: THREE.Path[] = []): THREE.Mesh {
  const r = Math.min(config.cornerRadius, width / 2, height / 2)
  const w = width / 2
  const h = height / 2

  const shape = new THREE.Shape()

  // Bottom-left start, trace counterclockwise
  shape.moveTo(-w + r, -h)
  // Bottom edge
  shape.lineTo(w - r, -h)
  // Bottom-right corner
  shape.quadraticCurveTo(w, -h, w, -h + r)
  // Right edge
  shape.lineTo(w, h - r)
  // Top-right corner
  shape.quadraticCurveTo(w, h, w - r, h)

  if (config.keyringEnabled) {
    const R = config.keyringRingDiameter / 2
    // Top edge to ring start
    shape.lineTo(R, h)
    // Reinforcement ring arc (upper semicircle bulging outward)
    shape.absarc(0, h, R, 0, Math.PI, false)
    // Top edge from ring end to top-left corner
    shape.lineTo(-w + r, h)
  } else {
    // Straight top edge
    shape.lineTo(-w + r, h)
  }

  // Top-left corner
  shape.quadraticCurveTo(-w, h, -w, h - r)
  // Left edge
  shape.lineTo(-w, -h + r)
  // Bottom-left corner
  shape.quadraticCurveTo(-w, -h, -w + r, -h)

  // Keyring hole (circular cutout)
  if (config.keyringEnabled) {
    const holePath = new THREE.Path()
    holePath.absarc(0, h, config.keyringHoleDiameter / 2, 0, Math.PI * 2, false)
    shape.holes.push(holePath)
  }

  // SVG cutout holes
  for (const hole of holes) {
    shape.holes.push(hole)
  }

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: config.baseThickness,
    bevelEnabled: false,
  })

  const material = new THREE.MeshStandardMaterial({ color: config.baseColor })
  return new THREE.Mesh(geometry, material)
}

export function buildLogoMeshes(groups: ColorGroup[], config: KeychainConfig): THREE.Mesh[] {
  const meshes: THREE.Mesh[] = []
  for (const group of groups) {
    if (group.shapes.length === 0) continue
    const geometry = new THREE.ExtrudeGeometry(group.shapes, {
      depth: config.baseThickness,
      bevelEnabled: false,
    })
    const material = new THREE.MeshStandardMaterial({ color: group.color })
    meshes.push(new THREE.Mesh(geometry, material))
  }
  return meshes
}
