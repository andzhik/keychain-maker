<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ControlPanel from './components/ControlPanel.vue'
import ExportButton from './components/ExportButton.vue'
import ThreeViewer from './components/ThreeViewer.vue'
import { useSvgParser } from './composables/useSvgParser'
import { useLogoRefinement } from './composables/useLogoRefinement'
import { exportTo3MF } from 'three-3mf-exporter'
import { constrainConfig } from './utils/configConstraints'
import { loadState, saveConfig, saveRefinements, saveShowLogo, saveSvg } from './utils/persistence'
import type { KeychainConfig, Refinements } from './types/keychain'
import type * as THREE from 'three'

const viewerRef = ref<InstanceType<typeof ThreeViewer> | null>(null)
// Restore the last session so a reload picks up where the user left off.
const saved = loadState()
const showLogo = ref(saved.showLogo)
const config = ref<KeychainConfig>(saved.config)
const svgText = ref<string | null>(saved.svg)
// Edits to the parsed logo; the SVG itself is never changed.
const refinements = ref<Refinements>(saved.refinements)
// The sliders keep the user's raw values; the model is built from these.
const constrained = computed(() => constrainConfig(config.value))
const exporting = ref(false)
const exportError = ref<string | null>(null)
const { colorGroups: parsedGroups, error, parse } = useSvgParser()
// Parsed before ThreeViewer mounts, so its first build already has the logo.
if (svgText.value) parse(svgText.value)
const refined = useLogoRefinement(parsedGroups, refinements, computed(() => constrained.value.config))
const colorGroups = refined.groups

function handleSvgLoaded(text: string) {
  svgText.value = text
  // Recolors and hidden shapes refer to the old logo's colors and shapes; the
  // cleanup settings (tolerance, color limit, specks, nozzle) carry over.
  refinements.value = { ...refinements.value, recolor: {}, hiddenColors: [], hiddenShapes: [] }
  parse(text)
  saveSvg(text)
}

watch(config, (value) => saveConfig(value), { deep: true })
watch(showLogo, (value) => saveShowLogo(value))
watch(refinements, (value) => saveRefinements(value), { deep: true })

async function handleExport() {
  const group = viewerRef.value?.getCurrentGroup()
  if (!group) return
  exporting.value = true
  exportError.value = null
  try {
    // Export without the display rotation (rotation.x = -PI/2 is for viewport only)
    const exportGroup = group.clone()
    exportGroup.rotation.set(0, 0, 0)
    // The exporter ignores `visible`; drop hidden parts (a hidden logo) so the
    // file matches the viewport — the button label says when that happens.
    const hidden: THREE.Object3D[] = []
    exportGroup.traverse((child) => { if (!child.visible) hidden.push(child) })
    for (const child of hidden) child.removeFromParent()
    const blob = await exportTo3MF(exportGroup)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'keychain.3mf'
    a.click()
    // Revoking synchronously can abort the download before it starts (Firefox).
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  } catch (e) {
    console.error('Export failed:', e)
    exportError.value = `Export failed: ${e instanceof Error ? e.message : String(e)}`
  } finally {
    exporting.value = false
  }
}

const dimText = computed(() => {
  const d = viewerRef.value?.dimensions
  if (!d || (d.width === 0 && d.height === 0)) return '— × — × — mm'
  return `${d.width.toFixed(1)} × ${d.height.toFixed(1)} × ${d.depth.toFixed(1)} mm`
})

const buildTimeText = computed(() => {
  const ms = viewerRef.value?.buildMs
  return ms == null ? '— ms' : `${Math.round(ms)} ms`
})
</script>

<template>
  <div class="flex flex-col h-screen bg-gray-50 text-gray-900 overflow-hidden">
    <!-- Header -->
    <header class="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shrink-0">
      <h1 class="text-base font-semibold tracking-tight">Keychain Maker</h1>
    </header>

    <!-- Three columns: logo | settings (fixed widths, scroll if needed) | preview (takes the rest) -->
    <div class="flex flex-1 min-h-0 gap-3 p-3">
      <ControlPanel
        class="shrink-0 min-h-0 overflow-y-auto"
        :parsedGroups="parsedGroups"
        :colorGroups="colorGroups"
        :colorSources="refined.sources.value"
        :specksRemoved="refined.specksRemoved.value"
        :outlinePoints="refined.outlinePoints.value"
        :thinFeatures="refined.thinFeatures.value"
        :minFeatureWidth="refined.minFeatureWidth.value"
        :error="error"
        v-model:showLogo="showLogo"
        v-model:config="config"
        v-model:refinements="refinements"
        :adjustments="constrained.adjustments"
        @svgLoaded="handleSvgLoaded"
      />

      <aside class="flex-1 min-w-[320px] flex flex-col gap-2">
        <div class="relative flex-1 min-h-0 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden">
          <ThreeViewer
            ref="viewerRef"
            :colorGroups="colorGroups"
            :fitKey="parsedGroups"
            :showLogo="showLogo"
            :config="constrained.config"
          />
          <button
            class="absolute top-2 right-2 px-2 py-1 text-xs bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 active:bg-gray-100"
            @click="viewerRef?.resetView()"
          >
            Reset View
          </button>
        </div>
        <div class="flex items-center justify-between gap-3 shrink-0">
          <div class="text-xs text-gray-500 tabular-nums whitespace-nowrap">
            <p>Dimensions: {{ dimText }}</p>
            <p>Render time: {{ buildTimeText }}</p>
          </div>
          <div class="w-48 shrink-0">
            <ExportButton
              :disabled="parsedGroups.length === 0"
              :exporting="exporting"
              :label="showLogo ? 'Download .3mf' : 'Download .3mf (base only)'"
              @export="handleExport"
            />
          </div>
        </div>
        <p v-if="exportError" class="text-xs text-red-500 shrink-0">{{ exportError }}</p>
      </aside>
    </div>
  </div>
</template>
