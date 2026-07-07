'use client'

import { useState, useEffect, useCallback } from 'react'

const reviews = [
  {
    name: 'Ahmed Al Mansouri',
    role: 'CEO, Al Mansouri Trading',
    text: 'Byteflow completely transformed our IT setup. They connected our offices across Dubai and handled everything from servers to Microsoft 365. Response time is incredible — issues get fixed before we even notice them.',
    rating: 5,
  },
  {
    name: 'Sarah Thompson',
    role: 'Operations Manager, Gulf Logistics',
    text: 'We had a ransomware scare and Byteflow restored everything within hours. Their backup system saved us completely. Highly professional team — they know exactly what they are doing.',
    rating: 5,
  },
  {
    name: 'Mohammed Al Rashidi',
    role: 'Director, Rashidi Group',
    text: 'Best IT AMC service in Dubai. Fixed monthly cost, no hidden charges, and their engineers are always available. We have been with Byteflow for 3 years and never had a major downtime.',
    rating: 5,
  },
  {
    name: 'Priya Nair',
    role: 'Marketing Head, TechBridge UAE',
    text: 'The digital marketing team at Byteflow doubled our website traffic in 4 months. Their SEO and Google Ads work is exceptional. They also built our new website which looks amazing.',
    rating: 5,
  },
  {
    name: 'Khalid Al Zaabi',
    role: 'Owner, Al Zaabi Consultancy',
    text: 'Switched to Byteflow after a bad experience with another IT company. The difference is night and day. They set up our entire cloud infrastructure and the support is always fast and friendly.',
    rating: 5,
  },
  {
    name: 'Jennifer Cruz',
    role: 'Finance Director, Emirates Solutions',
    text: 'Byteflow handles all our cybersecurity, backups and IT support. Peace of mind is priceless. Their team explains everything clearly and the pricing is very fair for what you get.',
    rating: 5,
  },
]

const CARDS_PER_PAGE = 3
const totalPages = Math.ceil(reviews.length / CARDS_PER_PAGE)

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

export default function AboutReviews() {
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
    const id = setInterval(next, 6000)
    return () => clearInterval(id)
  }, [page])

  const visible = reviews.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE)

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(44,205,222,0.06) 0%, transparent 65%)', filter: 'blur(80px)' }}
      />

      <div className="relative max-w-7xl mx-auto">

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
            <img src="/google.svg" alt="Google" className="w-8 h-8 object-contain flex-shrink-0" />
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-2xl font-black text-[var(--text-primary)] leading-none">4.9</span>
                <Stars count={5} />
              </div>
              <p className="text-[var(--text-muted)] text-xs">50+ Google reviews</p>
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
              key={r.name}
              className="group relative flex flex-col gap-4 p-6 rounded-2xl"
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
                    <div className="flex items-center gap-1.5">
                      <span className="text-[var(--text-primary)] text-sm font-bold">{r.name}</span>
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: '#1D9BF0' }}
                        title="Verified Google Review"
                      >
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-[var(--text-muted)] text-xs mt-0.5">{r.role}</p>
                  </div>
                </div>
                <img src="/google.svg" alt="Google" className="w-5 h-5 object-contain opacity-50" />
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
