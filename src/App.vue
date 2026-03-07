<script setup lang="ts">
import { ref } from 'vue'
import SvgUploader from './components/SvgUploader.vue'
import ControlPanel from './components/ControlPanel.vue'
import ThreeViewer from './components/ThreeViewer.vue'

const svgString = ref<string | null>(null)
</script>

<template>
  <div class="flex flex-col h-screen bg-white text-gray-900 overflow-hidden">
    <!-- Header -->
    <header class="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shrink-0">
      <h1 class="text-lg font-semibold tracking-tight">Keychain Maker</h1>
    </header>

    <!-- Main: sidebar + viewport -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left sidebar: fixed 300px -->
      <aside class="w-[300px] shrink-0 flex flex-col bg-gray-50 border-r border-gray-200 overflow-y-auto">
        <SvgUploader @svg-loaded="svgString = $event" />
        <div class="border-t border-gray-200" />
        <ControlPanel />

      <!-- 3D viewport: fills remaining space -->
      <main class="flex-1 relative bg-gray-100">
        <ThreeViewer />
      </main>
    </div>

    <!-- Footer: dimensions bar -->
    <footer class="px-4 py-2 bg-white border-t border-gray-200 text-xs text-gray-500 shrink-0">
      Dimensions: — × — × — mm
    </footer>
  </div>
</template>
