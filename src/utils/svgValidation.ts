import type { ColorGroup } from '../types/keychain'

export type SvgParseErrorCode =
  | 'EMPTY_SVG' | 'NO_FILLED_PATHS' | 'TEXT_NOT_CONVERTED'
  | 'UNSUPPORTED_EXTERNAL_IMAGE' | 'UNSUPPORTED_GRADIENT' | 'UNSUPPORTED_PATTERN'
  | 'UNSUPPORTED_CSS_STYLING' | 'UNSUPPORTED_CLIP_PATH' | 'UNSUPPORTED_MASK'
  | 'UNSUPPORTED_FILTER' | 'UNSUPPORTED_USE' | 'UNSUPPORTED_ELEMENT'
  | 'TOO_COMPLEX' | 'ZERO_BOUNDS' | 'INVALID_SVG'

export interface SvgParseError {
  code: SvgParseErrorCode
  message: string
}

export type SvgParseResult =
  | { ok: true; groups: ColorGroup[] }
  | { ok: false; error: SvgParseError }

// Budgets bound input parsing, polygon clipping, and the eventual CSG build.
// They apply to raster-generated SVGs and restored sessions as well as uploads.
export const SVG_LIMITS = {
  bytes: 2 * 1024 * 1024,
  elements: 4096,
  depth: 64,
  paths: 512,
  shapes: 512,
  points: 20000,
  numbers: 40000,
} as const

const MESSAGES: Record<SvgParseErrorCode, string> = {
  EMPTY_SVG: 'This SVG is empty. Choose an SVG containing filled paths.',
  NO_FILLED_PATHS: 'No filled paths found. Convert strokes to filled outlines before uploading.',
  TEXT_NOT_CONVERTED: 'This SVG contains text. Convert text to paths in your vector editor, then upload it again.',
  UNSUPPORTED_EXTERNAL_IMAGE: 'This SVG contains an image. Upload the PNG, JPEG or WebP directly to trace it, or replace images with paths.',
  UNSUPPORTED_GRADIENT: 'Gradient fills cannot become solid print colors. Replace gradients with flat fills before uploading.',
  UNSUPPORTED_PATTERN: 'Pattern fills are not supported. Expand patterns into filled paths before uploading.',
  UNSUPPORTED_CSS_STYLING: 'This SVG uses unsupported CSS styling. Convert stylesheet rules to inline fills and transforms before uploading.',
  UNSUPPORTED_CLIP_PATH: 'Clip paths are not supported. Apply or flatten clipping into filled paths before uploading.',
  UNSUPPORTED_MASK: 'Masks are not supported. Apply or flatten masks into filled paths before uploading.',
  UNSUPPORTED_FILTER: 'Filters are not supported. Remove effects or flatten the artwork into filled paths before uploading.',
  UNSUPPORTED_USE: 'This SVG contains an unsupported linked copy. Expand clones or symbols into paths before uploading.',
  UNSUPPORTED_ELEMENT: 'This SVG contains unsupported artwork. Export a static SVG made of filled paths, or upload a PNG to trace.',
  TOO_COMPLEX: 'This artwork is too complex. Simplify paths, remove small details, or trace a smaller image with fewer colors.',
  ZERO_BOUNDS: 'The filled artwork has zero or extremely small width or height. Expand it to a usable size in your vector editor.',
  INVALID_SVG: 'This file is not a valid SVG with finite geometry. Re-export it as a plain SVG and try again.',
}

export function svgError(code: SvgParseErrorCode, detail?: string): SvgParseError {
  return { code, message: detail ? `${MESSAGES[code]} ${detail}` : MESSAGES[code] }
}

export function complexityError(detail: string): SvgParseError {
  return svgError('TOO_COMPLEX', detail)
}

const DRAWABLE = new Set(['path', 'rect', 'circle', 'ellipse', 'polygon', 'polyline', 'line'])
const UNSUPPORTED: Record<string, SvgParseErrorCode> = {
  text: 'TEXT_NOT_CONVERTED', tspan: 'TEXT_NOT_CONVERTED', textPath: 'TEXT_NOT_CONVERTED',
  image: 'UNSUPPORTED_EXTERNAL_IMAGE', style: 'UNSUPPORTED_CSS_STYLING',
  foreignObject: 'UNSUPPORTED_ELEMENT',
  switch: 'UNSUPPORTED_ELEMENT', animate: 'UNSUPPORTED_ELEMENT',
  animateTransform: 'UNSUPPORTED_ELEMENT', set: 'UNSUPPORTED_ELEMENT',
}

