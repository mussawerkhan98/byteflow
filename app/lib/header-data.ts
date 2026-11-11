import 'server-only'
import { unstable_cache } from 'next/cache'
import { categoryKey } from './blog-categories'
import { db, getServices, SITE_CONTENT_TAG } from './db'
import { getMenu, getSection, getServiceNames } from './cms'
import { headerBarFrom } from './header-bar'
import type { NavItem } from './header-menu'
import {
  fallbackHeader,
  fallbackNavigation,
  industryPagesFrom,
  MAX_LATEST_POSTS,
  modelFromLegacy,
  modelFromTables,
  servicePreview,
  withServiceNames,
  withServicePreviews,
  withServicesOffMenu,
  type HeaderModel,
  type IndustryPage,
  type PostCard,
  type ServicePreview,
} from './header-model'
import { getHomeBlock } from './home-blocks'
import { mergeHomeBlock } from './home-content'
import { postDisplay } from './post-display'
import { services as servicePages } from './services-data'
import { groupAnchors } from './services-page'

/** The tag the admin clears (through /api/revalidate) when it saves the header. */
export const HEADER_CACHE_TAG = 'header-menu'

/** New posts reach the Insights menu within this many seconds without a save. */
const REFRESH_SECONDS = 900

const missingTable = (error: unknown) => /no such table/i.test(String(error))

function postCard(row: Record<string, unknown>): PostCard {
  const shown = postDisplay({
    date: row.date as string | null,
    read_time: row.read_time as string | null,
    excerpt: '',
    content: (row.content as string | null | undefined) ?? null,
    created_at: row.created_at as string | null,
  })
  const title = String(row.title ?? '')
  return {
    title,
    href: `/${String(row.slug)}`,
    category: String(row.category ?? '').trim(),
    date: shown.date,
    readTime: shown.read_time,
    image: row.image_url ? String(row.image_url) : null,
    alt: String(row.image_alt ?? '').trim() || title,
  }
}

