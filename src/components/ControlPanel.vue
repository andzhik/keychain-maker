<script setup lang="ts">
import SvgUploader from './SvgUploader.vue'
import ExportButton from './ExportButton.vue'
import type { ColorGroup } from '../types/keychain'

defineProps<{
  colorGroups: ColorGroup[]
  error: string | null
  showLogo: boolean
}>()

const emit = defineEmits<{
  svgLoaded: [svgText: string]
  'update:showLogo': [value: boolean]
}>()
</script>

<template>
  <div class="flex flex-col gap-4 p-4 h-full">
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

    <!-- Parameters placeholder -->
    <section class="flex-1">
      <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Parameters</h2>
      <div class="space-y-3 text-sm text-gray-400">
        <label class="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            :checked="showLogo"
            @change="emit('update:showLogo', ($event.target as HTMLInputElement).checked)"
            class="accent-gray-700"
          />
          Show logo
        </label>
        <!-- TODO: sliders -->
        <p>Base thickness · 2 mm</p>
        <p>Corner radius · 3 mm</p>
        <p>Padding · 3 mm</p>
        <p>Keyring hole · on · 4 mm / 8 mm</p>
        <p>Base color · #FFFFFF</p>
      </div>
    </section>

    <!-- Export -->
    <section class="shrink-0">
      <ExportButton />
    </section>
  </div>
</template>
