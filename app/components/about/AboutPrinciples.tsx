import type { HomeBlock } from '../../lib/home-content'
import { Button, Eyebrow, SectionTitle, delay } from '../home/ui'

/**
 * "How we work": one white panel, the heading and button along its top and
 * the principles as pillars beneath, divided by hairlines. Each number is
 * drawn in outline and fills with the brand colour when its pillar is
 * pointed at. Edited as "How we work" on the admin's About page sections.
 */
export default function AboutPrinciples({ content }: { content: HomeBlock }) {
  const copy = content.fields
  const principles = content.lists.principles
  const columns = principles.length === 2 ? 'md:grid-cols-2' : principles.length >= 3 ? 'md:grid-cols-3' : ''

  return (
    <section aria-labelledby="principles-title" className="hp-section">
      <div className="page-container">
        <div data-reveal className="hp-panel overflow-hidden rounded-[2rem] shadow-[var(--hp-shadow-lg)]">
          <header className="ab-pillars-top flex flex-col gap-6 border-b border-[var(--hp-line)] p-7 sm:p-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:p-12">
            <div className="max-w-3xl">
              <Eyebrow>{copy.eyebrow}</Eyebrow>
              <SectionTitle id="principles-title" heading={copy.heading} soft={copy.heading_soft} className="mt-5" />
            </div>
            {copy.link_label && copy.link && (
              <Button href={copy.link} className="self-start lg:self-auto">
                {copy.link_label}
              </Button>
            )}
          </header>

          <ol className={`grid divide-y divide-[var(--hp-line)] md:divide-x md:divide-y-0 ${columns}`}>
            {principles.map((item, i) => (
              <li key={item.title} data-reveal style={delay(120 + i * 120)} className="ab-pillar flex min-w-0 flex-col p-7 sm:p-10 lg:p-12">
                <span aria-hidden="true" className="ab-pillar-num">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-8 font-display text-[1.3125rem] font-semibold leading-snug tracking-[-0.02em] text-[var(--hp-ink)]">{item.title}</h3>
                {item.description && <p className="mt-3 text-[15.5px] leading-relaxed text-[var(--hp-body)]">{item.description}</p>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
