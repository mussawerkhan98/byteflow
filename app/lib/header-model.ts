/**
 * Everything the header shows, in one plain object the server builds and the
 * (client) Header renders.
 *
 * It comes from one of three places, best first:
 *
 * 1. The admin's Header Menu screen: the header_nav_items,
 *    header_mega_groups, header_mega_items and header_menu_settings tables.
 * 2. Before those tables exist or while they are empty, the older sources:
 *    "Header & footer links" for the entries and the header_menu home block
 *    for the Services menu (see header-menu.ts).
 * 3. If the database cannot be read at all, the wording below.
 *
 * Every source ends up in the same shape, so the header renders the same way
 * whichever one it got. No database access or React here, so the rules can
 * be tested directly; header-data.ts does the reading.
 */
import { blogCategories, categoryKey } from './blog-categories'
import { defaultHeaderBar, safeLink, type HeaderBar } from './header-bar'
import { buildNav, hasIndustryPage, serviceGroups, type NavItem } from './header-menu'
import { homeDefaults, mergeHomeBlock, type HomeBlock } from './home-content'

export type MenuLink = { label: string; href: string; newTab?: boolean }

export type MenuGroup = {
  title: string
  items: { label: string; href: string; description?: string; newTab?: boolean }[]
}

export type PostCard = {
  title: string
  href: string
  category: string
  date: string
  readTime: string
  image: string | null
  alt: string
}

export type HeaderEntry =
  | { kind: 'link'; key: string; item: NavItem }
  | { kind: 'services'; key: string; label: string }
  | { kind: 'industries'; key: string; label: string }
  | { kind: 'insights'; key: string; label: string; href: string }
  | { kind: 'list'; key: string; label: string; items: NavItem[] }

export type HeaderModel = {
  nav: HeaderEntry[]
  cta: { label: string; shortLabel: string; href: string }
  showPhone: boolean
  showThemeToggle: boolean
  services: {
    intro: { eyebrow: string; heading: string; text: string; link: MenuLink }
    groups: MenuGroup[]
    featured: {
      eyebrow: string
      title: string
      text: string
      stats: { value: string; label: string }[]
      button: MenuLink
    } | null
    footer: { text: string; link: MenuLink | null; whatsappLabel: string | null }
  }
  industries: { heading: string; viewAll: MenuLink | null; groups: MenuGroup[] }
  insights: {
    eyebrow: string
    heading: string
    text: string
    viewAll: MenuLink
    topics: { label: string; count: number; href: string }[]
    posts: PostCard[]
    footer: { text: string; link: MenuLink }
  }
}

// ── Defaults ────────────────────────────────────────────────────────────────

const legacy = homeDefaults.header_menu

/**
 * The header_menu_settings keys and what each falls back to when blank. The
 * admin (byteflow-admin, app/lib/header-menu-admin.ts) holds the same list
 * for its form and its seed; keep the two in step.
 */
export const headerSettingDefaults = {
  'header.theme_toggle': '1',

  'services.intro_eyebrow': legacy.fields.eyebrow,
  'services.intro_heading': legacy.fields.heading,
  'services.intro_text': legacy.fields.description,
  'services.intro_link_label': legacy.fields.link_label,
  'services.intro_link': legacy.fields.link,
  'services.featured_show': '1',
  'services.featured_eyebrow': legacy.fields.featured_eyebrow,
  'services.featured_title': legacy.fields.featured_title,
  'services.featured_text': '',
  'services.featured_stat1_value': legacy.lists.stats[0].title,
  'services.featured_stat1_label': legacy.lists.stats[0].description,
  'services.featured_stat2_value': legacy.lists.stats[1].title,
  'services.featured_stat2_label': legacy.lists.stats[1].description,
  'services.featured_button_label': legacy.fields.featured_label,
  'services.featured_button_link': legacy.fields.featured_link,
  'services.footer_text': defaultHeaderBar.dropdownNote,
  'services.footer_link_label': defaultHeaderBar.dropdownCta,
  'services.footer_link': defaultHeaderBar.ctaLink,
  'services.whatsapp_show': '1',
  'services.whatsapp_label': legacy.fields.whatsapp_label,

  'industries.heading': legacy.fields.industries_heading,
  'industries.view_all_label': '',
  'industries.view_all_link': '',

  'insights.eyebrow': 'Insights',
  'insights.heading': 'Practical IT advice for UAE businesses.',
  'insights.text': 'Straight answers on IT costs, security and support, from the engineers who do the work.',
  'insights.view_all_label': 'View all articles',
  'insights.view_all_link': '/blog',
  'insights.categories': 'auto',
  'insights.latest_count': '3',
  'insights.footer_text': 'New articles every week',
  'insights.footer_link_label': 'Read the blog',
  'insights.footer_link': '/blog',
} as const

