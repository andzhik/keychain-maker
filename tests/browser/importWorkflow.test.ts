import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'
import { chromium, type Browser } from 'playwright'
import { readFileSync } from 'node:fs'
import JSZip from 'jszip'
import { XMLParser } from 'fast-xml-parser'

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
    const input = page.locator('input[type="file"]').first()
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
    assert.equal(await page.evaluate(() => localStorage.getItem('keychain-maker:front:svg:v1')), null)
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
    const input = page.locator('input[type="file"]').first()
    await input.setInputFiles('test-svg/c1.svg')
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    for (const [name, buffer, message] of [
      ['text.svg', Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><text>Logo</text></svg>'), 'Convert text to paths'],
      ['stroke.svg', Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10"/><path fill="none" stroke="red" d="M20 0H30"/></svg>'), 'Convert strokes to filled outlines'],
      ['huge.svg', Buffer.from(' '.repeat(2 * 1024 * 1024 + 1)), '2 MiB'],
      ['broken.svg', Buffer.from('<svg'), 'not a valid SVG'],
    ] as const) {
      await input.setInputFiles({ name, mimeType: 'image/svg+xml', buffer })
      await page.getByRole('alert').filter({ hasText: message }).waitFor()
      assert.equal(await page.getByRole('button', { name: 'Download .3mf', exact: true }).isDisabled(), true)
      assert.equal(await page.evaluate(() => localStorage.getItem('keychain-maker:front:svg:v1')), null)
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
      const input = page.locator('input[type="file"]').first()
      await input.setInputFiles({ name: 'slow.png', mimeType: 'image/png',
        buffer: outcome === 'success' ? readFileSync('test-images/logo-white.png') : Buffer.from('broken') })
      await page.waitForFunction(() => typeof (window as any).__releaseDecode === 'function')
      await input.setInputFiles('test-svg/c1.svg')
      await page.getByText('Ready to export.', { exact: true }).waitFor()
      const svg = await page.evaluate(() => localStorage.getItem('keychain-maker:front:svg:v1'))
      await page.evaluate(() => (window as any).__releaseDecode())
      await page.waitForFunction(() => (window as any).__decodeFinished === true)
      assert.equal(await page.evaluate(() => localStorage.getItem('keychain-maker:front:svg:v1')), svg)
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
    await page.locator('input[type="file"]').first().setInputFiles('test-svg/c1.svg')
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

test('logo depth persists and the exported surface shells match the preview for flat, beveled and thin plates', async () => {
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
  try {
    await page.goto(url)
    await page.locator('input[type="file"]').first().setInputFiles({ name: 'two-colors.svg', mimeType: 'image/svg+xml',
      buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><path fill="red" fill-rule="evenodd" d="M0 0H10V20H0Z M3 7H7V13H3Z"/><path fill="blue" d="M10 0H20V20H10Z"/></svg>') })
    for (const [bevel, depth, thickness] of [[0.6, 0.6, 5], [0, 0.8, 5], [0, 0.6, 0.8]]) {
      for (const [label, value] of [['Bevel', bevel], ['Logo depth', depth], ['Thickness', thickness]] as const) {
        const input = page.getByRole('spinbutton', { name: label, exact: true })
        await input.fill(String(value))
        await input.press('Tab')
      }
      await page.getByText('Ready to export.', { exact: true }).waitFor()
      const preview = await page.evaluate(() => {
        const root = (document.querySelector('canvas')!.parentElement as any).__vueParentComponent.exposed.getCurrentGroup()
        const meshes: number[][][] = []
        root.traverse((node: any) => {
          if (!node.isMesh) return
          const { index, attributes: { position } } = node.geometry
          const vertices: number[][] = []
          for (let i = 0; i < (index?.count ?? position.count); i++) {
            const j = index ? index.getX(i) : i
            vertices.push([position.getX(j), position.getY(j), position.getZ(j)].map(v => +v.toFixed(5)))
          }
          meshes.push(vertices)
        })
        return meshes
      })
      const downloaded = page.waitForEvent('download')
      await page.getByRole('button', { name: 'Download .3mf', exact: true }).click()
      const download = await downloaded
      assert.equal(await download.failure(), null)
      const zip = await JSZip.loadAsync(readFileSync((await download.path())!))
      const xml = await zip.file('3D/3dmodel.model')!.async('string')
      const model = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' }).parse(xml).model
      const exported = model.resources.object.filter((object: any) => object.mesh).map(({ mesh }: any) => {
        const vertices = mesh.vertices.vertex.map(({ x, y, z }: any) => [+x, +y, +z])
        return mesh.triangles.triangle.flatMap(({ v1, v2, v3 }: any) => [vertices[v1], vertices[v2], vertices[v3]])
      })
      assert.deepEqual(exported, preview, '3MF must contain exactly the preview triangles, including both surface shells')
      const baseBottom = bevel > 0.01 ? -Math.min(bevel, thickness / 2 - 0.05) : 0
      for (const shell of exported.slice(1)) {
        const zs = [...new Set<number>(shell.map((v: number[]) => v[2]))].sort((a, b) => a - b)
        const expected = depth * 2 >= thickness ? [baseBottom, baseBottom + thickness]
          : [baseBottom, baseBottom + depth, baseBottom + thickness - depth, baseBottom + thickness]
        assert.deepEqual(zs, expected.map(z => +z.toFixed(5)))
      }
    }
    await page.getByText('Limited to 0.4 mm per face (half the plate thickness).', { exact: true }).waitFor()
    await page.reload()
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    assert.equal(await page.getByRole('slider', { name: 'Logo depth', exact: true }).inputValue(), '0.6')
    await page.getByText('Limited to 0.4 mm per face (half the plate thickness).', { exact: true }).waitFor()
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
    assert.equal(await page.evaluate(() => localStorage.getItem('keychain-maker:front:svg:v1')), null)
    assert.equal(await page.getByRole('button', { name: 'Download .3mf', exact: true }).isDisabled(), true)
  } finally {
    await page.close()
  }
})

test('the SVG import report shows safe cleanup and reports unsupported replacement artwork', async () => {
  const page = await browser.newPage()
  try {
    await page.goto(url)
    const input = page.locator('input[type="file"]').first()
    const source = '<svg xmlns="http://www.w3.org/2000/svg"><metadata>Editor data</metadata><path fill="black" style="fill:#ffffff;fill-rule:evenodd" d="M0 0H20V20H0Z M5 5H15V15H5Z"/></svg>'
    await input.setInputFiles({ name: 'prepared.svg', mimeType: 'image/svg+xml', buffer: Buffer.from(source) })
    const report = page.getByRole('region', { name: 'SVG import report', exact: true })
    await report.getByText('Ready: 1 colors, 1 filled shapes.', { exact: true }).waitFor()
    await report.getByText('Removed 1 non-rendering metadata elements.', { exact: true }).waitFor()
    await report.getByText('Normalized inline fills/styles on 1 elements.', { exact: true }).waitFor()
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    assert.equal(await page.locator('svg.logo-preview path[fill="#ffffff"]').count(), 1)
    assert.equal(await page.evaluate(() => localStorage.getItem('keychain-maker:front:svg:v1')), source)
    await input.setInputFiles({ name: 'text.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg><text>Convert me</text></svg>') })
    await report.getByRole('alert').filter({ hasText: 'Convert text to paths' }).waitFor()
    assert.equal(await report.getByText(/Normalized inline/).count(), 0)
  } finally {
    await page.close()
  }
})

test('printability advice appears near settings and does not block a valid export', async () => {
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
  try {
    await page.goto(url)
    await page.locator('input[type="file"]').first().setInputFiles('test-svg/c1.svg')
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

test('outline complexity advice starts above 500 refined points, including holes, without blocking export', async () => {
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
  try {
    await page.goto(url)
    const simplify = page.getByRole('slider', { name: 'Simplify', exact: true })
    await simplify.fill('0')
    const advice = page.locator('.three-frame').getByRole('button', { name: 'Outline complexity warning', exact: true })
    const download = page.getByRole('button', { name: 'Download .3mf', exact: true })
    const ring = (count: number, radius: number) => Array.from({ length: count }, (_, i) => {
      const angle = i / count * Math.PI * 2
      return `${i ? 'L' : 'M'}${(Math.cos(angle) * radius).toFixed(8)} ${(Math.sin(angle) * radius).toFixed(8)}`
    }).join('') + 'Z'

    for (const points of [500, 501]) {
      await page.locator('input[type="file"]').first().setInputFiles({ name: `outline-${points}.svg`, mimeType: 'image/svg+xml',
        buffer: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="${ring(250, 50)}${ring(points - 250, 25)}"/></svg>`) })
      await page.getByText(`${points} outline points.`, { exact: true }).waitFor()
      await page.getByText('Ready to export.', { exact: true }).waitFor()
      assert.equal(await advice.count(), points > 500 ? 1 : 0)
      assert.equal(await download.isEnabled(), true, 'complexity advice must allow valid exports')
    }
    await advice.hover()
    const tooltip = page.getByRole('tooltip').filter({ hasText: 'Over 500 outline points' })
    await tooltip.waitFor()
    assert.match(await tooltip.innerText(), /Increase Simplify/)
    await page.screenshot({ path: 'test-output/outline-warning-tooltip.png' })
    await advice.focus()
    await advice.press('Escape')
    await tooltip.waitFor({ state: 'hidden' })

    await simplify.fill('0.02')
    await advice.waitFor({ state: 'hidden' })
    await simplify.fill('0')
    await advice.waitFor()
    await page.locator('input[type="file"]').first().setInputFiles({ name: 'simple.svg', mimeType: 'image/svg+xml',
      buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100"/></svg>') })
    await advice.waitFor({ state: 'hidden' })
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    assert.equal(await download.isEnabled(), true)
  } finally {
    await page.close()
  }
})

test('tiny-island advice follows print size, nozzle, and cleanup without blocking export', async () => {
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
  try {
    await page.goto(url)
    await page.locator('input[type="file"]').first().setInputFiles({ name: 'tiny.svg', mimeType: 'image/svg+xml',
      buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100"/><rect x="101" width="0.6" height="0.6"/></svg>') })
    const advice = page.getByRole('status').filter({ hasText: 'tiny logo island' })
    const download = page.getByRole('button', { name: 'Download .3mf', exact: true })
    await advice.waitFor()
    assert.match(await advice.innerText(), /1 tiny logo island\s+smaller than 0.8 mm across/)
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    assert.equal(await download.isEnabled(), true)

    const width = page.getByRole('spinbutton', { name: 'Width', exact: true })
    await width.fill('150')
    await width.press('Tab')
    await advice.waitFor({ state: 'hidden' })
    const nozzle = page.getByRole('spinbutton', { name: 'Nozzle', exact: true })
    await nozzle.fill('0.8')
    await nozzle.press('Tab')
    await advice.waitFor()

    await page.getByRole('checkbox', { name: 'Print logo' }).uncheck()
    await advice.waitFor({ state: 'hidden' })
    await page.getByRole('checkbox', { name: 'Print logo' }).check()
    await advice.waitFor()
    await advice.getByRole('button', { name: 'remove them' }).click()
    await advice.waitFor({ state: 'hidden' })
    assert.equal(await page.getByRole('spinbutton', { name: 'Small bits', exact: true }).inputValue(), '1.60')
    await page.getByText('Ready to export.', { exact: true }).waitFor()
    assert.equal(await download.isEnabled(), true)
  } finally {
    await page.close()
  }
})

for (const width of [390, 1400]) {
  test(`thin-area visibility stays synchronized between 2D previews at ${width}px`, async () => {
    const page = await browser.newPage({ viewport: { width, height: 900 }, hasTouch: width === 390 })
    try {
      await page.goto(url)
      await page.locator('input[type="file"]').first().setInputFiles({ name: 'thin.svg', mimeType: 'image/svg+xml',
        buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0H100V49H120V51H100V100H0Z"/></svg>') })
      const inline = page.locator('svg.logo-preview').first()
      const inlineToggle = page.locator('.control-panel').getByRole('checkbox', { name: 'Thin areas', exact: true })
      await inline.locator('path.thin').waitFor()
      await page.getByText('Ready to export.', { exact: true }).waitFor()
      assert.equal(await inlineToggle.isChecked(), true)

      await inlineToggle.uncheck()
      await inline.locator('path.thin').waitFor({ state: 'hidden' })
      await page.getByRole('button', { name: 'Enlarge preview', exact: true }).click()
      const panel = page.getByRole('region', { name: 'Logo preview', exact: true })
      const enlarged = panel.getByRole('img')
      const panelToggle = panel.getByRole('checkbox', { name: 'Thin areas', exact: true })
      assert.equal(await panelToggle.isChecked(), false)
      assert.equal(await enlarged.locator('path.thin').count(), 0)

      await panelToggle.check()
      assert.equal(await inlineToggle.isChecked(), true)
      assert.equal(await inline.locator('path.thin').getAttribute('d'), await enlarged.locator('path.thin').getAttribute('d'))
      await page.screenshot({ path: `test-output/thin-areas-${width}.png` })
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)

      await enlarged.hover()
      await page.mouse.wheel(0, -600)
      await panel.getByRole('button', { name: 'Fit', exact: true }).waitFor()
      const zoomedView = await enlarged.getAttribute('viewBox')
      await panel.getByRole('checkbox', { name: 'Edges and points' }).check()
      await panel.getByRole('checkbox', { name: 'Original outline' }).check()
      await panelToggle.uncheck()
      assert.equal(await inlineToggle.isChecked(), false)
      assert.equal(await page.locator('svg.logo-preview path.thin').count(), 0)
      assert.equal(await enlarged.getAttribute('viewBox'), zoomedView)
      assert.equal(await enlarged.locator('path.edges').count(), 1)
      assert.equal(await enlarged.locator('path.original').count(), 1)
      const nozzleWarning = page.getByRole('button', { name: 'Nozzle warning', exact: true })
      assert.equal(await nozzleWarning.count(), 1, 'hiding the overlay must preserve nozzle advice')

      await panel.getByRole('button', { name: 'Close', exact: true }).click()
      if (width === 390) await nozzleWarning.tap()
      else await nozzleWarning.focus()
      const nozzleTooltip = page.getByRole('tooltip').filter({ hasText: '2 nozzle widths' })
      await nozzleTooltip.waitFor()
      assert.match(await nozzleTooltip.innerText(), /1 thin area under 0.8 mm.*may not print/)
      await page.screenshot({ path: `test-output/nozzle-warning-${width}.png` })
      const tooltipBox = await nozzleTooltip.boundingBox()
      assert.ok(tooltipBox && tooltipBox.x >= 0 && tooltipBox.x + tooltipBox.width <= width)
      assert.ok(tooltipBox && tooltipBox.y >= 0 && tooltipBox.y + tooltipBox.height <= 900)
      await nozzleWarning.press('Escape')
      await nozzleTooltip.waitFor({ state: 'hidden' })
      await inlineToggle.check()
      await inline.locator('path.thin').waitFor()
      await page.getByRole('button', { name: 'Enlarge preview', exact: true }).click()
      assert.equal(await panelToggle.isChecked(), true, 'reopening must preserve overlay visibility')
      await enlarged.locator('path.thin').waitFor()
      assert.equal(await page.getByRole('button', { name: 'Download .3mf', exact: true }).isEnabled(), true)
    } finally {
      await page.close()
    }
  })
}

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
    await page.locator('input[type="file"]').first().setInputFiles('test-svg/c1.svg')
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
    await page.locator('input[type="file"]').first().setInputFiles('test-svg/c1.svg')
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
      await page.locator('input[type="file"]').first().setInputFiles('test-svg/c1.svg')
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
