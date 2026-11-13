/**
 * The service pages (Cyber Security, Cloud, Backup and the rest): the
 * sections each can show and what each starts with, before anything is
 * saved on the admin's "Service pages" screen. The starting wording is each
 * page's own published content (services-data.ts); sections there is no
 * real content for yet (packages, comparison, SLA, scope, cost factors)
 * start empty and switched off. No database access or React here.
 */
import { homeDefaults, planLabels, type HomeBlock } from './home-content'
import type { ServiceData } from './services-data'

/** The sections a service page can show under its banner, by key, in their starting order. */
export const serviceSectionKeys = [
  'highlights',
  'intro',
  'features',
  'plans',
  'benefits',
  'compare',
  'process',
  'industries',
  'sla',
  'coverage',
  'scope',
  'costs',
  'pageblocks',
  'related',
  'faq',
  'reviews',
  'contact',
] as const

export type ServiceSectionKey = (typeof serviceSectionKeys)[number]

/** Every block a service page reads: its sections, the order (layout) and the banner figures. */
export const serviceBlockKeys = ['layout', 'figures', 'seo', ...serviceSectionKeys.filter((key) => key !== 'pageblocks')] as const
export type ServiceBlockKey = (typeof serviceBlockKeys)[number]

/**
 * Switched off to start: sections with no real content yet, and the
 * highlights, which would only repeat what's included (the banner's card
 * lists it already) until given their own words.
 */
const OFF_UNTIL_FILLED = new Set<ServiceSectionKey>(['highlights', 'plans', 'compare', 'sla', 'scope', 'costs'])

/**
 * What tailors each page to its service: its search title and description
 * (as the page had them, until changed on its SEO tab), how it names the
 * work, where its process ends, whether engineers come on site (coverage
 * shows), and the icons of its highlights.
 */
const TAILOR: Record<string, { title: string; description: string; noun: string; finish: string; onsite: boolean; icons: string[] }> = {
  'cyber-security': { title: 'Cyber Security Services Dubai | Firewall & EDR | Byteflow', description: 'Enterprise cyber security for UAE businesses. Next-gen firewall, endpoint detection, email security and 24/7 threat monitoring. Stop ransomware before it encrypts.', noun: 'cyber security', finish: 'to round-the-clock monitoring.', onsite: true, icons: ['shield', 'laptop', 'check', 'monitor'] },
  'system-integration': { title: 'System Integration Dubai | Network & CCTV | Byteflow', description: 'Complete system integration services for Dubai businesses. Structured cabling, server setup, CCTV, VoIP and multi-site network connectivity across UAE.', noun: 'system integration', finish: 'to the handover.', onsite: true, icons: ['network', 'server', 'camera', 'tools'] },
  'data-backup-recovery': { title: 'Data Backup & Recovery Dubai | Cloud Backup | Byteflow', description: 'Automated cloud backup and fast disaster recovery for Dubai businesses. Hourly backups, immutable storage, 4-hour server recovery. Never pay a ransom again.', noun: 'backup and recovery', finish: 'to tested, monitored backups.', onsite: true, icons: ['clock', 'cloud', 'server', 'shield'] },
  'cloud-services-dubai': { title: 'Cloud Services Dubai | Microsoft 365 & Azure | Byteflow', description: 'Managed cloud services for Dubai businesses. Microsoft 365 migration, Azure setup, cloud backup and hybrid infrastructure. Zero data loss, full ongoing management.', noun: 'cloud', finish: 'to a managed cloud.', onsite: true, icons: ['cloud', 'server', 'person', 'shield'] },
  'website-development': { title: 'Website Development Dubai | Apps & E-commerce | Byteflow', description: 'Professional website development, mobile apps and AI chatbots for Dubai businesses. WordPress, custom development, UAE payment gateways and Arabic language support.', noun: 'web and app development', finish: 'to launch day.', onsite: false, icons: ['laptop', 'fee', 'tools', 'monitor'] },
  'graphics-designing': { title: 'Graphic Design Dubai | Logo, Branding & UI/UX | Byteflow', description: 'Professional logo design, brand identity, UI/UX design and social media graphics for Dubai businesses. Arabic and English, unlimited revisions, fast turnaround.', noun: 'design', finish: 'to the final files.', onsite: false, icons: ['check', 'person', 'laptop', 'monitor'] },
  'digital-marketing': { title: 'Digital Marketing Dubai | SEO & Google Ads | Byteflow', description: 'Results-driven digital marketing for Dubai businesses. SEO, Google Ads, social media advertising and content marketing. Measurable leads, transparent reporting.', noun: 'digital marketing', finish: 'to monthly results.', onsite: false, icons: ['monitor', 'fee', 'person', 'check'] },
  'landing-page-designing': { title: 'Landing Page Design Dubai | High-Converting Pages | Byteflow', description: 'Conversion-focused landing pages for Google Ads and social campaigns in Dubai and the UAE. Mobile-first design, fast load times, built to turn clicks into leads.', noun: 'landing page', finish: 'to launch and beyond.', onsite: false, icons: ['check', 'laptop', 'clock', 'monitor'] },
}
const fallbackTailor = { title: '', description: '', noun: 'this', finish: 'to the finished job.', onsite: false, icons: ['check', 'check', 'check', 'check'] }

/** The first sentence of a text, for a short highlight. */
export function firstSentence(text: string): string {
  const match = text.trim().match(/^.+?[.!?](?=\s|$)/)
  return (match ? match[0] : text).trim()
}

