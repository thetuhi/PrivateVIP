#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// Photo manifest.
//
//   npm run photos
//
// Reads every image path the site references from the catalog data and reports
// which files exist and which are still missing. Send the missing list to
// whoever is supplying photography.
//
// Because it reads the same data the app renders, adding a tour automatically
// adds its photo slots here, there is no second list to maintain.
// ─────────────────────────────────────────────────────────────────────────────

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const { experiences } = await import('../src/data/experiences.js')
const { yachts } = await import('../src/data/yachts.js')
const { vehicles } = await import('../src/data/fleet.js')

// Paths referenced directly in JSX rather than coming from a data file.
const STANDALONE = [
  'hero/bosphorus-dusk.webp',
  'home/yacht-teaser.webp',
  'home/fleet-teaser.webp',
  'home/bespoke-teaser.webp',
  'home/cta-bosphorus.webp',
  'about/office.webp',
  'brand/og-cover.webp',
]

const slots = new Map() // relative path → what it is used for

const add = (relative, usage) => {
  if (!slots.has(relative)) slots.set(relative, usage)
}

for (const e of experiences) {
  for (const file of e.images) {
    const isCover = file === e.coverImage
    add(`experiences/${e.slug}/${file}`, `${e.title.en}${isCover ? ' · CARD COVER' : ''}`)
  }
}
for (const y of yachts) {
  for (const file of y.images) {
    const isCover = file === y.coverImage
    add(`yachts/${y.slug}/${file}`, `${y.name.en}${isCover ? ' · CARD COVER' : ''}`)
  }
}
for (const v of vehicles) {
  const name = typeof v.name === 'string' ? v.name : v.name.en
  for (const file of v.images) add(`fleet/${file}`, name)
}
for (const file of STANDALONE) add(file, 'Page artwork')

// Files written by `npm run mock-images` are placeholders, not photography.
// They exist on disk, so a plain existence check would report them as done.
let mocks = new Set()
try {
  const marker = JSON.parse(readFileSync(path.join(ROOT, 'public/images/.mock-manifest.json'), 'utf8'))
  mocks = new Set(marker.files ?? [])
} catch {
  /* No mocks have ever been generated. */
}

const state = (rel) => {
  if (!existsSync(path.join(ROOT, 'public/images', rel))) return 'NEEDED'
  return mocks.has(rel) ? 'MOCK' : 'ok'
}

const rows = [...slots.entries()].sort(([a], [b]) => a.localeCompare(b))
const missing = rows.filter(([rel]) => state(rel) === 'NEEDED')
const mocked = rows.filter(([rel]) => state(rel) === 'MOCK')
const present = rows.filter(([rel]) => state(rel) === 'ok').length

const report = [
 'PHOTO MANIFEST. Private VIP Istanbul',
  `Generated ${new Date().toISOString().slice(0, 10)}`,
  '',
  `${rows.length} photo slots · ${present} real · ${mocked.length} MOCK · ${missing.length} empty`,
  '',
  ...(mocked.length
    ? [
        '⚠ MOCK slots hold generated stock placeholders, not your photography.',
          ' They are on disk so the layout and motion can be reviewed, but every',
        '  one still needs a real image before launch.',
        '',
      ]
    : []),
  'HOW TO SUPPLY A PHOTO',
  '  1. Put the full-resolution original at:  originals/<path below, any extension>',
  '     e.g. originals/experiences/imperial-istanbul/hagia-sophia-interior.jpg',
  '  2. Run:  npm run images',
  '  3. It is resized, converted to WebP and placed in public/images/ automatically.',
  '',
  'Anything not supplied renders an on-brand placeholder, so the site stays',
  'presentable while photography is still being shot or licensed.',
  '',
    'Slots marked CARD COVER are the ones used on listing pages, prioritise those.',
  '',
  '─'.repeat(78),
  '',
  ...rows.map(([rel, usage]) => `${`[${state(rel)}]`.padEnd(9)}${rel}\n          ${usage}\n`),
]

const outPath = path.join(ROOT, 'PHOTO-MANIFEST.txt')
writeFileSync(outPath, report.join('\n'), 'utf8')

console.log(`${rows.length} photo slots · ${present} real · ${mocked.length} mock · ${missing.length} empty`)

if (mocked.length) {
  console.log(`\n⚠ ${mocked.length} slot(s) hold generated placeholders, not real photography.`)
  for (const [rel, usage] of mocked.slice(0, 6)) console.log(` ${rel}, ${usage}`)
  if (mocked.length > 6) console.log(`  …and ${mocked.length - 6} more`)
}

if (missing.length) {
  console.log('\nEmpty (first 10):')
  for (const [rel, usage] of missing.slice(0, 10)) console.log(` ${rel}, ${usage}`)
  if (missing.length > 10) console.log(`  …and ${missing.length - 10} more`)
}
console.log(`\nFull list written to ${path.relative(ROOT, outPath)}`)
