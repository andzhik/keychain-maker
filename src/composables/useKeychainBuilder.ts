import * as THREE from 'three'
import { ref } from 'vue'
import type { ColorGroup, KeychainConfig } from '../types/keychain'
import { buildBasePlate, buildLogoMeshes, cutoutBasePlateHoles } from '../utils/meshBuilder'
import { Profiler } from '../utils/profiler'
import { constrainConfig } from '../utils/configConstraints'
import { logoOutline } from '../utils/svgToShapes'

export function useKeychainBuilder(getScene: () => THREE.Scene | null) {
  let currentGroup: THREE.Group | null = null
  let logoGroupRef: THREE.Group | null = null
  // Survives rebuilds so a hidden logo stays hidden when the config changes.
  let logoVisible = true
  // The logo outline is a polygon union — only recomputed for a new SVG, not
  // on every slider change.
  let outlineFor: ColorGroup[] | null = null
  let outline: THREE.Shape[] = []
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

  function build(colorGroups: ColorGroup[], rawConfig: KeychainConfig): THREE.Group | null {
    const profiler = new Profiler('keychain build')
    const { config } = constrainConfig(rawConfig)
    profiler.measure('disposeCurrent', () => disposeCurrent())
    const scene = getScene()
    if (!scene) return null

    // The plate is cut along the logo's outline (the union of all colors), so
    // cutouts never overlap. Its points are reused for the bounding box and
    // the cutout shapes below. SVG-parsed shapes are already straight-edged;
    // 16 divisions only applies to curved shapes passed in directly.
    if (colorGroups !== outlineFor) {
      outline = profiler.measure('logo outline', () => logoOutline(colorGroups))
      outlineFor = colorGroups
    }
    const shapePoints: { shape: THREE.Vector2[]; holes: THREE.Vector2[][] }[] = []
    const box = new THREE.Box3()
    profiler.measure('bounding box', () => {
      for (const shape of outline) {
        const pts = shape.extractPoints(16)
        shapePoints.push(pts)
        for (const p of pts.shape) {
          box.expandByPoint(new THREE.Vector3(p.x, p.y, 0))
        }
      }
    })
    let hasSvg = shapePoints.length > 0

    let width = config.targetWidth
    let height = config.targetWidth * (2 / 3)
    let scale = 1
    const svgCenter = new THREE.Vector2(0, 0)

    if (hasSvg) {
      const center = new THREE.Vector3()
      box.getCenter(center)
      svgCenter.set(center.x, center.y)

      if (config.basePlateShape === 'circle') {
        // Fit the logo's farthest point inside the padded circle. Fitting the
        // bounding box instead lets its corners (at half the diagonal) poke out.
        let maxRadius = 0
        for (const pts of shapePoints) {
          for (const p of pts.shape) maxRadius = Math.max(maxRadius, p.distanceTo(svgCenter))
        }
        scale = (config.targetWidth / 2 - config.padding) / maxRadius
      }
      else {
        const size = new THREE.Vector3()
        box.getSize(size)
        scale = (config.targetWidth - config.padding * 2) / size.x
        height = size.y * scale + config.padding * 2
      }

      // A zero-width logo (or padding eating the whole plate) has no usable
      // scale; build the plain plate instead of NaN/Infinity geometry.
      if (!(scale > 0 && Number.isFinite(scale) && Number.isFinite(height))) {
        hasSvg = false
        scale = 1
        height = config.targetWidth * (2 / 3)
      }
    }

    if (config.basePlateShape === 'circle') {
      width = config.targetWidth
      height = config.targetWidth
    }

    // Parent group — rotation applied once to lay everything flat on XZ
    const root = new THREE.Group()
    root.rotation.x = -Math.PI / 2

    // Logo cutout shapes (step 5), one per connected outline part. Each keeps
    // its holes so a logo counter (the middle of an "O") stays as plate
    // material instead of becoming a through-hole.
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
      // Center SVG on origin, flip Y, and apply uniform scale. Baked into the
      // geometry rather than set on the group: a mirrored (negative-determinant)
      // node transform is exported as-is to 3MF, and slicers handle it unevenly.
      const logoTransform = new THREE.Matrix4()
        .makeScale(scale, -scale, 1)
        .setPosition(-svgCenter.x * scale, svgCenter.y * scale, 0)
      const logoMeshes = profiler.measure('buildLogoMeshes', () =>
        buildLogoMeshes(colorGroups, config, logoTransform),
      )
      const logoGroup = new THREE.Group()

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

    // Measured from the finished plate: the bevel bulges the outline outward
    // (bevelOffset 0), and the keyring loop extends past the nominal height.
    basePlate.geometry.computeBoundingBox()
    const plateBox = basePlate.geometry.boundingBox!
    dimensions.value = {
      width: plateBox.max.x - plateBox.min.x,
      height: plateBox.max.y - plateBox.min.y,
      depth: plateBox.max.z - plateBox.min.z,
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
