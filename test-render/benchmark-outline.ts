// Compare mesh construction in Chromium, excluding debounce, rendering and import.
// bun run benchmark:outline [svg paths...] [--raw]
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createServer } from 'vite'
import { chromium } from 'playwright'

const paths = process.argv.slice(2).filter(arg => !arg.startsWith('--'))
const fixtures = (paths.length ? paths : ['test-svg/outline-star.svg', 'test-svg/c1.svg', 'test-svg/smile-heart.svg'])
  .map(path => ({ path, svg: readFileSync(path, 'utf8') }))
const raw = process.argv.includes('--raw')
const server = await createServer({ base: '/', server: { port: 0 }, logLevel: 'error' })
let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined
try {
  await server.listen()
  browser = await chromium.launch({ headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
  const page = await browser.newPage()
  // Fetch modules without mounting the app or creating a renderer.
  await page.goto(`http://localhost:${server.config.server.port}/favicon.svg`)
  const rows = await page.evaluate(async ({ fixtures, raw }) => {
    const load = (path: string) => import(/* @vite-ignore */ path)
    const [{ svgToShapes }, { simplifyGroups }, { fitGroups }, { buildKeychainModel },
      { DEFAULT_CONFIG, DEFAULT_REFINEMENTS }, { Profiler }, { disposeObject }] = await Promise.all([
      load('/src/utils/svgToShapes.ts'), load('/src/utils/simplify.ts'), load('/src/utils/logoFit.ts'),
      load('/src/domain/keychainModel.ts'), load('/src/types/keychain.ts'), load('/src/utils/profiler.ts'),
      load('/src/three/sceneLifecycle.ts'),
    ])
    class Timing extends Profiler {
      phases: Record<string, number> = {}
      measure(name: string, fn: () => any) {
        const start = performance.now()
        const result = fn()
        this.phases[name] = performance.now() - start
        return result
      }
      flush() {}
    }
    const rows = []
    const median = (values: number[]) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)]
    for (const { path, svg } of fixtures) {
      const parsed = svgToShapes(svg)
      if (!parsed.ok) throw new Error(`${path}: ${parsed.error.message}`)
      for (const basePlateShape of ['square', 'outline']) {
        const config = { ...DEFAULT_CONFIG, basePlateShape }
        const groups = raw ? parsed.groups : simplifyGroups(parsed.groups,
          DEFAULT_REFINEMENTS.simplifyTolerance / fitGroups(parsed.groups, config).scale).groups
        const artwork = { front: { groups, mirror: false }, back: { groups, mirror: false } }
        const samples = []
        let triangles = 0
        // Warm caches/JIT twice, then report five samples. Every call builds
        // fresh geometry; no timing includes parsing, refinement or disposal.
        for (let i = 0; i < 7; i++) {
          const timer = new Timing('outline benchmark')
          const start = performance.now()
          const result = buildKeychainModel(artwork, config, timer)
          const total = performance.now() - start
          if (!result.ok) throw new Error(`${path}: ${result.error.message}`)
          triangles = 0
          result.model.root.traverse((node: any) => {
            if (node.isMesh) triangles += (node.geometry.index?.count ?? node.geometry.attributes.position.count) / 3
          })
          disposeObject(result.model.root)
          if (i >= 2) samples.push({ total, ...timer.phases })
        }
        const phase = (name: string) => +median(samples.map(s => s[name] ?? 0)).toFixed(1)
        rows.push({ file: path, shape: basePlateShape, total: phase('total'),
          silhouette: phase('offset plate silhouette'), plate: phase('buildBasePlate'),
          recesses: phase('cutoutBasePlateHoles'), triangles })
      }
    }
    return rows
  }, { fixtures, raw })
  console.log(`Chromium mesh build medians (ms); simplification ${raw ? 'off' : 'at default 0.02 mm'}`)
  console.table(rows)
  mkdirSync('test-output', { recursive: true })
  writeFileSync('test-output/outline-performance.json', JSON.stringify({ raw, samples: 5, rows }, null, 2))
} finally {
  await browser?.close()
  await server.close()
}
