import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'
import { chromium, type Browser, type Page } from 'playwright'
import JSZip from 'jszip'
import { readFileSync, mkdirSync, copyFileSync } from 'node:fs'

let server: Awaited<ReturnType<typeof createServer>>
let browser: Browser
let url: string
const svg = '<svg xmlns="http://www.w3.org/2000/svg"><path fill="red" d="M0 0H30V10H10V30H0Z"/></svg>'

before(async () => {
  server = await createServer({ base: '/', server: { port: 0 }, logLevel: 'error' })
  await server.listen()
  url = `http://localhost:${server.config.server.port}/`
  browser = await chromium.launch({ headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
  mkdirSync('test-output', { recursive: true })
})
after(async () => { await browser?.close(); await server?.close() })

async function check(run: (page: Page) => Promise<void>, stored: Record<string, string> = {}) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } })
  page.setDefaultTimeout(5000)
  const errors: string[] = []
  page.on('pageerror', e => errors.push(e.message))
  try {
    // Seed once, so a reload exercises the app's own persisted state.
    await page.goto(url)
    await page.evaluate(values => { localStorage.clear(); Object.entries(values).forEach(([k, v]) => localStorage.setItem(k, v)) }, stored)
    await page.reload()
    await page.locator('canvas').waitFor()
    await run(page)
    assert.deepEqual(errors, [])
  } finally { await page.close() }
}
const frontSave = {
  'keychain-maker:front:v1': JSON.stringify({ mode: 'artwork', mirror: false, hasArtwork: true, fileName: 'letter.svg' }),
  'keychain-maker:front:svg:v1': svg,
}
const face = (page: Page, name: string) => page.getByRole('group', { name: 'Artwork face', exact: true }).getByRole('button', { name, exact: true }).click()
const card = (page: Page, name: string) => page.locator('section').filter({ has: page.getByRole('heading', { name, exact: true }) }).first()

test('#26 fresh Back reads normally; legacy saved artwork retains its mirror', async () => {
  await check(async page => {
    await page.locator('input[type=file]').first().setInputFiles({ name: 'letter.svg', mimeType: 'image/svg+xml', buffer: Buffer.from(svg) })
    await face(page, 'Back')
    assert.equal(await page.getByRole('checkbox', { name: 'Mirror horizontally', exact: true }).isChecked(), false)
  })
  await check(async page => {
    await face(page, 'Back')
    assert.equal(await page.getByRole('checkbox', { name: 'Mirror horizontally', exact: true }).isChecked(), true)
  }, { 'keychain-maker:svg:v1': svg })
})

test('#17 printer settings are shared, persisted and accessible on Empty faces', async () => {
  await check(async page => {
    await page.getByRole('slider', { name: 'Nozzle', exact: true }).fill('0.2')
    await page.getByRole('checkbox', { name: 'Thin walls', exact: true }).check()
    await face(page, 'Back')
    await page.getByLabel('Face artwork', { exact: true }).selectOption('artwork')
    assert.equal(await page.getByRole('slider', { name: 'Nozzle', exact: true }).inputValue(), '0.2')
    assert.equal(await page.getByRole('checkbox', { name: 'Thin walls', exact: true }).isChecked(), true)
    await page.getByLabel('Face artwork', { exact: true }).selectOption('empty')
    assert.equal(await card(page, 'Printer').getByRole('slider', { name: 'Nozzle', exact: true }).isVisible(), true)
    await page.reload()
    assert.equal(await page.getByRole('slider', { name: 'Nozzle', exact: true }).inputValue(), '0.2')
    assert.equal(await page.getByRole('checkbox', { name: 'Thin walls', exact: true }).isChecked(), true)
  }, frontSave)
})

