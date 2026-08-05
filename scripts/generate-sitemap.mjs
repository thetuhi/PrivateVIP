#!/usr/bin/env node
// Writes public/sitemap.xml and public/robots.txt from the same route list and
// catalog data the app renders, so a new experience is discoverable without a
// second place to remember to edit.
//
//   npm run sitemap   (also runs automatically as part of `npm run build`)

import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC_DIR = path.join(ROOT, 'public')

const SITE_URL = (process.env.VITE_SITE_URL || 'https://privatevipistanbul.com').replace(/\/$/, '')

// Imported rather than duplicated, these are plain ES modules with no JSX.
const { experiences } = await import('../src/data/experiences.js')
const { policyList } = await import('../src/content/policies.js')

const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/experiences', priority: '0.9', changefreq: 'monthly' },
  { path: '/yachts', priority: '0.9', changefreq: 'monthly' },
  { path: '/transfers', priority: '0.8', changefreq: 'monthly' },
  { path: '/plan', priority: '0.8', changefreq: 'yearly' },
  { path: '/about', priority: '0.6', changefreq: 'yearly' },
  { path: '/contact', priority: '0.6', changefreq: 'yearly' },
  { path: '/faq', priority: '0.5', changefreq: 'yearly' },
]

const routes = [
  ...STATIC_ROUTES,
  ...experiences.map((e) => ({ path: `/experiences/${e.slug}`, priority: '0.8', changefreq: 'monthly' })),
  ...policyList.map((p) => ({ path: `/policy/${p.slug}`, priority: '0.2', changefreq: 'yearly' })),
]

const today = new Date().toISOString().slice(0, 10)

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`

await writeFile(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap, 'utf8')
await writeFile(path.join(PUBLIC_DIR, 'robots.txt'), robots, 'utf8')

console.log(`Wrote sitemap.xml (${routes.length} URLs) and robots.txt for ${SITE_URL}`)
