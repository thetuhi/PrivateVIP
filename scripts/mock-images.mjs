#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// MOCK PHOTOGRAPHY, development placeholders only.
//
//   npm run mock-images          fill every empty slot
//   npm run mock-images -- --force   overwrite existing files too
//
// ⚠ THESE ARE NOT THE REAL PHOTOGRAPHS. They exist so the layout, the scroll
// reveals, the parallax and the pinned itinerary can be judged with actual
// images in place instead of gradients. Every one of them must be replaced
// before launch, run `npm run photos` for the list of what is needed.
//
// Source: picsum.photos (Unsplash-derived, free to use). Each slot is seeded
// from its own path, so the same slot always gets the same photograph and the
// site does not reshuffle between runs.
//
// A house treatment is applied on the way in, modest desaturation, a warm
// tint and a slight darkening, so a set of unrelated stock photos still sits
// inside the Nocturne palette rather than fighting it. Real photography will
// not need this; the values here are a mock convenience, not a brand rule.
// ─────────────────────────────────────────────────────────────────────────────

import { mkdir, writeFile, access } from 'node:fs/promises'
import { constants } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'public', 'images')
const FORCE = process.argv.includes('--force')

const { experiences } = await import('../src/data/experiences.js')
const { yachts } = await import('../src/data/yachts.js')
const { vehicles } = await import('../src/data/fleet.js')

// Dimensions chosen per usage, so `object-cover` is not throwing away most of
// the frame. Portrait where the card is portrait; wide where it is a banner.
const SIZES = {
  // 2000px covers a 2x render of a 1000px-wide container, which is the widest
  // anything on this site is actually displayed. Beyond that is pure weight.
  hero: [2000, 1125],
  cover: [1400, 1750], // 4:5 catalog cards
  gallery: [1600, 1200], // 4:3 gallery tiles
  yacht: [1920, 1200], // 16:10 rows
  fleet: [1600, 1200],
  teaser: [1600, 1067], // 3:2 home service cards
  portrait: [1400, 1750],
  og: [1200, 630],
}

const slots = []
const add = (rel, kind) => slots.push({ rel, kind })

for (const e of experiences) {
  for (const file of e.images) {
    // The cover doubles as the detail-page hero, so it gets the wider frame;
    // the card crops into it rather than the other way round.
    add(`experiences/${e.slug}/${file}`, file === e.coverImage ? 'gallery' : 'gallery')
  }
}
for (const y of yachts) for (const file of y.images) add(`yachts/${y.slug}/${file}`, 'yacht')
for (const v of vehicles) for (const file of v.images) add(`fleet/${file}`, 'fleet')

add('hero/bosphorus-dusk.webp', 'hero')
add('home/cta-bosphorus.webp', 'hero')
add('home/yacht-teaser.webp', 'teaser')
add('home/fleet-teaser.webp', 'teaser')
add('home/bespoke-teaser.webp', 'teaser')
add('about/office.webp', 'portrait')
add('brand/og-cover.webp', 'og')

async function exists(p) {
  try {
    await access(p, constants.F_OK)
    return true
  } catch {
    return false
  }
}

async function fetchWithRetry(url, attempts = 3) {
  let lastError
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(30000) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return Buffer.from(await res.arrayBuffer())
    } catch (error) {
      lastError = error
      await new Promise((r) => setTimeout(r, 600 * (i + 1)))
    }
  }
  throw lastError
}

let written = 0
let skipped = 0
let failed = 0

for (const { rel, kind } of slots) {
  const target = path.join(OUT, rel)

  if (!FORCE && (await exists(target))) {
    skipped += 1
    continue
  }

  const [w, h] = SIZES[kind]
  // Seeded by path: deterministic across runs and across machines.
  const seed = encodeURIComponent(rel.replace(/[^a-z0-9]/gi, '-'))
  const url = `https://picsum.photos/seed/${seed}/${w}/${h}`

  try {
    const input = await fetchWithRetry(url)
    await mkdir(path.dirname(target), { recursive: true })

    const output = await sharp(input)
      .resize(w, h, { fit: 'cover' })
      // House treatment: pull saturation back, warm the midtones slightly and
      // take a little light out, so the set reads as one body of work.
      .modulate({ saturation: 0.78, brightness: 0.94 })
      .tint({ r: 255, g: 246, b: 232 })
      // q70 with effort 6. Stock photography full of foliage and texture
      // compresses badly at the q82 this started on, that produced 500 KB
      // frames and an 11 MB image directory, which would have made every
      // scroll reveal wait on the network and undone the point of the motion.
      // At q70 the difference is invisible behind a scrim; the weight is not.
      .webp({ quality: 70, effort: 6 })
      .toBuffer()

    await writeFile(target, output)
    written += 1
    const kb = output.length / 1024
    const flag = kb > 250 ? '  ← heavy' : ''
    process.stdout.write(`  ✓ ${rel} (${kb.toFixed(0)} KB)${flag}\n`)
  } catch (error) {
    failed += 1
    process.stdout.write(`  ✗ ${rel}: ${error.message}\n`)
  }
}

// Record which files are mocks, so `npm run photos` can report them as still
// needing real photography instead of counting them as supplied. Without this
// the manifest reads "61 supplied · 0 still needed" and the client reasonably
// concludes the shoot is done.
const markerPath = path.join(OUT, '.mock-manifest.json')
let existing = []
try {
  const { readFile } = await import('node:fs/promises')
  existing = JSON.parse(await readFile(markerPath, 'utf8')).files ?? []
} catch {
  /* First run. */
}

const mockFiles = [...new Set([...existing, ...slots.map((s) => s.rel)])].sort()
await writeFile(
  markerPath,
  JSON.stringify(
    {
      warning: 'These image paths hold generated placeholders, not real photography. Delete an entry once the real file is in place.',
      generated: new Date().toISOString(),
      files: mockFiles,
    },
    null,
    2,
  ),
  'utf8',
)

console.log(`\n${written} written · ${skipped} already present · ${failed} failed`)
if (skipped && !FORCE) console.log('Pass --force to overwrite files that already exist.')
console.log('\n⚠ Mock imagery. Replace with real photography before launch, run `npm run photos`.')
if (failed) process.exitCode = 1
