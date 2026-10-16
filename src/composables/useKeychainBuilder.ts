import * as THREE from 'three'
import { ref } from 'vue'
import type { ColorGroup, KeychainConfig } from '../types/keychain'
import { buildBasePlate, buildLogoMeshes, cutoutBasePlateHoles } from '../utils/meshBuilder'
import { Profiler } from '../utils/profiler'

export function useKeychainBuilder(getScene: () => THREE.Scene | null) {
  let currentGroup: THREE.Group | null = null
  let logoGroupRef: THREE.Group | null = null
  // Survives rebuilds so a hidden logo stays hidden when the config changes.
  let logoVisible = true
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

    // Tessellate every shape (outer contour + holes) once and reuse the points
    // for both the bounding box and the cutout shapes below. Low curve
    // resolution keeps the CSG cutter prisms light — this is the dominant build
    // cost. The inlaid logo hides most cutout-wall faceting.
    const shapePoints: { shape: THREE.Vector2[]; holes: THREE.Vector2[][] }[] = []
    const box = new THREE.Box3()
    let hasSvg = false
    profiler.measure('bounding box', () => {
      for (const group of colorGroups) {
        for (const shape of group.shapes) {
          const pts = shape.extractPoints(16)
          shapePoints.push(pts)
          for (const p of pts.shape) {
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

    if (config.basePlateShape === 'circle') {
      const diameter = Math.max(width, height)
      width = diameter
      height = diameter
    }

    // Parent group — rotation applied once to lay everything flat on XZ
    const root = new THREE.Group()
    root.rotation.x = -Math.PI / 2

    // Logo cutout shapes (step 5) — tessellated once, reused for CSG subtract
    // prisms. Each keeps its holes so a logo counter (the middle of an "O")
    // stays as plate material instead of becoming a through-hole.
    const toPlate = (pts: THREE.Vector2[]) =>
      pts.map(p => new THREE.Vector2((p.x - svgCenter.x) * scale, -(p.y - svgCenter.y) * scale))
    const logoCutouts: THREE.Shape[] = []
    profiler.measure('cutout shapes', () => {
      if (hasSvg) {
        for (const pts of shapePoints) {
          const cutout = new THREE.Shape(toPlate(pts.shape))
          for (const hole of pts.holes) cutout.holes.push(new THREE.Path(toPlate(hole)))
          logoCutouts.push(cutout)
        }
      }
    })

    // Steps 1–3: base-plate spline, optional keyring, bevel extrude
    const basePlate = profiler.measure('buildBasePlate', () =>
      buildBasePlate(config, width, height, logoCutouts, profiler),
    )
    root.add(basePlate)

    // Step 4: logo meshes — un-beveled extrude, flush with base faces
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
      logoGroup.visible = logoVisible
      root.add(logoGroup)
      logoGroupRef = logoGroup
    }

    // Step 5: CSG subtract logo cutouts from beveled base (keyring hole is in step 3 extrude)
    profiler.measure('cutoutBasePlateHoles', () =>
      cutoutBasePlateHoles(basePlate, logoCutouts, config, profiler),
    )

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
    logoVisible = visible
    if (logoGroupRef) logoGroupRef.visible = visible
  }

  return { build, dispose, dimensions, setLogoVisible }
}
