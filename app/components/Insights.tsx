import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '../lib/db'
import { getHomeBlock } from '../lib/home-blocks'
import { categoryHref, insightPicks } from '../lib/insights'
import { getCategoryStyle } from '../blog/category-style'
import { ArrowUpRightIcon } from './InlineIcons'

/** "Mussawer Khan" → "MK", for the author's small round badge. */
const authorInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter((word) => /^\p{L}/u.test(word))
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

/** The post's cover, or its category's tint and icon when it has none. */
function Cover({ post, sizes, className, preload = false }: { post: Post; sizes: string; className: string; preload?: boolean }) {
  if (post.image_url)
    return (
      <Image
        src={post.image_url}
        alt={post.image_alt || post.title}
        width={1200}
        height={750}
        sizes={sizes}
        loading={preload ? undefined : 'lazy'}
        className={`h-full w-full object-cover ${className}`}
      />
    )
  const { gradient, icon } = getCategoryStyle(post.category)
  return (
    <div aria-hidden="true" className={`grid h-full w-full place-items-center text-[var(--insights-accent)] ${className}`} style={{ background: gradient }}>
      {icon}
    </div>
  )
}

function Featured({ post, readLabel }: { post: Post; readLabel: string }) {
  const author = post.author_name || 'Byteflow team'
  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.75rem] bg-[var(--insights-card)]">
        <Cover
          post={post}
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
        />
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,13,18,0)_55%,rgba(4,13,18,0.45)_100%)]" />
        <Link
          href={categoryHref(post.category)}
          className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3.5 py-1.5 text-[12px] font-semibold text-[#0b1220] backdrop-blur transition-colors hover:bg-white sm:left-5 sm:top-5"
        >
          {post.category}
        </Link>
        <span
          aria-hidden="true"
          className="absolute bottom-4 right-4 grid h-12 w-12 place-items-center rounded-full bg-white text-[#0b1220] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:bottom-5 sm:right-5 sm:h-14 sm:w-14"
        >
          <ArrowUpRightIcon className="h-4 w-4" />
        </span>
      </div>

      <div className="flex flex-1 flex-col pt-7">
        <h3 className="text-balance font-display text-[1.625rem] font-semibold leading-[1.15] tracking-[-0.025em] text-[var(--text-primary)] sm:text-[2rem] lg:text-[2.25rem]">
          <Link
            href={`/${post.slug}`}
            className="transition-colors duration-200 after:absolute after:inset-0 after:rounded-[1.75rem] after:content-[''] group-hover:text-[var(--insights-accent)]"
          >
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="mt-4 line-clamp-3 max-w-2xl text-[16px] leading-relaxed text-[var(--text-body)]">{post.excerpt}</p>}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-4 pt-7">
          <p className="flex items-center gap-3 text-[13.5px] text-[var(--text-body)]">
            <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--insights-ink)] text-[12px] font-semibold text-[var(--insights-on-ink)]">
              {authorInitials(author) || 'B'}
            </span>
            <span>
              <span className="font-semibold text-[var(--text-primary)]">{author}</span>
              <span className="block text-[12.5px]">
                {[post.date, post.read_time].filter(Boolean).join(' · ')}
              </span>
            </span>
          </p>
          <span aria-hidden="true" className="inline-flex items-center gap-2 text-[14.5px] font-semibold text-[var(--text-primary)]">
            {readLabel}
            <ArrowUpRightIcon className="h-4 w-4 text-[var(--insights-accent)] transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
          </span>
        </div>
      </div>
    </article>
  )
}

function ListItem({ post }: { post: Post }) {
  return (
    // On wide screens the rows share the featured article's height evenly.
    <li className="border-t border-[var(--insights-line)] first:border-t-0 lg:flex lg:flex-1 lg:items-center">
      <article className="group relative grid w-full grid-cols-[5.5rem_1fr] items-center gap-5 py-6 sm:grid-cols-[6.5rem_1fr] xl:grid-cols-[7.5rem_1fr]">
        <div className="aspect-square overflow-hidden rounded-2xl bg-[var(--insights-card)]">
          <Cover post={post} sizes="120px" className="transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none [&_svg]:h-6 [&_svg]:w-6" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--insights-accent)]">{post.category}</p>
          <h3 className="mt-2 line-clamp-2 font-display text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--insights-accent)] sm:text-[1.125rem]">
            <Link href={`/${post.slug}`} className="after:absolute after:inset-0 after:content-['']">
              {post.title}
            </Link>
          </h3>
          {post.date && <p className="mt-2 text-[12.5px] text-[var(--text-body)]">{post.date}</p>}
        </div>
      </article>
    </li>
  )
}

/**
 * Insights: the latest blog posts, magazine style. One featured post on the
 * left (picked in the admin, or the newest), the next newest as a list on the
 * right, and topic links to the blog's category filter below. Edited as
 * "Insights" on the admin's Home page sections screen; hidden with no posts.
 */
export default async function Insights({ posts }: { posts: Post[] }) {
  const block = await getHomeBlock('home_insights')
  const { featured, list, topics } = insightPicks(block, posts)
  if (!featured) return null
  const copy = block.fields

  return (
    <section aria-labelledby="insights-title" className="home-insights insights-section py-20 sm:py-24 lg:py-32">
      <div className="page-container">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-3xl">
            <p className="mb-6 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--insights-accent)]">
              <span aria-hidden="true" className="h-px w-10 bg-current" />
              {copy.eyebrow}
            </p>
            <h2 id="insights-title" className="text-balance text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl lg:text-[3.5rem]">
              {copy.heading} <span className="text-[var(--ink-soft)]">{copy.heading_soft}</span>
            </h2>
          </div>
          <div className="lg:max-w-sm lg:pb-1.5">
            {copy.intro && <p className="text-[16.5px] leading-relaxed text-[var(--text-body)]">{copy.intro}</p>}
            <Link
              href={copy.link || '/blog'}
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--insights-ink)] px-5 py-2.5 text-[14.5px] font-semibold text-[var(--insights-on-ink)] transition-transform duration-200 hover:-translate-y-px"
            >
              {copy.link_label}
              <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-10 sm:mt-16 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-14 xl:gap-20">
          <Featured post={featured} readLabel={copy.read_label} />
          {list.length > 0 && (
            <div className="flex flex-col">
              {copy.list_label && (
                <p className="flex items-center gap-3 border-b border-[var(--insights-line-strong)] pb-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
                  {copy.list_label}
                  <span className="rounded-full bg-[var(--insights-card)] px-2 py-0.5 text-[11px] tabular-nums text-[var(--text-body)]">{list.length}</span>
                </p>
              )}
              <ul className="flex flex-1 flex-col">
                {list.map((post) => (
                  <ListItem key={post.slug} post={post} />
                ))}
              </ul>
            </div>
          )}
        </div>

        {topics.length > 0 && (
          <nav aria-label={copy.topics_label} className="mt-14 flex flex-col gap-4 border-t border-[var(--insights-line)] pt-8 sm:flex-row sm:items-center sm:gap-6 lg:mt-20">
            <p className="shrink-0 text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--text-body)]">{copy.topics_label}</p>
            <ul className="flex flex-wrap gap-2.5">
              {topics.map((topic) => (
                <li key={topic.href}>
                  <Link
                    href={topic.href}
                    className="inline-flex items-center rounded-full border border-[var(--insights-line-strong)] px-4 py-2 text-[14px] font-medium text-[var(--text-primary)] transition-colors duration-200 hover:border-[var(--insights-ink)] hover:bg-[var(--insights-ink)] hover:text-[var(--insights-on-ink)]"
                  >
                    {topic.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </section>
  )
}
