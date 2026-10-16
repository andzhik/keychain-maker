import { expect, spyOn, test } from 'bun:test'
import { XMLParser, XMLValidator } from 'fast-xml-parser'
import { Color } from 'three'
import { useSvgParser } from '../../src/composables/useSvgParser'
import { logoOutline, normalizeColor, svgToShapes } from '../../src/utils/svgToShapes'
import { ShapeUtils, type Shape } from 'three'

type XmlEntry = Record<string, unknown>

class TestElement {
  nodeType = 1
  style = new Proxy({}, {
    get: () => '',
  })
  viewportElement: TestElement

  constructor(
    readonly nodeName: string,
    private readonly attributes: Record<string, string>,
    readonly childNodes: TestElement[],
  ) {
    this.viewportElement = this
  }

  getAttribute(name: string): string | null {
    return this.attributes[name] ?? null
  }

  getAttributeNS(_namespace: string, name: string): string | null {
    return this.getAttribute(name) ?? this.getAttribute(`xlink:${name}`)
  }

  hasAttribute(name: string): boolean {
    return this.attributes[name] !== undefined
  }

  getElementById(id: string): TestElement | null {
    if (this.attributes.id === id) return this
    for (const child of this.childNodes) {
      const found = child.getElementById(id)
      if (found) return found
    }
    return null
  }
}

class TestDocument {
  constructor(readonly documentElement: TestElement) {}
}

function installDomParserForSvgLoader() {
  if (globalThis.DOMParser) return

  globalThis.DOMParser = class {
    parseFromString(text: string): TestDocument {
      const validation = XMLValidator.validate(text)
      if (validation !== true) {
        throw new Error(validation.err.msg)
      }

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
        preserveOrder: true,
      })
      const rootEntry = (parser.parse(text) as XmlEntry[])
        .find(entry => Object.keys(entry)[0] !== ':@')

      if (!rootEntry) throw new Error('SVG has no root element')

      const root = buildElement(rootEntry)
      setViewportElement(root, root)
      return new TestDocument(root)
    }
  } as typeof DOMParser
}

function buildElement(entry: XmlEntry): TestElement {
  const nodeName = getElementName(entry)
  if (!nodeName) throw new Error('XML entry is not an element')
  const entries = entry[nodeName] as XmlEntry[] | undefined
  const rawAttributes = entry[':@'] ?? entries?.find(child => child[':@'])?.[':@'] ?? {}
  const attributes = Object.fromEntries(
    Object.entries(rawAttributes as Record<string, string>)
      .map(([key, value]) => [key.replace(/^@_/, ''), value]),
  )
  const childNodes = (entries ?? [])
    .filter(child => getElementName(child) !== null)
    .map(child => buildElement(child))

  return new TestElement(nodeName, attributes, childNodes)
}

function getElementName(entry: XmlEntry): string | null {
  return Object.keys(entry).find(key => key !== ':@' && key !== '#text') ?? null
}

function setViewportElement(node: TestElement, root: TestElement) {
  node.viewportElement = root
  for (const child of node.childNodes) setViewportElement(child, root)
}

installDomParserForSvgLoader()

test('normalizeColor returns lowercase CSS hex colors', () => {
  expect(normalizeColor(new Color('#A1B2C3'))).toBe('#a1b2c3')
})

test('svgToShapes groups multiple filled paths by normalized color', () => {
  const groups = svgToShapes(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 10">
      <path fill="#FF0000" d="M0 0H4V4H0Z" />
      <path fill="#00ff00" d="M8 0H12V4H8Z" />
      <path fill="#ff0000" d="M16 0H20V4H16Z" />
    </svg>
  `)

  expect(groups).toHaveLength(2)
  expect(groups.find(group => group.color === '#ff0000')?.pathCount).toBe(2)
  expect(groups.find(group => group.color === '#ff0000')?.shapes).toHaveLength(2)
  expect(groups.find(group => group.color === '#00ff00')?.pathCount).toBe(1)
})

test('svgToShapes skips paths with no fill', () => {
  const groups = svgToShapes(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 10">
      <path fill="none" stroke="#ff0000" d="M0 0H4V4H0Z" />
      <path fill="#0000ff" d="M8 0H12V4H8Z" />
    </svg>
  `)

  expect(groups).toHaveLength(1)
  expect(groups[0].color).toBe('#0000ff')
  expect(groups[0].pathCount).toBe(1)
})

function area(shape: Shape): number {
  const { shape: outer, holes } = shape.extractPoints(16)
  return Math.abs(ShapeUtils.area(outer)) - holes.reduce((sum, h) => sum + Math.abs(ShapeUtils.area(h)), 0)
}

const totalArea = (shapes: Shape[]) => shapes.reduce((sum, s) => sum + area(s), 0)

test('svgToShapes cuts later-painted paths out of the shapes below them', () => {
  // A background square with a smaller square painted on top.
  const groups = svgToShapes(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
      <path fill="#000000" d="M0 0H10V10H0Z" />
      <path fill="#ffffff" d="M2 2H6V6H2Z" />
    </svg>
  `)
  const background = groups.find(group => group.color === '#000000')!
  const top = groups.find(group => group.color === '#ffffff')!

  expect(totalArea(top.shapes)).toBeCloseTo(16, 6)
  // The background keeps only its visible part: the square has a hole.
  expect(totalArea(background.shapes)).toBeCloseTo(100 - 16, 6)
  expect(background.shapes[0].holes).toHaveLength(1)
  // The outline is the whole background square, with no holes.
  const outline = logoOutline(groups)
  expect(outline).toHaveLength(1)
  expect(outline[0].holes).toHaveLength(0)
  expect(totalArea(outline)).toBeCloseTo(100, 6)
})

test('svgToShapes merges overlapping paths of the same color', () => {
  const groups = svgToShapes(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
      <path fill="#ff0000" d="M0 0H6V6H0Z" />
      <path fill="#ff0000" d="M3 3H9V9H3Z" />
    </svg>
  `)

  expect(groups).toHaveLength(1)
  expect(groups[0].pathCount).toBe(2)
  expect(groups[0].shapes).toHaveLength(1)
  expect(totalArea(groups[0].shapes)).toBeCloseTo(36 + 36 - 9, 6)
})

test('svgToShapes drops a color painted over entirely', () => {
  const groups = svgToShapes(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
      <path fill="#ff0000" d="M2 2H4V4H2Z" />
      <path fill="#00ff00" d="M0 0H10V10H0Z" />
    </svg>
  `)

  expect(groups.map(group => group.color)).toEqual(['#00ff00'])
})

test('useSvgParser reports when an SVG has no filled paths', () => {
  const parser = useSvgParser()

  parser.parse(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 10">
      <path fill="none" stroke="#ff0000" d="M0 0H4V4H0Z" />
    </svg>
  `)

  expect(parser.error.value).toBe('No filled paths found')
  expect(parser.colorGroups.value).toEqual([])
})

test('useSvgParser exposes a friendly error and clears stale groups on parse failure', () => {
  const consoleError = spyOn(console, 'error').mockImplementation(() => {})
  const parser = useSvgParser()

  parser.colorGroups.value = [{
    id: '#ffffff',
    color: '#ffffff',
    shapes: [],
    pathCount: 1,
  }]

  try {
    parser.parse('<svg')

    expect(parser.error.value).toBe('Failed to parse SVG')
    expect(parser.colorGroups.value).toEqual([])
    expect(consoleError).toHaveBeenCalled()
  } finally {
    consoleError.mockRestore()
  }
})
