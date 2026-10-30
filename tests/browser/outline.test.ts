import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'
import { chromium, type Browser, type Page } from 'playwright'
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import JSZip from 'jszip'
import { XMLParser } from 'fast-xml-parser'
import { waitForExportReady } from './exportReady.ts'
import { facePanel, showAdvanced } from './facePanel.ts'

let server: Awaited<ReturnType<typeof createServer>>, browser: Browser, url: string
before(async () => {
  server = await createServer({ base: '/', server: { port: 0 }, logLevel: 'error' })
  await server.listen()
  url = `http://localhost:${server.config.server.port}/`
  browser = await chromium.launch({ headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
  mkdirSync('test-output/issue-15', { recursive: true })
})
after(async () => { await browser?.close(); await server?.close() })

async function exportAndCompare(page: Page, name: string, directory = 'test-output/issue-15') {
  const preview = await page.evaluate(() => {
    const root = (document.querySelector('canvas')!.parentElement as any).__vueParentComponent.exposed.getCurrentGroup()
    const meshes: number[][][] = []
    root.traverse((node: any) => {
      if (!node.isMesh) return
      const { index, attributes: { position: p } } = node.geometry
      meshes.push(Array.from({ length: index?.count ?? p.count }, (_, i) => {
        const j = index ? index.getX(i) : i
        return [p.getX(j), p.getY(j), p.getZ(j)].map(v => +v.toFixed(5))
      }))
    })
    return meshes
  })
  const downloaded = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download .3mf', exact: true }).click()
  const file = (await (await downloaded).path())!
  const zip = await JSZip.loadAsync(readFileSync(file))
  const xml = await zip.file('3D/3dmodel.model')!.async('string')
  const model = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' }).parse(xml).model
  const exported = model.resources.object.filter((o: any) => o.mesh).map(({ mesh }: any) => {
    const vertices = mesh.vertices.vertex.map(({ x, y, z }: any) => [+x, +y, +z])
    return mesh.triangles.triangle.flatMap(({ v1, v2, v3 }: any) => [vertices[v1], vertices[v2], vertices[v3]])
  })
  assert.deepEqual(exported, preview, 'every exported triangle must match the preview')
  mkdirSync(directory, { recursive: true })
  copyFileSync(file, `${directory}/${name}.3mf`)
}
const input = (page: Page, field: string) => page.locator(`input[type=range][data-field=${field}]`)
const upload = (page: Page, svg: string) => page.locator('[aria-label="front image upload"] input[type=file]').setInputFiles({
  name: 'outline.svg', mimeType: 'image/svg+xml', buffer: Buffer.from(svg),
})
async function screenshot(page: Page, name: string) {
  await page.locator('.inspection-scroll').evaluate(el => { el.scrollTop = 0 })
  await page.waitForTimeout(150)
  await page.screenshot({ path: `test-output/issue-15/${name}.png` })
}

test('#15 geometric outline, zero/positive offsets, bevel/keyring, counters, refinements and reload agree with exports', async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  page.setDefaultTimeout(20000)
  const errors: string[] = []
  page.on('pageerror', e => errors.push(e.message))
  try {
    await page.goto(url)
    await page.getByRole('radio', { name: 'SVG outline', exact: true }).click()
    await page.getByText('SVG outline needs visible artwork.', { exact: false }).first().waitFor()
    assert.equal(await page.getByRole('button', { name: 'Download .3mf (base only)', exact: true }).isEnabled(), false)
    await page.locator('[aria-label="front image upload"] input[type=file]').setInputFiles('test-svg/outline-star.svg')
    await waitForExportReady(page)
    assert.equal(await input(page, 'outlineOffset').isVisible(), true, 'offset is a basic control')
    assert.equal(await input(page, 'padding').count(), 0)
    await exportAndCompare(page, 'star-2mm-keyring-bevel')
    await screenshot(page, 'star-2mm-keyring-bevel')

    await showAdvanced(page)
    await input(page, 'outlineOffset').fill('0')
    await input(page, 'edgeBevel').fill('0')
    await waitForExportReady(page)
    await exportAndCompare(page, 'star-zero-keyring-flat')
    await screenshot(page, 'star-zero-keyring-flat')
    await input(page, 'outlineOffset').fill('2')
    await input(page, 'edgeBevel').fill('0.6')
    await facePanel(page, 'Back').getByLabel('Image', { exact: true }).selectOption('empty')
    await page.getByRole('checkbox', { name: 'Keyring loop', exact: true }).uncheck()
    await waitForExportReady(page)
    await exportAndCompare(page, 'star-front-only')
    await page.reload()
    await waitForExportReady(page)
    assert.equal(await input(page, 'outlineOffset').inputValue(), '2')
    assert.equal(await page.getByRole('radio', { name: 'SVG outline', exact: true }).getAttribute('aria-checked'), 'true')

    // Independent asymmetric Back artwork expands the physical silhouette.
    await facePanel(page, 'Back').getByLabel('Image', { exact: true }).selectOption('artwork')
    await page.locator('[aria-label="back image upload"] input[type=file]').setInputFiles({
      name: 'back.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><path fill="#16a34a" d="M0 0H40V10H12V40H0Z"/></svg>'),
    })
    await waitForExportReady(page)
    await exportAndCompare(page, 'independent-faces')
    await screenshot(page, 'independent-faces')
    await facePanel(page, 'Back').getByRole('checkbox', { name: 'Mirror horizontally', exact: true }).check()
    await waitForExportReady(page)
    await exportAndCompare(page, 'independent-back-mirrored')

    // Hiding an outer color must change the plate, not only its inlay.
    const before = await page.locator('canvas').screenshot()
    await facePanel(page, 'Front').getByRole('button', { name: 'Remove #e85d50', exact: true }).click()
    await waitForExportReady(page)
    assert.notDeepEqual(await page.locator('canvas').screenshot(), before)
    await exportAndCompare(page, 'refined-silhouette')
    assert.deepEqual(errors, [])
  } finally { await page.close() }
})

