<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ControlPanel from './components/ControlPanel.vue'
import ExportButton from './components/ExportButton.vue'
import LogoPreviewPanel from './components/LogoPreviewPanel.vue'
import type { LogoPreviewData } from './components/LogoPreview.vue'
import ThreeViewer from './components/ThreeViewer.vue'
import IconTooltip from './components/IconTooltip.vue'
import { useFaceArtwork } from './composables/useFaceArtwork'
import { exportTo3MF } from 'three-3mf-exporter'
import { constrainConfig } from './utils/configConstraints'
import { fitFaces } from './utils/logoFit'
import { loadState, loadFaces, saveConfig, saveShowLogo } from './utils/persistence'
import { DEFAULT_CONFIG, type BuildStatus, type KeychainConfig, type Face, type FaceMode, type ColorGroup, type KeychainArtwork } from './types/keychain'
import type * as THREE from 'three'

const viewerRef = ref<InstanceType<typeof ThreeViewer> | null>(null)
const saved = loadState()
const savedFaces = loadFaces()
const showLogo = ref(saved.showLogo)
const config = ref<KeychainConfig>(saved.config)
const constrained = computed(() => constrainConfig(config.value))
const effectiveConfig = computed(() => constrained.value.valid ? constrained.value.config : DEFAULT_CONFIG)
const front = useFaceArtwork('front', savedFaces.front, effectiveConfig)
const back = useFaceArtwork('back', savedFaces.back, effectiveConfig)
const selectedFace = ref<Face>('front')
const selectedSettings = computed(() => selectedFace.value === 'front' ? front.settings.value : back.settings.value)
const source = computed(() => selectedFace.value === 'front' || back.settings.value.mode === 'same' ? front : back)
const mode = computed({ get: () => selectedSettings.value.mode, set: (value: FaceMode) => { selectedSettings.value.mode = value } })
const mirror = computed({ get: () => selectedSettings.value.mirror, set: value => { selectedSettings.value.mirror = value } })
const emptyGroups: ColorGroup[] = []
const parsedGroups = computed(() => mode.value === 'empty' ? emptyGroups : source.value.parser.colorGroups.value)
const colorGroups = computed(() => mode.value === 'empty' ? emptyGroups : source.value.refined.groups.value)
const refinements = computed({ get: () => source.value.refinements.value, set: value => { source.value.refinements.value = value } })
const refined = computed(() => source.value.refined)
const importReport = computed(() => mode.value === 'empty' ? null : source.value.parser.report.value)
const artworkError = computed(() => mode.value === 'empty' ? null : source.value.error.value)
const artwork = computed<KeychainArtwork>(() => ({
  front: { groups: front.settings.value.mode !== 'empty' ? front.refined.groups.value : emptyGroups,
    mirror: front.settings.value.mirror },
  back: { groups: back.settings.value.mode === 'empty' ? emptyGroups
    : back.settings.value.mode === 'same' ? front.refined.groups.value : back.refined.groups.value,
    mirror: back.settings.value.mirror },
  showLogo: showLogo.value,
}))
const fitKey = computed(() => [front.parser.colorGroups.value, back.parser.colorGroups.value])
const validation = computed(() => constrained.value.valid
  ? constrainConfig(config.value, fitFaces(artwork.value.front.groups, artwork.value.back.groups, constrained.value.config))
  : constrained.value)
const configError = computed(() => validation.value.messages.find(m => m.severity === 'error')?.message ?? null)
const OUTLINE_POINT_WARNING_THRESHOLD = 500
const outlineWarning = computed(() => Math.max(front.refined.outlinePoints.value.after, back.refined.outlinePoints.value.after) > OUTLINE_POINT_WARNING_THRESHOLD
  ? `Over ${OUTLINE_POINT_WARNING_THRESHOLD} outline points: updates may be slow. Increase Simplify to reduce complexity.` : '')
