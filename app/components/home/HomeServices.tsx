import Link from 'next/link'
import { getServices } from '../../lib/db'
import { getHeaderModel } from '../../lib/header-data'
import { getHomeBlock } from '../../lib/home-blocks'
import { orderedTabs, pageServices, type ServiceTab } from '../../lib/service-tabs'
import { ServiceIcon } from '../ServiceIcon'
import ServiceFilter from './ServiceFilter'
import { ArrowRight, Button, Check, Eyebrow, SectionTitle, TextLink, delay } from './ui'

/**
 * One service as a wide card: its story (icon, eyebrow, title, tagline,
 * description and buttons) on the left, its highlights on a soft-blue field
 * with the hero's diagonal edge on the right. Every service uses the same
 * layout.
 */
function ServiceCard({ tab, heading: Heading = 'h4' }: { tab: ServiceTab; heading?: 'h3' | 'h4' }) {
  return (
    <article data-reveal className="hp-svc-feature relative grid overflow-hidden rounded-[1rem] lg:grid-cols-12">
      <div className="relative z-[1] p-6 sm:p-9 lg:col-span-7 lg:py-11 lg:pl-11 lg:pr-6">
        <div className="flex items-center gap-4">
          <span aria-hidden="true" className="hp-svc-icon hp-svc-icon-lg">
            <ServiceIcon link={tab.href} className="h-6 w-6" />
          </span>
          <Eyebrow>{tab.eyebrow}</Eyebrow>
        </div>
        <Heading className="hp-h3-lg mt-6">{tab.title}</Heading>
        {tab.subtitle && <p className="mt-2 text-[17px] font-semibold leading-snug text-[var(--hp-accent)]">{tab.subtitle}</p>}
        <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-[var(--hp-body)]">{tab.text}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
          <Button href={tab.button.href}>{tab.button.label}</Button>
          <TextLink href={tab.href}>Explore {tab.title}</TextLink>
        </div>
      </div>

      <div className="hp-svc-feature-side relative flex flex-col justify-center p-6 sm:p-9 lg:col-span-5 lg:py-11 lg:pl-28 lg:pr-11">
        {tab.bullets.length > 0 && (
          <ul className="grid gap-3">
            {tab.bullets.map((bullet) => (
              <li key={bullet} className="flex items-center gap-3 rounded-lg border border-[var(--hp-line)] bg-[var(--hp-card)] px-4 py-3 text-[15px] font-medium text-[var(--hp-ink)]">
                <span className="hp-tick">
                  <Check />
                </span>
                {bullet}
              </li>
            ))}
          </ul>
        )}
        {tab.caption && (
          <p className="mt-5 flex items-center gap-2 text-[13.5px] font-semibold text-[var(--hp-accent)]">
            <span aria-hidden="true" className="hp-dot" />
            {tab.caption}
          </p>
        )}
      </div>
    </article>
  )
}

/**
 * One of the other services, compact: icon and its number (the wide card is
 * 01), title, tagline and the whole description, then the first three
 * highlights and the caption on a soft-blue base cut on the hero's diagonal,
 * like the wide card's side. The bases sit on the cards' bottoms, so they line
 * up across a row whatever the wording above them. `group` is the header menu
 * group the tabs filter by.
 */
