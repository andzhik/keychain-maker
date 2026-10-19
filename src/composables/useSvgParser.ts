import { computed, shallowRef } from 'vue'
import { svgToShapes } from '../utils/svgToShapes'
import type { ColorGroup } from '../types/keychain'
import type { SvgParseError } from '../utils/svgValidation'

export function useSvgParser() {
  // Shallow: Vue must not proxy every curve and vector inside the THREE.Shapes.
  // The array is only ever replaced, never mutated in place.
  const colorGroups = shallowRef<ColorGroup[]>([])
  const diagnostic = shallowRef<SvgParseError | null>(null)
  const error = computed(() => diagnostic.value?.message ?? null)

  function parse(svgString: string) {
    const result = svgToShapes(svgString)
    diagnostic.value = result.ok ? null : result.error
    colorGroups.value = result.ok ? result.groups : []
    return result
  }

  function clear() {
    diagnostic.value = null
    colorGroups.value = []
  }

  return { colorGroups, error, diagnostic, parse, clear }
}
