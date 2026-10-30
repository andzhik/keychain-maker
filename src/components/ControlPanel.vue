<script setup lang="ts">
import { computed } from 'vue'
import PanelCard from './PanelCard.vue'
import SliderField from './SliderField.vue'
import IconTooltip from './IconTooltip.vue'
import FeedbackNotice from './FeedbackNotice.vue'
import { useAdvanced } from '../composables/useAdvanced'
import { DEFAULT_CONFIG, DEFAULT_PRINTER, type BasePlateShape, type KeychainConfig, type PrinterSettings } from '../types/keychain'
import type { ConfigAdjustment, ConfigMessage } from '../utils/configConstraints'
import { printabilityWarnings } from '../utils/printability'

const props = defineProps<{
  config: KeychainConfig
  effectiveConfig: KeychainConfig
  adjustments: ConfigAdjustment[]
  configMessages: ConfigMessage[]
}>()
const emit = defineEmits<{
  'update:config': [value: KeychainConfig]
}>()
const printer = defineModel<PrinterSettings>('printer', { required: true })
const advanced = useAdvanced()
const warnings = computed(() => printabilityWarnings(props.effectiveConfig, printer.value.nozzleDiameter))
const warning = (field: keyof KeychainConfig) => warnings.value.find(w => w.field === field)?.message
const errors = computed(() => props.configMessages.filter(m => m.severity === 'error'))
const circle = computed(() => props.config.basePlateShape === 'circle')
const outline = computed(() => props.config.basePlateShape === 'outline')
const INFO = {
  shape: 'Rectangle fits around your images. Circle is a fixed-size disc. SVG outline follows the combined visible artwork on both faces, after mirroring.',
  width: 'Width of the plate, not counting the keyring loop. The height follows your images’ proportions.',
  diameter: 'Diameter of the plate, not counting the keyring loop.',
  thickness: 'Total thickness of the keychain, artwork included.',
  cornerRadius: 'How round the plate corners are. 0 = square corners.',
  border: 'Empty space between the artwork and the plate edge. Grows automatically to keep the artwork clear of the keyring hole.',
  artworkWidth: 'Each face’s artwork is fitted to this width before the outline offset. Final plate size includes the border, chamfer and keyring.',
  offset: 'Uniform outward distance from the combined artwork silhouette, in mm at print size. Rounded joins preserve concavities. 0 follows the silhouette; interior holes stay backed.',
  plateColor: 'Filament color of the plate. Logo colors you remove show this color.',
  keyring: 'Adds a loop with a hole for a key ring or chain. SVG outline lets you choose its position; other shapes attach at the top.',
  keyringAngle: 'Clockwise around the artwork’s center in Front’s outside view: 0°/360° top, 90° right, 180° bottom, 270° left. The hole follows that direction smoothly and stays clear of both faces.',
  hole: 'Hole diameter at the flat faces. The edge chamfer narrows it through the middle by twice the chamfer size. Keep that opening wider than your ring’s wire or chain.',
  loop: 'Outer diameter of the loop at the flat faces. The edge chamfer widens it through the middle. Leave at least 2 mm around the hole at the faces so it doesn’t snap.',
  chamfer: 'Softens the sharp top and bottom edges. 0 = sharp edges.',
  roundness: '1 is a flat chamfer; higher values give a smoother, rounded edge.',
  inlayDepth: 'How deep the artwork colors go into each face. Use a multiple of your layer height: 0.6 mm is 3 layers at 0.2 mm.',
  nozzle: 'Used only to warn about details too thin to print. It doesn’t change the model.',
  thinWalls: 'Turn on if your slicer’s “Detect thin walls” (or similar) is enabled. '
    + 'Details down to 1 nozzle width then count as printable, instead of 2.',
}
const SHAPES: { value: BasePlateShape; label: string }[] = [
  { value: 'square', label: 'Rectangle' },
  { value: 'circle', label: 'Circle' },
  { value: 'outline', label: 'SVG outline' },
]
function adjustment(field: keyof KeychainConfig): string | undefined {
  return props.adjustments.find(a => a.field === field)?.message
}
/** Advanced options also show when changed, or when a message points at them. */
function shown(...fields: (keyof KeychainConfig)[]): boolean {
  return advanced.value || fields.some(field => props.config[field] !== DEFAULT_CONFIG[field]
    || adjustment(field) || warning(field) || errors.value.some(m => m.field === field))
}
const showCorner = computed(() => !circle.value && !outline.value && shown('cornerRadius'))
// Paired options show together: each only makes sense beside the other.
const showKeyringSizes = computed(() => shown('keyringHoleDiameter', 'keyringRingDiameter'))
const showEdge = computed(() => shown('edgeBevel', 'bevelSegments'))
const showDepth = computed(() => shown('logoDepth'))
const showNozzle = computed(() => advanced.value || printer.value.nozzleDiameter !== DEFAULT_PRINTER.nozzleDiameter)
const showThinWalls = computed(() => advanced.value || printer.value.thinWalls !== DEFAULT_PRINTER.thinWalls)
function updateField<K extends keyof KeychainConfig>(field: K, value: KeychainConfig[K]) {
  emit('update:config', { ...props.config, [field]: value })
}
</script>

