import { DEFAULT_CONFIG, DEFAULT_REFINEMENTS, type KeychainConfig, type Refinements } from '../types/keychain'

// Separate keys so an SVG too big for the storage quota doesn't take the
// (tiny) config down with it.
const CONFIG_KEY = 'keychain-maker:config:v1'
const SHOW_LOGO_KEY = 'keychain-maker:showLogo:v1'
const SVG_KEY = 'keychain-maker:svg:v1'
const REFINEMENTS_KEY = 'keychain-maker:refinements:v1'

export interface PersistedState {
  config: KeychainConfig
  showLogo: boolean
  svg: string | null
  refinements: Refinements
}

/** localStorage, or null where it's missing or throws (private mode, blocked site data). */
function defaultStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null
  } catch {
    return null
  }
}

function read(storage: Storage | null, key: string): string | null {
  try {
    return storage?.getItem(key) ?? null
  } catch {
    return null
  }
}

function write(storage: Storage | null, key: string, value: string | null) {
  try {
    if (value === null) storage?.removeItem(key)
    else storage?.setItem(key, value)
  } catch (e) {
    // Quota exceeded or storage blocked: persistence is best-effort. Drop the
    // stale value so a reload doesn't pair the new config with an old SVG.
    console.warn(`Could not save ${key}:`, e)
    try { storage?.removeItem(key) } catch { /* nothing more to do */ }
  }
}

/**
 * Merges a stored config onto the defaults, keeping only known fields whose
 * type matches. Fields added in later versions fall back to their defaults,
 * and anything malformed is ignored rather than breaking the build.
 */
export function sanitizeConfig(raw: unknown): KeychainConfig {
  const config: KeychainConfig = { ...DEFAULT_CONFIG }
  if (!raw || typeof raw !== 'object') return config
  const source = raw as Record<string, unknown>
  for (const key of Object.keys(DEFAULT_CONFIG) as (keyof KeychainConfig)[]) {
    const value = source[key]
    if (typeof value !== typeof DEFAULT_CONFIG[key]) continue
    if (typeof value === 'number' && !Number.isFinite(value)) continue
    ;(config as unknown as Record<string, unknown>)[key] = value
  }
  if (config.basePlateShape !== 'square' && config.basePlateShape !== 'circle') {
    config.basePlateShape = DEFAULT_CONFIG.basePlateShape
  }
  return config
}

const HEX = /^#[0-9a-f]{6}$/

/** Like `sanitizeConfig`: keeps well-formed fields, defaults the rest. */
export function sanitizeRefinements(raw: unknown): Refinements {
  const result: Refinements = { ...DEFAULT_REFINEMENTS, recolor: {}, hiddenColors: [], hiddenShapes: [] }
  if (!raw || typeof raw !== 'object') return result
  const source = raw as Record<string, unknown>

  if (source.recolor && typeof source.recolor === 'object') {
    for (const [from, to] of Object.entries(source.recolor)) {
      if (HEX.test(from) && typeof to === 'string' && HEX.test(to)) result.recolor[from] = to
    }
  }
  const strings = (value: unknown) => (Array.isArray(value) ? value.filter(v => typeof v === 'string') : [])
  result.hiddenColors = strings(source.hiddenColors).filter(c => HEX.test(c))
  result.hiddenShapes = strings(source.hiddenShapes)

  const isNumber = (value: unknown, min: number): value is number =>
    typeof value === 'number' && Number.isFinite(value) && value >= min
  const number = (key: 'mergeTolerance' | 'maxColors' | 'minSpeckSize' | 'simplifyTolerance' | 'nozzleDiameter', min: number) => {
    const value = source[key]
    if (isNumber(value, min)) result[key] = value
  }
  number('mergeTolerance', 0)
  number('maxColors', 0)
  number('minSpeckSize', 0)
  // Older saves stored the speck threshold as an area (mm²): convert it to
  // the width of a disc with that area.
  if (!('minSpeckSize' in source) && isNumber(source.minSpeckArea, 0)) {
    result.minSpeckSize = +(2 * Math.sqrt(source.minSpeckArea / Math.PI)).toFixed(2)
  }
  number('simplifyTolerance', 0)
  number('nozzleDiameter', 0.1)
  if (typeof source.thinWalls === 'boolean') result.thinWalls = source.thinWalls
  return result
}

/** Parsed JSON, or null when missing or corrupt (the sanitizers then use the defaults). */
function parseJson(text: string | null): unknown {
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export function loadState(storage: Storage | null = defaultStorage()): PersistedState {
  return {
    config: sanitizeConfig(parseJson(read(storage, CONFIG_KEY))),
    showLogo: read(storage, SHOW_LOGO_KEY) !== 'false',
    svg: read(storage, SVG_KEY),
    refinements: sanitizeRefinements(parseJson(read(storage, REFINEMENTS_KEY))),
  }
}

export function saveConfig(config: KeychainConfig, storage: Storage | null = defaultStorage()) {
  write(storage, CONFIG_KEY, JSON.stringify(config))
}

export function saveShowLogo(showLogo: boolean, storage: Storage | null = defaultStorage()) {
  write(storage, SHOW_LOGO_KEY, String(showLogo))
}

export function saveSvg(svg: string | null, storage: Storage | null = defaultStorage()) {
  write(storage, SVG_KEY, svg)
}

export function saveRefinements(refinements: Refinements, storage: Storage | null = defaultStorage()) {
  write(storage, REFINEMENTS_KEY, JSON.stringify(refinements))
}
