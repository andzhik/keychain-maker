<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  svgLoaded: [svgString: string]
}>()

const isDragging = ref(false)
const readError = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

function handleFile(file: File) {
  if (!file.name.toLowerCase().endsWith('.svg') && file.type !== 'image/svg+xml') return
  readError.value = null
  const reader = new FileReader()
  reader.onload = (e) => {
    emit('svgLoaded', e.target?.result as string)
  }
  reader.onerror = () => {
    readError.value = `Could not read "${file.name}".`
  }
  reader.readAsText(file)
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) handleFile(file)
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) handleFile(file)
  // Reset so picking the same file again still fires `change`.
  input.value = ''
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- Drop zone -->
    <div
      class="border-2 border-dashed rounded-lg px-3 py-2.5 flex items-center justify-center gap-2 cursor-pointer select-none transition-colors"
      :class="isDragging
        ? 'border-blue-400 bg-blue-50'
        : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-gray-50'"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
      @click="fileInput?.click()"
    >
      <svg class="w-5 h-5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
      <span class="text-sm text-gray-600">
        <span class="font-medium">{{ isDragging ? 'Drop SVG here' : 'Drop SVG' }}</span>
        <span v-if="!isDragging" class="text-gray-400"> or click to browse</span>
      </span>
      <input
        ref="fileInput"
        type="file"
        accept=".svg,image/svg+xml"
        class="hidden"
        @change="onFileChange"
      />
    </div>

    <p v-if="readError" class="text-xs text-red-500">{{ readError }}</p>

    <!-- UI note -->
    <p class="text-[11px] text-gray-400 leading-snug">
      For best results, use flat SVGs without gradients, filters, clip-paths, or text elements.
    </p>
  </div>
</template>
