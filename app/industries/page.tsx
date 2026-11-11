import '../home.css'
import '../about.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import HomeMotion from '../components/home/HomeMotion'
import { ArrowRight, Button, Check, delay } from '../components/home/ui'
import IndustriesNav from '../components/industries/IndustriesNav'
import { IndustryIcon } from '../components/industries/IndustryIcon'
import JsonLd from '../components/JsonLd'
import { ServiceIcon } from '../components/ServiceIcon'
import { getPageHero, getPageMetadata } from '../lib/cms'
import { getServices } from '../lib/db'
import { getHeaderModel } from '../lib/header-data'
import { getHomeBlock } from '../lib/home-blocks'
import { lines } from '../lib/home-content'
import { pageServices, serviceTab } from '../lib/service-tabs'
import { groupAnchors, namedServices } from '../lib/services-page'
import { breadcrumbSchema, graph } from '../lib/structured-data'

export const revalidate = 3600

const PATH = '/industries'

const fallbackTitle = 'IT Support by Industry in Dubai | Byteflow Information Technology'
const fallbackDescription =
  'IT support, cyber security, cloud and networks for clinics, schools, real estate, retail, logistics, hospitality, law firms and offices across the UAE.'

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getPageMetadata('industries')
  const title = cms?.title || fallbackTitle
  const description = cms?.description || fallbackDescription
  return {
    ...cms,
    title,
    description,
    alternates: { canonical: PATH },
    openGraph: { title, description, ...cms?.openGraph, url: PATH, type: 'website' },
  }
}

/**
 * The industries we work in, without client names. The banner is the page's
 * hero (Pages → Industries). Each industry ("Industries page" in the admin)
 * is a card: what usually gets in the way there, how we handle it, and the
 * services we use, which link to their pages. The list of industries stays
 * beside the cards on wide screens. FAQs and a call to action added for this
 * page in the admin follow it (layout.tsx).
 */
export default async function IndustriesPage() {
  const [dbServices, header, hero, block] = await Promise.all([getServices(), getHeaderModel(), getPageHero('industries'), getHomeBlock('industries_list')])
  const tabs = (dbServices.length ? dbServices : pageServices).map(serviceTab)
  const copy = block.fields
  const industries = block.lists.industries
  const anchors = groupAnchors(
    industries.map((industry) => industry.title),
    'industry',
  )

  const heading = hero?.hero_heading || 'IT support built around'
  const highlight = hero?.hero_highlight || (hero?.hero_heading ? '' : 'how your industry works.')

  return (
    <div className="hp">
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Industries', path: PATH },
          ]),
        )}
      />
      <HomeMotion />

      <section aria-labelledby="industries-title" className="relative isolate">
        <div aria-hidden="true" className="ab-hero-bg pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem]" />
        <div className="page-container grid gap-8 pb-12 pt-10 sm:pt-14 lg:grid-cols-12 lg:items-end lg:gap-12 lg:pb-16">
          <div className="lg:col-span-7">
            <p className="hp-badge hp-enter-fade" style={delay(0)}>
              <span aria-hidden="true" className="hp-dot" />
              {hero?.hero_label || 'Industries we serve'}
            </p>
            <h1 id="industries-title" className="hp-h1 mt-6 hp-enter" style={delay(80)}>
              {heading}
              {highlight && ' '}
              {highlight && <span className="hp-h1-accent block">{highlight}</span>}
            </h1>
          </div>
          <div className="lg:col-span-5 lg:pb-2">
            <p className="hp-lead hp-enter" style={delay(200)}>
              {hero?.hero_description ||
                'Every sector runs on different systems and carries different risks. Here is what usually gets in the way in yours, and how we handle it.'}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <span className="block hp-enter sm:inline-block" style={delay(300)}>
                <Button href={hero?.hero_primary_link || header.cta.href} className="w-full sm:w-auto">
                  {hero?.hero_primary_label || header.cta.label}
                </Button>
              </span>
              <span className="block hp-enter sm:inline-block" style={delay(380)}>
                <Button href={hero?.hero_secondary_link || '/services'} variant="ghost" className="w-full sm:w-auto">
                  {hero?.hero_secondary_label || 'See all services'}
                </Button>
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="page-container grid grid-cols-1 gap-8 pb-16 lg:grid-cols-12 lg:gap-12 lg:pb-24">
        <div className="lg:sticky lg:top-28 lg:col-span-3 lg:self-start">
          <IndustriesNav label={copy.nav_label} industries={industries.map((industry, i) => ({ anchor: anchors[i], title: industry.title, icon: industry.icon }))} />
        </div>

        <div className="space-y-6 lg:col-span-9">
          {industries.map((industry, i) => {
            const challenges = lines(industry.challenges ?? '')
            const approach = lines(industry.approach ?? '')
            const services = namedServices(industry, tabs)
            return (
              <article key={anchors[i]} id={anchors[i]} aria-labelledby={`${anchors[i]}-title`} data-reveal className="hp-band scroll-mt-28 overflow-hidden rounded-[1.5rem]">
                <header className="flex items-start gap-5 p-6 sm:p-8">
                  <span aria-hidden="true" className="hp-svc-icon hp-svc-icon-lg">
                    <IndustryIcon icon={industry.icon} />
                  </span>
                  <div className="min-w-0">
                    <h2 id={`${anchors[i]}-title`} className="hp-h3-lg">
                      {industry.title}
                    </h2>
                    {industry.summary && <p className="mt-2 max-w-2xl text-[16px] leading-relaxed text-[var(--hp-body)]">{industry.summary}</p>}
                  </div>
                </header>

                {(challenges.length > 0 || approach.length > 0) && (
                  <div className="grid border-t border-[var(--hp-line)] md:grid-cols-2">
                    {challenges.length > 0 && (
                      <div className="p-6 sm:px-8 sm:py-7">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--hp-muted)]">{copy.challenges_label}</p>
                        <ul className="mt-4 grid gap-3">
                          {challenges.map((item) => (
                            <li key={item} className="flex items-start gap-3 text-[15px] leading-snug text-[var(--hp-body)]">
                              <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--hp-line-strong)]" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {approach.length > 0 && (
                      <div className="border-t border-[var(--hp-line)] bg-[var(--hp-soft)] p-6 sm:px-8 sm:py-7 md:border-l md:border-t-0">
                        <p className="hp-eyebrow !text-[12px] !tracking-[0.14em]">{copy.approach_label}</p>
                        <ul className="mt-4 grid gap-3">
                          {approach.map((item) => (
                            <li key={item} className="flex items-start gap-3 text-[15px] font-medium leading-snug text-[var(--hp-ink)]">
                              <span className="hp-tick mt-px">
                                <Check />
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {services.length > 0 && (
                  <footer className="flex flex-wrap items-center gap-2 border-t border-[var(--hp-line)] px-6 py-5 sm:gap-3 sm:px-8">
                    <span className="w-full text-[13px] font-semibold text-[var(--hp-muted)] sm:mr-2 sm:w-auto">{copy.services_label}</span>
                    {services.map((service) => (
                      <Link key={service.slug} href={service.href} className="hp-topic group/svc transition-colors">
                        <ServiceIcon link={service.href} className="h-4 w-4 text-[var(--hp-accent)]" />
                        {service.title}
                        <ArrowRight className="h-3.5 w-3.5 text-[var(--hp-muted)] transition-transform group-hover/svc:translate-x-0.5" />
                      </Link>
                    ))}
                  </footer>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
