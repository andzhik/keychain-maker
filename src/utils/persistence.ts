import { DEFAULT_CONFIG, DEFAULT_REFINEMENTS, DEFAULT_PRINTER, type KeychainConfig, type Refinements, type Face, type FaceSettings, type PrinterSettings } from '../types/keychain'

// Separate keys so an SVG too big for the storage quota doesn't take the
// (tiny) config down with it.
const CONFIG_KEY = 'keychain-maker:config:v1'
const SHOW_LOGO_KEY = 'keychain-maker:showLogo:v1'
const SVG_KEY = 'keychain-maker:svg:v1'
const REFINEMENTS_KEY = 'keychain-maker:refinements:v1'
const PRINTER_KEY = 'keychain-maker:printer:v1'

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
  const number = (key: 'mergeTolerance' | 'maxColors' | 'minSpeckSize' | 'simplifyTolerance', min: number) => {
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
  return result
}

export function loadPrinter(storage: Storage | null = defaultStorage()): PrinterSettings {
  // Front was the original home of these settings. Prefer it when migrating
  // conflicting per-face saves, before useFaceArtwork retires the old keys.
  const front = parseJson(read(storage, 'keychain-maker:front:v1')) as { refinements?: unknown } | null
  const raw = parseJson(read(storage, PRINTER_KEY)) ?? front?.refinements ?? parseJson(read(storage, REFINEMENTS_KEY))
  const value = raw && typeof raw === 'object' ? raw as Record<string, unknown> : {}
  return {
    nozzleDiameter: typeof value.nozzleDiameter === 'number' && Number.isFinite(value.nozzleDiameter) && value.nozzleDiameter >= 0.1
      ? value.nozzleDiameter : DEFAULT_PRINTER.nozzleDiameter,
    thinWalls: typeof value.thinWalls === 'boolean' ? value.thinWalls : DEFAULT_PRINTER.thinWalls,
  }
}

export function savePrinter(printer: PrinterSettings, storage: Storage | null = defaultStorage()) {
  write(storage, PRINTER_KEY, JSON.stringify(printer))
}

export function clearSession(storage: Storage | null = defaultStorage()) {
  const keys = [CONFIG_KEY, SHOW_LOGO_KEY, SVG_KEY, REFINEMENTS_KEY, PRINTER_KEY,
    ...(['front', 'back'] as const).flatMap(face => [`keychain-maker:${face}:v1`, `keychain-maker:${face}:svg:v1`])]
  for (const key of keys) write(storage, key, null)
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

export function loadFaces(storage: Storage | null = defaultStorage()): Record<Face, FaceSettings> {
  const legacy = loadState(storage)
  const front: FaceSettings = { mode: 'artwork', svg: legacy.svg, refinements: legacy.refinements, mirror: false, importFailed: false, fileName: null }
  // Legacy sessions repeat plate coordinates on the back, which is mirrored
  // in outside view. Preserve that orientation until the user changes it.
  const back: FaceSettings = { ...front, mode: 'same', svg: null, refinements: sanitizeRefinements(null), mirror: legacy.svg !== null }
  const faces = { front, back }
  for (const face of ['front', 'back'] as const) {
    const raw = parseJson(read(storage, `keychain-maker:${face}:v1`))
    if (!raw || typeof raw !== 'object') continue
    const value = raw as Record<string, unknown>
    const svg = read(storage, `keychain-maker:${face}:svg:v1`)
    faces[face] = {
      mode: value.mode === 'empty' || (value.mode === 'same' && face === 'back') ? value.mode : 'artwork',
      svg,
      refinements: sanitizeRefinements(value.refinements),
      mirror: typeof value.mirror === 'boolean' ? value.mirror : faces[face].mirror,
      importFailed: value.importFailed === true || (value.hasArtwork === true && !svg),
      fileName: typeof value.fileName === 'string' ? value.fileName : null,
    }
  }
  return faces
}

export function saveFace(face: Face, settings: FaceSettings, storage: Storage | null = defaultStorage()) {
  saveFaceSvg(face, settings.svg, storage)
  saveFaceMetadata(face, settings, storage)
}

export function saveFaceMetadata(face: Face, settings: FaceSettings, storage: Storage | null = defaultStorage()) {
  const { svg, ...metadata } = settings
  write(storage, `keychain-maker:${face}:v1`, JSON.stringify({ ...metadata, hasArtwork: svg !== null }))
}

export function saveFaceSvg(face: Face, svg: string | null, storage: Storage | null = defaultStorage()) {
  // Retire migrated source keys before saving, freeing quota rather than
  // storing a second copy of Front or resurrecting it after a failed save.
  if (face === 'front') {
    write(storage, SVG_KEY, null)
    write(storage, REFINEMENTS_KEY, null)
  }
  write(storage, `keychain-maker:${face}:svg:v1`, svg)
}
