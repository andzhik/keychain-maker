<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <section class="bg-white border border-gray-200 rounded-lg p-4">
    <header class="flex items-center justify-between mb-3 min-h-5">
      <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-500">{{ title }}</h2>
      <slot name="action" />
    </header>
    <div class="space-y-4">
      <slot />
    </div>
  </section>
</template>
