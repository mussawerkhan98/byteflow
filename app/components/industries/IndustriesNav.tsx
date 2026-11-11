'use client'

import { useEffect, useState } from 'react'
import { IndustryIcon } from './IndustryIcon'

export type NavIndustry = { anchor: string; title: string; icon: string }

/**
 * The list of industries beside the page on wide screens, staying in view
 * and marking the one being read; a row of chips above them on smaller
 * screens. Each is a jump to its industry. Without JavaScript the links
 * still jump; only the marking needs it.
 */
export default function IndustriesNav({ industries, label }: { industries: NavIndustry[]; label: string }) {
  const [current, setCurrent] = useState(industries[0]?.anchor ?? '')

  useEffect(() => {
    const sections = industries.map((industry) => document.getElementById(industry.anchor)).filter((el): el is HTMLElement => Boolean(el))
    // The industry crossing a band a little below the header is the one being read.
    const observer = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((entry) => entry.isIntersecting)
        if (seen.length) setCurrent(seen[0].target.id)
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [industries])

  return (
    <nav aria-label={label}>
      <p className="hp-eyebrow hidden lg:block">{label}</p>
      <ul className="hp-scroller -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:mt-4 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0">
        {industries.map((industry) => {
          const on = industry.anchor === current
          return (
            <li key={industry.anchor} className="shrink-0">
              <a
                href={`#${industry.anchor}`}
                aria-current={on ? 'location' : undefined}
                className={`flex items-center gap-2.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-[14px] font-medium transition-colors lg:whitespace-normal lg:rounded-xl lg:px-3 lg:py-2.5 lg:text-[15px] ${
                  on
                    ? 'border-[var(--hp-accent)] bg-[var(--hp-card)] text-[var(--hp-ink)] lg:shadow-[var(--hp-shadow-sm)]'
                    : 'border-[var(--hp-line)] bg-[var(--hp-card)] text-[var(--hp-body)] hover:text-[var(--hp-ink)] lg:border-transparent lg:bg-transparent lg:hover:bg-[var(--hp-card)]'
                }`}
              >
                <IndustryIcon icon={industry.icon} className={`h-[18px] w-[18px] shrink-0 ${on ? 'text-[var(--hp-accent)]' : 'text-[var(--hp-muted)]'}`} />
                {industry.title}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
