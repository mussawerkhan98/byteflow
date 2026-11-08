import Link from 'next/link'
import type { Post } from '../../lib/db'
import { getHomeBlock } from '../../lib/home-blocks'
import { homePhotos, nthPhoto, type PhotoSlot } from '../../lib/home-photos'
import { categoryHref, insightPicks } from '../../lib/insights'
import { getCategoryStyle } from '../../blog/category-style'
import { ArrowRight, Button, Eyebrow, Photo, SectionTitle, delay } from './ui'

/** The article's own cover from the database, or the placeholder when it has none. */
const cover = (post: Post, index: number): PhotoSlot =>
  post.image_url
    ? { src: post.image_url, alt: post.image_alt || post.title, brief: '' }
    : nthPhoto(homePhotos.insights, index)

const when = (post: Post) => [post.date, post.read_time].filter(Boolean).join(' · ')

/** The featured article: a large photograph above its headline. */
function Featured({ post, readLabel, badge }: { post: Post; readLabel: string; badge: string }) {
  return (
    <article className="group relative flex h-full flex-col">
      <figure data-reveal="image" className="hp-frame relative aspect-[16/10] overflow-hidden rounded-[1.75rem]">
        <Photo slot={cover(post, 0)} sizes="(min-width: 1024px) 56vw, 100vw" zoom />
        {badge && <span className="hp-glass absolute right-4 top-4 rounded-full px-3 py-1 text-[11.5px] font-bold uppercase tracking-[0.14em] text-[var(--hp-ink)]">{badge}</span>}
      </figure>
      <div className="mt-7 flex flex-wrap items-center gap-3 text-[13px] text-[var(--hp-muted)]">
        <Link href={categoryHref(post.category)} className="hp-pill relative z-10 !text-[var(--hp-accent)] hover:!border-[var(--hp-accent)]">
          {post.category}
        </Link>
        <span>{when(post)}</span>
      </div>
      <h3 className="hp-h3-lg mt-4 max-w-2xl">
        <Link href={`/${post.slug}`} className="after:absolute after:inset-0 after:content-['']">
          {post.title}
        </Link>
      </h3>
      {post.excerpt && <p className="mt-3 line-clamp-2 max-w-2xl text-[16px] leading-relaxed text-[var(--hp-body)]">{post.excerpt}</p>}
      <p className="mt-5 flex items-center gap-3 text-[14px] text-[var(--hp-body)]">
        <span className="font-semibold text-[var(--hp-ink)]">{post.author_name || 'Byteflow team'}</span>
        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[var(--hp-line-strong)]" />
        <span aria-hidden="true" className="hp-textlink">
          {readLabel}
          <ArrowRight className="hp-arrow h-4 w-4" />
        </span>
      </p>
    </article>
  )
}

function Item({ post, number, index }: { post: Post; number: string; index: number }) {
  return (
    <li data-reveal style={delay(index * 100)}>
      <article className="group relative grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-5 border-b border-[var(--hp-line)] py-6 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6">
        <figure data-reveal="image" className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Photo slot={cover(post, index + 1)} sizes="144px" zoom mini />
        </figure>
        <div className="min-w-0">
          <p className="flex items-center gap-2.5 text-[11.5px] font-semibold uppercase tracking-[0.14em]">
            <span className="font-display tabular-nums text-[var(--hp-muted)]">{number}</span>
            <span className="truncate text-[var(--hp-accent)]">{post.category}</span>
          </p>
          <h3 className="mt-2 line-clamp-2 font-display text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-[var(--hp-ink)] transition-colors duration-200 group-hover:text-[var(--hp-accent)] sm:text-[1.125rem]">
            <Link href={`/${post.slug}`} className="after:absolute after:inset-0 after:content-['']">
              {post.title}
            </Link>
          </h3>
          <p className="mt-1.5 text-[13px] text-[var(--hp-muted)]">{when(post)}</p>
        </div>
      </article>
    </li>
  )
}

/**
 * Insights: the latest articles, editorial style. The featured one (picked in
 * the admin, or the newest) large on the left, the next newest listed beside
 * it, and the topic links underneath. Everything comes live from the posts
 * table (published only, newest first); each article shows its own cover,
 * or a placeholder when it has none. Hidden with no posts.
 */
export default async function HomeInsights({ posts }: { posts: Post[] }) {
  const block = await getHomeBlock('home_insights')
  const { featured, picked, list, topics } = insightPicks(block, posts)
  if (!featured) return null
  const copy = block.fields

  return (
    <section aria-labelledby="insights-title" className="hp-section hp-tinted">
      <div className="page-container">
        <header data-reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-3xl">
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <SectionTitle id="insights-title" heading={copy.heading} soft={copy.heading_soft} className="mt-5" />
          </div>
          <div className="lg:max-w-sm lg:pb-1">
            {copy.intro && <p className="hp-lead">{copy.intro}</p>}
            <Button href={copy.link || '/blog'} variant="ghost" className="mt-6">
              {copy.link_label}
            </Button>
          </div>
        </header>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-14">
          <div data-reveal className="lg:col-span-7">
            <Featured post={featured} readLabel={copy.read_label} badge={picked ? copy.picked_badge : copy.latest_badge} />
          </div>
          {list.length > 0 && (
            <div className="lg:col-span-5">
              {copy.list_label && <p className="hp-eyebrow border-b border-[var(--hp-line-strong)] pb-4">{copy.list_label}</p>}
              <ul>
                {list.map((post, index) => (
                  <Item key={post.slug} post={post} number={String(index + 2).padStart(2, '0')} index={index} />
                ))}
              </ul>
            </div>
          )}
        </div>

        {topics.length > 0 && (
          <nav aria-label={copy.topics_label} data-reveal className="mt-14 flex flex-col gap-4 border-t border-[var(--hp-line)] pt-8 sm:flex-row sm:items-center sm:gap-8">
            <p className="hp-eyebrow shrink-0 !text-[var(--hp-muted)]">{copy.topics_label}</p>
            <ul className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <li key={topic.href}>
                  <Link href={topic.href} className="hp-topic group">
                    <span aria-hidden="true" className="text-[var(--hp-accent)] [&_svg]:h-4 [&_svg]:w-4">
                      {getCategoryStyle(topic.category).icon}
                    </span>
                    {topic.label}
                    <span className="hp-topic-count">
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