test('#27 shared Back previews are read-only in both sizes with a route to Front', async () => {
  await check(async page => {
    await face(page, 'Back')
    assert.equal(await page.getByRole('heading', { name: 'Refine', exact: true }).count(), 0)
    assert.equal(await page.getByLabel('Print color for #ff0000', { exact: true }).count(), 0)
    const before = await page.evaluate(() => localStorage.getItem('keychain-maker:front:v1'))
    await page.locator('svg.logo-preview').first().locator('path').last().dispatchEvent('click')
    await page.getByRole('button', { name: 'Enlarge preview', exact: true }).click()
    const panel = page.getByRole('region', { name: 'Logo preview', exact: true })
    await panel.locator('svg.logo-preview path').last().dispatchEvent('click')
    assert.equal(await page.evaluate(() => localStorage.getItem('keychain-maker:front:v1')), before)
    await panel.getByRole('button', { name: 'Close', exact: true }).click()
    await page.getByRole('button', { name: 'Edit on Front', exact: false }).click()
    assert.equal(await page.getByRole('heading', { name: 'Refine', exact: true }).isVisible(), true)
  }, frontSave)
})

test('#24 toggling Mirror fits the enlarged preview again', async () => {
  await check(async page => {
    await page.getByRole('button', { name: 'Enlarge preview', exact: true }).click()
    const panel = page.getByRole('region', { name: 'Logo preview', exact: true })
    const preview = panel.getByRole('img')
    const fitted = await preview.getAttribute('viewBox')
    await preview.hover()
    await page.mouse.wheel(0, -600)
    await panel.getByRole('button', { name: 'Fit', exact: true }).waitFor()
    assert.notEqual(await preview.getAttribute('viewBox'), fitted)
    await page.getByRole('checkbox', { name: 'Mirror horizontally', exact: true }).check()
    assert.equal(await preview.getAttribute('viewBox'), fitted)
    assert.equal(await panel.getByRole('button', { name: 'Fit', exact: true }).count(), 0)
  }, frontSave)
})

test('#18 interrupted retracing restores the last valid artwork and export', async () => {
  await check(async page => {
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    assert.equal(await page.getByRole('alert').count(), 0)
  }, { ...frontSave, 'keychain-maker:front:v1': JSON.stringify({ mode: 'artwork', hasArtwork: true, importFailed: true }) })
})

test('#20 refining does not rewrite an unchanged SVG', async () => {
  await check(async page => {
    await page.evaluate(() => {
      const original = Storage.prototype.setItem
      ;(window as any).svgWrites = 0
      Storage.prototype.setItem = function (key, value) {
        if (key.endsWith(':svg:v1')) (window as any).svgWrites++
        return original.call(this, key, value)
      }
    })
    for (const value of ['1', '2', '3']) {
      await page.getByRole('slider', { name: 'Merge similar', exact: true }).fill(value)
    }
    assert.equal(await page.evaluate(() => (window as any).svgWrites), 0)
  }, frontSave)
})

test('#28 Front and Back views change the camera without rebuilding or showing helpers', async () => {
  await check(async page => {
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    const viewer = page.getByRole('complementary', { name: '3D preview and export' })
    await viewer.getByRole('button', { name: 'Front view', exact: true }).click()
    const group = await page.locator('canvas').evaluateHandle(element => (element.parentElement as any).__vueParentComponent.exposed.getCurrentGroup())
    const front = await page.locator('canvas').screenshot()
    await viewer.getByRole('button', { name: 'Back view', exact: true }).click()
    const back = await page.locator('canvas').screenshot()
    assert.notDeepEqual(front, back)
    assert.equal(await page.locator('canvas').evaluate((element, previous) =>
      (element.parentElement as any).__vueParentComponent.exposed.getCurrentGroup() === previous, group), true)
    assert.equal(await page.evaluate(() => {
      const root = (document.querySelector('canvas')!.parentElement as any).__vueParentComponent.exposed.getCurrentGroup()
      return root.parent.children.some((child: any) => ['AxesHelper', 'GridHelper'].includes(child.type))
    }), false)
    await page.screenshot({ path: 'test-output/ui-back-view.png' })
  }, { ...frontSave, 'keychain-maker:back:v1': JSON.stringify({ mode: 'empty' }) })
})

