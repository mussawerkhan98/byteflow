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
  // "Where does your IT need help?": three common starting points, each
  // linked to the service that answers it (by slug; the link shows the
  // service's own name). A scenario set to show: 'no' is left out.
  home_needs: {
    fields: {
      eyebrow: 'Your business comes first',
      heading: 'Where does your IT need help?',
      link_label: 'Book a free IT assessment',
      link: '/contact-us',
      // The bottom line, one step per line.
      steps: 'Free consultation\nProposal\nSetup\nOngoing support',
      steps_link_label: 'How we work',
      steps_link: '/#how-we-work',
    },
    lists: {
      scenarios: [
        { label: 'A new office', title: 'Moving or opening an office.', description: 'Cabling, Wi-Fi, CCTV and access control planned and installed together, so your team works from day one.', service: 'system-integration', show: 'yes' },
        { label: 'A safer business', title: 'Worried about ransomware or data loss.', description: 'Firewall, endpoint and email protection with tested backups, so one bad click does not stop the business.', service: 'cyber-security', show: 'yes' },
        { label: 'More customers', title: 'Need a better website or more leads.', description: 'A fast, mobile-first website, landing pages and chatbots built to turn visitors into enquiries.', service: 'website-development', show: 'yes' },
      ],
    },
  },
  // The dark About section: heading and paragraph, then the numbered reasons
  // beside a preview card. Each reason's icon also picks the small picture in
  // its preview (AboutPreview.tsx).
  home_about: {
    fields: {
      eyebrow: 'About Byteflow · Since {founded}',
      heading: 'Your trusted IT partner,',
      heading_soft: 'serving Dubai since {founded}.',
      intro: 'We make enterprise-grade IT accessible to every business in the UAE, so you can focus entirely on growth.',
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
  // Technologies: the vendors we work with, one tab per area. Each logo names
  // its tab by the tab's title; a tab with no logo to show is left out. The
  // defaults list only vendors Byteflow's own pages already name, with no
  // pictures (the tile shows the name's initials until a logo is uploaded).
  home_tech: {
    fields: {
      eyebrow: 'Technologies',
      heading: 'The tools behind',
      heading_soft: 'reliable IT.',
      intro: 'Proven platforms we install, configure and support, chosen to fit your business rather than our habits.',
      link_label: 'Discuss your project',
      link: '/contact-us',
      note: 'Technology choices depend on your setup and budget.',
    },
    lists: {
      tabs: [
        { title: 'Microsoft', description: 'Email, files, meetings and cloud for your whole team.', show: 'yes' },
        { title: 'Security', description: 'Firewalls, CCTV and access control that protect people and data.', show: 'yes' },
        { title: 'Networking', description: 'Switching, routing and Wi-Fi for offices of every size.', show: 'yes' },
        { title: 'Backup', description: 'Copies of your data you can restore when something goes wrong.', show: 'yes' },
        { title: 'Cloud', description: 'Cloud platforms we migrate to and manage.', show: 'yes' },
        { title: 'Web', description: 'Websites, apps and tools built for the UAE market.', show: 'yes' },
      ],
      logos: [
        { title: 'Microsoft 365', tab: 'Microsoft', logo: '', show: 'yes' },
        { title: 'Microsoft Azure', tab: 'Microsoft', logo: '', show: 'yes' },
        { title: 'Microsoft Teams', tab: 'Microsoft', logo: '', show: 'yes' },
        { title: 'SharePoint', tab: 'Microsoft', logo: '', show: 'yes' },
        { title: 'Exchange Online', tab: 'Microsoft', logo: '', show: 'yes' },
        { title: 'Fortinet', tab: 'Security', logo: '', show: 'yes' },
        { title: 'Hikvision', tab: 'Security', logo: '', show: 'yes' },
        { title: 'ZKTeco', tab: 'Security', logo: '', show: 'yes' },
        { title: 'Cisco', tab: 'Networking', logo: '', show: 'yes' },
        { title: 'Ubiquiti', tab: 'Networking', logo: '', show: 'yes' },
        { title: 'HPE Aruba', tab: 'Networking', logo: '', show: 'yes' },
        { title: 'Fortinet', tab: 'Networking', logo: '', show: 'yes' },
        { title: 'Microsoft Azure', tab: 'Cloud', logo: '', show: 'yes' },
        { title: 'Microsoft 365', tab: 'Cloud', logo: '', show: 'yes' },
        { title: 'Google Workspace', tab: 'Cloud', logo: '', show: 'yes' },
        { title: 'React', tab: 'Web', logo: '', show: 'yes' },
        { title: 'Node.js', tab: 'Web', logo: '', show: 'yes' },
        { title: 'Laravel', tab: 'Web', logo: '', show: 'yes' },
        { title: 'Python', tab: 'Web', logo: '', show: 'yes' },
        { title: 'Flutter', tab: 'Web', logo: '', show: 'yes' },
        { title: 'WordPress', tab: 'Web', logo: '', show: 'yes' },
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
