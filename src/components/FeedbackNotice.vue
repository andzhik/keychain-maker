<script setup lang="ts">
withDefaults(defineProps<{
  severity: 'error' | 'warning'
  title: string
  announce?: boolean
}>(), { announce: true })
</script>

<template>
  <div
    :role="announce ? (severity === 'error' ? 'alert' : 'status') : undefined"
    :aria-label="title"
    :aria-atomic="announce ? 'true' : undefined"
    class="flex gap-2.5 rounded-lg border border-l-4 p-3 text-sm leading-5"
    :class="severity === 'error' ? 'border-red-300 border-l-red-600 bg-red-50 text-red-950' : 'border-amber-300 border-l-amber-500 bg-amber-50 text-amber-950'"
  >
    <svg class="mt-0.5 h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
      <template v-if="severity === 'error'">
        <circle cx="12" cy="12" r="9" />
        <path d="m9 9 6 6m0-6-6 6" />
      </template>
      <template v-else>
        <path d="M10.3 4.2a2 2 0 0 1 3.4 0l8 13.8a2 2 0 0 1-1.7 3H4a2 2 0 0 1-1.7-3Z" />
        <path d="M12 9v5m0 3v.5" />
      </template>
    </svg>
    <div class="min-w-0 flex-1">
      <p class="font-semibold">{{ title }}</p>
      <div class="mt-1 space-y-2"><slot /></div>
    </div>
  </div>
</template>
