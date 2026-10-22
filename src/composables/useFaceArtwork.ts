import { computed, ref, watch, type Ref } from 'vue'
import type { Face, FaceSettings, KeychainConfig } from '../types/keychain'
import { useSvgParser } from './useSvgParser'
import { useLogoRefinement } from './useLogoRefinement'
import { saveFace } from '../utils/persistence'

/** One source owns parsing, refinements and import state, independently of the selected editor. */
export function useFaceArtwork(face: Face, saved: FaceSettings, config: Ref<KeychainConfig>) {
  const settings = ref(saved)
  const sourceKey = ref(0)
  const importing = ref(false)
  const importError = ref<string | null>(saved.importFailed ? 'The previous artwork import failed. Upload artwork again or choose Empty.' : null)
  const parser = useSvgParser()
  const refinements = computed({ get: () => settings.value.refinements, set: value => { settings.value.refinements = value } })
  const refined = useLogoRefinement(parser.colorGroups, refinements, config)

  function loaded(text: string, retraced = false) {
    importing.value = false
    importError.value = null
    if (!retraced) sourceKey.value++
    refinements.value = { ...refinements.value, recolor: {}, hiddenColors: [], hiddenShapes: [] }
    const result = parser.parse(text)
    settings.value.svg = result.ok ? text : null
    settings.value.importFailed = !result.ok
  }
  function started(retraced: boolean) {
    importing.value = true
    importError.value = null
    // Persist pending imports as failures, so a reload cannot resurrect stale artwork.
    settings.value.importFailed = true
    if (!retraced) {
      parser.clear()
      settings.value.svg = null
    }
  }
  function failed(message: string) {
    importing.value = false
    importError.value = message
    parser.clear()
    settings.value.svg = null
    settings.value.importFailed = true
  }
  if (saved.svg && !parser.parse(saved.svg).ok) {
    settings.value.svg = null
    settings.value.importFailed = true
  }
  const persist = () => saveFace(face, settings.value)
  persist()
  watch(settings, persist, { deep: true })
  return { settings, sourceKey, importing, importError, parser, refined, refinements,
    error: computed(() => importError.value ?? parser.error.value), loaded, started, failed }
}
