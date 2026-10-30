import { expect, spyOn, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import ClipperLib from 'clipper-lib'
import * as THREE from 'three'
import { createOutlinePlate } from '../../src/domain/outlinePlate'
import { buildKeychainModel } from '../../src/domain/keychainModel'
import { buildBasePlate } from '../../src/utils/meshBuilder'
import { fitFaces } from '../../src/utils/logoFit'
import { createLogoCutouts } from '../../src/domain/logoCutouts'
import { logoOutline } from '../../src/utils/svgToShapes'
import { validateConfig } from '../../src/utils/configConstraints'
import { sanitizeConfig } from '../../src/utils/persistence'
import { disposeObject } from '../../src/three/sceneLifecycle'
import { DEFAULT_CONFIG, type ColorGroup, type KeychainConfig, type KeychainArtwork } from '../../src/types/keychain'
import { installDomParserForSvgLoader } from '../helpers/svgDom'
import { parseGroups } from '../helpers/parseGroups'
import { simplifyGroups } from '../../src/utils/simplify'

const shape = (points: number[][]) => new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x, y)))
const rect = (x: number, y: number, w: number, h: number) => shape([[x, y], [x + w, y], [x + w, y + h], [x, y + h]])
const concave = shape([[-20, -15], [20, -15], [20, 15], [8, 15], [8, 0], [-8, 0], [-8, 15], [-20, 15]])
const groups = (shapes: THREE.Shape[], color = '#ff0000'): ColorGroup[] => [{ id: color, color, shapes, pathCount: shapes.length }]
const cfg = (overrides: Partial<KeychainConfig> = {}): KeychainConfig => ({
  ...DEFAULT_CONFIG, basePlateShape: 'outline', keyringEnabled: false, ...overrides,
})
function hits(mesh: THREE.Mesh, x: number, y: number) {
  const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
  const ray = new THREE.Raycaster(new THREE.Vector3(x, y, 100), new THREE.Vector3(0, 0, -1))
  const zs = ray.intersectObject(new THREE.Mesh(mesh.geometry, material)).map(h => h.point.z).sort((a, b) => a - b)
  material.dispose()
  return zs.filter((z, i) => !i || Math.abs(z - zs[i - 1]) > 1e-5)
}
function volume(mesh: THREE.Mesh) {
  const p = mesh.geometry.attributes.position, index = mesh.geometry.index
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3()
  let result = 0
  for (let i = 0; i < (index?.count ?? p.count); i += 3) {
    a.fromBufferAttribute(p, index ? index.getX(i) : i)
    b.fromBufferAttribute(p, index ? index.getX(i + 1) : i + 1)
    c.fromBufferAttribute(p, index ? index.getX(i + 2) : i + 2)
    result += a.dot(b.cross(c)) / 6
  }
  return result
}
function distanceToOutline(point: THREE.Vector2, outline: THREE.Vector2[]) {
  return Math.min(...outline.map((a, i) => {
    const b = outline[(i + 1) % outline.length]
    const edge = b.clone().sub(a)
    const t = Math.max(0, Math.min(1, point.clone().sub(a).dot(edge) / (edge.lengthSq() || 1)))
    return point.distanceTo(a.clone().addScaledVector(edge, t))
  }))
}

test('a geometric offset preserves a deep concavity and moves straight edges by exactly 2 mm', () => {
  const plate = createOutlinePlate([concave], cfg())
  const mesh = buildBasePlate(cfg({ edgeBevel: 0 }), 40, 30, [], undefined, plate)
  try {
    expect(hits(mesh, 0, 8)).toHaveLength(0) // A hull/bounds/scaled copy would fill this notch.
    expect(hits(mesh, 0, 1.9)).toHaveLength(2)
    expect(hits(mesh, 0, 2.1)).toHaveLength(0)
    mesh.geometry.computeBoundingBox()
    expect(mesh.geometry.boundingBox!.min.x).toBeCloseTo(-22, 4)
    expect(mesh.geometry.boundingBox!.max.y).toBeCloseTo(17, 4)
  } finally { disposeObject(mesh) }
})

test('union ignores color boundaries, overlaps and SVG counters', () => {
  const ring = rect(-10, -10, 20, 20)
  ring.holes.push(new THREE.Path(rect(-5, -5, 10, 10).getPoints()))
  const plate = createOutlinePlate([ring, rect(5, -10, 10, 10)], cfg({ outlineOffset: 0 }))
  expect(plate.holes).toHaveLength(0)
  const base = buildBasePlate(cfg({ edgeBevel: 0 }), 30, 20, [], undefined, plate)
  try { expect(hits(base, 0, 0)).toHaveLength(2) } finally { disposeObject(base) }
})

