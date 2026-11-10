import Link from 'next/link'
import type { HomeBlock } from '../../lib/home-content'
import { ArrowRight, Eyebrow, SectionTitle, TextLink } from '../home/ui'

/**
 * "What we do" as an index: the heading held on the left while the services
 * run down the right as numbered rows, each linking to its page; the row
 * pointed at lifts onto white. Edited as "What we do" on the admin's About
 * page sections.
 */
export default function AboutServices({ content }: { content: HomeBlock }) {
  const copy = content.fields
  const services = content.lists.services

  return (
    <section aria-labelledby="about-services-title" className="hp-section hp-tinted">
      <div className="page-container grid gap-10 lg:grid-cols-12 lg:gap-16">
        <header data-reveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <SectionTitle id="about-services-title" heading={copy.heading} soft={copy.heading_soft} softBlock className="mt-5" />
            {copy.link_label && copy.link && (
              <TextLink href={copy.link} className="mt-8">
                {copy.link_label}
              </TextLink>
            )}
          </div>
        </header>

        <ul data-reveal className="border-t border-[var(--hp-line-strong)] lg:col-span-8">
          {services.map((service, i) => {
            const row = (
              <>
                <span className="ab-index-num pt-1.5">{String(i + 1).padStart(2, '0')}</span>
                <span className="min-w-0">
                  <span className="ab-index-title block font-display text-[1.1875rem] font-semibold leading-snug tracking-[-0.02em] text-[var(--hp-ink)] transition-colors sm:text-[1.3125rem]">
                    {service.title}
                  </span>
                  {service.description && <span className="mt-1.5 block text-[15px] leading-relaxed text-[var(--hp-body)]">{service.description}</span>}
                </span>
                {service.link ? (
                  <span aria-hidden="true" className="hp-svc-go self-center">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                ) : (
                  <span />
                )}
              </>
            )
            const cls = 'ab-index-row grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-start gap-4 rounded-none py-6 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:gap-6'
            return (
              <li key={service.title}>
                {service.link ? (
                  <Link href={service.link} className={cls}>
                    {row}
                  </Link>
                ) : (
                  <div className={cls}>{row}</div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
