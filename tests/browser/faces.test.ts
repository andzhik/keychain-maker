import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'
import { chromium, type Browser, type Page } from 'playwright'
import { readFileSync, mkdirSync, copyFileSync } from 'node:fs'
import JSZip from 'jszip'
import { XMLParser } from 'fast-xml-parser'

let server: Awaited<ReturnType<typeof createServer>>
let browser: Browser
let url: string
const fSvg = '<svg xmlns="http://www.w3.org/2000/svg"><path fill="red" d="M0 0H20V5H5V10H15V15H5V30H0Z"/></svg>'
const lSvg = '<svg xmlns="http://www.w3.org/2000/svg"><path fill="blue" d="M0 0H5V7H40V10H0Z"/></svg>'
before(async () => {
  server = await createServer({ base: '/', server: { port: 0 }, logLevel: 'error' })
  await server.listen()
  url = `http://localhost:${server.config.server.port}/`
  browser = await chromium.launch({ headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
  mkdirSync('test-output', { recursive: true })
})
after(async () => { await browser?.close(); await server?.close() })

const upload = (page: Page, face: 'front' | 'back', svg: string) =>
  page.locator(`[aria-label="${face} image upload"] input[type="file"]`).setInputFiles({
    name: `${face}.svg`, mimeType: 'image/svg+xml', buffer: Buffer.from(svg),
  })
const selectFace = (page: Page, face: 'Front' | 'Back') => page.getByRole('button', { name: face, exact: true }).click()
const ready = (page: Page) => page.getByText('Ready to export.', { exact: true }).waitFor()
const settings = (page: Page, face: string) => page.evaluate(face => JSON.parse(localStorage.getItem(`keychain-maker:${face}:v1`)!), face)

test('face selection preserves independent images and refinements through Empty, Same as Front and reload', async () => {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } })
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  try {
    await page.goto(url)
    await upload(page, 'front', fSvg)
    await ready(page)
    await page.getByRole('spinbutton', { name: 'Small bits', exact: true }).fill('0.5')
    await page.getByRole('spinbutton', { name: 'Small bits', exact: true }).press('Tab')
    await selectFace(page, 'Back')
    await page.getByLabel('Face artwork', { exact: true }).selectOption('artwork')
    await upload(page, 'back', lSvg)
    await page.getByRole('checkbox', { name: 'Mirror horizontally', exact: true }).uncheck()
    await page.getByRole('spinbutton', { name: 'Small bits', exact: true }).fill('0.8')
    await page.getByRole('spinbutton', { name: 'Small bits', exact: true }).press('Tab')
    await ready(page)
    const savedBack = await settings(page, 'back')
    await page.getByLabel('Face artwork', { exact: true }).selectOption('same')
    await page.getByLabel('Face artwork', { exact: true }).selectOption('artwork')
    assert.equal(await page.getByRole('spinbutton', { name: 'Small bits', exact: true }).inputValue(), '0.80')
    await page.getByLabel('Face artwork', { exact: true }).selectOption('empty')
    await ready(page)
    assert.equal(await page.locator('svg.logo-preview').count(), 0)
    await page.reload()
    await ready(page)
    await selectFace(page, 'Back')
    assert.equal(await page.getByLabel('Face artwork', { exact: true }).inputValue(), 'empty')
    await page.getByLabel('Face artwork', { exact: true }).selectOption('artwork')
    assert.deepEqual((await settings(page, 'back')).refinements, savedBack.refinements)
    assert.equal(await page.getByRole('checkbox', { name: 'Mirror horizontally', exact: true }).isChecked(), false)
    await selectFace(page, 'Front')
    assert.equal(await page.getByRole('spinbutton', { name: 'Small bits', exact: true }).inputValue(), '0.50')
    await page.getByRole('checkbox', { name: 'Mirror horizontally', exact: true }).check()
    await ready(page)
    assert.match((await page.locator('svg.logo-preview').getAttribute('aria-label'))!, /Front outside view.*mirrored/)
    assert.equal((await settings(page, 'back')).mirror, false)
    await page.screenshot({ path: 'test-output/faces-controls.png', fullPage: true })
    assert.deepEqual(errors, [])
  } finally { await page.close() }
})

