import { createClient } from '@libsql/client'
import { writeFileSync, mkdirSync } from 'fs'
import path from 'path'

const OUT_DIR = path.join('public', 'images', 'blog')
mkdirSync(OUT_DIR, { recursive: true })

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

const { rows } = await db.execute('SELECT slug, image_url FROM posts WHERE image_url IS NOT NULL')

let done = 0
for (const row of rows) {
  const slug = row.slug
  const url = row.image_url
  const ext = path.extname(new URL(url).pathname) || '.jpg'
  const filename = `${slug}${ext}`
  const localPath = `/images/blog/${filename}`

  const res = await fetch(url)
  if (!res.ok) {
    console.log(`  SKIP (${res.status}): ${slug}`)
    continue
  }
  const buf = Buffer.from(await res.arrayBuffer())
  writeFileSync(path.join(OUT_DIR, filename), buf)

  await db.execute({
    sql: 'UPDATE posts SET image_url = ? WHERE slug = ?',
    args: [localPath, slug],
  })
  done++
  console.log(`  ${slug} -> ${localPath}`)
}

console.log(`\nDownloaded and re-pointed ${done}/${rows.length} images to local files.`)
