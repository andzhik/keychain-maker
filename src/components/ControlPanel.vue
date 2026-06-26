<script setup lang="ts">
import SvgUploader from './SvgUploader.vue'
import type { ColorGroup, KeychainConfig } from '../types/keychain'

const props = defineProps<{
  colorGroups: ColorGroup[]
  error: string | null
  showLogo: boolean
  config: KeychainConfig
}>()

const emit = defineEmits<{
  svgLoaded: [svgText: string]
  'update:showLogo': [value: boolean]
  'update:config': [value: KeychainConfig]
}>()

function updateField<K extends keyof KeychainConfig>(field: K, value: KeychainConfig[K]) {
  emit('update:config', { ...props.config, [field]: value })
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <!-- Upload -->
    <section>
      <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">SVG File</h2>
      <SvgUploader @svgLoaded="(text: string) => emit('svgLoaded', text)" />
    </section>

    <!-- Color list -->
    <section>
      <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Colors</h2>

      <!-- Error state -->
      <p v-if="error" class="text-xs text-red-500">{{ error }}</p>

      <!-- Empty state -->
      <p v-else-if="colorGroups.length === 0" class="text-sm text-gray-400">—</p>

      <!-- Swatches -->
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
    </section>

    <!-- Parameters -->
    <section class="flex-1">
      <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Parameters</h2>
      <div class="space-y-3">
        <!-- Show logo -->
        <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            :checked="showLogo"
            @change="emit('update:showLogo', ($event.target as HTMLInputElement).checked)"
            class="accent-gray-700"
          />
          Show logo
        </label>

        <!-- Base plate shape -->
        <div>
          <span class="text-sm text-gray-700">Base plate</span>
          <div class="flex gap-4 mt-1">
            <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="radio"
                name="basePlateShape"
                value="square"
                :checked="config.basePlateShape === 'square'"
                @change="updateField('basePlateShape', 'square')"
                class="accent-gray-700"
              />
              Square
            </label>
            <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="radio"
                name="basePlateShape"
                value="circle"
                :checked="config.basePlateShape === 'circle'"
                @change="updateField('basePlateShape', 'circle')"
                class="accent-gray-700"
              />
              Circle
            </label>
          </div>
        </div>

        <!-- Keyring hole -->
        <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            :checked="config.keyringEnabled"
            @change="updateField('keyringEnabled', ($event.target as HTMLInputElement).checked)"
            class="accent-gray-700"
          />
          Keyring hole
        </label>

        <!-- Base thickness -->
        <div>
          <div class="flex justify-between text-sm text-gray-700">
            <span>Base thickness</span>
            <span class="text-gray-400">{{ config.baseThickness.toFixed(1) }} mm</span>
          </div>
          <input
            type="range"
            :value="config.baseThickness"
            @input="updateField('baseThickness', parseFloat(($event.target as HTMLInputElement).value))"
            min="0.4" max="10" step="0.1"
            class="w-full accent-gray-700"
          />
        </div>

        <!-- Edge bevel -->
        <div>
          <div class="flex justify-between text-sm text-gray-700">
            <span>Edge bevel</span>
            <span class="text-gray-400">{{ config.edgeBevel.toFixed(1) }} mm</span>
          </div>
          <input
            type="range"
            :value="config.edgeBevel"
            @input="updateField('edgeBevel', parseFloat(($event.target as HTMLInputElement).value))"
            min="0" max="2" step="0.1"
            class="w-full accent-gray-700"
          />
        </div>

        <!-- Bevel segments -->
        <div v-if="config.edgeBevel > 0">
          <div class="flex justify-between text-sm text-gray-700">
            <span>Bevel segments</span>
            <span class="text-gray-400">{{ config.bevelSegments }}</span>
          </div>
          <input
            type="range"
            :value="config.bevelSegments"
            @input="updateField('bevelSegments', parseInt(($event.target as HTMLInputElement).value, 10))"
            min="1" max="8" step="1"
            class="w-full accent-gray-700"
          />
        </div>

        <!-- Corner radius (square plates only) -->
        <div v-if="config.basePlateShape === 'square'">
          <div class="flex justify-between text-sm text-gray-700">
            <span>Corner radius</span>
            <span class="text-gray-400">{{ config.cornerRadius.toFixed(1) }} mm</span>
          </div>
          <input
            type="range"
            :value="config.cornerRadius"
            @input="updateField('cornerRadius', parseFloat(($event.target as HTMLInputElement).value))"
            min="0" max="20" step="0.5"
            class="w-full accent-gray-700"
          />
        </div>

        <!-- Padding -->
        <div>
          <div class="flex justify-between text-sm text-gray-700">
            <span>Padding</span>
            <span class="text-gray-400">{{ config.padding.toFixed(1) }} mm</span>
          </div>
          <input
            type="range"
            :value="config.padding"
            @input="updateField('padding', parseFloat(($event.target as HTMLInputElement).value))"
            min="0" max="20" step="0.5"
            class="w-full accent-gray-700"
          />
        </div>

        <!-- Target width -->
        <div>
          <div class="flex justify-between text-sm text-gray-700">
            <span>Target width</span>
            <span class="text-gray-400">{{ config.targetWidth }} mm</span>
          </div>
          <input
            type="range"
            :value="config.targetWidth"
            @input="updateField('targetWidth', parseFloat(($event.target as HTMLInputElement).value))"
            min="20" max="150" step="1"
            class="w-full accent-gray-700"
          />
        </div>

        <!-- Keyring hole diameter (conditional) -->
        <div v-if="config.keyringEnabled">
          <div class="flex justify-between text-sm text-gray-700">
            <span>Hole diameter</span>
            <span class="text-gray-400">{{ config.keyringHoleDiameter.toFixed(1) }} mm</span>
          </div>
          <input
            type="range"
            :value="config.keyringHoleDiameter"
            @input="updateField('keyringHoleDiameter', parseFloat(($event.target as HTMLInputElement).value))"
            min="2" max="10" step="0.5"
            class="w-full accent-gray-700"
          />
        </div>

        <!-- Keyring ring diameter (conditional) -->
        <div v-if="config.keyringEnabled">
          <div class="flex justify-between text-sm text-gray-700">
            <span>Ring diameter</span>
            <span class="text-gray-400">{{ config.keyringRingDiameter.toFixed(1) }} mm</span>
          </div>
          <input
            type="range"
            :value="config.keyringRingDiameter"
            @input="updateField('keyringRingDiameter', parseFloat(($event.target as HTMLInputElement).value))"
            min="4" max="15" step="0.5"
            class="w-full accent-gray-700"
          />
        </div>

        <!-- Base color -->
        <div>
          <div class="flex justify-between items-center text-sm text-gray-700">
            <span>Base color</span>
            <div class="flex items-center gap-1.5">
              <span class="text-gray-400 font-mono text-xs">{{ config.baseColor }}</span>
              <input
                type="color"
                :value="config.baseColor"
                @input="updateField('baseColor', ($event.target as HTMLInputElement).value)"
                class="w-6 h-6 rounded border border-gray-300 cursor-pointer p-0"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
