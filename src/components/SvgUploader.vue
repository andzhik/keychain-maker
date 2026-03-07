<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  svgLoaded: [svgString: string]
}>()

const isDragging = ref(false)
const previewUrl = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

function handleFile(file: File) {
  if (!file.name.toLowerCase().endsWith('.svg') && file.type !== 'image/svg+xml') return
  const reader = new FileReader()
  reader.onload = (e) => {
    const text = e.target?.result as string
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    const blob = new Blob([text], { type: 'image/svg+xml' })
    previewUrl.value = URL.createObjectURL(blob)
    emit('svgLoaded', text)
  }
  reader.readAsText(file)
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) handleFile(file)
}

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) handleFile(file)
}
</script>

<template>
  <div class="p-3 flex flex-col gap-3">
    <!-- Drop zone -->
    <div
      class="border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center gap-2 cursor-pointer select-none transition-colors"
      :class="isDragging
        ? 'border-blue-400 bg-blue-50'
        : 'border-gray-300 bg-white hover:border-blue-300 hover:bg-gray-50'"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
      @click="fileInput?.click()"
    >
      <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
      <span class="text-sm font-medium text-gray-600">
        {{ isDragging ? 'Drop SVG here' : 'Drag & drop SVG' }}
      </span>
      <span class="text-xs text-gray-400">or click to browse</span>
      <input
        ref="fileInput"
        type="file"
        accept=".svg,image/svg+xml"
        class="hidden"
        @change="onFileChange"
      />
    </div>

    <!-- 2D inline preview -->
    <div v-if="previewUrl" class="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <img :src="previewUrl" alt="SVG preview" class="w-full max-h-40 object-contain p-2" />
    </div>

    <!-- UI note -->
    <p class="text-[11px] text-gray-400 leading-snug">
      For best results, use flat SVGs without gradients, filters, clip-paths, or text elements.
    </p>
  </div>
</template>