/** Inspect markup before SVGLoader, tessellation, or polygon clipping can run. */
export function validateSvgSource(text: string): SvgParseError | null {
  if (text.length > SVG_LIMITS.bytes || new TextEncoder().encode(text).length > SVG_LIMITS.bytes) {
    return complexityError('The SVG file limit is 2 MiB.')
  }
  if (!text.trim()) return svgError('EMPTY_SVG')
  // External stylesheets/entities cannot be reproduced by the solid-fill pipeline.
  if (/<\?xml-stylesheet\b/i.test(text)) return svgError('UNSUPPORTED_CSS_STYLING')
  if (/<!ENTITY\b/i.test(text)) return svgError('INVALID_SVG')
  let document: Document
  try {
    document = new DOMParser().parseFromString(text, 'image/svg+xml')
  } catch {
    return svgError('INVALID_SVG')
  }
  const root = document.documentElement
  if (!root || root.nodeName !== 'svg') return svgError('INVALID_SVG')

  const stack: { node: Element; depth: number; definitions: boolean }[] = [{ node: root, depth: 0, definitions: false }]
  let elements = 0
  let paths = 0
  let numbers = 0
  while (stack.length) {
    const { node, depth, definitions } = stack.pop()!
    const name = node.nodeName
    if (name === 'parsererror') return svgError('INVALID_SVG')
    if (++elements > SVG_LIMITS.elements || depth > SVG_LIMITS.depth) {
      return complexityError(`Use at most ${SVG_LIMITS.elements} elements and ${SVG_LIMITS.depth} nesting levels.`)
    }
    // Metadata/unused definitions do not contribute artwork. Stylesheets still
    // affect the whole document, including when placed inside <defs>.
    if (name === 'style') return svgError('UNSUPPORTED_CSS_STYLING')
    if (!definitions) {
      const unsupported = UNSUPPORTED[name]
      if (unsupported) return svgError(unsupported)
      if (name === 'use') {
        // Preserve SVGLoader's supported local xlink copies, but count their
        // expanded content too. Cyclic or multiplying references hit the same
        // depth/element/path budgets before SVGLoader can recurse through them.
        const href = node.getAttribute('xlink:href')
        const target = href?.startsWith('#') ? document.getElementById(href.slice(1)) : null
        if (!target || !(DRAWABLE.has(target.nodeName) || target.nodeName === 'g')) return svgError('UNSUPPORTED_USE')
        stack.push({ node: target, depth: depth + 1, definitions: false })
      }
      const inline = new Map((node.getAttribute('style') ?? '').split(';').map(declaration => {
        const colon = declaration.indexOf(':')
        return [declaration.slice(0, colon).trim().toLowerCase(), declaration.slice(colon + 1).trim()]
      }))
      const property = (name: string) => inline.get(name) ?? node.getAttribute(name)
      for (const [attribute, code] of [
        ['clip-path', 'UNSUPPORTED_CLIP_PATH'], ['mask', 'UNSUPPORTED_MASK'], ['filter', 'UNSUPPORTED_FILTER'],
      ] as const) {
        const value = property(attribute)
        if (value && value.trim() !== 'none') return svgError(code)
      }
      const fill = property('fill') ?? ''
      if (/url\s*\(/i.test(fill)) {
        // SVGLoader cannot turn either kind of paint server into flat materials.
        const id = fill.match(/url\(\s*['"]?#([^'"\s)]+)['"]?\s*\)/i)?.[1]
        return svgError(id && document.getElementById(id)?.nodeName === 'pattern' ? 'UNSUPPORTED_PATTERN' : 'UNSUPPORTED_GRADIENT')
      }
      if (inline.has('transform') || inline.has('mix-blend-mode') || /^(?:currentColor|var\()/i.test(fill)) {
        return svgError('UNSUPPORTED_CSS_STYLING')
      }
      if (DRAWABLE.has(name) && ++paths > SVG_LIMITS.paths) {
        return complexityError(`Use at most ${SVG_LIMITS.paths} paths or primitive shapes.`)
      }
    }
    // Limit one giant path too; a path count alone does not bound tessellation.
    for (const attribute of ['d', 'points', 'transform']) {
      numbers += (node.getAttribute(attribute)?.match(/[+-]?(?:\d*\.\d+|\d+\.?\d*)(?:e[+-]?\d+)?/gi) ?? []).length
    }
    if (numbers > SVG_LIMITS.numbers) return complexityError(`Use at most ${SVG_LIMITS.numbers} path coordinates.`)
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === 1) stack.push({ node: child as Element, depth: depth + 1, definitions: definitions || name === 'defs' || name === 'metadata' })
    }
  }
  return null
}

/** Defense at the builder boundary, including callers that bypass SVG import. */
export function validateGroupComplexity(groups: ColorGroup[]): SvgParseError | null {
  let paths = 0
  let shapes = 0
  let points = 0
  for (const group of groups) {
    paths += group.pathCount
    shapes += group.shapes.length
    if (paths > SVG_LIMITS.paths || shapes > SVG_LIMITS.shapes) {
      return complexityError(`Use at most ${SVG_LIMITS.paths} paths and ${SVG_LIMITS.shapes} filled shapes.`)
    }
    for (const shape of group.shapes) {
      for (const ring of [shape, ...shape.holes]) {
        // Count before allocating tessellated points. Ellipses use twice the divisions.
        for (const curve of ring.curves) points += curve.type === 'LineCurve' ? 1 : curve.type === 'EllipseCurve' ? 32 : 16
        points++
        if (points > SVG_LIMITS.points) return complexityError(`Use at most ${SVG_LIMITS.points} outline points.`)
      }
    }
  }
  return null
}
