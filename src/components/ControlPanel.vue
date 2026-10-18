<script setup lang="ts">
import PanelCard from './PanelCard.vue'
import SliderField from './SliderField.vue'
import SvgUploader from './SvgUploader.vue'
import type { BasePlateShape, ColorGroup, KeychainConfig } from '../types/keychain'
import type { ConfigAdjustment } from '../utils/configConstraints'

const props = defineProps<{
  colorGroups: ColorGroup[]
  error: string | null
  showLogo: boolean
  config: KeychainConfig
  adjustments: ConfigAdjustment[]
  svgText: string | null
}>()

const emit = defineEmits<{
  svgLoaded: [svgText: string]
  'update:showLogo': [value: boolean]
  'update:config': [value: KeychainConfig]
}>()

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
  <!-- Cards flow into as many ~320px columns as fit beside the preview. -->
  <div class="grid gap-4 items-start grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
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

      <SvgUploader :svgText="svgText" @svgLoaded="(text: string) => emit('svgLoaded', text)" />

      <div>
        <h3 class="text-sm text-gray-700 mb-1.5">Colors</h3>
        <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
        <p v-else-if="colorGroups.length === 0" class="text-sm text-gray-400">—</p>
        <ul v-else class="space-y-1.5">
          <li
            v-for="group in colorGroups"
            :key="group.id"
            class="flex items-center gap-2 text-xs text-gray-700"
          >
            <span
              class="w-4 h-4 rounded-sm shrink-0 border border-gray-300"
              :style="{ backgroundColor: group.color }"
            />
            <span class="font-mono">{{ group.color }}</span>
            <span class="text-gray-400 ml-auto">{{ group.pathCount }} path{{ group.pathCount !== 1 ? 's' : '' }}</span>
          </li>
        </ul>
      </div>
    </PanelCard>

    <!-- Plate: shape, size, thickness, color -->
    <PanelCard title="Plate">
      <div class="flex items-center justify-between gap-3">
        <span class="text-sm text-gray-700">Shape</span>
        <div class="inline-flex rounded border border-gray-300 overflow-hidden" role="radiogroup" aria-label="Plate shape">
          <button
            v-for="shape in SHAPES"
            :key="shape.value"
            type="button"
            role="radio"
            :aria-checked="config.basePlateShape === shape.value"
            class="px-3 py-1 text-sm transition-colors"
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
        @update:modelValue="v => updateField('edgeBevel', v)"
      />
      <SliderField
        label="Bevel segments" field="bevelSegments"
        :modelValue="config.bevelSegments" :min="1" :max="8" :step="1"
        :disabled="config.edgeBevel <= 0"
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
        :note="config.keyringEnabled ? adjustment('keyringHoleDiameter') : undefined"
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
</template>
