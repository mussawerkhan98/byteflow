/**
 * Fills each service's home page tab fields with the wording the Services
 * section already shows, so editors see real text in the admin instead of
 * blanks. Only blank fields are written: anything already typed in the admin
 * is left alone, and running it twice changes nothing.
 *
 * Needs the eyebrow / tagline / highlights / image_caption columns, which the
 * admin's scripts/migrate-cms.mjs adds. Run that first.
 *
 *   node --env-file=<env file> scripts/seed-service-tabs.mjs --expect-host=<database host> [--dry-run]
 */
import { createClient } from '@libsql/client'
import { services as pages } from '../app/lib/services-data.ts'

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

const columns = new Set((await db.execute('PRAGMA table_info(services)')).rows.map((row) => String(row.name)))
const missing = ['eyebrow', 'tagline', 'highlights', 'image_caption'].filter((name) => !columns.has(name))
if (missing.length) throw new Error(`Missing columns ${missing.join(', ')}: run the admin's scripts/migrate-cms.mjs first.`)

const rows = (await db.execute('SELECT id, slug, eyebrow, tagline, highlights, image_caption FROM services')).rows
let changed = 0
for (const row of rows) {
  const page = pages.find((p) => p.slug === row.slug)
  if (!page) continue
  const wanted = {
    eyebrow: page.eyebrow,
    tagline: page.tagline,
    highlights: page.features.slice(0, 4).map((feature) => feature.title).join('\n'),
    image_caption: page.caption,
  }
  // An earlier run of this script filled captions from the service page's
  // headline figure, most of them unverified. A caption still saying exactly
  // that was never edited, so it is replaced like a blank one.
  const stat = page.heroStats[0]
  const oldCaption = stat ? `${stat.value} · ${stat.label}` : null
  const isBlank = (name) => {
    const current = String(row[name] ?? '').trim()
    return !current || (name === 'image_caption' && current === oldCaption)
  }
  // Only the blank ones.
  const fill = Object.entries(wanted).filter(([name, value]) => value && isBlank(name))
  if (!fill.length) continue
  changed++
  console.log(`${row.slug}: ${fill.map(([name]) => name).join(', ')}`)
  if (!dryRun)
    await db.execute({
      sql: `UPDATE services SET ${fill.map(([name]) => `${name} = ?`).join(', ')}, updated_at = datetime('now') WHERE id = ?`,
      args: [...fill.map(([, value]) => value), row.id],
    })
}
console.log(changed ? `${dryRun ? 'Would fill' : 'Filled'} ${changed} services.` : 'Nothing to fill: every service already has its wording.')
