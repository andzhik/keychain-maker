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
}>(), {
  unit: '',
  disabled: false,
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
  <div :class="{ 'opacity-40': disabled }">
    <div class="flex items-center justify-between gap-3">
      <span class="text-sm text-gray-700">{{ label }}</span>
      <label class="flex items-center gap-1 text-xs text-gray-500">
        <input
          type="number"
          :value="modelValue.toFixed(decimals)"
          :min="min" :max="max" :step="step"
          :disabled="disabled"
          :aria-label="label"
          @change="onNumber"
          class="w-16 px-1.5 py-0.5 text-right text-sm text-gray-900 tabular-nums bg-white border border-gray-300 rounded focus:outline-none focus:border-gray-500 disabled:cursor-not-allowed"
        />
        <!-- Always reserves the unit's width so unitless boxes line up too. -->
        <span class="w-5">{{ unit }}</span>
      </label>
    </div>
    <input
      type="range"
      :value="modelValue"
      :min="min" :max="max" :step="step"
      :disabled="disabled"
      :data-field="field"
      :aria-label="label"
      @input="onSlider"
      class="w-full mt-1 accent-gray-700 disabled:cursor-not-allowed"
    />
    <p v-if="note" class="text-xs text-amber-600">{{ note }}</p>
  </div>
</template>
