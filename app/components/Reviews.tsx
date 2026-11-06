import type { CmsReview } from '../lib/cms'
import { getHomeBlock } from '../lib/home-blocks'
import { fillRow, reviewerInitials, reviewWall, type WallReview } from '../lib/review-wall'
import { figuresFrom, type SiteFigures } from '../lib/site-figures'
import { ArrowUpRightIcon } from './InlineIcons'

const STAR = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
const QUOTE = 'M0 36V22.5C0 9.9 6.3 2.4 18.9 0l2.1 5.1C14.4 7.2 11.1 11.4 11.1 17.4H19.5V36H0zm28.5 0V22.5C28.5 9.9 34.8 2.4 47.4 0l.6 5.1c-6.6 2.1-9.9 6.3-9.9 12.3H48V36H28.5z'

function Stars({ count, className = 'h-4 w-4' }: { count: number; className?: string }) {
  return (
    <span role="img" aria-label={`${count} out of 5 stars`} className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} aria-hidden="true" className={className} viewBox="0 0 24 24" fill={i < count ? 'url(#reviews-gold)' : 'rgba(255,255,255,0.18)'}>
          <path d={STAR} />
        </svg>
      ))}
    </span>
  )
}

/** One laurel branch: a curved stem with leaves along it. Mirrored for the right side. */
function Laurel({ flip }: { flip?: boolean }) {
  const leaves = [
    { x: 22, y: 60, r: -50 },
    { x: 15, y: 48, r: -35 },
    { x: 12, y: 35, r: -18 },
    { x: 13, y: 22, r: 0 },
    { x: 18, y: 10, r: 20 },
  ]
  return (
    <svg aria-hidden="true" viewBox="0 0 44 76" className={`h-16 w-9 shrink-0 ${flip ? '-scale-x-100' : ''}`}>
      <path d="M36 72C16 62 6 42 18 4" fill="none" stroke="url(#reviews-gold)" strokeWidth="1.6" strokeLinecap="round" />
      {leaves.map((leaf) => (
        <g key={leaf.y}>
          <ellipse cx={leaf.x} cy={leaf.y} rx="4" ry="8.5" transform={`rotate(${leaf.r} ${leaf.x} ${leaf.y})`} fill="url(#reviews-gold)" opacity="0.9" />
          <ellipse cx={leaf.x + 10} cy={leaf.y + 4} rx="3.2" ry="7" transform={`rotate(${leaf.r + 70} ${leaf.x + 10} ${leaf.y + 4})`} fill="url(#reviews-gold)" opacity="0.6" />
        </g>
      ))}
    </svg>
  )
}

// Tones for the initials, picked by name so each reviewer keeps theirs.
const TONES = ['#2CCDDE', '#46A3E1', '#34d399', '#a78bfa', '#fbbf24', '#f472b6']
const tone = (name: string) => TONES[[...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % TONES.length]

/** The reviewer's photo or initials, inside a thin gradient ring. */
function Avatar({ review, size = 'h-10 w-10 text-[13px]' }: { review: WallReview; size?: string }) {
  return (
    <span className="shrink-0 rounded-full bg-[linear-gradient(140deg,#2CCDDE,#46A3E1_50%,rgba(255,255,255,0.15))] p-[2px]">
      {review.image ? (
        // eslint-disable-next-line @next/next/no-img-element -- a small uploaded photo, shown as it is
        <img src={review.image} alt="" width={48} height={48} loading="lazy" className={`${size} block rounded-full object-cover`} />
      ) : (
        <span aria-hidden="true" className={`${size} grid place-items-center rounded-full bg-[#0b1520] font-semibold`} style={{ color: tone(review.name) }}>
          {reviewerInitials(review.name)}
        </span>
      )}
    </span>
  )
}

/** Where the review was posted: the Google mark for Google, the name for anything else. */
function Source({ review }: { review: WallReview }) {
  if (!review.source) return null
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/65">
      {review.google && (
        // eslint-disable-next-line @next/next/no-img-element -- the Google mark, a small static SVG
        <img src="/google.svg" alt="" width={12} height={12} className="h-3 w-3" />
      )}
      {review.google ? 'Google review' : review.source}
    </span>
  )
}

