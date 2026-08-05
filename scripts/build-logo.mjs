#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// Brand logo processing.
//
//   npm run logo -- <path-to-source>
//
// The supplied master is white-and-gold artwork on a solid black rectangle with
// no alpha channel. Dropped straight onto the site it would read as a black
// patch, because the page surface is #0B0A09 rather than pure black.
//
// This does two things:
//
//   1. Keys the black out by using the artwork's own luminance as the alpha
//      channel. That is exact for this image: everything meant to be visible is
//      bright, everything meant to disappear is black, and the anti-aliased
//      edges of the lettering survive as partial alpha instead of turning into
//      a jagged cutout the way a hard threshold would.
//
//   2. Trims the surrounding empty space so the lockup can be positioned by its
//      own edges rather than by whatever padding the master happened to carry.
//
// Two sizes are written: a wide one for the footer and a trimmed wordmark for
// the header, where the full lockup would have to shrink past legibility.
// ─────────────────────────────────────────────────────────────────────────────

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'public', 'images', 'brand')

const source = process.argv[2]
if (!source) {
  console.error('Usage: npm run logo -- <path-to-source-image>')
  process.exit(1)
}

/** Replace the alpha channel with the pixel's own brightness. */
async function keyOutBlack(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const px = Buffer.from(data)

  for (let i = 0; i < px.length; i += 4) {
    // Brightest channel, not a weighted luminance: the gold is low in blue and
    // a perceptual weighting would make it semi-transparent.
    const alpha = Math.max(px[i], px[i + 1], px[i + 2])
    px[i + 3] = alpha
  }

  return sharp(px, { raw: { width: info.width, height: info.height, channels: 4 } }).png()
}

await mkdir(OUT, { recursive: true })

const keyed = await keyOutBlack(source)
// trim() works on the alpha channel once the background is transparent, so this
// removes the padding rather than guessing at a crop box.
const trimmed = await keyed.trim({ threshold: 6 }).toBuffer()
const meta = await sharp(trimmed).metadata()

console.log(`source  : ${(await sharp(source).metadata()).width}×${(await sharp(source).metadata()).height}`)
console.log(`trimmed : ${meta.width}×${meta.height}  (ratio ${(meta.width / meta.height).toFixed(2)}:1)`)

// One asset, used everywhere and sized by CSS. 560px covers a 2x render of the
// largest place it appears (the footer, at ~230px wide); anything beyond that
// is weight nobody sees.
//
// The lockup is a single horizontal unit: plane, wordmark and strapline are one
// composition, and cropping the plane off for the header would ship a second,
// different logo. It is sized by height in the header instead.
const full = await sharp(trimmed).resize({ width: 560, withoutEnlargement: true }).webp({ quality: 90 }).toBuffer()
await writeFile(path.join(OUT, 'logo.webp'), full)

const out = await sharp(full).metadata()
console.log(`logo.webp : ${out.width}×${out.height}  ${(full.length / 1024).toFixed(1)} KB`)
console.log(`\nAspect ratio is ${(meta.width / meta.height).toFixed(2)}:1, so at a 36px header height it renders ${Math.round(36 * (meta.width / meta.height))}px wide.`)
