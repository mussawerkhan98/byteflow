/**
 * The home page's Services tabs: one tab per service, in the order and with
 * the visibility of the header's Services menu (Header Menu in the admin), so
 * there is one place to arrange services.
 *
 * Each tab's wording comes from the service's own admin record. A field left
 * blank falls back to that service's page (services-data.ts): its tagline,
 * its first features, its headline figure and its home page eyebrow.
 *
 * No database access or React here, so the rules can be tested directly.
 */
import type { DbService } from './db'
import { services as servicePages } from './services-data'

export type ServiceTab = {
  slug: string
  href: string
  title: string
  eyebrow: string
  subtitle: string
  text: string
  bullets: string[]
  image: string | null
  imageAlt: string
  caption: string
  button: { label: string; href: string }
  /** The homepage's featured card only: its heading, and the text of its link to the service's page. */
  home: { heading: string; link: string }
}

export const MAX_BULLETS = 5

const pagesBySlug = new Map(servicePages.map((page) => [page.slug, page]))

/** Only paths on this site or full web addresses; anything else is dropped. */
const safeHref = (value: string, fallback: string) =>
  /^(\/(?!\/)|https?:\/\/)/i.test(value.trim()) ? value.trim() : fallback

export const bulletLines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-•*\s]+/, '').trim())
    .filter(Boolean)
    .slice(0, MAX_BULLETS)

type ServiceInput = Pick<
  DbService,
  | 'slug'
  | 'title'
  | 'excerpt'
  | 'description'
  | 'image_url'
  | 'image_alt'
  | 'cta_label'
  | 'cta_link'
  | 'eyebrow'
  | 'tagline'
  | 'highlights'
  | 'image_caption'
> &
  Partial<Pick<DbService, 'home_heading' | 'home_link_label'>>

export function serviceTab(service: ServiceInput): ServiceTab {
  const page = pagesBySlug.get(service.slug)
  const bullets = bulletLines(service.highlights)
  return {
    slug: service.slug,
    href: `/${service.slug}`,
    title: service.title,
    eyebrow: service.eyebrow || page?.eyebrow || 'What we do',
    subtitle: service.tagline || page?.tagline || '',
    text: service.excerpt || page?.description || service.description,
    bullets: bullets.length ? bullets : (page?.features ?? []).slice(0, 4).map((feature) => feature.title),
    image: service.image_url || null,
    imageAlt: service.image_alt || `${service.title} by Byteflow in Dubai`,
    caption: service.image_caption || page?.caption || '',
    button: {
      label: service.cta_label || 'Discuss this service',
      href: safeHref(service.cta_link, '/contact-us'),
    },
    home: {
      heading: service.home_heading?.trim() || service.title,
      link: service.home_link_label?.trim() || `Explore ${service.title}`,
    },
  }
}

/**
 * Services in the header menu's order, leaving out any the menu hides. When
 * the menu lists none of them (a custom menu, or no menu at all), every
 * published service shows, in its own order.
 */
export function orderedTabs(services: ServiceInput[], menuHrefs: string[]): ServiceTab[] {
  const bySlug = new Map(services.map((service) => [service.slug, service]))
  const path = (href: string) => href.split(/[?#]/)[0].replace(/^\/|\/$/g, '')
  const fromMenu = [...new Set(menuHrefs.map(path))]
    .map((slug) => bySlug.get(slug))
    .filter((service): service is ServiceInput => Boolean(service))
  return (fromMenu.length ? fromMenu : services).map(serviceTab)
}

/**
 * Each service page's own wording (services-data.ts) as a service record, so
 * lists of services never go empty when the database has none published.
 */
export const pageServices: ServiceInput[] = servicePages.map((page) => ({
  slug: page.slug,
  title: page.title,
  excerpt: '',
  description: page.description,
  image_url: null,
  image_alt: '',
  cta_label: '',
  cta_link: '',
  eyebrow: '',
  tagline: '',
  highlights: '',
  image_caption: '',
}))

/**
 * Services under the header menu's groups, in the menu's order. A service
 * the menu doesn't list is not lost: it goes in a last group with no title.
 * Groups left with no services are dropped.
 */
export function groupedTabs(tabs: ServiceTab[], groups: { title: string; items: { href: string }[] }[]) {
  const path = (href: string) => href.split(/[?#]/)[0].replace(/^\/|\/$/g, '')
  const bySlug = new Map(tabs.map((tab) => [tab.slug, tab]))
  const placed = new Set<string>()
  const result = groups.map((group) => ({
    title: group.title,
    tabs: group.items.flatMap((item) => {
      const tab = bySlug.get(path(item.href))
      if (!tab || placed.has(tab.slug)) return []
      placed.add(tab.slug)
      return [tab]
    }),
  }))
  result.push({ title: '', tabs: tabs.filter((tab) => !placed.has(tab.slug)) })
  return result.filter((group) => group.tabs.length)
}
