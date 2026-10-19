import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'
import { chromium, type Browser } from 'playwright'
import { readFileSync } from 'node:fs'

let server: Awaited<ReturnType<typeof createServer>>
let browser: Browser
let url: string

before(async () => {
  server = await createServer({ base: '/', server: { port: 0 }, logLevel: 'error' })
  await server.listen()
  url = `http://localhost:${server.config.server.port}/`
  browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  })
})

after(async () => {
  await browser?.close()
  await server?.close()
})

test('a failed raster replacement removes stale artwork and disables export', async () => {
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
  try {
    await page.goto(url)
    const input = page.locator('input[type="file"]')
    await input.setInputFiles('test-images/logo-white.png')
    await page.waitForFunction(() => {
      const viewer = (document.querySelector('canvas')?.parentElement as any)?.__vueParentComponent
      return viewer?.exposed?.getCurrentGroup()?.children.length > 1
    })
    const download = page.getByRole('button', { name: 'Download .3mf', exact: true })
    assert.equal(await download.isEnabled(), true)

    await input.setInputFiles({ name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('broken') })
    await page.getByText('Could not read "broken.png".', { exact: true }).waitFor()
    assert.equal(await download.isDisabled(), true, 'failed replacement must disable export')
    assert.equal(await page.locator('svg.logo-preview').count(), 0, 'stale artwork must leave the preview')
    assert.equal(await page.evaluate(() => localStorage.getItem('keychain-maker:svg:v1')), null)
    await page.waitForFunction(() => {
      const viewer = (document.querySelector('canvas')?.parentElement as any)?.__vueParentComponent
      const group = viewer?.exposed?.getCurrentGroup()
      return !group || group.children.length <= 1
    })
  } finally {
    await page.close()
  }
})

test('SVG errors are actionable, clear persisted artwork, and allow recovery', async () => {
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
  try {
    await page.goto(url)
    const input = page.locator('input[type="file"]')
    await input.setInputFiles('test-svg/c1.svg')
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    for (const [name, buffer, message] of [
      ['text.svg', Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><text>Logo</text></svg>'), 'Convert text to paths'],
      ['huge.svg', Buffer.from(' '.repeat(2 * 1024 * 1024 + 1)), '2 MiB'],
      ['broken.svg', Buffer.from('<svg'), 'not a valid SVG'],
    ] as const) {
      await input.setInputFiles({ name, mimeType: 'image/svg+xml', buffer })
      await page.getByRole('alert').filter({ hasText: message }).waitFor()
      assert.equal(await page.getByRole('button', { name: 'Download .3mf', exact: true }).isDisabled(), true)
      assert.equal(await page.evaluate(() => localStorage.getItem('keychain-maker:svg:v1')), null)
    }
    await input.setInputFiles('test-svg/c1.svg')
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    assert.equal(await page.getByRole('alert').count(), 0)
  } finally {
    await page.close()
  }
})

for (const outcome of ['success', 'failure']) {
  test(`a late raster ${outcome} cannot replace a newer SVG upload`, async () => {
    const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
    try {
      await page.addInitScript(() => {
        const decode = window.createImageBitmap.bind(window)
        window.createImageBitmap = (async (file: File) => {
          if (file.name === 'slow.png') {
            await new Promise<void>(resolve => { (window as any).__releaseDecode = resolve })
            try { return await decode(file) }
            finally { (window as any).__decodeFinished = true }
          }
          return decode(file)
        }) as typeof createImageBitmap
      })
      await page.goto(url)
      const input = page.locator('input[type="file"]')
      await input.setInputFiles({ name: 'slow.png', mimeType: 'image/png',
        buffer: outcome === 'success' ? readFileSync('test-images/logo-white.png') : Buffer.from('broken') })
      await page.waitForFunction(() => typeof (window as any).__releaseDecode === 'function')
      await input.setInputFiles('test-svg/c1.svg')
      await page.getByText('Ready to export.', { exact: true }).waitFor()
      const svg = await page.evaluate(() => localStorage.getItem('keychain-maker:svg:v1'))
      await page.evaluate(() => (window as any).__releaseDecode())
      await page.waitForFunction(() => (window as any).__decodeFinished === true)
      assert.equal(await page.evaluate(() => localStorage.getItem('keychain-maker:svg:v1')), svg)
      assert.equal(await page.getByRole('alert').count(), 0)
      assert.equal(await page.getByRole('button', { name: 'Download .3mf', exact: true }).isEnabled(), true)
    } finally {
      await page.close()
    }
  })
}

test('export waits for current settings to build and produces a 3MF download', async () => {
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
  try {
    await page.goto(url)
    await page.locator('input[type="file"]').setInputFiles('test-svg/c1.svg')
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    const pending = await page.evaluate(async () => {
      const slider = document.querySelector('input[data-field="targetWidth"]') as HTMLInputElement
      slider.value = '60'
      slider.dispatchEvent(new Event('input', { bubbles: true }))
      // Observe the Vue update inside the same task, before the debounce timer.
      await Promise.resolve()
      const download = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.trim() === 'Download .3mf')!
      return { disabled: download.disabled, pending: document.body.textContent?.includes('Updating model…') }
    })
    assert.deepEqual(pending, { disabled: true, pending: true })
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    const downloaded = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Download .3mf', exact: true }).click()
    const download = await downloaded
    assert.equal(download.suggestedFilename(), 'keychain.3mf')
    assert.equal(await download.failure(), null)
    const path = await download.path()
    assert.ok(path)
    const bytes = readFileSync(path)
    assert.equal(bytes.subarray(0, 4).toString('hex'), '504b0304', '3MF must be a ZIP package')
    assert.ok(bytes.length > 1000)
  } finally {
    await page.close()
  }
})

