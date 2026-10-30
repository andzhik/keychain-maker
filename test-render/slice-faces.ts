// Run after `bun run test:browser` to validate its actual downloads in Bambu Studio.
import assert from 'node:assert/strict'
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { resolve, join, dirname } from 'node:path'
import { spawnSync } from 'node:child_process'
import JSZip from 'jszip'

const outline = process.argv.includes('--outline')
const keyring = process.argv.includes('--keyring')
const executable = process.argv.slice(2).find(arg => !arg.startsWith('--')) ?? 'C:/Program Files/Bambu Studio/bambu-studio.exe'
const profiles = join(dirname(executable), 'resources/profiles/BBL')
const out = resolve('test-output/face-slicer')
await mkdir(out, { recursive: true })

async function flatten(type: string, name: string): Promise<Record<string, unknown>> {
  const value = JSON.parse(await readFile(join(profiles, type, name + '.json'), 'utf8'))
  const parent = value.inherits ? await flatten(type, value.inherits) : {}
  const merged = { ...parent, ...value }
  delete merged.inherits
  return merged
}
for (const [type, name] of [
  ['machine', 'Bambu Lab X1 Carbon 0.4 nozzle'],
  ['process', '0.20mm Standard @BBL X1C'],
  ['filament', 'Bambu PLA Basic @BBL X1C'],
]) {
  const settings = await flatten(type, name)
  if (type === 'process') Object.assign(settings, {
    layer_height: '0.2', initial_layer_print_height: '0.2', enable_prime_tower: '1', sparse_infill_density: '15%',
    ...(keyring ? { enable_arc_fitting: '0' } : {}),
  })
  await writeFile(join(out, `${type}.json`), JSON.stringify(settings))
}

interface Segment { from: number[]; to: number[]; color: string; feature: string }
function toolpaths(gcode: string, colors: string[]) {
  const layers: { z: number; segments: Segment[] }[] = []
  let tool = 0, x = 0, y = 0, relative = false, feature = ''
  for (const line of gcode.split(/\r?\n/)) {
    if (line.startsWith('; Z_HEIGHT:')) layers.push({ z: +line.split(':')[1], segments: [] })
    const selection = line.match(/^T(\d+)\s*$/)
    if (selection) {
      // Bambu's startup T1000/T1100 commands are calibration operations, not
      // filament selections. Single-color jobs may never emit a later T0.
      if (+selection[1] < colors.length) tool = +selection[1]
      feature = ''
    }
    if (line.startsWith('; FEATURE:')) feature = line.slice(11).trim()
    if (/^M620\b/.test(line)) feature = ''
    if (/^G91\b/.test(line)) relative = true
    if (/^G90\b/.test(line)) relative = false
    if (!/^G[01]\s/.test(line)) continue
    const fields = Object.fromEntries([...line.split(';')[0].matchAll(/\b([XYE])(-?[\d.]+)/g)].map(m => [m[1], +m[2]]))
    const nx = fields.X == null ? x : fields.X + (relative ? x : 0)
    const ny = fields.Y == null ? y : fields.Y + (relative ? y : 0)
    if (layers.length && fields.E > 0 && (nx !== x || ny !== y)
      && /^(Inner wall|Outer wall|Bottom surface|Top surface|Internal solid infill|Sparse infill|Gap infill|Overhang wall|Bridge)$/.test(feature)) {
      layers.at(-1)!.segments.push({ from: [x, y], to: [nx, ny], color: colors[tool].toLowerCase(), feature })
    }
    x = nx; y = ny
  }
  return layers
}

