import '../home.css'
import '../about.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import AmcPlans from '../components/amc/AmcPlans'
import {
  AmcBreakFix,
  AmcCosts,
  AmcCoverage,
  AmcFaq,
  AmcHighlights,
  AmcIndustries,
  AmcIntro,
  AmcPageBlocks,
  AmcPreventive,
  AmcProcess,
  AmcRelated,
  AmcReviews,
  AmcScope,
  AmcServices,
  AmcSla,
  AmcWhy,
} from '../components/amc/AmcSections'
import Contact from '../components/Contact'
import HomeMotion from '../components/home/HomeMotion'
import { ArrowRight, Button, Check, delay } from '../components/home/ui'
import { PhoneIcon } from '../components/InlineIcons'
import JsonLd from '../components/JsonLd'
import PageCta from '../components/PageCta'
import { amcSections, priceNumber, type AmcSectionKey } from '../lib/amc-page'
import { getCustomSections, getFaqsForSlug, getPageHero, getPageMetadata, getSiteSettings, getTestimonials } from '../lib/cms'
import { getServices } from '../lib/db'
import { getHeaderModel } from '../lib/header-data'
import { getHomeBlock } from '../lib/home-blocks'
import { lines } from '../lib/home-content'
import { pageServices, serviceTab } from '../lib/service-tabs'
import { services as servicePages } from '../lib/services-data'
import { absoluteUrl, breadcrumbSchema, faqPageSchema, graph, serviceSchema } from '../lib/structured-data'

const SLUG = 'it-amc-services-dubai'
const PATH = `/${SLUG}`

// "IT AMC support Dubai" is the query this page already ranks closest to
// — position 10.4 on 450 impressions — and the old title never contained
// that phrase. "Services" is kept because "IT AMC services in Dubai" is the
// larger term at 718 impressions, even though it sits further back. The
// SEO fields under Pages → IT AMC Services replace these once filled in.
const fallbackTitle = 'IT AMC Support & Services in Dubai | Byteflow'
const fallbackDescription =
  'IT AMC support across Dubai, Business Bay, JLT and WTC included. One fixed monthly fee, 2-hour on-site response, 24/7 monitoring and no surprise bills.'

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getPageMetadata(SLUG)
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

const page = servicePages.find((service) => service.slug === SLUG)!

/**
 * The IT AMC page. The banner is the page's hero (Heroes screen: words,
 * buttons and picture), with the figures under its buttons and the plans
 * summed up beside it. Under it, the sections the admin's "IT AMC page"
 * screen switches on, in the order set on its Sections tab, the blocks added
 * for this page under Pages (with its call to action) placed there as one.
 */