test('disconnected or point-touching pieces block export until their offset connects them', () => {
  const parts = [rect(-10, -5, 5, 10), rect(5, -5, 5, 10)]
  expect(() => createOutlinePlate(parts, cfg({ outlineOffset: 0 }))).toThrow('2 disconnected pieces')
  expect(() => createOutlinePlate(parts, cfg({ outlineOffset: 5 }))).not.toThrow()
  expect(() => createOutlinePlate([rect(0, 0, 5, 5), rect(5, 5, 5, 5)], cfg({ outlineOffset: 0 }))).toThrow('disconnected')
  const result = buildKeychainModel(groups(parts), cfg({ outlineOffset: 0 }))
  expect(result.ok).toBe(false)
  if (!result.ok) expect(result.error.code).toBe('DISCONNECTED_OUTLINE')
  expect(buildKeychainModel([], cfg()).ok).toBe(false)
})

test('outline fitting sizes each face before offset, independent of padding; mirror changes the physical union', () => {
  const front = groups([concave])
  const back = groups([rect(0, 0, 20, 40)])
  const fit = fitFaces(front, back, cfg({ targetWidth: 40, padding: 19 }))
  expect([fit.front.scale, fit.back.scale, fit.height]).toEqual([1, 2, 80])
  const f = createLogoCutouts(logoOutline(front).map(s => s.extractPoints()), fit.front)
  const b = createLogoCutouts(logoOutline(back).map(s => s.extractPoints()), fit.back, true)
  const plate = createOutlinePlate([...f, ...b], cfg({ outlineOffset: 0 }))
  expect(new THREE.Box2().setFromPoints(plate.getPoints()).getSize(new THREE.Vector2()).y).toBeCloseTo(80, 3)
})

test('outline settings persist and invalid offsets are explained', () => {
  expect(sanitizeConfig(cfg({ outlineOffset: 0 }))).toEqual(cfg({ outlineOffset: 0 }))
  expect(sanitizeConfig({ basePlateShape: 'outline' }).outlineOffset).toBe(2)
  for (const outlineOffset of [-1, NaN, Infinity, 21]) expect(validateConfig(cfg({ outlineOffset })).valid).toBe(false)
  const constrained = validateConfig(cfg({ keyringEnabled: true, padding: 0, edgeBevel: 2, keyringHoleDiameter: 2 }))
  expect(constrained.valid).toBe(true)
  expect(constrained.config.padding).toBe(0)
  expect(constrained.config.edgeBevel).toBe(0.8)
})

for (const bevelSegments of [1, 8, 64]) {
  test(`bevel bands remain closed when a narrow notch disappears (${bevelSegments} segments)`, () => {
    const notched = shape([[-10, -10], [10, -10], [10, 10], [0.2, 10], [0.2, 0], [-0.2, 0], [-0.2, 10], [-10, 10]])
    const config = cfg({ edgeBevel: 1, outlineOffset: 0, bevelSegments })
    const base = buildBasePlate(config, 20, 20, [], undefined, createOutlinePlate([notched], config))
    try {
      // These sections must have exactly one solid interval, with symmetric
      // top/bottom bevels, including where a vertex-bevel would self-intersect.
      for (let x = -10.87; x < 11; x += 0.43) for (let y = -10.79; y < 11; y += 0.57) {
        const zs = hits(base, x, y)
        expect([0, 2]).toContain(zs.length)
        if (zs.length) expect(zs[0] + zs[1]).toBeCloseTo(3, 4)
      }
      expect(hits(base, 0, 5)).toHaveLength(2)
      expect(hits(base, 0, 5)[1]).toBeLessThan(4)
    } finally { disposeObject(base) }
  })
}

