<script setup lang="ts">
import { ref, computed } from 'vue'
import ControlPanel from './components/ControlPanel.vue'
import ExportButton from './components/ExportButton.vue'
import ThreeViewer from './components/ThreeViewer.vue'
import { useSvgParser } from './composables/useSvgParser'
import { exportTo3MF } from 'three-3mf-exporter'
import { DEFAULT_CONFIG } from './types/keychain'
import type { KeychainConfig } from './types/keychain'

const viewerRef = ref<InstanceType<typeof ThreeViewer> | null>(null)
const showLogo = ref(true)
const config = ref<KeychainConfig>({ ...DEFAULT_CONFIG })
const exporting = ref(false)
const { colorGroups, error, parse } = useSvgParser()

async function handleExport() {
  const group = viewerRef.value?.getCurrentGroup()
  if (!group) return
  exporting.value = true
  try {
    // Export without the display rotation (rotation.x = -PI/2 is for viewport only)
    const exportGroup = group.clone()
    exportGroup.rotation.set(0, 0, 0)
    const blob = await exportTo3MF(exportGroup)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'keychain.3mf'
    a.click()
    URL.revokeObjectURL(url)
  } catch (e) {
    console.error('Export failed:', e)
  } finally {
    exporting.value = false
  }
}

const dimText = computed(() => {
  const d = viewerRef.value?.dimensions
  if (!d || (d.width === 0 && d.height === 0)) return '— × — × — mm'
  return `${d.width.toFixed(1)} × ${d.height.toFixed(1)} × ${d.depth.toFixed(1)} mm`
})
</script>

<template>
  <div class="flex flex-col h-screen bg-white text-gray-900 overflow-hidden">
    <!-- Header -->
    <header class="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shrink-0">
      <h1 class="text-lg font-semibold tracking-tight">Keychain Maker</h1>
    </header>

    <!-- Main: sidebar + viewport -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left sidebar: fixed 300px -->
      <aside class="w-[300px] shrink-0 flex flex-col bg-gray-50 border-r border-gray-200 overflow-hidden">
        <ControlPanel
          class="flex-1 min-h-0 overflow-y-auto"
          :colorGroups="colorGroups"
          :error="error"
          v-model:showLogo="showLogo"
          v-model:config="config"
          @svgLoaded="parse"
        />
        <div class="p-4 border-t border-gray-200 shrink-0">
          <ExportButton
            :disabled="colorGroups.length === 0"
            :exporting="exporting"
            @export="handleExport"
          />
        </div>
      </aside>

      <!-- 3D viewport: fills remaining space -->
      <main class="flex-1 relative bg-gray-100">
        <ThreeViewer ref="viewerRef" :colorGroups="colorGroups" :showLogo="showLogo" :config="config" />
        <div class="absolute top-2 right-2">
          <button
            class="px-2 py-1 text-xs bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 active:bg-gray-100"
            @click="viewerRef?.resetView()"
          >
            Reset View
          </button>
        </div>
      </main>
    </div>

    <!-- Footer: dimensions bar -->
    <footer class="px-4 py-2 bg-white border-t border-gray-200 text-xs text-gray-500 shrink-0">
      Dimensions: {{ dimText }}
    </footer>
  </div>
</template>
