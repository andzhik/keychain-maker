<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useThreeScene } from '../composables/useThreeScene'
import { useKeychainBuilder } from '../composables/useKeychainBuilder'
import { DEFAULT_CONFIG } from '../types/keychain'
import type { ColorGroup } from '../types/keychain'

const props = defineProps<{
  colorGroups: ColorGroup[]
  showLogo: boolean
  keyringEnabled: boolean
}>()

const containerRef = ref<HTMLElement | null>(null)
const webglUnavailable = ref(false)

const { init, dispose: disposeScene, getScene, fitCamera } = useThreeScene()
const { build, dispose: disposeBuilder, dimensions, setLogoVisible } = useKeychainBuilder(getScene)

defineExpose({ dimensions })

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function rebuild() {
  const config = { ...DEFAULT_CONFIG, keyringEnabled: props.keyringEnabled }
  const group = build(props.colorGroups, config)
  if (group) fitCamera(group)
}

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

watch(() => props.keyringEnabled, () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(rebuild, 150)
})

watch(() => props.showLogo, (visible) => {
  setLogoVisible(visible)
})

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
  disposeBuilder()
  disposeScene()
})

if (import.meta.hot) {
  import.meta.hot.decline()
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
