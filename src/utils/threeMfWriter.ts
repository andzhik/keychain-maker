import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { zipSync, strToU8 } from 'fflate'
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

  // Build one <object> per color with independent vertex/triangle buffers
  const objectsXml: string[] = []
  const buildItems: string[] = []
  let objectId = 2 // id=1 is reserved for basematerials

  for (let ci = 0; ci < colorList.length; ci++) {
    const color = colorList[ci]
    const geo = mergedGeometries.get(color)
    if (!geo) continue

    const pos = geo.getAttribute('position') as THREE.BufferAttribute
    const vertexCount = pos.count
    const vertices: string[] = []
    const triangles: string[] = []

    // Vertices (indices start at 0 per object)
    for (let i = 0; i < vertexCount; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z = pos.getZ(i)
      vertices.push(`          <vertex x="${x.toFixed(4)}" y="${y.toFixed(4)}" z="${z.toFixed(4)}" />`)
    }

    // Triangles
    const index = geo.getIndex()
    if (index) {
      for (let i = 0; i < index.count; i += 3) {
        const v1 = index.getX(i)
        const v2 = index.getX(i + 1)
        const v3 = index.getX(i + 2)
        triangles.push(`          <triangle v1="${v1}" v2="${v2}" v3="${v3}" />`)
      }
    } else {
      for (let i = 0; i < vertexCount; i += 3) {
        triangles.push(`          <triangle v1="${i}" v2="${i + 1}" v3="${i + 2}" />`)
      }
    }

    objectsXml.push(`    <object id="${objectId}" type="model" pid="1" pindex="${ci}">
      <mesh>
        <vertices>
${vertices.join('\n')}
        </vertices>
        <triangles>
${triangles.join('\n')}
        </triangles>
      </mesh>
    </object>`)

    buildItems.push(`    <item objectid="${objectId}" />`)
    objectId++
  }

  // Build materials XML
  const materialsXml = colorList.map((color, i) => {
    const label = i === 0 ? `Base - ${color}` : `Color - ${color}`
    return `      <m:base name="${label}" displaycolor="${color}FF" />`
  }).join('\n')

  // Build model XML
  const modelXml = `<?xml version="1.0" encoding="UTF-8"?>
<model unit="millimeter" xml:lang="en-US"
  xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02"
  xmlns:m="http://schemas.microsoft.com/3dmanufacturing/material/2015/02">
  <resources>
    <m:basematerials id="1">
${materialsXml}
    </m:basematerials>
${objectsXml.join('\n')}
  </resources>
  <build>
${buildItems.join('\n')}
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

  // Package into 3MF ZIP
  const zipped = zipSync({
    '[Content_Types].xml': strToU8(contentTypesXml),
    '_rels/.rels': strToU8(relsXml),
    '3D/3dmodel.model': strToU8(modelXml),
  })
  const blob = new Blob([zipped], { type: 'application/vnd.ms-package.3dmanufacturing-3dmodel+xml' })

  // Trigger download
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'keychain.3mf'
  a.click()
  URL.revokeObjectURL(url)

  // Clean up cloned geometries
  for (const geo of mergedGeometries.values()) {
    geo.dispose()
  }
}
