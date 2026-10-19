<script setup lang="ts">
import { computed } from 'vue'
import ColorList from './ColorList.vue'
import LogoPreview, { type LogoPreviewData } from './LogoPreview.vue'
import PanelCard from './PanelCard.vue'
import SliderField from './SliderField.vue'
import SvgUploader from './SvgUploader.vue'
import WarningTooltip from './WarningTooltip.vue'
import { DEFAULT_REFINEMENTS, type BasePlateShape, type ColorGroup, type KeychainConfig, type Refinements } from '../types/keychain'
import type { ConfigAdjustment, ConfigMessage } from '../utils/configConstraints'
import type { ThinFeatures } from '../utils/thinFeatures'
import { printabilityWarnings, type TinyIslands } from '../utils/printability'
import type { SvgImportReport } from '../utils/svgImport'

const props = defineProps<{
  /** The logo as parsed from the SVG. */
  parsedGroups: ColorGroup[]
  /** The logo after refinements: what gets printed. */
  colorGroups: ColorGroup[]
  /** What the logo previews draw; shared with the enlarged one. */
  preview: LogoPreviewData
  /** The enlarged preview is showing. */
  previewExpanded: boolean
  /** Printed color → the source colors in it. */
  colorSources: Map<string, string[]>
  refinements: Refinements
  specksRemoved: number
  /** Outline points before and after simplification. */
  outlinePoints: { before: number; after: number }
  thinFeatures: ThinFeatures
  tinyIslands: TinyIslands
  minFeatureWidth: number
  error: string | null
  importReport: SvgImportReport | null
  showLogo: boolean
  config: KeychainConfig
  effectiveConfig: KeychainConfig
  adjustments: ConfigAdjustment[]
  configMessages: ConfigMessage[]
}>()

const emit = defineEmits<{
  svgLoaded: [svgText: string, retraced?: boolean]
  importStarted: [retraced: boolean]
  importFailed: [message: string]
  'update:showLogo': [value: boolean]
  'update:config': [value: KeychainConfig]
  'update:refinements': [value: Refinements]
  'update:previewExpanded': [value: boolean]
  toggleShape: [id: string]
}>()

const showThinFeatures = defineModel<boolean>('showThinFeatures', { required: true })

const MAX_COLOR_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 8]

function updateRefinement<K extends keyof Refinements>(field: K, value: Refinements[K]) {
  emit('update:refinements', { ...props.refinements, [field]: value })
}

const hiddenShapeCount = computed(() => props.refinements.hiddenShapes.length)
const warnings = computed(() => printabilityWarnings(props.effectiveConfig, props.refinements.nozzleDiameter))
const warning = (field: keyof KeychainConfig) => warnings.value.find(w => w.field === field)?.message

const refined = computed(() => {
  const r = props.refinements
  return r.hiddenShapes.length > 0 || r.hiddenColors.length > 0 || Object.keys(r.recolor).length > 0
    || r.mergeTolerance > 0 || r.maxColors > 0 || r.minSpeckArea > 0
    || r.simplifyTolerance !== DEFAULT_REFINEMENTS.simplifyTolerance
})

const pointsNote = computed(() => {
  const { before, after } = props.outlinePoints
  if (before === 0) return ''
  const fmt = (n: number) => n.toLocaleString('en-US')
  if (after === before) return `${fmt(before)} outline points.`
  return `${fmt(before)} → ${fmt(after)} outline points (−${Math.round((1 - after / before) * 100)}%).`
})

/** Undoes every refinement; the nozzle is a printer setting, so it stays. */
function resetRefinements() {
  emit('update:refinements', { ...DEFAULT_REFINEMENTS, nozzleDiameter: props.refinements.nozzleDiameter })
}

const fmtMm = (mm: number) => mm.toFixed(2).replace(/0$/, '')
const nozzleWarning = computed(() => `${props.thinFeatures.count} thin area${props.thinFeatures.count !== 1 ? 's' : ''} under ${fmtMm(props.minFeatureWidth)} mm (2 nozzle widths) may not print. Enable Thin areas to highlight.`)

