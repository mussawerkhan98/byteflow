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

/** Stable @id values, so the graph refers to one organization, not many. */
export const ORG_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`

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

/** Only real http(s) links reach the markup; anything else is dropped. */
const linkList = (...values: unknown[]) =>
  values
    .map((value) => String(value ?? '').trim())
    .filter((value) => /^https?:\/\//i.test(value))

type Settings = Record<string, string | number> | null | undefined

/**
 * The business itself. ProfessionalService is a LocalBusiness subtype, which
 * is what earns the address, phone and hours a place in local results.
 */
export function organizationSchema(settings: Settings): JsonLd {
  const get = (key: string) => String(settings?.[key] ?? '').trim()
  const name = get('business_name') || 'Byteflow Information Technology'
  const logo = get('logo_url')
  const phone = get('header_phone') || get('whatsapp_number')
  const email = get('primary_email')
  const address = get('physical_address')
  const hours = get('business_hours')
  const socials = linkList(
    get('facebook_url'),
    get('instagram_url'),
    get('linkedin_url'),
    get('tiktok_url'),
  )

  const schema: JsonLd = {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ORG_ID,
    name,
    url: SITE_URL,
    ...(logo ? { logo: absoluteUrl(logo), image: absoluteUrl(logo) } : {}),
    ...(phone ? { telephone: phone } : {}),
    ...(email ? { email } : {}),
    ...(socials.length ? { sameAs: socials } : {}),
    // The service area, which is what "near me" searches are matched against.
    areaServed: [
      { '@type': 'City', name: 'Dubai' },
      { '@type': 'Country', name: 'United Arab Emirates' },
    ],
  }

  if (address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressLocality: 'Dubai',
      addressCountry: 'AE',
    }
  }
  // Free text in the admin ("Monday–Saturday, 9:00 AM–6:00 PM") cannot be
  // turned into openingHoursSpecification reliably, so it is published as
  // the human-readable property schema.org provides for exactly that.
  if (hours) schema.openingHours = hours

  return schema
}

export function websiteSchema(name: string): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: name || 'Byteflow Information Technology',
    publisher: { '@id': ORG_ID },
  }
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
