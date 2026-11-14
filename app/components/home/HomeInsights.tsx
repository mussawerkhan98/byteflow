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

/** Cards in a row on wide screens: four, or fewer when there are fewer articles. */
const rowColumns = ['', 'lg:grid-cols-1', 'lg:grid-cols-2', 'lg:grid-cols-3', 'lg:grid-cols-4']

/** An article card: its whole cover (never cropped), topic and date, then the headline. */
function Card({ post, index, readLabel, badge }: { post: Post; index: number; readLabel: string; badge?: string }) {
  return (
    <li data-reveal style={delay(index * 90)}>
      <article className="hp-card group relative flex h-full flex-col overflow-hidden rounded-[1.5rem]">
        <figure className="relative m-2 aspect-[16/10] overflow-hidden rounded-[1.1rem] bg-[var(--hp-soft)]">
          <Photo slot={cover(post, index)} sizes="(min-width: 1024px) 300px, (min-width: 640px) 46vw, 100vw" fit="contain" zoom />
          {badge && <span className="hp-glass absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--hp-ink)]">{badge}</span>}
        </figure>
        <div className="flex flex-1 flex-col px-5 pb-5 pt-3">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12.5px] text-[var(--hp-muted)]">
            <Link href={categoryHref(post.category)} className="hp-pill relative z-10 !text-[var(--hp-accent)] hover:!border-[var(--hp-accent)]">
              {post.category}
            </Link>
            <span>{when(post)}</span>
          </p>
          <h3 className="mt-3 line-clamp-3 font-display text-[1.125rem] font-semibold leading-snug tracking-[-0.015em] text-[var(--hp-ink)] transition-colors duration-200 group-hover:text-[var(--hp-accent)]">
            <Link href={`/${post.slug}`} className="after:absolute after:inset-0 after:content-['']">
              {post.title}
            </Link>
          </h3>
          {post.excerpt && <p className="mt-2 line-clamp-2 text-[14.5px] leading-relaxed text-[var(--hp-body)]">{post.excerpt}</p>}
          <span aria-hidden="true" className="hp-textlink mt-auto pt-5 text-[14px]">
            {readLabel}
            <ArrowRight className="hp-arrow h-4 w-4" />
          </span>
        </div>
      </article>
    </li>
  )
}

/**
 * Insights: the latest articles as one row of four cards — the featured one
 * (picked in the admin, or the newest) first with its badge, then the next
 * newest — and the topic links underneath. Covers show whole, whatever their
 * shape. Everything comes live from the posts table (published only, newest
 * first); an article without a cover shows a placeholder. Hidden with no posts.
 */
export default async function HomeInsights({ posts }: { posts: Post[] }) {
  const block = await getHomeBlock('home_insights')
  const { featured, picked, list, topics } = insightPicks(block, posts)
  if (!featured) return null
  const copy = block.fields
  // One row of four: the featured article, then the newest after it.
  const cards = [featured, ...list].slice(0, 4)

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

        <ul className={`mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 ${rowColumns[cards.length]}`}>
          {cards.map((post, index) => (
            <Card key={post.slug} post={post} index={index} readLabel={copy.read_label} badge={index === 0 ? (picked ? copy.picked_badge : copy.latest_badge) : undefined} />
          ))}
        </ul>

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
