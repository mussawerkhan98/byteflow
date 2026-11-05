/**
 * What the header bar shows, built from the two places the admin edits it:
 *
 * - "Header & footer links" sets the top-level entries, their wording and
 *   their order.
 * - Home page sections → "Header menu" holds the Services mega menu (groups,
 *   descriptions, featured card) and the Industries list.
 *
 * An entry called "Services" opens the mega menu; one called "Industries"
 * opens the industries list, which is added after Services when the menu has
 * no such entry, and left out while no industry has a page. Any other entry
 * with sub-links opens a plain list of them.
 *
 * No database access or React here, so the rules can be tested directly.
 */
import type { HomeBlock } from './home-content'

export type NavItem = {
  label: string
  href: string
  new_tab?: boolean
  children?: NavItem[]
}

export type NavEntry =
  | { kind: 'link'; key: string; item: NavItem }
  | { kind: 'services'; key: string; label: string }
  | { kind: 'list'; key: string; label: string; heading: string; items: NavItem[] }

const SERVICES = /^(our\s+)?services$/i
const INDUSTRIES = /^industries$/i

/** True when `href` is the page being viewed, or a section containing it. */
export function isCurrent(pathname: string, href: string) {
  if (!href.startsWith('/') || href.startsWith('//')) return false
  const path = href.split(/[?#]/)[0] || '/'
  if (path === '/') return pathname === '/' && !href.includes('#')
  return pathname === path || pathname.startsWith(`${path}/`)
}

// "#" is how the CMS marks a menu entry that only groups others.
const leaves = (items: NavItem[]): NavItem[] =>
  items.flatMap((item) => (item.children?.length ? leaves(item.children) : item.href && item.href !== '#' ? [item] : []))

/** The mega menu's services, in the order saved, under their group headings. */
export function serviceGroups(menu: HomeBlock) {
  const groups: { title: string; items: Record<string, string>[] }[] = []
  for (const item of menu.lists.services ?? []) {
    const title = item.group || 'Services'
    let group = groups.find((g) => g.title.toLowerCase() === title.toLowerCase())
    if (!group) groups.push((group = { title, items: [] }))
    group.items.push(item)
  }
  return groups
}

/**
 * An industry is listed only once it has a page of its own. A blank link, or
 * an anchor on the home page, leads nowhere: there is no industries section
 * to land on. With none left, the Industries menu is not shown at all.
 */
export const hasIndustryPage = (link: string | undefined) => {
  const href = (link ?? '').trim()
  return href !== '' && !/^\/?#/.test(href)
}

export function buildNav(navigation: NavItem[], menu: HomeBlock, ctaLink: string): NavEntry[] {
  const industries = (menu.lists.industries ?? [])
    .filter((item) => item.title && hasIndustryPage(item.link))
    .map((item) => ({ label: item.title, href: item.link.trim() }))
  const industriesEntry = (label: string): NavEntry => ({
    kind: 'list',
    key: 'industries',
    label,
    heading: menu.fields.industries_heading,
    items: industries,
  })

  const entries: NavEntry[] = []
  for (const item of navigation) {
    const label = item.label.trim()
    // The logo already goes home, and the button beside the menu to ctaLink.
    if (!item.children?.length && (item.href === '/' || item.href === ctaLink)) continue
    if (SERVICES.test(label)) entries.push({ kind: 'services', key: 'services', label })
    else if (INDUSTRIES.test(label)) {
      if (industries.length) entries.push(industriesEntry(label))
    }
    else if (item.children?.length)
      entries.push({ kind: 'list', key: `${label}-${item.href}`, label, heading: '', items: leaves(item.children) })
    else entries.push({ kind: 'link', key: `${label}-${item.href}`, item })
  }

  if (industries.length && !entries.some((entry) => entry.key === 'industries')) {
    const after = entries.findIndex((entry) => entry.kind === 'services')
    entries.splice(after + 1, 0, industriesEntry(menu.fields.industries_label))
  }
  return entries
}
