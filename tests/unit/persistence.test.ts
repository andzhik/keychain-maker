import { expect, test } from 'bun:test'
import { DEFAULT_CONFIG, DEFAULT_REFINEMENTS, DEFAULT_PRINTER } from '../../src/types/keychain'
import { loadState, loadFaces, loadPrinter, savePrinter, saveFace, sanitizeConfig, sanitizeRefinements, saveConfig, saveRefinements, saveShowLogo, saveSvg } from '../../src/utils/persistence'

function memoryStorage(quota = Infinity): Storage {
  const data = new Map<string, string>()
  return {
    get length() { return data.size },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (i) => [...data.keys()][i] ?? null,
    removeItem: (key) => { data.delete(key) },
    setItem: (key, value) => {
      if (value.length > quota) throw new Error('QuotaExceededError')
      data.set(key, value)
    },
  }
}

test('empty storage loads the defaults', () => {
  expect(loadState(memoryStorage())).toEqual({ config: DEFAULT_CONFIG, showLogo: true, svg: null, refinements: DEFAULT_REFINEMENTS })
})

test('no storage at all loads the defaults', () => {
  expect(loadState(null)).toEqual({ config: DEFAULT_CONFIG, showLogo: true, svg: null, refinements: DEFAULT_REFINEMENTS })
})

test('saved state round-trips', () => {
  const storage = memoryStorage()
  const config = { ...DEFAULT_CONFIG, basePlateShape: 'circle' as const, padding: 7, baseColor: '#112233', logoDepth: 0.8 }
  saveConfig(config, storage)
  saveShowLogo(false, storage)
  saveSvg('<svg/>', storage)
  const refinements = {
    ...DEFAULT_REFINEMENTS,
    recolor: { '#fe0101': '#ff0000' },
    hiddenColors: ['#ffffff'],
    hiddenShapes: ['#000000:3'],
    maxColors: 4,
    minSpeckSize: 0.5,
  }
  saveRefinements(refinements, storage)

  expect(loadState(storage)).toEqual({ config, showLogo: false, svg: '<svg/>', refinements })
})

test('fresh faces are unmirrored and printer settings migrate from Front only', () => {
  const storage = memoryStorage()
  expect(loadFaces(storage).back.mirror).toBe(false)
  expect(loadPrinter(storage)).toEqual(DEFAULT_PRINTER)
  saveRefinements({ ...DEFAULT_REFINEMENTS, nozzleDiameter: 0.25, thinWalls: true } as any, storage)
  expect(loadPrinter(storage)).toEqual({ nozzleDiameter: 0.25, thinWalls: true })
  storage.setItem('keychain-maker:front:v1', JSON.stringify({ refinements: { nozzleDiameter: 0.2, thinWalls: true } }))
  storage.setItem('keychain-maker:back:v1', JSON.stringify({ refinements: { nozzleDiameter: 0.8, thinWalls: false } }))
  expect(loadPrinter(storage)).toEqual({ nozzleDiameter: 0.2, thinWalls: true })
  savePrinter({ nozzleDiameter: 0.6, thinWalls: false }, storage)
  expect(loadPrinter(storage)).toEqual({ nozzleDiameter: 0.6, thinWalls: false })
  storage.setItem('keychain-maker:printer:v1', JSON.stringify({ nozzleDiameter: -1, thinWalls: 'yes' }))
  expect(loadPrinter(storage)).toEqual(DEFAULT_PRINTER)
})

test('old single-image sessions migrate to the same physical artwork and independent mirrors', () => {
  const storage = memoryStorage()
  saveSvg('<svg/>', storage)
  saveRefinements({ ...DEFAULT_REFINEMENTS, hiddenColors: ['#ffffff'] }, storage)
  const faces = loadFaces(storage)
  expect(faces.front.svg).toBe('<svg/>')
  expect(faces.front.refinements.hiddenColors).toEqual(['#ffffff'])
  expect(faces.front.mirror).toBe(false)
  expect(faces.back.mode).toBe('same')
  expect(faces.back.mirror).toBe(true)
})

