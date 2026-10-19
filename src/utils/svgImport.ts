import { validateSvgSource, type SvgParseError } from './svgValidation'
import { Color } from 'three'

export interface SvgImportReport {
  removedMetadata: number
  normalizedStyles: number
}

/** Prepare only markup whose cleanup cannot change filled artwork. */
export function prepareSvg(text: string):
  | { ok: true; svg: string; report: SvgImportReport }
  | { ok: false; error: SvgParseError } {
  // Enforce budgets and diagnose unsupported features before rewriting anything.
  const error = validateSvgSource(text)
  if (error) return { ok: false, error }
  const document = new DOMParser().parseFromString(text, 'image/svg+xml')
  const report: SvgImportReport = { removedMetadata: 0, normalizedStyles: 0 }
  const children = (node: Element) => Array.from(node.childNodes).filter(n => n.nodeType === 1) as Element[]
  const referencedIds = new Set<string>()
  const collectReferences = (node: Element) => {
    const href = node.getAttribute('xlink:href') ?? node.getAttribute('href')
    if (href?.startsWith('#')) referencedIds.add(href.slice(1))
    for (const child of children(node)) collectReferences(child)
  }
  collectReferences(document.documentElement)
  const containsReference = (node: Element): boolean => referencedIds.has(node.getAttribute('id') ?? '')
    || children(node).some(containsReference)
  const visit = (node: Element) => {
    for (const child of children(node)) {
      if (['metadata', 'title', 'desc'].includes(child.nodeName) && !containsReference(child)) {
        node.removeChild(child)
        report.removedMetadata++
      } else visit(child)
    }
    const style = node.getAttribute('style')
    if (!style) return
    const remaining: string[] = []
    let changed = false
    const declarations = style.split(';').filter(d => d.trim()).map(declaration => {
      const colon = declaration.indexOf(':')
      const property = declaration.slice(0, colon).trim().toLowerCase()
      const value = declaration.slice(colon + 1).trim()
      // Leave CSS functions, priorities, and other declarations untouched. Only
      // flat fill values and simple fill rules/opacity have equivalent attributes.
      const safe = property === 'fill' ? /^(?:#[\da-f]{3}|#[\da-f]{6}|none|transparent)$/i.test(value) || Object.prototype.hasOwnProperty.call(Color.NAMES, value.toLowerCase())
        : property === 'fill-rule' ? /^(?:nonzero|evenodd)$/.test(value)
        : ['opacity', 'fill-opacity'].includes(property) && /^(?:0(?:\.\d+)?|1(?:\.0+)?)$/.test(value)
      return { declaration, property, value, safe: colon >= 0 && safe }
    })
    for (const { declaration, property, value, safe } of declarations) {
      // Preserve the cascade if any duplicate uses a CSS value we leave inline.
      if (safe && declarations.every(d => d.property !== property || d.safe)) {
        node.setAttribute(property, value)
        changed = true
      } else remaining.push(declaration)
    }
    if (changed) {
      if (remaining.length) node.setAttribute('style', remaining.join(';'))
      else node.removeAttribute('style')
      report.normalizedStyles++
    }
  }
  visit(document.documentElement)
  return { ok: true, svg: new XMLSerializer().serializeToString(document.documentElement), report }
}
