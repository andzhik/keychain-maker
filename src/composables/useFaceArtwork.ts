import { computed, ref, watch, type Ref } from 'vue'
import type { Face, FaceSettings, KeychainConfig, PrinterSettings } from '../types/keychain'
import { useSvgParser } from './useSvgParser'
import { useLogoRefinement } from './useLogoRefinement'
import { saveFace, saveFaceMetadata, saveFaceSvg } from '../utils/persistence'

/** One source owns parsing, refinements and import state, independently of the selected editor. */
export function useFaceArtwork(face: Face, settings: Ref<FaceSettings>, config: Ref<KeychainConfig>, printer: Ref<PrinterSettings>, active: Ref<boolean>) {
  const saved = settings.value
  // Older versions marked an in-progress retrace failed while retaining its
  // valid SVG. Restore that last valid source when the interrupted session loads.
  if (saved.svg) saved.importFailed = false
  const sourceKey = ref(0)
  const importing = ref(false)
  const importError = ref<string | null>(saved.importFailed ? 'The previous artwork import failed. Upload artwork again or choose Empty.' : null)
  const parser = useSvgParser()
  const refinements = computed({ get: () => settings.value.refinements, set: value => { settings.value.refinements = value } })
  const refined = useLogoRefinement(parser.colorGroups, refinements, config, printer, active)

  function loaded(text: string, retraced = false, fileName?: string) {
    importing.value = false
    importError.value = null
    if (!retraced) sourceKey.value++
    refinements.value = { ...refinements.value, recolor: {}, hiddenColors: [], hiddenShapes: [] }
    const result = parser.parse(text)
    settings.value.svg = result.ok ? text : null
    settings.value.importFailed = !result.ok
    if (!retraced) settings.value.fileName = result.ok ? fileName ?? null : null
  }
  function started(retraced: boolean) {
    importing.value = true
    importError.value = null
    // A retrace keeps the last valid SVG until it succeeds. A new import must
    // invalidate the old source immediately, including across reloads.
    if (!retraced) {
      settings.value.importFailed = true
      parser.clear()
      settings.value.svg = null
      settings.value.fileName = null
    }
  }
  function failed(message: string) {
    importing.value = false
    importError.value = message
    parser.clear()
    settings.value.svg = null
    settings.value.importFailed = true
    settings.value.fileName = null
  }
  if (saved.svg && !parser.parse(saved.svg).ok) {
    settings.value.svg = null
    settings.value.importFailed = true
  }
  saveFace(face, settings.value)
  watch(settings, value => saveFaceMetadata(face, value), { deep: true })
  watch(() => settings.value.svg, value => saveFaceSvg(face, value))
  return { settings, sourceKey, importing, importError, parser, refined, refinements,
    error: computed(() => importError.value ?? parser.error.value), loaded, started, failed }
}
