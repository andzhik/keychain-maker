<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  label: string
  modelValue: number
  min: number
  max: number
  step: number
  unit?: string
  disabled?: boolean
  /** Shown under the slider, e.g. when the model is built from a clamped value. */
  note?: string
  /** Stable hook for test-render/measure.ts, which drives sliders by field. */
  field?: string
  /** Tailwind width class for the label, narrower in tight columns. */
  labelWidth?: string
}>(), {
  unit: '',
  disabled: false,
  labelWidth: 'w-28',
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const decimals = computed(() => (String(props.step).split('.')[1] ?? '').length)

function onSlider(e: Event) {
  emit('update:modelValue', parseFloat((e.target as HTMLInputElement).value))
}

// Commits on Enter/blur/spinner rather than per keystroke, so typing "12" doesn't
// rebuild at 1 first. Typed values snap to the slider's range and step.
function onNumber(e: Event) {
  const input = e.target as HTMLInputElement
  const raw = parseFloat(input.value)
  if (!Number.isFinite(raw)) {
    input.value = props.modelValue.toFixed(decimals.value)
    return
  }
  const clamped = Math.min(props.max, Math.max(props.min, raw))
  const snapped = +(Math.round((clamped - props.min) / props.step) * props.step + props.min).toFixed(decimals.value)
  // Re-show the snapped value even when it equals the current one (no re-render).
  input.value = snapped.toFixed(decimals.value)
  if (snapped !== props.modelValue) emit('update:modelValue', snapped)
}
</script>

<template>
  <!-- One row: label | slider | number box + unit. -->
  <div :class="{ 'opacity-40': disabled }">
    <div class="flex items-center gap-2">
      <span class="shrink-0 text-sm text-gray-700" :class="labelWidth">{{ label }}</span>
      <input
        type="range"
        :value="modelValue"
        :min="min" :max="max" :step="step"
        :disabled="disabled"
        :data-field="field"
        :aria-label="label"
        @input="onSlider"
        class="flex-1 min-w-0 accent-gray-700 disabled:cursor-not-allowed"
      />
      <label class="flex items-center gap-1 shrink-0 text-xs text-gray-500">
        <input
          type="number"
          :value="modelValue.toFixed(decimals)"
          :min="min" :max="max" :step="step"
          :disabled="disabled"
          :aria-label="label"
          @change="onNumber"
          class="w-14 px-1.5 py-0.5 text-right text-sm text-gray-900 tabular-nums bg-white border border-gray-300 rounded focus:outline-none focus:border-gray-500 disabled:cursor-not-allowed"
        />
        <!-- Always reserves the unit's width so unitless boxes line up too. -->
        <span class="w-6">{{ unit }}</span>
      </label>
    </div>
    <p v-if="note" class="mt-0.5 text-xs text-amber-600">{{ note }}</p>
  </div>
</template>