test('#15 disconnected components block download and recover through offset or refinement', async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  page.setDefaultTimeout(20000)
  try {
    await page.goto(url)
    await page.getByRole('radio', { name: 'SVG outline', exact: true }).click()
    await page.getByRole('checkbox', { name: 'Keyring loop', exact: true }).uncheck()
    await upload(page, '<svg xmlns="http://www.w3.org/2000/svg"><rect fill="#e85d50" width="20" height="30"/><rect fill="#2563eb" x="30" width="20" height="30"/></svg>')
    await page.getByText(/SVG outline has 2 disconnected pieces/).first().waitFor()
    assert.equal(await page.getByRole('button', { name: 'Download .3mf', exact: true }).isEnabled(), false)
    await screenshot(page, 'disconnected-blocked')
    await input(page, 'outlineOffset').fill('6')
    await waitForExportReady(page)
    await exportAndCompare(page, 'disconnected-joined')
    await input(page, 'outlineOffset').fill('0')
    await page.getByText(/SVG outline has 2 disconnected pieces/).first().waitFor()
    await facePanel(page, 'Front').getByRole('button', { name: 'Remove #2563eb', exact: true }).click()
    await waitForExportReady(page)
    await exportAndCompare(page, 'disconnected-hidden')
    for (const width of [1024, 1280, 1920]) {
      await page.setViewportSize({ width, height: 900 })
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
    }
  } finally { await page.close() }
})

