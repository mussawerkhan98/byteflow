'use client'

import { useId, useState, useSyncExternalStore, type ReactNode } from 'react'
import { getCategoryStyle } from '../../blog/category-style'
import { sameCategory } from '../../lib/blog-categories'
import { PAGE_SIZE, findPosts } from '../../lib/blog-page'
import { BlogCard, type BlogCardPost } from './BlogCards'

export type BlogLabels = {
  all: string
  filter: string
  search: string
  placeholder: string
  empty: string
  clear: string
  more: string
  read: string
  author: string
  article: string
  articles: string
}

const subscribeToHistory = (onChange: () => void) => {
  window.addEventListener('popstate', onChange)
  return () => window.removeEventListener('popstate', onChange)
}
const categoryInAddress = () => new URLSearchParams(window.location.search).get('category')

/**
 * The blog's articles: the section heading with a search beside it, a
 * topic button per category (with how many articles it has), then the
 * articles as cards, nine at a
 * time. The featured article sits above (page.tsx), so it is left out here
 * until a topic or search narrows the list. Every article is in the page as first
 * served, the ones past the first nine only hidden, so search engines read
 * them all. /blog?category=Cloud (the home page's topic links) opens on that
 * topic, and a topic chosen here is kept in the address so it can be shared.
 */
export default function BlogBrowser({
  heading,
  posts,
  topics,
  featured,
  labels,
}: {
  /** The section's heading, with the search beside it on wide screens. */
  heading: ReactNode
  posts: BlogCardPost[]
  topics: { category: string; count: number }[]
  /** The featured article's slug. */
  featured: string | null
  labels: BlogLabels
}) {
  const id = useId()
  // Read in the browser only, so the page itself can stay static.
  const wanted = useSyncExternalStore(subscribeToHistory, categoryInAddress, () => null)
  const [chosen, setChosen] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [limits, setLimits] = useState<Record<string, number>>({})
  const topic = chosen ?? (wanted && topics.find((item) => sameCategory(item.category, wanted))?.category) ?? ''

  const choose = (category: string) => {
    setChosen(category)
    const url = new URL(window.location.href)
    if (category) url.searchParams.set('category', category)
    else url.searchParams.delete('category')
    window.history.replaceState(window.history.state, '', url)
  }

  const narrowed = Boolean(topic || query.trim())
  const found = findPosts(posts, topic, query).filter((post) => narrowed || post.slug !== featured)
  const key = `${topic}|${query.trim().toLowerCase()}`
  const limit = limits[key] ?? PAGE_SIZE
  const chips = [{ category: '', label: labels.all, count: posts.length }, ...topics.map((item) => ({ ...item, label: item.category }))]
  const count = narrowed ? found.length : posts.length

  return (
    <>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        {heading}
        <div className="relative w-full shrink-0 lg:w-80">
          <label htmlFor={`${id}-search`} className="sr-only">
            {labels.search}
          </label>
          <svg aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--hp-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            id={`${id}-search`}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={labels.placeholder}
            className="h-11 w-full rounded-full border border-[var(--hp-line)] bg-[var(--hp-card)] pl-11 pr-4 text-[15px] text-[var(--hp-ink)] shadow-[var(--hp-shadow-sm)] outline-none transition-colors placeholder:text-[var(--hp-muted)] focus:border-[var(--hp-accent)]"
          />
        </div>
      </div>

      {topics.length > 1 && (
        <div role="group" aria-label={labels.filter} className="hp-scroller -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
          {chips.map((chip) => {
            const on = chip.category === topic
            return (
              <button
                key={chip.label}
                type="button"
                aria-pressed={on}
                onClick={() => choose(chip.category)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-[14px] font-semibold transition-colors ${
                  on
                    ? 'border-[var(--hp-accent)] bg-[var(--hp-card)] text-[var(--hp-ink)] shadow-[var(--hp-shadow)]'
                    : 'border-[var(--hp-line)] bg-transparent text-[var(--hp-body)] hover:border-[var(--hp-line-strong)] hover:bg-[var(--hp-card)] hover:text-[var(--hp-ink)]'
                }`}
              >
                {chip.category && (
                  <span aria-hidden="true" className="text-[var(--hp-accent)] [&_svg]:h-4 [&_svg]:w-4">
                    {getCategoryStyle(chip.category).icon}
                  </span>
                )}
                {chip.label}
                <span className={`text-[12px] tabular-nums ${on ? 'text-[var(--hp-accent)]' : 'text-[var(--hp-muted)]'}`}>{chip.count}</span>
              </button>
            )
          })}
        </div>
      )}

      <p aria-live="polite" className="mt-6 flex flex-wrap items-center gap-3 text-[14px] text-[var(--hp-muted)]">
        <span>
          <span className="font-semibold tabular-nums text-[var(--hp-ink)]">{count}</span> {count === 1 ? labels.article : labels.articles}
        </span>
        {narrowed && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              choose('')
            }}
            className="font-semibold text-[var(--hp-accent)] hover:underline"
          >
            {labels.clear}
          </button>
        )}
      </p>

      {found.length > 0 ? (
        <ul key={key} className="menu-preview-in mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {found.map((post, i) => (
            <li key={post.slug} className={i < limit ? '' : 'hidden'}>
              <BlogCard post={post} index={i} readLabel={labels.read} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="hp-band mt-6 rounded-[1.5rem] p-10 text-center text-[16px] text-[var(--hp-body)]">{labels.empty}</p>
      )}

      {found.length > limit && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setLimits((all) => ({ ...all, [key]: limit + PAGE_SIZE }))}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--hp-line-strong)] bg-[var(--hp-card)] px-6 py-3 text-[15px] font-semibold text-[var(--hp-ink)] shadow-[var(--hp-shadow-sm)] transition-colors hover:border-[var(--hp-accent)]"
          >
            {labels.more}
            <span className="text-[13px] tabular-nums text-[var(--hp-muted)]">{found.length - limit}</span>
          </button>
        </div>
      )}
    </>
  )
}