async function slice(name: string, file: string) {
  const dir = join(out, name)
  await mkdir(dir, { recursive: true })
  const zip = await JSZip.loadAsync(await readFile(file))
  const originalModel = await zip.file('3D/3dmodel.model')!.async('string')
  // The installed CLI is 1.9; the exporter's default header claims 2.4.
  // Match the CLI version and installed profiles, as in the issue #12 probe.
  // No vertices, triangles, transforms or part/material assignments change.
  zip.file('3D/3dmodel.model', originalModel.replace('BambuStudio-02.04.00.70', 'BambuStudio-01.09.07.52'))
  const settings = JSON.parse(await zip.file('Metadata/project_settings.config')!.async('string'))
  Object.assign(settings, { printer_model: 'Bambu Lab X1 Carbon', printer_settings_id: 'Bambu Lab X1 Carbon 0.4 nozzle',
    print_settings_id: '0.20mm Standard @BBL X1C', curr_bed_type: 'Textured PEI Plate',
    initial_layer_print_height: '0.2', enable_prime_tower: '1' })
  // The keyring probe measures distances to extrusion segments; keep curves
  // as linear G-code rather than fitted G2/G3 arcs, which this parser omits.
  if (keyring) settings.enable_arc_fitting = '0'
  const colors: string[] = settings.filament_colour
  settings.flush_volumes_matrix = Array.from({ length: colors.length ** 2 }, (_, i) => i % (colors.length + 1) === 0 ? '0' : '280')
  settings.flush_volumes_vector = Array(colors.length * 2).fill('140')
  settings.flush_multiplier = '1'
  zip.file('Metadata/project_settings.config', JSON.stringify(settings))
  const input = join(dir, 'input.3mf')
  await writeFile(input, await zip.generateAsync({ type: 'nodebuffer' }))
  await rm(join(dir, 'plate_1.gcode'), { force: true })
  await rm(join(dir, 'sliced.3mf'), { force: true })
  const run = spawnSync(executable, ['--debug', '3', '--load-settings', `${join(out, 'machine.json')};${join(out, 'process.json')}`,
    '--load-filaments', Array(colors.length).fill(join(out, 'filament.json')).join(';'),
    '--orient', '0', '--arrange', '0', '--slice', '0', '--outputdir', dir,
    '--export-3mf', 'sliced.3mf', input], { windowsHide: true, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, timeout: 60000 })
  await writeFile(join(dir, 'bambu.log'), (run.stdout ?? '') + (run.stderr ?? ''))
  assert.equal(run.status, 0, `${name}: Bambu failed; see bambu.log`)
  const gcode = await readFile(join(dir, 'plate_1.gcode'), 'utf8')
  const layers = toolpaths(gcode, colors)
  return { dir, colors, layers }
}

