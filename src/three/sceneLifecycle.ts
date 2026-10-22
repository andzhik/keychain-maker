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

/** Own scene attachment and disposal across model replacements. */
export function createSceneLifecycle(getScene: () => Scene | null) {
  let current: Group | null = null
  function clear() {
    if (current) disposeObject(current)
    current = null
  }
  function attach(root: Group): boolean {
    clear()
    const scene = getScene()
    if (!scene) {
      disposeObject(root)
      return false
    }
    current = root
    scene.add(root)
    return true
  }
  return { clear, attach }
}
