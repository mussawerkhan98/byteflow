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
function Cover({ post, sizes, className }: { post: Post; sizes: string; className: string }) {
  if (post.image_url)
    return (
      <Image
        src={post.image_url}
        alt={post.image_alt || post.title}
        width={1200}
        height={900}
        sizes={sizes}
        loading="lazy"
        className={`h-full w-full object-cover ${className}`}
      />
    )
  const { gradient, icon } = getCategoryStyle(post.category)
  return (
    <div aria-hidden="true" className={`grid h-full w-full place-items-center bg-[#0f1b27] text-[#2CCDDE] ${className}`} style={{ backgroundImage: gradient }}>
      {icon}
    </div>
  )
}

/** The featured post as a cover story: its words laid over the picture. */
function Featured({ post, readLabel, badge }: { post: Post; readLabel: string; badge: string }) {
  const author = post.author_name || 'Byteflow team'
  return (
    <article className="group relative isolate flex min-h-[24rem] flex-col justify-end overflow-hidden rounded-[2rem] bg-[#0f1b27] p-6 text-white shadow-[0_40px_80px_-40px_rgba(15,27,39,0.55)] sm:min-h-[27rem] sm:p-8 lg:min-h-[29rem] lg:p-9">
      <div className="absolute inset-0 -z-20">
        <Cover
          post={post}
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06] motion-reduce:transition-none"
        />
      </div>
      {/* Dark from the bottom, so the words read over any picture. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(6,14,20,0.05)_0%,rgba(6,14,20,0.35)_40%,rgba(6,14,20,0.92)_100%)]" />

      <div className="absolute left-6 right-6 top-6 flex items-center justify-between gap-3 sm:left-8 sm:right-8 sm:top-8 lg:left-9 lg:right-9 lg:top-9">
        <Link
          href={categoryHref(post.category)}
          className="relative z-10 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[12px] font-semibold tracking-wide text-white backdrop-blur-md transition-colors hover:bg-white/20"
        >
          {post.category}
        </Link>
        {badge && <span className="rounded-full bg-[#2CCDDE] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#04121A]">{badge}</span>}
      </div>

      <h3 className="max-w-2xl text-balance font-display text-[1.5rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2rem] lg:text-[2.25rem]">
        <Link href={`/${post.slug}`} className="after:absolute after:inset-0 after:content-['']">
          {post.title}
        </Link>
      </h3>
      {post.excerpt && <p className="mt-3 line-clamp-2 max-w-xl text-[15px] leading-relaxed text-white/75">{post.excerpt}</p>}

      <div className="mt-6 flex items-center justify-between gap-5 border-t border-white/15 pt-5">
        <p className="flex items-center gap-3 text-[13.5px]">
          <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[12px] font-bold text-[#0f1b27]">
            {authorInitials(author) || 'B'}
          </span>
          <span>
            <span className="block font-semibold">{author}</span>
            <span className="block text-[12.5px] text-white/65">{[post.date, post.read_time].filter(Boolean).join(' · ')}</span>
          </span>
        </p>
        <span aria-hidden="true" className="flex items-center gap-3 text-[14.5px] font-semibold">
          <span className="hidden sm:inline">{readLabel}</span>
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[#2CCDDE] text-[#04121A] transition-transform duration-300 group-hover:rotate-45 motion-reduce:transition-none">
            <ArrowUpRightIcon className="h-4 w-4" />
          </span>
        </span>
      </div>
    </article>
  )
}

function ListCard({ post, number }: { post: Post; number: string }) {
  return (
    <li className="lg:flex lg:flex-1">
      <article className="group relative grid w-full grid-cols-[5rem_1fr] items-center gap-4 rounded-[1.4rem] border border-[var(--insights-line)] bg-[var(--insights-tile)] p-2.5 pr-4 shadow-[0_1px_2px_rgba(15,27,39,0.04)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--insights-line-strong)] hover:shadow-[0_24px_48px_-24px_rgba(15,27,39,0.35)] motion-reduce:transition-none sm:grid-cols-[6rem_1fr] sm:gap-5">
        <div className="relative aspect-square overflow-hidden rounded-[1rem] bg-[var(--insights-card)]">
          <Cover post={post} sizes="96px" className="transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none [&_svg]:h-6 [&_svg]:w-6" />
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-2.5 text-[10.5px] font-semibold uppercase tracking-[0.16em]">
            <span className="font-display tabular-nums text-[var(--text-body)]">{number}</span>
            <span aria-hidden="true" className="h-px w-4 bg-[var(--insights-line-strong)]" />
            <span className="truncate text-[var(--insights-accent)]">{post.category}</span>
          </p>
          <h3 className="mt-1.5 line-clamp-2 font-display text-[1rem] font-semibold leading-snug tracking-[-0.01em] text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--insights-accent)] sm:text-[1.0625rem]">
            <Link href={`/${post.slug}`} className="after:absolute after:inset-0 after:rounded-[1.4rem] after:content-['']">
              {post.title}
            </Link>
          </h3>
          <p className="mt-1.5 flex items-center justify-between gap-3 text-[12px] text-[var(--text-body)]">
            {[post.date, post.read_time].filter(Boolean).join(' · ')}
            <ArrowUpRightIcon className="h-3.5 w-3.5 -translate-x-1 text-[var(--insights-accent)] opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
          </p>
        </div>
      </article>
    </li>
  )
}

/**
 * Insights: the latest blog posts, magazine style. A cover-story card for the
 * featured post (picked in the admin, or the newest), the next newest as
 * numbered cards beside it, and a bar of topic links to the blog's category
 * filter. Edited as "Insights" on the admin's Home page sections screen;
 * hidden with no posts.
 */
export default async function Insights({ posts }: { posts: Post[] }) {
  const block = await getHomeBlock('home_insights')
  const { featured, picked, list, topics } = insightPicks(block, posts)
  if (!featured) return null
  const copy = block.fields

  return (
    <section aria-labelledby="insights-title" className="home-insights insights-section relative isolate overflow-hidden py-14 sm:py-16 lg:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-56 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(closest-side,rgba(44,205,222,0.16),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(var(--insights-line)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:linear-gradient(180deg,black,transparent_35%)]" />
      </div>

      <div className="page-container">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-3xl xl:max-w-none">
            <p className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-[var(--insights-line-strong)] bg-[var(--insights-tile)] px-4 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-[var(--text-primary)]">
              <span aria-hidden="true" className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-[#2CCDDE] opacity-60 motion-reduce:animate-none" />
                <span className="relative h-2 w-2 rounded-full bg-[#2CCDDE]" />
              </span>
              {copy.eyebrow}
            </p>
            <h2 id="insights-title" className="text-balance text-[2.25rem] font-semibold leading-[1.04] tracking-[-0.045em] text-[var(--text-primary)] sm:text-[2.75rem] lg:text-[3.25rem]">
              {copy.heading}{' '}
              <span className="bg-[linear-gradient(100deg,var(--insights-accent),#46A3E1)] bg-clip-text text-transparent">{copy.heading_soft}</span>
            </h2>
          </div>
          <div className="lg:max-w-sm lg:shrink-0 lg:pb-1">
            {copy.intro && <p className="text-[15.5px] leading-relaxed text-[var(--text-body)]">{copy.intro}</p>}
            <Link
              href={copy.link || '/blog'}
              className="group mt-5 inline-flex items-center gap-3 rounded-full bg-[var(--insights-ink)] py-2 pl-5 pr-2 text-[14.5px] font-semibold text-[var(--insights-on-ink)] shadow-[0_14px_30px_-14px_rgba(15,27,39,0.6)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              {copy.link_label}
              <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full bg-[#2CCDDE] text-[#04121A] transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRightIcon className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-9 grid gap-5 sm:mt-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-6">
          <Featured post={featured} readLabel={copy.read_label} badge={picked ? copy.picked_badge : copy.latest_badge} />
          {list.length > 0 && (
            <div className="flex flex-col">
              {copy.list_label && (
                <p className="mb-3 mt-3 flex items-center gap-3 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)] lg:mt-0">
                  {copy.list_label}
                  <span aria-hidden="true" className="h-px flex-1 bg-[var(--insights-line-strong)]" />
                </p>
              )}
              <ul className="flex flex-1 flex-col gap-3">
                {list.map((post, index) => (
                  <ListCard key={post.slug} post={post} number={String(index + 2).padStart(2, '0')} />
                ))}
              </ul>
            </div>
          )}
        </div>

        {topics.length > 0 && (
          <nav
            aria-label={copy.topics_label}
            className="mt-5 flex flex-col gap-3 rounded-[1.5rem] border border-[var(--insights-line)] bg-[var(--insights-tile)] p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-2.5 sm:pl-6 lg:mt-6"
          >
            <p className="shrink-0 text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--text-body)]">{copy.topics_label}</p>
            <ul className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <li key={topic.href}>
                  <Link
                    href={topic.href}
                    className="group inline-flex items-center gap-2 rounded-full bg-[var(--insights-card)] py-1.5 pl-1.5 pr-1.5 text-[14px] font-medium text-[var(--text-primary)] transition-colors duration-200 hover:bg-[var(--insights-ink)] hover:text-[var(--insights-on-ink)]"
                  >
                    <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full bg-[var(--insights-tile)] text-[var(--insights-accent)] [&_svg]:h-4 [&_svg]:w-4">
                      {getCategoryStyle(topic.category).icon}
                    </span>
                    {topic.label}
                    {/* How many published articles the topic has. */}
                    <span className="min-w-7 rounded-full bg-[var(--insights-tile)] px-2 py-0.5 text-center text-[11.5px] font-semibold tabular-nums text-[var(--text-body)] group-hover:text-[var(--insights-ink)]">
                      {topic.count}
                      <span className="sr-only"> articles</span>
                    </span>
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
