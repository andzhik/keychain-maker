import * as THREE from 'three'
import { ref } from 'vue'
import type { ColorGroup, KeychainConfig } from '../types/keychain'
import { buildBasePlate, buildLogoMeshes } from '../utils/meshBuilder'

export function useKeychainBuilder(getScene: () => THREE.Scene | null) {
  let currentGroup: THREE.Group | null = null
  const dimensions = ref({ width: 0, height: 0, depth: 0 })

  function disposeCurrent() {
    if (!currentGroup) return
    const scene = getScene()
    if (scene) scene.remove(currentGroup)
    currentGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
        ;(child.material as THREE.Material).dispose()
      }
    })
    currentGroup = null
  }

  function build(colorGroups: ColorGroup[], config: KeychainConfig): THREE.Group | null {
    disposeCurrent()
    const scene = getScene()
    if (!scene) return null

    // Compute SVG bounding box
    const box = new THREE.Box3()
    let hasSvg = false
    for (const group of colorGroups) {
      for (const shape of group.shapes) {
        const pts = shape.getPoints(64)
        for (const p of pts) {
          box.expandByPoint(new THREE.Vector3(p.x, p.y, 0))
        }
        hasSvg = true
      }
    }

    let width = 40
    let height = 30
    const svgCenter = new THREE.Vector2(0, 0)

    if (hasSvg) {
      const size = new THREE.Vector3()
      box.getSize(size)
      width = size.x + config.padding * 2
      height = size.y + config.padding * 2
      const center = new THREE.Vector3()
      box.getCenter(center)
      svgCenter.set(center.x, center.y)
    }

    // Parent group — rotation applied once to lay everything flat on XZ
    const root = new THREE.Group()
    root.rotation.x = -Math.PI / 2

    // Build hole paths from SVG shapes for base plate cutouts
    const holePaths: THREE.Path[] = []
    if (hasSvg) {
      for (const group of colorGroups) {
        for (const shape of group.shapes) {
          const pts = shape.getPoints(64)
          const hole = new THREE.Path()
          for (let i = 0; i < pts.length; i++) {
            const x = pts[i].x - svgCenter.x
            const y = -(pts[i].y - svgCenter.y)
            if (i === 0) hole.moveTo(x, y)
            else hole.lineTo(x, y)
          }
          holePaths.push(hole)
        }
      }
    }

    // Base plate with SVG cutouts
    const basePlate = buildBasePlate(config, width, height, holePaths)
    root.add(basePlate)

    // Logo meshes (flush inlay — same z as base plate)
    if (hasSvg) {
      const logoMeshes = buildLogoMeshes(colorGroups, config)
      const logoGroup = new THREE.Group()

      // Center SVG on origin and flip Y (SVG Y is inverted vs Three.js)
      logoGroup.scale.y = -1
      logoGroup.position.set(-svgCenter.x, svgCenter.y, 0)

      for (const mesh of logoMeshes) {
        logoGroup.add(mesh)
      }
      root.add(logoGroup)
    }

    scene.add(root)
    currentGroup = root

    dimensions.value = {
      width,
      height,
      depth: config.baseThickness,
    }

    return root
  }

  function dispose() {
    disposeCurrent()
  }

  return { build, dispose, dimensions }
}
