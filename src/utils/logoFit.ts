import * as THREE from 'three'
import type { ColorGroup, KeychainConfig } from '../types/keychain'
import { logoOutline } from './svgToShapes'

export interface LogoFit {
  /** False when there is no logo, or it has no usable size; the plate is then plain. */
  hasLogo: boolean
  /** mm per SVG unit. */
  scale: number
  /** Logo centre in SVG units; it lands on the plate origin. */
  center: THREE.Vector2
  /** Nominal plate size in mm, before the keyring loop and bevel. */
  width: number
  height: number
}

/**
 * Sizes the plate and scales the logo to fit it, from the outer rings of the
 * logo outline (SVG units). Shared by the mesh builder and everything that
 * needs real-world sizes (speck removal, thin-feature checks).
 */
export function fitLogo(outerRings: THREE.Vector2[][], config: KeychainConfig): LogoFit {
  const plain: LogoFit = {
    hasLogo: false,
    scale: 1,
    center: new THREE.Vector2(0, 0),
    width: config.targetWidth,
    height: config.basePlateShape === 'circle' ? config.targetWidth : config.targetWidth * (2 / 3),
  }

  const box = new THREE.Box2()
  for (const ring of outerRings) for (const p of ring) box.expandByPoint(p)
  if (box.isEmpty()) return plain

  const center = box.getCenter(new THREE.Vector2())
  let scale: number
  let height = plain.height

  if (config.basePlateShape === 'circle') {
    // Fit the logo's farthest point inside the padded circle. Fitting the
    // bounding box instead lets its corners (at half the diagonal) poke out.
    let maxRadius = 0
    for (const ring of outerRings) {
      for (const p of ring) maxRadius = Math.max(maxRadius, p.distanceTo(center))
    }
    scale = (config.targetWidth / 2 - config.padding) / maxRadius
  }
  else {
    const size = box.getSize(new THREE.Vector2())
    scale = (config.targetWidth - config.padding * 2) / size.x
    height = size.y * scale + config.padding * 2
  }

  // A zero-width logo (or padding eating the whole plate) has no usable
  // scale; build the plain plate instead of NaN/Infinity geometry.
  if (!(scale > 0 && Number.isFinite(scale) && Number.isFinite(height))) return plain

  return { hasLogo: true, scale, center, width: config.targetWidth, height }
}

/** `fitLogo` for a set of color groups (via their cached outline). */
export function fitGroups(groups: ColorGroup[], config: KeychainConfig): LogoFit {
  return fitLogo(logoOutline(groups).map(shape => shape.extractPoints(16).shape), config)
}
