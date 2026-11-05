/**
 * Content for the home page blocks the admin panel edits under
 * "Home page sections".
 *
 * Each block is one page_sections row on the "home" page, with section_type
 * set to the block's key and its fields stored as JSON. The admin panel
 * (byteflow-admin, app/lib/home-sections.ts) describes the same blocks and
 * holds the same defaults; keep the two in step when a field is added.
 *
 * Nothing saved, or a field left blank, means the website's own copy below.
 * A list replaces the default only when it has at least one item with a
 * title, so an emptied list never leaves a section blank.
 *
 * No database access here, so client components can import the types and
 * helpers; the lookup itself is getHomeBlock in home-blocks.ts.
 */

type Item = Record<string, string>

export type HomeBlock = { fields: Record<string, string>; lists: Record<string, Item[]> }

// Text here can quote the site-wide figures with placeholders like {founded}
// (see site-figures.ts); getHomeBlock fills them in.
export const homeDefaults = {
  home_services_intro: {
    fields: {
      eyebrow: 'What we do',
      heading: 'Services built for',
      heading_soft: 'real business growth.',
      intro: 'End-to-end technology and creative services, all under one roof so you never have to chase multiple vendors again.',
    },
    lists: {},
  },
  // The heading of the Selected Work section. The projects themselves are
  // chosen on the Projects screen ("Feature on homepage").
  home_work: {
    fields: {
      eyebrow: 'Selected work',
      heading: 'Real businesses.',
      heading_soft: 'Real results.',
      intro: 'A look at recent projects for UAE businesses, from IT support and security to cloud and the web.',
      link_label: 'Explore our work',
      link: '/projects',
    },
    lists: {},
  },
  home_about: {
    fields: {
      eyebrow: 'About Byteflow',
      heading: 'Your trusted IT partner,',
      heading_soft: 'serving Dubai since {founded}.',
      intro: 'We make enterprise-grade IT accessible to every business in the UAE, so you can focus entirely on growth.',
      // The quote, name, role and photo are the founder's, from "About Us — Founder".
      show_quote: 'yes',
      primary_label: 'Get in touch',
      primary_link: '/contact-us',
      secondary_label: 'More about Byteflow',
      secondary_link: '/about-us',
      // The bento's photo tile.
      image_url: '/images/hero/hero.webp',
      // Describes the built-in artwork; an uploaded photo needs its own.
      image_alt: 'Illustration of connected servers and network links',
      image_caption: 'Our engineers on site in Dubai',
      image_badge: 'Based in Dubai since {founded}',
      // Years tile (the number counts from the year founded).
      show_years_badge: 'yes',
      years_label: 'Years keeping UAE businesses running',
      // Rating tile (rating, review count and Google link from site settings).
      show_rating_badge: 'yes',
      rating_label: 'Google rating · {reviews} reviews',
      reviews_label: 'Read reviews',
      // Coverage tile.
      show_coverage: 'yes',
      coverage_title: 'On-site across the UAE',
      coverage_locations: 'Dubai, Sharjah, Abu Dhabi',
      coverage_note: '2-hr on-site response',
    },
    lists: {
      highlights: [
        { title: 'Full IT under one roof', description: 'Infrastructure, cloud, security, design and marketing, all managed by one expert team with full accountability.', link: '/#services', icon: 'layers', show: 'yes' },
        { title: 'Zero hidden costs', description: 'Fixed monthly or annual packages so you always know what you pay. No surprises, no extra invoices.', link: '/it-amc-services-dubai', icon: 'receipt', show: 'yes' },
        { title: 'Rapid on-site response', description: 'Certified engineers on-site or remote within 2 hours across Dubai, Sharjah and Abu Dhabi.', link: '/it-amc-services-dubai', icon: 'clock', show: 'yes' },
        { title: 'Microsoft & cloud ready', description: 'Official Microsoft 365 setup, cloud migrations and ongoing management for UAE businesses of every size.', link: '/cloud-services-dubai', icon: 'cloud', show: 'yes' },
      ],
    },
  },
  home_promise: {
    fields: {
      eyebrow: 'Why businesses choose us',
      heading: 'What you can count on,',
      heading_soft: 'every time.',
      intro: "Four standards behind every job we take on, whether it's one laptop or a whole office.",
      seal_text: 'Service promise · Byteflow · Since {founded} ·',
      footer_text: 'Want all four on one fixed monthly fee?',
      footer_strong: "That's what an IT AMC plan is for.",
      link_label: 'See IT AMC plans',
      link_href: '/it-amc-services-dubai',
    },
    lists: {
      rows: [
        { title: 'Fast response', value: '2', unit: 'hrs', description: 'On-site or remote support within 2 hours. We never leave you waiting when your business is down.' },
        { title: 'Expert team', value: '100%', unit: 'certified engineers', description: 'Certified IT professionals with deep expertise across infrastructure, cloud, security and design.' },
        { title: 'Fixed pricing', value: '0', unit: 'surprise bills', description: 'Transparent monthly or annual packages with no surprise bills. Budget with complete confidence.' },
        { title: 'One team, all IT', value: '1', unit: 'vendor to call', description: 'From IT support to web development and digital marketing — one vendor, zero hassle, full accountability.' },
      ],
    },
  },
  home_process: {
    fields: {
      eyebrow: 'Our process',
      heading: 'From first call',
      heading_soft: 'to full delivery.',
      intro: 'A simple, transparent process so you always know exactly where things stand.',
    },
    lists: {
      steps: [
        { title: 'Free consultation', when: 'Your first call', description: 'Reach out by phone, WhatsApp or the contact form. We listen to your setup, team size and pain points — no jargon, no sales pressure.', points: 'Phone, WhatsApp or form\nYour setup and team size\nNo sales pressure' },
        { title: 'Custom proposal', when: 'Within 24 hours', description: 'Within 24 hours you receive a clear, itemised proposal — scope, timeline and fixed pricing. No hidden costs, no vague estimates.', points: 'Itemised scope\nClear timeline\nFixed pricing' },
        { title: 'Onboarding & setup', when: 'On-site or remote', description: 'Our certified engineers arrive on-site or connect remotely. We configure your network, servers, cloud or software with zero disruption to your workday.', points: 'Network & servers\nCloud & software\nNo disruption to your day' },
        { title: 'Testing & handover', when: 'Before sign-off', description: 'Everything is tested end-to-end before we hand over. We walk your team through what was done, answer every question and make sure you are 100% comfortable.', points: 'End-to-end testing\nTeam walkthrough\nEvery question answered' },
        { title: 'Ongoing support', when: '24/7, for as long as you need', description: 'We monitor your systems 24/7 and fix issues before they affect your business. One call or message and our engineers are on it — on-site within 2 hours.', points: '24/7 monitoring\nIssues fixed early\nOn-site within 2 hours' },
      ],
    },
  },
  home_help: {
    fields: {
      heading: 'Not sure which service you need?',
      description: "Our team will guide you. Tell us what's slowing your business down and we'll point you to the right fit.",
      button_label: 'Talk to our team',
      button_link: '/contact-us',
    },
    lists: {},
  },
  // Not a home page section: the header's Services mega menu and Industries
  // dropdown on every page. It is stored with the home blocks so the admin
  // edits it on the same screen.
  header_menu: {
    fields: {
      eyebrow: 'Our services',
      heading: 'Everything IT, under one roof.',
      description: 'Support, cloud, security and creative work from one accountable team.',
      link_label: 'View all services',
      link: '/#services',
      featured_eyebrow: 'Most popular',
      featured_title: 'IT AMC plans',
      featured_label: 'See plans',
      featured_link: '/it-amc-services-dubai',
      whatsapp_label: 'WhatsApp us',
      industries_label: 'Industries',
      industries_heading: 'Industries we serve',
    },
    lists: {
      services: [
        { group: 'IT Support & Infrastructure', title: 'IT AMC / IT Support', description: 'Fixed monthly support plans', link: '/it-amc-services-dubai' },
        { group: 'IT Support & Infrastructure', title: 'System Integration', description: 'Every device, one system', link: '/system-integration' },
        { group: 'IT Support & Infrastructure', title: 'Data Backup & Recovery', description: 'Survive ransomware & failure', link: '/data-backup-recovery' },
        { group: 'Cloud & Security', title: 'Cloud Services', description: 'Migration & management', link: '/cloud-services-dubai' },
        { group: 'Cloud & Security', title: 'Cyber Security', description: 'Firewalls, endpoint, email', link: '/cyber-security' },
        { group: 'Digital & Creative', title: 'Website / Apps / Bots', description: 'Built for the UAE market', link: '/website-development' },
        { group: 'Digital & Creative', title: 'Landing Page Designing', description: 'Pages built to convert', link: '/landing-page-designing' },
        { group: 'Digital & Creative', title: 'UI/UX & Graphics Design', description: 'Brand & interface design', link: '/graphics-designing' },
        { group: 'Digital & Creative', title: 'Digital Marketing', description: 'Measurable monthly leads', link: '/digital-marketing' },
      ],
      stats: [
        { title: '2 hrs', description: 'On-site response' },
        { title: '24/7', description: 'Monitoring' },
      ],
      // No industry has a page yet, so the Industries menu stays hidden.
      // Giving an industry a link in the admin brings the menu back.
      industries: [
        { title: 'Clinics & Healthcare', link: '' },
        { title: 'Schools & Education', link: '' },
        { title: 'Real Estate', link: '' },
        { title: 'Retail & Ecommerce', link: '' },
        { title: 'Logistics', link: '' },
        { title: 'Hospitality', link: '' },
        { title: 'Corporate Offices & SMEs', link: '' },
      ],
    },
  },
} satisfies Record<string, HomeBlock>

export type HomeBlockKey = keyof typeof homeDefaults

const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

/** Saved content laid over the defaults: blank fields and empty lists fall back. */
export function mergeHomeBlock(key: HomeBlockKey, saved: Record<string, unknown> | null): HomeBlock {
  const defaults: HomeBlock = homeDefaults[key]
  const fields = Object.fromEntries(
    Object.entries(defaults.fields).map(([name, fallback]) => [name, text(saved?.[name]) || fallback]),
  )
  const lists = Object.fromEntries(
    Object.entries(defaults.lists).map(([name, fallback]) => {
      const raw = saved?.[name]
      const items = Array.isArray(raw)
        ? raw
            .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
            // The default item names the fields; a list that starts empty
            // (client logos) keeps every text field it was saved with.
            .map((item) => Object.fromEntries((fallback[0] ? Object.keys(fallback[0]) : Object.keys(item)).map((field) => [field, text(item[field])])))
            .filter((item) => item.title)
        : []
      return [name, items.length ? items : fallback]
    }),
  )
  return { fields, lists }
}

/** "points" are typed one per line in the admin. */
export const lines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
