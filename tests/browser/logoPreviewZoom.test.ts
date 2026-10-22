import assert from 'node:assert/strict'
import test from 'node:test'
import { createServer } from 'vite'
import { chromium } from 'playwright'

test('changing smoothing preserves the logo preview zoom and pan', async () => {
  const server = await createServer({ base: '/', server: { port: 0 }, logLevel: 'error' })
  let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined
  try {
    await server.listen()
    browser = await chromium.launch({
      headless: true,
      args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
    })
    const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(`http://localhost:${server.config.server.port}/`)
    await page.locator('input[type="file"]').first().setInputFiles('test-images/logo-white.png')
    await page.getByRole('button', { name: 'Enlarge preview', exact: true }).click()

    const panel = page.getByRole('region', { name: 'Logo preview', exact: true })
    const preview = panel.getByRole('img')
    const fittedView = await preview.getAttribute('viewBox')
    await preview.hover()
    await page.mouse.wheel(0, -600)
    await panel.getByRole('button', { name: 'Fit', exact: true }).waitFor()
    const bounds = await preview.boundingBox()
    assert.ok(bounds)
    await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)
    await page.mouse.down()
    await page.mouse.move(bounds.x + bounds.width / 2 + 50, bounds.y + bounds.height / 2 + 30)
    await page.mouse.up()
    const zoomedView = await preview.getAttribute('viewBox')
    assert.notEqual(zoomedView, fittedView, 'the check must start with a zoomed and panned view')
    const previewElement = await preview.elementHandle()

    for (const smoothing of ['2', '0.5']) {
      const previousSvg = await page.evaluate(() => localStorage.getItem('keychain-maker:front:svg:v1'))
      await page.getByRole('slider', { name: 'Smoothing', exact: true }).fill(smoothing)
      await page.waitForFunction(previous => {
        const svg = localStorage.getItem('keychain-maker:front:svg:v1')
        return svg !== null && svg !== previous
      }, previousSvg)
      assert.equal(await preview.evaluate((element, previous) => element === previous, previewElement), true,
        'retracing must keep the preview mounted')
      assert.equal(await preview.getAttribute('viewBox'), zoomedView,
        'changing Smoothing must preserve the preview zoom and pan after retracing')
    }

    const inlinePreview = page.locator('svg.logo-preview').first()
    await panel.getByRole('button', { name: 'Fit', exact: true }).click()
    assert.equal(await preview.getAttribute('viewBox'), await inlinePreview.getAttribute('viewBox'),
      'Fit must frame the current smoothed geometry')

    // A fresh upload, including the same raster file, should still reset the view.
    for (const file of ['test-images/logo-white.png', 'test-svg/c1.svg']) {
      await preview.hover()
      await page.mouse.wheel(0, -600)
      await panel.getByRole('button', { name: 'Fit', exact: true }).waitFor()
      await page.locator('input[type="file"]').first().setInputFiles(file)
      await panel.getByRole('button', { name: 'Fit', exact: true }).waitFor({ state: 'hidden', timeout: 5000 })
      assert.equal(await preview.getAttribute('viewBox'), await inlinePreview.getAttribute('viewBox'),
        'a new upload must fit the new logo')
      assert.equal(await panel.getByRole('button', { name: 'Fit', exact: true }).count(), 0)
    }
    assert.deepEqual(errors, [])
  } finally {
    await browser?.close()
    await server.close()
  }
})
