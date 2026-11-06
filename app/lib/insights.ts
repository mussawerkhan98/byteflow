/**
 * What the home Insights section (home_insights) shows: one featured post,
 * the next newest posts as a list, and the topic links.
 *
 * No database access or React here, so the rules can be tested directly.
 */
import type { HomeBlock } from './home-content'
import { sameCategory } from './blog-categories'

type PostLike = { slug: string; category: string }

export const MIN_LIST = 1
export const MAX_LIST = 5
const DEFAULT_LIST = 3

export type InsightTopic = { label: string; category: string; href: string }

/** The blog, opened on one category's filter. */
export const categoryHref = (category: string) => `/blog?category=${encodeURIComponent(category.trim())}`

/**
 * Posts arrive newest first. The featured one is the post the admin picked,
 * or the newest when it picked "latest" (or a post since unpublished); the
 * list is the newest of the rest.
 */
export function insightPicks<P extends PostLike>(block: HomeBlock, posts: P[]) {
  const choice = block.fields.featured?.trim()
  const featured = (choice && choice !== 'latest' && posts.find((post) => post.slug === choice)) || posts[0] || null
  const wanted = Number.parseInt(block.fields.list_count ?? '', 10)
  const count = Number.isFinite(wanted) ? Math.min(MAX_LIST, Math.max(MIN_LIST, wanted)) : DEFAULT_LIST
  const list = posts.filter((post) => post !== featured).slice(0, count)

  const topics: InsightTopic[] = (block.lists.topics ?? [])
    .filter((topic) => topic.show !== 'no' && topic.title)
    .map((topic) => ({ label: topic.title, category: topic.category || topic.title }))
    .filter((topic) => posts.some((post) => sameCategory(post.category, topic.category)))
    .map((topic) => ({ label: topic.label, category: topic.category, href: categoryHref(topic.category) }))

  return { featured, list, topics }
}