for (const edgeBevel of [0, 0.3]) {
  test(`zero-border through-inlays leave the counter backed on a thin plate (bevel ${edgeBevel})`, () => {
    const ring = rect(-10, -10, 20, 20)
    ring.holes.push(new THREE.Path(rect(-5, -5, 10, 10).getPoints()))
    const artwork = groups([ring])
    const config = cfg({ baseThickness: 0.8, logoDepth: 0.6, edgeBevel, outlineOffset: 0, targetWidth: 20 })
    const result = buildKeychainModel(artwork, config)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    const plain = buildBasePlate(config, 20, 20, [], undefined, createOutlinePlate([ring], config))
    try {
      const base = result.model.root.children[0] as THREE.Mesh
      const meshes = [base, ...result.model.logoGroup!.children] as THREE.Mesh[]
      expect(hits(base, 0, 0)).toHaveLength(2)
      expect(hits(base, 7, 0)).toHaveLength(0)
      // A flat plate keeps no sub-micron wall around the through-inlays: only the counter remains.
      base.geometry.computeBoundingBox()
      if (!edgeBevel) expect(base.geometry.boundingBox!.max.x).toBeCloseTo(5, 5)
      expect(meshes.reduce((sum, mesh) => sum + volume(mesh), 0)).toBeCloseTo(volume(plain), 3)
      expect(result.model.dimensions.depth).toBeCloseTo(0.8, 5)
    } finally { disposeObject(plain); disposeObject(result.model.root) }
  })
}

for (const edgeBevel of [0, 0.6, 2]) for (const outlineOffset of [0, 2, 9]) for (const keyringEnabled of [false, true]) {
  test(`outline mesh partitions the solid plate: bevel ${edgeBevel}, offset ${outlineOffset}, keyring ${keyringEnabled}`, () => {
    const front = groups([concave])
    const back = groups([rect(-20, -15, 12, 30)], '#0000ff')
    const config = cfg({ edgeBevel, outlineOffset, keyringEnabled, targetWidth: 40 })
    const artwork: KeychainArtwork = { front: { groups: front, mirror: false }, back: { groups: back, mirror: false } }
    const fit = fitFaces(front, back, config)
    const outlines = (['front', 'back'] as const).flatMap(face =>
      createLogoCutouts(logoOutline(artwork[face].groups).map(s => s.extractPoints()), fit[face], face === 'back'))
    const plain = buildBasePlate(config, 40, fit.height, [], undefined, createOutlinePlate(outlines, config))
    const result = buildKeychainModel(artwork, config)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    try {
      const meshes = [result.model.root.children[0], ...result.model.logoGroup!.children] as THREE.Mesh[]
      expect(volume(plain)).toBeGreaterThan(0)
      expect(meshes.reduce((sum, mesh) => sum + volume(mesh), 0)).toBeCloseTo(volume(plain), 2)
      for (let x = -24.31; x < 26; x += 5.13) for (let y = -55.27; y < 57; y += 7.31) {
        const expected = hits(plain, x, y)
        const intervals: number[][] = []
        for (const mesh of meshes) {
          const zs = hits(mesh, x, y)
          expect(zs.length % 2).toBe(0)
          for (let i = 0; i < zs.length; i += 2) intervals.push([zs[i], zs[i + 1]])
        }
        intervals.sort((a, b) => a[0] - b[0])
        if (!expected.length) { expect(intervals).toHaveLength(0); continue }
        expect(intervals[0][0]).toBeCloseTo(expected[0], 4)
        for (let i = 1; i < intervals.length; i++) expect(intervals[i][0]).toBeCloseTo(intervals[i - 1][1], 4)
        expect(intervals.at(-1)![1]).toBeCloseTo(expected.at(-1)!, 4)
      }
    } finally { disposeObject(plain); disposeObject(result.model.root) }
  })
}

// Every edge of a closed, consistently oriented mesh is used once in each direction.
function openEdges(mesh: THREE.Mesh) {
  const p = mesh.geometry.attributes.position
  const key = (i: number) => [p.getX(i), p.getY(i), p.getZ(i)].map(v => (Math.round(v * 1e5) / 1e5 || 0).toFixed(5)).join(',')
  const edges = new Map<string, number>()
  for (let i = 0; i < p.count; i += 3) for (let j = 0; j < 3; j++) {
    const a = key(i + j), b = key(i + (j + 1) % 3)
    if (a === b) continue
    edges.set(`${a}|${b}`, (edges.get(`${a}|${b}`) ?? 0) + 1)
  }
  return [...edges].filter(([edge, count]) => {
    const [a, b] = edge.split('|')
    return count !== 1 || edges.get(`${b}|${a}`) !== 1
  }).length
}
const bite = (() => {
  const points = [[-10, -10], [10, -10], [10, 10]]
  for (let i = 0; i <= 32; i++) points.push([5 * Math.cos(i / 32 * Math.PI), 10 - 5 * Math.sin(i / 32 * Math.PI)])
  return shape([...points, [-10, 10]])
})()

