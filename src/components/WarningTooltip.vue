<script setup lang="ts">
import { computed, ref, useId } from 'vue'

withDefaults(defineProps<{
  label: string
  message: string
  align?: 'left' | 'right'
  placement?: 'above' | 'below'
}>(), { align: 'right', placement: 'below' })

const tooltipId = useId()
const hovered = ref(false)
const focused = ref(false)
const dismissed = ref(false)
const visible = computed(() => !dismissed.value && (hovered.value || focused.value))
</script>

<template>
  <span
    class="relative inline-flex shrink-0 align-middle"
    @mouseenter="hovered = true; dismissed = false"
    @mouseleave="hovered = false"
    @focusin="focused = true; dismissed = false"
    @focusout="focused = false"
    @keydown.esc.stop="dismissed = true"
  >
    <button
      type="button"
      :aria-label="label"
      :aria-describedby="tooltipId"
      class="inline-flex items-center justify-center rounded p-0.5 text-amber-600 hover:text-amber-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
      @click="dismissed = false"
    >
      <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M10.3 3.9 2 18.3A2 2 0 0 0 3.7 21h16.6a2 2 0 0 0 1.7-2.7L13.7 3.9a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4m0 4h.01" />
      </svg>
    </button>
    <span
      v-show="visible"
      :id="tooltipId"
      role="tooltip"
      class="absolute z-20 w-56 text-left text-xs font-normal leading-relaxed normal-case tracking-normal whitespace-normal"
      :class="[align === 'left' ? 'left-0' : 'right-0', placement === 'above' ? 'bottom-full pb-1.5' : 'top-full pt-1.5']"
    >
      <span class="block rounded bg-gray-800 px-2.5 py-2 text-white shadow-lg">{{ message }}</span>
    </span>
  </span>
</template>
