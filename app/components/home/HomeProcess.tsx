import type { CSSProperties } from 'react'
import { lines, pictureOf, type HomeBlock } from '../../lib/home-content'
import { Check, Eyebrow, Photo, SectionTitle, delay } from './ui'

// Step icons, by position: chat, document, screen, check, shield. A sixth
// step reuses the first.
const stepIcons = [
  'M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z',
  'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
  'M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3',
  'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
]

function StepIcon({ index }: { index: number }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d={stepIcons[index % stepIcons.length]} />
    </svg>
  )
}

/**
 * "Our process": the numbered timeline, across from xl and down on smaller
 * screens, with each step as a crisp white card hanging from its number. The
 * last step (ongoing support, the part that carries on) is the navy card. The
 * line fills in once the steps scroll into view (HomeMotion); without
 * JavaScript or with reduced motion it is simply full. The words come from
 * the admin ("Home page sections" → How it works), and so does a step's
 * picture, across the top of its card when one is uploaded.
 */
export default function HomeProcess({ content }: { content: HomeBlock }) {
  const copy = content.fields
  const steps = content.lists.steps.map((step, i) => ({
    num: String(i + 1).padStart(2, '0'),
    title: step.title,
    when: step.when,
    desc: step.description,
    points: lines(step.points ?? ''),
    image: pictureOf(step),
  }))
  const total = String(steps.length).padStart(2, '0')

  return (
    <section id="how-we-work" aria-labelledby="process-title" className="hp-section scroll-mt-28">
      <div className="page-container">
        <header data-reveal className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <SectionTitle id="process-title" heading={copy.heading} soft={copy.heading_soft} softBlock className="mt-5" />
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <p className="hp-lead max-w-md">{copy.intro}</p>
            <p className="hp-pill mt-5 inline-flex items-center gap-2 !rounded-md !text-[var(--hp-ink)]">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#2CCDDE]" />
              {total} steps, start to finish
            </p>
          </div>
        </header>

        <ol
          data-reveal
          style={{ '--steps': steps.length } as CSSProperties}
          className="hp-timeline relative mt-14 lg:mt-16 xl:grid xl:grid-cols-[repeat(var(--steps),minmax(0,1fr))] xl:gap-x-4"
        >
          {steps.map((step, i) => {
            const last = i === steps.length - 1
            return (
              <li key={step.num} className="hp-step relative pb-5 pl-16 last:pb-0 xl:flex xl:flex-col xl:pb-0 xl:pl-0" style={delay(200 + i * 140)}>
                <span aria-hidden="true" className={`hp-step-num ${last ? 'is-last' : ''}`}>
                  {step.num}
                </span>
                <article className={`hp-step-card group relative flex flex-1 flex-col rounded-[0.75rem] p-6 xl:mt-6 ${last ? 'is-last' : ''}`}>
                  {step.image && (
                    <div className="relative -mx-6 -mt-6 mb-5 aspect-video overflow-hidden rounded-t-[0.75rem]">
                      <Photo slot={{ ...step.image, brief: '' }} sizes="(min-width: 1280px) 20vw, (min-width: 640px) 70vw, 100vw" />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-3">
                    {step.when ? <p className="hp-step-when">{step.when}</p> : <span />}
                    <span aria-hidden="true" className="hp-step-icon">
                      <StepIcon index={i} />
                    </span>
                  </div>
                  <h3 className="hp-step-title mt-4 font-display text-[1.25rem] font-semibold leading-snug tracking-[-0.02em]">
                    <span className="sr-only">Step {step.num}: </span>
                    {step.title}
                  </h3>
                  {step.desc && <p className="hp-step-desc mt-2.5 text-[14.5px] leading-relaxed">{step.desc}</p>}
                  {step.points.length > 0 && (
                    <div className="mt-auto pt-5">
                      <ul className="hp-step-points space-y-2 border-t pt-4">
                        {step.points.map((point) => (
                          <li key={point} className="flex items-start gap-2.5 text-[13.5px] leading-snug">
                            <span className="hp-tick mt-px !h-[18px] !w-[18px]">
                              <Check className="h-2.5 w-2.5" />
                            </span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
