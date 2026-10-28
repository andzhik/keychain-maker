import { expect, test } from 'bun:test'
import { DEFAULT_CONFIG, DEFAULT_REFINEMENTS, DEFAULT_PRINTER } from '../../src/types/keychain'
import { loadState, loadFaces, loadPrinter, savePrinter, saveFace, saveFaceMetadata, sanitizeConfig, sanitizeRefinements, saveConfig, loadAdvanced, saveAdvanced, clearSession } from '../../src/utils/persistence'

function memoryStorage(): Storage {
  const data = new Map<string, string>()
  return {
    get length() { return data.size },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (i) => [...data.keys()][i] ?? null,
    removeItem: (key) => { data.delete(key) },
    setItem: (key, value) => {
      data.set(key, value)
    },
  }
}

test('empty storage loads the defaults', () => {
  expect(loadState(memoryStorage())).toEqual({ config: DEFAULT_CONFIG, svg: null, refinements: DEFAULT_REFINEMENTS })
})

test('no storage at all loads the defaults', () => {
  expect(loadState(null)).toEqual({ config: DEFAULT_CONFIG, svg: null, refinements: DEFAULT_REFINEMENTS })
})

test('saved config round-trips', () => {
  const storage = memoryStorage()
  const config = { ...DEFAULT_CONFIG, basePlateShape: 'circle' as const, padding: 7, baseColor: '#112233', logoDepth: 0.8, keyringAngle: 237 }
  saveConfig(config, storage)

  expect(loadState(storage)).toEqual({ config, svg: null, refinements: DEFAULT_REFINEMENTS })
})

test('advanced options default to hidden and survive Start over', () => {
  const storage = memoryStorage()
  expect(loadAdvanced(storage)).toBe(false)
  expect(loadAdvanced(null)).toBe(false)
  saveAdvanced(true, storage)
  storage.setItem('keychain-maker:showLogo:v1', 'false')
  clearSession(storage)
  expect(loadAdvanced(storage)).toBe(true)
  expect(storage.getItem('keychain-maker:showLogo:v1')).toBeNull()
})

test('fresh faces are unmirrored and printer settings migrate from Front only', () => {
  const storage = memoryStorage()
  expect(loadFaces(storage).back.mirror).toBe(false)
  expect(loadPrinter(storage)).toEqual(DEFAULT_PRINTER)
  storage.setItem('keychain-maker:refinements:v1', JSON.stringify({ ...DEFAULT_REFINEMENTS, nozzleDiameter: 0.25, thinWalls: true }))
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
  storage.setItem('keychain-maker:svg:v1', '<svg/>')
  const refinements = {
    ...DEFAULT_REFINEMENTS,
    recolor: { '#fe0101': '#ff0000' },
    hiddenColors: ['#ffffff'],
    hiddenShapes: ['#000000:3'],
    maxColors: 4,
    minSpeckSize: 0.5,
  }
  storage.setItem('keychain-maker:refinements:v1', JSON.stringify(refinements))
  const faces = loadFaces(storage)
  expect(faces.front.svg).toBe('<svg/>')
  expect(faces.front.refinements).toEqual(refinements)
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
  storage.setItem('keychain-maker:svg:v1', '<svg>old</svg>')
  const face = { ...loadFaces(storage).front, svg: '<svg>new</svg>' }
  saveFace('front', face, storage)
  storage.removeItem('keychain-maker:front:svg:v1')
  expect(loadFaces(storage).front.svg).toBeNull()
  expect(loadFaces(storage).front.importFailed).toBe(true)
})

for (const face of ['front', 'back'] as const) {
  test(`${face} artwork survives a metadata write failure after its SVG is saved`, () => {
    const storage = memoryStorage()
    const faces = loadFaces(storage)
    faces.front.svg = '<svg>front</svg>'
    faces.back = { ...faces.back, mode: 'artwork', svg: '<svg>back</svg>' }
    saveFace('front', faces.front, storage)
    saveFace('back', faces.back, storage)
    const other = face === 'front' ? 'back' : 'front'
    const updated = { ...faces[face], svg: `<svg>new ${face}</svg>` }
    const setItem = storage.setItem
    storage.setItem = (key, value) => {
      if (key === `keychain-maker:${face}:v1`) throw new Error('QuotaExceededError')
      setItem(key, value)
    }

    saveFace(face, updated, storage)

    expect(storage.getItem(`keychain-maker:${face}:svg:v1`)).toBe(updated.svg)
    const restored = loadFaces(storage)
    expect(restored[face].svg).toBe(updated.svg)
    expect(restored[face].mode).toBe('artwork')
    expect(restored[other]).toEqual(faces[other])
  })

  test(`${face} artwork survives a metadata-only save failure`, () => {
    const storage = memoryStorage()
    const settings = { ...loadFaces(storage)[face], mode: 'artwork' as const, svg: `<svg>${face}</svg>` }
    saveFace(face, settings, storage)
    storage.setItem = () => { throw new Error('QuotaExceededError') }

    saveFaceMetadata(face, { ...settings, fileName: 'new-name.svg' }, storage)

    expect(loadFaces(storage)[face].svg).toBe(settings.svg)
    expect(loadFaces(storage)[face].mode).toBe('artwork')
  })

  test(`${face} SVG with missing or corrupt metadata takes precedence over legacy state`, () => {
    const storage = memoryStorage()
    storage.setItem('keychain-maker:svg:v1', '<svg>legacy</svg>')
    storage.setItem('keychain-maker:refinements:v1', JSON.stringify({ ...DEFAULT_REFINEMENTS, hiddenColors: ['#ffffff'] }))
    const svg = `<svg>${face}</svg>`
    storage.setItem(`keychain-maker:${face}:svg:v1`, svg)
    for (const metadata of [null, '{invalid json', 'null', 'false', '42', '"invalid"', '[]']) {
      if (metadata === null) storage.removeItem(`keychain-maker:${face}:v1`)
      else storage.setItem(`keychain-maker:${face}:v1`, metadata)

      expect(loadFaces(storage)[face]).toEqual({ mode: 'artwork', svg,
        refinements: DEFAULT_REFINEMENTS, mirror: false, importFailed: false, fileName: null })
    }
  })
}

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

test('sessions saved before keyring positions restore the top attachment', () => {
  const { keyringAngle, ...oldConfig } = { ...DEFAULT_CONFIG, basePlateShape: 'outline' as const }
  expect(sanitizeConfig(oldConfig).keyringAngle).toBe(0)
  expect(sanitizeConfig({ keyringAngle: '90' }).keyringAngle).toBe(keyringAngle)
  expect(sanitizeConfig({ keyringAngle: Infinity }).keyringAngle).toBe(keyringAngle)
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
