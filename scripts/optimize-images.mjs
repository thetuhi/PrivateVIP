#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// Photo pipeline.
//
//   npm run images
//
// Walks `originals/` and produces web-ready WebP into `public/images/`,
// mirroring the folder structure. Idempotent: an original that has already
// been converted is skipped, so you can run it as often as you like.
//
// Workflow for new photography:
//   1. Drop full-resolution files into originals/<section>/<slug>/
//      e.g. originals/experiences/imperial-istanbul/hagia-sophia-interior.jpg
//   2. Run `npm run images`
//   3. Reference the .webp filename in src/data/*.js
//
// Anything in originals/ is git-ignored, masters stay off the repo.
// ─────────────────────────────────────────────────────────────────────────────

import { mkdir, readdir, stat, access } from 'node:fs/promises'
import { constants } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE_DIR = path.join(ROOT, 'originals')
const OUTPUT_DIR = path.join(ROOT, 'public', 'images')

const SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.heic', '.webp'])

// 2000px wide covers a 2x retina render of a full-bleed hero on a 1000px
// container, which is the widest any image on this site is displayed.
const MAX_WIDTH = 2000
const QUALITY = 82

const stats = { converted: 0, skipped: 0, failed: 0 }

async function exists(target) {
  try {
    await access(target, constants.F_OK)
    return true
  } catch {
    return false
  }
}

async function walk(dir) {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }

  const files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(full)))
    else if (SOURCE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) files.push(full)
  }
  return files
}

async function convert(sourcePath) {
  const relative = path.relative(SOURCE_DIR, sourcePath)
  const targetPath = path.join(OUTPUT_DIR, relative).replace(/\.[^.]+$/, '.webp')

  if (await exists(targetPath)) {
    stats.skipped += 1
    return
  }

  await mkdir(path.dirname(targetPath), { recursive: true })

  try {
    const info = await sharp(sourcePath)
      // rotate() with no argument applies the EXIF orientation tag and strips
      // it, so portrait photos from a phone do not appear sideways.
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(targetPath)

    const sourceSize = (await stat(sourcePath)).size
    const saved = Math.round((1 - info.size / sourceSize) * 100)
    console.log(
      `  ✓ ${relative.replace(/\\/g, '/')} → ${info.width}×${info.height}, ${(info.size / 1024).toFixed(0)} KB (−${saved}%)`,
    )
    stats.converted += 1
  } catch (error) {
    console.error(`  ✗ ${relative}: ${error.message}`)
    stats.failed += 1
  }
}

const sources = await walk(SOURCE_DIR)

if (sources.length === 0) {
 console.log(`Nothing to do, no source images found in ${path.relative(ROOT, SOURCE_DIR)}/`)
  console.log('Drop full-resolution photos there, mirroring public/images/, then run this again.')
} else {
  console.log(`Processing ${sources.length} image(s)…\n`)
  for (const source of sources) {
    await convert(source)
  }
  console.log(`\n${stats.converted} converted · ${stats.skipped} already current · ${stats.failed} failed`)
}

if (stats.failed > 0) process.exitCode = 1
