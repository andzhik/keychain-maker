import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export function useThreeScene() {
  let renderer: THREE.WebGLRenderer | null = null
  let scene: THREE.Scene | null = null
  let camera: THREE.PerspectiveCamera | null = null
  let controls: OrbitControls | null = null
  let animFrameId: number | null = null
  let resizeObserver: ResizeObserver | null = null

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
    camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000)
    camera.position.set(0, 0, 100)

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

    // OrbitControls
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    // Grid + axes
    scene.add(new THREE.GridHelper(50, 50, 0xcccccc, 0xe0e0e0))
    scene.add(new THREE.AxesHelper(10))

    // Resize handling
    resizeObserver = new ResizeObserver(() => {
      if (!renderer || !camera) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    })
    resizeObserver.observe(container)

    // Render loop
    function animate() {
      animFrameId = requestAnimationFrame(animate)
      controls!.update()
      renderer!.render(scene!, camera!)
    }
    animate()

    return { webglUnavailable: false }
  }

  function dispose() {
    if (animFrameId !== null) cancelAnimationFrame(animFrameId)
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
  }

  function getScene() { return scene }
  function getCamera() { return camera }
  function getRenderer() { return renderer }

  return { init, dispose, getScene, getCamera, getRenderer }
}

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}
