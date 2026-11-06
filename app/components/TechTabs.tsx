'use client'

import { useRef, useState, type KeyboardEvent } from 'react'
import { initials, type TechTab } from '../lib/tech-stack'

/**
 * The tabs and logo grids of the Technologies section. Every panel is in the
 * page's HTML (the hidden ones with `hidden`), so each vendor name is there for
 * search engines too. Arrow keys, Home and End move between tabs, as in the
 * ARIA tabs pattern; only the open tab is in the Tab order.
 */
export default function TechTabs({ tabs }: { tabs: TechTab[] }) {
  const [active, setActive] = useState(0)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  const focus = (index: number) => {
    const next = (index + tabs.length) % tabs.length
    setActive(next)
    buttons.current[next]?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const moves: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: tabs.length - 1 }
    if (!(event.key in moves)) return
    event.preventDefault()
    focus(moves[event.key])
  }

  return (
    <div>
      {/* Scrolls sideways on phones rather than wrapping onto two lines. */}
      <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
        <div role="tablist" aria-label="Technologies" className="flex min-w-max border-b border-white/10 sm:min-w-0">
          {tabs.map((tab, index) => {
            const open = index === active
            return (
              <button
                key={tab.id}
                ref={(element) => {
                  buttons.current[index] = element
                }}
                type="button"
                role="tab"
                id={`tech-tab-${tab.id}`}
                aria-selected={open}
                aria-controls={`tech-panel-${tab.id}`}
                tabIndex={open ? 0 : -1}
                onClick={() => setActive(index)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className={`relative -mb-px shrink-0 px-4 py-3.5 text-[14.5px] font-semibold transition-colors duration-200 sm:flex-1 sm:px-2 ${open ? 'text-white' : 'text-[#8da0b3] hover:text-white'}`}
              >
                {tab.title}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-0.5 origin-center bg-[#2CCDDE] transition-transform duration-300 motion-reduce:transition-none ${open ? 'scale-x-100' : 'scale-x-0'}`}
                />
              </button>
            )
          })}
        </div>
      </div>

      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          id={`tech-panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`tech-tab-${tab.id}`}
          hidden={index !== active}
          tabIndex={0}
          className="about-preview-in pt-6"
        >
          {tab.description && <p className="text-[15px] leading-relaxed text-[#a9b6c4]">{tab.description}</p>}
          <ul className={`grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 ${tab.description ? 'mt-5' : ''}`}>
            {tab.logos.map((item, logoIndex) => (
              <li
                key={`${logoIndex}-${item.name}`}
                className="flex min-h-[7.5rem] flex-col items-center justify-center gap-3 rounded-2xl bg-[#eaf6f8] px-3 py-5 text-center text-[#0f1b27] transition-transform duration-300 hover:-translate-y-0.5 motion-reduce:transition-none sm:min-h-[8.25rem]"
              >
                {item.logo ? (
                  // Uploaded logos are SVG or small WebP files, shown as they are.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.logo} alt="" width={120} height={40} loading="lazy" decoding="async" className="h-10 w-auto max-w-[75%] object-contain" />
                ) : (
                  <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-xl bg-[#0f1b27] font-display text-[13px] font-semibold tracking-wide text-[#2CCDDE]">
                    {initials(item.name)}
                  </span>
                )}
                <span className="text-[13.5px] font-medium leading-snug">{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
