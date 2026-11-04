'use client'

import { useState, type KeyboardEvent } from 'react'
import { ArrowIcon } from './InlineIcons'

// Each step's timing and points are taken from its own description, so the
// explorer never promises more than the copy does.
const steps = [
  {
    num: '01',
    title: 'Free consultation',
    when: 'Your first call',
    desc: 'Reach out by phone, WhatsApp or the contact form. We listen to your setup, team size and pain points — no jargon, no sales pressure.',
    points: ['Phone, WhatsApp or form', 'Your setup and team size', 'No sales pressure'],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Custom proposal',
    when: 'Within 24 hours',
    desc: 'Within 24 hours you receive a clear, itemised proposal — scope, timeline and fixed pricing. No hidden costs, no vague estimates.',
    points: ['Itemised scope', 'Clear timeline', 'Fixed pricing'],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Onboarding & setup',
    when: 'On-site or remote',
    desc: 'Our certified engineers arrive on-site or connect remotely. We configure your network, servers, cloud or software with zero disruption to your workday.',
    points: ['Network & servers', 'Cloud & software', 'No disruption to your day'],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Testing & handover',
    when: 'Before sign-off',
    desc: 'Everything is tested end-to-end before we hand over. We walk your team through what was done, answer every question and make sure you are 100% comfortable.',
    points: ['End-to-end testing', 'Team walkthrough', 'Every question answered'],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
  {
    num: '05',
    title: 'Ongoing support',
    when: '24/7, for as long as you need',
    desc: 'We monitor your systems 24/7 and fix issues before they affect your business. One call or message and our engineers are on it — on-site within 2 hours.',
    points: ['24/7 monitoring', 'Issues fixed early', 'On-site within 2 hours'],
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
]

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Points({ points }: { points: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {points.map((point) => (
        <li
          key={point}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--bg-page)] px-3.5 py-1.5 text-[13.5px] font-medium text-[var(--text-primary)]"
        >
          <span className="process-accent">
            <CheckIcon />
          </span>
          {point}
        </li>
      ))}
    </ul>
  )
}

