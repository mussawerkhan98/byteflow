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

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4" viewBox="0 0 24 24" fill="#FBBF24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export default function Reviews() {
  const [active, setActive] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right'>('right')

  const go = useCallback((index: number, dir: 'left' | 'right') => {
    if (animating) return
    setDirection(dir)
    setAnimating(true)
    setTimeout(() => {
      setActive(index)
      setAnimating(false)
    }, 280)
  }, [animating])

  const prev = () => go((active - 1 + reviews.length) % reviews.length, 'left')
  const next = () => go((active + 1) % reviews.length, 'right')

  useEffect(() => {
    const id = setInterval(() => next(), 5000)
    return () => clearInterval(id)
  }, [active])

  const r = reviews[active]

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(44,205,222,0.07) 0%, transparent 65%)', filter: 'blur(80px)' }}
      />

      <div className="relative max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-16">
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5 uppercase tracking-widest"
              style={{ background: 'rgba(44,205,222,0.07)', border: '1px solid rgba(44,205,222,0.25)', color: '#2CCDDE' }}
            >
              Client Reviews
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
              <span className="text-white">Trusted by Businesses</span>
              <br />
              <span style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Across the UAE
              </span>
            </h2>
          </div>

          {/* Google rating */}
          <div
            className="flex items-center gap-4 px-6 py-4 rounded-2xl flex-shrink-0 self-start"
            style={{
              background: 'linear-gradient(160deg, rgba(44,205,222,0.07) 0%, #050F18 100%)',
              border: '1px solid rgba(44,205,222,0.18)',
            }}
          >
            <img src="/google.svg" alt="Google" className="w-9 h-9 object-contain flex-shrink-0" />
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-2xl font-black text-white leading-none">4.9</span>
                <Stars count={5} />
              </div>
              <p className="text-[#5A6272] text-xs">50+ Google reviews</p>
            </div>
          </div>
        </div>

        {/* Slider card */}
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, rgba(44,205,222,0.07) 0%, rgba(70,163,225,0.02) 40%, #050F18 100%)',
            border: '1px solid rgba(44,205,222,0.18)',
          }}
        >
          {/* Top shimmer */}
          <div
            className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(44,205,222,0.5), transparent)' }}
          />

          <div className="px-8 sm:px-16 py-14 sm:py-16">

            {/* Large quote mark */}
            <div
              className="text-[96px] font-black leading-none mb-4 select-none"
              style={{
                background: 'linear-gradient(135deg, rgba(44,205,222,0.25), rgba(70,163,225,0.1))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 0.8,
              }}
            >
              &ldquo;
            </div>

            {/* Review text */}
            <div
              className="transition-all duration-280"
              style={{
                opacity: animating ? 0 : 1,
                transform: animating
                  ? `translateX(${direction === 'right' ? '-24px' : '24px'})`
                  : 'translateX(0)',
                transition: 'opacity 0.28s ease, transform 0.28s ease',
              }}
            >
              <p className="text-white text-xl sm:text-2xl font-medium leading-relaxed mb-10" style={{ letterSpacing: '-0.01em' }}>
                {r.text}
              </p>

              {/* Reviewer info */}
              <div className="flex items-center justify-between gap-6 flex-wrap">
                <div className="flex items-center gap-4">
                  <div
                    className="w-[3px] self-stretch rounded-full flex-shrink-0 min-h-[40px]"
                    style={{ background: 'linear-gradient(180deg, #2CCDDE, #46A3E1)' }}
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-bold text-base">{r.name}</span>
                      {/* Verified */}
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
                    <p className="text-[#5A6272] text-sm">{r.role}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Stars count={r.rating} />
                  <div className="flex items-center gap-1.5">
                    <img src="/google.svg" alt="Google" className="w-4 h-4 object-contain opacity-50" />
                    <span className="text-xs text-[#374151] font-medium">Posted on Google</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-8">

          {/* Dots */}
          <div className="flex items-center gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i, i > active ? 'right' : 'left')}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === active ? '28px' : '8px',
                  height: '8px',
                  background: i === active
                    ? 'linear-gradient(90deg, #2CCDDE, #46A3E1)'
                    : 'rgba(44,205,222,0.2)',
                }}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              className="group w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_20px_rgba(44,205,222,0.35)]"
              style={{
                background: 'rgba(44,205,222,0.06)',
                border: '1px solid rgba(44,205,222,0.2)',
                color: '#2CCDDE',
              }}
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
              className="group w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_20px_rgba(44,205,222,0.35)]"
              style={{
                background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)',
                color: '#000',
                border: '1px solid transparent',
              }}
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
