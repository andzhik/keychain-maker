import * as THREE from 'three'
import type { ColorGroup, KeychainArtwork, KeychainConfig, Face } from '../types/keychain'
import { buildBasePlate, buildLogoMeshes, cutoutBasePlateHoles, cutoutFaceRecesses, faceLayer } from '../utils/meshBuilder'
import { Profiler } from '../utils/profiler'
import { validateConfig } from '../utils/configConstraints'
import { logoOutline } from '../utils/svgToShapes'
import { fitFaces } from '../utils/logoFit'
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
export function buildKeychainModel(artwork: KeychainArtwork | ColorGroup[], rawConfig: KeychainConfig,
  profiler = new Profiler('keychain build')): ModelBuildResult {
  // Direct single-image callers retain the original physical orientation.
  const faces: KeychainArtwork = Array.isArray(artwork)
    ? { front: { groups: artwork, mirror: false }, back: { groups: artwork, mirror: true } } : artwork
  const validation = validateConfig(rawConfig)
  const allGroups = faces.front.groups === faces.back.groups ? faces.front.groups : [...faces.front.groups, ...faces.back.groups]
  const error = validation.messages.find(m => m.severity === 'error') ?? validateGroupComplexity(allGroups)
  if (error) return { ok: false, error }
  let config = validation.config
  const root = new THREE.Group()
  let logoGroup: THREE.Group | null = null
  try {
    const fit = profiler.measure('logo outlines and fit', () => fitFaces(faces.front.groups, faces.back.groups, config))
    const { width, height } = fit
    config = validateConfig(rawConfig, { width, height }).config

    // Parent group — rotation applied once to lay everything flat on XZ
    root.rotation.x = -Math.PI / 2

    const faceNames: Face[] = ['front', 'back']
    // The back's outside-view X axis is opposite the plate's X axis.
    const flipX = (face: Face) => faces[face].mirror !== (face === 'back')
    // Only identical volumes/materials may share the legacy through-inlay and
    // flat through-hole shortcuts. Empty or independently mirrored faces may not.
    const equivalent = faces.front.groups === faces.back.groups && flipX('front') === flipX('back')
    const cutouts = profiler.measure('cutout shapes', () => {
      const create = (face: Face) =>
        createLogoCutouts(logoOutline(faces[face].groups).map(shape => shape.extractPoints(16)), fit[face], flipX(face))
      const front = create('front')
      return { front, back: equivalent ? front : create('back') }
    })

    // Steps 1–3: base-plate spline, optional keyring, bevel extrude
    const basePlate = profiler.measure('buildBasePlate', () =>
      buildBasePlate(config, width, height, equivalent ? cutouts.front : [], profiler),
    )
    root.add(basePlate)

    // Step 4: logo surface inlays — un-beveled, flush with both base faces
    if (fit.front.hasLogo || fit.back.hasLogo) {
      logoGroup = new THREE.Group()
      root.add(logoGroup)
      for (const face of equivalent ? ['front'] as const : faceNames) {
        const { scale, center, hasLogo } = fit[face]
        if (!hasLogo) continue
        const sx = scale * (flipX(face) ? -1 : 1)
        const transform = new THREE.Matrix4().makeScale(sx, -scale, 1)
          .setPosition(-center.x * sx, center.y * scale, 0)
        const meshes = profiler.measure(`buildLogoMeshes (${face})`, () =>
          buildLogoMeshes(faces[face].groups, config, transform, equivalent ? undefined : [faceLayer(config, face)]))
        for (const mesh of meshes) {
          mesh.name = equivalent ? 'Front and Back inlay' : `${face} inlay`
          logoGroup.add(mesh)
        }
      }
    }

    // Step 5: subtract logo recesses (keyring through-hole is in step 3 extrude)
    profiler.measure('cutoutBasePlateHoles', () =>
      equivalent ? cutoutBasePlateHoles(basePlate, cutouts.front, config, profiler)
        : cutoutFaceRecesses(basePlate, faceNames.map(face => ({ shapes: cutouts[face], layer: faceLayer(config, face), face })), config),
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
