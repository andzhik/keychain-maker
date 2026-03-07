import type { Color } from 'three'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'
import type { ColorGroup } from '../types/keychain'

export function svgToShapes(svgString: string): ColorGroup[] {
  const loader = new SVGLoader()
  const svgData = loader.parse(svgString)

  const colorMap = new Map<string, ColorGroup>()

  for (const path of svgData.paths) {
    const fill = path.userData?.style?.fill
    if (fill === 'none') continue

    const shapes = SVGLoader.createShapes(path)
    if (shapes.length === 0) continue

    const color = '#' + path.color.getHexString()

    const existing = colorMap.get(color)
    if (existing) {
      existing.shapes.push(...shapes)
      existing.pathCount += 1
    } else {
      colorMap.set(color, { id: color, color, shapes, pathCount: 1 })
    }
  }

  return Array.from(colorMap.values())
}

export function normalizeColor(color: Color): string {
  return '#' + color.getHexString()
}