test('separate sources, edits, failed imports and empty selections survive reload', () => {
  const storage = memoryStorage()
  const faces = loadFaces(storage)
  faces.front = { ...faces.front, svg: '<svg>front</svg>', mode: 'empty', mirror: true,
    refinements: { ...faces.front.refinements, hiddenShapes: ['#ffffff:0'] } }
  faces.back = { ...faces.back, svg: '<svg>back</svg>', mode: 'artwork', mirror: false, importFailed: true }
  saveFace('front', faces.front, storage)
  saveFace('back', faces.back, storage)
  expect(loadFaces(storage)).toEqual(faces)
  faces.back.mode = 'same'
  saveFace('back', faces.back, storage)
  expect(loadFaces(storage).back.svg).toBe('<svg>back</svg>')
})

test('a missing saved face SVG is a failure and cannot resurrect legacy artwork', () => {
  const storage = memoryStorage()
  saveSvg('<svg>old</svg>', storage)
  const face = { ...loadFaces(storage).front, svg: '<svg>new</svg>' }
  saveFace('front', face, storage)
  storage.removeItem('keychain-maker:front:svg:v1')
  expect(loadFaces(storage).front.svg).toBeNull()
  expect(loadFaces(storage).front.importFailed).toBe(true)
})

test('an SVG over the quota is dropped without losing the config', () => {
  const storage = memoryStorage(1000)
  saveSvg('<svg/>', storage)
  saveSvg('x'.repeat(2000), storage)
  saveConfig({ ...DEFAULT_CONFIG, padding: 3 }, storage)

  const state = loadState(storage)
  expect(state.svg).toBeNull()
  expect(state.config.padding).toBe(3)
})

test('corrupt config JSON falls back to the defaults', () => {
  const storage = memoryStorage()
  storage.setItem('keychain-maker:config:v1', '{not json')

  expect(loadState(storage).config).toEqual(DEFAULT_CONFIG)
})

test('unknown, mistyped and missing fields are ignored', () => {
  const config = sanitizeConfig({
    padding: 'wide',
    targetWidth: null,
    cornerRadius: 2,
    basePlateShape: 'hexagon',
    somethingElse: 1,
  })

  expect(config).toEqual({ ...DEFAULT_CONFIG, cornerRadius: 2 })
})

test('sessions saved before surface inlays use the new default depth', () => {
  const { logoDepth, ...oldConfig } = DEFAULT_CONFIG
  expect(sanitizeConfig(oldConfig).logoDepth).toBe(0.6)
  expect(sanitizeConfig({ logoDepth: '0.8' }).logoDepth).toBe(logoDepth)
  expect(sanitizeConfig({ logoDepth: Infinity }).logoDepth).toBe(logoDepth)
})

test('malformed refinements are ignored field by field', () => {
  const refinements = sanitizeRefinements({
    recolor: { '#ff0000': 'red', '#00ff00': '#0000ff', bad: '#000000' },
    hiddenColors: ['#ffffff', 3, 'white'],
    hiddenShapes: 'all',
    maxColors: -1,
    minSpeckSize: 1.5,
    nozzleDiameter: Infinity,
    thinWalls: 'yes',
  })

  expect(refinements).toEqual({
    ...DEFAULT_REFINEMENTS,
    recolor: { '#00ff00': '#0000ff' },
    hiddenColors: ['#ffffff'],
    minSpeckSize: 1.5,
  })
})

test('a saved speck area converts to the width of a disc with that area', () => {
  expect(sanitizeRefinements({ minSpeckArea: Math.PI }).minSpeckSize).toBe(2)
  expect(sanitizeRefinements({ minSpeckArea: 2, minSpeckSize: 0.3 }).minSpeckSize).toBe(0.3)
})
