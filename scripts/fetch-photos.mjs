#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// LOCATION-ACCURATE PHOTOGRAPHY from Wikimedia Commons.
//
//   npm run photos:fetch            fill empty slots
//   npm run photos:fetch -- --force replace everything
//   npm run photos:fetch -- --only hero,yachts   limit to matching slots
//
// Replaces the random stock placeholders with photographs of the actual places
// each section describes: this Hagia Sophia, this stretch of the Bosphorus,
// this bazaar.
//
// Colour is left alone. The earlier placeholder pass applied a warm tint and
// pulled saturation down to force unrelated stock into one palette; real
// photography of Istanbul does not need that, and doing it would throw away the
// blue of the strait and the colour of the golden hour, which are the reasons
// to photograph the city in the first place. The only processing here is crop,
// resize and encode.
//
// ⚠ LICENSING. Commons images are free to use but most carry attribution
// requirements (CC BY, CC BY-SA). This writes PHOTO-CREDITS.md with the author
// and licence for every file. On a commercial site those credits have to appear
// somewhere reachable, and a CC BY-SA image obliges you to share adaptations
// alike. Anything the agency shoots itself avoids all of this, which is why
// these remain placeholders with a paper trail rather than a final answer.
// ─────────────────────────────────────────────────────────────────────────────

import { mkdir, writeFile, access } from 'node:fs/promises'
import { constants } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'public', 'images')
const FORCE = process.argv.includes('--force')
const onlyArg = process.argv.indexOf('--only')
const ONLY = onlyArg > -1 ? (process.argv[onlyArg + 1] || '').split(',').filter(Boolean) : null

const UA = 'PrivateVIPIstanbul/1.0 (static site build; contact reservations@privatevipistanbul.com)'

// Output geometry per usage. Unchanged from the placeholder pass so nothing in
// the layout shifts.
const SIZE = {
  hero: [2000, 1125],
  gallery: [1600, 1200],
  yacht: [1920, 1200],
  fleet: [1600, 1200],
  teaser: [1600, 1067],
  portrait: [1400, 1750],
  og: [1200, 630],
}

