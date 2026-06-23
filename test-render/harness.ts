import * as THREE from 'three'
import { svgToShapes } from '../src/utils/svgToShapes'
import { useKeychainBuilder } from '../src/composables/useKeychainBuilder'
import { DEFAULT_CONFIG, type KeychainConfig } from '../src/types/keychain'

// Headless render harness. Drives the *real* build pipeline (svgToShapes ->
// useKeychainBuilder.build) so the captured image reflects exactly what the app
// renders — same scaling, centering, CSG keyring hole, beveled plate, and inlaid
// logo. Lights match useThreeScene so shading matches the live viewport. No grid
// or axes helpers: a clean object render is easier to analyze.

interface View {
  name: string
  // World-space direction the camera looks FROM (towards the object center).
  dir: [number, number, number]
}

// The root group is laid flat on XZ (rotation.x = -90°) by useKeychainBuilder, so
// the keychain's top face points +Y. These directions are chosen accordingly.
const VIEWS: View[] = [
  { name: 'iso', dir: [1, 1, 1] },
  { name: 'iso-back', dir: [-1, 1, -1] },
  { name: 'top', dir: [0, 1, 0] },
  { name: 'front', dir: [0, 0.35, 1] },
  { name: 'back', dir: [0, 0.35, -1] },
]

function addLights(scene: THREE.Scene) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.6))
  const dir = new THREE.DirectionalLight(0xffffff, 1.0)
  dir.position.set(5, 10, 7.5)
  scene.add(dir)
}

function makeCamera(root: THREE.Object3D, dir: THREE.Vector3): THREE.OrthographicCamera {
  const box = new THREE.Box3().setFromObject(root)
  const sphere = box.getBoundingSphere(new THREE.Sphere())
  const r = sphere.radius * 1.15
  const cam = new THREE.OrthographicCamera(-r, r, r, -r, 0.1, 10000)
  cam.position.copy(sphere.center).add(dir.clone().normalize().multiplyScalar(r * 6))
  // Default up (0,1,0) is degenerate for the straight-down top view; pick another.
  if (Math.abs(dir.clone().normalize().y) > 0.99) cam.up.set(0, 0, -1)
  cam.lookAt(sphere.center)
  cam.updateProjectionMatrix()
  return cam
}

async function renderKeychain(
  svgString: string,
  overrides: Partial<KeychainConfig> = {},
  size = 700,
): Promise<{ name: string; dataURL: string }[]> {
  const config: KeychainConfig = { ...DEFAULT_CONFIG, ...overrides }

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0f0f0)
  addLights(scene)

  const builder = useKeychainBuilder(() => scene)
  const groups = svgString.trim() ? svgToShapes(svgString) : []
  const root = builder.build(groups, config)
  if (!root) throw new Error('Keychain build returned null')

  const canvas = document.createElement('canvas')
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    preserveDrawingBuffer: true,
  })
  renderer.setSize(size, size)

  const out: { name: string; dataURL: string }[] = []
  for (const view of VIEWS) {
    const cam = makeCamera(root, new THREE.Vector3(...view.dir))
    renderer.render(scene, cam)
    out.push({ name: view.name, dataURL: canvas.toDataURL('image/png') })
  }

  return out
}

declare global {
  interface Window {
    __renderKeychain: typeof renderKeychain
  }
}

window.__renderKeychain = renderKeychain
