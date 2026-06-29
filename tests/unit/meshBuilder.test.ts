import { expect, test } from 'bun:test'
import * as THREE from 'three'
import { buildBasePlate, buildLogoMeshes } from '../../src/utils/meshBuilder'
import { DEFAULT_CONFIG, type ColorGroup, type KeychainConfig } from '../../src/types/keychain'

function config(overrides: Partial<KeychainConfig> = {}): KeychainConfig {
  return { ...DEFAULT_CONFIG, ...overrides }
}

function rectangleShape(width = 10, height = 6): THREE.Shape {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.lineTo(width, 0)
  shape.lineTo(width, height)
  shape.lineTo(0, height)
  shape.lineTo(0, 0)
  return shape
}

function rectanglePath(width = 10, height = 6): THREE.Path {
  const path = new THREE.Path()
  path.moveTo(0, 0)
  path.lineTo(width, 0)
  path.lineTo(width, height)
  path.lineTo(0, height)
  path.lineTo(0, 0)
  return path
}

test('buildBasePlate puts the keyring hole in the extruded shape', () => {
  const base = buildBasePlate(config({ keyringEnabled: true }), 50, 30)
  const shape = base.geometry.parameters.shapes as THREE.Shape

  expect(shape.holes).toHaveLength(1)
  expect(base.geometry.parameters.options.bevelEnabled).toBe(true)
})

test('flat base extrude includes logo cutout paths as shape holes', () => {
  const logoHole = rectanglePath()
  const base = buildBasePlate(
    config({ edgeBevel: 0, keyringEnabled: false }),
    50,
    30,
    [logoHole],
  )
  const shape = base.geometry.parameters.shapes as THREE.Shape

  expect(shape.holes).toEqual([logoHole])
  expect(base.geometry.parameters.options.bevelEnabled).toBe(false)
})

test('base bevel is clamped so extrusion depth never goes negative', () => {
  const base = buildBasePlate(config({ baseThickness: 1, edgeBevel: 10 }), 50, 30)

  expect(base.geometry.parameters.options.depth).toBeCloseTo(0.1, 5)
})

test('logo meshes are un-beveled and shifted flush by the base bevel', () => {
  const group: ColorGroup = {
    id: '#ff0000',
    color: '#ff0000',
    shapes: [rectangleShape()],
    pathCount: 1,
  }
  const [mesh] = buildLogoMeshes([group], config({ baseThickness: 5, edgeBevel: 0.6 }))

  mesh.geometry.computeBoundingBox()

  expect(mesh.geometry.parameters.options.bevelEnabled).toBe(false)
  expect(mesh.geometry.boundingBox?.min.z).toBeCloseTo(-0.6, 5)
  expect(mesh.geometry.boundingBox?.max.z).toBeCloseTo(4.4, 5)
})
