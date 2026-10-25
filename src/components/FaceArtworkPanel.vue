<script setup lang="ts">
import { computed, ref } from 'vue'
import ColorList from './ColorList.vue'
import LogoPreview, { type LogoPreviewData } from './LogoPreview.vue'
import LogoPreviewPanel from './LogoPreviewPanel.vue'
import PanelCard from './PanelCard.vue'
import SliderField from './SliderField.vue'
import SvgUploader from './SvgUploader.vue'
import IconTooltip from './IconTooltip.vue'
import FeedbackNotice from './FeedbackNotice.vue'
import type { FaceArtwork } from '../composables/useFaceArtwork'
import { useAdvanced } from '../composables/useAdvanced'
import { DEFAULT_REFINEMENTS, type Face, type FaceMode, type Refinements, type PrinterSettings } from '../types/keychain'
import { outlinePointsNote } from '../utils/simplify'

const props = defineProps<{
  face: Face
  artwork: FaceArtwork
  frontArtwork: FaceArtwork
  otherColors: string[]
  baseColor: string
  printer: PrinterSettings
  expanded: boolean
}>()
const emit = defineEmits<{
  'update:expanded': [value: boolean]
  importStarted: []
}>()
const advanced = useAdvanced()
const faceLabel = computed(() => props.face === 'front' ? 'Front' : 'Back')
const faceMode = computed({
  get: () => props.artwork.settings.value.mode,
  set: (value: FaceMode) => { props.artwork.settings.value.mode = value },
})
const mirror = computed({
  get: () => props.artwork.settings.value.mirror,
  set: (value: boolean) => { props.artwork.settings.value.mirror = value },
})
const source = computed(() => faceMode.value === 'same' ? props.frontArtwork : props.artwork)
const parsedGroups = computed(() => faceMode.value === 'empty' ? [] : source.value.parser.colorGroups.value)
const colorGroups = computed(() => faceMode.value === 'empty' ? [] : source.value.refined.groups.value)
const refinements = computed({
  get: () => source.value.refinements.value,
  set: (value: Refinements) => { if (faceMode.value === 'artwork') props.artwork.refinements.value = value },
})
const error = computed(() => faceMode.value === 'empty' ? null : source.value.error.value)
const importReport = computed(() => faceMode.value === 'empty' ? null : source.value.parser.report.value)
const colorSources = computed(() => source.value.refined.sources.value)
const specksRemoved = computed(() => source.value.refined.specksRemoved.value)
const outlinePoints = computed(() => source.value.refined.outlinePoints.value)
const thinFeatures = computed(() => source.value.refined.thinFeatures.value)
const tinyIslands = computed(() => source.value.refined.tinyIslands.value)
const minFeatureWidth = computed(() => source.value.refined.minFeatureWidth.value)
const showThinFeatures = ref(true)
const preview = computed<LogoPreviewData>(() => ({
  sourceKey: `${props.face}:${faceMode.value}:${source.value.sourceKey.value}`,
  parsed: parsedGroups.value,
  groups: colorGroups.value,
  hiddenColors: refinements.value.hiddenColors,
  hiddenShapes: refinements.value.hiddenShapes,
  thinPath: thinFeatures.value.path,
  plateColor: props.baseColor,
  mirror: mirror.value,
  faceLabel: faceLabel.value,
  readOnly: faceMode.value === 'same',
}))
function toggleShape(id: string) {
  const hidden = refinements.value.hiddenShapes
  updateRefinement('hiddenShapes', hidden.includes(id) ? hidden.filter(h => h !== id) : [...hidden, id])
}
function importStarted(retraced: boolean) {
  emit('importStarted')
  props.artwork.started(retraced)
}
const MAX_COLOR_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 8]
function updateRefinement<K extends keyof Refinements>(field: K, value: Refinements[K]) {
  refinements.value = { ...refinements.value, [field]: value }
}
const hiddenShapeCount = computed(() => refinements.value.hiddenShapes.length)
const refined = computed(() => {
  const r = refinements.value
  return r.hiddenShapes.length > 0 || r.hiddenColors.length > 0 || Object.keys(r.recolor).length > 0
    || r.mergeTolerance > 0 || r.maxColors > 0 || r.minSpeckSize > 0
    || r.simplifyTolerance !== DEFAULT_REFINEMENTS.simplifyTolerance
})
const pointsNote = computed(() => outlinePointsNote(outlinePoints.value))
function resetRefinements() {
  refinements.value = { ...DEFAULT_REFINEMENTS, recolor: {}, hiddenColors: [], hiddenShapes: [] }
}
function removeTinyIslands() {
  updateRefinement('minSpeckSize', +(Math.ceil(minFeatureWidth.value / 0.05 - 1e-9) * 0.05).toFixed(2))
}
const fmtMm = (mm: number) => mm.toFixed(2).replace(/0$/, '')
const plural = (n: number, word: string) => `${n} ${word}${n !== 1 ? 's' : ''}`
const shapeCount = computed(() => parsedGroups.value.reduce((n, group) => n + group.shapes.length, 0))
const minWidth = computed(() => `${fmtMm(minFeatureWidth.value)} mm (${props.printer.thinWalls ? '1 nozzle width' : '2 nozzle widths'})`)
const outlineWarning = computed(() => outlinePoints.value.after > 500
  ? 'Over 500 outline points: updates may be slow. Increase Simplify outlines to reduce complexity.' : '')
