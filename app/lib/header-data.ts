import 'server-only'
import { unstable_cache } from 'next/cache'
import { db } from './db'
import { getMenu, getSection, getServiceNames } from './cms'
import { headerBarFrom } from './header-bar'
import type { NavItem } from './header-menu'
import {
  fallbackHeader,
  fallbackNavigation,
  MAX_LATEST_POSTS,
  modelFromLegacy,
  modelFromTables,
  withServiceNames,
  type HeaderModel,
  type PostCard,
} from './header-model'
import { mergeHomeBlock } from './home-content'
import { postDisplay } from './post-display'

/** The tag the admin clears (through /api/revalidate) when it saves the header. */
export const HEADER_CACHE_TAG = 'header-menu'

/** New posts reach the Insights menu within this many seconds without a save. */
const REFRESH_SECONDS = 900

const missingTable = (error: unknown) => /no such table/i.test(String(error))

async function readPosts(): Promise<{ categories: string[]; posts: PostCard[] }> {
  const [categories, latest] = await Promise.all([
    db.execute('SELECT category FROM posts WHERE published = 1'),
    db.execute({
      sql: `SELECT slug, title, category, date, read_time, content, created_at, image_url, image_alt
            FROM posts WHERE published = 1 ORDER BY created_at DESC LIMIT ?`,
      args: [MAX_LATEST_POSTS],
    }),
  ])
  return {
    categories: categories.rows.map((row) => String(row.category ?? '')),
    posts: latest.rows.map((row) => {
      const shown = postDisplay({
        date: row.date as string | null,
        read_time: row.read_time as string | null,
        excerpt: '',
        content: row.content as string | null,
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
    }),
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
  const [{ categories, posts }, tables, settingsRow, names] = await Promise.all([
    readPosts(),
    readTables(),
    db.execute('SELECT * FROM site_settings LIMIT 1'),
    getServiceNames(),
  ])
  const bar = headerBarFrom(settingsRow.rows[0] as Record<string, unknown> | undefined)
  const fromTables = tables && modelFromTables({ ...tables, bar, categories, posts })
  if (fromTables) return withServiceNames(fromTables, names)

  const [navigation, saved] = await Promise.all([legacyNavigation(), getSection('home', 'header_menu')])
  return withServiceNames(
    modelFromLegacy({
      navigation,
      menu: mergeHomeBlock('header_menu', saved as Record<string, unknown> | null),
      bar,
      categories,
      posts,
    }),
    names,
  )
}

const cachedHeader = unstable_cache(buildHeader, ['header-model'], {
  tags: [HEADER_CACHE_TAG],
  revalidate: REFRESH_SECONDS,
})

/** What the header shows. Never throws: with no database it is the built-in menu. */
export async function getHeaderModel(): Promise<HeaderModel> {
  try {
    return await cachedHeader()
  } catch (error) {
    console.error('Header menu error:', error instanceof Error ? error.message : error)
    return fallbackHeader()
  }
}
