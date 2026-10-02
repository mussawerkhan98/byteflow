/**
 * Builds the JSON-LD that tells search engines what this site is.
 *
 * Pure functions with no imports, so they can be tested directly and so the
 * same builder can run in a server component or a route. Everything is
 * driven from CMS data rather than written down here: change the phone
 * number in Contact details and the markup follows.
 *
 * Google only trusts markup that matches what the page actually shows, so
 * each builder returns null when its data is missing rather than emitting a
 * shell with empty fields.
 */

export const SITE_URL = 'https://www.byteflow.ae'

/**
 * The organization's @id.
 *
 * The organization itself is NOT published from here. It is injected by a
 * script named "Address" in the admin panel under Tracking codes, which
 * predates this file and carries a fuller address than Contact details
 * holds. The nodes below reference it by this id instead of describing it
 * again — two entities sharing one @id with different contents is worse
 * than either alone.
 *
 * So this string has to keep matching the @id in that script. If the script
 * is ever removed, the organization needs publishing from here instead, or
 * every `provider` and `publisher` below points at nothing.
 */
export const ORG_ID = `${SITE_URL}/#organization`

export type JsonLd = Record<string, unknown>

export const absoluteUrl = (path: string) => {
  const value = String(path ?? '').trim()
  if (!value) return SITE_URL
  if (/^https?:\/\//i.test(value)) return value
  return `${SITE_URL}${value.startsWith('/') ? value : `/${value}`}`
}

/**
 * FAQ answers are stored as HTML by the admin editor, but schema.org wants
 * the answer text. Entities are decoded so "&amp;" does not reach Google as
 * literal characters.
 */
export function plainText(value: unknown, limit = 5000): string {
  return String(value ?? '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(p|div|li|h[1-6])>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, limit)
}

export function serviceSchema(input: {
  name: string
  description?: string
  path: string
  image?: string
}): JsonLd | null {
  const name = plainText(input.name, 200)
  if (!name) return null
  const description = plainText(input.description, 600)
  return {
    '@type': 'Service',
    name,
    ...(description ? { description } : {}),
    url: absoluteUrl(input.path),
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    provider: { '@id': ORG_ID },
    areaServed: [
      { '@type': 'City', name: 'Dubai' },
      { '@type': 'Country', name: 'United Arab Emirates' },
    ],
  }
}

/**
 * FAQ rich results need every question to be visible on the page, so this
 * takes the same list the page renders. Duplicate questions are dropped:
 * repeated entities are a common reason Google rejects the markup.
 */
export function faqPageSchema(
  faqs: { q?: string; a?: string; question?: string; answer?: string }[],
): JsonLd | null {
  const seen = new Set<string>()
  const entities = []
  for (const faq of faqs ?? []) {
    const question = plainText(faq.question ?? faq.q, 300)
    const answer = plainText(faq.answer ?? faq.a, 2000)
    if (!question || !answer) continue
    const key = question.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    entities.push({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })
  }
  return entities.length ? { '@type': 'FAQPage', mainEntity: entities } : null
}

export function breadcrumbSchema(
  trail: { name: string; path: string }[],
): JsonLd | null {
  const items = (trail ?? []).filter((item) => item && plainText(item.name))
  if (items.length < 2) return null
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: plainText(item.name, 200),
      item: absoluteUrl(item.path),
    })),
  }
}

export function blogPostingSchema(input: {
  title: string
  description?: string
  path: string
  image?: string
  published?: string
  modified?: string
  author?: string
}): JsonLd | null {
  const headline = plainText(input.title, 110)
  if (!headline) return null
  const description = plainText(input.description, 600)
  const url = absoluteUrl(input.path)
  const date = (value: unknown) => {
    const parsed = new Date(String(value ?? ''))
    return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString()
  }
  const published = date(input.published)
  const modified = date(input.modified) || published

  return {
    '@type': 'BlogPosting',
    headline,
    ...(description ? { description } : {}),
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    ...(published ? { datePublished: published } : {}),
    ...(modified ? { dateModified: modified } : {}),
    author: input.author
      ? { '@type': 'Person', name: plainText(input.author, 120) }
      : { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
  }
}

/**
 * One @graph per page rather than several separate script tags: it lets the
 * nodes reference each other by @id, so Google reads one connected
 * description of the page instead of unrelated fragments.
 */
export function graph(...nodes: (JsonLd | null | undefined)[]): JsonLd | null {
  const present = nodes.filter(Boolean) as JsonLd[]
  if (!present.length) return null
  return { '@context': 'https://schema.org', '@graph': present }
}