/** A service page's starting content, block by block. */
export function serviceDefaults(page: ServiceData): Record<ServiceBlockKey, HomeBlock> {
  const t = TAILOR[page.slug] ?? fallbackTailor
  const empty = (fields: Record<string, string> = {}, lists: Record<string, Record<string, string>[]> = {}): HomeBlock => ({ fields, lists })
  return {
    layout: empty(
      {},
      {
        sections: serviceSectionKeys.map((key) => ({
          title: key,
          show: OFF_UNTIL_FILLED.has(key) || (key === 'coverage' && !t.onsite) ? 'no' : 'yes',
        })),
      },
    ),
    seo: empty({ title: t.title || `${page.title} Dubai | Byteflow`, description: t.description || page.description }),
    // Only the site-wide figures, which the admin keeps true (Contact details & logo).
    figures: empty(
      {},
      {
        stats: [
          { title: '{clients}', description: 'Businesses served across the UAE' },
          { title: '{rating}★', description: 'Google rating from {reviews} reviews' },
          { title: '{years}+', description: 'Years looking after UAE businesses' },
        ],
      },
    ),
    highlights: empty(
      {},
      {
        items: page.features.slice(0, 4).map((feature, i) => ({ title: feature.title, description: firstSentence(feature.desc), icon: t.icons[i] ?? 'check' })),
      },
    ),
    intro: empty({
      eyebrow: 'Overview',
      heading: page.title,
      heading_soft: page.tagline,
      text: page.description,
      // The benefits have their own section; points here are for the admin to add.
      points: '',
      image: '',
      image_alt: '',
    }),
    features: empty(
      { eyebrow: 'What’s included', heading: 'What we deliver.', heading_soft: '', intro: '', link_label: 'See what’s included' },
      { features: page.features.map((feature) => ({ title: feature.title, description: feature.desc, image: '', image_alt: '' })) },
    ),
    plans: empty(
      {
        ...planLabels,
        eyebrow: 'Packages and pricing',
        heading: 'Packages',
        heading_soft: 'and what each includes.',
        intro: '',
        card_label: 'Packages from',
        unit: '',
        note: '',
        terms: '',
        button_label: page.slug === 'digital-marketing' ? 'Request an SEO Quote' : 'Get a free quote',
        button_link: '/contact-us',
        compare_label: 'Compare packages',
        table_heading: 'Compare the packages',
        // The banner card keeps listing what's included unless packages are chosen for it.
        banner_card: 'included',
      },
      { plans: [], compare: [] },
    ),
    benefits: empty(
      { eyebrow: 'Why it matters', heading: 'What changes', heading_soft: `with ${t.noun} done properly.` },
      { benefits: page.benefits.map((benefit) => ({ title: benefit.title, description: benefit.desc })) },
    ),
    compare: empty({ eyebrow: 'Compare', heading: 'Two ways', heading_soft: 'to do it.', us_label: 'With Byteflow', them_label: 'Without', footer: '' }, { rows: [] }),
    process: empty(
      { eyebrow: 'How we work', heading: 'From the first call', heading_soft: t.finish },
      { steps: page.process.map((step) => ({ title: step.title, description: step.desc })) },
    ),
    industries: empty({ ...homeDefaults.amc_industries.fields }, { industries: homeDefaults.amc_industries.lists.industries.map((item) => ({ ...item })) }),
    sla: empty(
      { eyebrow: 'Response times', heading: 'How fast we respond,', heading_soft: 'by priority.', intro: '', escalation_heading: 'Escalation', escalation: '' },
      { priorities: [] },
    ),
    coverage: empty({
      eyebrow: 'Dubai & UAE coverage',
      heading: 'On site wherever',
      heading_soft: 'your office is.',
      text: 'Our engineers work on site across Dubai, with Sharjah and Abu Dhabi covered too.',
      areas: homeDefaults.amc_areas.fields.areas,
    }),
    scope: empty(
      { eyebrow: 'No surprises', heading: 'What’s included and what isn’t', intro: '', included_heading: 'Included', excluded_heading: 'Not included', footer: '' },
      { included: [], items: [] },
    ),
    costs: empty({ eyebrow: 'Cost factors', heading: 'What sets the price', heading_soft: '', intro: '' }, { factors: [] }),
    related: empty({ eyebrow: 'Related services', heading: 'Often paired with this' }, { services: page.relatedSlugs.map((slug) => ({ title: slug })) }),
    faq: empty(
      { eyebrow: 'FAQ', heading: 'Questions we get', heading_soft: 'asked all the time.', intro: `Everything you need to know about ${t.noun} with Byteflow.` },
      { faqs: page.faqs.map((item) => ({ title: item.q, description: item.a })) },
    ),
    reviews: empty({ eyebrow: 'Clients', heading: 'What our clients', heading_soft: 'say about us.', count: '6', cases_heading: 'Related projects' }, { cases: [] }),
    contact: empty({
      eyebrow: 'Get a quote',
      heading: 'Let’s talk about',
      heading_soft: `your ${t.noun}.`,
      intro: 'Tell us what you need and we’ll come back with a clear, fixed proposal.',
      call_label: 'Call us',
      whatsapp_label: 'WhatsApp us',
      promises: 'Free consultation\nClear, fixed proposal\nNo obligation',
    }),
  }
}

/**
 * The sections switched on, in the admin's order, each once; unknown keys
 * are left out. A preview keeps the hidden ones too.
 */
export function serviceSections(layout: Record<string, string>[], preview = false): ServiceSectionKey[] {
  const known = new Set<string>(serviceSectionKeys)
  const seen = new Set<string>()
  return layout
    .filter((item) => preview || item.show !== 'no')
    .map((item) => (item.title ?? '').trim())
    .filter((key): key is ServiceSectionKey => {
      if (!known.has(key) || seen.has(key)) return false
      seen.add(key)
      return true
    })
}