test('invalid restored artwork is reported and removed from persistence', async () => {
  const page = await browser.newPage()
  try {
    await page.addInitScript(() => localStorage.setItem('keychain-maker:svg:v1', '<svg><text>Old logo</text></svg>'))
    await page.goto(url)
    await page.getByRole('alert').filter({ hasText: 'Convert text to paths' }).waitFor()
    assert.equal(await page.evaluate(() => localStorage.getItem('keychain-maker:svg:v1')), null)
    assert.equal(await page.getByRole('button', { name: 'Download .3mf', exact: true }).isDisabled(), true)
  } finally {
    await page.close()
  }
})

test('printability advice appears near settings and does not block a valid export', async () => {
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
  try {
    await page.goto(url)
    await page.locator('input[type="file"]').setInputFiles('test-svg/c1.svg')
    const thickness = page.getByRole('spinbutton', { name: 'Thickness', exact: true })
    await thickness.fill('0.4')
    await thickness.press('Tab')
    const ring = page.getByRole('spinbutton', { name: 'Ring diameter', exact: true })
    await ring.fill('7')
    await ring.press('Tab')
    await page.getByText(/The base is thin/).waitFor()
    await page.getByText(/The keyring wall is 1.0 mm/).waitFor()
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    assert.equal(await page.getByRole('button', { name: 'Download .3mf', exact: true }).isEnabled(), true)
  } finally {
    await page.close()
  }
})

test('WebGL unavailability prevents export even when artwork parses', async () => {
  const page = await browser.newPage()
  try {
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext
      HTMLCanvasElement.prototype.getContext = function (context: string, ...args: any[]) {
        return context.includes('webgl') ? null : original.call(this, context as any, ...args)
      } as typeof original
    })
    await page.goto(url)
    await page.locator('input[type="file"]').setInputFiles('test-svg/c1.svg')
    await page.getByRole('status').filter({ hasText: 'WebGL is unavailable' }).waitFor()
    assert.equal(await page.getByRole('button', { name: 'Download .3mf', exact: true }).isDisabled(), true)
  } finally {
    await page.close()
  }
})

test('invalid restored settings block model generation and recover when corrected', async () => {
  const page = await browser.newPage()
  try {
    await page.addInitScript(() => localStorage.setItem('keychain-maker:config:v1', JSON.stringify({ baseThickness: -1 })))
    await page.goto(url)
    await page.locator('input[type="file"]').setInputFiles('test-svg/c1.svg')
    await page.getByRole('alert').filter({ hasText: 'baseThickness must be greater than zero' }).waitFor()
    assert.equal(await page.getByRole('button', { name: 'Download .3mf', exact: true }).isDisabled(), true)
    await page.waitForFunction(() => !(document.querySelector('canvas')?.parentElement as any)?.__vueParentComponent?.exposed?.getCurrentGroup())
    const thickness = page.getByRole('spinbutton', { name: 'Thickness', exact: true })
    await thickness.fill('0.4')
    await thickness.press('Tab')
    await page.getByText('Limited to 0.15 mm to fit the base thickness.', { exact: true }).waitFor()
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    assert.equal(await page.getByRole('alert').count(), 0)
  } finally {
    await page.close()
  }
})

for (const width of [390, 768, 1400]) {
  test(`preview and export are reachable at ${width}px`, async () => {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    try {
      await page.goto(url)
      const download = page.getByRole('button', { name: 'Download .3mf', exact: true })
      const box = await download.boundingBox()
      assert.ok(box)
      assert.ok(box.x >= 0 && box.x + box.width <= width, `Download is clipped: ${JSON.stringify(box)}`)
      const canvas = await page.locator('canvas').boundingBox()
      assert.ok(canvas && canvas.width > 100 && canvas.x >= 0 && canvas.x + canvas.width <= width,
        `preview is clipped: ${JSON.stringify(canvas)}`)
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
      await download.scrollIntoViewIfNeeded()
      const reachable = await download.boundingBox()
      assert.ok(reachable && reachable.y >= 0 && reachable.y + reachable.height <= 900)
      await page.locator('input[type="file"]').setInputFiles('test-svg/c1.svg')
      await page.getByRole('button', { name: 'Enlarge preview', exact: true }).click()
      const panel = page.getByRole('region', { name: 'Logo preview', exact: true })
      const enlarged = await panel.boundingBox()
      assert.ok(enlarged && enlarged.width > 100 && enlarged.x >= 0 && enlarged.x + enlarged.width <= width)
      assert.ok(enlarged && enlarged.y >= 0 && enlarged.height > 100 && enlarged.y + enlarged.height <= 900)
      await page.keyboard.press('Escape')
      await panel.waitFor({ state: 'hidden' })
    } finally {
      await page.close()
    }
  })
}
