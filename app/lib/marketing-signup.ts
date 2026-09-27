import 'server-only'
import { randomBytes } from 'node:crypto'
import { db } from './db'
import {
  SIGNUP_GROUP,
  isSignupEmail,
  mergeGroups,
  nextOptOut,
  normaliseSignupEmail,
} from './marketing-signup-rules'

/**
 * Putting someone who used the contact form onto the marketing list.
 *
 * Everyone who writes in becomes a contact, so the admin has one list of
 * people rather than two. Whether they *receive* promotions is decided only
 * by the tick box on the form: no tick means the contact exists with offers
 * switched off, and nothing is ever sent to them until someone turns it on
 * by hand in the admin panel.
 */

/** Matches the key the admin panel generates, so unsubscribe links work. */
const newUnsubKey = () => randomBytes(24).toString('base64url')

export type SignupInput = {
  email: string
  name?: string
  phone?: string
  consent: boolean
}

/**
 * Never throws: an enquiry must be recorded and answered even if the
 * marketing list cannot be written to, so the caller ignores the result.
 */
export async function addEnquirerToMarketing(input: SignupInput): Promise<void> {
  const email = normaliseSignupEmail(input.email)
  if (!isSignupEmail(email)) return
  const name = String(input.name ?? '').trim().slice(0, 200)
  const phone = String(input.phone ?? '').trim().slice(0, 40)

  try {
    const found = await db.execute({
      sql: 'SELECT id, name, phone, groups, opt_out FROM marketing_contacts WHERE email = ? LIMIT 1',
      args: [email],
    })
    const row = found.rows[0] as Record<string, unknown> | undefined

    if (!row) {
      await db.execute({
        sql: `INSERT INTO marketing_contacts
                (email, name, phone, country, region, groups, opt_out, unsub_key, source)
              VALUES (?, ?, ?, '', '', ?, ?, ?, 'manual')`,
        // 'manual' rather than a truer value because the column's CHECK
        // constraint allows only manual/import, and widening it would mean
        // rebuilding a table that holds data. The group carries the origin.
        args: [email, name, phone, SIGNUP_GROUP, nextOptOut(input.consent), newUnsubKey()],
      })
      return
    }

    // Someone who opted in earlier stays opted in: not ticking the box on a
    // later enquiry is not the same as asking to be taken off the list. Only
    // an actual unsubscribe, or the admin, turns offers back off.
    const optOut = nextOptOut(input.consent, Number(row.opt_out))

    await db.execute({
      sql: `UPDATE marketing_contacts
            SET name = ?, phone = ?, groups = ?, opt_out = ?, updated_at = datetime('now')
            WHERE id = ?`,
      args: [
        name || String(row.name ?? ''),
        phone || String(row.phone ?? ''),
        mergeGroups(String(row.groups ?? ''), SIGNUP_GROUP),
        optOut,
        Number(row.id),
      ],
    })
  } catch (error) {
    // A missing marketing_contacts table is the common case here, before the
    // admin has run setup. Logged, never surfaced to the person writing in.
    console.error(
      'Marketing signup skipped',
      error instanceof Error ? error.message : error,
    )
  }
}
