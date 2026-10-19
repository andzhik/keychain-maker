<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef } from 'vue'
import SliderField from './SliderField.vue'
import { DEFAULT_TRACE_OPTIONS, TRACE_SIZE, traceImage, type RasterImage, type TraceOptions } from '../utils/traceImage'
import { SVG_LIMITS, complexityError } from '../utils/svgValidation'

const emit = defineEmits<{
  svgLoaded: [svgString: string, retraced?: boolean]
  importStarted: [retraced: boolean]
  importFailed: [message: string]
}>()

const isDragging = ref(false)
const reading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// The last raster upload, kept so changing the trace options can re-trace it.
const raster = shallowRef<{ name: string; image: RasterImage } | null>(null)
const traceOptions = ref<TraceOptions>({ ...DEFAULT_TRACE_OPTIONS })
const COLOR_OPTIONS = [2, 3, 4, 5, 6, 7, 8]
// Slider changes re-trace once the slider rests: a trace takes ~0.2 s, and the
// model rebuild after it longer.
const RETRACE_DELAY = 150
let retraceTimer: ReturnType<typeof setTimeout> | undefined
let requestId = 0
onBeforeUnmount(() => { requestId++; clearTimeout(retraceTimer) })

const isSvg = (file: File) => file.name.toLowerCase().endsWith('.svg') || file.type === 'image/svg+xml'
const isRaster = (file: File) => /^image\/(png|jpeg|webp)$/.test(file.type) || /\.(png|jpe?g|webp)$/i.test(file.name)

async function handleFile(file: File) {
  const currentRequest = ++requestId
  clearTimeout(retraceTimer)
  raster.value = null
  reading.value = true
  emit('importStarted', false)
  try {
    if (isSvg(file)) {
      if (file.size > SVG_LIMITS.bytes) {
        emit('importFailed', complexityError('The SVG file limit is 2 MiB.').message)
        return
      }
      const text = await file.text()
      if (currentRequest === requestId) emit('svgLoaded', text)
    } else if (isRaster(file)) {
      const image = await decodeImage(file)
      if (currentRequest !== requestId) return
      raster.value = { name: file.name, image }
      retrace(false)
    } else {
      emit('importFailed', 'Choose an SVG, PNG, JPEG or WebP file.')
    }
  } catch {
    if (currentRequest === requestId) emit('importFailed', `Could not read "${file.name}".`)
  } finally {
    if (currentRequest === requestId) reading.value = false
  }
}

/** The image's pixels, scaled so its longer side is TRACE_SIZE (small images are smoothed up). */
async function decodeImage(file: File): Promise<RasterImage> {
  const bitmap = await createImageBitmap(file)
  const scale = TRACE_SIZE / Math.max(bitmap.width, bitmap.height)
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('No 2D canvas')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()
  return ctx.getImageData(0, 0, width, height)
}

function retrace(retraced = false) {
  clearTimeout(retraceTimer)
  if (!raster.value) return
  try {
    emit('svgLoaded', traceImage(raster.value.image, traceOptions.value), retraced)
  } catch {
    emit('importFailed', `Could not trace "${raster.value.name}". Try fewer colors or more smoothing.`)
  }
}

function setTraceOption<K extends keyof TraceOptions>(field: K, value: TraceOptions[K], debounce = false) {
  traceOptions.value = { ...traceOptions.value, [field]: value }
  clearTimeout(retraceTimer)
  if (!raster.value) return
  emit('importStarted', true)
  if (debounce) retraceTimer = setTimeout(() => retrace(true), RETRACE_DELAY)
  else retrace(true)
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file) void handleFile(file)
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) void handleFile(file)
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
        <span class="font-medium">{{ isDragging ? 'Drop SVG or PNG here' : 'Drop SVG or PNG' }}</span>
        <span v-if="!isDragging" class="text-gray-400"> or click to browse</span>
      </span>
      <input
        ref="fileInput"
        type="file"
        accept=".svg,image/svg+xml,.png,image/png,.jpg,.jpeg,image/jpeg,.webp,image/webp"
        class="hidden"
        @change="onFileChange"
      />
    </div>

    <p v-if="reading" role="status" class="text-xs text-gray-500">Reading artwork…</p>

    <!-- Trace options, for a raster upload -->
    <div v-if="raster" class="flex flex-col gap-1.5 text-xs text-gray-600">
      <p class="truncate text-gray-500" :title="raster.name">Traced from {{ raster.name }}</p>
      <div class="flex items-center gap-3">
        <label class="flex items-center gap-1.5">
          Max colors
          <select
            class="border border-gray-300 rounded px-1 py-0.5 bg-white"
            :value="traceOptions.colors"
            @change="setTraceOption('colors', Number(($event.target as HTMLSelectElement).value))"
          >
            <option v-for="n in COLOR_OPTIONS" :key="n" :value="n">{{ n }}</option>
          </select>
        </label>
        <label class="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            :checked="traceOptions.removeBackground"
            @change="setTraceOption('removeBackground', ($event.target as HTMLInputElement).checked)"
          />
          Remove background
        </label>
      </div>
      <SliderField
        label="Smoothing" unit="px" labelWidth="w-24"
        :modelValue="traceOptions.smoothing" :min="0.5" :max="3" :step="0.25"
        @update:modelValue="(v: number) => setTraceOption('smoothing', v, true)"
      />
      <SliderField
        label="Round corners" labelWidth="w-24"
        :modelValue="traceOptions.roundness" :min="1" :max="10" :step="0.5"
        @update:modelValue="(v: number) => setTraceOption('roundness', v, true)"
      />
      <label class="flex items-center gap-1.5 cursor-pointer">
        <input
          type="checkbox"
          :checked="traceOptions.straighten"
          @change="setTraceOption('straighten', ($event.target as HTMLInputElement).checked)"
        />
        Straighten nearly level and upright edges
      </label>
      <p class="text-[11px] text-gray-400 leading-snug">
        More smoothing evens out wobbly edges; more corner rounding turns more corners into curves.
      </p>
    </div>

    <!-- UI note -->
    <p class="text-[11px] text-gray-400 leading-snug">
      For best results, use flat SVGs without gradients, filters, clip-paths, or text elements.
      PNGs are traced into flat colors; logos with few, solid colors trace best. Traced artwork may need cleanup before printing.
    </p>
  </div>
</template>
