<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useThreeScene } from '../composables/useThreeScene'
import { useKeychainBuilder } from '../composables/useKeychainBuilder'
import type { ColorGroup, KeychainConfig } from '../types/keychain'

const props = defineProps<{
  colorGroups: ColorGroup[]
  showLogo: boolean
  config: KeychainConfig
}>()

const containerRef = ref<HTMLElement | null>(null)
const webglUnavailable = ref(false)

const { init, dispose: disposeScene, getScene, fitCamera, requestRender } = useThreeScene()
const { build, dispose: disposeBuilder, dimensions, setLogoVisible } = useKeychainBuilder(getScene)

let currentGroup: ReturnType<typeof build> = null
let debounceTimer: ReturnType<typeof setTimeout> | null = null

function rebuild() {
  currentGroup = build(props.colorGroups, props.config)
  if (currentGroup) fitCamera(currentGroup)
}

function rebuildOnly() {
  currentGroup = build(props.colorGroups, props.config)
  requestRender()
}

function resetView() {
  if (currentGroup) fitCamera(currentGroup)
}

defineExpose({ dimensions, resetView, getCurrentGroup: () => currentGroup })

onMounted(() => {
  if (!containerRef.value) return
  const result = init(containerRef.value)
  webglUnavailable.value = result.webglUnavailable
  if (result.webglUnavailable) return

  rebuild()
})

watch(() => props.colorGroups, () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(rebuild, 150)
}, { deep: true })

watch(() => props.config, () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(rebuildOnly, 150)
}, { deep: true })

watch(() => props.showLogo, (visible) => {
  setLogoVisible(visible)
  requestRender()
})

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