function WallCard({ review, hidden }: { review: WallReview; hidden?: boolean }) {
  return (
    <li aria-hidden={hidden || undefined} className="mr-4 w-[18rem] shrink-0 sm:w-[22rem]">
      <figure className="group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-[linear-gradient(160deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] p-4 backdrop-blur-md transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-[#2CCDDE]/40 hover:shadow-[0_20px_50px_-20px_rgba(44,205,222,0.45)] motion-reduce:transition-none">
        <svg aria-hidden="true" viewBox="0 0 48 36" className="absolute right-4 top-4 h-4 w-6 text-white/[0.07] transition-colors duration-300 group-hover:text-[#2CCDDE]/30">
          <path fill="currentColor" d={QUOTE} />
        </svg>
        <Stars count={review.rating} className="h-3 w-3" />
        <blockquote className="mt-2 line-clamp-2 flex-1 pr-6 text-[14.5px] leading-relaxed text-white/85">
          <p>{review.text}</p>
        </blockquote>
        <figcaption className="mt-3 flex items-center gap-3 border-t border-white/[0.07] pt-3">
          <Avatar review={review} size="h-8 w-8 text-[11.5px]" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[14px] font-semibold capitalize text-white">{review.name}</span>
            {review.role && <span className="block truncate text-[12.5px] text-white/50">{review.role}</span>}
          </span>
          <Source review={review} />
        </figcaption>
      </figure>
    </li>
  )
}

/**
 * One row of the wall, moving sideways forever. The cards are written twice
 * (the second copy hidden from screen readers) so the loop has no seam; the
 * row pauses under the pointer and stands still with reduced motion.
 */
function WallRow({ reviews, label }: { reviews: WallReview[]; label: string }) {
  const cards = fillRow(reviews)
  return (
    <div className="review-wall-row relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <ul aria-label={label} className="review-wall-track flex w-max items-stretch py-2" style={{ ['--wall-speed' as string]: `${cards.length * 7}s` }}>
        {cards.map((review, i) => (
          <WallCard key={`a-${i}`} review={review} hidden={i >= reviews.length} />
        ))}
        {cards.map((review, i) => (
          <WallCard key={`b-${i}`} review={review} hidden />
        ))}
      </ul>
    </div>
  )
}

/**
 * Client reviews: a dark band in both themes. The heading and an award-style
 * Google rating, a spotlight review in a glowing glass card, and a wall of the
 * other reviews moving slowly in two rows. Only published reviews from the
 * admin's Customer reviews are shown; the words around them are the "Client
 * reviews" home block.
 */
