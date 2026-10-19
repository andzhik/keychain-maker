import { XMLParser, XMLValidator } from 'fast-xml-parser'

// SVGLoader needs a DOMParser; bun has none. Just enough of the DOM for it.

type XmlEntry = Record<string, unknown>

class TestElement {
  nodeType = 1
  get style() {
    const values = Object.fromEntries((this.attributes.style ?? '').split(';').map(part => {
      const colon = part.indexOf(':')
      return [part.slice(0, colon).trim(), part.slice(colon + 1).trim()]
    }))
    return new Proxy(values, { get: (target, key: string) => target[key] ?? '' })
  }
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

  setAttribute(name: string, value: string) { this.attributes[name] = value }
  removeAttribute(name: string) { delete this.attributes[name] }
  removeChild(child: TestElement) { this.childNodes.splice(this.childNodes.indexOf(child), 1); return child }
  serialize(): string {
    const escape = (value: string) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
    const attributes = Object.entries(this.attributes).map(([name, value]) => ` ${name}="${escape(value)}"`).join('')
    return `<${this.nodeName}${attributes}>${this.childNodes.map(child => child.serialize()).join('')}</${this.nodeName}>`
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
  getElementById(id: string) { return this.documentElement.getElementById(id) }
}

export function installDomParserForSvgLoader() {
  if (globalThis.DOMParser) return

  globalThis.XMLSerializer = class {
    serializeToString(node: TestElement) { return node.serialize() }
  } as typeof XMLSerializer

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
        .find(entry => Object.keys(entry).some(key => key !== ':@' && !key.startsWith('?') && key !== '#text'))

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
  const rawAttributes = entry[':@'] ?? {}
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