test('#38 keyring position follows the slider, survives mode changes/reload and exports the current closed loop', async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  page.setDefaultTimeout(20000)
  const directory = 'test-output/issue-38'
  mkdirSync(directory, { recursive: true })
  const errors: string[] = []
  page.on('pageerror', e => errors.push(e.message))
  const manifest: any[] = []
  const readGeometry = () => page.evaluate(async () => {
    const viewer = (document.querySelector('canvas')!.parentElement as any).__vueParentComponent
    const { config, artwork } = viewer.props
    const load = (path: string) => import(/* @vite-ignore */ path)
    const [{ fitFaces }, { createLogoCutouts }, { logoOutline }, { createOutlinePlate }, T] = await Promise.all([
      load('/src/utils/logoFit.ts'), load('/src/domain/logoCutouts.ts'), load('/src/utils/svgToShapes.ts'),
      load('/src/domain/outlinePlate.ts'), load('/node_modules/.vite/deps/three.js'),
    ])
    const fit = fitFaces(artwork.front.groups, artwork.back.groups, config)
    const cutouts = ['front', 'back'].flatMap(face => createLogoCutouts(
      logoOutline(artwork[face].groups).map((s: any) => s.extractPoints(16)), fit[face], artwork[face].mirror !== (face === 'back')))
    const plate = createOutlinePlate(cutouts, config)
    const hole = new T.Box2().setFromPoints(plate.holes[0].getPoints()).getCenter(new T.Vector2())
    const silhouette = createOutlinePlate(cutouts, { ...config, keyringEnabled: false }).getPoints()
    const clearance = Math.min(...silhouette.map((a: any, i: number) => {
      const b = silhouette[(i + 1) % silhouette.length]
      const edge = b.clone().sub(a)
      const t = Math.max(0, Math.min(1, hole.clone().sub(a).dot(edge) / (edge.lengthSq() || 1)))
      return hole.distanceTo(a.clone().addScaledVector(edge, t))
    })) - config.keyringHoleDiameter / 2
    const root = viewer.exposed.getCurrentGroup()
    const base = root.children[0]
    base.geometry.computeBoundingBox()
    const box = base.geometry.boundingBox
    const ray = new T.Raycaster(new T.Vector3(hole.x, hole.y, 100), new T.Vector3(0, 0, -1))
    const meshes: any[] = []
    root.traverse((node: any) => { if (node.isMesh) meshes.push(node) })
    // The model root has a display rotation; inspect the physical mesh coordinates.
    const holeHits = meshes.flatMap(mesh => ray.intersectObject(new T.Mesh(mesh.geometry, mesh.material))).length
    const angle = config.keyringAngle * Math.PI / 180
    const neckDistance = config.keyringHoleDiameter / 2 + 0.5
    return { hole: [hole.x, hole.y], radius: config.keyringHoleDiameter / 2, bevel: config.edgeBevel,
      neck: [hole.x - Math.sin(angle) * neckDistance, hole.y - Math.cos(angle) * neckDistance],
      boxCenter: [(box.min.x + box.max.x) / 2, (box.min.y + box.max.y) / 2], holeHits, clearance,
      inlays: root.children[1].children.map((mesh: any) => Array.from(mesh.geometry.attributes.position.array)),
    }
  })
  async function save(name: string) {
    await waitForExportReady(page)
    const { inlays, holeHits, ...geometry } = await readGeometry()
    assert.equal(holeHits, 0, 'the current model must leave the through-hole clear of both faces')
    await exportAndCompare(page, name, directory)
    manifest.push({ name, ...geometry })
  }
  try {
    await page.goto(url)
    assert.equal(await input(page, 'keyringAngle').count(), 0)
    await page.getByRole('radio', { name: 'SVG outline', exact: true }).click()
    await page.locator('[aria-label="front image upload"] input[type=file]').setInputFiles('test-svg/outline-star.svg')
    await waitForExportReady(page)
    assert.equal(await input(page, 'keyringAngle').isVisible(), true, 'position is a basic control')
    assert.equal(await input(page, 'keyringAngle').inputValue(), '0')
    const original = await readGeometry()
    for (const [angle, name] of [[90, 'star-right'], [180, 'star-bottom'], [270, 'star-left'], [37, 'star-37']] as const) {
      await input(page, 'keyringAngle').fill(String(angle))
      await waitForExportReady(page)
      const geometry = await readGeometry()
      assert.deepEqual(geometry.inlays, original.inlays, 'moving the keyring must leave both inlays fixed')
      assert.notDeepEqual(geometry.hole, original.hole)
      await save(name)
    }
    await page.getByRole('button', { name: 'Front view', exact: true }).click()
    await page.locator('.inspection-scroll').evaluate(el => { el.scrollTop = 0 })
    await page.screenshot({ path: `${directory}/keyring-37.png` })
    await input(page, 'keyringAngle').fill('360')
    await waitForExportReady(page)
    assert.deepEqual((await readGeometry()).hole, original.hole)

    await input(page, 'keyringAngle').fill('237')
    await page.getByRole('checkbox', { name: 'Keyring loop', exact: true }).uncheck()
    assert.equal(await input(page, 'keyringAngle').count(), 0)
    await page.getByRole('checkbox', { name: 'Keyring loop', exact: true }).check()
    assert.equal(await input(page, 'keyringAngle').inputValue(), '237')
    for (const shape of ['Rectangle', 'Circle']) {
      await page.getByRole('radio', { name: shape, exact: true }).click()
      assert.equal(await input(page, 'keyringAngle').count(), 0)
    }
    await page.getByRole('radio', { name: 'SVG outline', exact: true }).click()
    await page.reload()
    await waitForExportReady(page)
    assert.equal(await input(page, 'keyringAngle').inputValue(), '237')
    await showAdvanced(page)
    await facePanel(page, 'Back').getByLabel('Image', { exact: true }).selectOption('artwork')
    await page.locator('[aria-label="back image upload"] input[type=file]').setInputFiles('test-svg/name-tag.svg')
    await facePanel(page, 'Front').getByRole('checkbox', { name: 'Mirror horizontally', exact: true }).check()
    await facePanel(page, 'Back').getByRole('checkbox', { name: 'Mirror horizontally', exact: true }).check()
    await save('independent-mirrored-237')

    // Regressions: rotated tangent duplicates, and a hole collinear with an outer edge.
    await facePanel(page, 'Back').getByLabel('Image', { exact: true }).selectOption('same')
    await facePanel(page, 'Front').getByRole('checkbox', { name: 'Mirror horizontally', exact: true }).uncheck()
    await facePanel(page, 'Back').getByRole('checkbox', { name: 'Mirror horizontally', exact: true }).check()
    await upload(page, '<svg xmlns="http://www.w3.org/2000/svg"><path fill="#e85d50" d="M-10 10H10L4 -10Z"/></svg>')
    await showAdvanced(page)
    await input(page, 'targetWidth').fill('20')
    for (const [angle, offset, bevel, hole, loop] of [[90, 0, 0, 2, 4], [37, 1, 0.6, 8, 12]]) {
      for (const [field, value] of Object.entries({ keyringAngle: angle, outlineOffset: offset, edgeBevel: bevel,
        keyringHoleDiameter: hole, keyringRingDiameter: loop })) await input(page, field).fill(String(value))
      await save(`triangle-${angle}`)
    }
    // A rapid drag invalidates export until the existing debounce builds its final value.
    const pending = await page.evaluate(async () => {
      const slider = document.querySelector<HTMLInputElement>('input[type=range][data-field=keyringAngle]')!
      for (const angle of [60, 120, 180, 270]) { slider.value = String(angle); slider.dispatchEvent(new Event('input', { bubbles: true })) }
      await Promise.resolve()
      return (document.querySelector('canvas')!.parentElement as any).__vueParentComponent.exposed.getCurrentGroup() === null
    })
    assert.equal(pending, true)
    await waitForExportReady(page)
    assert.equal(await input(page, 'keyringAngle').inputValue(), '270')

    // Adjacent angles used to switch between distant outer tips of the s;
    // at 217 degrees, a distant support point also made an excessive neck.
    await page.locator('[aria-label="front image upload"] input[type=file]').setInputFiles('test-svg/smile-heart.svg')
    for (const [field, value] of Object.entries({ targetWidth: 50, outlineOffset: 2, edgeBevel: 0.6,
      keyringHoleDiameter: 5, keyringRingDiameter: 10 })) await input(page, field).fill(String(value))
    let previous: Awaited<ReturnType<typeof readGeometry>> | undefined
    let previousAngle = 0
    for (const angle of [216, 217, 218, 271, 272, 273]) {
      await input(page, 'keyringAngle').fill(String(angle))
      await waitForExportReady(page)
      const geometry = await readGeometry()
      if (previous && angle === previousAngle + 1) {
        assert.ok(Math.hypot(...geometry.hole.map((value: number, i: number) => value - previous!.hole[i])) < 1,
          `${angle - 1} to ${angle} degrees must move the hole smoothly`)
        assert.deepEqual(geometry.inlays, previous.inlays)
      }
      if (angle === 217) {
        // This mirrored-back setup has deeper scallops than the default two-face union.
        assert.ok(geometry.clearance >= 1 - 1e-5 && geometry.clearance < 1.5,
          `the loop must stay close to the outline while retaining 1 mm of clearance (${geometry.clearance.toFixed(3)} mm)`)
      }
      previous = geometry
      previousAngle = angle
      await save(`smile-${angle}`)
      await page.getByRole('button', { name: 'Front view', exact: true }).click()
      await page.locator('.inspection-scroll').evaluate(el => { el.scrollTop = 0 })
      await page.screenshot({ path: `${directory}/smile-${angle}.png` })
    }
    assert.deepEqual(errors, [])
    writeFileSync(`${directory}/manifest.json`, JSON.stringify(manifest, null, 2))
  } finally { await page.close() }
})