const exporting = ref(false)
const exportError = ref<string | null>(null)
const buildStatus = ref<BuildStatus>('pending')
const modelError = ref<string | null>(null)
const usedSources = computed(() => {
  const sources = []
  if (front.settings.value.mode !== 'empty' || back.settings.value.mode === 'same') sources.push(front)
  if (back.settings.value.mode === 'artwork') sources.push(back)
  return sources
})
const importing = computed(() => usedSources.value.some(s => s.importing.value))
const failedSource = computed(() => usedSources.value.find(s => s.error.value))
const faceError = computed(() => failedSource.value?.error.value ?? null)
const hasImport = computed(() => usedSources.value.some(s => s.parser.colorGroups.value.length > 0))
const hasPrintedLogo = computed(() => showLogo.value && (artwork.value.front.groups.length > 0 || artwork.value.back.groups.length > 0))
const canExport = computed(() => hasImport.value && !faceError.value && validation.value.valid
  && !importing.value && buildStatus.value === 'ready' && !exporting.value)
const exportLabel = computed(() => !hasImport.value || hasPrintedLogo.value ? 'Download .3mf' : 'Download .3mf (base only)')
const readiness = computed(() => {
  if (importing.value) return 'Importing artwork\u2026'
  if (faceError.value) return `Fix the ${failedSource.value === front ? 'Front' : 'Back'} artwork import before exporting.`
  if (configError.value) return configError.value
  if (modelError.value) return modelError.value
  if (!hasImport.value) return 'Upload artwork to create a keychain.'
  if (buildStatus.value === 'pending') return 'Updating model\u2026'
  return hasPrintedLogo.value ? 'Ready to export.' : 'Ready to export the base only.'
})
function handleBuildStatus(status: BuildStatus, message?: string) {
  buildStatus.value = status
  modelError.value = message ?? null
}
function handleImportStarted(face: Face, retraced: boolean) {
  exportError.value = null
  ;(face === 'front' ? front : back).started(retraced)
}
const previewData = computed<LogoPreviewData>(() => ({
  sourceKey: `${selectedFace.value}:${mode.value}:${source.value.sourceKey.value}`,
  parsed: parsedGroups.value,
  groups: colorGroups.value,
  hiddenColors: refinements.value.hiddenColors,
  hiddenShapes: refinements.value.hiddenShapes,
  thinPath: refined.value.thinFeatures.value.path,
  plateColor: config.value.baseColor,
  mirror: mirror.value,
  faceLabel: selectedFace.value === 'front' ? 'Front' : 'Back',
}))
const previewExpanded = ref(false)
const showThinFeatures = ref(true)
const showPreviewPanel = computed(() => previewExpanded.value && parsedGroups.value.length > 0)
function toggleShape(id: string) {
  const hidden = refinements.value.hiddenShapes
  refinements.value = { ...refinements.value, hiddenShapes: hidden.includes(id) ? hidden.filter(h => h !== id) : [...hidden, id] }
}
watch(config, value => saveConfig(value), { deep: true })
watch(showLogo, value => saveShowLogo(value))

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
        v-model:showThinFeatures="showThinFeatures"
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
        v-model:selectedFace="selectedFace"
        v-model:faceMode="mode"
        v-model:mirror="mirror"
        @svgLoaded="(face: Face, text: string, retraced?: boolean) => (face === 'front' ? front : back).loaded(text, retraced)"
        @importStarted="handleImportStarted"
        @importFailed="(face: Face, message: string) => (face === 'front' ? front : back).failed(message)"
        @toggleShape="toggleShape"
      />

      <aside class="model-preview min-w-0 flex flex-col gap-2" aria-label="3D preview and export">
        <div class="three-frame relative bg-gray-100 border border-gray-200 rounded-lg overflow-hidden">
          <ThreeViewer
            ref="viewerRef"
            :artwork="artwork"
            :fitKey="fitKey"
            :showLogo="showLogo"
            :config="validation.config"
            :configError="configError"
            @buildStatus="handleBuildStatus"
          />
          <div class="absolute top-2 right-2 flex items-center gap-2">
            <IconTooltip v-if="outlineWarning" label="Outline complexity warning" :message="outlineWarning" />
            <button
              class="px-2 py-1 text-xs bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 active:bg-gray-100"
              @click="viewerRef?.resetView()"
            >
              Reset View
            </button>
          </div>
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
        v-model:showThinFeatures="showThinFeatures"
        @close="previewExpanded = false"
        @toggleShape="toggleShape"
      />
    </main>
  </div>
</template>
