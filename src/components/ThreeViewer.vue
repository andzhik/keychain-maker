<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useThreeScene } from '../composables/useThreeScene'

const containerRef = ref<HTMLElement | null>(null)
const webglUnavailable = ref(false)

const { init, dispose } = useThreeScene()

onMounted(() => {
  if (!containerRef.value) return
  const result = init(containerRef.value)
  webglUnavailable.value = result.webglUnavailable
})

onUnmounted(() => {
  dispose()
})
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
