import type { CmsReview } from '../../lib/cms'
import { getHomeBlock } from '../../lib/home-blocks'
import { reviewerInitials, toWallReview, type WallReview } from '../../lib/review-wall'
import { figuresFrom, type SiteFigures } from '../../lib/site-figures'
import { Eyebrow, SectionTitle, delay } from './ui'

const STAR = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
const QUOTE = 'M0 36V22.5C0 9.9 6.3 2.4 18.9 0l2.1 5.1C14.4 7.2 11.1 11.4 11.1 17.4H19.5V36H0zm28.5 0V22.5C28.5 9.9 34.8 2.4 47.4 0l.6 5.1c-6.6 2.1-9.9 6.3-9.9 12.3H48V36H28.5z'

/** Reviews this short read as a one-line quote rather than a card. */
const SHORT = 40
/** How many of the longest reviews are featured large. */
const FEATURED = 2

function Stars({ count, className = 'h-4 w-4' }: { count: number; className?: string }) {
  return (
    <span role="img" aria-label={`${count} out of 5 stars`} className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} aria-hidden="true" className={className} viewBox="0 0 24 24" fill={i < count ? '#F5B301' : 'var(--hp-line-strong)'}>
          <path d={STAR} />
        </svg>
      ))}
    </span>
  )
}

/** Initials only: the page shows no uploaded photos. */
function Avatar({ review, size }: { review: WallReview; size: string }) {
  return (
    <span aria-hidden="true" className={`hp-avatar ${size}`}>
      {reviewerInitials(review.name)}
    </span>
  )
}

function Source({ review }: { review: WallReview }) {
  if (!review.source) return null
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--hp-muted)]">
      {review.google && (
        // eslint-disable-next-line @next/next/no-img-element -- the Google mark, a small static SVG
        <img src="/google.svg" alt="" width={14} height={14} loading="lazy" className="h-3.5 w-3.5" />
      )}
      {review.google ? 'Google review' : review.source}
    </span>
  )
}

function Reviewer({ review, large = false }: { review: WallReview; large?: boolean }) {
  return (
    <figcaption className={`flex items-center gap-3 border-t border-[var(--hp-line)] ${large ? 'mt-7 pt-5' : 'mt-5 pt-4'}`}>
      <Avatar review={review} size={large ? 'h-12 w-12 text-[15px]' : 'h-10 w-10 text-[13px]'} />
      <span className="min-w-0 flex-1">
        <span className={`block truncate font-semibold capitalize text-[var(--hp-ink)] ${large ? 'text-[16px]' : 'text-[14.5px]'}`}>{review.name}</span>
        {review.role && <span className="block truncate text-[13px] text-[var(--hp-muted)]">{review.role}</span>}
      </span>
      <Source review={review} />
    </figcaption>
  )
}

/** One of the longest reviews, large, with the hero's soft-blue diagonal in its corner. */
function FeaturedReview({ review, index }: { review: WallReview; index: number }) {
  return (
    <li data-reveal style={delay(index * 120)} className="min-w-0">
      <figure className="hp-review-feature relative flex h-full flex-col overflow-hidden rounded-[0.75rem] p-7 sm:p-9">
        <span aria-hidden="true" className="hp-review-corner" />
        <div className="relative flex items-center justify-between gap-4">
          <svg aria-hidden="true" viewBox="0 0 48 36" className="h-8 w-11 text-[#2CCDDE]">
            <path fill="currentColor" d={QUOTE} />
          </svg>
          <Stars count={review.rating} />
        </div>
        <blockquote className="relative mt-6 flex-1">
          <p className="hp-review-text font-display text-[1.1875rem] font-medium leading-[1.55] tracking-[-0.01em] text-[var(--hp-ink)] sm:text-[1.3125rem]">{review.text}</p>
        </blockquote>
        <Reviewer review={review} large />
      </figure>
    </li>
  )
}

function ReviewCard({ review, index }: { review: WallReview; index: number }) {
  return (
    <li data-reveal style={delay((index % 3) * 110)}>
      <figure className="hp-review-card relative flex h-full flex-col rounded-[0.75rem] p-6">
        <div className="flex items-center justify-between gap-3">
          <Stars count={review.rating} className="h-3.5 w-3.5" />
          <svg aria-hidden="true" viewBox="0 0 48 36" className="h-5 w-7 text-[var(--hp-accent-bg)]">
            <path fill="currentColor" d={QUOTE} />
          </svg>
        </div>
        <blockquote className="mt-4 flex-1">
          <p className="hp-review-text text-[15.5px] leading-relaxed text-[var(--hp-ink)]">{review.text}</p>
        </blockquote>
        <Reviewer review={review} />
      </figure>
    </li>
  )
}

