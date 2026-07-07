import { readFileSync } from 'fs'
import { createClient } from '@libsql/client'

const posts = JSON.parse(readFileSync('./scripts/parsed-posts.json', 'utf8'))

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '-')
    .replace(/&nbsp;/g, ' ')
}

// Single-line strip, for titles/excerpts
function stripHtml(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()
}

// Paragraph-preserving strip, for post body content
function stripHtmlBlock(html) {
  return decodeEntities(
    html
      .replace(/<\/(p|div|li|h[1-6]|blockquote)>/gi, '\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
  )
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function readTime(text) {
  const words = text.split(/\s+/).length
  const mins = Math.max(1, Math.round(words / 200))
  return `${mins} min read`
}

function formatDate(d) {
  const dt = new Date(d)
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getCategory(slug, title) {
  const t = (slug + ' ' + title).toLowerCase()
  if (/cyber|security|password|attack|hack|malware|ransomware|firewall|threat|phishing|mfa/.test(t)) return 'Cyber Security'
  if (/cloud|azure|microsoft.?365|office.?365|sharepoint|teams|saas|migration/.test(t)) return 'Cloud'
  if (/digital.?market|seo|google.?ads|social.?media|ppc|marketing|campaign/.test(t)) return 'Digital Marketing'
  if (/cctv|camera|biometric|zkteco|ua300|ua760|attendance|access.?control|integration|cabling|network.?install/.test(t)) return 'System Integration'
  if (/website|web.?dev|software.?dev|app.?dev|custom.?software|mobile.?app|ui.?ux/.test(t)) return 'Web & Apps'
  if (/ai.service|artificial.intel|machine.learn/.test(t)) return 'Cloud'
  return 'IT Support'
}

const converted = posts.map((p) => {
  const plainContent = stripHtmlBlock(p.content)
  const flatContent = plainContent.replace(/\n+/g, ' ')
  const rawExcerpt = p.excerpt ? stripHtml(p.excerpt) : ''
  const excerpt = rawExcerpt.length > 30
    ? rawExcerpt.substring(0, 280).replace(/\s\S*$/, '...')
    : flatContent.substring(0, 280).replace(/\s\S*$/, '...')

  return {
    slug: p.slug,
    title: stripHtml(p.title),
    excerpt,
    category: getCategory(p.slug, p.title),
    date: formatDate(p.date),
    read_time: readTime(plainContent),
    content: plainContent,
  }
})

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

await db.execute(`
  CREATE TABLE IF NOT EXISTS posts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    slug       TEXT UNIQUE NOT NULL,
    category   TEXT NOT NULL DEFAULT 'IT Support',
    title      TEXT NOT NULL,
    excerpt    TEXT NOT NULL DEFAULT '',
    content    TEXT NOT NULL DEFAULT '',
    date       TEXT NOT NULL,
    read_time  TEXT NOT NULL DEFAULT '5 min read',
    published  INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`)

for (const p of converted) {
  await db.execute({
    sql: `INSERT INTO posts (slug, category, title, excerpt, content, date, read_time, published)
          VALUES (?, ?, ?, ?, ?, ?, ?, 1)
          ON CONFLICT(slug) DO UPDATE SET
            title = excluded.title,
            excerpt = excluded.excerpt,
            content = excluded.content,
            category = excluded.category,
            date = excluded.date,
            read_time = excluded.read_time,
            published = excluded.published`,
    args: [p.slug, p.category, p.title, p.excerpt, p.content, p.date, p.read_time],
  })
}

console.log(`Seeded ${converted.length} posts into Turso.`)
const cats = {}
converted.forEach((p) => { cats[p.category] = (cats[p.category] || 0) + 1 })
Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([c, n]) => console.log(`  ${String(n).padStart(2)}x ${c}`))
