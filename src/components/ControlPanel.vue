<script setup lang="ts">
import SvgUploader from './SvgUploader.vue'
import ExportButton from './ExportButton.vue'
// TODO: Step 6 — wire sliders to KeychainConfig reactive state
</script>

<template>
  <div class="flex flex-col gap-4 p-4 h-full">
    <!-- Upload -->
    <section>
      <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">SVG File</h2>
      <SvgUploader />
    </section>

    <!-- Color list placeholder -->
    <section>
      <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Colors</h2>
      <p class="text-sm text-gray-400">—</p>
    </section>

    <!-- Parameters placeholder -->
    <section class="flex-1">
      <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Parameters</h2>
      <div class="space-y-3 text-sm text-gray-400">
        <!-- TODO: sliders -->
        <p>Base thickness · 2 mm</p>
        <p>Corner radius · 3 mm</p>
        <p>Padding · 3 mm</p>
        <p>Logo extrusion · 1.5 mm</p>
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
