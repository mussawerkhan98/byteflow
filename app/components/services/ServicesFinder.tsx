'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'
import { ServiceIcon } from '../ServiceIcon'
import { ArrowRight } from '../home/ui'

export type FinderService = {
  slug: string
  href: string
  title: string
  subtitle: string
}
export type FinderSituation = {
  title: string
  description: string
  services: FinderService[]
}

/** How long the pointer rests on a situation before it is shown, so passing over one on the way to the panel doesn't. */
const HOVER_DELAY = 110

/**
 * "Not sure where to start?": the situations down the left (chips on small
 * screens), and beside them the one pointed at, focused or tapped, with the
 * services that answer it. The first situation is shown to begin with, so
 * the panel is never empty and works the same without JavaScript.
 */
export default function ServicesFinder({ situations, resultLabel }: { situations: FinderSituation[]; resultLabel: string }) {
  const [active, setActive] = useState(0)
  const id = useId()
  const current = situations[Math.min(active, situations.length - 1)]
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const cancel = () => clearTimeout(timer.current)
  const pick = (index: number) => {
    cancel()
    setActive(index)
  }
  const rest = (index: number) => {
    cancel()
    timer.current = setTimeout(() => setActive(index), HOVER_DELAY)
  }
  useEffect(() => cancel, [])

  return (
    <div className="hp-band grid overflow-hidden rounded-[1.5rem] lg:grid-cols-12">
      <ul className="flex flex-wrap gap-2 p-4 sm:p-5 lg:col-span-5 lg:flex-col lg:gap-1 lg:border-r lg:border-[var(--hp-line)] lg:p-4">
        {situations.map((situation, i) => {
          const on = situation === current
          return (
            <li key={situation.title} className="lg:w-full">
              <button
                type="button"
                aria-pressed={on}
                aria-controls={`${id}-result`}
                onClick={() => pick(i)}
                onFocus={() => pick(i)}
                // A mouse only: a tap is already the click.
                onPointerEnter={(event) => event.pointerType === 'mouse' && rest(i)}
                onPointerLeave={cancel}
                className={`flex items-center gap-3 rounded-full border px-4 py-2 text-left text-[14px] font-medium transition-colors lg:w-full lg:rounded-xl lg:px-4 lg:py-3.5 lg:text-[15.5px] ${
                  on
                    ? 'border-[var(--hp-accent)] bg-[var(--hp-soft)] text-[var(--hp-ink)]'
                    : 'border-[var(--hp-line)] text-[var(--hp-body)] hover:border-[var(--hp-line-strong)] hover:text-[var(--hp-ink)] lg:border-transparent lg:hover:bg-[var(--hp-soft)]'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`hidden font-display text-[12.5px] font-semibold tabular-nums lg:inline ${on ? 'text-[var(--hp-accent)]' : 'text-[var(--hp-muted)]'}`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1">{situation.title}</span>
                <ArrowRight className={`hidden h-4 w-4 shrink-0 transition-transform lg:block ${on ? 'translate-x-0 text-[var(--hp-accent)]' : '-translate-x-1 opacity-0'}`} />
              </button>
            </li>
          )
        })}
      </ul>

      {/* Every situation's answer in the same cell, only the one shown
          visible: the panel keeps the height of the tallest, so the page
          never shifts under the pointer as it moves down the list. */}
      <div id={`${id}-result`} aria-live="polite" className="grid bg-[var(--hp-soft)] p-6 sm:p-8 lg:col-span-7 lg:p-10">
        {situations.map((situation) => (
          <div key={situation.title} aria-hidden={situation !== current} className={`[grid-area:1/1] ${situation === current ? 'menu-preview-in' : 'invisible'}`}>
            <p className="hp-eyebrow">{resultLabel}</p>
            <h3 className="mt-3 font-display text-[1.375rem] font-semibold leading-snug tracking-[-0.02em] text-[var(--hp-ink)] sm:text-[1.625rem]">{situation.title}</h3>
            {situation.description && <p className="mt-2 max-w-xl text-[15.5px] leading-relaxed text-[var(--hp-body)]">{situation.description}</p>}
            <ul className="mt-6 grid gap-3">
              {situation.services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={service.href}
                    className="group/svc flex items-center gap-4 rounded-xl border border-[var(--hp-line)] bg-[var(--hp-card)] p-4 transition-colors hover:border-[var(--hp-accent)]"
                  >
                    <span aria-hidden="true" className="hp-svc-icon">
                      <ServiceIcon link={service.href} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-[16px] font-semibold text-[var(--hp-ink)]">{service.title}</span>
                      {service.subtitle && <span className="mt-0.5 block text-[14px] leading-snug text-[var(--hp-body)]">{service.subtitle}</span>}
                    </span>
                    <span className="hp-round-arrow !h-10 !w-10 group-hover/svc:border-[var(--hp-accent)] group-hover/svc:bg-[var(--hp-accent)] group-hover/svc:text-white">
                      <ArrowRight />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
