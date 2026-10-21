import * as THREE from 'three'
import type { ColorGroup, KeychainConfig } from '../types/keychain'
import { buildBasePlate, buildLogoMeshes, cutoutBasePlateHoles } from '../utils/meshBuilder'
import { Profiler } from '../utils/profiler'
import { validateConfig } from '../utils/configConstraints'
import { logoOutline } from '../utils/svgToShapes'
import { fitLogo } from '../utils/logoFit'
import { validateGroupComplexity } from '../utils/svgValidation'
import { createLogoCutouts } from './logoCutouts'
import { disposeObject } from '../three/sceneLifecycle'

export interface ModelBuildError { code: string; message: string }
export interface KeychainModel {
  root: THREE.Group
  logoGroup: THREE.Group | null
  dimensions: { width: number; height: number; depth: number }
}
export type ModelBuildResult = { ok: true; model: KeychainModel } | { ok: false; error: ModelBuildError }

/** Build an owned, detached model without Vue state or scene mutation. */
export function buildKeychainModel(colorGroups: ColorGroup[], rawConfig: KeychainConfig,
  profiler = new Profiler('keychain build')): ModelBuildResult {
  const validation = validateConfig(rawConfig)
  const error = validation.messages.find(m => m.severity === 'error') ?? validateGroupComplexity(colorGroups)
  if (error) return { ok: false, error }
  let config = validation.config
  const root = new THREE.Group()
  let logoGroup: THREE.Group | null = null
  try {
    // The plate is cut along the logo's outline (the union of all colors), so
    // cutouts never overlap. Its points are reused for sizing and the cutout
    // shapes below. The union is cached per groups array, so slider changes
    // don't recompute it. SVG-parsed shapes are already straight-edged; 16
    // divisions only applies to curved shapes passed in directly.
    const outline = profiler.measure('logo outline', () => logoOutline(colorGroups))
    const shapePoints = outline.map(shape => shape.extractPoints(16))
    const fit = fitLogo(shapePoints.map(pts => pts.shape), config)
    const { hasLogo: hasSvg, scale, center: svgCenter, width, height } = fit
    config = validateConfig(rawConfig, { width, height }).config

    // Parent group — rotation applied once to lay everything flat on XZ
    root.rotation.x = -Math.PI / 2

    // Logo cutout shapes (step 5), one per connected outline part. Each keeps
    // its holes so a logo counter (the middle of an "O") stays as plate
    // material instead of becoming a through-hole.
    const logoCutouts = profiler.measure('cutout shapes', () => createLogoCutouts(shapePoints, fit))

    // Steps 1–3: base-plate spline, optional keyring, bevel extrude
    const basePlate = profiler.measure('buildBasePlate', () =>
      buildBasePlate(config, width, height, logoCutouts, profiler),
    )
    root.add(basePlate)

    // Step 4: logo surface inlays — un-beveled, flush with both base faces
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
      logoGroup = new THREE.Group()

      for (const mesh of logoMeshes) {
        logoGroup.add(mesh)
      }
      root.add(logoGroup)
    }

    // Step 5: subtract logo recesses (keyring through-hole is in step 3 extrude)
    profiler.measure('cutoutBasePlateHoles', () =>
      cutoutBasePlateHoles(basePlate, logoCutouts, config, profiler),
    )

    // Measured from the finished plate: the bevel bulges the outline outward
    // (bevelOffset 0), and the keyring loop extends past the nominal height.
    basePlate.geometry.computeBoundingBox()
    const plateBox = basePlate.geometry.boundingBox!
    const dimensions = {
      width: plateBox.max.x - plateBox.min.x,
      height: plateBox.max.y - plateBox.min.y,
      depth: plateBox.max.z - plateBox.min.z,
    }

    profiler.flush()
    return { ok: true, model: { root, logoGroup, dimensions } }
  } catch (error) {
    disposeObject(root)
    throw error
  }
}
