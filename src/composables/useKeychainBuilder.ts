import * as THREE from 'three'
import { ref } from 'vue'
import type { ColorGroup, KeychainConfig } from '../types/keychain'
import { buildBasePlate, buildLogoMeshes } from '../utils/meshBuilder'
import { Profiler } from '../utils/profiler'

export function useKeychainBuilder(getScene: () => THREE.Scene | null) {
  let currentGroup: THREE.Group | null = null
  let logoGroupRef: THREE.Group | null = null
  const dimensions = ref({ width: 0, height: 0, depth: 0 })

  function disposeCurrent() {
    if (!currentGroup) return
    const scene = getScene()
    if (scene) scene.remove(currentGroup)
    currentGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
          ; (child.material as THREE.Material).dispose()
      }
    })
    currentGroup = null
    logoGroupRef = null
  }

  function build(colorGroups: ColorGroup[], config: KeychainConfig): THREE.Group | null {
    const profiler = new Profiler('keychain build')
    profiler.measure('disposeCurrent', () => disposeCurrent())
    const scene = getScene()
    if (!scene) return null

    // Compute SVG bounding box
    const box = new THREE.Box3()
    let hasSvg = false
    profiler.measure('bounding box', () => {
      for (const group of colorGroups) {
        for (const shape of group.shapes) {
          const pts = shape.getPoints(64)
          for (const p of pts) {
            box.expandByPoint(new THREE.Vector3(p.x, p.y, 0))
          }
          hasSvg = true
        }
      }
    })

    let width = config.targetWidth
    let height = config.targetWidth * (2 / 3)
    let scale = 1
    const svgCenter = new THREE.Vector2(0, 0)

    if (hasSvg) {
      const size = new THREE.Vector3()
      box.getSize(size)
      scale = (config.targetWidth - config.padding * 2) / size.x
      width = config.targetWidth
      height = size.y * scale + config.padding * 2
      const center = new THREE.Vector3()
      box.getCenter(center)
      svgCenter.set(center.x, center.y)
    }

    // Parent group — rotation applied once to lay everything flat on XZ
    const root = new THREE.Group()
    root.rotation.x = -Math.PI / 2

    // Build hole paths from SVG shapes for base plate cutouts
    const holePaths: THREE.Path[] = []
    profiler.measure('hole paths', () => {
      if (hasSvg) {
        for (const group of colorGroups) {
          for (const shape of group.shapes) {
            // Low curve resolution keeps the CSG cutter prisms light — this is the
            // dominant build cost. The inlaid logo hides most cutout-wall faceting.
            const pts = shape.getPoints(16)
            const hole = new THREE.Path()
            for (let i = 0; i < pts.length; i++) {
              const x = (pts[i].x - svgCenter.x) * scale
              const y = -(pts[i].y - svgCenter.y) * scale
              if (i === 0) hole.moveTo(x, y)
              else hole.lineTo(x, y)
            }
            holePaths.push(hole)
          }
        }
      }
    })

    // Base plate with SVG cutouts
    const basePlate = profiler.measure('buildBasePlate', () =>
      buildBasePlate(config, width, height, holePaths, profiler),
    )
    root.add(basePlate)

    // Logo meshes (flush inlay — same z as base plate)
    if (hasSvg) {
      const logoMeshes = profiler.measure('buildLogoMeshes', () =>
        buildLogoMeshes(colorGroups, config),
      )
      const logoGroup = new THREE.Group()

      // Center SVG on origin, flip Y, and apply uniform scale
      logoGroup.scale.set(scale, -scale, 1)
      logoGroup.position.set(-svgCenter.x * scale, svgCenter.y * scale, 0)

      for (const mesh of logoMeshes) {
        logoGroup.add(mesh)
      }
      root.add(logoGroup)
      logoGroupRef = logoGroup
    }

    scene.add(root)
    currentGroup = root

    profiler.flush()

    const totalHeight = config.keyringEnabled
      ? height + config.keyringRingDiameter / 2
      : height

    dimensions.value = {
      width,
      height: totalHeight,
      depth: config.baseThickness,
    }

    return root
  }

  function dispose() {
    disposeCurrent()
  }

  function setLogoVisible(visible: boolean) {
    if (logoGroupRef) logoGroupRef.visible = visible
  }

  return { build, dispose, dimensions, setLogoVisible }
}
