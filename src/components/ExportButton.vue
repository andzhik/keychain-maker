<script setup lang="ts">
const props = withDefaults(defineProps<{
  disabled: boolean
  exporting: boolean
  label?: string
}>(), {
  label: 'Download .3mf'
})

defineEmits<{
  export: []
}>()
</script>

<template>
  <button
    class="w-full py-2 px-4 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    :disabled="disabled || exporting"
    @click="$emit('export')"
  >
    {{ exporting ? 'Exporting...' : label }}
  </button>
</template>
