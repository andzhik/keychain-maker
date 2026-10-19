<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ControlPanel from './components/ControlPanel.vue'
import ExportButton from './components/ExportButton.vue'
import LogoPreviewPanel from './components/LogoPreviewPanel.vue'
import type { LogoPreviewData } from './components/LogoPreview.vue'
import ThreeViewer from './components/ThreeViewer.vue'
import { useSvgParser } from './composables/useSvgParser'
import { useLogoRefinement } from './composables/useLogoRefinement'
import { exportTo3MF } from 'three-3mf-exporter'
import { constrainConfig } from './utils/configConstraints'
import { fitGroups } from './utils/logoFit'
import { loadState, saveConfig, saveRefinements, saveShowLogo, saveSvg } from './utils/persistence'
import { DEFAULT_CONFIG, type BuildStatus, type KeychainConfig, type Refinements } from './types/keychain'
import type * as THREE from 'three'

const viewerRef = ref<InstanceType<typeof ThreeViewer> | null>(null)
// Restore the last session so a reload picks up where the user left off.
const saved = loadState()
const showLogo = ref(saved.showLogo)
const config = ref<KeychainConfig>(saved.config)
const svgText = ref<string | null>(saved.svg)
// Retracing edits the current logo; only a new upload resets the preview view.
const logoSourceKey = ref(0)
// Edits to the parsed logo; the SVG itself is never changed.
const refinements = ref<Refinements>(saved.refinements)
// The sliders keep the user's raw values; the model is built from these.
const constrained = computed(() => constrainConfig(config.value))
const exporting = ref(false)
const exportError = ref<string | null>(null)
const importing = ref(false)
const importError = ref<string | null>(null)
const buildStatus = ref<BuildStatus>('pending')
const modelError = ref<string | null>(null)
const { colorGroups: parsedGroups, error, report: importReport, parse, clear } = useSvgParser()
// Parsed before ThreeViewer mounts, so its first build already has the logo.
if (svgText.value && !parse(svgText.value).ok) {
  svgText.value = null
  saveSvg(null)
}
const refined = useLogoRefinement(parsedGroups, refinements, computed(() => constrained.value.valid ? constrained.value.config : DEFAULT_CONFIG))
const colorGroups = refined.groups
const validation = computed(() => constrained.value.valid
  ? constrainConfig(config.value, fitGroups(colorGroups.value, constrained.value.config))
  : constrained.value)
const configError = computed(() => validation.value.messages.find(m => m.severity === 'error')?.message ?? null)

function handleSvgLoaded(text: string, retraced = false) {
  importing.value = false
  importError.value = null
  if (!retraced) logoSourceKey.value++
  // Recolors and hidden shapes refer to the old logo's colors and shapes; the
  // cleanup settings (tolerance, color limit, specks, nozzle) carry over.
  refinements.value = { ...refinements.value, recolor: {}, hiddenColors: [], hiddenShapes: [] }
  const result = parse(text)
  svgText.value = result.ok ? text : null
  saveSvg(svgText.value)
}

function handleImportStarted(retraced: boolean) {
  importing.value = true
  importError.value = null
  exportError.value = null
  if (!retraced) {
    clear()
    svgText.value = null
    saveSvg(null)
  }
}

function handleImportFailed(message: string) {
  importing.value = false
  importError.value = message
  clear()
  svgText.value = null
  saveSvg(null)
}

function handleBuildStatus(status: BuildStatus, message?: string) {
  buildStatus.value = status
  modelError.value = message ?? null
}

const artworkError = computed(() => importError.value ?? error.value)
const canExport = computed(() => parsedGroups.value.length > 0 && !artworkError.value
  && validation.value.valid && !importing.value && buildStatus.value === 'ready' && !exporting.value)
const hasPrintedLogo = computed(() => showLogo.value && colorGroups.value.length > 0)
const exportLabel = computed(() => parsedGroups.value.length === 0 || hasPrintedLogo.value
  ? 'Download .3mf' : 'Download .3mf (base only)')
const readiness = computed(() => {
  if (importing.value) return 'Importing artwork…'
  if (artworkError.value) return 'Fix the artwork import before exporting.'
  if (configError.value) return configError.value
  if (modelError.value) return modelError.value
  if (parsedGroups.value.length === 0) return 'Upload artwork to create a keychain.'
  if (buildStatus.value === 'pending') return 'Updating model…'
  return hasPrintedLogo.value ? 'Ready to export.' : 'Ready to export the base only.'
})

