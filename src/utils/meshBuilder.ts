import * as THREE from 'three'
import type { ColorGroup, KeychainConfig } from '../types/keychain'

function applyKeyring(shape: THREE.Shape, config: KeychainConfig, w: number, h: number, r: number) {
  const R = config.keyringRingDiameter / 2
  const maxFr = ((w - r) * (w - r) - R * R) / (2 * R)
  const fr = Math.min(R * 0.75, Math.max(0, maxFr))

  if (fr <= 0.01) {
    // Fallback: simple semicircle when no room for fillets
    shape.lineTo(R, h)
    shape.absarc(0, h, R, 0, Math.PI, false)
    shape.lineTo(-w + r, h)
  } else {
    const fx = Math.sqrt(R * R + 2 * R * fr)
    const ringStart = Math.atan2(fr, fx)
    const ringEnd = Math.PI - ringStart

    // Top edge to right fillet start
    shape.lineTo(fx, h)
    // Right concave fillet arc (clockwise)
    shape.absarc(fx, h + fr, fr, -Math.PI / 2, Math.atan2(-fr, -fx), true)
    // Ring arc over the top (counter-clockwise)
    shape.absarc(0, h, R, ringStart, ringEnd, false)
    // Left concave fillet arc (clockwise)
    shape.absarc(-fx, h + fr, fr, Math.atan2(-fr, fx), -Math.PI / 2, true)
    // Continue to top-left corner
    shape.lineTo(-w + r, h)

    // Keyring hole (circular cutout)
    const holePath = new THREE.Path()
    holePath.absarc(0, h, config.keyringHoleDiameter / 2, 0, Math.PI * 2, false)
    shape.holes.push(holePath)
  }
}

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
    applyKeyring(shape, config, w, h, r)
  }
  else {
    // Straight top edge
    shape.lineTo(-w + r, h)
  }
  // Top-left corner
  shape.quadraticCurveTo(-w, h, -w, h - r)
  // Left edge
  shape.lineTo(-w, -h + r)
  // Bottom-left corner
  shape.quadraticCurveTo(-w, -h, -w + r, -h)

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
