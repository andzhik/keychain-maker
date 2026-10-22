import { ref, shallowRef } from 'vue'
import type { Scene } from 'three'
import type { ColorGroup, KeychainArtwork, KeychainConfig } from '../types/keychain'
import { buildKeychainModel, type ModelBuildError } from '../domain/keychainModel'
import { createSceneLifecycle } from '../three/sceneLifecycle'
import { Profiler } from '../utils/profiler'

/** Vue state around detached model construction and owned scene lifecycle. */
export function useKeychainBuilder(getScene: () => Scene | null) {
  const lifecycle = createSceneLifecycle(getScene)
  const dimensions = ref({ width: 0, height: 0, depth: 0 })
  const buildMs = ref<number | null>(null)
  const buildError = shallowRef<ModelBuildError | null>(null)

  function dispose() {
    lifecycle.clear()
    dimensions.value = { width: 0, height: 0, depth: 0 }
    buildMs.value = null
  }

  function build(colorGroups: ColorGroup[] | KeychainArtwork, config: KeychainConfig) {
    const startedAt = performance.now()
    const profiler = new Profiler('keychain build')
    profiler.measure('disposeCurrent', dispose)
    buildError.value = null
    if (!getScene()) return null
    const result = buildKeychainModel(colorGroups, config, profiler)
    if (!result.ok) {
      buildError.value = result.error
      return null
    }
    const { model } = result
    if (!lifecycle.attach(model.root, model.logoGroup)) return null
    dimensions.value = model.dimensions
    buildMs.value = performance.now() - startedAt
    return model.root
  }

  return { build, dispose, dimensions, buildMs, buildError, setLogoVisible: lifecycle.setLogoVisible }
}
