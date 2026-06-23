/**
 * Headless render capture. Spins up Vite programmatically, drives the render
 * harness in headless Chromium, and writes one PNG per camera view so a render
 * can be inspected and compared offline.
 *
 *   bun run render [svgPath] [configJson]
 *
 * Must run under Node, not Bun: Playwright drives the browser over a stdio pipe
 * that Bun's child_process doesn't service, so launch() hangs. The `render`
 * script invokes Node with --experimental-strip-types for this reason.
 *
 *   svgPath     SVG to render (default: test-svg/c1.svg). Pass "" for a bare plate.
 *   configJson  Optional JSON of KeychainConfig overrides, e.g. '{"edgeBevel":0}'.
 *
 * Output: test-output/<svgName>-<view>.png
 */
import { createServer } from 'vite'
import { chromium } from 'playwright'
import { basename, extname, join } from 'node:path'
import { mkdir, writeFile, readFile } from 'node:fs/promises'

const svgPath = process.argv[2] ?? 'test-svg/c1.svg'
const overrides = process.argv[3] ? JSON.parse(process.argv[3]) : {}

const svgString = svgPath ? await readFile(svgPath, 'utf8') : ''
const stem = svgPath ? basename(svgPath, extname(svgPath)) : 'blank'

// base '/' regardless of any VITE_BASE_PATH in the environment — we serve locally.
const server = await createServer({ base: '/', server: { port: 0 } })
await server.listen()
const { port } = server.config.server
const url = `http://localhost:${port}/test-render/index.html`

// SwiftShader gives headless Chromium a working WebGL context with no GPU.
const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})

const failures: string[] = []
try {
  const page = await browser.newPage()
  page.on('console', (m) => { if (m.type() === 'error') failures.push(`console: ${m.text()}`) })
  page.on('pageerror', (e) => failures.push(`pageerror: ${e.message}`))

  await page.goto(url, { waitUntil: 'load' })
  await page.waitForFunction(() => typeof window.__renderKeychain === 'function')

  const results = await page.evaluate(
    ([svg, cfg]) => window.__renderKeychain(svg as string, cfg as object),
    [svgString, overrides] as const,
  )

  await mkdir('test-output', { recursive: true })
  for (const { name, dataURL } of results) {
    const png = Buffer.from(dataURL.split(',')[1], 'base64')
    const file = join('test-output', `${stem}-${name}.png`)
    await writeFile(file, png)
    console.log(`wrote ${file}`)
  }
} finally {
  await browser.close()
  await server.close()
}

if (failures.length) {
  console.error('\nBrowser errors during render:')
  for (const f of failures) console.error('  ' + f)
  process.exit(1)
}