// Every slot, with what it must actually show.
const SLOTS = [
  // ---- Imperial Istanbul ----
  ['experiences/imperial-istanbul/hagia-sophia-interior.webp', 'Hagia Sophia interior dome Istanbul', 'gallery'],
  ['experiences/imperial-istanbul/topkapi-courtyard.webp', 'Topkapı Palace Istanbul gate', 'gallery'],
  ['experiences/imperial-istanbul/blue-mosque-dome.webp', 'Sultan Ahmed Mosque interior dome Istanbul', 'gallery'],
  ['experiences/imperial-istanbul/basilica-cistern.webp', 'Basilica Cistern Istanbul columns', 'gallery'],
  ['experiences/imperial-istanbul/sultanahmet-dusk.webp', 'Sultanahmet Istanbul skyline sunset', 'gallery'],

  // ---- The Ottoman Table ----
  ['experiences/the-ottoman-table/meze-table.webp', 'Category:Meze', 'gallery'],
  ['experiences/the-ottoman-table/kadikoy-market.webp', 'Kadıköy market Istanbul', 'gallery'],
  ['experiences/the-ottoman-table/spice-merchant.webp', 'Spice Bazaar Istanbul spices shop', 'gallery'],
  ['experiences/the-ottoman-table/meyhane-evening.webp', 'meze table Turkish food restaurant', 'gallery'],

  // ---- Bosphorus Shores ----
  ['experiences/bosphorus-shores/bosphorus-mansion.webp', 'Bosphorus Istanbul houses shore', 'gallery'],
  ['experiences/bosphorus-shores/rumeli-fortress.webp', 'Category:Rumeli Hisarı', 'gallery'],
  ['experiences/bosphorus-shores/bebek-morning.webp', 'Bebek Bosphorus Istanbul', 'gallery'],
  ['experiences/bosphorus-shores/anadolu-kavagi.webp', 'Anadolu Kavağı Bosphorus Istanbul', 'gallery'],
  ['experiences/bosphorus-shores/boat-deck.webp', 'Bosphorus cruise boat Istanbul', 'gallery'],

  // ---- Byzantine Hours ----
  ['experiences/byzantine-hours/chora-mosaic.webp', 'Chora Church mosaic Istanbul Kariye', 'gallery'],
  ['experiences/byzantine-hours/balat-street.webp', 'Balat Istanbul colourful houses street', 'gallery'],
  ['experiences/byzantine-hours/theodosian-walls.webp', 'Walls of Constantinople Istanbul land walls', 'gallery'],
  ['experiences/byzantine-hours/fener-church.webp', 'Bulgarian St Stephen Church Istanbul Fener', 'gallery'],

  // ---- Bazaar Sourcing ----
  ['experiences/bazaar-sourcing/grand-bazaar-arch.webp', 'Grand Bazaar Istanbul', 'gallery'],
  ['experiences/bazaar-sourcing/carpet-pile.webp', 'Turkish carpets rugs shop', 'gallery'],
  ['experiences/bazaar-sourcing/jeweller-workshop.webp', 'jewellery shop window gold', 'gallery'],
  ['experiences/bazaar-sourcing/spice-bazaar.webp', 'Egyptian Spice Bazaar Istanbul interior', 'gallery'],

  // ---- Princes' Islands ----
  ['experiences/princes-islands/buyukada-house.webp', 'Category:Büyükada', 'gallery'],
  ['experiences/princes-islands/island-pine-road.webp', 'pine forest road island', 'gallery'],
  ['experiences/princes-islands/island-jetty.webp', 'Category:Büyükada', 'gallery'],
  ['experiences/princes-islands/aya-yorgi-view.webp', 'Aya Yorgi Büyükada view', 'gallery'],

  // ---- Istanbul After Dark ----
  ['experiences/istanbul-after-dark/rooftop-night.webp', 'Istanbul night panorama city lights', 'gallery'],
  ['experiences/istanbul-after-dark/sema-ceremony.webp', 'Category:Whirling dervishes', 'gallery'],
  ['experiences/istanbul-after-dark/bosphorus-bridge-night.webp', 'Bosphorus Bridge night Istanbul illuminated', 'gallery'],
  ['experiences/istanbul-after-dark/jazz-cellar.webp', 'jazz musicians club stage', 'gallery'],

  // ---- Cappadocia by Air ----
  ['experiences/cappadocia-by-air/cappadocia-balloons.webp', 'Cappadocia hot air balloons many sky', 'gallery'],
  ['experiences/cappadocia-by-air/goreme-valley.webp', 'Category:Göreme', 'gallery'],
  ['experiences/cappadocia-by-air/cave-hotel-terrace.webp', 'Category:Göreme', 'gallery'],
  ['experiences/cappadocia-by-air/underground-city.webp', 'Derinkuyu underground city Cappadocia', 'gallery'],

  // ---- Yachts ----
  ['yachts/classic-wooden-ketch/ketch-deck.webp', 'Category:Gulet', 'yacht'],
  ['yachts/classic-wooden-ketch/ketch-saloon.webp', 'Category:Gulet', 'yacht'],
  ['yachts/classic-wooden-ketch/ketch-bow.webp', 'Category:Gulet', 'yacht'],
  ['yachts/classic-wooden-ketch/ketch-sunset.webp', 'sailing yacht sunset sea', 'yacht'],
  ['yachts/motor-yacht-24/motoryacht-profile.webp', 'motor yacht white cruising', 'yacht'],
  ['yachts/motor-yacht-24/motoryacht-flybridge.webp', 'yacht sun deck chairs', 'yacht'],
  ['yachts/motor-yacht-24/motoryacht-salon.webp', 'motor yacht salon lounge interior', 'yacht'],
  ['yachts/bosphorus-classic-launch/launch-varnish.webp', 'wooden motor launch varnished boat', 'yacht'],
  ['yachts/bosphorus-classic-launch/launch-cockpit.webp', 'motorboat helm cockpit', 'yacht'],
  ['yachts/bosphorus-classic-launch/launch-night.webp', 'Istanbul night Bosphorus lights', 'yacht'],
  ['yachts/sailing-catamaran/catamaran-anchor.webp', 'catamaran sailing sea', 'yacht'],
  ['yachts/sailing-catamaran/catamaran-net.webp', 'catamaran sailing open sea', 'yacht'],
  ['yachts/sailing-catamaran/catamaran-galley.webp', 'catamaran sailing open sea', 'yacht'],

  // ---- Fleet ----
  ['fleet/s-class.webp', 'Mercedes-Benz S-Class black sedan', 'fleet'],
  ['fleet/s-class-interior.webp', 'Mercedes-Benz S-Class W222 interior', 'fleet'],
  ['fleet/v-class.webp', 'Mercedes-Benz V-Class black luxury van', 'fleet'],
  ['fleet/v-class-interior.webp', 'Mercedes-Benz V-Class interior', 'fleet'],
  ['fleet/sprinter.webp', 'Mercedes-Benz Sprinter passenger van', 'fleet'],
  ['fleet/sprinter-interior.webp', 'Mercedes-Benz Sprinter passenger seats interior', 'fleet'],
  ['fleet/armoured.webp', 'Mercedes-Benz S-Class black limousine', 'fleet'],

  // ---- Standalone ----
  ['hero/bosphorus-dusk.webp', 'Istanbul Bosphorus sunset skyline mosque', 'hero'],
  ['home/cta-bosphorus.webp', 'Istanbul Bosphorus evening view', 'hero'],
  ['home/yacht-teaser.webp', 'yacht Bosphorus Istanbul boat', 'teaser'],
  ['home/fleet-teaser.webp', 'Mercedes-Benz V-Class black luxury van', 'teaser'],
  ['home/bespoke-teaser.webp', 'Istanbul Galata street view', 'teaser'],
  ['about/office.webp', 'Beyoğlu Istanbul street building', 'portrait'],
  ['brand/og-cover.webp', 'Istanbul skyline Bosphorus panorama', 'og'],
]