const SHAPES: { value: BasePlateShape; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'circle', label: 'Circle' },
]

function adjustment(field: keyof KeychainConfig): string | undefined {
  return props.adjustments.find(a => a.field === field)?.message
}

function updateField<K extends keyof KeychainConfig>(field: K, value: KeychainConfig[K]) {
  emit('update:config', { ...props.config, [field]: value })
}
</script>

<template>
  <div class="control-panel gap-3 items-start">
    <div class="control-column flex flex-col gap-3">
      <!-- Logo: upload, preview, colors -->
      <PanelCard title="Logo">
        <template #action>
          <label class="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              :checked="showLogo"
              @change="emit('update:showLogo', ($event.target as HTMLInputElement).checked)"
              class="accent-gray-700"
            />
            Show logo
          </label>
        </template>

        <SvgUploader
          @svgLoaded="(text: string, retraced?: boolean) => emit('svgLoaded', text, retraced)"
          @importStarted="(retraced: boolean) => emit('importStarted', retraced)"
          @importFailed="(message: string) => emit('importFailed', message)"
        />
        <div v-if="error || importReport" role="region" aria-label="SVG import report" class="text-xs text-gray-500 space-y-1">
          <p class="font-medium text-gray-700">SVG import report</p>
          <p v-if="error" role="alert" class="text-red-600">{{ error }}</p>
          <template v-else-if="importReport">
            <p>Ready: {{ parsedGroups.length }} colors, {{ parsedGroups.reduce((n, group) => n + group.shapes.length, 0) }} filled shapes.</p>
            <p v-if="importReport.removedMetadata">Removed {{ importReport.removedMetadata }} non-rendering metadata elements.</p>
            <p v-if="importReport.normalizedStyles">Normalized inline fills/styles on {{ importReport.normalizedStyles }} elements.</p>
          </template>
        </div>

        <div v-if="parsedGroups.length">
          <div class="relative">
            <LogoPreview v-bind="preview" :showThinFeatures="showThinFeatures" class="h-48" @toggleShape="(id: string) => emit('toggleShape', id)" />
            <button
              type="button"
              class="absolute top-1.5 right-1.5 p-1 bg-white/90 border border-gray-300 rounded shadow-sm text-gray-600 hover:bg-white hover:text-gray-900"
              :title="previewExpanded ? 'Close enlarged preview' : 'Enlarge preview'"
              :aria-label="previewExpanded ? 'Close enlarged preview' : 'Enlarge preview'"
              :aria-pressed="previewExpanded"
              @click="emit('update:previewExpanded', !previewExpanded)"
            >
              <svg viewBox="0 0 16 16" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                <path v-if="previewExpanded" d="M9.5 2.5v4h4M6.5 13.5v-4h-4M9.5 6.5 14 2M6.5 9.5 2 14" />
                <path v-else d="M10 2h4v4M6 14H2v-4M14 2 9.5 6.5M2 14l4.5-4.5" />
              </svg>
            </button>
          </div>
          <p class="mt-1 flex items-center gap-1 text-[11px] text-gray-400">
            <span>Click a shape to remove it.</span>
            <button
              v-if="hiddenShapeCount"
              type="button"
              class="ml-auto text-gray-500 underline hover:text-gray-800"
              @click="updateRefinement('hiddenShapes', [])"
            >
              Restore {{ hiddenShapeCount }} shape{{ hiddenShapeCount !== 1 ? 's' : '' }}
            </button>
          </p>
          <label class="mt-1 flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
            <input v-model="showThinFeatures" type="checkbox" class="accent-red-500" />
            <span>Thin areas <span class="inline-block w-3 h-2 align-middle bg-red-500" aria-hidden="true" /></span>
          </label>
        </div>

        <div>
          <h3 class="text-sm text-gray-700 mb-1">
            Colors
            <span v-if="colorGroups.length" class="text-gray-400">({{ colorGroups.length }})</span>
          </h3>
          <p v-if="parsedGroups.length === 0" class="text-sm text-gray-400">—</p>
          <ColorList
            v-else
            :parsed="parsedGroups"
            :groups="colorGroups"
            :sources="colorSources"
            :refinements="refinements"
            @update:refinements="(value: Refinements) => emit('update:refinements', value)"
          />
        </div>
      </PanelCard>

      <!-- Refine: print-oriented cleanup of the logo -->
      <PanelCard title="Refine">
        <template #action>
          <button
            v-if="refined"
            type="button"
            class="text-xs text-gray-500 underline hover:text-gray-800"
            @click="resetRefinements"
          >
            Reset
          </button>
        </template>

        <SliderField
          label="Merge similar" unit="ΔE" field="mergeTolerance" labelWidth="w-24"
          :modelValue="refinements.mergeTolerance" :min="0" :max="50" :step="1"
          @update:modelValue="v => updateRefinement('mergeTolerance', v)"
        />
        <div class="flex items-center justify-between gap-3">
          <span class="text-sm text-gray-700">Max colors</span>
          <select
            :value="refinements.maxColors"
            aria-label="Max colors"
            class="px-1.5 py-0.5 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:border-gray-500"
            @change="updateRefinement('maxColors', Number(($event.target as HTMLSelectElement).value))"
          >
            <option v-for="n in MAX_COLOR_OPTIONS" :key="n" :value="n">{{ n === 0 ? 'No limit' : n }}</option>
          </select>
        </div>
        <div>
          <SliderField
            label="Min speck" unit="mm²" field="minSpeckArea" labelWidth="w-24"
            :modelValue="refinements.minSpeckArea" :min="0" :max="5" :step="0.1"
            @update:modelValue="v => updateRefinement('minSpeckArea', v)"
          />
          <p v-if="refinements.minSpeckArea > 0" class="mt-0.5 text-xs text-gray-500">
            {{ specksRemoved ? `Removed ${specksRemoved} speck${specksRemoved !== 1 ? 's' : ''}.` : 'No specks this small.' }}
          </p>
        </div>
        <div>
          <SliderField
            label="Simplify" unit="mm" field="simplifyTolerance" labelWidth="w-24"
            :modelValue="refinements.simplifyTolerance" :min="0" :max="0.2" :step="0.01"
            @update:modelValue="v => updateRefinement('simplifyTolerance', v)"
          />
          <p v-if="pointsNote" class="mt-0.5 text-xs text-gray-500">{{ pointsNote }}</p>
        </div>
        <div>
          <SliderField
            label="Nozzle" unit="mm" field="nozzleDiameter" labelWidth="w-24"
            :modelValue="refinements.nozzleDiameter" :min="0.2" :max="1" :step="0.05"
            @update:modelValue="v => updateRefinement('nozzleDiameter', v)"
          >
            <template #labelSuffix>
              <WarningTooltip v-if="thinFeatures.count" label="Nozzle warning" :message="nozzleWarning" align="left" placement="above" />
            </template>
          </SliderField>
          <p v-if="!thinFeatures.count && parsedGroups.length" class="mt-0.5 text-xs text-gray-500">
            No thin areas detected at {{ fmtMm(minFeatureWidth) }} mm (2 nozzle widths).
          </p>
          <p v-if="showLogo && tinyIslands.count" role="status" class="mt-0.5 text-xs text-amber-600">
            {{ tinyIslands.count }} tiny logo island{{ tinyIslands.count !== 1 ? 's' : '' }}
            under {{ tinyIslands.minAreaMm2.toFixed(2) }} mm² may not print
            (less material than a {{ fmtMm(minFeatureWidth) }} mm disc).
            Increase Width, merge colors, or remove them with Min speck.
          </p>
        </div>
      </PanelCard>
    </div>

    <div class="control-column flex flex-col gap-3">
      <!-- Plate: shape, size, thickness, color -->
      <PanelCard title="Plate">
        <p v-for="message in configMessages.filter(m => m.severity === 'error')" :key="message.field + message.code" role="alert" class="text-xs text-red-600">{{ message.message }}</p>
        <div class="flex items-center justify-between gap-3">
          <span class="text-sm text-gray-700">Shape</span>
          <div class="inline-flex rounded border border-gray-300 overflow-hidden" role="radiogroup" aria-label="Plate shape">
            <button
              v-for="shape in SHAPES"
              :key="shape.value"
              type="button"
              role="radio"
              :aria-checked="config.basePlateShape === shape.value"
              class="px-3 py-0.5 text-sm transition-colors"
              :class="config.basePlateShape === shape.value
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'"
              @click="updateField('basePlateShape', shape.value)"
            >
              {{ shape.label }}
            </button>
          </div>
        </div>

        <SliderField
          label="Width" unit="mm" field="targetWidth"
          :modelValue="config.targetWidth" :min="20" :max="150" :step="1"
          @update:modelValue="v => updateField('targetWidth', v)"
        />
        <SliderField
          label="Thickness" unit="mm" field="baseThickness"
          :modelValue="config.baseThickness" :min="0.4" :max="10" :step="0.1"
          :note="warning('baseThickness')"
          @update:modelValue="v => updateField('baseThickness', v)"
        />
        <SliderField
          label="Padding" unit="mm" field="padding"
          :modelValue="config.padding" :min="0" :max="20" :step="0.5"
          :note="adjustment('padding')"
          @update:modelValue="v => updateField('padding', v)"
        />
        <SliderField
          label="Corner radius" unit="mm" field="cornerRadius"
          :modelValue="config.cornerRadius" :min="0" :max="20" :step="0.5"
          :disabled="config.basePlateShape !== 'square'"
          :note="adjustment('cornerRadius')"
          @update:modelValue="v => updateField('cornerRadius', v)"
        />

        <div class="flex items-center justify-between gap-3">
          <span class="text-sm text-gray-700">Color</span>
          <div class="flex items-center gap-1.5">
            <span class="text-gray-400 font-mono text-xs">{{ config.baseColor }}</span>
            <input
              type="color"
              :value="config.baseColor"
              @input="updateField('baseColor', ($event.target as HTMLInputElement).value)"
              aria-label="Plate color"
              class="w-6 h-6 rounded border border-gray-300 cursor-pointer p-0"
            />
          </div>
        </div>
      </PanelCard>

      <!-- Edge: bevel -->
      <PanelCard title="Edge">
        <SliderField
          label="Bevel" unit="mm" field="edgeBevel"
          :modelValue="config.edgeBevel" :min="0" :max="2" :step="0.1"
          :note="adjustment('edgeBevel')"
          @update:modelValue="v => updateField('edgeBevel', v)"
        />
        <SliderField
          label="Bevel segments" field="bevelSegments"
          :modelValue="config.bevelSegments" :min="1" :max="8" :step="1"
          :disabled="config.edgeBevel <= 0"
          :note="adjustment('bevelSegments')"
          @update:modelValue="v => updateField('bevelSegments', v)"
        />
      </PanelCard>

      <!-- Keyring -->
      <PanelCard title="Keyring">
        <template #action>
          <label class="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              :checked="config.keyringEnabled"
              @change="updateField('keyringEnabled', ($event.target as HTMLInputElement).checked)"
              class="accent-gray-700"
            />
            Enabled
          </label>
        </template>

        <SliderField
          label="Hole diameter" unit="mm" field="keyringHoleDiameter"
          :modelValue="config.keyringHoleDiameter" :min="2" :max="10" :step="0.5"
          :disabled="!config.keyringEnabled"
          :note="config.keyringEnabled ? [adjustment('keyringHoleDiameter'), warning('keyringHoleDiameter')].filter(Boolean).join(' ') : undefined"
          @update:modelValue="v => updateField('keyringHoleDiameter', v)"
        />
        <SliderField
          label="Ring diameter" unit="mm" field="keyringRingDiameter"
          :modelValue="config.keyringRingDiameter" :min="4" :max="15" :step="0.5"
          :disabled="!config.keyringEnabled"
          @update:modelValue="v => updateField('keyringRingDiameter', v)"
        />
      </PanelCard>
    </div>
  </div>
</template>
