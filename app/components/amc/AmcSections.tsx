import Image from 'next/image'
import { unoptimizedSrc } from '../../lib/image-src'
import Link from 'next/link'
import type { CmsReview } from '../../lib/cms'
import { servicesByCategory } from '../../lib/amc-page'
import { lines, type HomeBlock } from '../../lib/home-content'
import type { ServiceTab } from '../../lib/service-tabs'
import FAQ, { type FaqContact, type FaqCopy } from '../FAQ'
import { ArrowRight, Button, Check, Eyebrow, SectionTitle, delay } from '../home/ui'
import { IndustryIcon } from '../industries/IndustryIcon'
import { hasContent, type PageSection } from '../PageSectionCards'
import { blockParts } from '../../lib/block-parts'
import { ServiceIcon } from '../ServiceIcon'
import { AmcIcon } from './AmcIcon'
import AmcPreventiveStage from './AmcPreventiveStage'
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
  return <Image src={src} alt={alt} fill sizes={sizes} unoptimized={unoptimizedSrc(src)} className="object-cover" />
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
  // With neither a picture nor points: the heading beside the text.
  if (!f.image && !points.length)
    return (
      <section id="overview" aria-labelledby="amc-intro-title" className={`${sectionClass} grid gap-6 lg:grid-cols-12 lg:gap-14`}>
        <div className="lg:col-span-5">
          <Heading id="amc-intro-title" block={block} />
        </div>
        <div data-reveal className="space-y-4 lg:col-span-7 lg:pt-10">
          {paragraphs.map((p) => (
            <p key={p} className="text-[17px] leading-relaxed text-[var(--hp-body)]">
              {p}
            </p>
          ))}
        </div>
      </section>
    )
  return (
    <section id="overview" aria-labelledby="amc-intro-title" className={`${sectionClass} grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14`}>
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
            <div className="hp-band relative overflow-hidden rounded-[1.5rem]">
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#2CCDDE,#46A3E1)]" />
              <ul className="divide-y divide-[var(--hp-line)] px-6 py-3 sm:px-8 sm:py-4">
                {points.map((point) => (
                  <li key={point} className="flex items-center gap-4 py-4 text-[16px] font-medium text-[var(--hp-ink)]">
                    <span className="hp-tick !h-7 !w-7 shrink-0">
                      <Check />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
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

/**
 * What's included (the service pages): the heading staying in view beside
 * a numbered card per item, each with its picture when it has one.
 */
export function AmcFeatures({ block }: { block: HomeBlock }) {
  const features = block.lists.features ?? []
  if (!features.length) return null
  return (
    <section id="features" aria-labelledby="svc-features-title" className={`${sectionClass} grid gap-10 lg:grid-cols-12 lg:gap-14`}>
      <div data-reveal className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
        <Eyebrow>{block.fields.eyebrow}</Eyebrow>
        <SectionTitle id="svc-features-title" heading={block.fields.heading} soft={block.fields.heading_soft} softBlock className="mt-4" />
        {block.fields.intro && <p className="hp-lead mt-5">{block.fields.intro}</p>}
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
        {features.map((feature, i) => (
          <li key={feature.title} data-reveal style={delay((i % 2) * 100)} className="hp-band flex flex-col overflow-hidden rounded-[1.25rem]">
            {feature.image && (
              <span className="relative block aspect-[16/9]">
                <Uploaded src={feature.image} alt={feature.image_alt} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" />
              </span>
            )}
            <span className="block p-6">
              <span aria-hidden="true" className="font-display text-[13px] font-semibold tabular-nums text-[var(--hp-accent)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 font-display text-[1.125rem] font-semibold leading-snug tracking-[-0.01em] text-[var(--hp-ink)]">{feature.title}</h3>
              {feature.description && <p className="mt-2 text-[15px] leading-relaxed text-[var(--hp-body)]">{feature.description}</p>}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** 5. Preventive maintenance: a picture stage beside the steps, or numbered cards without pictures. */
export function AmcPreventive({ block }: { block: HomeBlock }) {
  const items = block.lists.items
  if (!items.length) return null
  const pictured = items.some((item) => item.image)
  return (
    <section id="preventive-maintenance" aria-labelledby="amc-preventive-title" className={sectionClass}>
      {pictured ? (
        <AmcPreventiveStage
          heading={<Heading id="amc-preventive-title" block={block} />}
          items={items.map((item) => ({ title: item.title, description: item.description ?? '', image: item.image ?? '', alt: item.image_alt ?? '' }))}
        />
      ) : (
        <>
          <Heading id="amc-preventive-title" block={block} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {items.map((item, i) => (
              <li key={item.title} data-reveal style={delay((i % 2) * 100)} className="hp-band flex gap-5 rounded-[1.25rem] p-6">
                <span aria-hidden="true" className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--hp-navy)] font-display text-[15px] font-semibold tabular-nums text-[#7fe3ec]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>
                  <h3 className="font-display text-[1.125rem] font-semibold text-[var(--hp-ink)]">{item.title}</h3>
                  {item.description && <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--hp-body)]">{item.description}</p>}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

/**
 * 7. Cost factors: the heading with its intro beside it, then the factors as a
 * row of numbered cards on one tinted strip.
 */
export function AmcCosts({ block }: { block: HomeBlock }) {
  const factors = block.lists.factors
  if (!factors.length) return null
  const columns = processColumns(factors.length)
  return (
    <section id="cost-factors" aria-labelledby="amc-costs-title" className={sectionClass}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <Heading id="amc-costs-title" block={block} />
        {block.fields.intro && (
          <p data-reveal className="hp-lead lg:max-w-sm lg:pb-1">
            {block.fields.intro}
          </p>
        )}
      </div>
      <ol data-reveal className={`mt-10 grid gap-2 rounded-[1.75rem] border border-[var(--hp-line)] bg-[var(--hp-soft)] p-2 sm:grid-cols-2 ${processGrid[columns]}`}>
        {factors.map((factor, i) => (
          <li key={factor.title} className="flex flex-col rounded-[1.25rem] bg-[var(--hp-card)] p-5 shadow-[0_1px_2px_rgba(12,29,51,0.04)] sm:p-6">
            <span aria-hidden="true" className="font-display text-[2rem] font-semibold leading-none tabular-nums tracking-[-0.04em] text-[rgba(14,116,144,0.28)]">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-6 font-display text-[1.0625rem] font-semibold leading-snug text-[var(--hp-ink)]">{factor.title}</h3>
            {factor.description && <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--hp-body)]">{factor.description}</p>}
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
    <section id="compare" aria-labelledby="amc-breakfix-title" className={sectionClass}>
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

/**
 * 10. Why Byteflow: the page's one deep navy panel, for contrast — the
 * heading inside it, then the reasons as numbered cells divided by hairlines.
 */
export function AmcWhy({ block }: { block: HomeBlock }) {
  const f = block.fields
  const benefits = block.lists.benefits
  if (!benefits.length) return null
  // Full rows where possible: 3, 5, 6 and 9 reasons in threes, the rest in fours.
  const columns = benefits.length <= 2 ? 'lg:grid-cols-2' : benefits.length % 3 === 0 || benefits.length === 5 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
  return (
    <section id="why-byteflow" aria-labelledby="amc-why-title" className={sectionClass}>
      <div data-reveal className="hp-navy relative isolate overflow-hidden rounded-[2rem]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-40 -top-48 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgba(44,205,222,0.18),transparent)]" />
          <div className="absolute -bottom-56 -left-40 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgba(70,163,225,0.12),transparent)]" />
        </div>
        <div className="max-w-3xl px-6 pb-10 pt-10 sm:px-10 lg:px-14 lg:pb-12 lg:pt-14">
          {f.eyebrow && <Eyebrow className="!text-[#7fe3ec]">{f.eyebrow}</Eyebrow>}
          <h2 id="amc-why-title" className="hp-h2 mt-4 !text-white">
            {f.heading}
            {f.heading_soft && (
              <>
                {' '}
                <span className="block text-[#8da0b3]">{f.heading_soft}</span>
              </>
            )}
          </h2>
        </div>
        {/* Every cell draws its own top and left hairline; the list is pulled
            1px left so the first column's line falls outside the panel. */}
        <ul className={`-ml-px grid sm:grid-cols-2 ${columns}`}>
          {benefits.map((benefit, i) => (
            <li key={benefit.title} data-reveal style={delay(i * 100)} className="border-l border-t border-white/10 px-6 py-8 sm:px-10 lg:px-8 lg:py-10 xl:px-10">
              <span aria-hidden="true" className="font-display text-[13px] font-semibold tabular-nums tracking-[0.08em] text-[#7fe3ec]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-5 font-display text-[1.1875rem] font-semibold leading-snug tracking-[-0.015em] text-white">{benefit.title}</h3>
              {benefit.description && <p className="mt-2.5 text-[15px] leading-relaxed text-[#a9b6c4]">{benefit.description}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Columns for the process cards on wide screens: one row up to five steps, then rows of three or four. */
function processColumns(count: number) {
  if (count <= 3) return 3
  if (count <= 5) return count
  return count % 3 === 0 ? 3 : 4
}

const processGrid: Record<number, string> = { 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5' }

/**
 * 11. Process: a card per step in one row, each numbered, an arrow handing on
 * to the next card, the last step — the outcome — lit. Stacked on phones.
 */
export function AmcProcess({ block }: { block: HomeBlock }) {
  const steps = block.lists.steps
  if (!steps.length) return null
  const columns = processColumns(steps.length)
  return (
    <section id="process" aria-labelledby="amc-process-title" className={sectionClass}>
      <Heading id="amc-process-title" block={block} />
      <ol className={`mt-10 grid gap-3 sm:grid-cols-2 sm:gap-4 ${processGrid[columns]}`}>
        {steps.map((step, i) => {
          const last = i === steps.length - 1
          const handsOn = !last && (i + 1) % columns !== 0
          return (
            <li
              key={step.title}
              data-reveal
              style={delay(i * 100)}
              className={`relative flex gap-4 rounded-[1.25rem] border p-5 sm:flex-col sm:gap-0 sm:p-6 transition-[border-color,box-shadow] duration-300 ${
                last
                  ? 'border-[var(--hp-accent)] bg-[var(--hp-card)] shadow-[0_32px_64px_-48px_rgba(14,116,144,0.55)]'
                  : 'border-[var(--hp-line)] bg-[var(--hp-card)] hover:border-[var(--hp-line-strong)] hover:shadow-[0_28px_56px_-44px_rgba(12,29,51,0.35)]'
              }`}
            >
              <span
                aria-hidden="true"
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl font-display text-[15px] font-semibold tabular-nums ${
                  last ? 'bg-[var(--hp-accent)] text-white' : 'bg-[var(--hp-accent-bg)] text-[var(--hp-accent)]'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="sm:mt-6">
                <h3 className="pt-2.5 font-display text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-[var(--hp-ink)] sm:pt-0">{step.title}</h3>
                {step.description && <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--hp-body)]">{step.description}</p>}
              </div>
              {handsOn && (
                <span
                  aria-hidden="true"
                  className="absolute -right-6 top-[1.875rem] z-[1] hidden h-8 w-8 place-items-center rounded-full border border-[var(--hp-line-strong)] bg-[var(--hp-card)] text-[var(--hp-accent)] lg:grid"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              )}
            </li>
          )
        })}
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
      <div data-reveal className="hp-band grid gap-6 rounded-[1.5rem] p-4 sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-12">
        <div className="lg:col-span-5">
          <Eyebrow>{f.eyebrow}</Eyebrow>
          <SectionTitle id="amc-areas-title" heading={f.heading} soft={f.heading_soft} softBlock className="mt-4" />
          {f.text && <p className="mt-4 text-[15.5px] leading-relaxed text-[var(--hp-body)]">{f.text}</p>}
        </div>
        {/* The areas as location tiles on a soft dotted panel, like pins on a map. */}
        <div className="relative overflow-hidden rounded-[1.25rem] border border-[var(--hp-line)] bg-[var(--hp-soft)] p-2 sm:p-4 lg:col-span-7">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(14,116,144,0.16)_1px,transparent_1px)] [background-size:18px_18px]" />
          <ul className="relative grid grid-cols-2 gap-2 sm:grid-cols-3">
            {areas.map((area) => (
              <li key={area} className="flex items-center gap-2 rounded-xl border border-[var(--hp-line)] bg-[var(--hp-card)] px-2.5 py-2.5 text-[14px] leading-snug sm:gap-2.5 sm:px-3.5 sm:py-3 sm:text-[14.5px] font-medium text-[var(--hp-ink)] shadow-[0_1px_2px_rgba(12,29,51,0.04)]">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[var(--hp-accent)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
                  <circle cx="12" cy="9.5" r="2.5" />
                </svg>
                <span className="min-w-0">{area}</span>
              </li>
            ))}
          </ul>
        </div>
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
    <div className="space-y-16 pb-16 lg:space-y-24 lg:pb-24">
      {shown.map((section) => {
        const { lead, items, closing } = blockParts(section.text)
        const button = section.button_label && section.button_link ? (
          <Button href={section.button_link} className="mt-7">
            {section.button_label}
          </Button>
        ) : null
        return (
          <section key={section.id} aria-label={section.heading || section.name || undefined} className="page-container">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
              <div data-reveal className={items.length ? 'lg:sticky lg:top-28 lg:col-span-5 lg:self-start' : 'lg:col-span-6'}>
                {section.heading && <h2 className="hp-h2">{section.heading}</h2>}
                {lead.map((p) => (
                  <p key={p} className="hp-lead mt-5">
                    {p}
                  </p>
                ))}
                {button}
              </div>

              {items.length > 0 ? (
                <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:col-span-7">
                  {items.map((item, i) => (
                    <li
                      key={item.label}
                      data-reveal
                      style={delay((i % 2) * 90)}
                      className={`hp-band flex flex-col rounded-[1.25rem] p-5 sm:p-6 ${items.length % 2 === 1 && i === items.length - 1 ? 'sm:col-span-2' : ''}`}
                    >
                      <h3 className="flex items-center gap-2.5 font-display text-[1.0625rem] font-semibold leading-snug text-[var(--hp-ink)]">
                        <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-[var(--hp-accent)]" />
                        {item.label}
                      </h3>
                      <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--hp-body)] first-letter:uppercase">{item.text}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                section.image_url && (
                  <figure data-reveal className="hp-frame relative aspect-[4/3] overflow-hidden rounded-[1.75rem] lg:col-span-6">
                    <Uploaded src={section.image_url} alt={section.image_alt || section.heading} sizes="(min-width: 1024px) 45vw, 100vw" />
                  </figure>
                )
              )}
            </div>

            {items.length > 0 && section.image_url && (
              <figure data-reveal className="hp-frame relative mt-8 aspect-[21/9] overflow-hidden rounded-[1.75rem]">
                <Uploaded src={section.image_url} alt={section.image_alt || section.heading} sizes="100vw" />
              </figure>
            )}

            {closing.length > 0 && (
              <div data-reveal className="mt-6 flex items-start gap-3 rounded-2xl border border-[rgba(14,116,144,0.22)] bg-[var(--hp-accent-bg)] px-5 py-4 sm:px-6">
                <span className="hp-tick mt-0.5 !bg-[var(--hp-card)]">
                  <Check />
                </span>
                <div className="space-y-2">
                  {closing.map((p) => (
                    <p key={p} className="text-[15.5px] font-medium leading-relaxed text-[var(--hp-ink)]">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            )}
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
