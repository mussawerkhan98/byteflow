/**
 * Converts the PNG and JPEG images the home page shows to WebP, the way the
 * admin's image pipeline stores an upload:
 *
 * - the file as uploaded is kept as a media row with role 'original';
 * - a resized WebP copy is added with role 'served', its width and height,
 *   a descriptive file name and original_id pointing at the original;
 * - the content then links to /api/media/<served id>/<name>.webp.
 *
 * Nothing is deleted. The old link keeps working (a file under public/ stays
 * where it is, an older media row keeps its id), so pages and search results
 * that still point at it don't break. Running it twice changes nothing: a
 * link that already points at WebP is skipped, and a byte-identical file
 * reuses its media row.
 *
 * Looks at: the logo (site_settings.logo_url), the home page banner images,
 * the service images on the home page tabs and the four latest posts.
 *
 * The /api/media/<id>/<name> links need the website's
 * app/api/media/[id]/[name] route, so deploy the website before running this
 * against the database the live site reads.
 *
 *   node --env-file=<env file> scripts/convert-home-images.mjs --expect-host=<database host> [--dry-run]
 */
import { readFile } from 'node:fs/promises'
import { createClient } from '@libsql/client'
import sharp from 'sharp'

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value = 'true'] = arg.replace(/^--/, '').split('=')
    return [key, value]
  }),
)
const url = process.env.TURSO_DATABASE_URL
if (!url) throw new Error('TURSO_DATABASE_URL is required')
const host = new URL(url.replace(/^libsql:/, 'https:')).host
if (!args['expect-host']) throw new Error(`Pass --expect-host=${host} to confirm this is the database you mean.`)
if (args['expect-host'] !== host) throw new Error(`Refusing to run: TURSO_DATABASE_URL points at ${host}, not ${args['expect-host']}.`)
const dryRun = args['dry-run'] === 'true'

const db = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN })
console.log(`Database: ${host}${dryRun ? ' (dry run — nothing is written)' : ''}`)

