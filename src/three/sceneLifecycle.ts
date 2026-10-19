import { Mesh, type Group, type Scene } from 'three'

/** Release owned mesh resources once, even when children share them. */
export function disposeObject(root: Group) {
  root.removeFromParent()
  const geometries = new Set<Mesh['geometry']>()
  const materials = new Set<Exclude<Mesh['material'], unknown[]>>()
  root.traverse(child => {
    if (!(child instanceof Mesh)) return
    geometries.add(child.geometry)
    for (const material of Array.isArray(child.material) ? child.material : [child.material]) materials.add(material)
  })
  for (const geometry of geometries) geometry.dispose()
  for (const material of materials) material.dispose()
}

/** Own scene attachment, disposal and visibility across model replacements. */
export function createSceneLifecycle(getScene: () => Scene | null) {
  let current: Group | null = null
  let logo: Group | null = null
  let logoVisible = true
  function clear() {
    if (current) disposeObject(current)
    current = null
    logo = null
  }
  function attach(root: Group, logoGroup: Group | null): boolean {
    clear()
    const scene = getScene()
    if (!scene) {
      disposeObject(root)
      return false
    }
    current = root
    logo = logoGroup
    if (logo) logo.visible = logoVisible
    scene.add(root)
    return true
  }
  function setLogoVisible(visible: boolean) {
    logoVisible = visible
    if (logo) logo.visible = visible
  }
  return { clear, attach, setLogoVisible }
}
