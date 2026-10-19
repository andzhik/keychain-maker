import { svgToShapes } from '../../src/utils/svgToShapes'

/** Geometry tests require a successful import; validation tests inspect the result. */
export function parseGroups(svg: string) {
  const result = svgToShapes(svg)
  if (!result.ok) throw new Error(`${result.error.code}: ${result.error.message}`)
  return result.groups
}
