import { facePanel, showAdvanced } from './facePanel.ts'
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
const ready = (page: Page) => page.getByText('Ready to export.', { exact: true }).waitFor()
const settings = (page: Page, face: string) => page.evaluate(face => JSON.parse(localStorage.getItem(`keychain-maker:${face}:v1`)!), face)

for (const face of ['front', 'back'] as const) {
  test(`#16 ${face} artwork remains visible after a metadata quota failure and reload`, async () => {
    const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    try {
      await page.goto(url)
      await upload(page, 'front', fSvg)
      await facePanel(page, 'Back').getByLabel('Image', { exact: true }).selectOption('artwork')
      await upload(page, 'back', lSvg)
      await ready(page)
      await page.addInitScript(face => {
        const setItem = Storage.prototype.setItem
        Storage.prototype.setItem = function (key, value) {
          if (key === `keychain-maker:${face}:v1`) throw new DOMException('Storage full', 'QuotaExceededError')
          setItem.call(this, key, value)
        }
      }, face)

      // Startup saves the SVG successfully, then loses its metadata. The next
      // reload must still restore both independent images and allow export.
      await page.reload()
      await ready(page)
      assert.equal(await page.evaluate(face => localStorage.getItem(`keychain-maker:${face}:v1`), face), null)
      await page.reload()
      await ready(page)
      for (const [name, svg, color] of [['Front', fSvg, '#ff0000'], ['Back', lSvg, '#0000ff']] as const) {
        const panel = facePanel(page, name)
        assert.equal(await panel.getByLabel('Image', { exact: true }).inputValue(), 'artwork')
        await panel.locator(`svg.logo-preview path[fill="${color}"]`).waitFor()
        assert.equal(await page.evaluate(face => localStorage.getItem(`keychain-maker:${face}:svg:v1`), name.toLowerCase()), svg)
      }
      assert.equal(await page.getByRole('button', { name: 'Download .3mf', exact: true }).isEnabled(), true)
      assert.equal(await page.getByRole('alert').count(), 0)
      assert.deepEqual(errors, [])
    } finally { await page.close() }
  })
}

