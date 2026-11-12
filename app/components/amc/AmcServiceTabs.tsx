'use client'

import Image from 'next/image'
import { useEffect, useId, useRef, useState } from 'react'
import { AmcIcon } from './AmcIcon'

type Service = { title: string; description: string; image: string; alt: string }
export type ServiceGroup = { title: string; description: string; icon: string; image: string; alt: string; services: Service[] }

/** How long the pointer rests on a category before it is shown, as on the Services page's finder. */
const HOVER_DELAY = 110

/**
 * The AMC's services by category: the categories down the left (a row of
 * chips on small screens), pointed at, focused or tapped to show theirs;
 * the services of the one shown as cards beside them, each with its picture
 * when it has one. Every category's services are in the page, the others
 * hidden, so search engines read them all and the panel keeps one height.
 */
export default function AmcServiceTabs({ groups }: { groups: ServiceGroup[] }) {
  const [active, setActive] = useState(0)
  const id = useId()
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const cancel = () => clearTimeout(timer.current)
  useEffect(() => () => clearTimeout(timer.current), [])
  const current = Math.min(active, groups.length - 1)

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
      <ul className="hp-scroller -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:col-span-4 lg:mx-0 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:px-0 lg:pb-0">
        {groups.map((group, i) => {
          const on = i === current
          return (
            <li key={group.title} className="shrink-0">
              <button
                type="button"
                aria-pressed={on}
                aria-controls={`${id}-panel`}
                onClick={() => {
                  cancel()
                  setActive(i)
                }}
                onFocus={() => {
                  cancel()
                  setActive(i)
                }}
                onPointerEnter={(event) => {
                  if (event.pointerType !== 'mouse') return
                  cancel()
                  timer.current = setTimeout(() => setActive(i), HOVER_DELAY)
                }}
                onPointerLeave={cancel}
                className={`flex w-full items-center gap-3 whitespace-nowrap rounded-full border px-4 py-2.5 text-left transition-colors lg:whitespace-normal lg:rounded-2xl lg:p-4 ${
                  on
                    ? 'border-[var(--hp-accent)] bg-[var(--hp-card)] shadow-[var(--hp-shadow)]'
                    : 'border-[var(--hp-line)] bg-[var(--hp-card)] lg:border-transparent lg:bg-transparent lg:hover:bg-[var(--hp-card)]'
                }`}
              >
                <span aria-hidden="true" className={`hp-svc-icon !h-9 !w-9 lg:!h-11 lg:!w-11 ${on ? '' : 'opacity-80'}`}>
                  <AmcIcon icon={group.icon} className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[14.5px] font-semibold text-[var(--hp-ink)] lg:text-[15.5px]">{group.title}</span>
                  <span className="hidden text-[13px] text-[var(--hp-muted)] lg:block">
                    {group.services.length} {group.services.length === 1 ? 'service' : 'services'}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <div id={`${id}-panel`} aria-live="polite" className="grid lg:col-span-8">
        {groups.map((group, i) => (
          <div key={group.title} aria-hidden={i !== current} className={`[grid-area:1/1] ${i === current ? 'menu-preview-in' : 'invisible'}`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {group.image && (
                <span className="relative block h-24 w-full shrink-0 overflow-hidden rounded-2xl sm:h-20 sm:w-32">
                  <Image src={group.image} alt={group.alt} fill sizes="(min-width: 640px) 128px, 100vw" unoptimized={!group.image.startsWith("/")} className="object-cover" />
                </span>
              )}
              <div>
                <h3 className="font-display text-[1.375rem] font-semibold tracking-[-0.02em] text-[var(--hp-ink)]">{group.title}</h3>
                {group.description && <p className="mt-1 text-[15.5px] text-[var(--hp-body)]">{group.description}</p>}
              </div>
            </div>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {group.services.map((service) => (
                <li key={service.title} className="hp-band flex flex-col overflow-hidden rounded-[1.25rem]">
                  {service.image && (
                    <span className="relative block aspect-[16/9] w-full">
                      <Image src={service.image} alt={service.alt} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" unoptimized={!service.image.startsWith("/")} className="object-cover" />
                    </span>
                  )}
                  <span className="block p-5">
                    <span className="block font-display text-[1.0625rem] font-semibold leading-snug text-[var(--hp-ink)]">{service.title}</span>
                    {service.description && <span className="mt-1.5 block text-[14.5px] leading-relaxed text-[var(--hp-body)]">{service.description}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