// Advanced options also show when changed, or when a warning points at them.
const showMirror = computed(() => advanced.value || mirror.value)
const showMerge = computed(() => advanced.value || refinements.value.mergeTolerance > 0)
const showSpecks = computed(() => advanced.value || refinements.value.minSpeckSize > 0 || tinyIslands.value.count > 0)
const showSimplify = computed(() => advanced.value || !!outlineWarning.value
  || refinements.value.simplifyTolerance !== DEFAULT_REFINEMENTS.simplifyTolerance)
const INFO = {
  mirror: 'Flips this face left to right.',
  merge: 'Combines colors that look almost the same, so they print with one filament. Higher merges more; 0 = off.',
  maxColors: 'Merges the most similar colors until at most this many remain. '
    + 'Set it to your free filament slots, minus one for the plate.',
  simplify: 'Reduces outline detail so the model builds faster. '
    + 'The default is finer than a printer can resolve; raise it only if updates feel slow.',
}
const thinAreasInfo = computed(() => thinFeatures.value.count
  ? `${plural(thinFeatures.value.count, 'thin area')} under ${minWidth.value} may not print. `
    + (showThinFeatures.value ? 'Highlighted in red in the image preview.' : 'Turn on Thin areas to see them.')
  : `Highlights in red the parts narrower than ${minWidth.value}, which may not print.`)
const specksInfo = computed(() => `Deletes pieces, and fills holes, narrower than this. Pieces under ${minWidth.value} may not print. 0 = off.`)
</script>