test('#34 matching face colors updates previews, saved edits, filament count and actual exports', async () => {
  const page = await browser.newPage({ viewport: { width: 1024, height: 900 } })
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  const frontSvg = fSvg.replace('</svg>', '<rect fill="blue" x="10" y="20" width="5" height="5"/></svg>')
  const backSvg = lSvg.replace('blue', '#fe0000').replace('</svg>', '<rect fill="lime" x="10" y="0" width="5" height="4"/></svg>')
  const preview = () => page.evaluate(() => {
    const root = (document.querySelector('canvas')!.parentElement as any).__vueParentComponent.exposed.getCurrentGroup()
    const meshes: { name: string; color: string; vertices: number[] }[] = []
    root.traverse((node: any) => {
      if (node.isMesh) meshes.push({ name: node.name, color: node.material.color.getHexString(),
        vertices: Array.from(node.geometry.attributes.position.array) })
    })
    return meshes
  })
  async function downloadColors(name: string) {
    const downloaded = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Download .3mf', exact: true }).click()
    const file = (await (await downloaded).path())!
    const zip = await JSZip.loadAsync(readFileSync(file))
    const exported = JSON.parse(await zip.file('Metadata/project_settings.config')!.async('string'))
    copyFileSync(file, `test-output/${name}.3mf`)
    return exported.filament_colour.map((color: string) => color.toLowerCase()).sort()
  }
  try {
    await page.goto(url)
    await showAdvanced(page)
    const front = facePanel(page, 'Front')
    const back = facePanel(page, 'Back')
    await upload(page, 'front', frontSvg)
    await back.getByLabel('Image', { exact: true }).selectOption('artwork')
    await upload(page, 'back', backSvg)
    await ready(page)
    await page.getByText('Filaments: 5', { exact: false }).waitFor()
    assert.equal(await page.getByText('More than 4 filaments:', { exact: false }).count(), 1)
    const savedFront = await settings(page, 'front')
    const savedBack = await settings(page, 'back')
    const originalPreview = await preview()
    assert.deepEqual(await downloadColors('colors-before-match'), ['#0000ff', '#00ff00', '#fe0000', '#ff0000', '#ffffff'])
    const match = back.getByRole('combobox', { name: 'Match #fe0000 to Front', exact: true })
    assert.deepEqual(await match.locator('option:not([disabled])').evaluateAll(options => options.map(o => (o as HTMLOptionElement).value)),
      ['#ff0000', '#0000ff'], 'closest shade comes first')
    await match.selectOption('#ff0000')
    await ready(page)
    await page.getByText('Filaments: 4', { exact: false }).waitFor()
    assert.equal(await page.getByText('More than 4 filaments:', { exact: false }).count(), 0)
    assert.deepEqual(await settings(page, 'front'), savedFront)
    assert.deepEqual(await settings(page, 'back'), { ...savedBack,
      refinements: { ...savedBack.refinements, recolor: { '#fe0000': '#ff0000' } } })
    for (const panel of [front, back]) {
      await panel.locator('svg.logo-preview path[fill="#ff0000"]').waitFor()
      assert.equal(await panel.evaluate(el => el.scrollWidth <= el.clientWidth), true)
    }
    assert.equal(await back.getByLabel('Print color for #00ff00', { exact: true }).inputValue(), '#00ff00')
    const matchedPreview = await preview()
    assert.deepEqual(matchedPreview.map(({ color, ...mesh }) => mesh), originalPreview.map(({ color, ...mesh }) => mesh))
    assert.deepEqual(matchedPreview.filter(mesh => mesh.name === 'back inlay').map(mesh => mesh.color).sort(), ['00ff00', 'ff0000'])
    assert.deepEqual(await downloadColors('colors-after-match'), ['#0000ff', '#00ff00', '#ff0000', '#ffffff'])
    await page.screenshot({ path: 'test-output/colors-matched-1024.png' })
    await page.reload()
    await ready(page)
    await back.getByLabel('Print color for #ff0000', { exact: true }).waitFor()
    assert.equal(await back.getByRole('combobox', { name: 'Match #ff0000 to Front', exact: true }).locator('option').first().textContent(), 'Shared with Front')
    await back.getByRole('button', { name: 'Restore original color', exact: true }).click()
    await ready(page)
    await page.getByText('Filaments: 5', { exact: false }).waitFor()
    await front.getByRole('combobox', { name: 'Match #ff0000 to Back', exact: true }).selectOption('#fe0000')
    await ready(page)
    await page.getByText('Filaments: 4', { exact: false }).waitFor()
    assert.deepEqual(await settings(page, 'back'), savedBack, 'matching Front leaves Back intact')
    for (const mode of ['empty', 'same']) {
      await back.getByLabel('Image', { exact: true }).selectOption(mode)
      await ready(page)
      assert.equal(await front.getByRole('combobox', { name: /^Match #/ }).count(), 0)
      assert.equal(await back.getByRole('combobox', { name: /^Match #/ }).count(), 0)
    }
    await back.getByLabel('Image', { exact: true }).selectOption('artwork')
    await ready(page)
    await upload(page, 'front', frontSvg)
    await ready(page)
    assert.deepEqual((await settings(page, 'front')).refinements.recolor, {}, 'replacement artwork clears matching edits')
    assert.deepEqual(errors, [])
  } finally { await page.close() }
})

test('#34 matching a merged row recolors and restores every source, using current target colors', async () => {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } })
  try {
    await page.goto(url)
    await showAdvanced(page)
    const front = facePanel(page, 'Front')
    const back = facePanel(page, 'Back')
    await upload(page, 'front', fSvg)
    await back.getByLabel('Image', { exact: true }).selectOption('artwork')
    await upload(page, 'back', lSvg.replace('blue', '#fe0000').replace('</svg>', '<rect fill="#fd0000" x="10" y="0" width="5" height="4"/></svg>'))
    await back.getByRole('slider', { name: 'Merge similar', exact: true }).fill('2')
    await ready(page)
    await back.getByRole('combobox', { name: 'Match #fe0000 to Front', exact: true }).selectOption('#ff0000')
    await ready(page)
    assert.deepEqual((await settings(page, 'back')).refinements.recolor, { '#fe0000': '#ff0000', '#fd0000': '#ff0000' })
    await front.getByLabel('Print color for #ff0000', { exact: true }).fill('#ffaa00')
    await ready(page)
    assert.equal(await back.getByLabel('Print color for #ff0000', { exact: true }).inputValue(), '#ff0000', 'later edits remain independent')
    const match = back.getByRole('combobox', { name: 'Match #ff0000 to Front', exact: true })
    assert.deepEqual(await match.locator('option:not([disabled])').evaluateAll(options => options.map(o => (o as HTMLOptionElement).value)), ['#ffaa00'])
    await match.selectOption('#ffaa00')
    await ready(page)
    assert.deepEqual((await settings(page, 'back')).refinements.recolor, { '#fe0000': '#ffaa00', '#fd0000': '#ffaa00' })
    await back.getByRole('button', { name: 'Restore original color', exact: true }).click()
    await ready(page)
    assert.deepEqual((await settings(page, 'back')).refinements.recolor, {})
    assert.equal((await settings(page, 'back')).refinements.mergeTolerance, 2)
    await front.getByRole('button', { name: 'Remove #ffaa00', exact: true }).click()
    assert.equal(await back.getByRole('combobox', { name: /^Match #/ }).count(), 0, 'removed colors cannot be matched')
  } finally { await page.close() }
})

test('side-by-side editors preserve independent images and refinements through Empty, Same as Front and reload', async () => {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } })
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  try {
    await page.goto(url)
    await showAdvanced(page)
    await upload(page, 'front', fSvg)
    await ready(page)
    await facePanel(page, 'Front').getByRole('spinbutton', { name: 'Remove specks', exact: true }).fill('0.5')
    await facePanel(page, 'Front').getByRole('spinbutton', { name: 'Remove specks', exact: true }).press('Tab')
    await facePanel(page, 'Back').getByLabel('Image', { exact: true }).selectOption('artwork')
    await upload(page, 'back', lSvg)
    await facePanel(page, 'Back').getByRole('checkbox', { name: 'Mirror horizontally', exact: true }).uncheck()
    await facePanel(page, 'Back').getByRole('spinbutton', { name: 'Remove specks', exact: true }).fill('0.8')
    await facePanel(page, 'Back').getByRole('spinbutton', { name: 'Remove specks', exact: true }).press('Tab')
    await ready(page)
    const savedBack = await settings(page, 'back')
    await facePanel(page, 'Back').getByLabel('Image', { exact: true }).selectOption('same')
    await facePanel(page, 'Back').getByLabel('Image', { exact: true }).selectOption('artwork')
    assert.equal(await facePanel(page, 'Back').getByRole('spinbutton', { name: 'Remove specks', exact: true }).inputValue(), '0.80')
    await facePanel(page, 'Back').getByLabel('Image', { exact: true }).selectOption('empty')
    await ready(page)
    assert.equal(await facePanel(page, 'Back').locator('svg.logo-preview').count(), 0)
    await page.reload()
    await ready(page)
    assert.equal(await facePanel(page, 'Back').getByLabel('Image', { exact: true }).inputValue(), 'empty')
    await facePanel(page, 'Back').getByLabel('Image', { exact: true }).selectOption('artwork')
    assert.deepEqual((await settings(page, 'back')).refinements, savedBack.refinements)
    assert.equal(await facePanel(page, 'Back').getByRole('checkbox', { name: 'Mirror horizontally', exact: true }).isChecked(), false)
    assert.equal(await facePanel(page, 'Front').getByRole('spinbutton', { name: 'Remove specks', exact: true }).inputValue(), '0.50')
    await facePanel(page, 'Front').getByRole('checkbox', { name: 'Mirror horizontally', exact: true }).check()
    await ready(page)
    assert.match((await facePanel(page, 'Front').locator('svg.logo-preview').getAttribute('aria-label'))!, /Front outside view.*mirrored/)
    assert.equal((await settings(page, 'back')).mirror, false)
    await page.screenshot({ path: 'test-output/faces-controls.png', fullPage: true })
    assert.deepEqual(errors, [])
  } finally { await page.close() }
})

test('a late read stays with its source while editing the other face; a failed back blocks export and survives reload', async () => {
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
    await facePanel(page, 'Back').getByLabel('Image', { exact: true }).selectOption('artwork')
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
    await page.getByRole('alert').filter({ hasText: 'previous artwork import failed' }).waitFor()
    await facePanel(page, 'Back').getByLabel('Image', { exact: true }).selectOption('empty')
    await ready(page)
  } finally { await page.close() }
})

test('old saves restore same-image coordinates and allow correcting only Back', async () => {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } })
  try {
    await page.addInitScript(svg => localStorage.setItem('keychain-maker:svg:v1', svg), fSvg)
    await page.goto(url)
    await showAdvanced(page)
    await ready(page)
    assert.equal((await settings(page, 'front')).mirror, false)
    assert.equal(await facePanel(page, 'Back').getByLabel('Image', { exact: true }).inputValue(), 'same')
    assert.equal(await facePanel(page, 'Back').getByRole('checkbox', { name: 'Mirror horizontally', exact: true }).isChecked(), true)
    await facePanel(page, 'Back').getByRole('checkbox', { name: 'Mirror horizontally', exact: true }).uncheck()
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
    await showAdvanced(page)
    await upload(page, 'front', fSvg)
    await facePanel(page, 'Back').getByLabel('Image', { exact: true }).selectOption('artwork')
    await upload(page, 'back', lSvg)
    await facePanel(page, 'Back').getByRole('checkbox', { name: 'Mirror horizontally', exact: true }).uncheck()
    for (const scenario of ['different', 'front-mirrored', 'back-mirrored', 'front-only', 'back-only']) {
      await facePanel(page, 'Front').getByLabel('Image', { exact: true }).selectOption(scenario === 'back-only' ? 'empty' : 'artwork')
      if (scenario !== 'back-only') await facePanel(page, 'Front').getByRole('checkbox', { name: 'Mirror horizontally', exact: true }).setChecked(scenario === 'front-mirrored')
      await facePanel(page, 'Back').getByLabel('Image', { exact: true }).selectOption(scenario === 'front-only' ? 'empty' : 'artwork')
      if (scenario !== 'front-only') await facePanel(page, 'Back').getByRole('checkbox', { name: 'Mirror horizontally', exact: true }).setChecked(scenario === 'back-mirrored')
      for (const [bevel, thickness] of [[0.6, 5], [0, 0.8], [0.3, 0.8]]) {
        for (const [label, value] of [['Edge chamfer', bevel], ['Thickness', thickness]] as const) {
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
    await facePanel(page, 'Back').getByLabel('Image', { exact: true }).selectOption('empty')
    await page.getByText('Ready to export the base only.', { exact: true }).waitFor()
    assert.equal(await page.getByRole('button', { name: 'Download .3mf (base only)', exact: true }).isEnabled(), true)
  } finally { await page.close() }
})

for (const width of [1024, 1280, 1440, 1920]) {
  test(`#33 both face editors and shared controls fit a ${width}px desktop`, async () => {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    try {
      await page.goto(url)
      await showAdvanced(page)
      const front = facePanel(page, 'Front')
      const back = facePanel(page, 'Back')
      await back.getByLabel('Image', { exact: true }).selectOption('artwork')
      await upload(page, 'front', fSvg)
      await upload(page, 'back', lSvg)
      await ready(page)
      for (const panel of [front, back]) {
        for (const control of [panel.getByRole('img'), panel.getByRole('button', { name: /^Replace / }),
          panel.getByRole('slider', { name: 'Merge similar', exact: true }),
          panel.getByRole('checkbox', { name: 'Mirror horizontally', exact: true }),
          panel.getByRole('heading', { name: 'Colors', exact: false })]) {
          assert.equal(await control.isVisible(), true)
        }
        assert.equal(await panel.evaluate(el => el.scrollWidth <= el.clientWidth), true, 'face controls must fit their column')
      }
      const f = await front.boundingBox()
      const b = await back.boundingBox()
      const canvas = await page.locator('canvas').boundingBox()
      assert.ok(f && b && canvas)
      assert.equal(f.y, b.y)
      assert.ok(f.width >= 280 && b.width >= 280)
      assert.ok(f.x + f.width <= b.x && b.x + b.width <= canvas.x)
      assert.ok(canvas.width >= 280 && canvas.width <= 600 && canvas.height >= 260)
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
      assert.equal(await page.getByRole('group', { name: 'Artwork face', exact: true }).count(), 0)
      const shared = page.getByRole('region', { name: 'Keychain settings', exact: true })
      for (const name of ['Width', 'Inlay depth', 'Nozzle size']) {
        const slider = shared.getByRole('slider', { name, exact: true })
        assert.equal(await page.getByRole('slider', { name, exact: true }).count(), 1)
        await slider.scrollIntoViewIfNeeded()
        const box = await slider.boundingBox()
        assert.ok(box && box.width >= 40 && box.x + box.width <= width && box.y + box.height <= 900)
      }
      await page.getByRole('button', { name: 'Download .3mf', exact: true }).scrollIntoViewIfNeeded()
      await page.locator('.inspection-scroll').evaluate(el => { el.scrollTop = 0 })
      await page.screenshot({ path: `test-output/side-by-side-${width}.png` })
      for (const panel of [front, back]) {
        await panel.getByRole('button', { name: 'Enlarge preview', exact: true }).click()
        const enlarged = page.getByRole('region', { name: 'Logo preview', exact: true })
        for (const editor of [front, back]) {
          // The enlarged view must leave both editors available for live changes.
          await editor.getByRole('checkbox', { name: 'Mirror horizontally', exact: true }).check({ trial: true })
        }
        await enlarged.getByRole('button', { name: 'Close', exact: true }).click()
      }
    } finally { await page.close() }
  })
}

test('#33 both raster uploaders keep visible, independent tracing controls at 1024px', async () => {
  const page = await browser.newPage({ viewport: { width: 1024, height: 768 } })
  try {
    await page.goto(url)
    await showAdvanced(page)
    await facePanel(page, 'Back').getByLabel('Image', { exact: true }).selectOption('artwork')
    await page.locator('[aria-label="front image upload"] input').setInputFiles('test-images/coffee-badge.png')
    await page.locator('[aria-label="back image upload"] input').setInputFiles('test-images/smile-heart.png')
    await ready(page)
    for (const face of ['Front', 'Back'] as const) {
      const panel = facePanel(page, face)
      assert.equal(await panel.getByRole('slider', { name: 'Smoothing', exact: true }).isVisible(), true)
      assert.equal(await panel.evaluate(el => el.scrollWidth <= el.clientWidth), true)
    }
    const previousFront = await page.evaluate(() => localStorage.getItem('keychain-maker:front:svg:v1'))
    const previousBack = await page.evaluate(() => localStorage.getItem('keychain-maker:back:svg:v1'))
    await facePanel(page, 'Back').getByRole('slider', { name: 'Smoothing', exact: true }).fill('2.5')
    await page.waitForFunction(previous => localStorage.getItem('keychain-maker:back:svg:v1') !== previous, previousBack)
    assert.equal(await page.evaluate(() => localStorage.getItem('keychain-maker:front:svg:v1')), previousFront)
    assert.equal(await facePanel(page, 'Front').getByRole('slider', { name: 'Smoothing', exact: true }).inputValue(), '1')
    await ready(page)
    await page.screenshot({ path: 'test-output/side-by-side-raster-1024.png' })
  } finally { await page.close() }
})