for (const edgeBevel of [0, 0.5]) for (const keyringEnabled of [false, true]) {
  test(`outline plates are closed meshes that keep every corner (bevel ${edgeBevel}, keyring ${keyringEnabled})`, () => {
    for (const artwork of [rect(-5, -5, 10, 10), concave, bite]) {
      const config = cfg({ edgeBevel, keyringEnabled, outlineOffset: 0, bevelSegments: 4 })
      const mesh = buildBasePlate(config, 40, 30, [], undefined, createOutlinePlate([artwork], config))
      try {
        expect(openEdges(mesh)).toBe(0)
        if (!keyringEnabled && artwork !== bite) {
          // The ring's last vertex was the one dropped; exact areas catch any other.
          const area = artwork === concave ? 40 * 30 - 16 * 15 : 100
          const [x, y] = artwork === concave ? [-19.9, 14.9] : [-4.9, 4.9]
          expect(hits(mesh, x, y)).toHaveLength(2)
          if (!edgeBevel) expect(volume(mesh)).toBeCloseTo(area * config.baseThickness, 3)
        }
      } finally { disposeObject(mesh) }
    }
  })
}

test('concave curves do not subdivide the bevel bands', () => {
  for (const bevelSegments of [1, 4]) {
    const config = cfg({ edgeBevel: 0.5, outlineOffset: 0, bevelSegments })
    const mesh = buildBasePlate(config, 20, 20, [], undefined, createOutlinePlate([bite], config))
    try {
      // About two triangles per section vertex and band; the old notch test
      // split every band down to 0.01 mm here (7,694 triangles at one segment).
      expect(mesh.geometry.attributes.position.count / 3).toBeLessThan(600 * bevelSegments)
    } finally { disposeObject(mesh) }
  }
})

test('a detailed outline keeps polygon offset work within the bevel section budget', () => {
  installDomParserForSvgLoader()
  const config = cfg({ keyringEnabled: true })
  const parsed = parseGroups(readFileSync(new URL('../../test-svg/smile-heart.svg', import.meta.url), 'utf8'))
  const groups = simplifyGroups(parsed, 0.02 / fitFaces(parsed, parsed, config).front.scale).groups
  const fit = fitFaces(groups, groups, config)
  const outlines = [false, true].flatMap(mirror =>
    createLogoCutouts(logoOutline(groups).map(s => s.extractPoints(16)), fit.front, mirror))
  const plate = createOutlinePlate(outlines, config)
  // Count expensive polygon offsets rather than wall time, so the regression
  // signal is stable across machines. This input needs extra notch sections.
  const execute = spyOn(ClipperLib.ClipperOffset.prototype, 'Execute')
  try {
    const mesh = buildBasePlate(config, fit.width, fit.height, [], undefined, plate)
    try {
      expect(execute.mock.calls.length).toBeLessThanOrEqual(14)
      expect(openEdges(mesh)).toBe(0)
    } finally { disposeObject(mesh) }
  } finally { execute.mockRestore() }
})

test('the keyring centres above flat edges and asymmetric sharp tips', () => {
  const config = cfg({ keyringEnabled: true, outlineOffset: 2, edgeBevel: 0 })
  const hole = (plate: THREE.Shape) => new THREE.Box2().setFromPoints(plate.holes[0].getPoints())
  const flat = hole(createOutlinePlate([rect(-20, -10, 40, 20)], config))
  expect(flat.getCenter(new THREE.Vector2()).x).toBeCloseTo(0, 4)
  expect(flat.min.y).toBeCloseTo(12 + 1, 4)
  const triangle = shape([[-10, -10], [10, -10], [4, 10]])
  const tip = hole(createOutlinePlate([triangle], { ...config, outlineOffset: 0 }))
  expect(tip.getCenter(new THREE.Vector2()).x).toBeCloseTo(0, 4)
  expect(distanceToOutline(tip.getCenter(new THREE.Vector2()), triangle.getPoints()) - config.keyringHoleDiameter / 2).toBeCloseTo(1, 4)
  expect(tip.min.y).toBeLessThan(10 + 1)
})

test('cardinal keyring positions follow Front clockwise and 360 is exactly the same as 0', () => {
  const artwork = rect(-20, -10, 40, 20)
  const config = cfg({ keyringEnabled: true, outlineOffset: 2, edgeBevel: 0 })
  for (const [keyringAngle, x, y] of [[0, 0, 15.5], [90, 25.5, 0], [180, 0, -15.5], [270, -25.5, 0], [360, 0, 15.5]]) {
    const plate = createOutlinePlate([artwork], { ...config, keyringAngle })
    expect(plate.holes).toHaveLength(1)
    const center = new THREE.Box2().setFromPoints(plate.holes[0].getPoints()).getCenter(new THREE.Vector2())
    expect(center.x).toBeCloseTo(x, 5)
    expect(center.y).toBeCloseTo(y, 5)
  }
  expect(createOutlinePlate([artwork], { ...config, keyringAngle: 360 }).getPoints())
    .toEqual(createOutlinePlate([artwork], config).getPoints())
})

