import { DEFAULT_CONFIG, type KeychainConfig } from '../types/keychain'

// Separate keys so an SVG too big for the storage quota doesn't take the
// (tiny) config down with it.
const CONFIG_KEY = 'keychain-maker:config:v1'
const SHOW_LOGO_KEY = 'keychain-maker:showLogo:v1'
const SVG_KEY = 'keychain-maker:svg:v1'

export interface PersistedState {
  config: KeychainConfig
  showLogo: boolean
  svg: string | null
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

export function loadState(storage: Storage | null = defaultStorage()): PersistedState {
  let config = { ...DEFAULT_CONFIG }
  const configText = read(storage, CONFIG_KEY)
  if (configText) {
    try {
      config = sanitizeConfig(JSON.parse(configText))
    } catch {
      // Corrupt JSON: start from the defaults.
    }
  }
  return {
    config,
    showLogo: read(storage, SHOW_LOGO_KEY) !== 'false',
    svg: read(storage, SVG_KEY),
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