export default async function Reviews({ items = [], figures = figuresFrom(null) }: { items?: CmsReview[]; figures?: SiteFigures }) {
  const block = await getHomeBlock('home_reviews')
  const copy = block.fields
  const { spotlight, wall } = reviewWall(items)

  return (
    <section aria-labelledby="reviews-title" className="home-reviews relative isolate overflow-hidden bg-[#08121b] py-12 text-white sm:py-14">
      {/* The gold used by the stars and laurels. */}
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <defs>
          <linearGradient id="reviews-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fde68a" />
            <stop offset="0.5" stopColor="#fbbf24" />
            <stop offset="1" stopColor="#d97706" />
          </linearGradient>
        </defs>
      </svg>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(closest-side,rgba(44,205,222,0.2),transparent)]" />
        <div className="absolute -right-32 top-1/4 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgba(70,163,225,0.16),transparent)]" />
        <div className="absolute bottom-[-18rem] left-1/3 h-[34rem] w-[50rem] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.1),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(44,205,222,0.5),transparent)]" />
      </div>

      <div className="page-container">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-10">
          <div className="flex flex-col lg:col-span-5">
            <p className="inline-flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/[0.05] px-4 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-[#7fe3ec] backdrop-blur">
              <Stars count={5} className="h-3 w-3" />
              {copy.eyebrow}
            </p>
            <h2 id="reviews-title" className="mt-5 text-balance text-[2rem] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[2.5rem]">
              {copy.heading}{' '}
              <span className="bg-[linear-gradient(100deg,#2CCDDE,#46A3E1_60%,#a5b4fc)] bg-clip-text text-transparent">{copy.heading_soft}</span>
            </h2>
            {copy.intro && <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#a9b6c4]">{copy.intro}</p>}

            {/* The Google rating as an award, from Contact details & logo. */}
            <div className="mt-6 rounded-[1.4rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-4 backdrop-blur-md lg:mt-auto">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Laurel />
                  <div className="px-1 text-center">
                    <p className="bg-[linear-gradient(180deg,#ffffff,#fde68a)] bg-clip-text font-display text-[2.75rem] font-semibold leading-none tracking-[-0.04em] text-transparent">{figures.rating}</p>
                    <div className="mt-1.5 flex justify-center">
                      <Stars count={5} className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <Laurel flip />
                </div>
                <div className="min-w-0 border-l border-white/10 pl-4">
                  <p className="flex items-center gap-2 text-[14px] font-semibold">
                    {/* eslint-disable-next-line @next/next/no-img-element -- the Google mark, a small static SVG */}
                    <img src="/google.svg" alt="" width={16} height={16} className="h-4 w-4" />
                    {copy.rating_label}
                  </p>
                  <p className="mt-1 text-[13px] text-white/60">{copy.count_label}</p>
                  {figures.googleUrl && copy.google_label && (
                    <a
                      href={figures.googleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#7fe3ec] hover:text-white"
                    >
                      {copy.google_label}
                      <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {spotlight && (
            // A glowing gradient edge around a glass card.
            <div className="relative rounded-[2rem] bg-[linear-gradient(140deg,rgba(44,205,222,0.7),rgba(70,163,225,0.25)_35%,rgba(255,255,255,0.06)_60%,rgba(165,180,252,0.35))] p-px shadow-[0_40px_100px_-40px_rgba(44,205,222,0.45)] lg:col-span-7">
              <figure className="relative isolate flex h-full flex-col overflow-hidden rounded-[calc(2rem-1px)] bg-[linear-gradient(160deg,#10202d,#0a1620_60%)] p-6 sm:p-8">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                  <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(44,205,222,0.28),transparent)]" />
                  <svg viewBox="0 0 48 36" className="absolute -bottom-6 right-6 h-40 w-52 text-white/[0.03]">
                    <path fill="currentColor" d={QUOTE} />
                  </svg>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <Stars count={spotlight.rating} className="h-5 w-5" />
                  <Source review={spotlight} />
                </div>
                <svg aria-hidden="true" viewBox="0 0 48 36" className="mt-4 h-6 w-8">
                  <defs>
                    <linearGradient id="reviews-quote" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#2CCDDE" />
                      <stop offset="1" stopColor="#46A3E1" />
                    </linearGradient>
                  </defs>
                  <path fill="url(#reviews-quote)" d={QUOTE} />
                </svg>
                <blockquote className="mt-4 flex-1">
                  <p className="line-clamp-4 text-balance font-display text-[1.25rem] font-medium leading-[1.4] tracking-[-0.015em] sm:text-[1.5rem]">{spotlight.text}</p>
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-4 border-t border-white/10 pt-4">
                  <Avatar review={spotlight} size="h-12 w-12 text-[15px]" />
                  <span>
                    <span className="block text-[16px] font-semibold capitalize">{spotlight.name}</span>
                    {spotlight.role && <span className="block text-[13.5px] text-white/55">{spotlight.role}</span>}
                  </span>
                </figcaption>
              </figure>
            </div>
          )}
        </div>
      </div>

      {wall.length > 0 && (
        <div className="mt-7 lg:mt-8">
          <WallRow reviews={wall} label={copy.eyebrow} />
        </div>
      )}
    </section>
  )
}
