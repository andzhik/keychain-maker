import type { ColorGroup, Face, KeychainArtwork } from '../types/keychain'
import { validateGroupComplexity, type SvgParseError } from './svgValidation'

export interface ArtworkPreview {
  artwork: KeychainArtwork
  error: (SvgParseError & { faces: Face[] }) | null
  omittedFaces: Face[]
}

/** Plan a bounded preview without changing source artwork or export validation. */
export function planArtworkPreview(artwork: KeychainArtwork): ArtworkPreview {
  const faces: Face[] = ['front', 'back']
  const faceErrors = faces.map(face => ({ face, error: validateGroupComplexity(artwork[face].groups) }))
  const failed = faceErrors.filter(result => result.error).map(result => result.face)
  const combined = artwork.front.groups === artwork.back.groups
    ? artwork.front.groups : [...artwork.front.groups, ...artwork.back.groups]
  const error = failed.length === 1 ? faceErrors.find(result => result.error)!.error : validateGroupComplexity(combined)
  if (!error) return { artwork, error: null, omittedFaces: [] }

  // If each face fits independently, retain Front for inspection and explain
  // that Back is omitted because the combined model exceeds the shared budget.
  const omittedFaces: Face[] = failed.length ? failed : ['back']
  const empty: ColorGroup[] = []
  return {
    artwork: { ...artwork,
      front: omittedFaces.includes('front') ? { ...artwork.front, groups: empty } : artwork.front,
      back: omittedFaces.includes('back') ? { ...artwork.back, groups: empty } : artwork.back,
    },
    error: { ...error, faces: failed.length ? failed : faces },
    omittedFaces,
  }
}
