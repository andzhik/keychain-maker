import { computed, shallowRef } from 'vue'
import { svgToShapes } from '../utils/svgToShapes'
import type { ColorGroup } from '../types/keychain'
import type { SvgParseError } from '../utils/svgValidation'
import type { SvgImportReport } from '../utils/svgImport'

export function useSvgParser() {
  // Shallow: Vue must not proxy every curve and vector inside the THREE.Shapes.
  // The array is only ever replaced, never mutated in place.
  const colorGroups = shallowRef<ColorGroup[]>([])
  const diagnostic = shallowRef<SvgParseError | null>(null)
  const report = shallowRef<SvgImportReport | null>(null)
  const error = computed(() => diagnostic.value?.message ?? null)

  function parse(svgString: string) {
    const result = svgToShapes(svgString)
    diagnostic.value = result.ok ? null : result.error
    report.value = result.ok ? result.report ?? null : null
    colorGroups.value = result.ok ? result.groups : []
    return result
  }

  function clear() {
    diagnostic.value = null
    report.value = null
    colorGroups.value = []
  }

  return { colorGroups, error, diagnostic, report, parse, clear }
}
