import 'server-only'
import { timingSafeEqual } from 'node:crypto'
import { db } from './db'

/**
 * The parts of the marketing system that face the recipient rather than the
 * admin: unsubscribing, click tracking and the offer image.
 *
 * The admin panel writes these rows; this app only reads them and records
 * clicks, so nothing here can change a promotion's content.
 */

/** Compared in constant time so a key cannot be guessed a byte at a time. */
export function keyMatches(supplied: string, expected: string): boolean {
  const left = Buffer.from(String(supplied ?? ''))
  const right = Buffer.from(String(expected ?? ''))
  if (!left.length || left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

export type UnsubscribeResult = 'unsubscribed' | 'already' | 'invalid'

/**
 * Opting out applies to the email address, not to one row, so every record
 * sharing that address follows. A wrong or missing key changes nothing.
 */
export async function unsubscribe(personId: number, key: string): Promise<UnsubscribeResult> {
  if (!personId || !key) return 'invalid'
  try {
    const found = await db.execute({
      sql: 'SELECT email, unsub_key, opt_out FROM marketing_contacts WHERE id = ? LIMIT 1',
      args: [personId],
    })
    const row = found.rows[0]
    if (!row) return 'invalid'
    if (!keyMatches(key, String(row.unsub_key ?? ''))) return 'invalid'
    const already = Number(row.opt_out) === 1
    await db.execute({
      sql: "UPDATE marketing_contacts SET opt_out = 1, updated_at = datetime('now') WHERE email = ?",
      args: [String(row.email ?? '')],
    })
    return already ? 'already' : 'unsubscribed'
  } catch {
    return 'invalid'
  }
}

export async function resubscribe(personId: number, key: string): Promise<boolean> {
  if (!personId || !key) return false
  try {
    const found = await db.execute({
      sql: 'SELECT email, unsub_key FROM marketing_contacts WHERE id = ? LIMIT 1',
      args: [personId],
    })
    const row = found.rows[0]
    if (!row || !keyMatches(key, String(row.unsub_key ?? ''))) return false
    await db.execute({
      sql: "UPDATE marketing_contacts SET opt_out = 0, updated_at = datetime('now') WHERE email = ?",
      args: [String(row.email ?? '')],
    })
    return true
  } catch {
    return false
  }
}

/**
 * Mail security products open every link in a message before the recipient
 * ever sees it. Counting those as clicks would make every promotion look
 * like a runaway success.
 */
const BOT_PATTERN =
  /(bot|crawl|spider|preview|scanner|safelinks|proofpoint|mimecast|barracuda|headless|curl|wget|python|go-http|java\/|okhttp|axios|node-fetch|slurp|monitor|uptime)/i

export const looksAutomated = (userAgent: string | null) =>
  !userAgent || BOT_PATTERN.test(userAgent)

/**
 * Where a tracked link goes.
 *
 * The destination comes only from the campaign row the token belongs to —
 * never from the request — so a token cannot be used to bounce someone to an
 * arbitrary site. An unknown token goes to the homepage.
 */
export async function resolveClick(
  token: string,
  countIt: boolean,
): Promise<string | null> {
  if (!token || !/^[A-Za-z0-9_-]{8,128}$/.test(token)) return null
  try {
    const found = await db.execute({
      sql: `SELECT r.id, c.button_url
            FROM campaign_recipients r JOIN campaigns c ON c.id = r.campaign_id
            WHERE r.token = ? LIMIT 1`,
      args: [token],
    })
    const row = found.rows[0]
    if (!row) return null

    if (countIt) {
      await db.execute({
        sql: `UPDATE campaign_recipients
              SET clicks = clicks + 1,
                  first_click_at = COALESCE(first_click_at, datetime('now')),
                  last_click_at = datetime('now')
              WHERE id = ?`,
        args: [Number(row.id)],
      })
    }

    const destination = String(row.button_url ?? '').trim()
    return /^https?:\/\//i.test(destination) ? destination : null
  } catch {
    return null
  }
}

export async function campaignImage(id: number) {
  if (!id) return null
  try {
    const found = await db.execute({
      sql: 'SELECT image_data, image_mime FROM campaigns WHERE id = ? LIMIT 1',
      args: [id],
    })
    const row = found.rows[0]
    if (!row || !row.image_data) return null
    const mime = String(row.image_mime ?? '')
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(mime)) return null
    const raw = row.image_data as ArrayBuffer | Uint8Array
    const data = raw instanceof Uint8Array ? raw : new Uint8Array(raw)
    return { data, mime }
  } catch {
    return null
  }
}

/**
 * Best-effort rate limiting, per serverless instance. Not a security control
 * on its own — the constant-time key check is what actually protects the
 * endpoint — but it keeps someone from walking through ids in a tight loop.
 */
const hits = new Map<string, { count: number; until: number }>()

export function rateLimited(ip: string, limit = 20, windowMs = 60_000): boolean {
  const now = Date.now()
  const entry = hits.get(ip)
  if (!entry || entry.until < now) {
    hits.set(ip, { count: 1, until: now + windowMs })
    if (hits.size > 5000) hits.clear()
    return false
  }
  entry.count += 1
  return entry.count > limit
}

export const clientIp = (request: Request) =>
  (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown'
