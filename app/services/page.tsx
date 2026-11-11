import '../home.css'
import '../about.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import HomeMotion from '../components/home/HomeMotion'
import { ArrowRight, Button, Eyebrow, Photo, SectionTitle, delay } from '../components/home/ui'
import { WhatsAppIcon } from '../components/InlineIcons'
import JsonLd from '../components/JsonLd'
import ServiceRow from '../components/services/ServiceRow'
import ServicesCompare from '../components/services/ServicesCompare'
import ServicesFinder from '../components/services/ServicesFinder'
import ServicesSpotlight from '../components/services/ServicesSpotlight'
import { getPageHero, getPageMetadata, getSiteFigures, getSiteSettings } from '../lib/cms'
import { getServices } from '../lib/db'
import { getHeaderModel } from '../lib/header-data'
import { getHomeBlock } from '../lib/home-blocks'
import { pictureOf } from '../lib/home-content'
import { homePhotos, nthPhoto, type PhotoSlot } from '../lib/home-photos'
import { groupedTabs, pageServices, serviceTab } from '../lib/service-tabs'
import { finderSituations, groupAnchors, introFor, serviceSlugOf, shown, withServiceCount } from '../lib/services-page'
import type { SiteFigures } from '../lib/site-figures'
import { breadcrumbSchema, graph, serviceListSchema } from '../lib/structured-data'

export const revalidate = 3600

const PATH = '/services'

/** Beside each group on wide screens until one is uploaded for it: representative scenes, in group order. */
const groupPhotos: PhotoSlot[] = [homePhotos.needs[0], homePhotos.work[1], homePhotos.work[2]]

const fallbackTitle = 'IT Services in Dubai | Byteflow Information Technology'
const fallbackDescription = (figures: SiteFigures) =>
  `Managed IT support and AMC, cyber security, cloud, system integration, backup, websites, design and digital marketing for UAE businesses. Trusted by ${figures.clients} businesses since ${figures.founded}.`

export async function generateMetadata(): Promise<Metadata> {
  const [cms, figures] = await Promise.all([getPageMetadata('services'), getSiteFigures()])
  const title = cms?.title || fallbackTitle
  const description = cms?.description || fallbackDescription(figures)
  return {
    ...cms,
    title,
    description,
    alternates: { canonical: PATH },
    openGraph: { title, description, ...cms?.openGraph, url: PATH, type: 'website' },
  }
}

/**
 * Every service on one page, for the menu's "View all services".
 *
 * - The banner is the page's hero (Pages → Services), with the figures under
 *   its buttons and an index of every service beside it (Services page
 *   sections → Figures).
 * - The service finder: pick a situation, see the services for it.
 * - The catalogue: the admin's Services records under the Services menu's
 *   groups (Header menu), a row each, every group with its intro and photo
 *   (Group intros); then the Services menu's own footer line.
 * - The Services menu's "Most popular" offer as a plan card, and one team
 *   against separate vendors.
 *
 * The finder, the offer and the comparison are switched on or off under
 * Sections on this page. FAQs and a call to action added for this page in
 * the admin follow it (layout.tsx).
 */
