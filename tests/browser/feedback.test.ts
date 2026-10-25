import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { mkdirSync, copyFileSync } from 'node:fs'
import { createServer } from 'vite'
import { chromium, type Browser } from 'playwright'
import { facePanel } from './facePanel.ts'

let server: Awaited<ReturnType<typeof createServer>>
let browser: Browser
let url: string
const letter = '<svg xmlns="http://www.w3.org/2000/svg"><path fill="#2563eb" d="M0 0H8V24H28V32H0Z"/></svg>'
const dots = (count: number, color: string) => `<svg xmlns="http://www.w3.org/2000/svg"><path fill="${color}" d="${Array.from({ length: count }, (_, i) => {
  const x = (i % 17) * 5, y = Math.floor(i / 17) * 5
  return `M${x} ${y}h3v3h-3Z`
}).join(' ')}"/></svg>`

before(async () => {
  server = await createServer({ base: '/', server: { port: 0 }, logLevel: 'error' })
  await server.listen()
  url = `http://localhost:${server.config.server.port}/`
  browser = await chromium.launch({ headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
  mkdirSync('test-output', { recursive: true })
})
after(async () => { await browser?.close(); await server?.close() })

test('#35 combined complexity keeps an explicitly partial preview, blocks export and recovers', async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  page.setDefaultTimeout(5000)
  try {
    await page.addInitScript(({ front, back }) => {
      for (const [face, svg] of [['front', front], ['back', back]]) {
        localStorage.setItem(`keychain-maker:${face}:v1`, JSON.stringify({ mode: 'artwork', mirror: false, hasArtwork: true }))
        localStorage.setItem(`keychain-maker:${face}:svg:v1`, svg)
      }
    }, { front: dots(257, '#dc2626'), back: dots(256, '#2563eb') })
    await page.goto(url)
    const inspection = page.getByRole('complementary', { name: '3D preview and export' })
    await inspection.getByText('This artwork is too complex.', { exact: false }).waitFor()
    assert.equal(await inspection.getByRole('alert').count(), 1, 'the blocking error must be prominent at the preview')
    await inspection.getByText('Partial preview', { exact: true }).waitFor()
    assert.equal(await page.getByRole('button', { name: 'Download .3mf', exact: true }).isDisabled(), true)
    assert.equal(await page.evaluate(() => {
      const viewer = (document.querySelector('canvas')!.parentElement as any).__vueParentComponent.exposed
      return viewer.getCurrentGroup() === null && viewer.getPreviewGroup()?.children.length > 1
    }), true, 'the remaining face must be rendered without becoming exportable')
    const errorBox = await inspection.getByRole('alert').boundingBox()
    const canvasBox = await inspection.locator('canvas').boundingBox()
    assert.ok(errorBox && canvasBox && errorBox.y < canvasBox.y, 'show the explanation above the preview')
    await page.screenshot({ path: 'test-output/feedback-combined.png' })
    await inspection.getByRole('button', { name: 'Edit Back artwork', exact: true }).click()
    const back = facePanel(page, 'Back')
    assert.equal(await back.evaluate(el => el.contains(document.activeElement)), true)
    await page.locator('[aria-label="back image upload"] input').setInputFiles({ name: 'letter.svg', mimeType: 'image/svg+xml', buffer: Buffer.from(letter) })
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    assert.equal(await inspection.getByRole('alert').count(), 0)
    assert.equal(await inspection.getByText('Partial preview', { exact: true }).count(), 0)
    assert.equal(await page.getByRole('button', { name: 'Download .3mf', exact: true }).isEnabled(), true)
  } finally { await page.close() }
})

test('#35 an invalid Front leaves the current Back preview visible, names shared failures and recovers', async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  page.setDefaultTimeout(8000)
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  try {
    await page.goto(url)
    const front = facePanel(page, 'Front')
    const back = facePanel(page, 'Back')
    const inspection = page.getByRole('complementary', { name: '3D preview and export' })
    await page.locator('[aria-label="front image upload"] input').setInputFiles('test-svg/coffee-badge.svg')
    await back.getByLabel('Image', { exact: true }).selectOption('artwork')
    await page.locator('[aria-label="back image upload"] input').setInputFiles({ name: 'letter.svg', mimeType: 'image/svg+xml', buffer: Buffer.from(letter) })
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    await page.locator('[aria-label="front image upload"] input').setInputFiles({ name: 'unsupported.svg', mimeType: 'image/svg+xml',
      buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><text>Logo</text></svg>') })
    const alert = inspection.getByRole('alert', { name: 'Front artwork needs attention' })
    await alert.waitFor()
    await inspection.getByText('Partial preview', { exact: true }).waitFor()
    assert.equal(await page.getByRole('alert').count(), 1, 'announce each failure once')
    assert.match(await inspection.innerText(), /Showing Back and the base\. Front artwork omitted/)
    assert.equal(await page.getByRole('button', { name: 'Download .3mf', exact: true }).isDisabled(), true)
    assert.equal(await front.locator('svg.logo-preview').count(), 0, 'invalid Front must not leave stale artwork')
    assert.equal(await page.evaluate(() => {
      const viewer = (document.querySelector('canvas')!.parentElement as any).__vueParentComponent.exposed
      const meshes: string[] = []
      viewer.getPreviewGroup().traverse((node: any) => { if (node.isMesh) meshes.push(node.name) })
      return viewer.getCurrentGroup() === null && meshes.includes('back inlay') && !meshes.includes('front inlay')
    }), true)
    await inspection.getByRole('button', { name: 'Back view', exact: true }).click()
    await page.screenshot({ path: 'test-output/feedback-valid-back.png' })
    await alert.getByRole('button', { name: 'Edit Front artwork', exact: true }).click()
    assert.equal(await front.evaluate(el => el.contains(document.activeElement)), true)
    await page.reload()
    await inspection.getByText('Partial preview', { exact: true }).waitFor()
    assert.equal(await page.getByRole('button', { name: 'Download .3mf', exact: true }).isDisabled(), true)
    await back.getByLabel('Image', { exact: true }).selectOption('same')
    await alert.getByText('Back uses this artwork too.', { exact: true }).waitFor()
    assert.equal(await page.getByRole('alert').count(), 1)
    await page.locator('[aria-label="front image upload"] input').setInputFiles('test-svg/coffee-badge.svg')
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    assert.equal(await inspection.getByRole('alert').count(), 0)
    assert.equal(await inspection.getByText('Partial preview', { exact: true }).count(), 0)
    assert.deepEqual(errors, [])
  } finally { await page.close() }
})

test('#35 filament warnings stay above the preview and allow actual downloads', async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  try {
    await page.goto(url)
    await page.locator('[aria-label="front image upload"] input').setInputFiles({ name: 'four-colors.svg', mimeType: 'image/svg+xml',
      buffer: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg">${['#2563eb', '#dc2626', '#16a34a', '#f59e0b'].map((fill, i) =>
        `<rect fill="${fill}" x="${(i % 2) * 20}" y="${Math.floor(i / 2) * 20}" width="18" height="18"/>`).join('')}</svg>`) })
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    const inspection = page.getByRole('complementary', { name: '3D preview and export' })
    const warning = inspection.getByRole('status', { name: 'Check filament capacity' })
    await warning.waitFor()
    assert.equal(await inspection.getByRole('alert').count(), 0)
    assert.match(await inspection.innerText(), /Filaments: 5/)
    const warningBox = await warning.boundingBox(), canvasBox = await inspection.locator('canvas').boundingBox()
    assert.ok(warningBox && canvasBox && warningBox.y < canvasBox.y)
    const downloaded = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Download .3mf', exact: true }).click()
    const download = await downloaded
    assert.equal(await download.failure(), null)
    copyFileSync((await download.path())!, 'test-output/feedback-warning.3mf')
    await page.screenshot({ path: 'test-output/feedback-warning.png' })
    await facePanel(page, 'Front').getByLabel('Max colors', { exact: true }).selectOption('3')
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    assert.equal(await warning.count(), 0, 'resolved warnings disappear')
  } finally { await page.close() }
})

test('#35 Remove background defaults on for both uploaders and retracing recovers cleanly', async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  try {
    await page.goto(url)
    await page.locator('[aria-label="front image upload"] input').setInputFiles('test-images/logo-white.png')
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    const front = facePanel(page, 'Front'), back = facePanel(page, 'Back')
    const remove = front.getByRole('checkbox', { name: 'Remove background', exact: true })
    assert.equal(await remove.isChecked(), true)
    const removedSvg = await page.evaluate(() => localStorage.getItem('keychain-maker:front:svg:v1'))
    await remove.uncheck()
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    assert.notEqual(await page.evaluate(() => localStorage.getItem('keychain-maker:front:svg:v1')), removedSvg)
    await remove.check()
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    assert.equal(await page.evaluate(() => localStorage.getItem('keychain-maker:front:svg:v1')), removedSvg)
    await back.getByLabel('Image', { exact: true }).selectOption('artwork')
    await page.locator('[aria-label="back image upload"] input').setInputFiles('test-images/logo-white.png')
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    assert.equal(await back.getByRole('checkbox', { name: 'Remove background', exact: true }).isChecked(), true)
    assert.equal(await page.getByRole('alert').count(), 0)
    await page.screenshot({ path: 'test-output/feedback-background-default.png' })
    await back.getByRole('checkbox', { name: 'Remove background', exact: true }).uncheck()
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    assert.equal(await remove.isChecked(), true, 'each uploader retains its own choice')
  } finally { await page.close() }
})

test('#35 a complete-model CSG failure falls back to current geometry without permitting export', async () => {
  const page = await browser.newPage({ viewport: { width: 1024, height: 900 } })
  page.setDefaultTimeout(5000)
  try {
    // Fail at the real build boundary only when both faces have geometry. The
    // fallback still runs the actual independent-face builder and scene lifecycle.
    await page.route('**/src/domain/keychainModel.ts', async route => {
      const response = await route.fetch()
      const source = await response.text()
      const marker = 'const cutouts = profiler.measure('
      assert.ok(source.includes(marker))
      await route.fulfill({ response, body: source.replace(marker,
        'if (faces.front.groups.length && faces.back.groups.length) throw new Error("simulated complete-model CSG failure");\n' + marker) })
    })
    await page.goto(url)
    await page.locator('[aria-label="front image upload"] input').setInputFiles({ name: 'letter.svg', mimeType: 'image/svg+xml', buffer: Buffer.from(letter) })
    const inspection = page.getByRole('complementary', { name: '3D preview and export' })
    await inspection.getByRole('alert', { name: 'Model could not be built' }).waitFor()
    await inspection.getByText('Partial preview', { exact: true }).waitFor()
    assert.equal(await page.getByRole('button', { name: 'Download .3mf', exact: true }).isDisabled(), true)
    assert.equal(await page.evaluate(() => {
      const viewer = (document.querySelector('canvas')!.parentElement as any).__vueParentComponent.exposed
      return viewer.getCurrentGroup() === null && viewer.getPreviewGroup()?.children.length > 1
    }), true)
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
    await page.screenshot({ path: 'test-output/feedback-build-failure-1024.png' })
    await facePanel(page, 'Back').getByLabel('Image', { exact: true }).selectOption('empty')
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    assert.equal(await inspection.getByRole('alert').count(), 0)
    assert.equal(await page.getByRole('button', { name: 'Download .3mf', exact: true }).isEnabled(), true)
  } finally { await page.close() }
})

test('#35 download failures are prominent and allow retrying the current model', async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  try {
    await page.goto(url)
    await page.locator('[aria-label="front image upload"] input').setInputFiles({ name: 'letter.svg', mimeType: 'image/svg+xml', buffer: Buffer.from(letter) })
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    await facePanel(page, 'Front').getByRole('button', { name: 'Enlarge preview', exact: true }).click()
    await page.getByRole('region', { name: 'Logo preview', exact: true }).waitFor()
    await page.evaluate(() => {
      const original = URL.createObjectURL
      URL.createObjectURL = () => {
        URL.createObjectURL = original
        throw new Error('simulated download failure')
      }
    })
    // The enlarged preview covers the inspection column, so close it to use Download.
    await page.getByRole('region', { name: 'Logo preview', exact: true }).getByRole('button', { name: 'Close', exact: true }).click()
    await page.getByRole('button', { name: 'Download .3mf', exact: true }).click()
    const inspection = page.getByRole('complementary', { name: '3D preview and export' })
    const alert = inspection.getByRole('alert', { name: 'Download failed', exact: true })
    await alert.waitFor()
    const errorBox = await alert.boundingBox(), canvasBox = await inspection.locator('canvas').boundingBox()
    assert.ok(errorBox && canvasBox && errorBox.y < canvasBox.y)
    const downloaded = page.waitForEvent('download')
    await alert.getByRole('button', { name: 'Retry download', exact: true }).click()
    assert.equal(await (await downloaded).failure(), null)
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    assert.equal(await alert.count(), 0)
  } finally { await page.close() }
})
