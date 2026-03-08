import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import type { ColorGroup, KeychainConfig } from '../types/keychain'

export function exportThreeMf(
  rootGroup: THREE.Group,
  colorGroups: ColorGroup[],
  config: KeychainConfig,
): void {
  // Ensure world matrices are up to date
  rootGroup.updateMatrixWorld(true)

  // Build ordered color list: base color first, then each SVG color
  const colorList: string[] = [config.baseColor]
  for (const cg of colorGroups) {
    if (!colorList.includes(cg.color)) {
      colorList.push(cg.color)
    }
  }

  // Collect meshes by color hex
  const meshesByColor = new Map<string, THREE.Mesh[]>()
  for (const c of colorList) meshesByColor.set(c, [])

  rootGroup.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return
    const mat = child.material as THREE.MeshStandardMaterial
    const hex = '#' + mat.color.getHexString().toUpperCase()
    if (!meshesByColor.has(hex)) {
      // Fallback: try case-insensitive match
      const match = colorList.find((c) => c.toUpperCase() === hex)
      if (match) {
        meshesByColor.get(match)!.push(child)
      } else {
        meshesByColor.set(hex, [child])
        colorList.push(hex)
      }
    } else {
      meshesByColor.get(hex)!.push(child)
    }
  })

  // Merge geometries per color, applying world transforms
  const mergedGeometries = new Map<string, THREE.BufferGeometry>()
  for (const [color, meshes] of meshesByColor) {
    if (meshes.length === 0) continue
    const geos: THREE.BufferGeometry[] = []
    for (const mesh of meshes) {
      const geo = mesh.geometry.clone()
      geo.applyMatrix4(mesh.matrixWorld)
      geos.push(geo)
    }
    const merged = geos.length === 1 ? geos[0] : mergeGeometries(geos)
    if (merged) mergedGeometries.set(color, merged)
  }

  // Extract all vertices and triangles
  let globalVertexOffset = 0
  const allVertices: string[] = []
  const allTriangles: string[] = []

  for (let ci = 0; ci < colorList.length; ci++) {
    const color = colorList[ci]
    const geo = mergedGeometries.get(color)
    if (!geo) continue

    const pos = geo.getAttribute('position') as THREE.BufferAttribute
    const vertexCount = pos.count

    // Add vertices with Y↔Z swap for 3MF Z-up convention
    for (let i = 0; i < vertexCount; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = pos.getZ(i)
      // After matrixWorld (which includes root's -90° X rotation),
      // coords are already roughly Z-up. Output as-is.
      allVertices.push(`          <vertex x="${x.toFixed(4)}" y="${y.toFixed(4)}" z="${z.toFixed(4)}" />`)
    }

    // Add triangles
    const index = geo.getIndex()
    if (index) {
      for (let i = 0; i < index.count; i += 3) {
        const v1 = index.getX(i) + globalVertexOffset
        const v2 = index.getX(i + 1) + globalVertexOffset
        const v3 = index.getX(i + 2) + globalVertexOffset
        allTriangles.push(`          <triangle v1="${v1}" v2="${v2}" v3="${v3}" pid="1" p1="${ci}" />`)
      }
    } else {
      // Non-indexed geometry
      for (let i = 0; i < vertexCount; i += 3) {
        const v1 = i + globalVertexOffset
        const v2 = i + 1 + globalVertexOffset
        const v3 = i + 2 + globalVertexOffset
        allTriangles.push(`          <triangle v1="${v1}" v2="${v2}" v3="${v3}" pid="1" p1="${ci}" />`)
      }
    }

    globalVertexOffset += vertexCount
  }

  // Build materials XML
  const materialsXml = colorList.map((color, i) => {
    const label = i === 0 ? `Base - ${color}` : `Color - ${color}`
    return `      <basematerial name="${label}" displaycolor="${color}" />`
  }).join('\n')

  // Build model XML
  const modelXml = `<?xml version="1.0" encoding="UTF-8"?>
<model unit="millimeter" xml:lang="en-US"
  xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02"
  xmlns:m="http://schemas.microsoft.com/3dmanufacturing/material/2015/02">
  <resources>
    <basematerials id="1">
${materialsXml}
    </basematerials>
    <object id="2" type="model">
      <mesh>
        <vertices>
${allVertices.join('\n')}
        </vertices>
        <triangles>
${allTriangles.join('\n')}
        </triangles>
      </mesh>
    </object>
  </resources>
  <build>
    <item objectid="2" />
  </build>
</model>`

  // Static 3MF package files
  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" />
  <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml" />
</Types>`

  const relsXml = `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Target="/3D/3dmodel.model" Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel" />
</Relationships>`

  // Log for testing
  console.log('=== 3MF Model XML ===')
  console.log(modelXml)
  console.log('=== [Content_Types].xml ===')
  console.log(contentTypesXml)
  console.log('=== _rels/.rels ===')
  console.log(relsXml)
  console.log(`Materials: ${colorList.length}, Vertices: ${globalVertexOffset}, Triangles: ${allTriangles.length}`)

  // Clean up cloned geometries
  for (const geo of mergedGeometries.values()) {
    geo.dispose()
  }
}
