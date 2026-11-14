import Link from 'next/link'
import { getCategoryStyle } from '../../blog/category-style'
import type { Post } from '../../lib/db'
import { ArrowRight, Photo, delay } from '../home/ui'

/*
 * The blog page's article cards: the featured article and the cards in the
 * grid. Each shows the article's own cover, or its topic's icon on a soft
 * tint when it has none.
 */

export type BlogCardPost = Pick<Post, 'slug' | 'title' | 'excerpt' | 'category' | 'date' | 'read_time' | 'image_url' | 'image_alt' | 'author_name'>

/** The whole card is the article link: the title's link is stretched over it. */
const stretched = "after:absolute after:inset-0 after:content-['']"

const when = (post: BlogCardPost) => [post.date, post.read_time].map((part) => part?.trim()).filter(Boolean).join(' · ')

function Cover({ post, sizes, priority = false }: { post: BlogCardPost; sizes: string; priority?: boolean }) {
  // The whole cover, never cropped: article covers come in every shape.
  if (post.image_url) return <Photo slot={{ src: post.image_url, alt: post.image_alt || post.title, brief: '' }} sizes={sizes} priority={priority} fit="contain" zoom />
  return (
    <span aria-hidden="true" className="absolute inset-0 grid place-items-center bg-[var(--hp-soft)]">
      <span className="hp-svc-icon hp-svc-icon-lg [&_svg]:h-7 [&_svg]:w-7">{getCategoryStyle(post.category).icon}</span>
    </span>
  )
}

/** The featured article: a wide cover beside its headline and summary. */
export function BlogFeatured({ post, badge, readLabel, author }: { post: BlogCardPost; badge: string; readLabel: string; author: string }) {
  return (
    <article className="hp-card group relative grid overflow-hidden rounded-[1.75rem] lg:grid-cols-12">
      <figure className="relative m-2 aspect-[16/10] overflow-hidden rounded-[1.35rem] lg:col-span-7 lg:aspect-auto lg:min-h-[22rem]">
        <Cover post={post} sizes="(min-width: 1024px) 56vw, 100vw" priority />
        {badge && <span className="hp-glass absolute left-4 top-4 rounded-full px-3 py-1 text-[11.5px] font-bold uppercase tracking-[0.14em] text-[var(--hp-ink)]">{badge}</span>}
      </figure>
      <div className="flex flex-col justify-center p-6 sm:p-8 lg:col-span-5 lg:p-10">
        <p className="flex flex-wrap items-center gap-3 text-[13px] text-[var(--hp-muted)]">
          <span className="hp-pill !text-[var(--hp-accent)]">{post.category}</span>
          <span>{when(post)}</span>
        </p>
        <h2 className="hp-h3-lg mt-5">
          <Link href={`/${post.slug}`} className={stretched}>
            {post.title}
          </Link>
        </h2>
        {post.excerpt && <p className="mt-4 line-clamp-4 text-[16px] leading-relaxed text-[var(--hp-body)]">{post.excerpt}</p>}
        <p className="mt-7 flex flex-wrap items-center gap-3 text-[14px] text-[var(--hp-body)]">
          <span className="font-semibold text-[var(--hp-ink)]">{post.author_name || author}</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[var(--hp-line-strong)]" />
          <span aria-hidden="true" className="hp-textlink">
            {readLabel}
            <ArrowRight className="hp-arrow h-4 w-4" />
          </span>
        </p>
      </div>
    </article>
  )
}

/** A card in the grid: the cover with its topic on it, then the headline. */
export function BlogCard({ post, index, readLabel }: { post: BlogCardPost; index: number; readLabel: string }) {
  return (
    <article data-reveal style={delay((index % 4) * 100)} className="hp-card group relative flex h-full flex-col overflow-hidden rounded-[1.5rem]">
      <figure className="relative m-2 aspect-[16/10] overflow-hidden rounded-[1.1rem]">
        <Cover post={post} sizes="(min-width: 1280px) 300px, (min-width: 1024px) 30vw, (min-width: 768px) 46vw, 100vw" />
        <span className="hp-glass absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--hp-ink)]">{post.category}</span>
      </figure>
      <div className="flex flex-1 flex-col px-5 pb-5 pt-3">
        <p className="text-[13px] text-[var(--hp-muted)]">{when(post)}</p>
        <h3 className="mt-2 line-clamp-3 font-display text-[1rem] font-medium leading-[1.45] tracking-[-0.005em] text-[var(--hp-ink)] transition-colors duration-200 group-hover:text-[var(--hp-accent)]">
          <Link href={`/${post.slug}`} className={stretched}>
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="mt-2.5 line-clamp-3 text-[15px] leading-relaxed text-[var(--hp-body)]">{post.excerpt}</p>}
        <span aria-hidden="true" className="hp-textlink mt-auto pt-5 text-[14.5px]">
          {readLabel}
          <ArrowRight className="hp-arrow h-4 w-4" />
        </span>
      </div>
    </article>
  )
}
