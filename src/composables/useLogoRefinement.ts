import { computed, onUnmounted, shallowRef, watch, type Ref } from 'vue'
import type { ColorGroup, KeychainConfig, Refinements } from '../types/keychain'
import { fitGroups } from '../utils/logoFit'
import { refineColors, removeSpecks } from '../utils/refine'
import { findThinFeatures, type ThinFeatures } from '../utils/thinFeatures'

// The thin-feature raster takes tens of ms; wait for sliders to settle.
const THIN_DEBOUNCE_MS = 200

/**
 * The refined logo: the parsed groups with the refinements applied, plus the
 * thin-feature check of the result. `config` must be the constrained config,
 * so real-world sizes match the model.
 */
export function useLogoRefinement(
  parsed: Ref<ColorGroup[]>,
  refinements: Ref<Refinements>,
  config: Ref<KeychainConfig>,
) {
  const colors = computed(() => refineColors(parsed.value, refinements.value))

  // Specks are measured at the printed size, which depends on the logo outline
  // and the plate settings. The scale comes from the logo before speck removal;
  // dropping specks barely moves it.
  const specks = computed(() => {
    const { groups } = colors.value
    const minArea = refinements.value.minSpeckArea
    if (!(minArea > 0)) return { groups, removed: 0 }
    const { hasLogo, scale } = fitGroups(groups, config.value)
    return hasLogo ? removeSpecks(groups, minArea / (scale * scale)) : { groups, removed: 0 }
  })

  // Identity only changes when the geometry does (see refine.ts).
  const groups = computed(() => specks.value.groups)
  const specksRemoved = computed(() => specks.value.removed)

  const scale = computed(() => {
    const fit = fitGroups(groups.value, config.value)
    return fit.hasLogo ? fit.scale : 0
  })
  const minFeatureWidth = computed(() => 2 * refinements.value.nozzleDiameter)

  const thinFeatures = shallowRef<ThinFeatures>({ count: 0, path: '' })
  let timer: ReturnType<typeof setTimeout> | null = null
  const checkThin = () => {
    timer = null
    thinFeatures.value = findThinFeatures(groups.value, scale.value, minFeatureWidth.value)
  }
  watch([groups, scale, minFeatureWidth], () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(checkThin, THIN_DEBOUNCE_MS)
  })
  checkThin()
  onUnmounted(() => { if (timer) clearTimeout(timer) })

  return {
    groups,
    /** Final color → the source colors printed in it. */
    sources: computed(() => colors.value.sources),
    specksRemoved,
    thinFeatures,
    minFeatureWidth,
  }
}
