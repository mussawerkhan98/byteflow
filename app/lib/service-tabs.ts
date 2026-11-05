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
>

export function serviceTab(service: ServiceInput): ServiceTab {
  const page = pagesBySlug.get(service.slug)
  const stat = page?.heroStats[0]
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
    caption: service.image_caption || (stat ? `${stat.value} · ${stat.label}` : ''),
    button: {
      label: service.cta_label || 'Discuss this service',
      href: safeHref(service.cta_link, '/contact-us'),
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
