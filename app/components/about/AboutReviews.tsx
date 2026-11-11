import type { CmsReview } from '../../lib/cms'
import type { HomeBlock } from '../../lib/home-content'
import { reviewerInitials, toWallReview, type WallReview } from '../../lib/review-wall'
import type { SiteFigures } from '../../lib/site-figures'
import { ArrowRight, Eyebrow, SectionTitle, delay } from '../home/ui'

const STAR = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
/** How many reviews the wall shows. */
const SHOWN = 6

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

function Review({ review, index }: { review: WallReview; index: number }) {
  return (
    <li data-reveal style={delay((index % 2) * 120)} className="mb-5 break-inside-avoid">
      <figure className="ab-review rounded-[1.25rem] p-6 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <Stars count={review.rating} />
          {review.google && (
            // eslint-disable-next-line @next/next/no-img-element -- the Google mark, a small static SVG
            <img src="/google.svg" alt="Google review" width={18} height={18} loading="lazy" className="h-[18px] w-[18px]" />
          )}
        </div>
        <blockquote className="mt-4 text-[15.5px] leading-relaxed text-[var(--hp-ink)]">
          <p className="first-letter:uppercase">{review.text}</p>
        </blockquote>
        <figcaption className="mt-5 flex items-center gap-3 border-t border-[var(--hp-line)] pt-4">
          <span aria-hidden="true" className="hp-avatar h-10 w-10 text-[13px]">
            {reviewerInitials(review.name)}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[14.5px] font-semibold capitalize text-[var(--hp-ink)]">{review.name}</span>
            {review.role && <span className="block truncate text-[13px] text-[var(--hp-muted)]">{review.role}</span>}
          </span>
        </figcaption>
      </figure>
    </li>
  )
}

/**
 * The About page's reviews: the Google rating on a card held on the left,
 * a wall of up to six published reviews on the right (featured ones first).
 * Only published reviews from the admin's Customer reviews; none, and the
 * section is left out. The words are "Reviews" on the About page sections.
 */
export default function AboutReviews({ items, figures, content }: { items: CmsReview[]; figures: SiteFigures; content: HomeBlock }) {
  const reviews = items
    .filter((item) => item.customer_name?.trim() && item.review_text?.trim())
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, SHOWN)
    .map(toWallReview)
  if (!reviews.length) return null
  const copy = content.fields

  return (
    <section aria-labelledby="about-reviews-title" className="hp-section">
      <div className="page-container grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <header data-reveal>
              <Eyebrow>{copy.eyebrow}</Eyebrow>
              <SectionTitle id="about-reviews-title" heading={copy.heading} soft={copy.heading_soft} softBlock className="mt-5" />
              {copy.intro && <p className="hp-lead mt-5">{copy.intro}</p>}
            </header>

            <div data-reveal style={delay(120)} className="ab-rating mt-8 rounded-[1.5rem] p-6 sm:p-7">
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element -- the Google mark, a small static SVG */}
                <img src="/google.svg" alt="" width={40} height={40} className="h-10 w-10 shrink-0" />
                <div>
                  <p className="flex items-baseline gap-2">
                    <span className="hp-stat !text-[2.75rem]">{figures.rating}</span>
                    <span className="text-[15px] font-semibold text-[var(--hp-muted)]">/ 5</span>
                  </p>
                  <Stars count={Math.round(Number(figures.rating)) || 5} className="mt-1 h-[18px] w-[18px]" />
                </div>
              </div>
              <p className="mt-5 text-[15px] font-semibold text-[var(--hp-ink)]">{copy.rating_label}</p>
              <p className="mt-0.5 text-[14px] text-[var(--hp-body)]">{copy.count_label}</p>
              {figures.googleUrl && copy.google_label && (
                <a href={figures.googleUrl} target="_blank" rel="noopener noreferrer" className="hp-textlink group mt-5 text-[14.5px]">
                  {copy.google_label}
                  <ArrowRight className="hp-arrow h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <ul className="columns-1 gap-5 sm:columns-2 lg:col-span-8">
          {reviews.map((review, i) => (
            <Review key={review.id} review={review} index={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}
