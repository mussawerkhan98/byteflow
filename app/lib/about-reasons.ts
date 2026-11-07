/**
 * The reasons in the home About section (home_about "highlights"), ready to
 * show: hidden ones left out, numbered in their saved order, and each link
 * labelled with the name of the service it leads to, as the menu names it.
 *
 * No database access or React here, so the rules can be tested directly.
 */
import { pictureOf, type HomeBlock } from './home-content'

/** The pictures a preview card can show; the admin's "Icon" choice picks one. */
export const PREVIEW_KINDS = ['layers', 'receipt', 'clock', 'cloud', 'shield', 'chat'] as const
export type PreviewKind = (typeof PREVIEW_KINDS)[number]

export type AboutReason = {
  number: string
  title: string
  description: string
  kind: PreviewKind
  /** An uploaded picture, in place of the preview card's illustration. */
  image: { src: string; alt: string } | null
  link: { href: string; label: string }
}

export const MAX_REASONS = 4
const DEFAULT_KINDS: PreviewKind[] = ['layers', 'receipt', 'clock', 'cloud']

/** "Explore Cyber Security" for a service page; plain wording for anything else. */
export function linkLabel(href: string, services: { slug: string; title: string }[]): string {
  const path = href.split(/[?#]/)[0]
  if (path === '/' && href.includes('#services')) return 'Explore all services'
  const service = services.find((s) => `/${s.slug}` === path)
  return service ? `Explore ${service.title}` : 'Find out more'
}

export function aboutReasons(block: HomeBlock, services: { slug: string; title: string }[]): AboutReason[] {
  return (block.lists.highlights ?? [])
    .filter((item) => item.show !== 'no' && item.title)
    .slice(0, MAX_REASONS)
    .map((item, index) => {
      const href = item.link || '/contact-us'
      return {
        number: String(index + 1).padStart(2, '0'),
        title: item.title,
        description: item.description,
        kind: (PREVIEW_KINDS as readonly string[]).includes(item.icon) ? (item.icon as PreviewKind) : DEFAULT_KINDS[index % DEFAULT_KINDS.length],
        image: pictureOf(item),
        link: { href, label: linkLabel(href, services) },
      }
    })
}
