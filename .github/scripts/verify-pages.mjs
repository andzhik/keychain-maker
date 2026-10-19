import { readdir, readFile } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'
import { setTimeout } from 'node:timers/promises'

const [siteUrl, siteDirectory = 'site'] = process.argv.slice(2)
if (!siteUrl) throw new Error('Usage: node .github/scripts/verify-pages.mjs <site-url> [site-directory]')
const baseUrl = new URL(siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`)
const attempts = Number(process.env.VERIFY_PAGES_ATTEMPTS ?? 12)
if (!Number.isInteger(attempts) || attempts < 1) throw new Error('VERIFY_PAGES_ATTEMPTS must be a positive integer')

async function findPages(directory) {
  const pages = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) pages.push(...await findPages(path))
    else if (entry.name === 'index.html') pages.push(path)
  }
  return pages
}

// Check production and every retained preview against the artifact we uploaded.
const pages = await findPages(siteDirectory)
if (!pages.includes(join(siteDirectory, 'index.html'))) throw new Error('The Pages artifact has no production index.html')

for (const path of pages) {
  const pagePath = relative(siteDirectory, path).split(sep).join('/').replace(/index\.html$/, '')
  const url = new URL(pagePath, baseUrl)
  const expected = await readFile(path, 'utf8')
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(url, {
        cache: 'no-store',
        signal: AbortSignal.timeout(15_000),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      if (await response.text() !== expected) throw new Error('Live HTML differs from the uploaded build')
      console.log(`PASS: ${url} matches the uploaded build`)
      break
    } catch (error) {
      if (attempt === attempts) throw new Error(`FAIL: ${url}: ${error.message}`, { cause: error })
      console.log(`Waiting for Pages (${attempt}/${attempts}): ${url}: ${error.message}`)
      await setTimeout(10_000)
    }
  }
}
