#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// Responsive image variants.
//
//   npm run images:responsive
//
// Writes 640w / 1024w / 1600w versions of every photograph beside the original,
// so a card roughly 330px wide downloads a 640px file instead of the full-size
// one. `sizes` is already declared correctly at every call site; without a
// srcset to choose from, the browser had no option but the largest file.
//
// This is the fix for photographs that were still arriving after they had
// scrolled into view: the problem was bytes on the wire, not when the request
// started. A 650 KB frame on a mid-speed connection cannot paint in time no
// matter how early it is asked for.
//
// Naming is `<name>-<width>w.webp`, which SmartImage assembles into a srcset.
// The original stays as the `src` fallback for browsers without srcset.
// ─────────────────────────────────────────────────────────────────────────────

import { readdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const IMAGES = path.join(ROOT, 'public', 'images')

export const WIDTHS = [640, 1024, 1600]

// Quality falls as the image gets larger. A 1600px frame is only ever seen
// full-bleed behind a scrim or as a hero, where fine detail is not what the eye
// is on; a 640px card is looked at directly.
const QUALITY = { 640: 76, 1024: 70, 1600: 64 }

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else if (entry.name.endsWith('.webp') && !/-\d+w\.webp$/.test(entry.name)) out.push(full)
  }
  return out
}

const sources = await walk(IMAGES)
let made = 0
let bytesBefore = 0
let bytesAfter = 0

for (const src of sources) {
  const meta = await sharp(src).metadata()
  bytesBefore += (await stat(src)).size

  for (const width of WIDTHS) {
    // Never upscale: a 900px master has no business being written at 1600w.
    if (meta.width < width * 0.9 && width !== WIDTHS[0]) continue

    const target = src.replace(/\.webp$/, `-${width}w.webp`)
    const buf = await sharp(src)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY[width], effort: 6 })
      .toBuffer()
    await writeFile(target, buf)
    bytesAfter += buf.length
    made += 1
  }
}

console.log(`${sources.length} photographs -> ${made} variants`)
console.log(`originals ${(bytesBefore / 1024 / 1024).toFixed(1)} MB · variants ${(bytesAfter / 1024 / 1024).toFixed(1)} MB`)
console.log(`\nA 640w card frame now costs roughly ${Math.round(bytesAfter / made / 1024)} KB on average instead of the full-size file.`)
