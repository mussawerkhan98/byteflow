/**
 * The blog's category filter, built from the categories the posts actually
 * use. Categories are typed freely in the admin, so a new one ("Web
 * Development") gets its own button without a code change, and spelling
 * differences in case or spacing count as the same category.
 */

/** The order the long-standing categories appear in; new ones follow, A–Z. */
const PREFERRED = ['IT Support', 'Web & Apps', 'Cloud', 'Cyber Security', 'System Integration', 'Digital Marketing']

export const categoryKey = (category: unknown) =>
  String(category ?? '').trim().replace(/\s+/g, ' ').toLowerCase()

export const sameCategory = (a: unknown, b: unknown) => categoryKey(a) === categoryKey(b)

/** One button per category that has at least one post, labelled as first written. */
export function blogCategories(posts: { category?: unknown }[]): string[] {
  const labels = new Map<string, string>()
  for (const post of posts) {
    const key = categoryKey(post.category)
    if (key && !labels.has(key)) labels.set(key, String(post.category).trim().replace(/\s+/g, ' '))
  }
  const rank = (label: string) => {
    const index = PREFERRED.findIndex((name) => sameCategory(name, label))
    return index === -1 ? PREFERRED.length : index
  }
  return [...labels.values()].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
}
