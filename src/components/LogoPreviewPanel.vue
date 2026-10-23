<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import LogoPreview, { type LogoPreviewData } from './LogoPreview.vue'

defineProps<{
  /** What the inline preview shows. */
  preview: LogoPreviewData
}>()

const emit = defineEmits<{
  close: []
  toggleShape: [id: string]
}>()

const previewRef = ref<InstanceType<typeof LogoPreview> | null>(null)
const showThinFeatures = defineModel<boolean>('showThinFeatures', { required: true })
const showEdges = ref(false)
const showOriginal = ref(false)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <!-- Not a modal: the controls beside it stay usable, and edits show here as they're made. -->
  <section class="flex flex-col gap-2 p-3 bg-white border border-gray-200 rounded-lg" aria-label="Logo preview">
    <header class="flex flex-wrap items-center gap-x-4 gap-y-1 shrink-0">
      <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-500">{{ preview.faceLabel }} preview</h2>
      <label class="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
        <input v-model="showEdges" type="checkbox" class="accent-emerald-600" />
        <span>Edges and points <span class="inline-block w-3 h-0.5 align-middle bg-emerald-600" /></span>
      </label>
      <label class="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
        <input v-model="showOriginal" type="checkbox" class="accent-fuchsia-500" />
        <span>Original outline <span class="inline-block w-3 h-0.5 align-middle bg-fuchsia-500" /></span>
      </label>
      <label class="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
        <input v-model="showThinFeatures" type="checkbox" class="accent-red-500" />
        <span>Thin areas <span class="inline-block w-3 h-2 align-middle bg-red-500" aria-hidden="true" /></span>
      </label>
      <div class="ml-auto flex items-center gap-2">
        <button
          v-if="previewRef?.zoomed"
          type="button"
          class="px-2 py-1 text-xs bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50"
          @click="previewRef?.resetZoom()"
        >
          Fit
        </button>
        <button
          type="button"
          class="px-2 py-1 text-xs bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50"
          @click="emit('close')"
        >
          Close
        </button>
      </div>
    </header>
    <LogoPreview
      ref="previewRef"
      v-bind="preview"
      class="flex-1 min-h-0"
      zoomable
      :showEdges="showEdges"
      :showOriginal="showOriginal"
      :showThinFeatures="showThinFeatures"
      @toggleShape="(id: string) => emit('toggleShape', id)"
    />
    <p class="text-[11px] text-gray-400 shrink-0">Scroll to zoom, drag to pan, double-click to fit.</p>
  </section>
</template>
