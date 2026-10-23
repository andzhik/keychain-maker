<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ControlPanel from './components/ControlPanel.vue'
import ExportButton from './components/ExportButton.vue'
import FaceArtworkPanel from './components/FaceArtworkPanel.vue'
import ThreeViewer from './components/ThreeViewer.vue'
import { useFaceArtwork } from './composables/useFaceArtwork'
import { exportTo3MF } from 'three-3mf-exporter'
import { constrainConfig } from './utils/configConstraints'
import { fitFaces } from './utils/logoFit'
import { loadState, loadFaces, loadPrinter, saveConfig, saveShowLogo, savePrinter, clearSession } from './utils/persistence'
import { DEFAULT_CONFIG, type BuildStatus, type KeychainConfig, type Face, type ColorGroup, type KeychainArtwork } from './types/keychain'

const viewerRef = ref<InstanceType<typeof ThreeViewer> | null>(null)
const saved = loadState()
const savedFaces = loadFaces()
const printer = ref(loadPrinter())
const showLogo = ref(saved.showLogo)
const config = ref<KeychainConfig>(saved.config)
const constrained = computed(() => constrainConfig(config.value))
const effectiveConfig = computed(() => constrained.value.valid ? constrained.value.config : DEFAULT_CONFIG)
const frontSettings = ref(savedFaces.front)
const backSettings = ref(savedFaces.back)
const frontActive = computed(() => frontSettings.value.mode !== 'empty' || backSettings.value.mode === 'same')
const backActive = computed(() => backSettings.value.mode === 'artwork')
const front = useFaceArtwork('front', frontSettings, effectiveConfig, printer, frontActive)
const back = useFaceArtwork('back', backSettings, effectiveConfig, printer, backActive)
const expandedFace = ref<Face | null>(null)
const emptyGroups: ColorGroup[] = []
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
const hasPrintedLogo = computed(() => showLogo.value && (artwork.value.front.groups.length > 0 || artwork.value.back.groups.length > 0))
const canExport = computed(() => !faceError.value && validation.value.valid
  && !importing.value && buildStatus.value === 'ready' && !exporting.value)
const exportLabel = computed(() => hasPrintedLogo.value || faceError.value || importing.value ? 'Download .3mf' : 'Download .3mf (base only)')
const logoColors = computed(() => new Set(showLogo.value
  ? [...artwork.value.front.groups, ...artwork.value.back.groups].map(g => g.color.toLowerCase()) : []))
const filamentCount = computed(() => new Set([config.value.baseColor.toLowerCase(), ...logoColors.value]).size)
const downloadName = computed(() => {
  const name = usedSources.value.find(s => s.settings.value.svg && s.settings.value.fileName)?.settings.value.fileName
  const stem = name?.replace(/\.[^.]+$/, '').replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-').replace(/[. ]+$/, '').slice(0, 100)
  return stem ? `${stem}-keychain.3mf` : 'keychain.3mf'
})
const readiness = computed(() => {
  if (importing.value) return 'Importing artwork\u2026'
  if (faceError.value) return `Fix the ${failedSource.value === front ? 'Front' : 'Back'} artwork import before exporting.`
  if (configError.value) return configError.value
  if (modelError.value) return modelError.value
  if (buildStatus.value === 'pending') return 'Updating model\u2026'
  return hasPrintedLogo.value ? 'Ready to export.' : 'Ready to export the base only.'
})
function handleBuildStatus(status: BuildStatus, message?: string) {
  buildStatus.value = status
  modelError.value = message ?? null
}
watch(config, value => saveConfig(value), { deep: true })
watch(showLogo, value => saveShowLogo(value))
savePrinter(printer.value)
watch(printer, value => savePrinter(value), { deep: true })
const resetDialog = ref<HTMLDialogElement | null>(null)
function startOver() {
  clearSession()
  window.location.reload()
}