test('a late read stays with its source across face switches; a failed back blocks export and survives reload', async () => {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } })
  try {
    await page.addInitScript(() => {
      const decode = window.createImageBitmap.bind(window)
      window.createImageBitmap = (async (file: File) => {
        if (file.name === 'slow.png') await new Promise<void>(resolve => { (window as any).__releaseDecode = resolve })
        return decode(file)
      }) as typeof createImageBitmap
    })
    await page.goto(url)
    await page.locator('[aria-label="front image upload"] input').setInputFiles({ name: 'slow.png', mimeType: 'image/png', buffer: readFileSync('test-images/logo-white.png') })
    await page.waitForFunction(() => typeof (window as any).__releaseDecode === 'function')
    await selectFace(page, 'Back')
    await page.getByLabel('Face artwork', { exact: true }).selectOption('artwork')
    await upload(page, 'back', lSvg)
    assert.equal(await page.getByRole('button', { name: 'Download .3mf', exact: true }).isDisabled(), true)
    await page.evaluate(() => (window as any).__releaseDecode())
    await ready(page)
    assert.equal(await page.evaluate(() => localStorage.getItem('keychain-maker:back:svg:v1')), lSvg)
    await page.locator('[aria-label="back image upload"] input').setInputFiles({ name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('broken') })
    await page.getByRole('alert').filter({ hasText: 'Could not read' }).waitFor()
    assert.equal(await page.getByRole('button', { name: 'Download .3mf', exact: true }).isDisabled(), true)
    assert.ok(await page.evaluate(() => localStorage.getItem('keychain-maker:front:svg:v1')))
    await page.reload()
    assert.equal(await page.getByRole('button', { name: 'Download .3mf', exact: true }).isDisabled(), true)
    await selectFace(page, 'Back')
    await page.getByRole('alert').filter({ hasText: 'previous artwork import failed' }).waitFor()
    await page.getByLabel('Face artwork', { exact: true }).selectOption('empty')
    await ready(page)
  } finally { await page.close() }
})

test('old saves restore same-image coordinates and allow correcting only Back', async () => {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } })
  try {
    await page.addInitScript(svg => localStorage.setItem('keychain-maker:svg:v1', svg), fSvg)
    await page.goto(url)
    await ready(page)
    assert.equal((await settings(page, 'front')).mirror, false)
    await selectFace(page, 'Back')
    assert.equal(await page.getByLabel('Face artwork', { exact: true }).inputValue(), 'same')
    assert.equal(await page.getByRole('checkbox', { name: 'Mirror horizontally', exact: true }).isChecked(), true)
    await page.getByRole('checkbox', { name: 'Mirror horizontally', exact: true }).uncheck()
    await ready(page)
    assert.equal((await settings(page, 'front')).mirror, false)
    await page.reload()
    await ready(page)
    assert.equal((await settings(page, 'back')).mirror, false)
  } finally { await page.close() }
})