export default async function ServicesPage() {
  const [dbServices, header, hero, settings, stats, finder, intros, compare, sections] = await Promise.all([
    getServices(),
    getHeaderModel(),
    getPageHero('services'),
    getSiteSettings(),
    getHomeBlock('services_stats'),
    getHomeBlock('services_finder'),
    getHomeBlock('services_groups'),
    getHomeBlock('services_compare'),
    getHomeBlock('services_sections'),
  ])
  const show = sections.fields
  const tabs = (dbServices.length ? dbServices : pageServices).map(serviceTab)
  const groups = groupedTabs(tabs, header.services.groups)
  const anchors = groupAnchors(groups.map((group) => group.title))
  // Numbered straight through, across the groups.
  const firstNumber = groups.map((_, g) => groups.slice(0, g).reduce((n, group) => n + group.tabs.length, 1))
  const figureRows = stats.lists.stats.map((row) => ({
    title: withServiceCount(row.title, tabs.length),
    description: withServiceCount(row.description, tabs.length),
  }))
  const situations = shown(show.finder) ? finderSituations(finder.lists.situations, tabs) : []
  const { featured, footer } = header.services
  const featuredTab = featured ? tabs.find((tab) => tab.slug === serviceSlugOf(featured.button.href)) : undefined
  const phone = String(settings?.header_phone || '+971 54 328 2042')
  const whatsapp = String(settings?.whatsapp_url || '') || `https://wa.me/${phone.replace(/\D/g, '')}`

  const heading = hero?.hero_heading || 'IT services for Dubai businesses,'
  const highlight = hero?.hero_highlight || (hero?.hero_heading ? '' : 'from one accountable team.')

  return (
    <div className="hp">
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Services', path: PATH },
          ]),
          serviceListSchema(tabs.map((tab) => ({ name: tab.title, path: tab.href }))),
        )}
      />
      <HomeMotion />

      {/* The banner: the words, buttons and figures on the left, and on the
          right an index of every service, each a jump to its row below. */}
      <section aria-labelledby="services-title" className="relative isolate">
        <div aria-hidden="true" className="ab-hero-bg pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38rem]" />
        <div className="page-container grid gap-10 pb-14 pt-10 sm:pt-14 lg:grid-cols-12 lg:items-center lg:gap-12 lg:pb-20">
          <div className="lg:col-span-7">
            <p className="hp-badge hp-enter-fade" style={delay(0)}>
              <span aria-hidden="true" className="hp-dot" />
              {hero?.hero_label || 'Our services'}
            </p>
            <h1 id="services-title" className="hp-h1 mt-6 hp-enter" style={delay(80)}>
              {heading}
              {highlight && ' '}
              {highlight && <span className="hp-h1-accent block">{highlight}</span>}
            </h1>
            <p className="hp-lead mt-6 max-w-xl hp-enter" style={delay(200)}>
              {hero?.hero_description ||
                'Managed IT support, cyber security, cloud, websites and digital marketing for businesses across the UAE, all from one Dubai team.'}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <span className="block hp-enter sm:inline-block" style={delay(300)}>
                <Button href={hero?.hero_primary_link || header.cta.href} className="w-full sm:w-auto">
                  {hero?.hero_primary_label || header.cta.label}
                </Button>
              </span>
              <span className="block hp-enter sm:inline-block" style={delay(380)}>
                <Button href={hero?.hero_secondary_link || '/it-amc-services-dubai'} variant="ghost" className="w-full sm:w-auto">
                  {hero?.hero_secondary_label || 'See IT AMC plans'}
                </Button>
              </span>
            </div>
            {figureRows.length > 0 && (
              <dl className="mt-10 grid max-w-xl grid-cols-3 border-t border-[var(--hp-line)] pt-6 hp-enter" style={delay(440)}>
                {figureRows.map((row) => (
                  <div key={row.title + row.description} className="flex flex-col border-l border-[var(--hp-line)] px-3 first:border-l-0 first:pl-0 sm:px-5">
                    <dt className="order-2 mt-1.5 text-[12.5px] leading-snug text-[var(--hp-body)] sm:text-[13.5px]">{row.description}</dt>
                    <dd className="order-1 font-display text-[1.625rem] font-semibold leading-none tracking-[-0.03em] text-[var(--hp-ink)] sm:text-[2.125rem]">{row.title}</dd>
                  </div>
                ))}
              </dl>
            )}
            {/* Only when set on the Heroes screen: the figures already say this by default. */}
            {hero?.hero_trust_line && (
              <p className="mt-6 flex items-center gap-2 text-[13.5px] font-semibold text-[var(--hp-accent)] hp-enter" style={delay(480)}>
                <span aria-hidden="true" className="hp-dot" />
                {hero.hero_trust_line}
              </p>
            )}
          </div>

          <nav aria-labelledby="services-index-title" className="hidden sm:block lg:col-span-5">
            <div className="hp-band rounded-[1.5rem] p-5 hp-enter-image sm:p-6" style={delay(260)}>
              <div className="flex items-center justify-between gap-4 px-2">
                <p id="services-index-title" className="hp-eyebrow">
                  {stats.fields.index_label}
                </p>
                <span className="hp-topic-count">{tabs.length}</span>
              </div>
              {groups.map((group, g) => (
                <div key={anchors[g]} className="mt-4 border-t border-[var(--hp-line)] pt-3">
                  {group.title && <p className="px-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--hp-muted)]">{group.title}</p>}
                  <ul className="mt-1.5 grid gap-x-2 sm:grid-cols-2">
                    {group.tabs.map((tab, i) => (
                      <li key={tab.slug}>
                        <a
                          href={`#${tab.slug}`}
                          className="group/index flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[14.5px] font-medium text-[var(--hp-ink)] transition-colors hover:bg-[var(--hp-soft)] hover:text-[var(--hp-accent)]"
                        >
                          <span aria-hidden="true" className="font-display text-[11.5px] font-semibold tabular-nums text-[var(--hp-accent)]">
                            {String(firstNumber[g] + i).padStart(2, '0')}
                          </span>
                          <span className="truncate">{tab.title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>
        </div>
      </section>

      {situations.length > 0 && (
        <section aria-labelledby="services-finder-title" className="page-container pb-16 lg:pb-24">
          <div data-reveal className="max-w-2xl">
            <Eyebrow>{finder.fields.eyebrow}</Eyebrow>
            <SectionTitle id="services-finder-title" heading={finder.fields.heading} soft={finder.fields.heading_soft} softBlock className="mt-4" />
          </div>
          <div data-reveal className="mt-10">
            <ServicesFinder situations={situations} resultLabel={finder.fields.result_label} />
          </div>
        </section>
      )}

      {/* The catalogue: one chapter per Services menu group, its name, intro
          and photo on the left (staying in view on wide screens), its
          services as rows beside it. */}
      <section aria-labelledby="services-catalogue-title" className="page-container pb-16 lg:pb-24">
        <div data-reveal className="max-w-2xl">
          <Eyebrow>{intros.fields.eyebrow}</Eyebrow>
          <SectionTitle id="services-catalogue-title" heading={intros.fields.heading} soft={intros.fields.heading_soft} softBlock className="mt-4" />
        </div>

        <div className="mt-10 space-y-12 lg:mt-14 lg:space-y-16">
          {groups.map((group, g) => {
            const intro = introFor(intros.lists.groups, group.title)
            const picture = intro && pictureOf(intro)
            const photo: PhotoSlot | null = picture ? { ...picture, brief: '' } : group.title ? nthPhoto(groupPhotos, g) : null
            return (
              <div
                key={anchors[g]}
                id={anchors[g]}
                role="group"
                aria-labelledby={group.title ? `${anchors[g]}-title` : undefined}
                aria-label={group.title ? undefined : 'More services'}
                className="grid scroll-mt-28 gap-6 lg:grid-cols-12 lg:gap-10"
              >
                <div data-reveal className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
                  <span aria-hidden="true" className="block h-1 w-10 rounded-full bg-[linear-gradient(90deg,var(--hp-accent),#2ccdde)]" />
                  {group.title && (
                    <h3 id={`${anchors[g]}-title`} className="mt-5 font-display text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-[var(--hp-ink)] lg:text-[1.75rem]">
                      {group.title}
                    </h3>
                  )}
                  {intro?.description && <p className="mt-3 max-w-md text-[15.5px] leading-relaxed text-[var(--hp-body)]">{intro.description}</p>}
                  {photo && (
                    <figure className="hp-frame relative mt-6 hidden aspect-[16/10] overflow-hidden rounded-[1.25rem] lg:block">
                      <Photo slot={photo} sizes="(min-width: 1024px) 30vw, 1px" />
                    </figure>
                  )}
                </div>
                <ul data-reveal className="hp-band divide-y divide-[var(--hp-line)] overflow-hidden rounded-[1.25rem] lg:col-span-8 lg:self-start">
                  {group.tabs.map((tab, i) => (
                    <ServiceRow key={tab.slug} tab={tab} number={firstNumber[g] + i} />
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {footer.text && (
          <div
            data-reveal
            className="mt-12 flex flex-col gap-4 rounded-[1rem] border border-dashed border-[var(--hp-line-strong)] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:mt-16"
          >
            <p className="text-[16px] text-[var(--hp-body)]">
              {footer.text}{' '}
              {footer.link && (
                <Link href={footer.link.href} className="font-semibold text-[var(--hp-ink)] underline-offset-4 hover:text-[var(--hp-accent)] hover:underline">
                  {footer.link.label}
                </Link>
              )}
            </p>
            {footer.whatsappLabel && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-[var(--hp-ink)] transition-colors hover:text-[var(--hp-accent)]"
              >
                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                {footer.whatsappLabel}
                <ArrowRight />
              </a>
            )}
          </div>
        )}
      </section>

      {featured && shown(show.spotlight) && <ServicesSpotlight featured={featured} tab={featuredTab} />}
      {shown(show.compare) && <ServicesCompare content={compare} />}
    </div>
  )
}
