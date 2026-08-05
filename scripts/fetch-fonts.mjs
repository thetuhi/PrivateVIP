#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// Self-hosted webfonts.
//
//   npm run fonts
//
// Downloads the woff2 files from Google Fonts once and writes a local
// @font-face stylesheet. After this, the site makes no request to
// fonts.googleapis.com or fonts.gstatic.com at runtime.
//
// Two reasons, both real:
//
//   1. Speed. The Google Fonts stylesheet is render-blocking and sits on a
//      third-party origin, so first paint waits on a DNS lookup, a TLS
//      handshake and a CSS round trip before it can even discover the font
// files, which live on a *second* origin needing its own handshake.
//      Measured on this site, that pushed first-contentful-paint to 1.6s on
//      localhost, where there is no network latency at all.
//
//   2. Privacy. Google Fonts logs the visitor's IP address. Our own privacy
//      policy states that no third-party fonts are loaded from a tracking
//      host, and German courts have already found that arrangement to breach
//      the GDPR. For a Turkish agency selling to EU visitors, self-hosting is
//      the difference between a true policy and a false one.
//
// Only the subsets this site needs are kept: latin (EN), latin-ext (TR) and
// cyrillic + cyrillic-ext (RU). Greek and Vietnamese are dropped, roughly a
// third of the files, for languages the site does not offer.
// ─────────────────────────────────────────────────────────────────────────────

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const FONT_DIR = path.join(ROOT, 'public', 'fonts')
const CSS_OUT = path.join(ROOT, 'src', 'styles', 'fonts.css')

const KEEP_SUBSETS = new Set(['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'])

const GOOGLE_CSS =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap'

// Requesting as a modern browser is what makes Google serve woff2 rather than
// a legacy format.
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

console.log('Fetching font stylesheet…')
const css = await (await fetch(GOOGLE_CSS, { headers: { 'User-Agent': UA } })).text()

// Each @font-face is preceded by a /* subset */ comment.
const blocks = [...css.matchAll(/\/\*\s*([a-z-]+)\s*\*\/\s*(@font-face\s*\{[^}]+\})/g)]
if (!blocks.length) throw new Error('Could not parse the Google Fonts stylesheet')

const field = (block, name) => block.match(new RegExp(`${name}:\\s*([^;]+);`))?.[1].trim()

await mkdir(FONT_DIR, { recursive: true })
await mkdir(path.dirname(CSS_OUT), { recursive: true })

const faces = []
let skipped = 0

for (const [, subset, block] of blocks) {
  if (!KEEP_SUBSETS.has(subset)) {
    skipped += 1
    continue
  }

  const family = field(block, 'font-family').replace(/['"]/g, '')
  const style = field(block, 'font-style')
  const weight = field(block, 'font-weight')
  const unicodeRange = field(block, 'unicode-range')
  const url = block.match(/url\((https:\/\/[^)]+\.woff2)\)/)?.[1]
  if (!url) continue

  const slug = family.toLowerCase().replace(/\s+/g, '-')
  const filename = `${slug}-${weight}-${style}-${subset}.woff2`

  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`${filename}: HTTP ${res.status}`)
  const bytes = Buffer.from(await res.arrayBuffer())
  await writeFile(path.join(FONT_DIR, filename), bytes)

  faces.push({ family, style, weight, unicodeRange, filename, subset, size: bytes.length })
  process.stdout.write(`  ✓ ${filename} (${(bytes.length / 1024).toFixed(1)} KB)\n`)
}

const total = faces.reduce((n, f) => n + f.size, 0)

const stylesheet = `/* ─────────────────────────────────────────────────────────────────────────
 * GENERATED FILE, do not edit by hand. Run \`npm run fonts\` to regenerate.
 *
 * Self-hosted webfaces. No request leaves this origin for typography, which
 * is both faster (no third-party DNS + TLS + CSS round trip in front of first
 * paint) and what the privacy policy promises.
 *
 * Subsets: ${[...KEEP_SUBSETS].join(', ')}, covering EN, TR and RU.
 * ${faces.length} faces, ${(total / 1024).toFixed(0)} KB total on disk. The unicode-range on each
 * face means a visitor only downloads the subsets their text actually uses.
 *
 * font-display: swap, text paints immediately in the fallback and reflows
 * once the face arrives, rather than being invisible while it loads.
 * ───────────────────────────────────────────────────────────────────────── */

${faces
  .map(
    (f) => `@font-face {
  font-family: '${f.family}';
  font-style: ${f.style};
  font-weight: ${f.weight};
  font-display: swap;
  src: url('/fonts/${f.filename}') format('woff2');
  unicode-range: ${f.unicodeRange};
}`,
  )
  .join('\n\n')}
`

await writeFile(CSS_OUT, stylesheet, 'utf8')

console.log(`\n${faces.length} faces written · ${skipped} skipped (unused subsets)`)
console.log(`${(total / 1024).toFixed(0)} KB total → public/fonts/`)
console.log(`Stylesheet → ${path.relative(ROOT, CSS_OUT)}`)
