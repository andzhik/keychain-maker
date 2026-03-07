import type * as THREE from 'three'
import type { ColorGroup } from '../types/keychain'

// TODO: Step 2 — SVGLoader.createShapes per path, normalize colors, skip fill="none"
export function svgToShapes(_svgString: string): ColorGroup[] {
  return []
}

export function normalizeColor(_color: THREE.Color): string {
  return '#' + _color.getHexString()
}
