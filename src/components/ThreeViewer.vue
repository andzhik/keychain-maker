<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useThreeScene } from '../composables/useThreeScene'
import { useKeychainBuilder } from '../composables/useKeychainBuilder'
import type { BuildStatus, KeychainArtwork, KeychainConfig, Face } from '../types/keychain'

const props = defineProps<{
  artwork: KeychainArtwork
  /** The camera refits when this changes (a new SVG), not on every logo edit. */
  fitKey?: unknown
  config: KeychainConfig
  configError?: string | null
}>()

const emit = defineEmits<{ buildStatus: [status: BuildStatus, message?: string] }>()

const containerRef = ref<HTMLElement | null>(null)
const webglUnavailable = ref(false)

const { init, dispose: disposeScene, getScene, fitCamera, requestRender } = useThreeScene()
const { build, dispose: disposeBuilder, dimensions, buildMs, buildError } = useKeychainBuilder(getScene)

let currentGroup: ReturnType<typeof build> = null
let debounceTimer: ReturnType<typeof setTimeout> | null = null
// Sticky until the debounced rebuild runs, so a config change landing within
// the debounce window of a new SVG doesn't cancel the camera refit.
let refitPending = false

function rebuild() {
  debounceTimer = null
  if (props.configError) {
    currentGroup = null
    disposeBuilder()
    requestRender()
    emit('buildStatus', 'error', props.configError)
    return
  }
  try {
    currentGroup = build(props.artwork, props.config)
    if (currentGroup) {
      if (refitPending) fitCamera(currentGroup)
      else requestRender()
      emit('buildStatus', 'ready')
    } else {
      requestRender()
      emit('buildStatus', 'error', buildError.value?.message ?? 'Could not build the model. Try simplifying the artwork.')
    }
  } catch {
    currentGroup = null
    disposeBuilder()
    requestRender()
    emit('buildStatus', 'error', 'Could not build the model. Try simplifying the artwork or reducing the bevel.')
  } finally {
    refitPending = false
  }
}

function scheduleRebuild(refit: boolean) {
  if (webglUnavailable.value) return
  // Export may only read the group built from the current inputs.
  currentGroup = null
  emit('buildStatus', 'pending')
  if (props.artwork.front.groups.length === 0 && props.artwork.back.groups.length === 0) {
    disposeBuilder()
    requestRender()
  }
  refitPending ||= refit
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(rebuild, 60)
}

function resetView() {
  if (currentGroup) fitCamera(currentGroup)
}
function showFace(face: Face) {
  if (currentGroup) fitCamera(currentGroup, face)
}

defineExpose({ dimensions, buildMs, resetView, showFace, getCurrentGroup: () => currentGroup })

onMounted(() => {
  if (!containerRef.value) return
  const result = init(containerRef.value)
  webglUnavailable.value = result.webglUnavailable
  if (result.webglUnavailable) {
    emit('buildStatus', 'unavailable', 'WebGL is unavailable. Open this page in a browser with WebGL to build and export.')
    return
  }

  refitPending = true
  rebuild()
})

// Not deep: a new SVG or refinement replaces the whole array, and walking
// every THREE.Shape curve and vector on each change would be wasted work.
// Both watchers fire for a new SVG; the refit request is sticky.
watch(() => props.artwork, () => scheduleRebuild(false))
watch(() => props.fitKey, () => scheduleRebuild(true))

watch(() => props.config, () => scheduleRebuild(false), { deep: true })
watch(() => props.configError, () => scheduleRebuild(false))

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
  disposeBuilder()
  disposeScene()
})

// This component owns an imperative WebGL lifecycle (renderer, canvas, RAF loop)
// that in-place HMR cannot safely swap. Force a full page reload on hot edits so
// each save starts from a clean GL context instead of leaking one per swap.
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    import.meta.hot!.invalidate('ThreeViewer owns a WebGL context that cannot be hot-swapped')
  })
}
</script>

<template>
  <div ref="containerRef" class="w-full h-full relative">
    <div
      v-if="webglUnavailable"
      class="absolute inset-0 flex items-center justify-center text-gray-500 text-sm"
    >
      WebGL is not available in your browser.
    </div>
  </div>
</template>
