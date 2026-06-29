import { ref } from 'vue'
import { svgToShapes } from '../utils/svgToShapes'
import type { ColorGroup } from '../types/keychain'

export function useSvgParser() {
  const colorGroups = ref<ColorGroup[]>([])
  const error = ref<string | null>(null)

  function parse(svgString: string) {
    error.value = null
    try {
      const groups = svgToShapes(svgString)
      if (groups.length === 0) {
        error.value = 'No filled paths found'
        colorGroups.value = []
      } else {
        colorGroups.value = groups
      }
    } catch (e) {
      console.error('Failed to parse SVG:', e)
      error.value = 'Failed to parse SVG'
      colorGroups.value = []
    }
  }

  return { colorGroups, error, parse }
}
