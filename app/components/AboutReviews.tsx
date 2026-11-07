'use client'

import { useState, useEffect, useCallback } from 'react'
import type { CmsReview } from '../lib/cms'
import { toWallReview } from '../lib/review-wall'
import { figuresFrom, type SiteFigures } from '../lib/site-figures'

const CARDS_PER_PAGE = 3
function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#FBBF24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

/**
 * The About page's reviews, three at a time. Only published reviews from the
 * admin's Customer reviews are shown (none: the section is left out), and a
 * review carries the Google mark only when its source is Google.
 */
export default function AboutReviews({ items = [], figures = figuresFrom(null) }: { items?: CmsReview[]; figures?: SiteFigures }) {
  const shownReviews = items.filter((item) => item.customer_name?.trim() && item.review_text?.trim()).map(toWallReview)
  const totalPages = Math.ceil(shownReviews.length / CARDS_PER_PAGE)
  const [page, setPage] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right'>('right')

  const go = useCallback((nextPage: number, dir: 'left' | 'right') => {
    if (animating) return
    setDirection(dir)
    setAnimating(true)
    setTimeout(() => {
      setPage(nextPage)
      setAnimating(false)
    }, 300)
  }, [animating])

  const prev = () => go((page - 1 + totalPages) % totalPages, 'left')
  const next = () => go((page + 1) % totalPages, 'right')

  useEffect(() => {
    if (totalPages < 2) return
    const id = setInterval(next, 6000)
    return () => clearInterval(id)
  }, [page])

  const visible = shownReviews.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE)
  if (!shownReviews.length) return null

  return (
    <section className="relative py-24 overflow-hidden">

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(44,205,222,0.06) 0%, transparent 65%)', filter: 'blur(80px)' }}
      />

      <div className="page-container relative">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5 uppercase tracking-widest"
              style={{ background: 'rgba(44,205,222,0.07)', border: '1px solid rgba(44,205,222,0.25)', color: '#2CCDDE' }}
            >
              Client Reviews
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
              <span className="text-[var(--text-primary)]">What Our Clients</span>
              <br />
              <span style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Say About Us
              </span>
            </h2>
          </div>

          {/* Google rating */}
          <div
            className="flex items-center gap-4 px-5 py-4 rounded-2xl flex-shrink-0 self-start"
            style={{
              background: 'linear-gradient(160deg, rgba(44,205,222,0.07) 0%, var(--bg-surface) 100%)',
              border: '1px solid rgba(44,205,222,0.18)',
            }}
          >
            <img src="/google.svg" alt="Google" width={32} height={32} loading="lazy" className="w-8 h-8 object-contain flex-shrink-0" />
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-2xl font-black text-[var(--text-primary)] leading-none">{figures.rating}</span>
                <Stars count={5} />
              </div>
              <p className="text-[var(--text-muted)] text-xs">{figures.reviews} Google reviews</p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 transition-all duration-300"
          style={{
            opacity: animating ? 0 : 1,
            transform: animating
              ? `translateX(${direction === 'right' ? '-20px' : '20px'})`
              : 'translateX(0)',
          }}
        >
          {visible.map((r) => (
            <div
              key={r.id}
              className="card-hover group relative flex flex-col gap-4 p-6 rounded-2xl"
              style={{
                background: 'linear-gradient(160deg, rgba(44,205,222,0.06) 0%, rgba(70,163,225,0.02) 30%, var(--bg-surface) 100%)',
                border: '1px solid rgba(44,205,222,0.15)',
              }}
            >
              {/* Top shimmer */}
              <div
                className="absolute top-0 left-6 right-6 h-[1px]"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(44,205,222,0.4), transparent)' }}
              />

              {/* Stars */}
              <Stars count={r.rating} />

              {/* Text */}
              <p className="text-[var(--text-muted)] text-sm leading-relaxed flex-1">
                &ldquo;{r.text}&rdquo;
              </p>

              {/* Reviewer */}
              <div
                className="flex items-center justify-between pt-4"
                style={{ borderTop: '1px solid var(--overlay-hover)' }}
              >
                <div className="flex items-center gap-2">
                  <div>
                    <span className="text-[var(--text-primary)] text-sm font-bold capitalize">{r.name}</span>
                    {r.role && <p className="text-[var(--text-muted)] text-xs mt-0.5">{r.role}</p>}
                  </div>
                </div>
                {/* Where it was posted: the Google mark only for Google reviews. */}
                {r.google ? (
                  <img src="/google.svg" alt="Google review" width={20} height={20} loading="lazy" className="w-5 h-5 object-contain opacity-60" />
                ) : (
                  r.source && <span className="text-[11px] font-medium text-[var(--text-muted)]">{r.source}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-8">

          {/* Dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => go(i, i > page ? 'right' : 'left')}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === page ? '28px' : '8px',
                  height: '8px',
                  background: i === page ? 'linear-gradient(90deg, #2CCDDE, #46A3E1)' : 'rgba(44,205,222,0.2)',
                }}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_20px_rgba(44,205,222,0.35)]"
              style={{ background: 'rgba(44,205,222,0.06)', border: '1px solid rgba(44,205,222,0.2)', color: '#2CCDDE' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #2CCDDE, #46A3E1)'
                e.currentTarget.style.color = '#000'
                e.currentTarget.style.border = '1px solid transparent'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(44,205,222,0.06)'
                e.currentTarget.style.color = '#2CCDDE'
                e.currentTarget.style.border = '1px solid rgba(44,205,222,0.2)'
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>
            <button
              onClick={next}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_20px_rgba(44,205,222,0.35)]"
              style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)', color: '#000' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}
