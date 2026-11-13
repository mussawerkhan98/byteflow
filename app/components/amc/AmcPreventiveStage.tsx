'use client'

import Image from 'next/image'
import { unoptimizedSrc } from '../../lib/image-src'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'

type Item = { title: string; description: string; image: string; alt: string }

/** How long the pointer rests on a step before it is shown, as on the service finder. */
const HOVER_DELAY = 110

/**
 * Preventive maintenance: one picture stage beside the steps. Pointing at,
 * focusing or tapping a step shows its picture with its caption on the
 * stage and opens its text; a step without a picture keeps the one before
 * it, so the stage is never empty. Every step's text is in the page.
 */
export default function AmcPreventiveStage({ items, heading }: { items: Item[]; heading: ReactNode }) {
  const [active, setActive] = useState(0)
  const id = useId()
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const cancel = () => clearTimeout(timer.current)
  useEffect(() => () => clearTimeout(timer.current), [])

  // Each picture once, and which one each step shows.
  const pictures = [...new Set(items.map((item) => item.image).filter(Boolean))]
  const pictureOf = items.map((_, i) => {
    for (let j = i; j >= 0; j--) if (items[j].image) return pictures.indexOf(items[j].image)
    return 0
  })
  const current = Math.min(active, items.length - 1)
  const total = String(items.length).padStart(2, '0')
  const show = (i: number) => {
    cancel()
    setActive(i)
  }

  return (
    // The heading first on small screens; beside the picture, above the steps, on large ones.
    <div className="grid gap-8 lg:grid-cols-12 lg:grid-rows-[auto_auto] lg:content-center lg:gap-x-14 lg:gap-y-0">
      <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:self-end">{heading}</div>
      <figure data-reveal className="hp-frame relative isolate aspect-[16/11] overflow-hidden rounded-[1.75rem] lg:col-span-7 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:aspect-[5/4] lg:max-h-[520px] lg:w-full lg:self-center">
        {pictures.map((src, p) => {
          const owner = items.find((item) => item.image === src)
          return (
            <span key={src} aria-hidden={p !== pictureOf[current]} className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-out ${p === pictureOf[current] ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0'}`}>
              <Image src={src} alt={owner?.alt ?? ''} fill sizes="(min-width: 1024px) 55vw, 100vw" unoptimized={unoptimizedSrc(src)} className="object-cover" />
            </span>
          )
        })}
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent" />
        <figcaption aria-hidden="true" className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/25 bg-white/85 p-4 shadow-lg backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:max-w-sm sm:p-5">
          <span className="flex items-center justify-between font-display text-[12.5px] font-semibold tabular-nums text-[var(--hp-accent)]">
            <span>
              {String(current + 1).padStart(2, '0')} / {total}
            </span>
            <span aria-hidden="true" className="flex gap-1">
              {items.map((item, i) => (
                <span key={item.title} className={`h-1 rounded-full transition-all duration-500 ${i === current ? 'w-6 bg-[var(--hp-accent)]' : 'w-2.5 bg-slate-300'}`} />
              ))}
            </span>
          </span>
          <span className="mt-1.5 block font-display text-[1.0625rem] font-semibold leading-snug text-slate-900">{items[current].title}</span>
        </figcaption>
      </figure>

      <div className="lg:col-span-5 lg:col-start-8 lg:row-start-2 lg:self-start">
        <ol className="border-l border-[var(--hp-line)] lg:mt-8">
          {items.map((item, i) => {
            const on = i === current
            return (
              <li
                key={item.title}
                className="group relative py-3.5 pl-5 sm:pl-6"
                onPointerEnter={(event) => {
                  if (event.pointerType !== 'mouse') return
                  cancel()
                  timer.current = setTimeout(() => setActive(i), HOVER_DELAY)
                }}
                onPointerLeave={cancel}
              >
                <span aria-hidden="true" className={`absolute -left-px top-0 w-0.5 bg-[var(--hp-accent)] transition-all duration-500 ${on ? 'h-full' : 'h-0'}`} />
                <h3>
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={`${id}-step-${i}`}
                    onClick={() => show(i)}
                    onFocus={() => show(i)}
                    className="flex w-full items-baseline gap-4 text-left"
                  >
                    <span aria-hidden="true" className={`font-display text-[13px] font-semibold tabular-nums transition-colors ${on ? 'text-[var(--hp-accent)]' : 'text-[var(--hp-muted)]'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`font-display text-[1.125rem] font-semibold leading-snug tracking-[-0.01em] transition-colors ${on ? 'text-[var(--hp-ink)]' : 'text-[var(--hp-body)] group-hover:text-[var(--hp-ink)]'}`}>{item.title}</span>
                  </button>
                </h3>
                {item.description && (
                  <div id={`${id}-step-${i}`} className={`grid pl-[2.4rem] transition-[grid-template-rows,opacity] duration-500 ease-out ${on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <p className="pt-2 text-[15px] leading-relaxed text-[var(--hp-body)]">{item.description}</p>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
