import type { CSSProperties, ReactNode } from 'react'
import Image from 'next/image'
import { lines, pictureOf, type HomeBlock } from '../lib/home-content'

// Step icons, by position: chat, document, screen, check, shield. The words
// come from the admin panel ("Home page sections" → How it works); a sixth
// step reuses the first icon.
const stepIcons: ReactNode[] = [
  <path key="chat" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />,
  <path key="document" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />,
  <path key="screen" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />,
  <path key="check" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />,
  <path key="shield" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />,
]

function StepIcon({ index }: { index: number }) {
  return (
    <svg aria-hidden="true" className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      {stepIcons[index % stepIcons.length]}
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.2}>
      <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * "Our process": every step on one timeline, left to right from xl and top to
 * bottom below that. Each step is a card with its icon on the line; the line
 * fills in cyan as the section scrolls into view, and the last step (ongoing
 * support) is set on navy, as the part that carries on. The words come from
 * the admin panel ("Home page sections" → How it works).
 */
export default function HowItWorks({ content }: { content: HomeBlock }) {
  const copy = content.fields
  const steps = content.lists.steps.map((s, i) => ({
    num: String(i + 1).padStart(2, '0'),
    title: s.title,
    when: s.when,
    desc: s.description,
    points: lines(s.points ?? ''),
    image: pictureOf(s),
  }))
  const total = String(steps.length).padStart(2, '0')

  return (
    <section id="how-we-work" className="home-process relative isolate scroll-mt-28 overflow-hidden py-20 sm:py-24 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(14,116,144,0.10)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,black,transparent)]" />
        <div className="absolute -left-40 top-24 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgba(44,205,222,0.12),transparent)]" />
      </div>

      <div className="page-container">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <p className="mb-6 flex items-center gap-3 text-[13px] font-medium text-[var(--text-body)]">
              <span aria-hidden="true" className="h-px w-10 bg-[#2CCDDE]" />
              {copy.eyebrow}
            </p>
            <h2 className="text-balance text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl lg:text-[3.5rem]">
              {copy.heading}{' '}
              <span className="block text-[var(--ink-soft)]">{copy.heading_soft}</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <p className="max-w-md text-[17px] leading-relaxed text-[var(--text-body)]">{copy.intro}</p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--bg-surface)] px-3.5 py-1.5 text-[12.5px] font-semibold text-[var(--text-primary)]">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#2CCDDE]" />
              {total} steps, start to finish
            </p>
          </div>
        </div>

        {/* One column per step from xl, however many the admin has. */}
        <ol
          style={{ '--steps': steps.length } as CSSProperties}
          className="mt-14 lg:mt-20 xl:grid xl:grid-cols-[repeat(var(--steps),minmax(0,1fr))] xl:gap-x-6"
        >
          {steps.map((s, i) => {
            const last = i === steps.length - 1
            return (
              <li key={s.num} className="group flex gap-4 pb-6 last:pb-0 sm:gap-6 xl:flex-col xl:gap-0 xl:pb-0">
                {/* The icon on the line, and the line on to the next step:
                    down beside the cards on phones, across above them from xl. */}
                <div className="flex shrink-0 flex-col items-center xl:flex-row">
                  <span
                    aria-hidden="true"
                    className={`relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl border shadow-[0_10px_24px_-14px_rgba(14,116,144,0.6)] transition-colors duration-300 ${
                      last
                        ? 'border-[#2CCDDE] bg-[#2CCDDE] text-[#04121A]'
                        : 'process-accent border-[rgba(44,205,222,0.45)] bg-[var(--bg-surface)] group-hover:border-[#2CCDDE] group-hover:bg-[#2CCDDE] group-hover:text-[#04121A]'
                    }`}
                  >
                    <StepIcon index={i} />
                  </span>
                  {!last && (
                    <span aria-hidden="true" className="relative mt-2 w-px flex-1 bg-[var(--border-default)] xl:mr-[-1.5rem] xl:ml-3 xl:mt-0 xl:h-px xl:w-auto">
                      <span className="process-line absolute inset-0 bg-[linear-gradient(to_bottom,#2CCDDE,#46A3E1)] xl:bg-[linear-gradient(to_right,#2CCDDE,#46A3E1)]" />
                    </span>
                  )}
                </div>

                <div
                  className={`relative isolate flex flex-1 flex-col overflow-hidden rounded-3xl border p-6 transition duration-300 group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 xl:mt-6 ${
                    last
                      ? 'border-[#1d3346] bg-[#0f1b27] text-white shadow-[0_30px_60px_-30px_rgba(4,13,18,0.7)]'
                      : 'border-[var(--border-default)] bg-[var(--bg-surface)] shadow-(--shadow-card) group-hover:border-[rgba(44,205,222,0.6)] group-hover:shadow-[0_28px_50px_-28px_rgba(14,116,144,0.45)]'
                  }`}
                >
                  {last && (
                    <span aria-hidden="true" className="absolute -right-16 -top-16 -z-10 h-48 w-48 rounded-full bg-[radial-gradient(closest-side,rgba(44,205,222,0.3),transparent)]" />
                  )}
                  {s.image && (
                    <div className="relative -mx-6 -mt-6 mb-5 aspect-[16/9] overflow-hidden border-b border-[var(--border-default)]">
                      <Image
                        src={s.image.src}
                        alt={s.image.alt}
                        fill
                        sizes="(min-width: 1280px) 18vw, (min-width: 640px) 70vw, 85vw"
                        unoptimized={!s.image.src.startsWith('/')}
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                      />
                    </div>
                  )}
                  {/* The step's number, large and faint behind the top corner (the picture takes that corner when there is one). */}
                  {!s.image && (
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute right-4 top-2 -z-10 bg-clip-text font-display text-[4.5rem] font-semibold leading-none tracking-[-0.06em] text-transparent ${
                        last
                          ? 'bg-[linear-gradient(180deg,rgba(127,227,236,0.35),rgba(127,227,236,0.02))]'
                          : 'bg-[linear-gradient(180deg,rgba(14,116,144,0.22),rgba(14,116,144,0.01))]'
                      }`}
                    >
                      {s.num}
                    </span>
                  )}

                  {s.when && (
                    <p
                      className={`relative inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold leading-snug ${
                        last ? 'bg-[color-mix(in_srgb,#2CCDDE_16%,#0f1b27)] text-[#7fe3ec]' : 'process-accent bg-[color-mix(in_srgb,#2CCDDE_12%,var(--bg-surface))]'
                      }`}
                    >
                      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                      {s.when}
                    </p>
                  )}
                  <h3 className={`mt-4 text-balance font-display text-[1.3125rem] font-semibold leading-snug tracking-[-0.02em] ${last ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                    <span className="sr-only">Step {s.num}: </span>
                    {s.title}
                  </h3>
                  {s.desc && (
                    <p className={`mt-3 text-[14.5px] leading-relaxed ${last ? 'text-[#a9b6c4]' : 'text-[var(--text-body)]'}`}>{s.desc}</p>
                  )}
                  {/* Ticks sit at the foot of the card, so a row of cards lines up. */}
                  {s.points.length > 0 && (
                    <div className="mt-auto pt-6">
                      <ul className={`space-y-2 border-t pt-5 ${last ? 'border-white/10' : 'border-[var(--border-default)]'}`}>
                        {s.points.map((point) => (
                          <li key={point} className={`flex items-start gap-2.5 text-[13.5px] leading-snug ${last ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                            <span
                              className={`mt-px grid h-4 w-4 shrink-0 place-items-center rounded-full ${
                                last ? 'bg-[rgba(44,205,222,0.2)] text-[#7fe3ec]' : 'process-accent bg-[rgba(44,205,222,0.14)]'
                              }`}
                            >
                              <CheckIcon />
                            </span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