test('#29 blank plates export directly and imported artwork names the download', async () => {
  await check(async page => {
    const downloadButton = page.getByRole('button', { name: 'Download .3mf (base only)', exact: true })
    await downloadButton.waitFor()
    await page.getByText('Ready to export the base only.', { exact: true }).waitFor()
    assert.equal(await downloadButton.isEnabled(), true)
    const blankDownload = page.waitForEvent('download')
    await downloadButton.click()
    copyFileSync((await (await blankDownload).path())!, 'test-output/ui-blank.3mf')
    await page.locator('input[type=file]').first().setInputFiles({ name: 'my-letter.svg', mimeType: 'image/svg+xml', buffer: Buffer.from(svg) })
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    const download = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Download .3mf', exact: true }).click()
    assert.equal((await download).suggestedFilename(), 'my-letter-keychain.3mf')
    assert.equal(await page.getByText('Filaments: 2', { exact: false }).isVisible(), true)
    await page.reload()
    assert.equal(await page.getByText('my-letter.svg', { exact: true }).isVisible(), true)
  })
})

test('#30-32 controls sit with their targets and the header can reset only app data', async () => {
  await check(async page => {
    assert.equal(await card(page, 'Logo').getByRole('slider', { name: 'Logo depth', exact: true }).count(), 1)
    assert.equal(await page.getByRole('heading', { name: 'Edge', level: 2, exact: true }).count(), 0)
    assert.equal(await card(page, 'Plate').getByRole('slider', { name: 'Bevel', exact: true }).count(), 1)
    await page.getByRole('radio', { name: 'Circle', exact: true }).click()
    assert.equal(await page.getByRole('slider', { name: 'Corner radius', exact: true }).count(), 0)
    assert.equal(await page.getByRole('link', { name: 'User guide', exact: true }).getAttribute('href'), 'https://github.com/andzhik/keychain-maker/blob/master/docs/user-guide.md')
    await page.evaluate(() => localStorage.setItem('unrelated-app', 'keep'))
    await page.getByRole('button', { name: 'Start over', exact: true }).click()
    await page.getByRole('button', { name: 'Cancel', exact: true }).click()
    assert.equal(await page.locator('svg.logo-preview').count(), 1)
    await page.getByRole('button', { name: 'Start over', exact: true }).click()
    await page.getByRole('button', { name: 'Reset everything', exact: true }).click()
    await page.getByText('Ready to export the base only.', { exact: true }).waitFor()
    assert.equal(await page.locator('svg.logo-preview').count(), 0)
    assert.equal(await page.getByRole('radio', { name: 'Rectangle', exact: true }).getAttribute('aria-checked'), 'true')
    assert.equal(await page.evaluate(() => localStorage.getItem('unrelated-app')), 'keep')
  }, frontSave)
})

test('#31 successful uploads collapse, invalid replacements keep the full uploader', async () => {
  await check(async page => {
    assert.equal(await page.getByRole('checkbox', { name: 'Mirror horizontally', exact: true }).count(), 0)
    const input = page.locator('input[type=file]').first()
    await input.setInputFiles({ name: 'letter.svg', mimeType: 'image/svg+xml', buffer: Buffer.from(svg) })
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    assert.equal(await page.getByRole('button', { name: 'Replace letter.svg', exact: true }).isVisible(), true)
    assert.equal(await page.getByText('For best results', { exact: false }).first().isVisible(), false)
    await input.setInputFiles({ name: 'broken.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg') })
    await page.getByRole('alert').waitFor()
    assert.equal(await page.getByRole('button', { name: 'Replace broken.svg', exact: true }).count(), 0)
    assert.equal(await page.getByText('For best results', { exact: false }).first().isVisible(), true)
  })
})