// Commons is full of engravings, plans, maps and museum scans. None of them are
// photographs of the place as it is today.
const REJECT = /\b(map|plan|drawing|engraving|lithograph|sketch|diagram|coat of arms|coin|stamp|manuscript|painting|illustration|poster|logo|seal|chart|section|elevation|blueprint|1[5-9]\d\d|18\d\d|19[0-3]\d)\b/i

async function exists(p) {
  try {
    await access(p, constants.F_OK)
    return true
  } catch {
    return false
  }
}

async function fetchPages(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`API HTTP ${res.status}`)
  const json = await res.json()
  return Object.values(json.query?.pages || {})
}

const IMAGEINFO = '&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=2400'
const API = 'https://commons.wikimedia.org/w/api.php?action=query&format=json'

/**
 * `query` may be a search string, or "Category:Name" to list a curated
 * category. Categories are much more reliable for subjects that full-text
 * search fumbles, a specific Mercedes model, whirling dervishes, one named
 * fortress, because a person filed each file there deliberately.
 */
async function search(query, targetRatio) {
  const pages = query.startsWith('Category:')
    ? await fetchPages(
        `${API}&generator=categorymembers&gcmtitle=${encodeURIComponent(query)}` +
          `&gcmtype=file&gcmlimit=60${IMAGEINFO}`,
      )
    : await fetchPages(
        `${API}&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=40${IMAGEINFO}`,
      )

  const scored = []
  for (const page of pages) {
    const ii = page.imageinfo?.[0]
    if (!ii || !ii.thumburl) continue
    if (!/^image\/(jpeg|png|webp)$/.test(ii.mime || '')) continue
    if (ii.width < 1000) continue

    const title = page.title.replace(/^File:/, '')
    const meta = ii.extmetadata || {}
    if (REJECT.test(title)) continue

    const ratio = ii.width / ii.height
    // Closeness to the slot's own shape, so a portrait does not get cropped to
    // a hero banner and lose its subject.
    const shape = 1 - Math.min(1, Math.abs(ratio - targetRatio) / targetRatio)
    const size = Math.min(1, ii.width / 3000)
    scored.push({
      title,
      url: ii.thumburl,
      width: ii.width,
      height: ii.height,
      artist: String(meta.Artist?.value || 'Unknown').replace(/<[^>]+>/g, '').trim().slice(0, 80),
      licence: String(meta.LicenseShortName?.value || 'see Commons').trim(),
      descUrl: ii.descriptionurl,
      score: shape * 2 + size,
    })
  }

  scored.sort((a, b) => b.score - a.score)
  return scored
}