const CONVERT = new Set(['image/png', 'image/jpeg'])
const MEDIA = /^\/api\/media\/(\d+)(?:\/[^/?#]*)?$/

const slug = (value) =>
  value
    .replace(/\.[a-z0-9]+$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || 'image'

/** The bytes behind a link, or null for anything this script doesn't convert. */
async function load(link) {
  const media = MEDIA.exec(link)
  if (media) {
    const row = (await db.execute({ sql: 'SELECT * FROM media WHERE id = ?', args: [Number(media[1])] })).rows[0]
    const data = /^data:([^;,]+);base64,(.*)$/s.exec(String(row?.url ?? ''))
    if (!row || !data) return null
    const mime = String(row.mime_type || data[1]).toLowerCase()
    return { mime, bytes: Buffer.from(data[2], 'base64'), name: String(row.filename), alt: String(row.alt_text ?? ''), originalId: Number(row.id) }
  }
  // A file the website serves from public/ (the logo started out as one).
  if (/^\/(?!\/)[\w./-]+\.(png|jpe?g)$/i.test(link) && !link.includes('..')) {
    const bytes = await readFile(new URL(`../public${link}`, import.meta.url)).catch(() => null)
    if (!bytes) return null
    return { mime: /\.png$/i.test(link) ? 'image/png' : 'image/jpeg', bytes, name: link.split('/').pop(), alt: '', originalId: null }
  }
  return null
}

/** media.url is UNIQUE, so an identical file reuses the row already there. */
async function storeRow({ filename, mime, bytes, width, height, alt, role, originalId }) {
  const dataUrl = `data:${mime};base64,${bytes.toString('base64')}`
  const found = (await db.execute({ sql: 'SELECT id FROM media WHERE url = ?', args: [dataUrl] })).rows[0]
  if (found) return Number(found.id)
  if (dryRun) return 0
  const inserted = await db.execute({
    sql: `INSERT INTO media (filename, url, mime_type, size_bytes, alt_text, width, height, role, original_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [filename, dataUrl, mime, bytes.length, alt, width, height, role, originalId],
  })
  return Number(inserted.lastInsertRowid)
}

/**
 * Each place the home page reads an image from: a label, the current link,
 * how to save the new one, the name and alt text to give it and its size cap.
 */
async function targets() {
  const list = []
  const settings = (await db.execute('SELECT id, logo_url FROM site_settings LIMIT 1')).rows[0]
  if (settings?.logo_url)
    list.push({
      label: 'Logo',
      link: String(settings.logo_url),
      name: 'byteflow-logo',
      alt: 'Byteflow',
      // Shown at most 72px tall; this covers screens at 3x and then some.
      resize: { height: 432 },
      save: (next) => ({ sql: 'UPDATE site_settings SET logo_url = ? WHERE id = ? AND logo_url = ?', args: [next, settings.id, settings.logo_url] }),
    })

  const home = (await db.execute("SELECT * FROM pages WHERE slug = 'home' LIMIT 1")).rows[0]
  for (const column of ['hero_image', 'hero_background_image'])
    if (home && home[column])
      list.push({
        label: `Home banner (${column})`,
        link: String(home[column]),
        alt: String(home.hero_image_alt ?? ''),
        resize: { width: 2000 },
        save: (next) => ({ sql: `UPDATE pages SET ${column} = ? WHERE id = ? AND ${column} = ?`, args: [next, home.id, home[column]] }),
      })

  const services = await db.execute("SELECT id, slug, title, image_url, image_alt FROM services WHERE status = 'published' AND image_url <> ''")
  for (const service of services.rows)
    list.push({
      label: `Service tab: ${service.slug}`,
      link: String(service.image_url),
      alt: String(service.image_alt || service.title),
      resize: { width: 1600 },
      save: (next) => ({ sql: 'UPDATE services SET image_url = ? WHERE id = ? AND image_url = ?', args: [next, service.id, service.image_url] }),
    })

  // The same four the home page's blog section shows (db.ts getPosts).
  const posts = await db.execute("SELECT id, slug, title, image_url, image_alt FROM posts WHERE published = 1 AND image_url <> '' ORDER BY created_at DESC LIMIT 4")
  for (const post of posts.rows)
    list.push({
      label: `Post: ${post.slug}`,
      link: String(post.image_url),
      alt: String(post.image_alt || post.title),
      resize: { width: 1600 },
      save: (next) => ({ sql: 'UPDATE posts SET image_url = ? WHERE id = ? AND image_url = ?', args: [next, post.id, post.image_url] }),
    })
  return list
}

let converted = 0
for (const target of await targets()) {
  const source = await load(target.link)
  if (!source || !CONVERT.has(source.mime)) {
    console.log(`  skip  ${target.label}: ${source ? source.mime : 'not a PNG/JPEG this script can read'} (${target.link})`)
    continue
  }
  const alt = target.alt || source.alt
  const name = slug(target.name || alt || source.name)
  const meta = await sharp(source.bytes).metadata()

  // The file as it was uploaded, kept beside the copy that is served.
  const originalId =
    source.originalId ??
    (await storeRow({ filename: `${name}.${source.mime === 'image/png' ? 'png' : 'jpg'}`, mime: source.mime, bytes: source.bytes, width: meta.width, height: meta.height, alt, role: 'original', originalId: null }))

  const { data, info } = await sharp(source.bytes)
    .rotate()
    .resize({ ...target.resize, withoutEnlargement: true })
    .webp({ quality: 82, alphaQuality: 100, effort: 6 })
    .toBuffer({ resolveWithObject: true })
  const servedId = await storeRow({ filename: `${name}.webp`, mime: 'image/webp', bytes: data, width: info.width, height: info.height, alt, role: 'served', originalId: originalId || null })
  const next = `/api/media/${servedId || '<new>'}/${name}.webp`

  console.log(`  ${dryRun ? 'would' : 'done '} ${target.label}: ${target.link} (${Math.round(source.bytes.length / 1024)} KB ${source.mime}) -> ${next} (${Math.round(data.length / 1024)} KB, ${info.width}x${info.height})`)
  if (!dryRun) await db.execute(target.save(next))
  converted++
}
console.log(`${converted} image${converted === 1 ? '' : 's'} ${dryRun ? 'would be converted' : 'converted'}.`)
