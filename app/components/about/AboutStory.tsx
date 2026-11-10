import type { HomeBlock } from '../../lib/home-content'
import { Eyebrow, SectionTitle, delay } from '../home/ui'

/**
 * "Our story": the milestones along one line down the middle of the page,
 * alternating sides on wide screens with each year large across from its
 * card; on phones the line runs down the left. The latest milestone's dot is
 * lit. Edited as "Our story" on the admin's About page sections.
 */
export default function AboutStory({ content }: { content: HomeBlock }) {
  const copy = content.fields
  const milestones = content.lists.milestones

  return (
    <section id="our-story" aria-labelledby="story-title" className="hp-section hp-tinted scroll-mt-28">
      <div className="page-container">
        <header data-reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <SectionTitle id="story-title" heading={copy.heading} soft={copy.heading_soft} className="mt-5" />
          {copy.intro && <p className="hp-lead mx-auto mt-5 max-w-2xl">{copy.intro}</p>}
        </header>

        <ol className="ab-tl relative mx-auto mt-14 max-w-5xl lg:mt-20">
          {milestones.map((item, i) => {
            const flip = i % 2 === 1
            return (
              <li
                key={item.year + item.title}
                data-reveal
                style={delay(i * 80)}
                className="ab-tl-item relative grid gap-3 pb-8 pl-10 last:pb-0 lg:grid-cols-2 lg:gap-x-20 lg:pb-10 lg:pl-0"
              >
                <span aria-hidden="true" className={`ab-tl-dot ${i === milestones.length - 1 ? 'is-last' : ''}`} />
                <p aria-hidden="true" className={`ab-year lg:pt-1 ${flip ? 'lg:order-2' : 'lg:text-right'}`}>
                  {item.year}
                </p>
                <article className={`ab-tl-card rounded-[1rem] p-6 sm:p-7 ${flip ? 'lg:order-1' : ''}`}>
                  <h3 className="font-display text-[1.25rem] font-semibold leading-snug tracking-[-0.02em] text-[var(--hp-ink)]">
                    <span className="sr-only">{item.year}: </span>
                    {item.title}
                  </h3>
                  {item.description && <p className="mt-2.5 text-[15.5px] leading-relaxed text-[var(--hp-body)]">{item.description}</p>}
                </article>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
