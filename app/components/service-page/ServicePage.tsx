import '../../home.css'
import '../../about.css'
import type { ReactNode } from 'react'
import { draftMode } from 'next/headers'
import { getFaqsForSlug, getCustomSections, getPageHero, getSiteSettings, getTestimonials } from '../../lib/cms'
import { getServices } from '../../lib/db'
import { getHeaderModel } from '../../lib/header-data'
import { getHomeBlock } from '../../lib/home-blocks'
import { lines } from '../../lib/home-content'
import { hiddenSections } from '../../lib/amc-page'
import { pricedPlans, shownPlans } from '../../lib/plans'
import { getServiceBlocks } from '../../lib/service-blocks'
import { serviceSections, type ServiceSectionKey } from '../../lib/service-page'
import { pageServices, serviceTab } from '../../lib/service-tabs'
import type { ServiceData } from '../../lib/services-data'
import { absoluteUrl, breadcrumbSchema, faqPageSchema, graph, serviceSchema } from '../../lib/structured-data'
import AmcPlans from '../amc/AmcPlans'
import {
  AmcBreakFix,
  AmcCosts,
  AmcCoverage,
  AmcFaq,
  AmcFeatures,
  AmcHighlights,
  AmcIndustries,
  AmcIntro,
  AmcPageBlocks,
  AmcProcess,
  AmcRelated,
  AmcReviews,
  AmcScope,
  AmcSla,
  AmcWhy,
} from '../amc/AmcSections'
import Contact from '../Contact'
import HomeMotion from '../home/HomeMotion'
import JsonLd from '../JsonLd'
import PageCta from '../PageCta'
import PreviewBar, { HiddenSection } from '../PreviewBar'
import { IncludedCard, PlansCard } from './HeroCards'
import ServiceHero from './ServiceHero'

/**
 * A service page (Cyber Security, Cloud, Backup and the rest), built from
 * its blocks on the admin's "Service pages" screen in the home page design.
 * The banner is the page's hero (Heroes screen: words, buttons, picture),
 * with the site-wide figures and, beside it, the plans in brief or what's
 * included. Under it, the sections switched on, in the order set on the
 * Sections tab: the page's blocks from Pages keep a place there, and the
 * page's call to action goes with them.
 */
