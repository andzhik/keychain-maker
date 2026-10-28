import { expect, test } from 'bun:test'
import * as THREE from 'three'
import { DEFAULT_CONFIG } from '../../src/types/keychain'
import { createOutlinePlate } from '../../src/domain/outlinePlate'
import { validateConfig } from '../../src/utils/configConstraints'
import { buildBasePlate, clampBevel } from '../../src/utils/meshBuilder'
import { printabilityWarnings } from '../../src/utils/printability'
import { disposeObject } from '../../src/three/sceneLifecycle'

for (const basePlateShape of ['square', 'circle', 'outline'] as const) {
  for (const overrides of [
    { edgeBevel: 0 }, { edgeBevel: 0.005 }, { edgeBevel: 0.01 }, { edgeBevel: 0.6 },
    { edgeBevel: 2, baseThickness: 0.8 }, { edgeBevel: 2, keyringHoleDiameter: 2, keyringRingDiameter: 4 },
    { edgeBevel: 0, keyringHoleDiameter: 5.5 }, { edgeBevel: 0.6, keyringHoleDiameter: 5.5 },
  ]) {
    test(`${basePlateShape} keyring advice matches face and middle mesh walls: ${JSON.stringify(overrides)}`, () => {
      const { config, adjustments } = validateConfig({ ...DEFAULT_CONFIG, basePlateShape,
        keyringHoleDiameter: 4, keyringRingDiameter: 6, keyringAngle: 37, ...overrides })
      const silhouette = new THREE.Shape([
        new THREE.Vector2(-25, -25), new THREE.Vector2(25, -25),
        new THREE.Vector2(25, 25), new THREE.Vector2(-25, 25),
      ])
      const outline = basePlateShape === 'outline' ? createOutlinePlate([silhouette], config) : undefined
      const plate = buildBasePlate(config, 50, 50, [], undefined, outline)
      const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
      const probe = new THREE.Mesh(plate.geometry, material)
      const angle = basePlateShape === 'outline' ? config.keyringAngle * Math.PI / 180 : 0
      const holePoints = outline?.holes[0].getPoints()
      const center = holePoints
        ? new THREE.Box2().setFromPoints(holePoints).getCenter(new THREE.Vector2())
        : new THREE.Vector2(0, 25)
      function wall(z: number) {
        // Measure the thinnest part of the exposed arc, clear of the reinforced neck.
        return Math.min(...[-0.6, -0.3, 0.04, 0.3, 0.6].map(offset => {
          const direction = new THREE.Vector3(Math.sin(angle + offset), Math.cos(angle + offset), 0)
          const ray = new THREE.Raycaster(new THREE.Vector3(center.x, center.y, z), direction)
          const hits = ray.intersectObject(probe).map(hit => hit.distance)
          const unique = hits.filter((distance, i) => !i || Math.abs(distance - hits[i - 1]) > 1e-5)
          expect(unique).toHaveLength(2)
          return unique[1] - unique[0]
        }))
      }
      try {
        const bevel = clampBevel(config)
        const face = wall(-bevel + 1e-5).toFixed(1)
        const middle = wall(config.baseThickness / 2 - bevel).toFixed(1)
        const message = printabilityWarnings(config, 0.4).find(w => w.field === 'keyringHoleDiameter')!.message
        if (bevel > 0) {
          expect(message).toContain(`${face} mm at the flat faces`)
          expect(message).toContain(`${middle} mm through the middle`)
          expect(message).toContain('at least 2 mm at the faces')
        } else {
          expect(message).toContain(`The keyring wall is ${face} mm.`)
          expect(message).not.toContain('middle')
          expect(face).toBe(middle)
        }
        if (adjustments.some(a => a.field === 'keyringHoleDiameter')) {
          expect(adjustments.find(a => a.field === 'keyringHoleDiameter')!.message).toContain('at the flat faces')
        }
      } finally {
        material.dispose()
        disposeObject(plate)
      }
    })
  }
}
