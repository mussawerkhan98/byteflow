'use client'

import { useState } from 'react'
import type { AboutReason } from '../lib/about-reasons'
import AboutPreview from './AboutPreview'
import { ArrowUpRightIcon } from './InlineIcons'

/** Matches Tailwind's lg: the width from which the preview card sits beside the list. */
const WIDE = '(min-width: 1024px)'
const isWide = () => window.matchMedia(WIDE).matches

/**
 * The numbered reasons and their preview. On wide screens the list sits on the
 * right and the light card on the left shows the reason under the pointer or
 * the last one clicked. On phones each reason opens like an accordion, with
 * the same card inside it. Each button says which reason is open with
 * aria-expanded, and points at both places its content can appear.
 */
export default function AboutReasons({ reasons }: { reasons: AboutReason[] }) {
  // null only on phones, once the open reason is closed again.
  const [active, setActive] = useState<number | null>(0)
  const shown = reasons[active ?? 0]

  const choose = (index: number) => setActive((current) => (isWide() || current !== index ? index : null))

  return (
    <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:items-start lg:gap-16">
      <div id="about-preview" className="hidden lg:sticky lg:top-28 lg:col-span-5 lg:block">
        {/* Keyed so each reason fades in afresh. */}
        <div key={shown.number} className="about-preview-in">
          <AboutPreview reason={shown} />
        </div>
      </div>

      <ol className="border-t border-white/10 lg:col-span-7">
        {reasons.map((reason, index) => {
          const open = index === active
          return (
            <li key={reason.number} className="relative border-b border-white/10">
              {/* The open reason's line turns cyan. */}
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 -bottom-px h-px origin-left bg-[#2CCDDE] transition-transform duration-500 motion-reduce:transition-none ${open ? 'scale-x-100' : 'scale-x-0'}`}
              />
              <h3>
                <button
                  type="button"
                  id={`about-reason-${index}`}
                  aria-expanded={open}
                  aria-controls={`about-preview about-panel-${index}`}
                  onClick={() => choose(index)}
                  onMouseEnter={() => isWide() && setActive(index)}
                  className="group flex w-full items-center gap-5 py-6 text-left sm:gap-8 lg:py-8"
                >
                  <span
                    className={`font-display text-[14px] font-semibold tabular-nums transition-colors duration-300 ${open ? 'text-[#2CCDDE]' : 'text-white/70 group-hover:text-white/90'}`}
                  >
                    {reason.number}
                  </span>
                  <span
                    className={`flex-1 text-balance font-display text-[1.375rem] font-semibold leading-tight tracking-[-0.02em] transition-colors duration-300 sm:text-[1.75rem] lg:text-[2rem] ${open ? 'text-[#2CCDDE]' : 'text-white'}`}
                  >
                    {reason.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${open ? 'border-[#2CCDDE] bg-[#2CCDDE] text-[#04121A]' : 'border-white/20 text-white group-hover:border-white/50'}`}
                  >
                    <ArrowUpRightIcon className={`h-4 w-4 transition-transform duration-300 motion-reduce:transition-none ${open ? 'max-lg:rotate-90' : ''}`} />
                  </span>
                </button>
              </h3>
              {/* Phones: the reason's card opens under its button. */}
              <div id={`about-panel-${index}`} role="region" aria-labelledby={`about-reason-${index}`} hidden={!open} className="pb-7 lg:hidden">
                <AboutPreview reason={reason} compact />
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
