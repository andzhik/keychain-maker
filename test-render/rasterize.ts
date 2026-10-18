/**
 * Rasterizes test SVGs into PNG / JPEG / WebP fixtures for the image tracer, so a
 * traced upload can be compared side by side with the SVG it came from.
 *
 *   node --experimental-strip-types test-render/rasterize.ts [svgPath format size background]
 *
 * With no arguments, regenerates the curated set below. With arguments, renders
 * one file: format is png | jpeg | webp, size is the long edge in px, background
 * is a CSS color or "none" (transparent; JPEG always gets white).
 *
 * Must run under Node, not Bun (see capture.ts). Output: test-images/<name>.<ext>
 */
import { chromium } from 'playwright'
import { basename, extname, join } from 'node:path'
import { mkdir, writeFile, readFile } from 'node:fs/promises'

type Format = 'png' | 'jpeg' | 'webp'
interface Job { svg: string; format: Format; size: number; background: string; suffix?: string }

// Each entry exercises something different in traceImage: transparency, a solid
// background to strip, lossy compression noise, and up/down scaling to 512 px.
const CURATED: Job[] = [
  { svg: 'test-svg/coffee-badge.svg', format: 'png', size: 512, background: 'none' },
  { svg: 'test-svg/smile-heart.svg', format: 'png', size: 1024, background: 'none' },
  { svg: 'test-svg/logo.svg', format: 'png', size: 400, background: 'white', suffix: '-white' },
  { svg: 'test-svg/hills-badge.svg', format: 'jpeg', size: 600, background: 'white' },
  { svg: 'test-svg/name-tag.svg', format: 'jpeg', size: 800, background: 'white' },
  { svg: 'test-svg/c1.svg', format: 'webp', size: 512, background: 'none' },
  { svg: 'test-svg/name-tag.svg', format: 'webp', size: 300, background: 'none' },
]

const QUALITY = 0.85
const OUT_DIR = 'test-images'
const EXT: Record<Format, string> = { png: 'png', jpeg: 'jpg', webp: 'webp' }

const jobs: Job[] = process.argv[2]
  ? [{
      svg: process.argv[2],
      format: (process.argv[3] ?? 'png') as Format,
      size: Number(process.argv[4] ?? 512),
      background: process.argv[5] ?? 'none',
    }]
  : CURATED

const browser = await chromium.launch()
const page = await browser.newPage()
await mkdir(OUT_DIR, { recursive: true })

for (const job of jobs) {
  const svgString = await readFile(job.svg, 'utf8')
  const background = job.format === 'jpeg' && job.background === 'none' ? 'white' : job.background
  const dataUrl: string = await page.evaluate(
    async ({ svgString, size, mime, background, quality }) => {
      // Size the root from its viewBox so the long edge is exactly `size` px.
      const doc = new DOMParser().parseFromString(svgString, 'image/svg+xml')
      const root = doc.documentElement
      if (root.nodeName !== 'svg') throw new Error('not a valid SVG')
      const vb = (root.getAttribute('viewBox') ?? '').trim().split(/[\s,]+/).map(Number)
      const [vw, vh] = vb.length === 4 ? [vb[2], vb[3]] : [
        parseFloat(root.getAttribute('width') ?? '1'), parseFloat(root.getAttribute('height') ?? '1'),
      ]
      const scale = size / Math.max(vw, vh)
      const w = Math.round(vw * scale), h = Math.round(vh * scale)
      root.setAttribute('width', String(w))
      root.setAttribute('height', String(h))

      const img = new Image()
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(doc))
      await img.decode()

      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      if (background !== 'none') {
        ctx.fillStyle = background
        ctx.fillRect(0, 0, w, h)
      }
      ctx.drawImage(img, 0, 0, w, h)
      return canvas.toDataURL(mime, quality)
    },
    { svgString, size: job.size, mime: `image/${job.format}`, background, quality: QUALITY },
  )

  const name = basename(job.svg, extname(job.svg)) + (job.suffix ?? '') + '.' + EXT[job.format]
  const out = join(OUT_DIR, name)
  await writeFile(out, Buffer.from(dataUrl.split(',')[1], 'base64'))
  console.log(`${out}  (${job.format}, ${job.size}px, bg ${background})`)
}

await browser.close()