// Shared by the inline logo preview and the enlarged one beside the 3D view.
const previewData = computed<LogoPreviewData>(() => ({
  sourceKey: logoSourceKey.value,
  parsed: parsedGroups.value,
  groups: colorGroups.value,
  hiddenColors: refinements.value.hiddenColors,
  hiddenShapes: refinements.value.hiddenShapes,
  thinPath: refined.thinFeatures.value.path,
  plateColor: config.value.baseColor,
}))
const previewExpanded = ref(false)
const showPreviewPanel = computed(() => previewExpanded.value && parsedGroups.value.length > 0)

function toggleShape(id: string) {
  const hidden = refinements.value.hiddenShapes
  refinements.value = {
    ...refinements.value,
    hiddenShapes: hidden.includes(id) ? hidden.filter(h => h !== id) : [...hidden, id],
  }
}

watch(config, (value) => saveConfig(value), { deep: true })
watch(showLogo, (value) => saveShowLogo(value))
watch(refinements, (value) => saveRefinements(value), { deep: true })

async function handleExport() {
  if (!canExport.value) return
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
  <div class="app-shell flex flex-col bg-gray-50 text-gray-900">
    <!-- Header -->
    <header class="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shrink-0">
      <h1 class="text-base font-semibold tracking-tight">Keychain Maker</h1>
    </header>

    <!-- Desktop keeps three columns; narrower screens scroll vertically. -->
    <main class="workspace relative gap-3 p-3">
      <ControlPanel
        :parsedGroups="parsedGroups"
        :colorGroups="colorGroups"
        :preview="previewData"
        v-model:previewExpanded="previewExpanded"
        :colorSources="refined.sources.value"
        :specksRemoved="refined.specksRemoved.value"
        :outlinePoints="refined.outlinePoints.value"
        :thinFeatures="refined.thinFeatures.value"
        :tinyIslands="refined.tinyIslands.value"
        :minFeatureWidth="refined.minFeatureWidth.value"
        :error="artworkError"
        :importReport="importReport"
        v-model:showLogo="showLogo"
        v-model:config="config"
        v-model:refinements="refinements"
        :adjustments="validation.adjustments"
        :configMessages="validation.messages"
        :effectiveConfig="validation.config"
        @svgLoaded="handleSvgLoaded"
        @importStarted="handleImportStarted"
        @importFailed="handleImportFailed"
        @toggleShape="toggleShape"
      />

      <aside class="model-preview min-w-0 flex flex-col gap-2" aria-label="3D preview and export">
        <div class="three-frame relative bg-gray-100 border border-gray-200 rounded-lg overflow-hidden">
          <ThreeViewer
            ref="viewerRef"
            :colorGroups="colorGroups"
            :fitKey="parsedGroups"
            :showLogo="showLogo"
            :config="validation.config"
            :configError="configError"
            @buildStatus="handleBuildStatus"
          />
          <button
            class="absolute top-2 right-2 px-2 py-1 text-xs bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 active:bg-gray-100"
            @click="viewerRef?.resetView()"
          >
            Reset View
          </button>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div class="text-xs text-gray-500 tabular-nums whitespace-nowrap">
            <p>Dimensions: {{ dimText }}</p>
            <p>Build time: {{ buildTimeText }}</p>
          </div>
          <div class="w-full sm:w-48 shrink-0">
            <ExportButton
              :disabled="!canExport"
              :exporting="exporting"
              :label="exportLabel"
              @export="handleExport"
            />
          </div>
        </div>
        <p role="status" aria-live="polite" class="text-xs shrink-0" :class="modelError ? 'text-red-600' : 'text-gray-500'">{{ readiness }}</p>
        <p v-if="exportError" class="text-xs text-red-500 shrink-0">{{ exportError }}</p>
      </aside>

      <!-- The enlarged logo preview covers the settings and the 3D view, leaving
           the logo and refine controls next to it usable. -->
      <LogoPreviewPanel
        v-if="showPreviewPanel"
        class="expanded-preview z-10 shadow-xl"
        :preview="previewData"
        @close="previewExpanded = false"
        @toggleShape="toggleShape"
      />
    </main>
  </div>
</template>
