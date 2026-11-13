import '../home.css'
import '../about.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { draftMode } from 'next/headers'
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
import JsonLd from '../components/JsonLd'
import PageCta from '../components/PageCta'
import PreviewBar, { HiddenSection } from '../components/PreviewBar'
import { PlansCard } from '../components/service-page/HeroCards'
import ServiceHero from '../components/service-page/ServiceHero'
import { amcSections, hiddenSections, type AmcSectionKey } from '../lib/amc-page'
import { getCustomSections, getFaqsForSlug, getPageHero, getSiteSettings, getTestimonials } from '../lib/cms'
import { getServices } from '../lib/db'
import { getHeaderModel } from '../lib/header-data'
import { getHomeBlock } from '../lib/home-blocks'
import { lines } from '../lib/home-content'
import { pricedPlans } from '../lib/plans'
import { seoMetadata } from '../lib/service-blocks'
import { pageServices, serviceTab } from '../lib/service-tabs'
import { services as servicePages } from '../lib/services-data'
import { absoluteUrl, breadcrumbSchema, faqPageSchema, graph, serviceSchema } from '../lib/structured-data'

const SLUG = 'it-amc-services-dubai'
const PATH = `/${SLUG}`

// The title and description are on the IT AMC page screen's SEO tab, which
// starts with the tuned ones ("IT AMC support Dubai" is the query this page
// ranks closest to). The SEO fields under Pages are not used for them: they
// still hold the seed's shorter wording.
export async function generateMetadata(): Promise<Metadata> {
  return seoMetadata(SLUG, await getHomeBlock('amc_seo'))
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
  // A preview from the admin shows the hidden sections and plans too, marked.
  const { isEnabled: preview } = await draftMode()
  const order = amcSections(layout.lists.sections, preview)
  const hidden = preview ? hiddenSections(layout.lists.sections) : new Set<string>()

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
    plans: <AmcPlans content={plans} preview={preview} />,
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

  const offers = pricedPlans(plans.lists.plans, plans.fields).map((plan) => ({
    '@type': 'Offer',
    name: `${plan.title} — ${title}`,
    price: plan.price,
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

      <ServiceHero
        label={hero?.hero_label || title}
        heading={heading}
        highlight={highlight}
        description={description}
        primary={{ label: hero?.hero_primary_label || header.cta.label, href: hero?.hero_primary_link || header.cta.href }}
        secondary={{ label: hero?.hero_secondary_label || plans.fields.compare_label, href: hero?.hero_secondary_link || '#plans' }}
        phone={phone}
        stats={figures.lists.stats}
        image={hero?.hero_image ? { src: hero.hero_image, alt: hero.hero_image_alt || title } : null}
        card={<PlansCard plans={plans} preview={preview} />}
      />

      {order.map((key) => (
        <div key={key}>{hidden.has(key) ? <HiddenSection>{sections[key]}</HiddenSection> : sections[key]}</div>
      ))}
      {preview && <PreviewBar path={PATH} />}
    </div>
  )
}
