import * as THREE from 'three'
import { ref } from 'vue'
import type { ColorGroup, KeychainConfig } from '../types/keychain'
import { buildBasePlate } from '../utils/meshBuilder'

export function useKeychainBuilder(getScene: () => THREE.Scene | null) {
  let currentMesh: THREE.Mesh | null = null
  const dimensions = ref({ width: 0, height: 0, depth: 0 })

  function disposeCurrent() {
    if (!currentMesh) return
    const scene = getScene()
    if (scene) scene.remove(currentMesh)
    currentMesh.geometry.dispose()
    ;(currentMesh.material as THREE.Material).dispose()
    currentMesh = null
  }

  function build(colorGroups: ColorGroup[], config: KeychainConfig): THREE.Mesh | null {
    disposeCurrent()
    const scene = getScene()
    if (!scene) return null

    // Compute size from SVG bounding box or use placeholder
    let width = 40
    let height = 30

    if (colorGroups.length > 0) {
      const box = new THREE.Box3()
      for (const group of colorGroups) {
        for (const shape of group.shapes) {
          const pts = shape.getPoints(64)
          for (const p of pts) {
            box.expandByPoint(new THREE.Vector3(p.x, p.y, 0))
          }
        }
      }
      const size = new THREE.Vector3()
      box.getSize(size)
      width = size.x + config.padding * 2
      height = size.y + config.padding * 2
    }

    const mesh = buildBasePlate(config, width, height)
    scene.add(mesh)
    currentMesh = mesh

    dimensions.value = { width, height, depth: config.baseThickness }

    return mesh
  }

  function dispose() {
    disposeCurrent()
  }

  return { build, dispose, dimensions }
}
