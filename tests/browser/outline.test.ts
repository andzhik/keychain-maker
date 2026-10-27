import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'
import { chromium, type Browser, type Page } from 'playwright'
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs'
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

async function exportAndCompare(page: Page, name: string) {
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
  copyFileSync(file, `test-output/issue-15/${name}.3mf`)
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
