<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useThreeScene } from '../composables/useThreeScene'
import { useKeychainBuilder } from '../composables/useKeychainBuilder'
import { DEFAULT_CONFIG } from '../types/keychain'

const containerRef = ref<HTMLElement | null>(null)
const webglUnavailable = ref(false)

const { init, dispose: disposeScene, getScene, fitCamera } = useThreeScene()
const { build, dispose: disposeBuilder, dimensions } = useKeychainBuilder(getScene)

defineExpose({ dimensions })

onMounted(() => {
  if (!containerRef.value) return
  const result = init(containerRef.value)
  webglUnavailable.value = result.webglUnavailable
  if (result.webglUnavailable) return

  const mesh = build([], DEFAULT_CONFIG)
  if (mesh) fitCamera(mesh)
})

onUnmounted(() => {
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
