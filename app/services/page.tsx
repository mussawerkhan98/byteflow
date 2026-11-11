import '../home.css'
import '../about.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import HomeMotion from '../components/home/HomeMotion'
import { ServiceTile } from '../components/home/HomeServices'
import { ArrowRight, Button, delay } from '../components/home/ui'
import { WhatsAppIcon } from '../components/InlineIcons'
import JsonLd from '../components/JsonLd'
import { getPageHero, getPageMetadata, getSiteFigures, getSiteSettings } from '../lib/cms'
import { getServices } from '../lib/db'
import { getHeaderModel } from '../lib/header-data'
import { groupedTabs, pageServices, serviceTab } from '../lib/service-tabs'
import { fillFigures, type SiteFigures } from '../lib/site-figures'
import { breadcrumbSchema, graph, serviceListSchema } from '../lib/structured-data'

export const revalidate = 3600

const PATH = '/services'

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
 * Every service on one page, for the menu's "View all services". The banner
 * is the page's hero (Pages → Services); the services are the admin's
 * Services records under the header menu's groups (Header menu), on the home
 * page's cards; the closing strip is the Services menu's own footer. FAQs and
 * a call to action added for this page in the admin follow it (layout.tsx).
 */
export default async function ServicesPage() {
  const [dbServices, header, hero, figures, settings] = await Promise.all([
    getServices(),
    getHeaderModel(),
    getPageHero('services'),
    getSiteFigures(),
    getSiteSettings(),
  ])
  const tabs = (dbServices.length ? dbServices : pageServices).map(serviceTab)
  const groups = groupedTabs(tabs, header.services.groups)
  const { footer } = header.services
  const phone = String(settings?.header_phone || '+971 54 328 2042')
  const whatsapp = String(settings?.whatsapp_url || '') || `https://wa.me/${phone.replace(/\D/g, '')}`

  const heading = hero?.hero_heading || 'IT services for Dubai businesses,'
  const highlight = hero?.hero_highlight || (hero?.hero_heading ? '' : 'from one accountable team.')
  const trust = hero?.hero_trust_line || fillFigures('Trusted by {clients} businesses · {rating}★ on Google · Since {founded}', figures)
  // The cards are numbered straight through, across the groups.
  const firstNumber = groups.map((_, g) => groups.slice(0, g).reduce((n, group) => n + group.tabs.length, 1))

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

      <section aria-labelledby="services-title" className="relative isolate">
        <div aria-hidden="true" className="ab-hero-bg pointer-events-none absolute inset-x-0 top-0 -z-10 h-[30rem]" />
        <div className="page-container grid gap-8 pb-12 pt-10 sm:pt-14 lg:grid-cols-12 lg:items-end lg:gap-12 lg:pb-16">
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
          </div>
          <div className="lg:col-span-5 lg:pb-2">
            <p className="hp-lead hp-enter" style={delay(200)}>
              {hero?.hero_description ||
                'Managed IT support, cyber security, cloud, websites and digital marketing for businesses across the UAE, all from one Dubai team.'}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
            {trust && (
              <p className="mt-6 flex items-center gap-2 text-[13.5px] font-semibold text-[var(--hp-accent)] hp-enter" style={delay(440)}>
                <span aria-hidden="true" className="hp-dot" />
                {trust}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* One band per header menu group: its name on the left (staying in
          view on wide screens), its services beside it. */}
      <div className="page-container space-y-14 pb-16 lg:space-y-20 lg:pb-24">
        {groups.map((group, g) => (
          <section
            key={group.title || 'more'}
            aria-labelledby={group.title ? `services-group-${g}` : undefined}
            aria-label={group.title ? undefined : 'More services'}
            className="grid gap-6 border-t border-[var(--hp-line)] pt-10 lg:grid-cols-12 lg:gap-10 lg:pt-12"
          >
            <div data-reveal className="lg:col-span-3 lg:sticky lg:top-28 lg:self-start">
              <span aria-hidden="true" className="font-display text-[13px] font-semibold tabular-nums text-[var(--hp-accent)]">
                {String(g + 1).padStart(2, '0')}
              </span>
              {group.title && (
                <h2 id={`services-group-${g}`} className="mt-2 font-display text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-[var(--hp-ink)] lg:text-[1.75rem]">
                  {group.title}
                </h2>
              )}
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-9 xl:grid-cols-3">
              {group.tabs.map((tab, i) => (
                <ServiceTile key={tab.slug} tab={tab} number={firstNumber[g] + i} swipe={false} stagger={i % 3} />
              ))}
            </ul>
          </section>
        ))}

        {footer.text && (
          <div
            data-reveal
            className="flex flex-col gap-4 rounded-[1rem] border border-[var(--hp-line)] bg-[var(--hp-card)] px-6 py-5 shadow-[var(--hp-shadow-sm)] sm:flex-row sm:items-center sm:justify-between sm:px-8"
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
      </div>
    </div>
  )
}
