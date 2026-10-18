/**
 * Latency probe: drives the real app in headless Chromium and measures the time
 * from a slider `input` event to the finished frame on screen.
 *
 *   bun run measure [svgPath] [gl]
 *
 *   gl  "swiftshader" (default, CPU-emulated WebGL) or "gpu" (ANGLE on the real GPU)
 *
 * Phases reported per change:
 *   debounce  input event -> rebuild() starts (the setTimeout in ThreeViewer)
 *   build     rebuild() mesh generation (from the dev Profiler's total)
 *   toFrame   build end -> the rAF that draws the new scene starts
 *   render    that rAF's draw calls + gl.finish() (GPU work forced to complete)
 *   total     input event -> frame finished
 */
import { createServer } from 'vite'
import { chromium } from 'playwright'

const svgPath = process.argv[2] ?? 'test-svg/c1.svg'
const glMode = process.argv[3] ?? 'swiftshader'

const server = await createServer({ base: '/', server: { port: 0 }, logLevel: 'warn' })
await server.listen()
const url = `http://localhost:${server.config.server.port}/`

const args = glMode === 'gpu'
  ? ['--use-gl=angle', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist']
  : ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
const browser = await chromium.launch({ headless: true, args })

// Runs in the page before any app code: timestamps build-profiler output and
// every rAF callback that issues WebGL draws (forcing GPU completion so the
// recorded end is when the frame is actually done, not just submitted).
function instrument() {
  const w = window as any
  w.__probe = { builds: [] as any[], frames: [] as any[] }
  let draws = 0
  let lastGl: WebGLRenderingContext | null = null
  for (const Ctx of [WebGLRenderingContext, WebGL2RenderingContext]) {
    for (const fn of ['drawElements', 'drawArrays']) {
      const orig = (Ctx.prototype as any)[fn]
      ;(Ctx.prototype as any)[fn] = function (...a: any[]) {
        draws++
        lastGl = this
        return orig.apply(this, a)
      }
    }
  }
  const origRaf = window.requestAnimationFrame.bind(window)
  window.requestAnimationFrame = (cb) => origRaf((ts) => {
    const start = performance.now()
    draws = 0
    cb(ts)
    if (draws > 0 && lastGl) {
      lastGl.finish()
      // finish() isn't a hard sync in every ANGLE backend; a 1px readback is.
      lastGl.readPixels(0, 0, 1, 1, lastGl.RGBA, lastGl.UNSIGNED_BYTE, new Uint8Array(4))
      w.__probe.frames.push({ start, end: performance.now(), draws })
    }
  })
  const origGroup = console.groupCollapsed.bind(console)
  console.groupCollapsed = (...a: any[]) => {
    const m = /\[keychain build\] total ([\d.]+)ms/.exec(String(a[0]))
    if (m) {
      const end = performance.now()
      w.__probe.builds.push({ start: end - parseFloat(m[1]), end })
      pendingPhases = true
    }
    return origGroup(...a)
  }
  // The profiler's console.table right after the group header holds the phases.
  let pendingPhases = false
  const origTable = console.table.bind(console)
  console.table = (data: any, ...rest: any[]) => {
    if (pendingPhases) {
      pendingPhases = false
      w.__probe.builds[w.__probe.builds.length - 1].phases = data
    }
    return origTable(data, ...rest)
  }
}

type Row = Record<string, number | string>
const fmt = (n: number) => +n.toFixed(1)

try {
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
  await page.addInitScript(instrument)
  page.on('pageerror', (e) => console.error('pageerror:', e.message))
  await page.goto(url, { waitUntil: 'load' })
  await page.waitForSelector('canvas')

  const renderer = await page.evaluate(() => {
    const gl = document.querySelector('canvas')!.getContext('webgl2') as WebGL2RenderingContext
    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)
  })
  console.log(`GL renderer: ${renderer}`)

  if (svgPath) {
    await page.setInputFiles('input[type="file"]', svgPath)
    await page.waitForFunction(() => (window as any).__probe.builds.length > 0, null, { timeout: 30000 })
    await page.waitForTimeout(1500) // let the camera-refit damping tail settle
  }
  const canvasSize = await page.evaluate(() => {
    const c = document.querySelector('canvas')!
    return `${c.width}x${c.height} (dpr ${devicePixelRatio})`
  })
  console.log(`canvas: ${canvasSize}, svg: ${svgPath || '(none)'}\n`)

  // Sets a range input the way a user drag does and returns the event time.
  async function setSlider(index: number, value: number): Promise<number> {
    return page.evaluate(([i, v]) => {
      const el = document.querySelectorAll<HTMLInputElement>('input[type="range"]')[i]
      el.value = String(v)
      const t = performance.now()
      el.dispatchEvent(new Event('input', { bubbles: true }))
      return t
    }, [index, value] as const)
  }

  // After a change, wait for the build and the first frame drawn after it.
  async function collect(inputT: number): Promise<Row> {
    await page.waitForFunction((t) => {
      const p = (window as any).__probe
      const b = p.builds.find((b: any) => b.start > t)
      return b && p.frames.some((f: any) => f.start >= b.end)
    }, inputT, { timeout: 30000 })
    return page.evaluate((t) => {
      const p = (window as any).__probe
      const b = p.builds.find((b: any) => b.start > t)
      const f = p.frames.find((f: any) => f.start >= b.end)
      return {
        debounce: b.start - t,
        build: b.end - b.start,
        toFrame: f.start - b.end,
        render: f.end - f.start,
        total: f.end - t,
        draws: f.draws,
      }
    }, inputT)
  }

  const sliders = [
    { name: 'baseThickness', i: 0, values: [4, 6, 3, 5] },
    { name: 'edgeBevel', i: 1, values: [1, 0.3, 0.8, 0.6] },
    { name: 'bevelSegments', i: 2, values: [4, 1, 3, 2] },
    { name: 'padding', i: 4, values: [3, 7, 4, 5] },
  ]

  const rows: Row[] = []
  for (const s of sliders) {
    for (const v of s.values) {
      const t = await setSlider(s.i, v)
      const r = await collect(t)
      rows.push({ change: `${s.name}=${v}`, ...Object.fromEntries(Object.entries(r).map(([k, n]) => [k, fmt(n as number)])) })
      await page.waitForTimeout(300)
    }
  }
  console.log('Single changes (ms):')
  console.table(rows)

  // A drag: one input per 16ms for ~1s. Measures how long after the *last*
  // input the frame lands, and whether anything rendered mid-drag.
  console.log('\nDrag simulation (baseThickness, 60 inputs @16ms):')
  const dragStart = await page.evaluate(() => performance.now())
  let lastT = 0
  for (let k = 0; k < 60; k++) {
    lastT = await setSlider(0, 3 + (k % 30) * 0.1)
    await page.waitForTimeout(16)
  }
  const drag = await collect(lastT)
  const midDragBuilds = await page.evaluate(([a, b]) =>
    (window as any).__probe.builds.filter((x: any) => x.start > a && x.start < b).length, [dragStart, lastT])
  console.table([{
    buildsDuringDrag: midDragBuilds,
    afterLastInput_debounce: fmt(drag.debounce as number),
    build: fmt(drag.build as number),
    render: fmt(drag.render as number),
    total: fmt(drag.total as number),
  }])

  // Average per-phase breakdown over all post-upload builds.
  const phases = await page.evaluate(() => {
    const builds = (window as any).__probe.builds.slice(1).filter((b: any) => b.phases)
    const sum: Record<string, number> = {}
    for (const b of builds) for (const p of b.phases) sum[p.phase] = (sum[p.phase] ?? 0) + p.ms
    return Object.entries(sum).map(([phase, ms]) => ({ phase, avgMs: +(ms / builds.length).toFixed(1) }))
      .sort((a, b) => b.avgMs - a.avgMs)
  })
  console.log('\nBuild phase breakdown (avg over all slider builds; nested phases overlap their parents):')
  console.table(phases)
} finally {
  await browser.close()
  await server.close()
}
