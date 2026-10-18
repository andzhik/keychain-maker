import { expect, test } from 'bun:test'
import { DEFAULT_CONFIG } from '../../src/types/keychain'
import { loadState, sanitizeConfig, saveConfig, saveShowLogo, saveSvg } from '../../src/utils/persistence'

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
  expect(loadState(memoryStorage())).toEqual({ config: DEFAULT_CONFIG, showLogo: true, svg: null })
})

test('no storage at all loads the defaults', () => {
  expect(loadState(null)).toEqual({ config: DEFAULT_CONFIG, showLogo: true, svg: null })
})

test('saved state round-trips', () => {
  const storage = memoryStorage()
  const config = { ...DEFAULT_CONFIG, basePlateShape: 'circle' as const, padding: 7, baseColor: '#112233' }
  saveConfig(config, storage)
  saveShowLogo(false, storage)
  saveSvg('<svg/>', storage)

  expect(loadState(storage)).toEqual({ config, showLogo: false, svg: '<svg/>' })
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
