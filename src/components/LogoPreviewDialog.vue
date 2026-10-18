<script setup lang="ts">
import { ref, watch } from 'vue'
import LogoPreview, { type LogoPreviewData } from './LogoPreview.vue'

const props = defineProps<{
  open: boolean
  /** What the inline preview shows. */
  preview: LogoPreviewData
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  toggleShape: [id: string]
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)
const previewRef = ref<InstanceType<typeof LogoPreview> | null>(null)
const showEdges = ref(false)
const showOriginal = ref(false)

// A modal <dialog> gives Escape-to-close, focus trapping and the backdrop for free.
watch(() => props.open, (open) => {
  const dialog = dialogRef.value
  if (!dialog) return
  if (open && !dialog.open) dialog.showModal()
  else if (!open && dialog.open) dialog.close()
}, { flush: 'post' })

function onBackdropClick(e: MouseEvent) {
  if (e.target === dialogRef.value) emit('update:open', false)
}
</script>

<template>
  <dialog
    ref="dialogRef"
    class="logo-dialog m-auto w-[min(92vw,1200px)] h-[90vh] p-0 rounded-lg shadow-xl bg-white text-gray-900"
    aria-label="Logo preview"
    @close="emit('update:open', false)"
    @click="onBackdropClick"
  >
    <div v-if="open" class="flex flex-col h-full gap-2 p-3">
      <header class="flex flex-wrap items-center gap-x-4 gap-y-1 shrink-0">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-gray-500">Logo preview</h2>
        <label class="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
          <input v-model="showEdges" type="checkbox" class="accent-emerald-600" />
          <span>Edges and points <span class="inline-block w-3 h-0.5 align-middle bg-emerald-600" /></span>
        </label>
        <label class="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
          <input v-model="showOriginal" type="checkbox" class="accent-fuchsia-500" />
          <span>Original outline <span class="inline-block w-3 h-0.5 align-middle bg-fuchsia-500" /></span>
        </label>
        <span class="text-[11px] text-gray-400">Scroll to zoom, drag to pan, double-click to fit. Click a shape to remove it.</span>
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
            @click="emit('update:open', false)"
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
        @toggleShape="(id: string) => emit('toggleShape', id)"
      />
    </div>
  </dialog>
</template>

<style scoped>
.logo-dialog::backdrop {
  background: rgb(17 24 39 / 0.5);
}
</style>
