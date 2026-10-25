<script setup lang="ts">
import { computed } from 'vue'
import type { ColorGroup, Refinements } from '../types/keychain'
import { deltaE } from '../utils/refine'
import { useAdvanced } from '../composables/useAdvanced'

const props = defineProps<{
  parsed: ColorGroup[]
  /** The printed colors. */
  groups: ColorGroup[]
  /** Printed color → the source colors in it. */
  sources: Map<string, string[]>
  refinements: Refinements
  otherColors: string[]
  otherFace: 'Front' | 'Back'
}>()

const emit = defineEmits<{
  'update:refinements': [value: Refinements]
}>()
const advanced = useAdvanced()
// Matching is an advanced tool; a plain recolor does the same by hand.
const matching = computed(() => advanced.value && props.otherColors.length > 0)

const rows = computed(() => props.groups.map((group) => {
  const sources = props.sources.get(group.color) ?? [group.color]
  return {
    // Keyed by the first source, which survives a recolor.
    key: sources[0],
    color: group.color,
    sources,
    shapes: group.shapes.length,
    recolored: sources.some(s => props.refinements.recolor[s] !== undefined),
    shared: props.otherColors.includes(group.color),
    matches: props.otherColors.filter(color => color !== group.color)
      .sort((a, b) => deltaE(group.color, a) - deltaE(group.color, b)),
  }
}))

function update(changes: Partial<Refinements>) {
  emit('update:refinements', { ...props.refinements, ...changes })
}

/** Prints every source of a row in `color`; a source set back to itself drops its entry. */
function recolor(sources: string[], color: string) {
  const next = { ...props.refinements.recolor }
  for (const source of sources) {
    if (source === color) delete next[source]
    else next[source] = color
  }
  update({ recolor: next })
}

function resetColor(sources: string[]) {
  const next = { ...props.refinements.recolor }
  for (const source of sources) delete next[source]
  update({ recolor: next })
}

function matchColor(sources: string[], event: Event) {
  const select = event.target as HTMLSelectElement
  if (props.otherColors.includes(select.value)) recolor(sources, select.value)
  select.value = ''
}

function hide(sources: string[]) {
  update({ hiddenColors: [...props.refinements.hiddenColors, ...sources] })
}

function restore(color: string) {
  update({ hiddenColors: props.refinements.hiddenColors.filter(c => c !== color) })
}

// Hidden colors that are in this logo (the list resets per SVG, but be safe).
const hidden = computed(() => {
  const present = new Set(props.parsed.map(g => g.color))
  return props.refinements.hiddenColors.filter(c => present.has(c))
})
</script>

<template>
  <div>
    <p v-if="matching" class="mb-1.5 text-xs text-gray-500">
      Match {{ otherFace }} to share a filament. Closest colors first.
    </p>
    <ul class="space-y-1">
      <li v-for="row in rows" :key="row.key" class="text-xs text-gray-700">
        <div class="flex items-center gap-2">
          <label class="group relative shrink-0 cursor-pointer" title="Change color">
            <input
              type="color"
              :value="row.color"
              :aria-label="`Print color for ${row.color}`"
              title="Change color"
              class="block w-5 h-5 rounded-sm border border-gray-300 cursor-pointer p-0 group-hover:ring-2 group-hover:ring-gray-400"
              @change="recolor(row.sources, ($event.target as HTMLInputElement).value)"
            />
            <span class="pointer-events-none absolute -bottom-1 -right-1 rounded bg-white text-[10px] leading-none text-gray-600" aria-hidden="true">✎</span>
          </label>
          <span class="font-mono">{{ row.color }}</span>
          <!-- Originals merged or recolored into this one -->
          <span
            v-if="row.sources.length > 1 || row.recolored"
            class="flex items-center gap-0.5"
            :title="`From ${row.sources.join(', ')}`"
          >
            <span class="text-gray-400">←</span>
            <span
              v-for="source in row.sources.slice(0, 5)"
              :key="source"
              class="w-2.5 h-2.5 rounded-full border border-gray-300"
              :style="{ backgroundColor: source }"
            />
            <span v-if="row.sources.length > 5" class="text-gray-400">+{{ row.sources.length - 5 }}</span>
          </span>
          <span class="text-gray-400 ml-auto whitespace-nowrap">{{ row.shapes }} shape{{ row.shapes !== 1 ? 's' : '' }}</span>
          <button
            v-if="row.recolored"
            type="button"
            class="text-gray-400 hover:text-gray-700"
            title="Restore original color"
            aria-label="Restore original color"
            @click="resetColor(row.sources)"
          >↺</button>
          <button
            type="button"
            class="text-gray-400 hover:text-red-600"
            title="Remove this color (the plate shows through)"
            :aria-label="`Remove ${row.color}`"
            @click="hide(row.sources)"
          >✕</button>
        </div>
        <select
          v-if="matching"
          :value="''"
          :aria-label="`Match ${row.color} to ${otherFace}`"
          :disabled="!row.matches.length"
          :title="`Copy a ${otherFace} color to this row; later color edits stay independent.`"
          class="ml-7 mt-1 mb-1 max-w-full rounded border border-gray-300 bg-white px-1 py-0.5 text-gray-600 disabled:border-transparent disabled:bg-transparent"
          @change="matchColor(row.sources, $event)"
        >
          <option value="" disabled>{{ row.shared ? `Shared with ${otherFace}` : `Match ${otherFace}…` }}</option>
          <option v-for="color in row.matches" :key="color" :value="color">{{ color }}</option>
        </select>
      </li>
    </ul>

    <div v-if="hidden.length" class="mt-1.5 flex flex-wrap items-center gap-1 text-xs text-gray-500">
      <span>Removed:</span>
      <button
        v-for="color in hidden"
        :key="color"
        type="button"
        class="flex items-center gap-1 px-1.5 py-0.5 rounded border border-dashed border-gray-300 hover:border-gray-500 hover:text-gray-700"
        :title="`Restore ${color}`"
        @click="restore(color)"
      >
        <span class="w-2.5 h-2.5 rounded-full border border-gray-300" :style="{ backgroundColor: color }" />
        <span class="font-mono">{{ color }}</span>
        <span>↺</span>
      </button>
    </div>
  </div>
</template>