test('one-degree keyring changes stay smooth across the smile wordmark tips', () => {
  installDomParserForSvgLoader()
  const config = cfg({ keyringEnabled: true })
  const artwork = parseGroups(readFileSync(new URL('../../test-svg/smile-heart.svg', import.meta.url), 'utf8'))
  const fit = fitFaces(artwork, artwork, config)
  const outlines = createLogoCutouts(logoOutline(artwork).map(s => s.extractPoints()), fit.front)
  let previous: THREE.Vector2 | undefined
  for (const keyringAngle of [270, 271, 272, 273, 274]) {
    const plate = createOutlinePlate(outlines, { ...config, keyringAngle })
    const center = new THREE.Box2().setFromPoints(plate.holes[0].getPoints()).getCenter(new THREE.Vector2())
    if (previous) expect(center.distanceTo(previous)).toBeLessThan(1)
    previous = center
  }
})

test('the smile keyring at 217 degrees stays close to the outline with its full hole open', () => {
  installDomParserForSvgLoader()
  const config = cfg({ keyringEnabled: true, keyringAngle: 217 })
  const parsed = parseGroups(readFileSync(new URL('../../test-svg/smile-heart.svg', import.meta.url), 'utf8'))
  const artwork = simplifyGroups(parsed, 0.02 / fitFaces(parsed, parsed, config).front.scale).groups
  const fit = fitFaces(artwork, artwork, config)
  const outlines = [false, true].flatMap(mirror =>
    createLogoCutouts(logoOutline(artwork).map(s => s.extractPoints(16)), fit.front, mirror))
  const plate = createOutlinePlate(outlines, config)
  const center = new THREE.Box2().setFromPoints(plate.holes[0].getPoints()).getCenter(new THREE.Vector2())
  const silhouette = createOutlinePlate(outlines, { ...config, keyringEnabled: false }).getPoints()
  const clearance = distanceToOutline(center, silhouette) - config.keyringHoleDiameter / 2
  expect(clearance).toBeGreaterThanOrEqual(1 - 1e-5)
  // The continuous convex envelope bridges the wordmark's shallow scallops.
  // Previously a distant tip pushed this gap to 8.34 mm.
  expect(clearance).toBeLessThan(1.2)
  const result = buildKeychainModel({ front: { groups: artwork, mirror: false }, back: { groups: artwork, mirror: false } }, config)
  expect(result.ok).toBe(true)
  if (!result.ok) return
  try {
    const base = result.model.root.children[0] as THREE.Mesh
    for (let angle = 0; angle < 360; angle += 15) {
      const radius = config.keyringHoleDiameter / 2 - config.edgeBevel - 0.05
      const x = center.x + Math.cos(angle * Math.PI / 180) * radius
      const y = center.y + Math.sin(angle * Math.PI / 180) * radius
      expect(hits(base, x, y)).toHaveLength(0)
    }
  } finally { disposeObject(result.model.root) }
})

test('keyring holes follow the selected radial line across flat edges and asymmetric tips', () => {
  for (const artwork of [rect(-20, -10, 40, 20), concave, shape([[-10, -10], [10, -10], [4, 10]])]) {
    const config = cfg({ keyringEnabled: true, outlineOffset: 0, edgeBevel: 0 })
    let previous: THREE.Vector2 | undefined
    for (let keyringAngle = 0; keyringAngle <= 360; keyringAngle++) {
      const plate = createOutlinePlate([artwork], { ...config, keyringAngle })
      const center = new THREE.Box2().setFromPoints(plate.holes[0].getPoints()).getCenter(new THREE.Vector2())
      const angle = keyringAngle * Math.PI / 180
      expect(center.x * Math.cos(angle) - center.y * Math.sin(angle)).toBeCloseTo(0, 5)
      if (previous) expect(center.distanceTo(previous)).toBeLessThan(1)
      previous = center
    }
  }
})