/** A one-line review: the words and who said them, in a compact quote. */
function QuickReview({ review }: { review: WallReview }) {
  return (
    <li className="hp-review-quick flex items-center gap-3 rounded-[0.625rem] py-2.5 pl-2.5 pr-4">
      <Avatar review={review} size="h-9 w-9 text-[12px]" />
      <span className="min-w-0">
        <span className="hp-review-text block text-[14.5px] font-medium text-[var(--hp-ink)]">“{review.text}”</span>
        <span className="mt-0.5 flex items-center gap-2 text-[12.5px] text-[var(--hp-muted)]">
          <span className="capitalize">{review.name}</span>
          <Stars count={review.rating} className="h-3 w-3" />
        </span>
      </span>
    </li>
  )
}

/**
 * Client reviews, in the hero's language. A summary band (the Google rating
 * and the site-wide figures), the longest reviews featured large, the rest as
 * cards, and the one-liners as compact quotes. Only published reviews from
 * the admin's Customer reviews, in their own words; adding reviews there
 * fills the section further.
 */
export default async function HomeReviews({ items = [], figures = figuresFrom(null) }: { items?: CmsReview[]; figures?: SiteFigures }) {
  const block = await getHomeBlock('home_reviews')
  const copy = block.fields
  const reviews = items.filter((item) => item.customer_name?.trim() && item.review_text?.trim()).map(toWallReview)
  if (!reviews.length) return null

  // Longest first for the featured pair; the rest keep the admin's order.
  const featured = [...reviews].sort((a, b) => b.text.length - a.text.length).slice(0, FEATURED)
  const others = reviews.filter((review) => !featured.includes(review))
  const cards = others.filter((review) => review.text.length >= SHORT)
  const quick = others.filter((review) => review.text.length < SHORT)

  const stats = [
    { value: figures.rating, label: copy.rating_label, stars: true },
    { value: figures.reviews, label: 'Google reviews' },
    { value: figures.clients, label: 'Businesses served' },
    { value: `${figures.years}+`, label: `Years in Dubai, since ${figures.founded}` },
  ]

  return (
    <section aria-labelledby="reviews-title" className="hp-section hp-divided">
      <div className="page-container">
        <header data-reveal className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <SectionTitle id="reviews-title" heading={copy.heading} soft={copy.heading_soft} className="mt-5" />
          </div>
          {copy.intro && <p className="hp-lead max-w-md lg:col-span-5 lg:justify-self-end">{copy.intro}</p>}
        </header>

        {/* The summary band: the Google rating and the figures from Contact details & logo. */}
        <div data-reveal className="hp-review-band mt-10 grid overflow-hidden rounded-[0.75rem] sm:grid-cols-2 lg:mt-12 lg:grid-cols-[1.3fr_repeat(3,1fr)_auto]">
          {stats.map((stat) => (
            <div key={stat.label} className="hp-review-band-cell flex items-center gap-4 px-6 py-5">
              {stat.stars && (
                // eslint-disable-next-line @next/next/no-img-element -- the Google mark, a small static SVG
                <img src="/google.svg" alt="" width={36} height={36} loading="lazy" className="h-9 w-9 shrink-0" />
              )}
              <div className="min-w-0">
                <p className="flex items-center gap-2.5">
                  <span className="font-display text-[1.75rem] font-semibold leading-none tracking-[-0.03em] tabular-nums text-[var(--hp-ink)]">{stat.value}</span>
                  {stat.stars && <Stars count={5} className="h-3.5 w-3.5" />}
                </p>
                <p className="mt-1.5 text-[13px] text-[var(--hp-muted)]">{stat.label}</p>
              </div>
            </div>
          ))}
          {figures.googleUrl && copy.google_label && (
            <div className="hp-review-band-cell flex items-center px-6 py-5">
              <a href={figures.googleUrl} target="_blank" rel="noopener noreferrer" className="hp-textlink group whitespace-nowrap text-[14px]">
                {copy.google_label}
                <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8} className="hp-arrow h-3.5 w-3.5">
                  <path d="M4.5 11.5l7-7m-5.5 0h5.5V10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          )}
        </div>

        <ul className={`mt-4 grid gap-4 ${featured.length > 1 ? 'lg:grid-cols-2' : ''}`}>
          {featured.map((review, i) => (
            <FeaturedReview key={review.id} review={review} index={i} />
          ))}
        </ul>

        {cards.length > 0 && (
          <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((review, i) => (
              <ReviewCard key={review.id} review={review} index={i} />
            ))}
          </ul>
        )}

        {quick.length > 0 && (
          <ul data-reveal aria-label={copy.eyebrow} className="mt-4 flex flex-wrap gap-3">
            {quick.map((review) => (
              <QuickReview key={review.id} review={review} />
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
