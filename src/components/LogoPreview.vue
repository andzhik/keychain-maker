<script lang="ts">
import type { ColorGroup } from '../types/keychain'

/** What to draw; the inline and the enlarged preview share it. */
export interface LogoPreviewData {
  /** The parsed logo: one clickable region per shape. */
  parsed: ColorGroup[]
  /** What will be printed. */
  groups: ColorGroup[]
  hiddenColors: string[]
  hiddenShapes: string[]
  /** SVG path data of thin features, drawn over everything. */
  thinPath: string
  plateColor: string
}
</script>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type * as THREE from 'three'
import { shapeId } from '../utils/refine'

interface ViewBox { x: number; y: number; w: number; h: number }

const props = defineProps<LogoPreviewData & {
  /** Wheel to zoom, drag to pan. Off in the side panel, where the wheel scrolls. */
  zoomable?: boolean
  /** Outline the printed shapes and mark their points. */
  showEdges?: boolean
  /** Outline the parsed shapes, to compare against what's printed. */
  showOriginal?: boolean
}>()

const emit = defineEmits<{
  toggleShape: [id: string]
}>()

const pathCache = new WeakMap<THREE.Shape, string>()

function pathData(shape: THREE.Shape): string {
  let d = pathCache.get(shape)
  if (d === undefined) {
    const { shape: outer, holes } = shape.extractPoints(16)
    d = [outer, ...holes]
      .map(ring => 'M' + ring.map(p => `${+p.x.toFixed(4)} ${+p.y.toFixed(4)}`).join('L') + 'Z')
      .join('')
    pathCache.set(shape, d)
  }
  return d
}

// Framed on the parsed logo, so hiding shapes doesn't move the view.
const viewBox = computed<ViewBox | null>(() => {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (const group of props.parsed) {
    for (const shape of group.shapes) {
      for (const p of shape.extractPoints(16).shape) {
        minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x)
        minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y)
      }
    }
  }
  if (!(maxX >= minX)) return null
  const pad = Math.max(maxX - minX, maxY - minY) * 0.04
  return { x: minX - pad, y: minY - pad, w: maxX - minX + 2 * pad, h: maxY - minY + 2 * pad }
})

const sourceShapes = computed(() => {
  const hiddenColors = new Set(props.hiddenColors)
  const hiddenShapes = new Set(props.hiddenShapes)
  return props.parsed.flatMap(group => group.shapes.map((shape, i) => {
    const id = shapeId(group.color, i)
    return {
      id,
      color: group.color,
      d: pathData(shape),
      colorHidden: hiddenColors.has(group.color),
      hidden: hiddenShapes.has(id),
    }
  }))
})

const edgesPath = computed(() =>
  props.showEdges ? props.groups.flatMap(g => g.shapes.map(pathData)).join('') : '')

// A zero-length segment per point; round caps draw it as a dot.
const pointsPath = computed(() => {
  if (!props.showEdges) return ''
  let d = ''
  for (const group of props.groups) {
    for (const shape of group.shapes) {
      const { shape: outer, holes } = shape.extractPoints(16)
      for (const ring of [outer, ...holes]) for (const p of ring) d += `M${+p.x.toFixed(4)} ${+p.y.toFixed(4)}h0`
    }
  }
  return d
})

const originalPath = computed(() => (props.showOriginal ? sourceShapes.value.map(s => s.d).join('') : ''))

// --- Zoom and pan (zoomable only) ---

const svgRef = ref<SVGSVGElement | null>(null)
/** The zoomed view; null shows the whole logo. */
const zoom = ref<ViewBox | null>(null)
const view = computed(() => zoom.value ?? viewBox.value)
const MAX_ZOOM = 200

watch(() => props.parsed, () => { zoom.value = null })

function resetZoom() {
  zoom.value = null
}

/** Client pixels → SVG units at the pointer, through the viewBox and its letterboxing. */
function toSvg(clientX: number, clientY: number): DOMPoint | null {
  const ctm = svgRef.value?.getScreenCTM()
  return ctm ? new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse()) : null
}

function onWheel(e: WheelEvent) {
  const base = viewBox.value
  const v = view.value
  const p = toSvg(e.clientX, e.clientY)
  if (!base || !v || !p) return
  // Line-mode wheels (Firefox) report ~3 per notch, pixel-mode ~100.
  const delta = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY
  const w = Math.min(base.w, Math.max(base.w / MAX_ZOOM, v.w * Math.exp(delta * 0.002)))
  if (w >= base.w) {
    zoom.value = null
    return
  }
  // Keep the point under the cursor where it is.
  const k = w / v.w
  zoom.value = { x: p.x - (p.x - v.x) * k, y: p.y - (p.y - v.y) * k, w, h: v.h * k }
}