test('a radial neck across a concavity leaves one clear hole and a closed reinforced plate', () => {
  for (const edgeBevel of [0, 0.6]) {
    const config = cfg({ keyringEnabled: true, keyringAngle: 11, outlineOffset: 0, edgeBevel })
    const plate = createOutlinePlate([concave], config)
    expect(plate.holes).toHaveLength(1)
    const center = new THREE.Box2().setFromPoints(plate.holes[0].getPoints()).getCenter(new THREE.Vector2())
    const base = buildBasePlate(config, 40, 30, [], undefined, plate)
    try {
      expect(openEdges(base)).toBe(0)
      expect(volume(base)).toBeGreaterThan(0)
      expect(hits(base, center.x, center.y)).toHaveLength(0)
      const angle = config.keyringAngle * Math.PI / 180
      const neck = center.clone().addScaledVector(new THREE.Vector2(Math.sin(angle), Math.cos(angle)), -3)
      expect(hits(base, neck.x, neck.y)).toHaveLength(2)
    } finally { disposeObject(base) }
  }
})

test('angled loops stay closed, attached and clear of concave/asymmetric artwork as offset and size change', () => {
  const triangle = shape([[-10, -10], [10, -10], [4, 10]])
  for (const artwork of [concave, triangle]) for (const keyringAngle of [0, 37, 90, 143, 180, 237, 270, 319]) {
    const config = validateConfig(cfg({ keyringEnabled: true, keyringAngle,
      outlineOffset: keyringAngle % 3, edgeBevel: keyringAngle % 2 ? 0.6 : 0,
      keyringHoleDiameter: keyringAngle % 2 ? 8 : 2, keyringRingDiameter: keyringAngle % 2 ? 12 : 4 })).config
    const silhouette = createOutlinePlate([artwork], { ...config, keyringEnabled: false })
    const plate = createOutlinePlate([artwork], config)
    const center = new THREE.Box2().setFromPoints(plate.holes[0].getPoints()).getCenter(new THREE.Vector2())
    const direction = new THREE.Vector2(Math.sin(keyringAngle * Math.PI / 180), Math.cos(keyringAngle * Math.PI / 180))
    expect(distanceToOutline(center, silhouette.getPoints()) - config.keyringHoleDiameter / 2).toBeGreaterThanOrEqual(1 - 1e-5)
    const base = buildBasePlate(config, 40, 30, [], undefined, plate)
    try {
      expect(openEdges(base)).toBe(0)
      expect(volume(base)).toBeGreaterThan(0)
      expect(hits(base, center.x, center.y)).toHaveLength(0)
      // Just inward of the hole, the reinforced neck must span the thickness.
      const neck = center.clone().addScaledVector(direction, -config.keyringHoleDiameter / 2 - 0.5)
      expect(hits(base, neck.x, neck.y)).toHaveLength(2)
    } finally { disposeObject(base) }
  }
})

test('keyring angles leave independent mirrored inlays fixed and invalid angles block the current build', () => {
  const front = groups([concave])
  const back = groups([rect(-15, -5, 30, 10)], '#0000ff')
  const artwork: KeychainArtwork = { front: { groups: front, mirror: true }, back: { groups: back, mirror: false } }
  let reference: number[][] | undefined
  for (const keyringAngle of [0, 37, 90, 180, 270, 360]) {
    const result = buildKeychainModel(artwork, cfg({ keyringEnabled: true, keyringAngle, targetWidth: 40 }))
    expect(result.ok).toBe(true)
    if (!result.ok) continue
    try {
      const positions = result.model.logoGroup!.children.map(mesh => Array.from((mesh as THREE.Mesh).geometry.attributes.position.array))
      if (!reference) reference = positions
      else expect(positions).toEqual(reference)
    } finally { disposeObject(result.model.root) }
  }
  expect(buildKeychainModel(artwork, cfg({ keyringEnabled: true, keyringAngle: -1 })).ok).toBe(false)
})

test('degenerate artwork pieces are ignored or reported, never thrown as TypeErrors', () => {
  const sliver = shape([[0, 0], [1, 1]])
  expect(createOutlinePlate([sliver, rect(-5, -5, 10, 10)], cfg()).getPoints().length).toBeGreaterThan(3)
  expect(() => createOutlinePlate([sliver], cfg())).toThrow('needs visible artwork')
})

test('every keyring plate caps the chamfer to keep its hole open', () => {
  for (const basePlateShape of ['square', 'circle', 'outline'] as const) {
    const { config } = validateConfig(cfg({ basePlateShape, keyringEnabled: true, edgeBevel: 2, keyringHoleDiameter: 2 }))
    expect(config.edgeBevel).toBe(0.8)
  }
})