test('different, front-only and back-only 3MF files preserve colors, outside orientation and current triangles', async () => {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } })
  try {
    await page.goto(url)
    await upload(page, 'front', fSvg)
    await selectFace(page, 'Back')
    await page.getByLabel('Face artwork', { exact: true }).selectOption('artwork')
    await upload(page, 'back', lSvg)
    await page.getByRole('checkbox', { name: 'Mirror horizontally', exact: true }).uncheck()
    for (const scenario of ['different', 'front-mirrored', 'back-mirrored', 'front-only', 'back-only']) {
      await selectFace(page, 'Front')
      await page.getByLabel('Face artwork', { exact: true }).selectOption(scenario === 'back-only' ? 'empty' : 'artwork')
      if (scenario !== 'back-only') await page.getByRole('checkbox', { name: 'Mirror horizontally', exact: true }).setChecked(scenario === 'front-mirrored')
      await selectFace(page, 'Back')
      await page.getByLabel('Face artwork', { exact: true }).selectOption(scenario === 'front-only' ? 'empty' : 'artwork')
      if (scenario !== 'front-only') await page.getByRole('checkbox', { name: 'Mirror horizontally', exact: true }).setChecked(scenario === 'back-mirrored')
      for (const [bevel, thickness] of [[0.6, 5], [0, 0.8], [0.3, 0.8]]) {
        for (const [label, value] of [['Bevel', bevel], ['Thickness', thickness]] as const) {
          const input = page.getByRole('spinbutton', { name: label, exact: true })
          await input.fill(String(value)); await input.press('Tab')
        }
        await ready(page)
        const preview = await page.evaluate(() => {
          const root = (document.querySelector('canvas')!.parentElement as any).__vueParentComponent.exposed.getCurrentGroup()
          const meshes: { color: string; vertices: number[][]; determinant: number }[] = []
          root.traverse((node: any) => {
            if (!node.isMesh) return
            const { index, attributes: { position: p } } = node.geometry
            const vertices = []
            for (let i = 0; i < (index?.count ?? p.count); i++) {
              const j = index ? index.getX(i) : i
              vertices.push([p.getX(j), p.getY(j), p.getZ(j)].map(v => +v.toFixed(5)))
            }
            meshes.push({ color: node.material.color.getHexString(), vertices, determinant: node.matrix.determinant() })
          })
          return meshes
        })
        const twoFaces = !['front-only', 'back-only'].includes(scenario)
        assert.equal(preview.length, twoFaces ? 3 : 2)
        assert.ok(preview.every(mesh => mesh.determinant > 0))
        assert.deepEqual(preview.slice(1).map(m => m.color), twoFaces ? ['ff0000', '0000ff']
          : scenario === 'front-only' ? ['ff0000'] : ['0000ff'])
        // The bottom of F's stem is on the left from Front; L's upright is on
        // physical +X, hence on the left when looking at Back from outside.
        for (const mesh of preview.slice(1)) {
          const xs = mesh.vertices.filter(v => mesh.color === 'ff0000' ? v[1] < -29 : v[1] > 4.9).map(v => v[0])
          assert.ok(xs.length)
          assert.ok(mesh.color === 'ff0000'
            ? scenario === 'front-mirrored' ? Math.min(...xs) >= 10 : Math.max(...xs) <= -10
            : scenario === 'back-mirrored' ? Math.max(...xs) <= -14.9 : Math.min(...xs) >= 14.9)
        }
        const downloaded = page.waitForEvent('download')
        await page.getByRole('button', { name: 'Download .3mf', exact: true }).click()
        const download = await downloaded
        const file = (await download.path())!
        const zip = await JSZip.loadAsync(readFileSync(file))
        const xml = await zip.file('3D/3dmodel.model')!.async('string')
        const model = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' }).parse(xml).model
        const exported = model.resources.object.filter((o: any) => o.mesh).map(({ mesh }: any) => {
          const vertices = mesh.vertices.vertex.map(({ x, y, z }: any) => [+x, +y, +z])
          return mesh.triangles.triangle.flatMap(({ v1, v2, v3 }: any) => [vertices[v1], vertices[v2], vertices[v3]])
        })
        assert.deepEqual(exported, preview.map(m => m.vertices))
        copyFileSync(file, `test-output/faces-${scenario}-${bevel}-${thickness}.3mf`)
      }
    }
    await selectFace(page, 'Back')
    await page.getByLabel('Face artwork', { exact: true }).selectOption('empty')
    await page.getByText('Ready to export the base only.', { exact: true }).waitFor()
    assert.equal(await page.getByRole('button', { name: 'Download .3mf (base only)', exact: true }).isEnabled(), true)
  } finally { await page.close() }
})