async function handleExport() {
  if (!canExport.value) return
  const group = viewerRef.value?.getCurrentGroup()
  if (!group) return
  const fileName = downloadName.value
  exporting.value = true
  exportError.value = null
  try {
    // Export without the display rotation (rotation.x = -PI/2 is for viewport only)
    const exportGroup = group.clone()
    exportGroup.rotation.set(0, 0, 0)
    const blob = await exportTo3MF(exportGroup)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
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
const dev = import.meta.env.DEV
</script>

<template>
  <div class="app-shell flex flex-col bg-gray-50 text-gray-900">
    <!-- Header -->
    <header class="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shrink-0">
      <h1 class="text-base font-semibold tracking-tight">Keychain Maker</h1>
      <nav class="flex items-center gap-4 text-xs text-gray-600" aria-label="Help and session">
        <a class="hover:text-gray-900 underline" href="https://github.com/andzhik/keychain-maker/blob/master/docs/user-guide.md" target="_blank" rel="noopener noreferrer">User guide</a>
        <button type="button" class="hover:text-gray-900 underline" @click="resetDialog?.showModal()">Start over</button>
      </nav>
    </header>
    <dialog ref="resetDialog" class="m-auto max-w-sm rounded-lg border border-gray-300 p-5 shadow-xl backdrop:bg-black/30" aria-labelledby="reset-title">
      <h2 id="reset-title" class="font-semibold">Start over?</h2>
      <p class="mt-2 text-sm text-gray-600">Remove both images and reset all keychain and printer settings in this browser.</p>
      <div class="mt-4 flex justify-end gap-3 text-sm">
        <button type="button" class="rounded border border-gray-300 px-3 py-1" @click="resetDialog?.close()">Cancel</button>
        <button type="button" class="rounded bg-gray-800 px-3 py-1 text-white" @click="startOver">Reset everything</button>
      </div>
    </dialog>

    <main class="workspace gap-3 p-3">
      <FaceArtworkPanel
        v-for="face in (['front', 'back'] as const)"
        :key="face"
        :face="face"
        :artwork="face === 'front' ? front : back"
        :frontArtwork="front"
        :baseColor="config.baseColor"
        :showLogo="showLogo"
        :printer="printer"
        :expanded="expandedFace === face"
        @update:expanded="value => expandedFace = value ? face : null"
        @importStarted="exportError = null"
      />

      <div class="inspection-column relative min-w-0 min-h-0">
        <div class="inspection-scroll flex flex-col gap-4">
          <aside class="model-preview min-w-0 flex flex-col gap-2" aria-label="3D preview and export">
            <div class="three-frame relative bg-gray-100 border border-gray-200 rounded-lg overflow-hidden">
              <ThreeViewer
                ref="viewerRef"
                :artwork="artwork"
                :fitKey="fitKey"
                :config="validation.config"
                :configError="configError"
                @buildStatus="handleBuildStatus"
              />
              <div class="absolute top-2 right-2 flex items-center gap-2">
                <button type="button" aria-label="Front view" class="px-2 py-1 text-xs bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50" @click="viewerRef?.showFace('front')">Front</button>
                <button type="button" aria-label="Back view" class="px-2 py-1 text-xs bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50" @click="viewerRef?.showFace('back')">Back</button>
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
                <p v-if="dev">Build time: {{ buildTimeText }}</p>
              </div>
              <div class="w-44 shrink-0">
                <ExportButton
                  :disabled="!canExport"
                  :exporting="exporting"
                  :label="exportLabel"
                  @export="handleExport"
                />
              </div>
            </div>
            <p class="text-xs text-gray-500">Filaments: {{ filamentCount }} (plate + {{ filamentCount - 1 }} logo color{{ filamentCount - 1 !== 1 ? 's' : '' }})</p>
            <p v-if="filamentCount > 4" role="status" class="text-xs text-amber-700">More than 4 filaments: check your printer's available slots or merge logo colors.</p>
            <p role="status" aria-live="polite" class="text-xs shrink-0" :class="modelError ? 'text-red-600' : 'text-gray-500'">{{ readiness }}</p>
            <p v-if="exportError" class="text-xs text-red-500 shrink-0">{{ exportError }}</p>
          </aside>

          <ControlPanel
            v-model:printer="printer"
            v-model:showLogo="showLogo"
            v-model:config="config"
            :adjustments="validation.adjustments"
            :configMessages="validation.messages"
            :effectiveConfig="validation.config"
          />
        </div>
        <div id="enlarged-preview" />
      </div>
    </main>
  </div>
</template>
