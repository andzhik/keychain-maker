// Run after `bun run test:browser` to validate its actual downloads in Bambu Studio.
import assert from 'node:assert/strict'
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { resolve, join, dirname } from 'node:path'
import { spawnSync } from 'node:child_process'
import JSZip from 'jszip'

const executable = process.argv[2] ?? 'C:/Program Files/Bambu Studio/bambu-studio.exe'
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
  })
  await writeFile(join(out, `${type}.json`), JSON.stringify(settings))
}

interface Segment { from: number[]; to: number[]; color: string }
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
      layers.at(-1)!.segments.push({ from: [x, y], to: [nx, ny], color: colors[tool].toLowerCase() })
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
await writeFile(join(out, 'results.json'), JSON.stringify(results, null, 2))
