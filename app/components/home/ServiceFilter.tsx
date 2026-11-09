'use client'

import { useRef, useState, type ReactNode } from 'react'

type Group = { id: string; title: string; count: number }

/**
 * The tabs above the smaller service cards: all of them, or one header menu
 * group's. The cards are rendered on the server; a tab only shows or hides
 * them (each carries its group in data-group) and fades the shown ones in.
 * Without more than one group there is nothing to filter, so no tabs.
 */
export default function ServiceFilter({ allLabel, groups, total, children }: { allLabel: string; groups: Group[]; total: number; children: ReactNode }) {
  const [active, setActive] = useState('')
  const list = useRef<HTMLDivElement>(null)

  function choose(id: string) {
    setActive(id)
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    list.current?.querySelectorAll<HTMLElement>('[data-group]').forEach((card, i) => {
      const shown = !id || card.dataset.group === id
      card.hidden = !shown
      if (shown && !still) {
        card.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], {
          duration: 450,
          delay: i * 40,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'backwards',
        })
      }
    })
  }

  const tabs = [{ id: '', title: allLabel, count: total }, ...groups]

  return (
    <div ref={list}>
      {groups.length > 1 && (
        <div data-reveal className="-mx-4 mt-10 overflow-x-auto px-4 sm:mx-0 sm:px-0 lg:mt-12">
          <div className="flex w-max gap-2" role="group" aria-label={allLabel}>
            {tabs.map((tab) => (
              <button key={tab.id || 'all'} type="button" aria-pressed={active === tab.id} onClick={() => choose(tab.id)} className="hp-svc-tab">
                {tab.title}
                <span className="hp-svc-tab-count">{tab.count}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {children}
    </div>
  )
}
