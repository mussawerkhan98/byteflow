'use client'

import { useState } from 'react'

type FAQ = { q: string; a: string; category?: string }

export default function ServiceFAQ({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(0)
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', ...Array.from(new Set(faqs.map((f) => f.category).filter((c): c is string => Boolean(c))))]
  const showFilters = categories.length > 2
  const filtered = activeCategory === 'All' ? faqs : faqs.filter((f) => f.category === activeCategory)

  return (
    <div>
      {showFilters && (
        <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat)
                setOpen(null)
              }}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
              style={
                activeCategory === cat
                  ? { background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)', color: '#000' }
                  : { background: 'rgba(44,205,222,0.06)', border: '1px solid rgba(44,205,222,0.18)', color: 'var(--text-muted)' }
              }
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {filtered.map((faq, i) => {
          const isOpen = open === i
          return (
            <div
              key={faq.q}
              className="card-hover rounded-2xl overflow-hidden transition-all duration-300"
              style={{
                background: isOpen
                  ? 'linear-gradient(160deg, rgba(44,205,222,0.08) 0%, rgba(70,163,225,0.03) 40%, var(--bg-surface) 100%)'
                  : 'linear-gradient(160deg, rgba(44,205,222,0.04) 0%, var(--bg-page) 100%)',
                border: isOpen ? '1px solid rgba(44,205,222,0.3)' : '1px solid rgba(44,205,222,0.1)',
              }}
            >
              <button
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span
                  className="text-sm font-semibold leading-snug transition-colors duration-200 flex-1 min-w-0"
                  style={{ color: isOpen ? 'var(--text-primary)' : 'var(--text-nav)' }}
                >
                  {faq.q}
                </span>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{
                    background: isOpen ? 'linear-gradient(135deg, #2CCDDE, #46A3E1)' : 'rgba(44,205,222,0.08)',
                    border: isOpen ? 'none' : '1px solid rgba(44,205,222,0.2)',
                  }}
                >
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-300"
                    style={{
                      color: isOpen ? '#000' : '#2CCDDE',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
              </button>

              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: isOpen ? '400px' : '0px', opacity: isOpen ? 1 : 0 }}
              >
                <div className="px-6 pb-6" style={{ borderTop: '1px solid rgba(44,205,222,0.08)' }}>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed pt-5">{faq.a}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