<template>
  <section id="keychain-settings" class="control-panel flex flex-col gap-3" aria-label="Keychain settings">
    <PanelCard title="Keychain">
      <FeedbackNotice v-for="message in errors" :key="message.field + message.code" severity="error" title="Invalid keychain setting" :announce="false"><p>{{ message.message }}</p></FeedbackNotice>
      <div class="flex items-center justify-between gap-2 flex-wrap">
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
            class="px-2 py-0.5 text-sm transition-colors"
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
        :label="circle ? 'Diameter' : outline ? 'Artwork width' : 'Width'" unit="mm" field="targetWidth" :info="circle ? INFO.diameter : outline ? INFO.artworkWidth : INFO.width"
        :modelValue="config.targetWidth" :min="20" :max="150" :step="1"
        @update:modelValue="v => updateField('targetWidth', v)"
      />
      <template v-if="outline">
        <SliderField
          label="Outline offset" unit="mm" field="outlineOffset" :info="INFO.offset"
          :modelValue="config.outlineOffset" :min="0" :max="20" :step="0.1"
          @update:modelValue="v => updateField('outlineOffset', v)"
        />
        <p class="text-xs text-gray-500">Artwork width sets each face’s size in mm; height follows its proportions. Outline offset adds a border around the combined artwork. Dimensions below the preview include the border, chamfer and keyring. Separate pieces need a larger offset or fewer components.</p>
      </template>
      <SliderField
        label="Thickness" unit="mm" field="baseThickness" :info="INFO.thickness"
        :modelValue="config.baseThickness" :min="0.4" :max="10" :step="0.1"
        @update:modelValue="v => updateField('baseThickness', v)"
      />
      <FeedbackNotice v-if="warning('baseThickness')" severity="warning" title="Thin base may be fragile"><p>{{ warning('baseThickness') }}</p></FeedbackNotice>
      <SliderField
        v-if="showCorner"
        label="Corner rounding" unit="mm" field="cornerRadius" :info="INFO.cornerRadius"
        :modelValue="config.cornerRadius" :min="0" :max="20" :step="0.5"
        :note="adjustment('cornerRadius')"
        @update:modelValue="v => updateField('cornerRadius', v)"
      />
      <SliderField
        v-if="!outline && shown('padding')"
        label="Border" unit="mm" field="padding" :info="INFO.border"
        :modelValue="config.padding" :min="0" :max="20" :step="0.5"
        :note="adjustment('padding')"
        @update:modelValue="v => updateField('padding', v)"
      />
      <div class="flex items-center justify-between gap-3">
        <span class="inline-flex items-center gap-1 text-sm text-gray-700">
          Plate color<IconTooltip kind="info" label="About Plate color" :message="INFO.plateColor" align="left" />
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
          <input type="checkbox" :checked="config.keyringEnabled" class="accent-gray-700"
            @change="updateField('keyringEnabled', ($event.target as HTMLInputElement).checked)" />
          Keyring loop
        </label>
        <IconTooltip kind="info" label="About Keyring loop" :message="INFO.keyring" align="left" />
      </div>
      <template v-if="outline && config.keyringEnabled">
        <SliderField
          label="Keyring position" unit="°" field="keyringAngle" :info="INFO.keyringAngle"
          :modelValue="config.keyringAngle" :min="0" :max="360" :step="1"
          @update:modelValue="v => updateField('keyringAngle', v)"
        />
        <p class="text-xs text-gray-500">Front view: 0° top · 90° right · 180° bottom · 270° left.</p>
      </template>
      <template v-if="showKeyringSizes">
        <SliderField
          label="Hole size" unit="mm" field="keyringHoleDiameter" :info="INFO.hole"
          :modelValue="config.keyringHoleDiameter" :min="2" :max="10" :step="0.5"
          :disabled="!config.keyringEnabled"
          :note="config.keyringEnabled ? adjustment('keyringHoleDiameter') : undefined"
          @update:modelValue="v => updateField('keyringHoleDiameter', v)"
        />
        <SliderField
          label="Loop size" unit="mm" field="keyringRingDiameter" :info="INFO.loop"
          :modelValue="config.keyringRingDiameter" :min="4" :max="15" :step="0.5"
          :disabled="!config.keyringEnabled"
          @update:modelValue="v => updateField('keyringRingDiameter', v)"
        />
      </template>
      <FeedbackNotice v-if="warning('keyringHoleDiameter')" severity="warning" title="Keyring wall may be fragile"><p>{{ warning('keyringHoleDiameter') }}</p></FeedbackNotice>

      <template v-if="showEdge || showDepth">
        <h3 class="pt-2 border-t border-gray-100 text-xs font-medium text-gray-500">Edges and inlay</h3>
        <template v-if="showEdge">
          <SliderField
            label="Edge chamfer" unit="mm" field="edgeBevel" :info="INFO.chamfer"
            :modelValue="config.edgeBevel" :min="0" :max="2" :step="0.1"
            :note="adjustment('edgeBevel')"
            @update:modelValue="v => updateField('edgeBevel', v)"
          />
          <SliderField
            label="Edge roundness" field="bevelSegments" :info="INFO.roundness"
            :modelValue="config.bevelSegments" :min="1" :max="8" :step="1"
            :disabled="config.edgeBevel <= 0"
            :note="adjustment('bevelSegments')"
            @update:modelValue="v => updateField('bevelSegments', v)"
          />
        </template>
        <SliderField
          v-if="showDepth"
          label="Inlay depth" unit="mm" field="logoDepth" :info="INFO.inlayDepth"
          :modelValue="config.logoDepth" :min="0.1" :max="5" :step="0.1"
          :note="adjustment('logoDepth')"
          @update:modelValue="v => updateField('logoDepth', v)"
        />
      </template>
    </PanelCard>

    <PanelCard v-if="showNozzle || showThinWalls" title="Printer">
      <SliderField
        v-if="showNozzle"
        label="Nozzle size" unit="mm" field="nozzleDiameter" :info="INFO.nozzle"
        :modelValue="printer.nozzleDiameter" :min="0.2" :max="1" :step="0.05"
        @update:modelValue="v => printer = { ...printer, nozzleDiameter: v }"
      />
      <div v-if="showThinWalls" class="flex items-center gap-1">
        <label class="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" :checked="printer.thinWalls" class="accent-gray-700"
            @change="printer = { ...printer, thinWalls: ($event.target as HTMLInputElement).checked }" />
          Single-line walls
        </label>
        <IconTooltip kind="info" label="About Single-line walls" :message="INFO.thinWalls" align="left" />
      </div>
    </PanelCard>
  </section>
</template>