<template>
  <section :id="`${face}-artwork`" class="face-editor flex flex-col gap-3" :aria-label="`${faceLabel} artwork`">
    <PanelCard :title="faceLabel">
      <template #action>
        <button
          v-if="faceMode === 'artwork' && parsedGroups.length && refined"
          type="button"
          class="text-xs text-gray-500 underline hover:text-gray-800"
          title="Undo color changes, removed shapes and cleanup on this face"
          @click="resetRefinements"
        >
          Reset edits
        </button>
      </template>
      <label class="flex items-center justify-between text-sm text-gray-700 gap-2">
        Image
        <select v-model="faceMode" aria-label="Image" class="border border-gray-300 rounded px-1 py-1 text-xs bg-white">
          <option value="artwork">Own image</option>
          <option v-if="face === 'back'" value="same">Same as Front</option>
          <option value="empty">None</option>
        </select>
      </label>
      <p v-if="faceMode === 'same'" class="text-xs text-gray-500">Uses Front’s image and colors. Edit them on Front.</p>
      <p v-if="faceMode === 'empty'" class="text-xs text-gray-500">Plain plate. Your image is kept if you switch back.</p>
      <!-- Keep this source's uploader mounted through mode changes and pending reads. -->
      <SvgUploader v-show="faceMode === 'artwork'"
        :aria-label="`${face} image upload`"
        :imported="artwork.parser.colorGroups.value.length > 0"
        :fileName="artwork.settings.value.fileName"
        @svgLoaded="artwork.loaded"
        @importStarted="importStarted"
        @importFailed="artwork.failed"
      />
      <div v-if="error || importReport" role="region" aria-label="Import" class="text-xs text-gray-500 space-y-1">
        <FeedbackNotice v-if="error" severity="error" :title="`${faceLabel} artwork unavailable`" :announce="false">
          <p>{{ error }}</p>
          <p v-if="faceMode === 'same'">Edit the source artwork on Front, or choose another image option.</p>
          <p v-else>Adjust the tracing options above, upload simpler artwork, or choose None.</p>
        </FeedbackNotice>
        <template v-else-if="importReport">
          <p>Imported {{ plural(parsedGroups.length, 'color') }}, {{ plural(shapeCount, 'shape') }}.</p>
          <template v-if="advanced">
            <p v-if="importReport.removedMetadata">Removed {{ importReport.removedMetadata }} non-rendering metadata elements.</p>
            <p v-if="importReport.normalizedStyles">Normalized inline fills/styles on {{ importReport.normalizedStyles }} elements.</p>
          </template>
        </template>
      </div>

      <div v-if="parsedGroups.length">
        <div class="relative">
          <LogoPreview v-bind="preview" :showThinFeatures="showThinFeatures" class="h-48" @toggleShape="(id: string) => toggleShape(id)" />
          <button
            type="button"
            class="absolute top-1.5 right-1.5 p-1 bg-white/90 border border-gray-300 rounded shadow-sm text-gray-600 hover:bg-white hover:text-gray-900"
            :title="expanded ? 'Close enlarged preview' : 'Enlarge preview'"
            :aria-label="expanded ? 'Close enlarged preview' : 'Enlarge preview'"
            :aria-pressed="expanded"
            @click="emit('update:expanded', !expanded)"
          >
            <svg viewBox="0 0 16 16" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path v-if="expanded" d="M9.5 2.5v4h4M6.5 13.5v-4h-4M9.5 6.5 14 2M6.5 9.5 2 14" />
              <path v-else d="M10 2h4v4M6 14H2v-4M14 2 9.5 6.5M2 14l4.5-4.5" />
            </svg>
          </button>
        </div>
        <p class="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
          <span>Outside view · keyring at top{{ mirror ? ' · mirrored' : '' }}</span>
          <button
            v-if="faceMode === 'artwork' && hiddenShapeCount"
            type="button"
            class="ml-auto text-gray-500 underline hover:text-gray-800"
            @click="updateRefinement('hiddenShapes', [])"
          >
            Restore {{ plural(hiddenShapeCount, 'shape') }}
          </button>
        </p>
        <p v-if="faceMode === 'artwork'" class="text-[11px] text-gray-400">Click a shape to remove it.</p>
        <!-- A view option: it changes the preview, not the model. -->
        <div class="mt-1 flex items-center gap-1">
          <label class="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
            <input v-model="showThinFeatures" type="checkbox" class="accent-red-500" />
            <span>Thin areas <span class="inline-block w-3 h-2 align-middle bg-red-500" aria-hidden="true" /></span>
          </label>
          <IconTooltip :kind="thinFeatures.count ? 'warning' : 'info'" label="About Thin areas" :message="thinAreasInfo" align="center" />
          <span v-if="!thinFeatures.count" class="ml-auto text-[11px] text-gray-400">None under {{ minWidth }}</span>
        </div>
        <div v-if="showMirror" class="mt-1 flex items-center gap-1">
          <label class="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
            <input v-model="mirror" type="checkbox" />
            Mirror horizontally
          </label>
          <IconTooltip kind="info" label="About Mirror horizontally" :message="INFO.mirror" align="left" />
        </div>
      </div>

      <div v-if="faceMode === 'artwork' && parsedGroups.length" class="space-y-2">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-sm text-gray-700">
            Colors
            <span v-if="colorGroups.length" class="text-gray-400">({{ colorGroups.length }})</span>
          </h3>
          <span class="inline-flex items-center gap-1.5 text-xs text-gray-600">
            <label class="flex items-center gap-1.5">
              Max colors
              <select
                :value="refinements.maxColors"
                aria-label="Max colors"
                class="px-1.5 py-0.5 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                @change="updateRefinement('maxColors', Number(($event.target as HTMLSelectElement).value))"
              >
                <option v-for="n in MAX_COLOR_OPTIONS" :key="n" :value="n">{{ n === 0 ? 'No limit' : n }}</option>
              </select>
            </label>
            <IconTooltip kind="info" label="About Max colors" :message="INFO.maxColors" />
          </span>
        </div>
        <ColorList
          :parsed="parsedGroups"
          :groups="colorGroups"
          :sources="colorSources"
          :refinements="refinements"
          :otherColors="otherColors"
          :otherFace="face === 'front' ? 'Back' : 'Front'"
          @update:refinements="(value: Refinements) => refinements = value"
        />
        <SliderField
          v-if="showMerge"
          label="Merge similar" field="mergeTolerance" :info="INFO.merge"
          :modelValue="refinements.mergeTolerance" :min="0" :max="50" :step="1"
          @update:modelValue="v => updateRefinement('mergeTolerance', v)"
        />
      </div>
    </PanelCard>

    <!-- Cleanup: print-oriented geometry fixes -->
    <PanelCard v-if="faceMode === 'artwork' && parsedGroups.length && (showSpecks || showSimplify)" title="Cleanup">
      <div v-if="showSpecks">
        <SliderField
          label="Remove specks" unit="mm" field="minSpeckSize" :info="specksInfo"
          :modelValue="refinements.minSpeckSize" :min="0" :max="3" :step="0.05"
          @update:modelValue="v => updateRefinement('minSpeckSize', v)"
        />
        <p v-if="refinements.minSpeckSize > 0" class="mt-0.5 text-xs text-gray-500">
          {{ specksRemoved ? `Removed ${plural(specksRemoved, 'speck')}.` : 'No specks this small.' }}
        </p>
        <FeedbackNotice v-if="tinyIslands.count" class="mt-2" severity="warning" title="Small pieces may not print">
          <p>
          {{ plural(tinyIslands.count, 'tiny logo island') }}
          smaller than {{ fmtMm(minFeatureWidth) }} mm across may not print.
          Increase Width, merge colors, or
          <button type="button" class="underline hover:text-amber-800" @click="removeTinyIslands">remove them</button>.
          </p>
        </FeedbackNotice>
      </div>
      <div v-if="showSimplify">
        <SliderField
          label="Simplify outlines" unit="mm" field="simplifyTolerance" :info="INFO.simplify"
          :modelValue="refinements.simplifyTolerance" :min="0" :max="0.2" :step="0.01"
          @update:modelValue="v => updateRefinement('simplifyTolerance', v)"
        />
        <p v-if="pointsNote" class="mt-0.5 text-xs text-gray-500">{{ pointsNote }}</p>
        <FeedbackNotice v-if="outlineWarning" class="mt-2" severity="warning" title="Artwork may update slowly"><p>{{ outlineWarning }}</p></FeedbackNotice>
      </div>
    </PanelCard>
    <Teleport v-if="expanded && parsedGroups.length" to="#enlarged-preview">
      <LogoPreviewPanel
        class="expanded-preview shadow-xl"
        :preview="preview"
        v-model:showThinFeatures="showThinFeatures"
        @close="emit('update:expanded', false)"
        @toggleShape="toggleShape"
      />
    </Teleport>
  </section>
</template>
