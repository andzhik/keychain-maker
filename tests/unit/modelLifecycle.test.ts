import { expect, spyOn, test } from 'bun:test'
import * as THREE from 'three'
import { buildKeychainModel } from '../../src/domain/keychainModel'
import { createLogoCutouts } from '../../src/domain/logoCutouts'
import { createSceneLifecycle, disposeObject } from '../../src/three/sceneLifecycle'
import { fitLogo } from '../../src/utils/logoFit'
import { DEFAULT_CONFIG, type ColorGroup } from '../../src/types/keychain'
import * as meshBuilder from '../../src/utils/meshBuilder'

function artwork(): ColorGroup[] {
  const shape = new THREE.Shape([new THREE.Vector2(10, 20), new THREE.Vector2(30, 20), new THREE.Vector2(30, 40), new THREE.Vector2(10, 40)])
  shape.holes.push(new THREE.Path([new THREE.Vector2(15, 25), new THREE.Vector2(25, 25), new THREE.Vector2(25, 35), new THREE.Vector2(15, 35)]))
  return [{ id: '#ff0000', color: '#ff0000', shapes: [shape], pathCount: 1 }]
}

test('cutouts preserve counters, center, scale and Y flip without mutating source points', () => {
  const points = artwork()[0].shapes[0].extractPoints(16)
  const before = JSON.stringify(points)
  const fit = fitLogo([points.shape], DEFAULT_CONFIG)
  const [cutout] = createLogoCutouts([points], fit)
  expect(cutout.getPoints()[0].toArray()).toEqual([-20, 20])
  expect(cutout.holes).toHaveLength(1)
  expect(cutout.holes[0].getPoints()[0].toArray()).toEqual([-10, 10])
  expect(JSON.stringify(points)).toBe(before)
  expect(createLogoCutouts([points], { ...fit, hasLogo: false })).toEqual([])
})

test('the model builder returns detached geometry and dimensions without Vue or a scene', () => {
  const result = buildKeychainModel(artwork(), DEFAULT_CONFIG)
  expect(result.ok).toBe(true)
  if (!result.ok) return
  const { root, logoGroup, dimensions } = result.model
  expect(root.parent).toBeNull()
  expect(logoGroup?.parent).toBe(root)
  expect(root.children).toHaveLength(2)
  expect(dimensions.width).toBeCloseTo(51.2)
  expect(dimensions.depth).toBeCloseTo(5)
  disposeObject(root)
  const failed = buildKeychainModel(artwork(), { ...DEFAULT_CONFIG, targetWidth: NaN })
  expect(failed.ok).toBe(false)
  if (!failed.ok) expect(failed.error.code).toBe('NONFINITE_VALUE')
})

test('a failed CSG build disposes its partially built model', () => {
  const disposals: ReturnType<typeof spyOn>[] = []
  const cutout = spyOn(meshBuilder, 'cutoutBasePlateHoles').mockImplementation((plate) => {
    plate.parent!.traverse(child => {
      if (!(child instanceof THREE.Mesh)) return
      disposals.push(spyOn(child.geometry, 'dispose'))
      disposals.push(spyOn(child.material as THREE.Material, 'dispose'))
    })
    throw new Error('simulated CSG failure')
  })
  try {
    expect(() => buildKeychainModel(artwork(), DEFAULT_CONFIG)).toThrow('simulated CSG failure')
    expect(disposals.length).toBe(4)
    for (const dispose of disposals) expect(dispose).toHaveBeenCalledTimes(1)
  } finally {
    cutout.mockRestore()
    for (const dispose of disposals) dispose.mockRestore()
  }
})

test('scene replacements dispose shared resources', () => {
  let scene: THREE.Scene | null = new THREE.Scene()
  const originalScene = scene
  const lifecycle = createSceneLifecycle(() => scene)
  const geometry = new THREE.BoxGeometry()
  const red = new THREE.MeshBasicMaterial({ color: 'red' })
  const blue = new THREE.MeshBasicMaterial({ color: 'blue' })
  const root = new THREE.Group()
  root.add(new THREE.Mesh(geometry, [red, blue]), new THREE.Mesh(geometry, red))
  const logo = new THREE.Group()
  root.add(logo)
  const disposals = [spyOn(geometry, 'dispose'), spyOn(red, 'dispose'), spyOn(blue, 'dispose')]
  expect(lifecycle.attach(root)).toBe(true)
  scene = new THREE.Scene()
  const replacement = new THREE.Group()
  const nextLogo = new THREE.Group()
  replacement.add(nextLogo)
  expect(lifecycle.attach(replacement)).toBe(true)
  expect(originalScene.children).toHaveLength(0)
  for (const dispose of disposals) expect(dispose).toHaveBeenCalledTimes(1)
  lifecycle.clear()
  lifecycle.clear()
  expect(scene.children).toHaveLength(0)
  for (const dispose of disposals) { expect(dispose).toHaveBeenCalledTimes(1); dispose.mockRestore() }
})

test('a missing scene releases a model instead of retaining detached resources', () => {
  const root = new THREE.Group()
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial())
  root.add(mesh)
  const dispose = spyOn(mesh.geometry, 'dispose')
  expect(createSceneLifecycle(() => null).attach(root)).toBe(false)
  expect(dispose).toHaveBeenCalledTimes(1)
  dispose.mockRestore()
})