export default async function Page() {
  const [hero, header, settings, dbServices, cmsFaqs, customSections, reviews, layout, figures, plans, ...blocks] = await Promise.all([
    getPageHero(SLUG),
    getHeaderModel(),
    getSiteSettings(),
    getServices(),
    getFaqsForSlug(SLUG),
    getCustomSections(SLUG),
    getTestimonials(),
    getHomeBlock('amc_layout'),
    getHomeBlock('amc_figures'),
    getHomeBlock('amc_plans'),
    getHomeBlock('amc_highlights'),
    getHomeBlock('amc_intro'),
    getHomeBlock('amc_services'),
    getHomeBlock('amc_preventive'),
    getHomeBlock('amc_costs'),
    getHomeBlock('amc_breakfix'),
    getHomeBlock('amc_industries'),
    getHomeBlock('amc_benefits'),
    getHomeBlock('amc_process'),
    getHomeBlock('amc_sla'),
    getHomeBlock('amc_areas'),
    getHomeBlock('amc_excluded'),
    getHomeBlock('amc_reviews'),
    getHomeBlock('amc_faq'),
    getHomeBlock('amc_contact'),
    getHomeBlock('amc_related'),
    getHomeBlock('home_faq'),
  ])
  const [highlights, intro, services, preventive, costs, breakfix, industries, why, process, sla, areas, scope, reviewsBlock, faq, contact, related, faqLabels] = blocks

  const tabs = (dbServices.length ? dbServices : pageServices).map(serviceTab)
  const title = tabs.find((tab) => tab.slug === SLUG)?.title ?? page.title
  const heading = hero?.hero_heading || 'IT AMC support in Dubai,'
  const highlight = hero?.hero_highlight || (hero?.hero_heading ? '' : 'one fixed monthly fee.')
  const description = hero?.hero_description || page.description
  const phone = String(settings?.header_phone || '+971 54 328 2042')
  const planList = plans.lists.plans
  const order = amcSections(layout.lists.sections)

  // The page's own questions, then those added for it on the FAQs screen.
  const allFaqs = [
    ...faq.lists.faqs.map((item) => ({ question: item.title, answer: item.description, category: title })),
    ...cmsFaqs.map((item) => ({ question: item.question, answer: item.answer, category: item.category || title })),
  ]

  const sections: Record<AmcSectionKey, ReactNode> = {
    highlights: <AmcHighlights block={highlights} />,
    intro: <AmcIntro block={intro} />,
    services: <AmcServices block={services} />,
    preventive: <AmcPreventive block={preventive} />,
    plans: <AmcPlans content={plans} />,
    costs: <AmcCosts block={costs} />,
    breakfix: <AmcBreakFix block={breakfix} />,
    industries: <AmcIndustries block={industries} />,
    why: <AmcWhy block={why} />,
    process: <AmcProcess block={process} />,
    sla: <AmcSla block={sla} />,
    coverage: <AmcCoverage block={areas} />,
    scope: <AmcScope block={scope} />,
    reviews: <AmcReviews block={reviewsBlock} reviews={reviews} />,
    // The page's own blocks (Pages → IT AMC Services) and its call to action.
    pageblocks: (
      <>
        <AmcPageBlocks sections={customSections} />
        <PageCta embedded />
      </>
    ),
    faq: (
      <AmcFaq
        block={faq}
        labels={faqLabels}
        faqs={allFaqs}
        contact={{
          phone: `tel:${phone.replace(/[^+\d]/g, '')}`,
          whatsapp: String(settings?.whatsapp_link || '') || `https://wa.me/${phone.replace(/\D/g, '')}`,
          hours: String(settings?.business_hours || '').trim(),
        }}
      />
    ),
    contact: (
      <div id="contact" className="scroll-mt-28">
        <Contact
          settings={(settings ?? {}) as never}
          cta={{
            eyebrow: contact.fields.eyebrow,
            heading: contact.fields.heading,
            heading_soft: contact.fields.heading_soft,
            intro: contact.fields.intro,
            call_label: contact.fields.call_label,
            whatsapp_label: contact.fields.whatsapp_label,
            promises: lines(contact.fields.promises ?? ''),
          }}
        />
      </div>
    ),
    related: <AmcRelated block={related} tabs={tabs} />,
  }

  const offers = planList
    .map((plan) => ({ plan, price: priceNumber(plan.price) }))
    .filter((offer) => offer.price !== null)
    .map(({ plan, price }) => ({
      '@type': 'Offer',
      name: `${plan.title} — ${title}`,
      price,
      priceCurrency: 'AED',
      url: absoluteUrl(`${PATH}#plans`),
    }))

  return (
    <div className="hp">
      <JsonLd
        data={graph(
          {
            ...serviceSchema({ name: title, description, path: PATH, image: hero?.hero_image || hero?.hero_background_image || '' }),
            ...(offers.length ? { offers } : {}),
          },
          order.includes('faq') ? faqPageSchema(allFaqs) : null,
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: title, path: PATH },
          ]),
        )}
      />
      <HomeMotion />

      {/* 1. The banner: the words, buttons and figures; the picture and the plans in brief. */}
      <section aria-labelledby="amc-title" className="relative isolate">
        <div aria-hidden="true" className="ab-hero-bg pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem]" />
        <div className="page-container grid gap-10 pb-16 pt-10 sm:pt-14 lg:grid-cols-12 lg:items-center lg:gap-14 lg:pb-20">
          <div className="lg:col-span-7">
            <p className="hp-badge hp-enter-fade" style={delay(0)}>
              <span aria-hidden="true" className="hp-dot" />
              {hero?.hero_label || title}
            </p>
            <h1 id="amc-title" className="hp-h1 mt-6 hp-enter" style={delay(80)}>
              {heading}
              {highlight && ' '}
              {highlight && <span className="hp-h1-accent block">{highlight}</span>}
            </h1>
            <p className="hp-lead mt-6 max-w-xl hp-enter" style={delay(200)}>
              {description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <span className="block hp-enter sm:inline-block" style={delay(300)}>
                <Button href={hero?.hero_primary_link || header.cta.href} className="w-full sm:w-auto">
                  {hero?.hero_primary_label || header.cta.label}
                </Button>
              </span>
              <span className="block hp-enter sm:inline-block" style={delay(380)}>
                <Button href={hero?.hero_secondary_link || '#plans'} variant="ghost" className="w-full sm:w-auto">
                  {hero?.hero_secondary_label || plans.fields.compare_label}
                </Button>
              </span>
              <a
                href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                className="inline-flex items-center gap-2 px-1 text-[15px] font-semibold text-[var(--hp-ink)] transition-colors hover:text-[var(--hp-accent)] hp-enter"
                style={delay(440)}
              >
                <PhoneIcon className="h-4 w-4 text-[var(--hp-accent)]" />
                {phone}
              </a>
            </div>
            {figures.lists.stats.length > 0 && (
              <dl className="mt-10 grid max-w-xl grid-cols-3 border-t border-[var(--hp-line)] pt-6 hp-enter" style={delay(480)}>
                {figures.lists.stats.map((row) => (
                  <div key={row.title + row.description} className="flex flex-col border-l border-[var(--hp-line)] px-3 first:border-l-0 first:pl-0 sm:px-5">
                    <dt className="order-2 mt-1.5 text-[12.5px] leading-snug text-[var(--hp-body)] sm:text-[13.5px]">{row.description}</dt>
                    <dd className="order-1 font-display text-[1.625rem] font-semibold leading-none tracking-[-0.03em] text-[var(--hp-ink)] sm:text-[2.125rem]">{row.title}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {(hero?.hero_image || planList.length > 0) && (
            <aside aria-labelledby={planList.length ? 'amc-card-title' : undefined} aria-label={planList.length ? undefined : title} className="lg:col-span-5">
              {/* With a picture (Heroes → picture), the plans card sits over its lower edge. */}
              {hero?.hero_image && (
                <figure className="hp-frame relative aspect-[4/3] overflow-hidden rounded-[1.75rem] hp-enter-image" style={delay(220)}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- an uploaded picture of any origin, above the fold */}
                  <img src={hero.hero_image} alt={hero.hero_image_alt || title} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
                </figure>
              )}
              {planList.length > 0 && (
                <div
                  className={`hp-band relative overflow-hidden rounded-[1.5rem] p-6 hp-enter sm:p-8 ${hero?.hero_image ? 'z-10 mx-4 -mt-24 sm:mx-8' : ''}`}
                  style={delay(300)}
                >
                  <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(44,205,222,0.2),transparent_68%)]" />
                  <p id="amc-card-title" className="hp-eyebrow">
                    {plans.fields.card_label}
                  </p>
                  <p className="mt-3 flex items-baseline gap-2">
                    <span className="font-display text-[3rem] font-semibold leading-none tracking-[-0.03em] text-[var(--hp-ink)]">{planList[0].price}</span>
                    <span className="text-[14px] text-[var(--hp-muted)]">{plans.fields.unit}</span>
                  </p>
                  <ul className="mt-6 divide-y divide-[var(--hp-line)] border-y border-[var(--hp-line)]">
                    {planList.map((plan) => (
                      <li key={plan.title} className="flex items-center justify-between gap-4 py-3.5">
                        <span className="flex items-center gap-3 text-[15px] font-semibold text-[var(--hp-ink)]">
                          <span className="hp-tick">
                            <Check />
                          </span>
                          {plan.title}
                        </span>
                        <span className="font-display text-[15px] font-semibold tabular-nums text-[var(--hp-accent)]">{plan.price}</span>
                      </li>
                    ))}
                  </ul>
                  {plans.fields.note && <p className="mt-4 text-[13px] leading-relaxed text-[var(--hp-muted)]">{plans.fields.note}</p>}
                  <a href="#plans" className="hp-textlink mt-5">
                    {plans.fields.compare_label}
                    <ArrowRight className="hp-arrow h-4 w-4" />
                  </a>
                </div>
              )}
            </aside>
          )}
        </div>
      </section>

      {order.map((key) => (
        <div key={key}>{sections[key]}</div>
      ))}
    </div>
  )
}