async function download(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`download HTTP ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

const credits = []
// Two slots asking for "Istanbul skyline" will otherwise land on the same
// famous photograph, and a gallery that repeats itself reads as a placeholder.
const usedTitles = new Set()
let written = 0
let skipped = 0
let failed = 0

for (const [rel, query, kind] of SLOTS) {
  if (ONLY && !ONLY.some((f) => rel.includes(f))) continue

  const target = path.join(OUT, rel)
  if (!FORCE && (await exists(target))) {
    skipped += 1
    continue
  }

  const [w, h] = SIZE[kind]
  await new Promise((r) => setTimeout(r, 400))

  try {
    const candidates = await search(query, w / h)
    if (!candidates.length) throw new Error('no usable result')

    let saved = null
    const fresh = candidates.filter((c) => !usedTitles.has(c.title))
    for (const c of (fresh.length ? fresh : candidates).slice(0, 4)) {
      try {
        const input = await download(c.url)
        const out = await sharp(input)
          .resize(w, h, { fit: 'cover', position: 'attention' })
          // No tint, no desaturation. The colour in these photographs is the
          // point: the blue of the strait, the gold on the domes.
          .webp({ quality: 72, effort: 6 })
          .toBuffer()
        await mkdir(path.dirname(target), { recursive: true })
        await writeFile(target, out)
        saved = { ...c, bytes: out.length }
        break
      } catch {
        /* Try the next candidate. */
      }
    }

    if (!saved) throw new Error('all candidates failed to download')

    usedTitles.add(saved.title)
    credits.push({ rel, query, ...saved })
    written += 1
    process.stdout.write(`  ✓ ${rel}\n      ${saved.title.slice(0, 68)}\n      ${saved.licence} · ${saved.artist.slice(0, 46)}\n`)
  } catch (error) {
    failed += 1
    process.stdout.write(`  ✗ ${rel}: ${error.message}\n`)
  }
}

if (credits.length) {
  const md = [
    '# Photo credits',
    '',
    'Photographs sourced from Wikimedia Commons by `npm run photos:fetch`.',
    '',
    '⚠ Most of these carry attribution requirements. On a public commercial site',
    'the credits below must appear somewhere reachable, and any image marked',
    'CC BY-SA obliges you to license adaptations alike. Replacing them with the',
    "agency's own photography removes both obligations.",
    '',
    '| File | Source | Licence | Author |',
    '|---|---|---|---|',
    ...credits.map((c) => `| \`${c.rel}\` | [${c.title.slice(0, 50)}](${c.descUrl}) | ${c.licence} | ${c.artist} |`),
    '',
  ].join('\n')
  await writeFile(path.join(ROOT, 'PHOTO-CREDITS.md'), md, 'utf8')
}

console.log(`\n${written} fetched · ${skipped} kept · ${failed} failed`)
if (credits.length) console.log('Credits written to PHOTO-CREDITS.md')
if (failed) process.exitCode = 1