export default async function ServicePage({ page }: { page: ServiceData }) {
  const [hero, header, settings, dbServices, cmsFaqs, customSections, reviews, blocks, faqLabels] = await Promise.all([
    getPageHero(page.slug),
    getHeaderModel(),
    getSiteSettings(),
    getServices(),
    getFaqsForSlug(page.slug),
    getCustomSections(page.slug),
    getTestimonials(),
    getServiceBlocks(page),
    getHomeBlock('home_faq'),
  ])
  const tabs = (dbServices.length ? dbServices : pageServices).map(serviceTab)
  const title = tabs.find((tab) => tab.slug === page.slug)?.title ?? page.title
  const heading = hero?.hero_heading || page.title
  const highlight = hero?.hero_highlight || (hero?.hero_heading ? '' : page.tagline)
  const description = hero?.hero_description || page.description
  const phone = String(settings?.header_phone || '+971 54 328 2042')
  // A preview from the admin shows the hidden sections and packages too, marked.
  const { isEnabled: preview } = await draftMode()
  const order = serviceSections(blocks.layout.lists.sections, preview)
  const hidden = preview ? hiddenSections(blocks.layout.lists.sections) : new Set<string>()
  const hasPlans = order.includes('plans') && shownPlans(blocks.plans.lists.plans, preview).length > 0
  // The banner card shows the packages only when chosen for it on the Packages & pricing tab.
  const plansCard = hasPlans && blocks.plans.fields.banner_card === 'plans'
  const path = `/${page.slug}`

  // The page's own questions, then those added for it on the FAQs screen.
  const allFaqs = [
    ...blocks.faq.lists.faqs.map((item) => ({ question: item.title, answer: item.description, category: title })),
    ...cmsFaqs.map((item) => ({ question: item.question, answer: item.answer, category: item.category || title })),
  ]

  const sections: Record<ServiceSectionKey, ReactNode> = {
    highlights: <AmcHighlights block={blocks.highlights} />,
    intro: <AmcIntro block={blocks.intro} />,
    features: <AmcFeatures block={blocks.features} />,
    plans: <AmcPlans content={blocks.plans} preview={preview} />,
    benefits: <AmcWhy block={blocks.benefits} />,
    compare: <AmcBreakFix block={blocks.compare} />,
    process: <AmcProcess block={blocks.process} />,
    industries: <AmcIndustries block={blocks.industries} />,
    sla: <AmcSla block={blocks.sla} />,
    coverage: <AmcCoverage block={blocks.coverage} />,
    scope: <AmcScope block={blocks.scope} />,
    costs: <AmcCosts block={blocks.costs} />,
    pageblocks: (
      <>
        <AmcPageBlocks sections={customSections} />
        <PageCta embedded />
      </>
    ),
    related: <AmcRelated block={blocks.related} tabs={tabs} />,
    faq: (
      <AmcFaq
        block={blocks.faq}
        labels={faqLabels}
        faqs={allFaqs}
        contact={{
          phone: `tel:${phone.replace(/[^+\d]/g, '')}`,
          whatsapp: String(settings?.whatsapp_link || '') || `https://wa.me/${phone.replace(/\D/g, '')}`,
          hours: String(settings?.business_hours || '').trim(),
        }}
      />
    ),
    reviews: <AmcReviews block={blocks.reviews} reviews={reviews} />,
    contact: (
      <div id="contact" className="scroll-mt-28">
        <Contact
          settings={(settings ?? {}) as never}
          cta={{
            eyebrow: blocks.contact.fields.eyebrow,
            heading: blocks.contact.fields.heading,
            heading_soft: blocks.contact.fields.heading_soft,
            intro: blocks.contact.fields.intro,
            call_label: blocks.contact.fields.call_label,
            whatsapp_label: blocks.contact.fields.whatsapp_label,
            promises: lines(blocks.contact.fields.promises ?? ''),
          }}
        />
      </div>
    ),
  }

  const offers = hasPlans
    ? pricedPlans(blocks.plans.lists.plans, blocks.plans.fields).map((plan) => ({
        '@type': 'Offer',
        name: `${plan.title} — ${title}`,
        price: plan.price,
        priceCurrency: 'AED',
        url: absoluteUrl(`${path}#plans`),
      }))
    : []

  return (
    <div className="hp">
      <JsonLd
        data={graph(
          {
            ...serviceSchema({ name: title, description, path, image: hero?.hero_image || hero?.hero_background_image || '' }),
            ...(offers.length ? { offers } : {}),
          },
          order.includes('faq') ? faqPageSchema(allFaqs) : null,
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: title, path },
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
        secondary={
          hasPlans
            ? { label: hero?.hero_secondary_label || blocks.plans.fields.compare_label, href: hero?.hero_secondary_link || '#plans' }
            : { label: hero?.hero_secondary_label || blocks.features.fields.link_label, href: hero?.hero_secondary_link || '#features' }
        }
        phone={phone}
        stats={blocks.figures.lists.stats}
        image={hero?.hero_image ? { src: hero.hero_image, alt: hero.hero_image_alt || title } : null}
        card={
          plansCard ? (
            <PlansCard plans={blocks.plans} preview={preview} />
          ) : order.includes('features') ? (
            <IncludedCard features={blocks.features} label={blocks.features.fields.link_label} />
          ) : hasPlans ? (
            <PlansCard plans={blocks.plans} preview={preview} />
          ) : null
        }
      />

      {order.map((key) => (
        <div key={key}>{hidden.has(key) ? <HiddenSection>{sections[key]}</HiddenSection> : sections[key]}</div>
      ))}
      {preview && <PreviewBar path={path} />}
    </div>
  )
}