test('#19 inactive stored artwork cannot show complexity advice', async () => {
  const ring = Array.from({ length: 600 }, (_, i) => `${i ? 'L' : 'M'}${50 + 50 * Math.cos(i * Math.PI / 300)} ${50 + 50 * Math.sin(i * Math.PI / 300)}`).join('') + 'Z'
  await check(async page => {
    const advice = page.getByRole('status').filter({ hasText: 'Over 500 outline points' })
    assert.equal(await advice.count(), 0)
    await face(page, 'Back')
    assert.equal(await advice.count(), 0)
    await page.getByLabel('Face artwork', { exact: true }).selectOption('artwork')
    await advice.waitFor()
    assert.equal(await card(page, 'Refine').getByRole('status').filter({ hasText: 'Over 500 outline points' }).count(), 1)
    for (const mode of ['same', 'empty']) {
      await page.getByLabel('Face artwork', { exact: true }).selectOption(mode)
      assert.equal(await advice.count(), 0)
    }
  }, { ...frontSave,
    'keychain-maker:back:v1': JSON.stringify({ mode: 'same', hasArtwork: true, refinements: { simplifyTolerance: 0 } }),
    'keychain-maker:back:svg:v1': `<svg xmlns="http://www.w3.org/2000/svg"><path fill="blue" d="${ring}"/></svg>` })
})

test('#21 width changes skip unused refinement geometry and reactivation restores it', async () => {
  await check(async page => {
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    await page.evaluate(() => {
      const back = (document.querySelector('#app') as any).__vue_app__._instance.setupState.back
      ;(window as any).unusedReads = 0
      for (const group of back.parser.colorGroups.value) for (const shape of group.shapes) {
        const original = shape.extractPoints.bind(shape)
        shape.extractPoints = (...args: any[]) => { (window as any).unusedReads++; return original(...args) }
      }
    })
    await page.getByRole('slider', { name: 'Width', exact: true }).fill('60')
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    // Wait past the thin-feature debounce using actual page frames.
    await page.waitForTimeout(300)
    assert.equal(await page.evaluate(() => (window as any).unusedReads), 0)
    await face(page, 'Back')
    await page.getByLabel('Face artwork', { exact: true }).selectOption('artwork')
    await page.waitForFunction(() => (window as any).unusedReads > 0)
    assert.equal(await page.locator('svg.logo-preview').count(), 1)
  }, { ...frontSave,
    'keychain-maker:back:v1': JSON.stringify({ mode: 'same', hasArtwork: true }),
    'keychain-maker:back:svg:v1': svg.replace('red', 'blue') })
})

test('#29 filament counts match exported colors across both faces, refinements and base-only mode', async () => {
  const blocks = (colors: string[]) => `<svg xmlns="http://www.w3.org/2000/svg">${colors.map((color, i) => `<rect x="${i * 20}" width="20" height="20" fill="${color}"/>`).join('')}</svg>`
  await check(async page => {
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    const summary = page.getByText(/^Filaments:/)
    assert.match(await summary.innerText(), /Filaments: 5/)
    await page.getByText('More than 4 filaments', { exact: false }).waitFor()
    const downloaded = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Download .3mf', exact: true }).click()
    const file = (await (await downloaded).path())!
    const zip = await JSZip.loadAsync(readFileSync(file))
    const settings = JSON.parse(await zip.file('Metadata/project_settings.config')!.async('string'))
    assert.equal(new Set(settings.filament_colour.map((c: string) => c.toLowerCase())).size, 5)
    copyFileSync(file, 'test-output/ui-five-colors.3mf')
    await page.getByLabel('Plate color', { exact: true }).fill('#ff0000')
    assert.match(await summary.innerText(), /Filaments: 4/)
    assert.equal(await page.getByText('More than 4 filaments', { exact: false }).count(), 0)
    await face(page, 'Back')
    await page.getByLabel('Face artwork', { exact: true }).selectOption('same')
    assert.match(await summary.innerText(), /Filaments: 2/)
    await page.getByRole('checkbox', { name: 'Print logo', exact: true }).uncheck()
    await page.getByText('Ready to export the base only.', { exact: true }).waitFor()
    assert.match(await summary.innerText(), /Filaments: 1/)
    await page.screenshot({ path: 'test-output/ui-shared-back.png' })
  }, { ...frontSave,
    'keychain-maker:front:svg:v1': blocks(['#ff0000', '#00ff00']),
    'keychain-maker:back:v1': JSON.stringify({ mode: 'artwork', hasArtwork: true }),
    'keychain-maker:back:svg:v1': blocks(['#ff0000', '#0000ff', '#ffff00']) })
})