export function ServiceTile({
  tab,
  number,
  group = '',
  swipe = true,
  stagger = (number - 2) % 4,
}: {
  tab: ServiceTab
  number: number
  group?: string
  /** On phones, one of a row of cards to swipe through (the home page). */
  swipe?: boolean
  /** Its place in the row, for the reveal's delay. */
  stagger?: number
}) {
  return (
    <li data-reveal data-group={group} style={delay(stagger * 90)} className={swipe ? 'w-[82%] shrink-0 snap-start sm:w-auto' : ''}>
      <article className="hp-svc-card group relative flex h-full flex-col overflow-hidden rounded-[0.75rem]">
        <div className="p-6 pb-7 sm:p-7 sm:pb-8">
          <div className="flex items-start justify-between gap-3">
            <span aria-hidden="true" className="hp-svc-icon">
              <ServiceIcon link={tab.href} className="h-5 w-5" />
            </span>
            <span aria-hidden="true" className="hp-svc-num font-display">
              {String(number).padStart(2, '0')}
            </span>
          </div>
          <h3 className="mt-6 font-display text-[1.3125rem] font-semibold leading-snug tracking-[-0.02em] text-[var(--hp-ink)]">{tab.title}</h3>
          {tab.subtitle && <p className="mt-1.5 text-[14.5px] font-semibold leading-snug text-[var(--hp-accent)]">{tab.subtitle}</p>}
          {tab.text && <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--hp-body)]">{tab.text}</p>}
        </div>

        <div className="hp-svc-base mt-auto flex flex-col px-6 pb-6 pt-9 sm:px-7 sm:pb-7">
          {tab.bullets.length > 0 && (
            <ul className="grid gap-2.5">
              {tab.bullets.slice(0, 3).map((bullet) => (
                <li key={bullet} className="flex items-center gap-2.5 text-[14px] font-medium text-[var(--hp-ink)]">
                  <span className="hp-tick">
                    <Check />
                  </span>
                  <span className="truncate">{bullet}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6 flex items-center justify-between gap-4">
            <span className="flex min-w-0 items-center gap-2 text-[13px] font-semibold text-[var(--hp-accent)]">
              {tab.caption && (
                <>
                  <span aria-hidden="true" className="hp-dot" />
                  <span className="truncate">{tab.caption}</span>
                </>
              )}
            </span>
            {/* The whole card opens the service page. */}
            <Link href={tab.href} aria-label={`Explore ${tab.title}`} className="hp-svc-go after:absolute after:inset-0">
              <ArrowRight />
            </Link>
          </div>
        </div>
      </article>
    </li>
  )
}

/**
 * Services: every published service in the header menu's order, each with its
 * own words from the admin. The first is the wide card; the rest are compact,
 * numbered cards in one grid, with tabs above to filter them by header menu
 * group. Icons only, no photographs.
 */
export default async function HomeServices() {
  const [dbServices, intro, header] = await Promise.all([getServices(), getHomeBlock('home_services_intro'), getHeaderModel()])
  const copy = intro.fields
  const menuHrefs = header.services.groups.flatMap((group) => group.items.map((item) => item.href))
  const tabs = orderedTabs(dbServices.length ? dbServices : pageServices, menuHrefs)
  if (!tabs.length) return null
  const [featured, ...rest] = tabs

  // The tabs are the header menu's groups ("IT Support & Infrastructure",
  // "Cloud & Security"…) that hold at least one of these cards. A card the
  // menu doesn't group shows under the first tab only.
  const path = (href: string) => href.split(/[?#]/)[0].replace(/\/$/, '')
  const groupOf = new Map<string, string>()
  header.services.groups.forEach((group, i) => {
    for (const item of group.items) if (!groupOf.has(path(item.href))) groupOf.set(path(item.href), `g${i}`)
  })
  const groups = header.services.groups
    .map((group, i) => ({ id: `g${i}`, title: group.title, count: rest.filter((tab) => groupOf.get(tab.href) === `g${i}`).length }))
    .filter((group) => group.count)

  return (
    <section id="services" aria-labelledby="services-title" className="hp-section scroll-mt-28">
      <div className="page-container">
        <header data-reveal className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <SectionTitle id="services-title" heading={copy.heading} soft={copy.heading_soft} className="mt-5" />
          </div>
          <p className="hp-lead max-w-md lg:col-span-5 lg:justify-self-end">{copy.intro}</p>
        </header>

        <div className="mt-12 lg:mt-14">
          <ServiceCard tab={featured} heading="h3" />
        </div>

        {rest.length > 0 && (
          <ServiceFilter allLabel={copy.all_label || 'All services'} groups={groups} total={rest.length}>
            {/* Phones swipe through the cards; from tablets up they sit in a grid. */}
            <ul className={`-mx-4 flex items-start snap-x snap-mandatory sm:items-stretch scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-4 ${groups.length > 1 ? 'mt-5' : 'mt-4'}`}>
              {rest.map((tab, index) => (
                <ServiceTile key={tab.slug} tab={tab} number={index + 2} group={groupOf.get(tab.href) ?? ''} />
              ))}
            </ul>
          </ServiceFilter>
        )}
      </div>
    </section>
  )
}