const results = []
if (!outline && !keyring) {
  for (const scenario of ['different', 'front-mirrored', 'back-mirrored', 'front-only', 'back-only']) {
    for (const [bevel, thickness] of [[0.6, 5], [0, 0.8], [0.3, 0.8]]) {
      const name = `${scenario}-${bevel}-${thickness}`
      const { dir, colors, layers } = await slice(name, `test-output/faces-${name}.3mf`)
      assert.equal(layers.length, Math.round(thickness / 0.2))
      const depth = Math.min(0.6, thickness / 2)
      for (const layer of layers) {
        const used = new Set(layer.segments.map(s => s.color))
        assert.ok(used.has('#ffffff'), `${name} Z=${layer.z}: missing base material`)
        assert.equal(used.has('#ff0000'), scenario !== 'back-only' && layer.z > thickness - depth + 1e-4,
          `${name} Z=${layer.z}: Front color in wrong layer`)
        assert.equal(used.has('#0000ff'), scenario !== 'front-only' && layer.z <= depth + 1e-4,
          `${name} Z=${layer.z}: Back color in wrong layer`)
      }
      // Bambu may translate the object when adding its prime tower. Both test
      // glyphs are fitted by their bounds; recover the shared center from the
      // printed outline, keeping the orientation check independent of placement.
      const anchor = colors.includes('#ff0000') ? '#ff0000' : '#0000ff'
      const anchorPoints = layers.flatMap(l => l.segments.filter(s => s.color === anchor).flatMap(s => [s.from, s.to]))
      const cx = (Math.min(...anchorPoints.map(p => p[0])) + Math.max(...anchorPoints.map(p => p[0]))) / 2
      const cy = (Math.min(...anchorPoints.map(p => p[1])) + Math.max(...anchorPoints.map(p => p[1]))) / 2
      // Inspect actual extrusion paths in the asymmetric stems, not only tool IDs.
      for (const color of ['#ff0000', '#0000ff']) {
        if (!colors.includes(color)) continue
        const points = layers.flatMap(l => l.segments.filter(s => s.color === color).flatMap(s => [s.from, s.to]))
        const stem = points.filter(p => color === '#ff0000' ? p[1] < cy - 25 : p[1] > cy + 3)
        assert.ok(stem.length > 0, `${name}: missing ${color} stem`)
        assert.ok(stem.every(p => color === '#ff0000'
          ? scenario === 'front-mirrored' ? p[0] > cx + 9 : p[0] < cx - 9
          : scenario === 'back-mirrored' ? p[0] < cx - 14 : p[0] > cx + 14),
          `${name}: mirrored or misplaced outside-view text`)
      }
      const faces = [layers.at(-1)!, layers[0]]
      const paths = faces.map((layer, i) => {
        const path = layer.segments.map(s => `<path d="M${s.from[0] - cx},${cy - s.from[1]}L${s.to[0] - cx},${cy - s.to[1]}" stroke="${s.color === '#ffffff' ? '#9ca3af' : s.color}"/>`).join('')
        return `<g transform="translate(${i * 70 + 35},55)"><g transform="scale(${i ? -1 : 1},1)">${path}</g></g>`
      }).join('')
      await writeFile(join(dir, 'outside-views.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 110"><rect width="140" height="110" fill="white"/><g fill="none" stroke-width="0.35">${paths}</g><g font-family="sans-serif" font-size="4" text-anchor="middle"><text x="35" y="8">Front · outside</text><text x="105" y="8">Back · outside</text></g></svg>`)
      const result = { name, layers: layers.length, frontLayers: layers.filter(l => l.segments.some(s => s.color === '#ff0000')).length,
        backLayers: layers.filter(l => l.segments.some(s => s.color === '#0000ff')).length }
      results.push(result)
      console.log(result)
    }
  }
  for (const [name, expectedColors] of [['ui-blank', ['#ffffff']], ['ui-five-colors', ['#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00']]] as const) {
    const { colors, layers } = await slice(name, `test-output/${name}.3mf`)
    assert.equal(layers.length, 25, `${name}: expected a 5 mm plate at 0.2 mm layers`)
    const printed = new Set(layers.flatMap(layer => layer.segments.map(segment => segment.color)))
    assert.deepEqual([...printed].sort(), [...expectedColors].sort(), `${name}: actual sliced filaments must match the UI summary`)
    const result = { name, layers: layers.length, filaments: new Set(colors.map(color => color.toLowerCase())).size }
    results.push(result)
    console.log(result)
  }
  for (const matched of [false, true]) {
    const name = matched ? 'colors-after-match' : 'colors-before-match'
    const { colors, layers } = await slice(name, `test-output/${name}.3mf`)
    const backColor = matched ? '#ff0000' : '#fe0000'
    const expectedColors = ['#ffffff', '#ff0000', '#0000ff', '#00ff00', ...(matched ? [] : ['#fe0000'])]
    assert.deepEqual([...colors].sort(), expectedColors.sort(), `${name}: shared colors must use one filament slot`)
    assert.equal(layers.length, 25)
    for (const layer of layers) {
      const used = new Set(layer.segments.map(segment => segment.color))
      const front = layer.z > 4.4 + 1e-4
      const back = layer.z <= 0.6 + 1e-4
      assert.ok(used.has('#ffffff'), `${name} Z=${layer.z}: missing base material`)
      assert.equal(used.has('#0000ff'), front, `${name}: unchanged Front blue in wrong layer`)
      assert.equal(used.has('#00ff00'), back, `${name}: unchanged Back green in wrong layer`)
      assert.equal(used.has('#ff0000'), front || (matched && back), `${name}: shared red in wrong layer`)
      if (!matched) assert.equal(used.has(backColor), back, `${name}: original Back red in wrong layer`)
    }
    const frontPoints = layers.at(-1)!.segments.filter(s => s.color === '#ff0000').flatMap(s => [s.from, s.to])
    const backPoints = layers[0].segments.filter(s => s.color === backColor).flatMap(s => [s.from, s.to])
    const cx = (Math.min(...frontPoints.map(p => p[0])) + Math.max(...frontPoints.map(p => p[0]))) / 2
    const cy = (Math.min(...frontPoints.map(p => p[1])) + Math.max(...frontPoints.map(p => p[1]))) / 2
    const frontStem = frontPoints.filter(p => p[1] < cy - 25)
    const backStem = backPoints.filter(p => p[1] > cy + 3)
    assert.ok(frontStem.length && frontStem.every(p => p[0] < cx - 9), `${name}: Front F must retain its outside orientation`)
    assert.ok(backStem.length && backStem.every(p => p[0] > cx + 14), `${name}: Back L must retain its outside orientation`)
    const result = { name, layers: layers.length, filaments: colors.length,
      frontLayers: layers.filter(l => l.segments.some(s => s.color === '#0000ff')).length,
      backLayers: layers.filter(l => l.segments.some(s => s.color === '#00ff00')).length }
    results.push(result)
    console.log(result)
  }
}

// Issue #15: actual browser downloads, including a filled artwork counter,
// two-color concavities, zero border, disconnected-part recovery and two faces.
for (const name of outline ? ['star-2mm-keyring-bevel', 'star-zero-keyring-flat', 'star-front-only',
  'independent-faces', 'independent-back-mirrored', 'refined-silhouette', 'disconnected-joined', 'disconnected-hidden'] : []) {
  const { dir, colors, layers } = await slice(`outline-${name}`, `test-output/issue-15/${name}.3mf`)
  assert.equal(layers.length, 25, `${name}: expected a 5 mm plate at 0.2 mm layers`)
  const printed = new Set(layers.flatMap(l => l.segments.map(s => s.color)))
  assert.deepEqual([...printed].sort(), [...colors].sort(), `${name}: every exported filament must print`)
  for (const layer of layers) {
    const used = new Set(layer.segments.map(s => s.color))
    // At zero border with no counter, colored inlays cover the entire outside
    // face. The white material is required in the middle, not on that face.
    if (name !== 'disconnected-hidden' || layer.z > 0.6 + 1e-4 && layer.z <= 4.4 + 1e-4) {
      assert.ok(used.has('#ffffff'), `${name} Z=${layer.z}: missing backing material`)
    }
    if (layer.z > 0.6 + 1e-4 && layer.z <= 4.4 + 1e-4) {
      assert.deepEqual([...used], ['#ffffff'], `${name}: artwork must leave a solid middle`)
    }
    if (name === 'star-front-only' && layer.z <= 0.6 + 1e-4) assert.deepEqual([...used], ['#ffffff'])
    if (name === 'independent-faces' || name === 'independent-back-mirrored') {
      assert.equal(used.has('#16a34a'), layer.z <= 0.6 + 1e-4, `${name}: Back color in wrong layer`)
      assert.equal(used.has('#e85d50'), layer.z > 4.4 + 1e-4, `${name}: Front color in wrong layer`)
    }
  }
  if (name.startsWith('star-')) {
    // Recover placement from printed artwork; the circular counter is offset
    // slightly below the artwork's bounding-box center in this fixture.
    const top = layers.at(-1)!
    const art = top.segments.filter(s => s.color !== '#ffffff').flatMap(s => [s.from, s.to])
    const cx = (Math.min(...art.map(p => p[0])) + Math.max(...art.map(p => p[0]))) / 2
    const cy = (Math.min(...art.map(p => p[1])) + Math.max(...art.map(p => p[1]))) / 2
    assert.ok(top.segments.some(s => {
      if (s.color !== '#ffffff') return false
      const dx = s.to[0] - s.from[0], dy = s.to[1] - s.from[1]
      const t = Math.max(0, Math.min(1, ((cx - s.from[0]) * dx + (cy - 2 - s.from[1]) * dy) / (dx * dx + dy * dy)))
      return Math.hypot(s.from[0] + t * dx - cx, s.from[1] + t * dy - (cy - 2)) < 3
    }), `${name}: SVG hole must print as plate material`)
  }
  const points = layers.flatMap(l => l.segments.flatMap(s => [s.from, s.to]))
  const minX = Math.min(...points.map(p => p[0])), maxX = Math.max(...points.map(p => p[0]))
  const minY = Math.min(...points.map(p => p[1])), maxY = Math.max(...points.map(p => p[1]))
  const width = maxX - minX, height = maxY - minY
  const views = [layers.at(-1)!, layers[Math.floor(layers.length / 2)], layers[0]]
  const paths = views.map((layer, i) => `<g transform="translate(${i * (width + 10) + 5 - minX},${maxY + 7}) scale(1,-1)">${layer.segments.map(s =>
    `<path d="M${s.from.join(',')}L${s.to.join(',')}" stroke="${s.color === '#ffffff' ? '#8c949e' : s.color}"/>`).join('')}</g>`).join('')
  await writeFile(join(dir, 'toolpaths.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${(width + 10) * 3} ${height + 16}"><rect width="100%" height="100%" fill="white"/><g fill="none" stroke-width="0.25">${paths}</g></svg>`)
  const result = { name, layers: layers.length, filaments: colors.length }
  results.push(result)
  console.log(result)
}
if (keyring) {
  const manifest = JSON.parse(await readFile('test-output/issue-38/manifest.json', 'utf8')) as {
    name: string; hole: number[]; radius: number; bevel: number; neck: number[]; boxCenter: number[];
  }[]
  function distance(point: number[], segment: Segment) {
    const dx = segment.to[0] - segment.from[0], dy = segment.to[1] - segment.from[1]
    const t = Math.max(0, Math.min(1, ((point[0] - segment.from[0]) * dx + (point[1] - segment.from[1]) * dy) / (dx * dx + dy * dy)))
    return Math.hypot(segment.from[0] + t * dx - point[0], segment.from[1] + t * dy - point[1])
  }
  for (const scenario of manifest) {
    const { name, radius, bevel } = scenario
    const { dir, colors, layers } = await slice(`keyring-${name}`, `test-output/issue-38/${name}.3mf`)
    assert.equal(layers.length, 25, `${name}: expected a 5 mm plate at 0.2 mm layers`)
    const middle = layers[Math.floor(layers.length / 2)]
    const points = middle.segments.flatMap(s => [s.from, s.to])
    const center = [0, 1].map(axis => (Math.min(...points.map(p => p[axis])) + Math.max(...points.map(p => p[axis]))) / 2)
    // Arrangement translates the model; recover that translation from the
    // full middle-layer perimeter, allowing for half an extrusion's width.
    const shift = center.map((value, axis) => value - scenario.boxCenter[axis])
    const hole = scenario.hole.map((value, axis) => value + shift[axis])
    const neck = scenario.neck.map((value, axis) => value + shift[axis])
    for (const layer of layers) {
      const closest = layer.segments.reduce((best, segment) => distance(hole, segment) < distance(hole, best) ? segment : best)
      assert.ok(distance(hole, closest) > radius - bevel - 0.35,
        `${name} Z=${layer.z}: extrusion crosses the clear through-hole (${distance(hole, closest).toFixed(3)} mm from center)`)
      assert.ok(layer.segments.some(segment => segment.color === '#ffffff' && distance(neck, segment) < 0.85),
        `${name} Z=${layer.z}: missing reinforced neck material`)
    }
    // One exterior perimeter plus one hole perimeter: a detached loop would
    // introduce a third closed path in this all-base-material middle layer.
    const loops: Segment[][] = []
    for (const segment of middle.segments.filter(s => s.feature === 'Outer wall')) {
      const previous = loops.at(-1)?.at(-1)
      if (!previous || Math.hypot(previous.to[0] - segment.from[0], previous.to[1] - segment.from[1]) > 0.001) loops.push([])
      loops.at(-1)!.push(segment)
    }
    assert.equal(loops.length, 2, `${name}: expected one connected plate perimeter and one keyring hole`)
    // Bambu deliberately leaves a small extrusion gap at the seam; it must
    // still return to within one nozzle width of the start of each perimeter.
    for (const loop of loops) assert.ok(Math.hypot(loop[0].from[0] - loop.at(-1)!.to[0], loop[0].from[1] - loop.at(-1)!.to[1]) < 0.4,
      `${name}: the slicer perimeter must close within the seam allowance`)
    const paths = middle.segments.map(s => `<path d="M${s.from[0] - shift[0]},${-s.from[1] + shift[1]}L${s.to[0] - shift[0]},${-s.to[1] + shift[1]}"/>`).join('')
    await writeFile(join(dir, 'keyring-toolpaths.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-75 -75 150 150"><rect x="-75" y="-75" width="150" height="150" fill="white"/><g fill="none" stroke="#6b7280" stroke-width="0.25">${paths}</g><circle cx="${scenario.hole[0]}" cy="${-scenario.hole[1]}" r="${radius - bevel - 0.35}" fill="none" stroke="#ef4444" stroke-width="0.2"/></svg>`)
    const result = { name, layers: layers.length, filaments: colors.length, closedPerimeters: loops.length }
    results.push(result)
    console.log(result)
  }
}
await writeFile(join(out, keyring ? 'keyring-results.json' : outline ? 'outline-results.json' : 'results.json'), JSON.stringify(results, null, 2))