export default function HowItWorks() {
  const [active, setActive] = useState(0)
  // Hovering or focusing the explorer pauses the auto-advance; choosing a
  // step stops it for good, so the visitor stays where they put it.
  const [paused, setPaused] = useState(false)
  const [stopped, setStopped] = useState(false)
  const step = steps[active]

  const choose = (index: number) => {
    const next = (index + steps.length) % steps.length
    setActive(next)
    setStopped(true)
    return next
  }

  // Arrow keys, Home and End move between steps, as in any tab list.
  const onTabKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const targets: Record<string, number> = {
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: steps.length - 1,
    }
    if (!(event.key in targets)) return
    event.preventDefault()
    const next = choose(targets[event.key])
    document.getElementById(`process-tab-${next}`)?.focus()
  }

  return (
    <section className="home-process py-20 sm:py-24 lg:py-32">
      {/* Same container as the header, so the edges sit under the logo and
          the Contact button. */}
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <p className="mb-6 flex items-center gap-3 text-[13px] font-medium text-[var(--text-body)]">
              <span aria-hidden="true" className="h-px w-10 bg-[#2CCDDE]" />
              Our process
            </p>
            <h2 className="text-balance text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl lg:text-[3.5rem]">
              From first call
              <span className="block text-[var(--ink-soft)]">to full delivery.</span>
            </h2>
          </div>
          <p className="max-w-md text-[17px] leading-relaxed text-[var(--text-body)] lg:col-span-5 lg:justify-self-end">
            A simple, transparent process so you always know exactly where things stand.
          </p>
        </div>

        {/* Desktop: pick a step on the left, read it on the right. */}
        <div
          className="mt-20 hidden gap-10 lg:grid lg:grid-cols-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div
            role="tablist"
            aria-label="Our process"
            aria-orientation="vertical"
            onKeyDown={onTabKey}
            className="border-t border-[var(--border-default)] lg:col-span-5"
          >
            {steps.map((s, i) => {
              const selected = i === active
              return (
                <button
                  key={s.num}
                  type="button"
                  role="tab"
                  id={`process-tab-${i}`}
                  aria-selected={selected}
                  aria-controls="process-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => choose(i)}
                  className="group relative grid w-full grid-cols-[2.75rem_1fr] items-center gap-4 border-b border-[var(--border-default)] py-6 pl-7 pr-2 text-left"
                >
                  {/* Rail on the left edge; the active step fills it while it waits. */}
                  <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px] bg-[var(--border-default)]">
                    {selected && (
                      <span
                        key={active}
                        className={`absolute inset-x-0 top-0 bg-[#2CCDDE] ${stopped ? 'h-full' : 'process-fill'}`}
                        style={{ animationPlayState: paused ? 'paused' : 'running' }}
                        onAnimationEnd={() => setActive((current) => (current + 1) % steps.length)}
                      />
                    )}
                  </span>
                  <span
                    className={`font-display text-[15px] font-semibold tabular-nums transition-colors duration-300 ${
                      selected ? 'process-accent' : 'text-[var(--text-nav)]'
                    }`}
                  >
                    {s.num}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block font-display text-[1.375rem] font-semibold tracking-[-0.02em] transition-colors duration-300 ${
                        selected ? 'text-[var(--text-primary)]' : 'text-[var(--ink-soft)] group-hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {s.title}
                    </span>
                    <span className="mt-1 block text-[13px] text-[var(--text-body)]">{s.when}</span>
                  </span>
                </button>
              )
            })}
          </div>

          <div
            role="tabpanel"
            id="process-panel"
            aria-labelledby={`process-tab-${active}`}
            className="relative isolate flex min-h-[30rem] flex-col overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-10 shadow-(--shadow-card) lg:col-span-7 xl:p-12"
          >
            {/* Rings around the step's icon, top right. */}
            <svg aria-hidden="true" viewBox="0 0 240 240" className="pointer-events-none absolute -right-16 -top-16 -z-10 h-72 w-72">
              <circle cx="120" cy="120" r="62" fill="none" stroke="var(--border-default)" />
              <circle cx="120" cy="120" r="88" fill="none" stroke="rgba(44,205,222,0.4)" strokeDasharray="2 6" />
              <circle cx="120" cy="120" r="116" fill="none" stroke="var(--border-default)" />
            </svg>
            <span
              aria-hidden="true"
              className="absolute right-12 top-12 grid h-16 w-16 place-items-center rounded-full bg-[#2CCDDE] text-[#04121A] shadow-[0_12px_30px_-10px_rgba(44,205,222,0.7)]"
            >
              {step.icon}
            </span>

            <div key={active} className="process-panel-in flex flex-1 flex-col">
              <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-[var(--text-nav)]">
                Step {step.num} of {String(steps.length).padStart(2, '0')}
              </p>
              <p className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--bg-page)] px-3 py-1 text-[12.5px] font-medium text-[var(--text-primary)]">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#2CCDDE]" />
                {step.when}
              </p>
              <h3 className="mt-6 max-w-md font-display text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--text-primary)] xl:text-[2.75rem]">
                {step.title}
              </h3>
              <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[var(--text-body)]">{step.desc}</p>
              <div className="mt-8">
                <Points points={step.points} />
              </div>
            </div>

            <div className="mt-10 flex items-center justify-between border-t border-[var(--border-default)] pt-6">
              <span aria-hidden="true" className="flex gap-1.5">
                {steps.map((s, i) => (
                  <span
                    key={s.num}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'w-8 bg-[#2CCDDE]' : 'w-1.5 bg-[var(--border-strong)]'}`}
                  />
                ))}
              </span>
              <span className="flex gap-2">
                <button
                  type="button"
                  onClick={() => choose(active - 1)}
                  aria-label="Previous step"
                  className="grid h-11 w-11 place-items-center rounded-full border border-[var(--border-strong)] text-[var(--text-primary)] transition-colors duration-200 hover:border-[#2CCDDE] hover:bg-[#2CCDDE] hover:text-[#04121A]"
                >
                  <ArrowIcon className="h-4 w-4 rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => choose(active + 1)}
                  aria-label="Next step"
                  className="grid h-11 w-11 place-items-center rounded-full border border-[var(--border-strong)] text-[var(--text-primary)] transition-colors duration-200 hover:border-[#2CCDDE] hover:bg-[#2CCDDE] hover:text-[#04121A]"
                >
                  <ArrowIcon className="h-4 w-4" />
                </button>
              </span>
            </div>
          </div>
        </div>

        {/* Phones and tablets: every step, one after another. */}
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:hidden">
          {steps.map((s, i) => (
            <li
              key={s.num}
              className={`flex flex-col rounded-3xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 shadow-(--shadow-card) ${
                i === steps.length - 1 ? 'sm:col-span-2' : ''
              }`}
            >
              <span className="flex items-center justify-between gap-4">
                <span
                  aria-hidden="true"
                  className="grid h-12 w-12 place-items-center rounded-full bg-[#2CCDDE] text-[#04121A]"
                >
                  {s.icon}
                </span>
                <span className="font-display text-[15px] font-semibold tabular-nums text-[var(--text-nav)]">
                  {s.num} / {String(steps.length).padStart(2, '0')}
                </span>
              </span>
              <p className="mt-6 text-[12.5px] font-medium text-[var(--text-body)]">{s.when}</p>
              <h3 className="mt-1 font-display text-[1.5rem] font-semibold tracking-[-0.025em] text-[var(--text-primary)]">
                {s.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-body)]">{s.desc}</p>
              <div className="mt-6">
                <Points points={s.points} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