async function readPosts(): Promise<{ categories: string[]; posts: PostCard[]; topicPosts: PostCard[] }> {
  const [all, latest] = await Promise.all([
    // Every published post without its text: the topics' counts and newest posts.
    db.execute(`SELECT slug, title, category, date, read_time, created_at, image_url, image_alt
                FROM posts WHERE published = 1 ORDER BY created_at DESC`),
    db.execute({
      sql: `SELECT slug, title, category, date, read_time, content, created_at, image_url, image_alt
            FROM posts WHERE published = 1 ORDER BY created_at DESC LIMIT ?`,
      args: [MAX_LATEST_POSTS],
    }),
  ])
  // The newest post in each category, which is all the topics' previews need.
  const seen = new Set<string>()
  const topicPosts = all.rows.map(postCard).filter((post) => {
    const key = categoryKey(post.category)
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
  return {
    categories: all.rows.map((row) => String(row.category ?? '')),
    posts: latest.rows.map(postCard),
    topicPosts,
  }
}

/**
 * Each service's preview for the Services menu: every service page's own
 * wording, then the admin's Services records over it.
 */
async function servicePreviews(): Promise<Map<string, ServicePreview>> {
  const previews = new Map(servicePages.map((page) => [page.slug, servicePreview(page, page)]))
  for (const service of await getServices())
    previews.set(service.slug, servicePreview(service, servicePages.find((page) => page.slug === service.slug)))
  return previews
}

/** The Industries page's cards (app/industries), at the same addresses the page gives them. */
async function industryPages(): Promise<IndustryPage[]> {
  const items = (await getHomeBlock('industries_list')).lists.industries
  return industryPagesFrom(
    items,
    groupAnchors(
      items.map((item) => item.title),
      'industry',
    ),
  )
}

/**
 * The services switched off "Show in the menu bar" (Services in the admin),
 * by slug. None before the admin has added that switch to the table.
 */
async function servicesOffMenu(): Promise<Set<string>> {
  try {
    const result = await db.execute('SELECT slug FROM services WHERE show_in_menu = 0')
    return new Set(result.rows.map((row) => String(row.slug)))
  } catch (error) {
    if (/no such column/i.test(String(error))) return new Set()
    throw error
  }
}

/** The Header Menu tables, or null before their migration has run. */
async function readTables() {
  try {
    const [nav, groups, items, settings] = await Promise.all([
      db.execute('SELECT label, href, kind, visible, new_tab FROM header_nav_items ORDER BY sort_order, id'),
      db.execute('SELECT id, menu, title, visible FROM header_mega_groups ORDER BY sort_order, id'),
      db.execute('SELECT group_id, label, href, description, visible FROM header_mega_items ORDER BY sort_order, id'),
      db.execute('SELECT key, value FROM header_menu_settings'),
    ])
    return {
      nav: nav.rows.map((row) => ({
        label: String(row.label ?? ''),
        href: String(row.href ?? ''),
        kind: String(row.kind ?? 'link'),
        visible: Boolean(row.visible),
        new_tab: Boolean(row.new_tab),
      })),
      groups: groups.rows.map((row) => ({
        id: Number(row.id),
        menu: String(row.menu ?? ''),
        title: String(row.title ?? ''),
        visible: Boolean(row.visible),
      })),
      items: items.rows.map((row) => ({
        group_id: Number(row.group_id),
        label: String(row.label ?? ''),
        href: String(row.href ?? ''),
        description: String(row.description ?? ''),
        visible: Boolean(row.visible),
      })),
      settings: Object.fromEntries(settings.rows.map((row) => [String(row.key), String(row.value ?? '')])),
    }
  } catch (error) {
    if (missingTable(error)) return null
    throw error
  }
}

/** "Header & footer links", as the nested list the older header used. */
async function legacyNavigation(): Promise<NavItem[]> {
  const records = await getMenu('header')
  const tree = (parent: number | null): NavItem[] =>
    records
      .filter((item) => item.parent_id === parent)
      .map((item) => ({ label: item.label, href: item.href, new_tab: item.new_tab, children: tree(item.id) }))
  return records.length ? tree(null) : fallbackNavigation
}

async function buildHeader(): Promise<HeaderModel> {
  // A database that cannot be reached throws here, so nothing is cached and
  // getHeaderModel falls back for this request only.
  const [{ categories, posts, topicPosts }, tables, settingsRow, names, previews, industries, offMenu] = await Promise.all([
    readPosts(),
    readTables(),
    db.execute('SELECT * FROM site_settings LIMIT 1'),
    getServiceNames(),
    servicePreviews(),
    industryPages(),
    servicesOffMenu(),
  ])
  const bar = headerBarFrom(settingsRow.rows[0] as Record<string, unknown> | undefined)
  const finish = (model: HeaderModel) => withServicesOffMenu(withServicePreviews(withServiceNames(model, names), previews), offMenu)
  const fromTables = tables && modelFromTables({ ...tables, bar, categories, posts, topicPosts, industryPages: industries })
  if (fromTables) return finish(fromTables)

  const [navigation, saved] = await Promise.all([legacyNavigation(), getSection('home', 'header_menu')])
  return finish(
    modelFromLegacy({
      navigation,
      menu: mergeHomeBlock('header_menu', saved as Record<string, unknown> | null),
      bar,
      categories,
      posts,
      topicPosts,
      industryPages: industries,
    }),
  )
}

// The key names the model's shape: the cache outlives a deploy, so a change
// to HeaderModel takes a new key rather than being served the old shape.
// It also uses services, posts and the Industries page, so saving any of
// them in the admin (which clears the site-content tag) refreshes it too.
const cachedHeader = unstable_cache(buildHeader, ['header-model-v3'], {
  tags: [HEADER_CACHE_TAG, SITE_CONTENT_TAG],
  revalidate: REFRESH_SECONDS,
})

/** What the header shows. Never throws: with no database it is the built-in menu. */
export async function getHeaderModel(): Promise<HeaderModel> {
  try {
    return await cachedHeader()
  } catch (error) {
    console.error('Header menu error:', error instanceof Error ? error.message : error)
    return withServicePreviews(
      fallbackHeader(),
      new Map(servicePages.map((page) => [page.slug, servicePreview(page, page)])),
    )
  }
}
