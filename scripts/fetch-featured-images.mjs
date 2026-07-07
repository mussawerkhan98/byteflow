import { createClient } from '@libsql/client'

const res = await fetch('https://byteflow.ae/wp-json/wp/v2/posts?per_page=100&_embed')
if (!res.ok) throw new Error(`WP API error: ${res.status}`)
const wpPosts = await res.json()

const imagesBySlug = new Map()
for (const p of wpPosts) {
  const media = p._embedded?.['wp:featuredmedia']?.[0]
  if (media?.source_url) imagesBySlug.set(p.slug, media.source_url)
}

console.log(`Fetched ${wpPosts.length} WP posts, ${imagesBySlug.size} with featured images.`)

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

await db.execute(`ALTER TABLE posts ADD COLUMN image_url TEXT`).catch((err) => {
  if (!/duplicate column/i.test(err.message)) throw err
})

const { rows } = await db.execute('SELECT slug FROM posts')
let updated = 0
let missing = []
for (const row of rows) {
  const url = imagesBySlug.get(row.slug)
  if (!url) {
    missing.push(row.slug)
    continue
  }
  await db.execute({
    sql: 'UPDATE posts SET image_url = ? WHERE slug = ?',
    args: [url, row.slug],
  })
  updated++
}

console.log(`Updated ${updated}/${rows.length} posts with image_url.`)
if (missing.length) {
  console.log(`No match found for ${missing.length} slug(s):`)
  missing.forEach((s) => console.log(`  - ${s}`))
}
