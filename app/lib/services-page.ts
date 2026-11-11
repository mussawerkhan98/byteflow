/**
 * The Services and Industries pages' small rules (app/services,
 * app/industries), apart from the pages so they can be tested directly. No
 * database access or React here.
 */

type Item = Record<string, string>

const plain = (value: string) => value.trim().replace(/\s+/g, ' ').toLowerCase()

/** A group's introduction ("Services page sections" → Group intros), by the group's name. */
export function introFor(intros: Item[], title: string): Item | undefined {
  return title ? intros.find((intro) => plain(intro.title ?? '') === plain(title)) : undefined
}

/**
 * The address of each group on the page ("#cloud-security"), from its name;
 * a group with no name, or one whose name repeats, takes its place
 * ("#services-group-3", or after another `fallback`) instead.
 */
export function groupAnchors(titles: string[], fallback = 'services-group'): string[] {
  const used = new Set<string>()
  return titles.map((title, index) => {
    const slug = plain(title)
      .replace(/&/g, ' ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    const anchor = slug && !used.has(slug) ? slug : `${fallback}-${index + 1}`
    used.add(anchor)
    return anchor
  })
}

/** Text that quotes {services}, the number of services on the page. */
export const withServiceCount = (text: string, count: number) => text.replaceAll('{services}', String(count))

/** A "Sections on this page" switch: shown unless set to "no". */
export const shown = (value: string | undefined) => value !== 'no'

/** The service a link opens ("/it-amc-services-dubai" → "it-amc-services-dubai"), or ''. */
export const serviceSlugOf = (href: string) => href.match(/^\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?(?:[?#].*)?$/)?.[1] ?? ''

type Situation = { title: string; description: string; services: Service[] }
type Service = { slug: string; href: string; title: string; subtitle: string }

/** The services an item names (service1–3) that are published, in that order and once each. */
export function namedServices<S extends Service>(item: Item, services: S[]): S[] {
  const bySlug = new Map(services.map((service) => [service.slug, service]))
  return [...new Set([item.service1, item.service2, item.service3])]
    .map((slug) => (slug ? bySlug.get(slug) : undefined))
    .filter((service): service is S => Boolean(service))
}

/**
 * The finder's situations ("Services page sections" → Service finder), each
 * with the services it names. A situation none of whose services is
 * published is left out, as it would point nowhere.
 */
export function finderSituations(items: Item[], services: Service[]): Situation[] {
  return items
    .map((item) => ({ title: item.title ?? '', description: item.description ?? '', services: namedServices(item, services) }))
    .filter((situation) => situation.title && situation.services.length)
}
