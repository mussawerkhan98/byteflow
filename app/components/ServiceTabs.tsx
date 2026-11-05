'use client'

import { Fragment, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowIcon, ArrowUpRightIcon, ChevronIcon } from './InlineIcons'
import { ServiceIcon } from './ServiceIcon'
import type { ServiceTab } from '../lib/service-tabs'

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M4.5 10.5l3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * One panel, tabs from 768px and an accordion below it. Every service's panel
 * is in the server-rendered HTML; the ones not showing are hidden with CSS and
 * made inert, never left out, so search engines read every service.
 *
 * On wider screens the panels share one grid cell, so the box is always as
 * tall as the tallest service and switching tabs moves nothing below it.
 */
export default function ServiceTabs({ tabs }: { tabs: ServiceTab[] }) {
  const baseId = useId()
  const [active, setActive] = useState(0)
  // The accordion opens on the first service, like the tabs.
  const [open, setOpen] = useState<number | null>(0)
  // A panel's image is fetched once its tab has been shown, not before.
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]))
  const [narrow, setNarrow] = useState(false)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const query = matchMedia('(max-width: 767.98px)')
    const update = () => setNarrow(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const show = (index: number) => {
    setSeen((current) => (current.has(index) ? current : new Set(current).add(index)))
  }
  const select = (index: number) => {
    setActive(index)
    show(index)
  }

  function onTabKey(event: KeyboardEvent<HTMLDivElement>) {
    const last = tabs.length - 1
    const next =
      event.key === 'ArrowRight' ? (active === last ? 0 : active + 1)
      : event.key === 'ArrowLeft' ? (active === 0 ? last : active - 1)
      : event.key === 'Home' ? 0
      : event.key === 'End' ? last
      : null
    if (next === null) return
    event.preventDefault()
    select(next)
    tabRefs.current[next]?.focus()
    tabRefs.current[next]?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }

  const tabId = (i: number) => `${baseId}-tab-${i}`
  const toggleId = (i: number) => `${baseId}-toggle-${i}`
  const panelId = (i: number) => `${baseId}-panel-${i}`

  return (
    // The outline is an inset ring, not a border: a border would push the
    // padding in by 1px and the content off the header logo line.
    <div className="overflow-hidden rounded-3xl bg-[var(--bg-surface)] shadow-(--shadow-card) inset-ring inset-ring-[var(--border-default)]">
      <div
        role="tablist"
        aria-label="Our services"
        onKeyDown={onTabKey}
        className="panel-px hidden snap-x snap-mandatory gap-2 overflow-x-auto border-b border-[var(--border-default)] py-4 [scrollbar-width:none] md:flex [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab, i) => {
          const selected = active === i
          return (
            <button
              key={tab.slug}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              id={tabId(i)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId(i)}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(i)}
              className={`group relative flex min-h-[6.5rem] w-[9.5rem] shrink-0 snap-start flex-col justify-between gap-3 rounded-2xl p-3.5 text-left transition-colors duration-200 xl:w-auto xl:min-w-0 xl:flex-1 ${
                selected
                  ? 'bg-[#0f1b27] text-white'
                  : 'text-[var(--text-primary)] hover:bg-[var(--overlay-hover)]'
              }`}
            >
              <span
                aria-hidden="true"
                className={`grid h-9 w-9 place-items-center rounded-xl transition-colors ${
                  selected ? 'bg-white/10 text-[#2CCDDE]' : 'service-tab-icon bg-[rgba(44,205,222,0.12)]'
                }`}
              >
                <ServiceIcon link={tab.href} className="h-[18px] w-[18px]" />
              </span>
              <span className="text-[13.5px] font-semibold leading-snug">{tab.title}</span>
              <ArrowUpRightIcon
                className={`absolute right-3 top-3 h-3.5 w-3.5 transition-colors ${
                  selected ? 'text-[#2CCDDE]' : 'text-[var(--text-faint)] group-hover:text-[var(--text-primary)]'
                }`}
              />
            </button>
          )
        })}
      </div>

      <div className="divide-y divide-[var(--border-default)] md:grid md:divide-y-0 md:[grid-template-areas:'stack']">
        {tabs.map((tab, i) => {
          const showing = narrow ? open === i : active === i
          const loadImage = narrow ? open === i || seen.has(i) : seen.has(i)
          return (
            <Fragment key={tab.slug}>
              {/* Phones: the accordion's own button, in place of the tab row. */}
              <button
                id={toggleId(i)}
                type="button"
                aria-expanded={open === i}
                aria-controls={panelId(i)}
                onClick={() => {
                  setOpen((current) => (current === i ? null : i))
                  show(i)
                }}
                className="panel-px flex w-full items-center gap-3 py-4 text-left md:hidden"
              >
                <span aria-hidden="true" className="service-tab-icon grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[rgba(44,205,222,0.12)]">
                  <ServiceIcon link={tab.href} className="h-[18px] w-[18px]" />
                </span>
                <span className="flex-1 text-[16px] font-semibold text-[var(--text-primary)]">{tab.title}</span>
                <ChevronIcon className={`h-4 w-4 shrink-0 text-[var(--text-faint)] transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
              </button>

              <div
                id={panelId(i)}
                role={narrow ? 'region' : 'tabpanel'}
                aria-labelledby={narrow ? toggleId(i) : tabId(i)}
                inert={!showing}
                className={`panel-px pb-8 pt-2 md:py-12 md:[grid-area:stack] lg:py-14 ${active === i ? '' : 'md:invisible'} ${
                  open === i ? '' : 'max-md:hidden'
                }`}
              >
                <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-10 lg:gap-14">
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--text-nav)]">{tab.eyebrow}</p>
                    {/* The accordion button already names the service on phones. */}
                    <h3 className="mt-3 font-display text-[1.75rem] font-semibold leading-tight tracking-[-0.03em] text-[var(--text-primary)] max-md:sr-only lg:text-[2.25rem]">
                      {tab.title}
                    </h3>
                    {tab.subtitle && (
                      <p className="service-tab-icon mt-2 text-[16px] font-semibold leading-snug max-md:mt-0">{tab.subtitle}</p>
                    )}
                    <p className="mt-4 text-[15.5px] leading-relaxed text-[var(--text-body)]">{tab.text}</p>
                    {tab.bullets.length > 0 && (
                      <ul className="mt-6 grid gap-2.5 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
                        {tab.bullets.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-2.5 text-[14.5px] leading-snug text-[var(--text-primary)]">
                            <span className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[rgba(44,205,222,0.14)] text-[#0e9aa8]">
                              <CheckIcon className="h-3 w-3" />
                            </span>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                      <Link
                        href={tab.button.href}
                        className="group/cta inline-flex h-12 items-center gap-3 rounded-full bg-[#2CCDDE] pl-5 pr-1.5 text-[14.5px] font-bold text-[#04121A] transition-colors duration-200 hover:bg-[#5BDCE9]"
                      >
                        {tab.button.label}
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#04121A] text-[#2CCDDE]">
                          <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover/cta:-translate-y-px group-hover/cta:translate-x-px" />
                        </span>
                      </Link>
                      <Link
                        href={tab.href}
                        className="group/more inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-[var(--text-primary)] underline-offset-4 hover:underline"
                      >
                        Explore {tab.title}
                        <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover/more:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>

                  <figure className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#0f1b27]">
                    {tab.image ? (
                      loadImage && (
                        <Image
                          src={tab.image}
                          alt={tab.imageAlt}
                          width={960}
                          height={720}
                          loading="lazy"
                          sizes="(min-width: 1280px) 560px, (min-width: 768px) 45vw, 100vw"
                          unoptimized={!tab.image.startsWith('/')}
                          className="h-full w-full object-cover"
                        />
                      )
                    ) : (
                      // No photo uploaded yet: the service's own icon on the brand navy.
                      <div aria-hidden="true" className="absolute inset-0">
                        <div className="absolute -right-16 -top-16 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgba(44,205,222,0.28),transparent)]" />
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
                        <ServiceIcon link={tab.href} className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 text-[#2CCDDE]/80" />
                      </div>
                    )}
                    {tab.caption && (
                      <figcaption className="absolute bottom-4 left-4 max-w-[calc(100%-2rem)] rounded-full bg-[#0b1724]/85 px-3.5 py-2 text-[12.5px] font-semibold text-white backdrop-blur-sm">
                        {tab.caption}
                      </figcaption>
                    )}
                  </figure>
                </div>
              </div>
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
