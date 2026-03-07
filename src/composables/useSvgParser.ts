import type { ColorGroup } from '../types/keychain'

// TODO: Step 2 — parse SVG string with SVGLoader, group paths by fill color
export function useSvgParser() {
  function parse(_svgString: string): ColorGroup[] {
    return []
  }

  return { parse }
}
