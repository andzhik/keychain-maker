import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import type { Face } from '../types/keychain'

export function useThreeScene() {
  let renderer: THREE.WebGLRenderer | null = null
  let scene: THREE.Scene | null = null
  let camera: THREE.OrthographicCamera | null = null
  let controls: OrbitControls | null = null
  let animFrameId: number | null = null
  let renderRequested = false
  let resizeObserver: ResizeObserver | null = null
  let resizeRafId: number | null = null

  // Render-on-demand: instead of pinning the GPU at the display refresh rate for a
  // static scene, we only draw when something changes. A frame advances the
  // OrbitControls damping; `update()` returns true while the camera is still
  // settling, so the loop keeps itself alive for the damping tail and stops once
  // the scene is at rest.
  function renderFrame() {
    renderRequested = false
    if (!renderer || !scene || !camera || !controls) return
    const cameraMoved = controls.update()
    renderer.render(scene, camera)
    if (cameraMoved) requestRender()
  }

  function requestRender() {
    if (renderRequested || !renderer) return
    renderRequested = true
    animFrameId = requestAnimationFrame(renderFrame)
  }

  function init(container: HTMLElement): { webglUnavailable: boolean } {
    // WebGL availability check
    if (!isWebGLAvailable()) {
      return { webglUnavailable: true }
    }

    // Scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f0f0)

    // Camera
    const { clientWidth: w, clientHeight: h } = container
    const frustumSize = 80
    const aspect = w / h
    camera = new THREE.OrthographicCamera(
      -frustumSize * aspect / 2, frustumSize * aspect / 2,
      frustumSize / 2, -frustumSize / 2,
      0.1, 1000
    )
    camera.position.set(60, 60, 60)
    camera.lookAt(0, 0, 0)

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(w, h)
    container.appendChild(renderer.domElement)

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0)
    dirLight.position.set(5, 10, 7.5)
    scene.add(dirLight)
    const backLight = new THREE.DirectionalLight(0xffffff, 0.8)
    backLight.position.set(-5, -10, 7.5)
    scene.add(backLight)

    // OrbitControls
    controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    // Resize handling — throttle to one update per animation frame so a burst
    // of ResizeObserver callbacks (e.g. while dragging the window edge) coalesces
    // into a single camera/renderer update instead of one per event.
    function applyResize() {
      resizeRafId = null
      if (!renderer || !camera) return
      const w = container.clientWidth
      const h = container.clientHeight
      const frustumSize = 80
      const aspect = w / h
      camera.left = -frustumSize * aspect / 2
      camera.right = frustumSize * aspect / 2
      camera.top = frustumSize / 2
      camera.bottom = -frustumSize / 2
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      requestRender()
    }
    resizeObserver = new ResizeObserver(() => {
      if (resizeRafId !== null) return
      resizeRafId = requestAnimationFrame(applyResize)
    })
    resizeObserver.observe(container)

    // Repaint whenever the user orbits/zooms; renderFrame handles the damping tail.
    controls.addEventListener('change', requestRender)
    requestRender()

    return { webglUnavailable: false }
  }

  function dispose() {
    if (animFrameId !== null) cancelAnimationFrame(animFrameId)
    renderRequested = false
    if (resizeRafId !== null) cancelAnimationFrame(resizeRafId)
    resizeObserver?.disconnect()
    controls?.dispose()
    renderer?.dispose()
    renderer?.domElement.remove()
    animFrameId = null
    renderer = null
    scene = null
    camera = null
    controls = null
    resizeObserver = null
    resizeRafId = null
  }

  function fitCamera(target: THREE.Object3D, face?: Face) {
    if (!camera || !controls) return
    const box = new THREE.Box3().setFromObject(target)
    const sphere = new THREE.Sphere()
    box.getBoundingSphere(sphere)
    const radius = sphere.radius * 1.3
    camera.zoom = Math.min(
      (camera.right - camera.left) / (2 * radius),
      (camera.top - camera.bottom) / (2 * radius)
    )
    camera.updateProjectionMatrix()
    // The display rotation puts Front on +Y, Back on -Y, and the keyring at -Z.
    camera.up.set(0, face ? 0 : 1, face ? -1 : 0)
    const offset = (face ? new THREE.Vector3(0, face === 'front' ? 1 : -1, 0)
      : new THREE.Vector3(1, 1, 1).normalize()).multiplyScalar(radius * 2)
    camera.position.copy(sphere.center).add(offset)
    controls.target.copy(sphere.center)
    controls.update()
    requestRender()
  }

  function getScene() { return scene }
  function getCamera() { return camera }
  function getRenderer() { return renderer }

  return { init, dispose, getScene, getCamera, getRenderer, fitCamera, requestRender }
}

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
    const available = !!(window.WebGLRenderingContext && gl)
    // Release the probe context immediately so HMR cycles don't exhaust the
    // browser's WebGL context limit before GC reclaims this throwaway canvas.
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    return available
  } catch {
    return false
  }
}
