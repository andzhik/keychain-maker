<script setup lang="ts">
import { computed } from 'vue'
import PanelCard from './PanelCard.vue'
import SliderField from './SliderField.vue'
import IconTooltip from './IconTooltip.vue'
import FeedbackNotice from './FeedbackNotice.vue'
import type { BasePlateShape, KeychainConfig, PrinterSettings } from '../types/keychain'
import type { ConfigAdjustment, ConfigMessage } from '../utils/configConstraints'
import { printabilityWarnings } from '../utils/printability'

const props = defineProps<{
  showLogo: boolean
  config: KeychainConfig
  effectiveConfig: KeychainConfig
  adjustments: ConfigAdjustment[]
  configMessages: ConfigMessage[]
}>()
const emit = defineEmits<{
  'update:showLogo': [value: boolean]
  'update:config': [value: KeychainConfig]
}>()
const printer = defineModel<PrinterSettings>('printer', { required: true })
const warnings = computed(() => printabilityWarnings(props.effectiveConfig, printer.value.nozzleDiameter))
const warning = (field: keyof KeychainConfig) => warnings.value.find(w => w.field === field)?.message
const INFO = {
  printLogo: 'When off, both images are left out and you download a solid plate with the same dimensions.',
  nozzle: 'Your printer’s nozzle diameter, shared by both faces. Used to check printability; it doesn’t change the model.',
  thinWalls: 'Turn on if your slicer prints walls a single line wide (“Detect thin walls” or similar). '
    + 'Details then print down to 1 nozzle width instead of 2.',
  shape: 'Rectangle fits both faces; Circle keeps a fixed diameter with each image centered.',
  width: 'Width of the plate, not counting the keyring loop. Each image fills the width inside the margins; the taller fitted image sets rectangle height.',
  thickness: 'Total thickness of the keychain, logo included.',
  logoDepth: 'Depth of the logo on each face. The middle stays plate material to reduce filament changes. '
    + '0.6 mm is 3 layers at a 0.2 mm layer height; choose a multiple of your slicer layer height. '
    + 'Limited to half the plate thickness. Opposing inlays meet only where their outlines overlap; an Empty face stays solid.',
  margin: 'Space between the logo and the plate edge. Raised automatically to keep the logo clear of the keyring hole.',
  cornerRadius: 'Rounds the corners of a rectangle plate.',
  plateColor: 'Filament color of the plate. Logo colors you remove show this color.',
  bevel: 'Size of the chamfer on the top and bottom edges. 0 = sharp edges.',
  bevelSegments: 'Steps in the edge profile: 1 is a flat chamfer, more gives a rounder edge.',
  keyring: 'Adds a loop with a hole to the top of the plate.',
  hole: 'Diameter of the hole for the split ring or chain.',
  ring: 'Outer diameter of the loop around the hole. Leave at least 2 mm of wall on each side of the hole.',
}
const SHAPES: { value: BasePlateShape; label: string }[] = [
  { value: 'square', label: 'Rectangle' },
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
  <section id="shared-settings" class="control-panel flex flex-col gap-3" aria-label="Shared settings">
    <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-500">Shared settings</h2>
    <!-- Plate: shape, size, thickness, color -->
    <PanelCard title="Plate">
      <FeedbackNotice v-for="message in configMessages.filter(m => m.severity === 'error')" :key="message.field + message.code" severity="error" title="Invalid plate setting" :announce="false"><p>{{ message.message }}</p></FeedbackNotice>
      <div class="flex items-center justify-between gap-3">
        <span class="inline-flex items-center gap-1 text-sm text-gray-700">
          Shape<IconTooltip kind="info" label="About Shape" :message="INFO.shape" align="left" />
        </span>
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
        label="Width" unit="mm" field="targetWidth" :info="INFO.width"
        :modelValue="config.targetWidth" :min="20" :max="150" :step="1"
        @update:modelValue="v => updateField('targetWidth', v)"
      />
      <SliderField
        label="Thickness" unit="mm" field="baseThickness" :info="INFO.thickness"
        :modelValue="config.baseThickness" :min="0.4" :max="10" :step="0.1"
        @update:modelValue="v => updateField('baseThickness', v)"
      />
      <FeedbackNotice v-if="warning('baseThickness')" severity="warning" title="Thin base may be fragile"><p>{{ warning('baseThickness') }}</p></FeedbackNotice>
      <SliderField
        label="Margin" unit="mm" field="padding" :info="INFO.margin"
        :modelValue="config.padding" :min="0" :max="20" :step="0.5"
        :note="adjustment('padding')"
        @update:modelValue="v => updateField('padding', v)"
      />
      <SliderField
        v-if="config.basePlateShape === 'square'"
        label="Corner radius" unit="mm" field="cornerRadius" :info="INFO.cornerRadius"
        :modelValue="config.cornerRadius" :min="0" :max="20" :step="0.5"
        :note="adjustment('cornerRadius')"
        @update:modelValue="v => updateField('cornerRadius', v)"
      />

      <div class="flex items-center justify-between gap-3">
        <span class="inline-flex items-center gap-1 text-sm text-gray-700">
          Color<IconTooltip kind="info" label="About Color" :message="INFO.plateColor" align="left" />
        </span>
        <div class="flex items-center gap-1.5">
          <input
            type="color"
            :value="config.baseColor"
            @input="updateField('baseColor', ($event.target as HTMLInputElement).value)"
            aria-label="Plate color"
            class="w-6 h-6 rounded border border-gray-300 cursor-pointer p-0"
          />
          <span class="text-gray-400 font-mono text-xs">{{ config.baseColor }}</span>
        </div>
      </div>
      <div class="pt-2 border-t border-gray-100 flex items-center gap-1">
        <label class="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" :checked="showLogo" class="accent-gray-700"
            @change="emit('update:showLogo', ($event.target as HTMLInputElement).checked)" />
          Print logo
        </label>
        <IconTooltip kind="info" label="About Print logo" :message="INFO.printLogo" align="left" />
      </div>
      <SliderField
        label="Logo depth" unit="mm" field="logoDepth" :info="INFO.logoDepth"
        :modelValue="config.logoDepth" :min="0.1" :max="5" :step="0.1"
        :disabled="!showLogo"
        :note="adjustment('logoDepth')"
        @update:modelValue="v => updateField('logoDepth', v)"
      />
      <h3 class="pt-2 border-t border-gray-100 text-xs font-medium text-gray-500">Edge</h3>
      <SliderField
        label="Bevel" unit="mm" field="edgeBevel" :info="INFO.bevel"
        :modelValue="config.edgeBevel" :min="0" :max="2" :step="0.1"
        :note="adjustment('edgeBevel')"
        @update:modelValue="v => updateField('edgeBevel', v)"
      />
      <SliderField
        label="Bevel segments" field="bevelSegments" :info="INFO.bevelSegments"
        :modelValue="config.bevelSegments" :min="1" :max="8" :step="1"
        :disabled="config.edgeBevel <= 0"
        :note="adjustment('bevelSegments')"
        @update:modelValue="v => updateField('bevelSegments', v)"
      />
    </PanelCard>

    <PanelCard title="Printer">
      <SliderField
        label="Nozzle" unit="mm" field="nozzleDiameter" :info="INFO.nozzle"
        :modelValue="printer.nozzleDiameter" :min="0.2" :max="1" :step="0.05"
        @update:modelValue="v => printer = { ...printer, nozzleDiameter: v }"
      />
      <div class="flex items-center gap-1">
        <label class="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" :checked="printer.thinWalls" class="accent-gray-700"
            @change="printer = { ...printer, thinWalls: ($event.target as HTMLInputElement).checked }" />
          Thin walls
        </label>
        <IconTooltip kind="info" label="About Thin walls" :message="INFO.thinWalls" align="left" />
      </div>
    </PanelCard>

    <!-- Keyring -->
    <PanelCard title="Keyring">
      <template #action>
        <span class="flex items-center gap-1">
          <label class="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              :checked="config.keyringEnabled"
              @change="updateField('keyringEnabled', ($event.target as HTMLInputElement).checked)"
              class="accent-gray-700"
            />
            Enabled
          </label>
          <IconTooltip kind="info" label="About Keyring" :message="INFO.keyring" />
        </span>
      </template>

      <SliderField
        label="Hole diameter" unit="mm" field="keyringHoleDiameter" :info="INFO.hole"
        :modelValue="config.keyringHoleDiameter" :min="2" :max="10" :step="0.5"
        :disabled="!config.keyringEnabled"
        :note="config.keyringEnabled ? adjustment('keyringHoleDiameter') : undefined"
        @update:modelValue="v => updateField('keyringHoleDiameter', v)"
      />
      <SliderField
        label="Ring diameter" unit="mm" field="keyringRingDiameter" :info="INFO.ring"
        :modelValue="config.keyringRingDiameter" :min="4" :max="15" :step="0.5"
        :disabled="!config.keyringEnabled"
        @update:modelValue="v => updateField('keyringRingDiameter', v)"
      />
      <FeedbackNotice v-if="warning('keyringHoleDiameter')" severity="warning" title="Keyring wall may be fragile"><p>{{ warning('keyringHoleDiameter') }}</p></FeedbackNotice>
    </PanelCard>
  </section>
</template>
