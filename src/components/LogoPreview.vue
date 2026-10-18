<script setup lang="ts">
import { computed } from 'vue'
import type * as THREE from 'three'
import type { ColorGroup } from '../types/keychain'
import { shapeId } from '../utils/refine'

const props = defineProps<{
  /** The parsed logo: one clickable region per shape. */
  parsed: ColorGroup[]
  /** What will be printed. */
  groups: ColorGroup[]
  hiddenColors: string[]
  hiddenShapes: string[]
  /** SVG path data of thin features, drawn over everything. */
  thinPath: string
  plateColor: string
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
const viewBox = computed(() => {
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
</script>

<template>
  <div class="border border-gray-200 rounded-lg overflow-hidden bg-white">
    <svg
      v-if="viewBox"
      :viewBox="`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`"
      class="logo-preview block w-full h-48"
      role="img"
      aria-label="Logo preview: click a shape to hide or restore it"
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
          @click="!s.colorHidden && emit('toggleShape', s.id)"
        >
          <title>{{ s.colorHidden ? `${s.color} (color hidden)` : s.hidden ? `Click to restore (${s.color})` : `Click to hide (${s.color})` }}</title>
        </path>
      </g>
      <path v-if="thinPath" :d="thinPath" class="thin" pointer-events="none" />
    </svg>
    <div v-else class="h-48 flex items-center justify-center text-sm text-gray-400">No logo</div>
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
</style>
