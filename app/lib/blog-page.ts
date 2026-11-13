/**
 * The blog page (/blog): which article is featured, the figures in the
 * banner, the topic filter and the search, all worked out from the
 * published posts themselves, so every number is a count of real rows.
 *
 * No database access or React here, so the rules can be tested directly.
 */
import { blogCategories, categoryKey, sameCategory } from './blog-categories'

type PostLike = { slug: string; category: string; title: string; excerpt: string; date: string }

/** How many articles show before "Show more". */
export const PAGE_SIZE = 9

/** The article picked in the admin, or the newest when it picked "latest" (or a post since unpublished). Posts arrive newest first. */
export function featuredPost<P extends PostLike>(posts: P[], choice: string | undefined): { post: P | null; picked: boolean } {
  const wanted = choice?.trim()
  const picked = (wanted && wanted !== 'latest' && posts.find((post) => post.slug === wanted)) || null
  return { post: picked || posts[0] || null, picked: Boolean(picked) }
}

/** How many articles and topics are published, and the newest article's date. */
export function blogStats(posts: PostLike[]) {
  return { articles: posts.length, topics: blogCategories(posts).length, latest: posts[0]?.date.trim() ?? '' }
}

/** Each topic the posts use, in the blog's order, with how many articles it has. */
export function blogTopics(posts: PostLike[]): { category: string; count: number }[] {
  return blogCategories(posts).map((category) => ({ category, count: posts.filter((post) => sameCategory(post.category, category)).length }))
}

const words = (text: string) => categoryKey(text).split(/[^a-z0-9&+#.]+/).filter(Boolean)

/**
 * The articles in a topic ('' for all) that match a search: every word typed
 * must appear in the title, the excerpt or the topic, in any order and case.
 */
export function findPosts<P extends PostLike>(posts: P[], topic: string, query: string): P[] {
  const terms = words(query)
  return posts.filter((post) => {
    if (topic && !sameCategory(post.category, topic)) return false
    if (!terms.length) return true
    const haystack = categoryKey(`${post.title} ${post.excerpt} ${post.category}`)
    return terms.every((term) => haystack.includes(term))
  })
}