let drag: { id: number; x: number; y: number; moved: boolean } | null = null
// A drag ends with a click on whatever is under the pointer; that click isn't a toggle.
let suppressClick = false

function onPointerDown(e: PointerEvent) {
  if (e.button !== 0) return
  drag = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false }
  suppressClick = false
}

function onPointerMove(e: PointerEvent) {
  if (!drag || e.pointerId !== drag.id || !view.value) return
  const dx = e.clientX - drag.x
  const dy = e.clientY - drag.y
  if (!drag.moved) {
    if (Math.hypot(dx, dy) < 4) return
    drag.moved = true
    svgRef.value?.setPointerCapture(e.pointerId)
  }
  const ctm = svgRef.value?.getScreenCTM()
  if (!ctm) return
  const v = view.value
  zoom.value = { ...v, x: v.x - dx / ctm.a, y: v.y - dy / ctm.d }
  drag.x = e.clientX
  drag.y = e.clientY
}

function onPointerUp(e: PointerEvent) {
  if (!drag || e.pointerId !== drag.id) return
  if (drag.moved) suppressClick = true
  drag = null
}

function onShapeClick(s: { id: string; colorHidden: boolean }) {
  if (suppressClick) {
    suppressClick = false
    return
  }
  if (!s.colorHidden) emit('toggleShape', s.id)
}

defineExpose({ resetZoom, zoomed: computed(() => zoom.value !== null) })
</script>

<template>
  <div class="border border-gray-200 rounded-lg overflow-hidden bg-white">
    <svg
      v-if="viewBox && view"
      ref="svgRef"
      :viewBox="`${view.x} ${view.y} ${view.w} ${view.h}`"
      class="logo-preview block w-full h-full"
      :class="{ 'touch-none': zoomable }"
      role="img"
      aria-label="Logo preview: click a shape to hide or restore it"
      v-on="zoomable ? {
        wheel: (e: WheelEvent) => { e.preventDefault(); onWheel(e) },
        pointerdown: onPointerDown,
        pointermove: onPointerMove,
        pointerup: onPointerUp,
        pointercancel: onPointerUp,
        dblclick: resetZoom,
      } : {}"
    >
      <rect :x="viewBox.x" :y="viewBox.y" :width="viewBox.w" :height="viewBox.h" :fill="plateColor" />
      <!-- What gets printed -->
      <g pointer-events="none">
        <template v-for="group in groups" :key="group.id">
          <path v-for="(shape, i) in group.shapes" :key="i" :d="pathData(shape)" :fill="group.color" fill-rule="evenodd" />
        </template>
      </g>
      <!-- Click targets, one per parsed shape. Hidden shapes show as ghosts. -->
      <g fill-rule="evenodd">
        <path
          v-for="s in sourceShapes"
          :key="s.id"
          :d="s.d"
          :class="s.colorHidden ? 'ghost' : s.hidden ? 'ghost clickable' : 'target clickable'"
          :style="{ '--source': s.color }"
          @click="onShapeClick(s)"
        >
          <title>{{ s.colorHidden ? `${s.color} (color hidden)` : s.hidden ? `Click to restore (${s.color})` : `Click to hide (${s.color})` }}</title>
        </path>
      </g>
      <!-- Inspection overlays, above the hover outline -->
      <path v-if="originalPath" :d="originalPath" class="original" pointer-events="none" />
      <path v-if="edgesPath" :d="edgesPath" class="edges" pointer-events="none" />
      <path v-if="pointsPath" :d="pointsPath" class="points" pointer-events="none" />
      <path v-if="thinPath" :d="thinPath" class="thin" pointer-events="none" />
    </svg>
    <div v-else class="h-full flex items-center justify-center text-sm text-gray-400">No logo</div>
  </div>
</template>

<style scoped>
.logo-preview path {
  vector-effect: non-scaling-stroke;
}
.target {
  fill: transparent;
  stroke: transparent;
  stroke-width: 2px;
}
.target:hover {
  stroke: #2563eb;
}
.ghost {
  fill: var(--source);
  fill-opacity: 0.15;
  stroke: #9ca3af;
  stroke-width: 1px;
  stroke-dasharray: 3 2;
}
.ghost.clickable:hover {
  fill-opacity: 0.4;
  stroke: #2563eb;
}
.clickable {
  cursor: pointer;
}
.thin {
  fill: #ef4444;
  fill-opacity: 0.85;
}
.original {
  fill: none;
  stroke: #d946ef;
  stroke-width: 1px;
}
.edges {
  fill: none;
  stroke: #059669;
  stroke-width: 1px;
}
.points {
  fill: none;
  stroke: #059669;
  stroke-width: 4px;
  stroke-linecap: round;
}
</style>
