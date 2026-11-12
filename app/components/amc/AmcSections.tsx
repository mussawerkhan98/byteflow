import Image from 'next/image'
import Link from 'next/link'
import type { CmsReview } from '../../lib/cms'
import { servicesByCategory } from '../../lib/amc-page'
import { lines, type HomeBlock } from '../../lib/home-content'
import type { ServiceTab } from '../../lib/service-tabs'
import FAQ, { type FaqContact, type FaqCopy } from '../FAQ'
import { ArrowRight, Button, Check, Eyebrow, SectionTitle, delay } from '../home/ui'
import { IndustryIcon } from '../industries/IndustryIcon'
import { hasContent, type PageSection } from '../PageSectionCards'
import { ServiceIcon } from '../ServiceIcon'
import { AmcIcon } from './AmcIcon'
import AmcServiceTabs from './AmcServiceTabs'

/*
 * The IT AMC page's sections (app/it-amc-services-dubai), one component
 * each, every word and picture from its block on the admin's "IT AMC page"
 * screen. Each section has its own layout, so consecutive sections never
 * look alike. A section with nothing to show renders nothing.
 */

const sectionClass = 'page-container scroll-mt-28 pb-16 lg:pb-24'

/** A picture uploaded in the admin; sized by its parent. */
function Uploaded({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  return <Image src={src} alt={alt} fill sizes={sizes} unoptimized={!src.startsWith('/')} className="object-cover" />
}

function Heading({ id, block, center = false }: { id: string; block: HomeBlock; center?: boolean }) {
  const f = block.fields
  return (
    <div data-reveal className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {f.eyebrow && <Eyebrow>{f.eyebrow}</Eyebrow>}
      <SectionTitle id={id} heading={f.heading} soft={f.heading_soft} softBlock className="mt-4" />
    </div>
  )
}

/** 2. Trust & highlights: a row of icon cards on one raised band. */
export function AmcHighlights({ block }: { block: HomeBlock }) {
  const items = block.lists.items
  if (!items.length) return null
  return (
    <section id="highlights" aria-label="Highlights" className={sectionClass}>
      <ul data-reveal className={`hp-band grid gap-px overflow-hidden rounded-[1.5rem] !bg-[var(--hp-line)] sm:grid-cols-2 ${items.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        {items.map((item) => (
          <li key={item.title} className="flex flex-col bg-[var(--hp-card)] p-6 sm:p-7">
            <span aria-hidden="true" className="hp-svc-icon">
              <AmcIcon icon={item.icon} className="h-5 w-5" />
            </span>
            <p className="mt-4 font-display text-[1.0625rem] font-semibold text-[var(--hp-ink)]">{item.title}</p>
            {item.description && <p className="mt-1.5 text-[14.5px] leading-relaxed text-[var(--hp-body)]">{item.description}</p>}
          </li>
        ))}
      </ul>
    </section>
  )
}

/** 3. What is IT AMC: the picture beside the explanation, or the points card when there is no picture. */
export function AmcIntro({ block }: { block: HomeBlock }) {
  const f = block.fields
  const paragraphs = (f.text ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  const points = lines(f.points ?? '')
  return (
    <section id="what-is-it-amc" aria-labelledby="amc-intro-title" className={`${sectionClass} grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14`}>
      <div className="lg:col-span-6">
        <Heading id="amc-intro-title" block={block} />
        <div data-reveal className="mt-5 space-y-4">
          {paragraphs.map((p) => (
            <p key={p} className="text-[16.5px] leading-relaxed text-[var(--hp-body)]">
              {p}
            </p>
          ))}
        </div>
      </div>
      <div data-reveal className="lg:col-span-6">
        {f.image ? (
          <figure className="hp-frame relative aspect-[4/3] overflow-hidden rounded-[1.75rem]">
            <Uploaded src={f.image} alt={f.image_alt} sizes="(min-width: 1024px) 45vw, 100vw" />
          </figure>
        ) : (
          points.length > 0 && (
            <ul className="hp-band grid gap-4 rounded-[1.5rem] p-6 sm:p-8">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-[16px] font-medium text-[var(--hp-ink)]">
                  <span className="hp-tick mt-0.5">
                    <Check />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </section>
  )
}

/** 4. Complete services: categories as tabs, their services as cards. */
export function AmcServices({ block }: { block: HomeBlock }) {
  const groups = servicesByCategory(block.lists.tabs, block.lists.services).map((group) => ({
    title: group.category?.title ?? 'More services',
    description: group.category?.description ?? '',
    icon: group.category?.icon ?? 'check',
    image: group.category?.image ?? '',
    alt: group.category?.image_alt ?? '',
    services: group.services.map((s) => ({ title: s.title, description: s.description, image: s.image ?? '', alt: s.image_alt ?? '' })),
  }))
  if (!groups.length) return null
  return (
    <section id="services" aria-labelledby="amc-services-title" className={sectionClass}>
      <Heading id="amc-services-title" block={block} />
      {block.fields.intro && (
        <p data-reveal className="mt-4 max-w-2xl text-[16px] text-[var(--hp-body)]">
          {block.fields.intro}
        </p>
      )}
      <div data-reveal className="mt-10">
        <AmcServiceTabs groups={groups} />
      </div>
    </section>
  )
}

/** 5. Preventive maintenance: alternating picture and text rows, or numbered cards without pictures. */
export function AmcPreventive({ block }: { block: HomeBlock }) {
  const items = block.lists.items
  if (!items.length) return null
  const pictured = items.some((item) => item.image)
  return (
    <section id="preventive-maintenance" aria-labelledby="amc-preventive-title" className={sectionClass}>
      <Heading id="amc-preventive-title" block={block} />
      {pictured ? (
        <ul className="mt-10 space-y-10 lg:space-y-14">
          {items.map((item, i) => (
            <li key={item.title} data-reveal className="grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-12">
              <figure className={`hp-frame relative aspect-[16/10] overflow-hidden rounded-[1.5rem] lg:col-span-6 ${i % 2 ? 'lg:order-2' : ''}`}>
                {item.image ? <Uploaded src={item.image} alt={item.image_alt} sizes="(min-width: 1024px) 45vw, 100vw" /> : <div className="absolute inset-0 bg-[var(--hp-soft)]" />}
              </figure>
              <div className="lg:col-span-6">
                <span aria-hidden="true" className="font-display text-[13px] font-semibold tabular-nums text-[var(--hp-accent)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 hp-h3">{item.title}</h3>
                {item.description && <p className="mt-3 text-[16px] leading-relaxed text-[var(--hp-body)]">{item.description}</p>}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {items.map((item, i) => (
            <li key={item.title} data-reveal style={delay((i % 2) * 100)} className="flex gap-5 rounded-[1.25rem] border border-[var(--hp-line)] bg-[var(--hp-soft)] p-6">
              <span aria-hidden="true" className="font-display text-[2rem] font-semibold leading-none tabular-nums text-[rgba(14,116,144,0.35)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>
                <h3 className="font-display text-[1.125rem] font-semibold text-[var(--hp-ink)]">{item.title}</h3>
                {item.description && <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--hp-body)]">{item.description}</p>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

/** 7. Cost factors: the heading on the left, a numbered list beside it. */
export function AmcCosts({ block }: { block: HomeBlock }) {
  const factors = block.lists.factors
  if (!factors.length) return null
  return (
    <section id="cost-factors" aria-labelledby="amc-costs-title" className={`${sectionClass} grid gap-8 lg:grid-cols-12 lg:gap-14`}>
      <div className="lg:col-span-5">
        <Heading id="amc-costs-title" block={block} />
        {block.fields.intro && (
          <p data-reveal className="mt-4 text-[16px] leading-relaxed text-[var(--hp-body)]">
            {block.fields.intro}
          </p>
        )}
      </div>
      <ol className="divide-y divide-[var(--hp-line)] border-y border-[var(--hp-line)] lg:col-span-7">
        {factors.map((factor, i) => (
          <li key={factor.title} data-reveal className="grid grid-cols-[3rem_1fr] gap-4 py-5">
            <span aria-hidden="true" className="font-display text-[1.75rem] font-semibold leading-none tabular-nums text-[var(--hp-accent)]">
              {i + 1}
            </span>
            <span>
              <h3 className="font-display text-[1.125rem] font-semibold text-[var(--hp-ink)]">{factor.title}</h3>
              {factor.description && <p className="mt-1 text-[15px] leading-relaxed text-[var(--hp-body)]">{factor.description}</p>}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}

/** 8. AMC vs break-fix: two columns, the AMC one raised. */
export function AmcBreakFix({ block }: { block: HomeBlock }) {
  const f = block.fields
  const rows = block.lists.rows
  if (!rows.length) return null
  return (
    <section id="amc-vs-break-fix" aria-labelledby="amc-breakfix-title" className={sectionClass}>
      <Heading id="amc-breakfix-title" block={block} center />
      <div data-reveal className="mt-10 grid gap-5 md:grid-cols-2">
        {[
          { label: f.us_label, key: 'us', raised: true },
          { label: f.them_label, key: 'them', raised: false },
        ].map((column) => (
          <div
            key={column.key}
            className={`rounded-[1.5rem] border p-6 sm:p-8 ${
              column.raised ? 'border-[var(--hp-accent)] bg-[var(--hp-card)] shadow-[0_40px_80px_-56px_rgba(14,116,144,0.5)]' : 'border-[var(--hp-line)] bg-[var(--hp-soft)]'
            }`}
          >
            <h3 className={`font-display text-[1.375rem] font-semibold ${column.raised ? 'text-[var(--hp-accent)]' : 'text-[var(--hp-muted)]'}`}>{column.label}</h3>
            <dl className="mt-5 divide-y divide-[var(--hp-line)]">
              {rows.map((row) => (
                <div key={row.title} className="py-3.5">
                  <dt className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--hp-muted)]">{row.title}</dt>
                  <dd className={`mt-1 text-[15.5px] ${column.raised ? 'font-medium text-[var(--hp-ink)]' : 'text-[var(--hp-body)]'}`}>{row[column.key]}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      {f.footer && (
        <p data-reveal className="mx-auto mt-8 max-w-3xl text-center text-[15.5px] leading-relaxed text-[var(--hp-body)]">
          {f.footer}
        </p>
      )}
    </section>
  )
}

/** 9. Industries: a grid of linked cards with their icons. */
export function AmcIndustries({ block }: { block: HomeBlock }) {
  const f = block.fields
  const industries = block.lists.industries
  if (!industries.length) return null
  return (
    <section id="industries" aria-labelledby="amc-industries-title" className={sectionClass}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <Heading id="amc-industries-title" block={block} />
        {f.link_label && f.link && (
          <Link data-reveal href={f.link} className="hp-textlink self-start lg:self-auto">
            {f.link_label}
            <ArrowRight className="hp-arrow h-4 w-4" />
          </Link>
        )}
      </div>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {industries.map((industry, i) => {
          const card = (
            <>
              <span aria-hidden="true" className="hp-svc-icon">
                <IndustryIcon icon={industry.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-[1.0625rem] font-semibold leading-snug text-[var(--hp-ink)]">{industry.title}</h3>
              {industry.description && <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--hp-body)]">{industry.description}</p>}
            </>
          )
          return (
            <li key={industry.title} data-reveal style={delay((i % 4) * 80)}>
              {industry.link ? (
                <Link href={industry.link} className="hp-band block h-full rounded-[1.25rem] p-5 transition-colors hover:border-[var(--hp-accent)]">
                  {card}
                </Link>
              ) : (
                <div className="hp-band h-full rounded-[1.25rem] p-5">{card}</div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/** 10. Why Byteflow: columns, each under a rule in the brand colour. */
export function AmcWhy({ block }: { block: HomeBlock }) {
  const benefits = block.lists.benefits
  if (!benefits.length) return null
  return (
    <section id="why-byteflow" aria-labelledby="amc-why-title" className={sectionClass}>
      <Heading id="amc-why-title" block={block} />
      <ul className={`mt-10 grid gap-8 sm:grid-cols-2 ${benefits.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        {benefits.map((benefit, i) => (
          <li key={benefit.title} data-reveal style={delay(i * 100)} className="border-t-2 border-[var(--hp-accent)] pt-5">
            <h3 className="font-display text-[1.125rem] font-semibold leading-snug text-[var(--hp-ink)]">{benefit.title}</h3>
            {benefit.description && <p className="mt-2 text-[15px] leading-relaxed text-[var(--hp-body)]">{benefit.description}</p>}
          </li>
        ))}
      </ul>
    </section>
  )
}

/** 11. Process: numbered steps joined by a line. */
export function AmcProcess({ block }: { block: HomeBlock }) {
  const steps = block.lists.steps
  if (!steps.length) return null
  return (
    <section id="process" aria-labelledby="amc-process-title" className={sectionClass}>
      <Heading id="amc-process-title" block={block} />
      <ol className={`relative mt-10 grid gap-6 md:gap-5 ${steps.length >= 5 ? 'md:grid-cols-5' : steps.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
        <span aria-hidden="true" className="absolute left-5 top-5 hidden h-px w-[calc(100%-2.5rem)] bg-[var(--hp-line-strong)] md:block" />
        {steps.map((step, i) => (
          <li key={step.title} data-reveal style={delay(i * 110)} className="relative flex gap-4 md:flex-col md:gap-0">
            <span className="relative z-[1] grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--hp-line-strong)] bg-[var(--hp-card)] font-display text-[14px] font-semibold tabular-nums text-[var(--hp-accent)]">
              {i + 1}
            </span>
            <span className="md:mt-5">
              <h3 className="font-display text-[1.0625rem] font-semibold leading-snug text-[var(--hp-ink)]">{step.title}</h3>
              {step.description && <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--hp-body)]">{step.description}</p>}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}

/** 12. SLA: a row per priority, its commitment in a pill, then the escalation note. */
export function AmcSla({ block }: { block: HomeBlock }) {
  const f = block.fields
  const priorities = block.lists.priorities
  if (!priorities.length) return null
  return (
    <section id="sla" aria-labelledby="amc-sla-title" className={sectionClass}>
      <div data-reveal className="rounded-[1.5rem] border border-[var(--hp-line)] bg-[var(--hp-soft)] p-6 sm:p-10 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <Eyebrow>{f.eyebrow}</Eyebrow>
            <SectionTitle id="amc-sla-title" heading={f.heading} soft={f.heading_soft} softBlock className="mt-4" />
            {f.intro && <p className="mt-4 text-[15.5px] leading-relaxed text-[var(--hp-body)]">{f.intro}</p>}
          </div>
          <div className="lg:col-span-8">
            <ul className="grid gap-3">
              {priorities.map((priority, i) => (
                <li key={priority.title} className="flex flex-col gap-3 rounded-2xl border border-[var(--hp-line)] bg-[var(--hp-card)] p-5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="flex items-start gap-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[rgba(14,116,144,0.1)] font-display text-[13px] font-semibold text-[var(--hp-accent)]">P{i + 1}</span>
                    <span>
                      <h3 className="font-display text-[1.0625rem] font-semibold text-[var(--hp-ink)]">{priority.title}</h3>
                      {priority.description && <p className="mt-0.5 text-[14.5px] text-[var(--hp-body)]">{priority.description}</p>}
                    </span>
                  </span>
                  {priority.response && (
                    <span className="self-start whitespace-nowrap rounded-full bg-[var(--hp-accent)] px-4 py-1.5 text-[13.5px] font-semibold text-white sm:self-auto">{priority.response}</span>
                  )}
                </li>
              ))}
            </ul>
            {f.escalation && (
              <div className="mt-6 rounded-2xl border border-dashed border-[var(--hp-line-strong)] p-5">
                <h3 className="font-display text-[1rem] font-semibold text-[var(--hp-ink)]">{f.escalation_heading}</h3>
                <p className="mt-1.5 whitespace-pre-line text-[14.5px] leading-relaxed text-[var(--hp-body)]">{f.escalation}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/** 13. Coverage: the areas as tags on a white band. */
export function AmcCoverage({ block }: { block: HomeBlock }) {
  const f = block.fields
  const areas = lines(f.areas ?? '')
  if (!areas.length) return null
  return (
    <section id="coverage" aria-labelledby="amc-areas-title" className={sectionClass}>
      <div data-reveal className="hp-band grid gap-6 rounded-[1.5rem] p-6 sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className="lg:col-span-5">
          <Eyebrow>{f.eyebrow}</Eyebrow>
          <SectionTitle id="amc-areas-title" heading={f.heading} soft={f.heading_soft} softBlock className="mt-4" />
          {f.text && <p className="mt-4 text-[15.5px] leading-relaxed text-[var(--hp-body)]">{f.text}</p>}
        </div>
        <ul className="flex flex-wrap gap-2.5 lg:col-span-7">
          {areas.map((area) => (
            <li key={area} className="hp-topic !pr-4">
              <span aria-hidden="true" className="hp-dot" />
              {area}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** 14. Included & excluded: the two lists side by side. */
export function AmcScope({ block }: { block: HomeBlock }) {
  const f = block.fields
  const included = block.lists.included ?? []
  const excluded = block.lists.items
  if (!included.length && !excluded.length) return null
  return (
    <section id="included-and-excluded" aria-labelledby="amc-scope-title" className={sectionClass}>
      <div data-reveal className="max-w-3xl">
        {f.eyebrow && <Eyebrow>{f.eyebrow}</Eyebrow>}
        <h2 id="amc-scope-title" className="hp-h2 mt-4">
          {f.heading}
        </h2>
        {f.intro && <p className="mt-4 text-[16px] leading-relaxed text-[var(--hp-body)]">{f.intro}</p>}
      </div>
      <div className="mt-10 grid gap-5 lg:grid-cols-12">
        {included.length > 0 && (
          <div data-reveal className="hp-band rounded-[1.5rem] p-6 sm:p-8 lg:col-span-5">
            <h3 className="font-display text-[1.25rem] font-semibold text-[var(--hp-accent)]">{f.included_heading}</h3>
            <ul className="mt-5 grid gap-3.5">
              {included.map((item) => (
                <li key={item.title} className="flex items-start gap-3 text-[15.5px] font-medium text-[var(--hp-ink)]">
                  <span className="hp-tick mt-0.5">
                    <Check />
                  </span>
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
        )}
        {excluded.length > 0 && (
          <div data-reveal className={`rounded-[1.5rem] border border-[var(--hp-line)] bg-[var(--hp-soft)] p-6 sm:p-8 ${included.length ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
            <h3 className="font-display text-[1.25rem] font-semibold text-[var(--hp-muted)]">{f.excluded_heading}</h3>
            <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {excluded.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--hp-line-strong)]" />
                  <span>
                    <span className="block text-[15px] font-semibold text-[var(--hp-ink)]">{item.title}</span>
                    {item.description && <span className="mt-0.5 block text-[14px] leading-relaxed text-[var(--hp-body)]">{item.description}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {f.footer && (
        <p data-reveal className="mt-6 flex items-start gap-3 rounded-xl border border-[var(--hp-line)] bg-[var(--hp-card)] px-5 py-4 text-[15px] font-medium text-[var(--hp-ink)]">
          <span className="hp-tick mt-px">
            <Check />
          </span>
          {f.footer}
        </p>
      )}
    </section>
  )
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('')

/** 15. Testimonials and case studies: review cards, then the projects added in the admin. */
export function AmcReviews({ block, reviews }: { block: HomeBlock; reviews: CmsReview[] }) {
  const f = block.fields
  const count = Math.min(Math.max(Number.parseInt(f.count, 10) || 6, 0), 12)
  const shown = [...reviews].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, count)
  const cases = block.lists.cases ?? []
  if (!shown.length && !cases.length) return null
  return (
    <section id="testimonials" aria-labelledby="amc-reviews-title" className={sectionClass}>
      <Heading id="amc-reviews-title" block={block} />
      {shown.length > 0 && (
        <ul className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {shown.map((review) => (
            <li key={review.id} data-reveal className="hp-band mb-4 break-inside-avoid rounded-[1.25rem] p-6">
              <span role="img" aria-label={`${review.rating} out of 5 stars`} className="flex gap-0.5 text-[#F5B301]">
                {Array.from({ length: Math.max(0, Math.min(5, review.rating)) }, (_, i) => (
                  <svg key={i} aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </span>
              <blockquote className="mt-4 text-[15.5px] leading-relaxed text-[var(--hp-ink)]">{review.review_text}</blockquote>
              <p className="mt-5 flex items-center gap-3 border-t border-[var(--hp-line)] pt-4">
                <span aria-hidden="true" className="hp-avatar h-10 w-10 text-[13px]">
                  {initials(review.customer_name)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[14.5px] font-semibold capitalize text-[var(--hp-ink)]">{review.customer_name}</span>
                  {review.customer_role && <span className="block truncate text-[13px] text-[var(--hp-muted)]">{review.customer_role}</span>}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
      {cases.length > 0 && (
        <>
          <h3 data-reveal className="mt-12 font-display text-[1.375rem] font-semibold text-[var(--hp-ink)]">
            {f.cases_heading}
          </h3>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {cases.map((item) => {
              const inner = (
                <>
                  {item.image && (
                    <span className="relative block aspect-[16/10]">
                      <Uploaded src={item.image} alt={item.image_alt} sizes="(min-width: 768px) 30vw, 100vw" />
                    </span>
                  )}
                  <span className="block p-5">
                    <span className="block font-display text-[1.0625rem] font-semibold text-[var(--hp-ink)]">{item.title}</span>
                    {item.description && <span className="mt-1.5 block text-[14.5px] leading-relaxed text-[var(--hp-body)]">{item.description}</span>}
                  </span>
                </>
              )
              return (
                <li key={item.title} data-reveal>
                  {item.link ? (
                    <Link href={item.link} className="hp-band block h-full overflow-hidden rounded-[1.25rem] transition-colors hover:border-[var(--hp-accent)]">
                      {inner}
                    </Link>
                  ) : (
                    <div className="hp-band h-full overflow-hidden rounded-[1.25rem]">{inner}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </>
      )}
    </section>
  )
}

/**
 * 16. Questions, in the home page's FAQ design (search, topic tabs and the
 * help card): this page's heading and questions, the labels from the home
 * page's FAQ section.
 */
export function AmcFaq({ block, labels, faqs, contact }: { block: HomeBlock; labels: HomeBlock; faqs: { question: string; answer: string; category: string }[]; contact: FaqContact }) {
  if (!faqs.length) return null
  const f = block.fields
  const copy = { ...(labels.fields as FaqCopy), eyebrow: f.eyebrow, heading: f.heading, heading_soft: f.heading_soft, intro: f.intro ?? '' }
  return (
    <div id="faq" className="scroll-mt-28">
      <FAQ items={faqs} copy={copy} contact={contact} />
    </div>
  )
}

/**
 * The blocks added for this page under Pages → IT AMC Services, in the
 * page's design: each block's heading, paragraphs and button, beside its
 * picture when it has one. Placed (or hidden) as one section on the IT AMC
 * page's Sections tab.
 */
export function AmcPageBlocks({ sections }: { sections: PageSection[] }) {
  const shown = sections.filter(hasContent)
  if (!shown.length) return null
  return (
    <div className="space-y-6 pb-16 lg:pb-24">
      {shown.map((section) => {
        const paragraphs = section.text
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean)
        return (
          <section key={section.id} aria-label={section.heading || section.name || undefined} className="page-container">
            <div data-reveal className={`hp-band grid overflow-hidden rounded-[1.5rem] ${section.image_url ? 'lg:grid-cols-12' : ''}`}>
              {section.image_url && (
                <figure className="relative min-h-[16rem] lg:col-span-5">
                  <Uploaded src={section.image_url} alt={section.heading} sizes="(min-width: 1024px) 40vw, 100vw" />
                </figure>
              )}
              <div className={`p-6 sm:p-10 lg:p-12 ${section.image_url ? 'lg:col-span-7' : ''}`}>
                {section.heading && <h2 className="hp-h2">{section.heading}</h2>}
                {paragraphs.length > 0 && (
                  <div className="mt-5 max-w-3xl space-y-3">
                    {paragraphs.map((p) => (
                      <p key={p} className="text-[16px] leading-relaxed text-[var(--hp-body)]">
                        {p}
                      </p>
                    ))}
                  </div>
                )}
                {section.button_label && section.button_link && (
                  <Button href={section.button_link} className="mt-7">
                    {section.button_label}
                  </Button>
                )}
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}

/** Related services: linked cards with each service's icon. */
export function AmcRelated({ block, tabs }: { block: HomeBlock; tabs: ServiceTab[] }) {
  const related = block.lists.services.map((item) => tabs.find((tab) => tab.slug === item.title)).filter((tab) => tab !== undefined)
  if (!related.length) return null
  return (
    <section id="related-services" aria-labelledby="amc-related-title" className={sectionClass}>
      <div data-reveal>
        <Eyebrow>{block.fields.eyebrow}</Eyebrow>
        <h2 id="amc-related-title" className="hp-h2 mt-4">
          {block.fields.heading}
        </h2>
      </div>
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {related.map((tab, i) => (
          <li key={tab.slug} data-reveal style={delay(i * 100)}>
            <Link href={tab.href} className="group/rel hp-band flex h-full flex-col rounded-[1.25rem] p-6 transition-colors hover:border-[var(--hp-accent)]">
              <span className="flex items-center justify-between gap-4">
                <span aria-hidden="true" className="hp-svc-icon">
                  <ServiceIcon link={tab.href} className="h-5 w-5" />
                </span>
                <span className="hp-round-arrow !h-10 !w-10 group-hover/rel:border-[var(--hp-accent)] group-hover/rel:bg-[var(--hp-accent)] group-hover/rel:text-white">
                  <ArrowRight />
                </span>
              </span>
              <span className="mt-5 block font-display text-[1.125rem] font-semibold text-[var(--hp-ink)]">{tab.title}</span>
              {tab.subtitle && <span className="mt-1.5 block text-[14.5px] leading-relaxed text-[var(--hp-body)]">{tab.subtitle}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
