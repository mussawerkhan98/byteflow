import type { HomeBlock } from '../../lib/home-content'
import { Eyebrow, SectionTitle, delay } from '../home/ui'

/**
 * "Our story": the heading and intro on the left (held in place while the
 * milestones scroll past on wide screens), the milestones on the right as one
 * timeline — year, a dot on the rail, then what happened. The latest
 * milestone is lit. On phones the rail runs down the left with each year
 * above its title. Edited as "Our story" on the admin's About page sections.
 */
export default function AboutStory({ content }: { content: HomeBlock }) {
  const copy = content.fields
  const milestones = content.lists.milestones

  return (
    <section id="our-story" aria-labelledby="story-title" className="hp-section hp-tinted scroll-mt-28">
      <div className="page-container grid gap-12 lg:grid-cols-12 lg:gap-16">
        <header data-reveal className="lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <SectionTitle id="story-title" heading={copy.heading} soft={copy.heading_soft} softBlock className="mt-5" />
          {copy.intro && <p className="hp-lead mt-5 max-w-md">{copy.intro}</p>}
        </header>

        <ol className="ab-tl lg:col-span-7 lg:pt-2">
          {milestones.map((item, i) => (
            <li
              key={item.year + item.title}
              data-reveal
              style={delay(i * 80)}
              className={`ab-tl-item ${i === milestones.length - 1 ? 'is-last' : ''}`}
            >
              <p aria-hidden="true" className="ab-year">
                {item.year}
              </p>
              <span aria-hidden="true" className="ab-tl-dot" />
              <div className="ab-tl-body">
                <h3 className="font-display text-[1.1875rem] font-semibold leading-snug tracking-[-0.02em] text-[var(--hp-ink)]">
                  <span className="sr-only">{item.year}: </span>
                  {item.title}
                </h3>
                {item.description && <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-[var(--hp-body)]">{item.description}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