export type HeaderSettingKey = keyof typeof headerSettingDefaults
export type HeaderSettings = Record<HeaderSettingKey, string>

/** Saved settings over the defaults; a blank or unknown value falls back. */
export function headerSettings(saved: Record<string, unknown> | null | undefined): HeaderSettings {
  return Object.fromEntries(
    Object.entries(headerSettingDefaults).map(([key, fallback]) => {
      const value = saved?.[key]
      return [key, typeof value === 'string' && value.trim() ? value.trim() : fallback]
    }),
  ) as HeaderSettings
}

const on = (value: string) => value === '1' || value.toLowerCase() === 'true'

/** How many latest posts the Insights menu may show, whatever is saved. */
export const MAX_LATEST_POSTS = 6
/** Topics listed when the admin leaves the choice on "auto". */
export const AUTO_TOPICS = 6

// ── Insights ────────────────────────────────────────────────────────────────

/**
 * The Topics column: categories that have published posts, with their count.
 * "auto" lists the busiest few; otherwise only the named categories, in the
 * order given, and only those that have posts. There are no category pages
 * yet, so each one opens the blog.
 */
export function insightTopics(categories: string[], choice: string, href = '/blog') {
  const counts = new Map<string, number>()
  for (const category of categories) {
    const key = categoryKey(category)
    if (key) counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  const labels = blogCategories(categories.map((category) => ({ category })))
  const withCounts = labels.map((label) => ({ label, count: counts.get(categoryKey(label)) ?? 0, href }))

  const wanted = choice
    .split(/[\n,]/)
    .map((name) => name.trim())
    .filter(Boolean)
  if (!wanted.length || (wanted.length === 1 && wanted[0].toLowerCase() === 'auto'))
    return [...withCounts].sort((a, b) => b.count - a.count).slice(0, AUTO_TOPICS)
  return wanted
    .map((name) => withCounts.find((topic) => categoryKey(topic.label) === categoryKey(name)))
    .filter((topic): topic is (typeof withCounts)[number] => Boolean(topic))
}

function insightsFrom(s: HeaderSettings, categories: string[], posts: PostCard[]): HeaderModel['insights'] {
  const viewAllHref = safeLink(s['insights.view_all_link'], '/blog')
  return {
    eyebrow: s['insights.eyebrow'],
    heading: s['insights.heading'],
    text: s['insights.text'],
    viewAll: { label: s['insights.view_all_label'], href: viewAllHref },
    topics: insightTopics(categories, s['insights.categories'], viewAllHref),
    posts: posts.slice(0, latestCount(s)),
    footer: {
      text: s['insights.footer_text'],
      link: { label: s['insights.footer_link_label'], href: safeLink(s['insights.footer_link'], '/blog') },
    },
  }
}

export const latestCount = (s: HeaderSettings) => {
  const n = Number.parseInt(s['insights.latest_count'], 10)
  return Number.isFinite(n) ? Math.min(Math.max(n, 0), MAX_LATEST_POSTS) : 3
}

// ── From the Header Menu tables ─────────────────────────────────────────────

export type NavRow = { label: string; href: string; kind: string; visible: boolean; new_tab: boolean }
export type GroupRow = { id: number; menu: string; title: string; visible: boolean }
export type ItemRow = { group_id: number; label: string; href: string; description: string; visible: boolean }

const KINDS = new Set(['link', 'services', 'industries', 'insights'])

function groupsFor(menu: string, groups: GroupRow[], items: ItemRow[], keep: (href: string) => boolean): MenuGroup[] {
  return groups
    .filter((group) => group.menu === menu && group.visible)
    .map((group) => ({
      title: group.title,
      items: items
        .filter((item) => item.group_id === group.id && item.visible && item.label.trim() && keep(item.href))
        .map((item) => ({
          label: item.label.trim(),
          href: item.href.trim(),
          ...(item.description.trim() ? { description: item.description.trim() } : {}),
        })),
    }))
    .filter((group) => group.items.length)
}

/** Rows are already in their saved order. Null when there is nothing saved yet. */
export function modelFromTables(input: {
  nav: NavRow[]
  groups: GroupRow[]
  items: ItemRow[]
  settings: Record<string, string>
  bar: HeaderBar
  categories: string[]
  posts: PostCard[]
}): HeaderModel | null {
  if (!input.nav.length) return null
  const s = headerSettings(input.settings)
  const isLink = (href: string) => href.trim() !== '' && !/^\/?#/.test(href.trim())
  const services = groupsFor('services', input.groups, input.items, isLink)
  const industries = groupsFor('industries', input.groups, input.items, hasIndustryPage)

  const nav: HeaderEntry[] = []
  input.nav.forEach((row, index) => {
    if (!row.visible || !row.label.trim()) return
    const kind = KINDS.has(row.kind) ? row.kind : 'link'
    const label = row.label.trim()
    const key = `${kind}-${index}`
    if (kind === 'services') {
      if (services.length) nav.push({ kind, key: 'services', label })
    } else if (kind === 'industries') {
      if (industries.length) nav.push({ kind, key: 'industries', label })
    } else if (kind === 'insights') {
      nav.push({ kind, key: 'insights', label, href: safeLink(row.href, '/blog') })
    } else if (isLink(row.href)) {
      nav.push({ kind: 'link', key, item: { label, href: row.href.trim(), new_tab: row.new_tab } })
    }
  })

  const stats = ([1, 2] as const)
    .map((n) => ({
      value: s[`services.featured_stat${n}_value`],
      label: s[`services.featured_stat${n}_label`],
    }))
    .filter((stat) => stat.value)

  return {
    nav,
    cta: { label: input.bar.ctaLabel, shortLabel: input.bar.ctaShortLabel, href: input.bar.ctaLink },
    showPhone: input.bar.showPhone,
    showThemeToggle: on(s['header.theme_toggle']),
    services: {
      intro: {
        eyebrow: s['services.intro_eyebrow'],
        heading: s['services.intro_heading'],
        text: s['services.intro_text'],
        link: { label: s['services.intro_link_label'], href: safeLink(s['services.intro_link'], '/#services') },
      },
      groups: services,
      featured: on(s['services.featured_show'])
        ? {
            eyebrow: s['services.featured_eyebrow'],
            title: s['services.featured_title'],
            text: s['services.featured_text'],
            stats,
            button: {
              label: s['services.featured_button_label'],
              href: safeLink(s['services.featured_button_link'], '/it-amc-services-dubai'),
            },
          }
        : null,
      footer: {
        text: s['services.footer_text'],
        link: s['services.footer_link_label']
          ? { label: s['services.footer_link_label'], href: safeLink(s['services.footer_link'], input.bar.ctaLink) }
          : null,
        whatsappLabel: on(s['services.whatsapp_show']) ? s['services.whatsapp_label'] : null,
      },
    },
    industries: {
      heading: s['industries.heading'],
      viewAll:
        s['industries.view_all_label'] && isLink(s['industries.view_all_link'])
          ? { label: s['industries.view_all_label'], href: s['industries.view_all_link'] }
          : null,
      groups: industries,
    },
    insights: insightsFrom(s, input.categories, input.posts),
  }
}

// ── From the older sources ──────────────────────────────────────────────────

const BLOG = /^\/blog\/?$/

/**
 * The header as it was before the Header Menu screen: links from "Header &
 * footer links", the Services menu from the header_menu home block, the button
 * from the header bar settings. A link to /blog opens the Insights menu.
 */
export function modelFromLegacy(input: {
  navigation: NavItem[]
  menu: HomeBlock
  bar: HeaderBar
  categories: string[]
  posts: PostCard[]
}): HeaderModel {
  const { menu, bar } = input
  const f = menu.fields
  const s = headerSettings(null)
  const nav: HeaderEntry[] = buildNav(input.navigation, menu, bar.ctaLink).map((entry) => {
    if (entry.kind === 'list' && entry.key === 'industries')
      return { kind: 'industries', key: 'industries', label: entry.label }
    if (entry.kind === 'list') return { kind: 'list', key: entry.key, label: entry.label, items: entry.items }
    if (entry.kind === 'link' && BLOG.test(entry.item.href))
      return { kind: 'insights', key: 'insights', label: entry.item.label, href: entry.item.href }
    return entry
  })

  return {
    nav,
    cta: { label: bar.ctaLabel, shortLabel: bar.ctaShortLabel, href: bar.ctaLink },
    showPhone: bar.showPhone,
    showThemeToggle: true,
    services: {
      intro: {
        eyebrow: f.eyebrow,
        heading: f.heading,
        text: f.description,
        link: { label: f.link_label, href: safeLink(f.link, '/#services') },
      },
      groups: serviceGroups(menu).map((group) => ({
        title: group.title,
        items: group.items.map((item) => ({
          label: item.title,
          href: safeLink(item.link, '/#services'),
          ...(item.description ? { description: item.description } : {}),
        })),
      })),
      featured: {
        eyebrow: f.featured_eyebrow,
        title: f.featured_title,
        text: '',
        stats: (menu.lists.stats ?? []).slice(0, 2).map((stat) => ({ value: stat.title, label: stat.description })),
        button: { label: f.featured_label, href: safeLink(f.featured_link, '/it-amc-services-dubai') },
      },
      footer: {
        text: bar.dropdownNote,
        link: { label: bar.dropdownCta, href: bar.ctaLink },
        whatsappLabel: f.whatsapp_label,
      },
    },
    industries: {
      heading: f.industries_heading,
      viewAll: null,
      groups: [
        {
          title: '',
          items: (menu.lists.industries ?? [])
            .filter((item) => item.title && hasIndustryPage(item.link))
            .map((item) => ({ label: item.title, href: item.link.trim() })),
        },
      ].filter((group) => group.items.length),
    },
    insights: insightsFrom(s, input.categories, input.posts),
  }
}

/** The header with no database at all. */
export const fallbackNavigation: NavItem[] = [
  { label: 'Services', href: '#' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about-us' },
  { label: 'Insights', href: '/blog' },
]

export const fallbackHeader = (): HeaderModel =>
  modelFromLegacy({
    navigation: fallbackNavigation,
    menu: mergeHomeBlock('header_menu', null),
    bar: defaultHeaderBar,
    categories: [],
    posts: [],
  })

// ── Service names ───────────────────────────────────────────────────────────

/** The page slug a link points at ("/cyber-security" → "cyber-security"), or null. */
export function pageSlug(href: string) {
  return /^\/([a-z0-9-]+)\/?$/.exec(href.trim().split(/[?#]/)[0])?.[1] ?? null
}

/**
 * The menu's links to service pages, named the way the rest of the site
 * names them (the admin's Services list), whatever the menu row says, so the
 * mega menu, the home page tabs and the pages never disagree.
 */
export function withServiceNames(model: HeaderModel, names: Map<string, string>): HeaderModel {
  const named = (item: { label: string; href: string }) => names.get(pageSlug(item.href) ?? '') ?? item.label
  return {
    ...model,
    services: {
      ...model.services,
      groups: model.services.groups.map((group) => ({
        ...group,
        items: group.items.map((item) => ({ ...item, label: named(item) })),
      })),
    },
  }
}
