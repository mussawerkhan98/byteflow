'use client'

import { useRef, useState, type KeyboardEvent } from 'react'
import { initials, tabIcon, type TechTab } from '../lib/tech-stack'

const iconPaths: Record<ReturnType<typeof tabIcon>, string> = {
  microsoft: 'M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z',
  shield: 'M12 3l7.5 3v5.25c0 4.5-3.15 8.25-7.5 9.75-4.35-1.5-7.5-5.25-7.5-9.75V6L12 3zm-3 9l2 2 4-4.5',
  network: 'M12 18.75h.01M8.6 15.4a4.8 4.8 0 016.8 0M5.2 12a9.6 9.6 0 0113.6 0M1.9 8.6a14.4 14.4 0 0120.2 0',
  backup: 'M20 7c0 1.66-3.58 3-8 3S4 8.66 4 7m16 0c0-1.66-3.58-3-8-3S4 5.34 4 7m16 0v10c0 1.66-3.58 3-8 3s-8-1.34-8-3V7m16 5c0 1.66-3.58 3-8 3s-8-1.34-8-3',
  cloud: 'M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.33-7.26 3 3 0 00-3.76-3.85 5.25 5.25 0 00-10.23 2.33A4.5 4.5 0 002.25 15z',
  code: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5',
  layers: 'M12 3l9 4.5-9 4.5-9-4.5L12 3zM3 12l9 4.5 9-4.5M3 16.5l9 4.5 9-4.5',
}

function TabIcon({ title, className }: { title: string; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={iconPaths[tabIcon(title)]} />
    </svg>
  )
}

/**
 * The tabs and logo grids of the Technologies section, in a glass panel.
 * Every panel is in the page's HTML (the hidden ones with `hidden`), so each
 * vendor name is there for search engines too. Arrow keys, Home and End move
 * between tabs, as in the ARIA tabs pattern; only the open tab is in the Tab
 * order.
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
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-2.5 shadow-[0_40px_90px_-50px_rgba(0,0,0,0.8)] backdrop-blur-sm sm:p-3">
      {/* Scrolls sideways on phones rather than wrapping onto two lines. */}
      <div className="overflow-x-auto rounded-[1.4rem] bg-black/25 p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div role="tablist" aria-label="Technologies" className="flex min-w-max gap-1 sm:min-w-0">
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
                className={`flex shrink-0 items-center justify-center gap-2 rounded-[1.1rem] px-4 py-3 text-[14px] font-semibold transition-colors duration-200 sm:flex-1 ${
                  open ? 'bg-[#2CCDDE] text-[#04121A] shadow-[0_10px_24px_-12px_rgba(44,205,222,0.8)]' : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <TabIcon title={tab.title} className="h-4 w-4" />
                {tab.title}
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
          className="about-preview-in px-2 pb-3 pt-5 sm:px-4 sm:pb-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            {tab.description && <p className="text-[15px] leading-relaxed text-[#c3cfdb]">{tab.description}</p>}
            <p className="rounded-full border border-white/10 px-3 py-1 text-[12px] font-medium tabular-nums text-[#8da0b3]">
              {tab.logos.length} {tab.logos.length === 1 ? 'platform' : 'platforms'}
            </p>
          </div>
          <ul className="mt-5 grid grid-cols-2 gap-2.5 xl:grid-cols-3">
            {tab.logos.map((item, logoIndex) => (
              <li
                key={`${logoIndex}-${item.name}`}
                className="group flex flex-col items-start gap-3 rounded-2xl sm:flex-row sm:items-center sm:gap-3.5 border border-white/[0.08] bg-white/[0.04] p-3 transition-[transform,border-color,background-color] duration-300 hover:-translate-y-0.5 hover:border-[#2CCDDE]/40 hover:bg-white/[0.07] motion-reduce:transition-none"
              >
                {item.logo ? (
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white p-2">
                    {/* Uploaded logos are SVG or small WebP files, shown as they are. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.logo} alt="" width={40} height={40} loading="lazy" decoding="async" className="h-full w-full object-contain" />
                  </span>
                ) : (
                  <span
                    aria-hidden="true"
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[linear-gradient(140deg,#2CCDDE,#46A3E1)] font-display text-[15px] font-semibold tracking-wide text-[#04121A] transition-transform duration-300 group-hover:scale-105"
                  >
                    {initials(item.name)}
                  </span>
                )}
                <span className="min-w-0 text-[14.5px] font-semibold leading-snug text-white">{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
