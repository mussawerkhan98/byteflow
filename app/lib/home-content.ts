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

/**
 * The packages section's names for its parts ("Packages & pricing" on the IT
 * AMC page and the service pages): the words for a custom quote and a
 * starting price, the structured deliverables, the inclusion groups, and
 * what's left out or costs extra.
 */
export const planLabels = {
  from_label: 'From',
  custom_label: 'Request Pricing',
  d_keywords_label: 'Keywords',
  d_pages_label: 'Pages',
  d_audits_label: 'Audits',
  d_content_label: 'Content pieces',
  g_technical_label: 'Technical',
  g_onpage_label: 'On-page',
  g_local_label: 'Local SEO',
  g_content_label: 'Content',
  g_links_label: 'Link building',
  excluded_label: 'Not included',
  extras_label: 'Additional charges',
}

/** A package's fields beyond its name, price, line, points and badge, as they start. */
const planExtras = {
  price_type: 'fixed',
  show: 'yes',
  button_label: '',
  button_link: '',
  d_keywords: '',
  d_pages: '',
  d_audits: '',
  d_content: '',
  g_technical: '',
  g_onpage: '',
  g_local: '',
  g_content: '',
  g_links: '',
  excluded: '',
  extras: '',
}

// Text here can quote the site-wide figures with placeholders like {founded}
// (see site-figures.ts); getHomeBlock fills them in.
export const homeDefaults = {
  home_services_intro: {
    fields: {
      eyebrow: 'What we do',
      heading: 'Services built for',
      heading_soft: 'real business growth.',
      intro: 'End-to-end technology and creative services, all under one roof so you never have to chase multiple vendors again.',
      all_label: 'All services',
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
        { label: 'A new office', title: 'Moving or opening an office.', description: 'Cabling, Wi-Fi, CCTV and access control planned and installed together, so your team works from day one.', service: 'system-integration', show: 'yes', image: '', image_alt: '' },
        { label: 'A safer business', title: 'Worried about ransomware or data loss.', description: 'Firewall, endpoint and email protection with tested backups, so one bad click does not stop the business.', service: 'cyber-security', show: 'yes', image: '', image_alt: '' },
        { label: 'More customers', title: 'Need a better website or more leads.', description: 'A fast, mobile-first website, landing pages and chatbots built to turn visitors into enquiries.', service: 'website-development', show: 'yes', image: '', image_alt: '' },
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
        { title: 'Full IT under one roof', description: 'Infrastructure, cloud, security, design and marketing, all managed by one expert team with full accountability.', link: '/#services', icon: 'layers', show: 'yes', image: '', image_alt: '' },
        { title: 'Zero hidden costs', description: 'Fixed monthly or annual packages so you always know what you pay. No surprises, no extra invoices.', link: '/it-amc-services-dubai', icon: 'receipt', show: 'yes', image: '', image_alt: '' },
        { title: 'Rapid on-site response', description: 'Certified engineers on-site or remote within 2 hours across Dubai, Sharjah and Abu Dhabi.', link: '/it-amc-services-dubai', icon: 'clock', show: 'yes', image: '', image_alt: '' },
        { title: 'Microsoft & cloud ready', description: 'Official Microsoft 365 setup, cloud migrations and ongoing management for UAE businesses of every size.', link: '/cloud-services-dubai', icon: 'cloud', show: 'yes', image: '', image_alt: '' },
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
      // Beside the figures counted from the logos below.
      platforms_label: 'Platforms we support',
      areas_label: 'Areas of your IT',
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
  // Insights: the latest blog posts, magazine style. "featured" is a post's
  // slug, or "latest" for the newest; the list shows the next newest posts.
  // Each topic links to the blog filtered to its category, and is left out
  // while no published post uses that category.
  home_insights: {
    fields: {
      eyebrow: 'Insights',
      heading: 'Better IT decisions',
      heading_soft: 'start here.',
      intro: 'Practical guides on IT support, security, cloud and the web for businesses in Dubai and the UAE.',
      link_label: 'View all articles',
      link: '/blog',
      featured: 'latest',
      list_count: '5',
      list_label: 'More articles',
      read_label: 'Read article',
      topics_label: 'Browse by topic',
      // The featured card's badge: picked in the admin, or simply the newest.
      picked_badge: "Editor's pick",
      latest_badge: 'Latest',
    },
    lists: {
      topics: [
        { title: 'IT Support', category: 'IT Support', show: 'yes' },
        { title: 'Cyber Security', category: 'Cyber Security', show: 'yes' },
        { title: 'Cloud', category: 'Cloud', show: 'yes' },
        { title: 'Web', category: 'Web Development', show: 'yes' },
        { title: 'Marketing', category: 'Digital Marketing', show: 'yes' },
      ],
    },
  },
  // Client reviews: the words around the reviews, which come from Customer
  // reviews in the admin. The rating and count quote the site-wide figures.
  home_reviews: {
    fields: {
      eyebrow: 'Client reviews',
      heading: 'Trusted by businesses',
      heading_soft: 'across the UAE.',
      intro: 'Real words from the businesses we look after, from one-person offices to multi-site teams.',
      rating_label: 'Google rating',
      count_label: '{reviews} Google reviews',
      google_label: 'Read all reviews on Google',
    },
    lists: {},
  },
  // The home page's closing section: the old "Ready to upgrade your IT
  // setup?" banner and "Let's talk about your IT needs" merged into one. The
  // phone and WhatsApp buttons use Contact details & logo.
  home_contact: {
    fields: {
      eyebrow: 'Get started today',
      heading: 'Ready to upgrade your IT setup?',
      heading_soft: "Let's talk.",
      intro: 'Let our certified engineers handle everything, from network setup to cloud migration and cybersecurity. Send a message or call: one call is all it takes.',
      call_label: 'Call us now',
      whatsapp_label: 'WhatsApp us',
      // One per line, shown with a check mark.
      promises: 'No contracts required\nFree consultation\nResponse within 2 hours',
    },
    lists: {},
  },
  // Not only the home page: the words around the FAQ section on every page
  // that has questions (PageFaq). The questions are under FAQs in the admin.
  home_faq: {
    fields: {
      eyebrow: 'FAQ',
      heading: 'Questions we get',
      heading_soft: 'asked all the time.',
      intro: "Everything you need to know about working with Byteflow. Can't find what you're looking for? Just call us.",
      all_label: 'All questions',
      help_title: 'Still have questions?',
      help_text: 'Talk to a real engineer: call us or send a WhatsApp message.',
      call_label: 'Call us',
      whatsapp_label: 'WhatsApp us',
      search_label: 'Search questions',
      empty_text: 'No questions match your search. Call or message us and we will answer it directly.',
    },
    lists: {},
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
        { title: 'Free consultation', when: 'Your first call', description: 'Reach out by phone, WhatsApp or the contact form. We listen to your setup, team size and pain points — no jargon, no sales pressure.', points: 'Phone, WhatsApp or form\nYour setup and team size\nNo sales pressure', image: '', image_alt: '' },
        { title: 'Custom proposal', when: 'Within 24 hours', description: 'Within 24 hours you receive a clear, itemised proposal — scope, timeline and fixed pricing. No hidden costs, no vague estimates.', points: 'Itemised scope\nClear timeline\nFixed pricing', image: '', image_alt: '' },
        { title: 'Onboarding & setup', when: 'On-site or remote', description: 'Our certified engineers arrive on-site or connect remotely. We configure your network, servers, cloud or software with zero disruption to your workday.', points: 'Network & servers\nCloud & software\nNo disruption to your day', image: '', image_alt: '' },
        { title: 'Testing & handover', when: 'Before sign-off', description: 'Everything is tested end-to-end before we hand over. We walk your team through what was done, answer every question and make sure you are 100% comfortable.', points: 'End-to-end testing\nTeam walkthrough\nEvery question answered', image: '', image_alt: '' },
        { title: 'Ongoing support', when: '24/7, for as long as you need', description: 'We monitor your systems 24/7 and fix issues before they affect your business. One call or message and our engineers are on it — on-site within 2 hours.', points: '24/7 monitoring\nIssues fixed early\nOn-site within 2 hours', image: '', image_alt: '' },
      ],
    },
  },
  home_help: {
    fields: {
      // Hidden unless switched on in the admin: the FAQ's "Still have
      // questions?" bar and the Contact section already offer the same
      // call / WhatsApp prompt further down the home page.
      show: 'no',
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
      link: '/services',
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

  // ---- About Us page (app/about-us, app/components/about) ----
  // Saved on the "about-us" page rather than "home" (home-blocks.ts), and
  // edited on the admin's "About page sections" screen. The top banner is
  // the page's hero (Heroes screen) and the founder has its own screen.

  // The figures under the top banner: each item's title is the figure.
  about_stats: {
    fields: {},
    lists: {
      stats: [
        { title: '{clients}', description: 'Businesses served across the UAE' },
        { title: '{years}+', description: 'Years operating in Dubai' },
        { title: '8', description: 'IT, cloud and digital services' },
        { title: '24/7', description: 'Monitoring and support' },
      ],
    },
  },
  about_story: {
    fields: {
      eyebrow: 'Our story',
      heading: '{years} years of IT in Dubai.',
      heading_soft: 'One mission.',
      intro: "From a small IT support operation to a full-service technology company — here is how Byteflow grew to become one of Dubai's most trusted IT partners.",
    },
    lists: {
      milestones: [
        { year: '{founded}', title: 'Byteflow is founded in Dubai', description: 'Started as a lean IT support team serving small businesses in Deira and Bur Dubai. First 10 clients onboarded within the first month.' },
        { year: '2019', title: 'Expanded to cloud and Microsoft 365', description: 'Became an official Microsoft partner. Started handling full cloud migrations and Microsoft 365 deployments for UAE businesses of all sizes.' },
        { year: '2020', title: 'Launched digital marketing and web services', description: 'Added website development, SEO, and Google Ads to the service portfolio — giving clients a single vendor for both IT and digital growth.' },
        { year: '2022', title: 'Crossed 300+ business clients', description: 'Expanded coverage to Sharjah and Abu Dhabi with dedicated on-site engineers. Introduced the 2-hour response SLA across all AMC plans.' },
        { year: 'Today', title: '{clients} businesses and still growing', description: 'A full team of certified engineers, designers, marketers and cloud specialists, looking after businesses across the UAE.' },
      ],
    },
  },
  about_principles: {
    fields: {
      eyebrow: 'How we work',
      heading: 'Fast response, fixed price,',
      heading_soft: 'one team for all your IT.',
      link_label: 'Get started',
      link: '/contact-us',
    },
    lists: {
      principles: [
        { title: 'We respond in 2 hours — guaranteed', description: 'Every AMC plan includes a 2-hour on-site or remote response SLA. Not next business day. Not "as soon as possible." Two hours.' },
        { title: 'Fixed price, zero hidden fees', description: 'You get one monthly invoice. No call-out fees, no emergency surcharges, no per-ticket billing. We cover everything in your plan.' },
        { title: 'One team handles everything', description: 'IT support, cloud, security, website, marketing — the same team, the same account manager, one phone number. No handoffs.' },
      ],
    },
  },
  about_services: {
    fields: {
      eyebrow: 'What we do',
      heading: 'IT, cloud and digital services,',
      heading_soft: 'under one roof.',
      link_label: 'See all services',
      link: '/services',
    },
    lists: {
      services: [
        { title: 'IT AMC / IT Support', description: 'Fixed monthly support for all your devices, servers and network.', link: '/it-amc-services-dubai' },
        { title: 'Cyber Security', description: 'Firewalls, antivirus, email protection and network monitoring.', link: '/cyber-security' },
        { title: 'Cloud & Microsoft 365', description: 'Full cloud setup, migration and ongoing management.', link: '/cloud-services-dubai' },
        { title: 'Data Backup & Recovery', description: 'Automated backups and fast recovery when disaster strikes.', link: '/data-backup-recovery' },
        { title: 'System Integration', description: 'Connecting all your devices, offices and cloud systems.', link: '/system-integration' },
        { title: 'Website & App Development', description: 'Professional websites, mobile apps and AI chatbots.', link: '/website-development' },
        { title: 'Digital Marketing', description: 'SEO, Google Ads and social media that drives real leads.', link: '/digital-marketing' },
        { title: 'UI/UX & Graphic Design', description: 'Logos, branding, social media graphics and full brand identity.', link: '/graphics-designing' },
      ],
    },
  },
  // The heading over the team cards; the people are on the Team members screen.
  about_team: {
    fields: {
      eyebrow: 'Our team',
      heading: 'The people',
      heading_soft: 'behind Byteflow.',
      intro: 'Experienced specialists working together across IT, cloud, security, design and growth.',
    },
    lists: {},
  },
  // The heading and rating card beside the review wall; the reviews are the
  // published Customer reviews.
  about_reviews: {
    fields: {
      eyebrow: 'Client reviews',
      heading: 'What our clients',
      heading_soft: 'say about working with us.',
      intro: 'Straight from the businesses we look after, in their own words.',
      rating_label: 'Google rating',
      count_label: '{reviews} Google reviews',
      google_label: 'Read all reviews on Google',
    },
    lists: {},
  },
  // The registered details must match the Organization markup in the admin's
  // "Address" script, or the mismatch counts against the site.
  about_company: {
    fields: {
      eyebrow: 'Company information',
      heading: 'Who you are',
      heading_soft: 'actually dealing with.',
      intro: 'Plenty of IT providers in Dubai are a phone number and a logo. These are our registered details, so you can check us before you sign anything — and reach a named company, at a fixed address, if something goes wrong.',
      details_heading: 'Registered business details',
    },
    lists: {
      details: [
        { title: 'Registered name', description: 'Byteflow Information Technology Co. L.L.C.', link: '' },
        { title: 'Trading as', description: 'Byteflow', link: '' },
        { title: 'Established', description: '{founded}', link: '' },
        { title: 'Registered office', description: 'Emaar Park 4, Greens, TECOM, Dubai, United Arab Emirates', link: '' },
        { title: 'Opening hours', description: 'Monday to Saturday, 9:00am to 6:00pm (GST)', link: '' },
        { title: 'Areas served', description: 'Dubai, Sharjah and Abu Dhabi', link: '' },
      ],
      assurances: [
        { title: 'Our own engineers', description: 'Support is delivered by people we employ, remotely and on site. Work is not passed to a subcontractor you never meet and cannot hold to anything.' },
        { title: 'Accountable in writing', description: 'Response times, what is covered and what is charged separately are set out in the contract before it starts, not decided after a problem happens.' },
      ],
    },
  },
  // The closing panel. Phone, email and location come from Contact details
  // & logo; only their labels and the support line are set here.
  about_cta: {
    fields: {
      eyebrow: 'Free consultation',
      heading: 'Tell us about your setup.',
      heading_soft: 'We will handle the rest.',
      intro: 'No commitment, no sales pitch. Just a straight conversation about what your business needs and how we can help.',
      link_label: 'Get in touch',
      link: '/contact-us',
      phone_label: 'Phone',
      email_label: 'Email',
      address_label: 'Location',
      support_label: 'Support',
      support_text: '24/7 — always available',
    },
    lists: {},
  },

  // ---- Services page (app/services) ----
  // Saved on the "services" page and edited on the admin's "Services page
  // sections" screen. The banner is that page's hero (Heroes screen); the
  // services are the Services records, grouped as in the Services menu.

  // The banner's figures, under its buttons, and the heading of the index
  // of every service beside it. {services} is the number of services.
  services_stats: {
    fields: { index_label: 'Every service at a glance' },
    lists: {
      stats: [
        { title: '{clients}', description: 'Businesses served across the UAE' },
        { title: '{rating}★', description: 'Google rating from {reviews} reviews' },
        { title: '{years}+', description: 'Years operating in Dubai' },
      ],
    },
  },
  // "Not sure where to start?": pick a situation, see the services that
  // answer it (up to three, by their slugs).
  services_finder: {
    fields: {
      eyebrow: 'Not sure where to start?',
      heading: 'Tell us what’s going on,',
      heading_soft: 'we’ll point you to the right service.',
      result_label: 'Where we’d start',
    },
    lists: {
      situations: [
        { title: 'Opening or moving an office', description: 'Cabling, Wi-Fi, CCTV and access control planned together, then looked after from the first day.', service1: 'system-integration', service2: 'it-amc-services-dubai', service3: 'cyber-security' },
        { title: 'IT bills that are hard to predict', description: 'One fixed monthly fee for remote support, on-site visits and monitoring, with backups included in the plan.', service1: 'it-amc-services-dubai', service2: 'data-backup-recovery', service3: '' },
        { title: 'Worried about ransomware or data loss', description: 'Firewall, endpoint and email protection, with tested backups behind them, so one bad click doesn’t stop the business.', service1: 'cyber-security', service2: 'data-backup-recovery', service3: '' },
        { title: 'Moving email and files to the cloud', description: 'Microsoft 365 or Azure set up, your data moved across and your team protected once it’s there.', service1: 'cloud-services-dubai', service2: 'cyber-security', service3: '' },
        { title: 'Not enough enquiries online', description: 'A fast website or landing page, with SEO and ads that bring the right visitors to it.', service1: 'website-development', service2: 'digital-marketing', service3: 'landing-page-designing' },
        { title: 'A brand that looks out of date', description: 'A logo, brand identity and website that look as serious as the business behind them.', service1: 'graphics-designing', service2: 'website-development', service3: '' },
      ],
    },
  },
  // The heading above the groups, and beside each Services menu group,
  // matched by the group's name: a few words about it and a photograph
  // (wide screens only).
  services_groups: {
    fields: {
      eyebrow: 'Browse by area',
      heading: 'Every service,',
      heading_soft: 'grouped by what it looks after.',
    },
    lists: {
      groups: [
        { title: 'IT Support & Infrastructure', description: 'Day-to-day IT support, the network and hardware behind it, and backups that keep your data safe.', image: '', image_alt: '' },
        { title: 'Cloud & Security', description: 'Microsoft 365 and Azure set up and run for you, with the firewalls and email protection that keep threats out.', image: '', image_alt: '' },
        { title: 'Digital & Creative', description: 'Websites, apps, design and marketing that bring in customers, from the team that already runs your IT.', image: '', image_alt: '' },
      ],
    },
  },
  // One team against separate vendors, row by row.
  services_compare: {
    fields: {
      eyebrow: 'Why one team',
      heading: 'One accountable team,',
      heading_soft: 'instead of five vendors.',
      us_label: 'With Byteflow',
      them_label: 'With separate vendors',
    },
    lists: {
      rows: [
        { title: 'Who you call', us: 'One phone number and one account manager', them: 'A different company for each problem' },
        { title: 'What you pay', us: 'One fixed monthly invoice, no call-out fees', them: 'Separate bills, with extras for urgent visits' },
        { title: 'How fast help arrives', us: '2-hour response on every AMC plan', them: 'Whatever each contract allows' },
        { title: 'When something breaks', us: 'We own the fix, whatever the cause', them: 'Each vendor points to another' },
        { title: 'How it’s planned', us: 'IT, cloud, security and web planned together', them: 'Set up separately, rarely in step' },
      ],
    },
  },
  // Which of the page's sections show. The spotlight is the Services menu's
  // "Most popular" card (Header menu).
  services_sections: {
    fields: { finder: 'yes', spotlight: 'yes', compare: 'yes' },
    lists: {},
  },

  // ---- Industries page (app/industries) ----
  // Saved on the "industries" page and edited on the admin's "Industries
  // page" screen. The banner is that page's hero (Heroes screen). No client
  // names: each industry is what usually gets in the way there, how we
  // handle it, and the services we use (up to three, by their slugs).
  industries_list: {
    fields: {
      nav_label: 'Industries',
      challenges_label: 'What gets in the way',
      approach_label: 'How we handle it',
      services_label: 'Services we use',
    },
    lists: {
      industries: [
        { title: 'Clinics & Healthcare', icon: 'health', summary: 'Clinic systems, patient records and front-desk technology that have to work for every appointment.', challenges: 'Patient records that must stay private and backed up\nFront desk, booking and billing PCs that cannot go down mid-shift\nMedical devices, staff and patients sharing one network', approach: 'Separate, secured networks for clinical, staff and guest devices\nAutomated, tested backups of patient and billing data\nRemote and on-site support under one AMC plan', service1: 'it-amc-services-dubai', service2: 'cyber-security', service3: 'data-backup-recovery' },
        { title: 'Schools & Education', icon: 'education', summary: 'Classrooms, staff rooms and offices on one network that has to hold up all day.', challenges: 'Hundreds of student and staff devices on one network\nClassrooms that need reliable Wi-Fi from the first lesson to the last\nControlling what students can reach online', approach: 'Campus-wide network and Wi-Fi design\nMicrosoft 365 accounts and devices managed centrally\nFirewall and content filtering rules for student access', service1: 'system-integration', service2: 'cloud-services-dubai', service3: 'cyber-security' },
        { title: 'Real Estate', icon: 'real-estate', summary: 'Agents on site visits, offices and showrooms, all working from the same listings and leads.', challenges: 'Agents working from viewings, showrooms and home\nLeads spread across portals, inboxes and phones\nNew offices and showrooms opening on tight timelines', approach: 'Cloud email, files and Teams that work from anywhere\nWebsites and landing pages built to bring in enquiries\nOffice and showroom fit-outs: cabling, Wi-Fi and CCTV', service1: 'cloud-services-dubai', service2: 'website-development', service3: 'system-integration' },
        { title: 'Retail & Ecommerce', icon: 'retail', summary: 'Tills, stock and the online store, all needing to stay up while customers are buying.', challenges: 'Point-of-sale and stock systems that must stay online\nCard payments and customer details to protect\nAn online store competing for the same searches as everyone else', approach: 'Store networks, CCTV and POS connectivity set up and monitored\nFirewall and endpoint protection for tills and the back office\nEcommerce websites, SEO and ads that bring buyers in', service1: 'website-development', service2: 'digital-marketing', service3: 'cyber-security' },
        { title: 'Logistics', icon: 'logistics', summary: 'Warehouses, offices and drivers on different sites, with systems that run around the clock.', challenges: 'Warehouses, offices and yards on separate sites\nTracking and dispatch systems that run day and night\nRansomware that can stop shipments overnight', approach: 'Site-to-site networking and warehouse Wi-Fi\nMonitoring around the clock, with backups ready to restore\nEndpoint and email protection on every site', service1: 'system-integration', service2: 'data-backup-recovery', service3: 'cyber-security' },
        { title: 'Hospitality', icon: 'hospitality', summary: 'Guest Wi-Fi, cameras and property systems across buildings that never close.', challenges: 'Guest Wi-Fi that simply has to work\nCCTV and access control across large buildings\nBooking and property systems that cannot stop', approach: 'Separate guest, staff and system networks\nCCTV, access control and Wi-Fi fit-outs\nMonitoring, with on-site support when something fails', service1: 'system-integration', service2: 'it-amc-services-dubai', service3: 'cyber-security' },
        { title: 'Law Firms & Professional Services', icon: 'legal', summary: 'Confidential files, constant email and people working from courts, client offices and home.', challenges: 'Confidential client files that must stay private\nEmail as the main target for phishing and payment fraud\nPartners and staff working from outside the office', approach: 'Email security and anti-phishing protection\nMicrosoft 365 with controlled sharing and backups\nSecure remote access for the whole team', service1: 'cyber-security', service2: 'cloud-services-dubai', service3: 'data-backup-recovery' },
        { title: 'Corporate Offices & SMEs', icon: 'corporate', summary: 'Growing teams without a full IT department, who need everything to just work.', challenges: 'No in-house IT person, or one stretched across everything\nIT costs that change from month to month\nNew starters who need laptops, accounts and access quickly', approach: 'One fixed monthly AMC for support and on-site visits\nNew starters set up with devices, email and access\nOne team for IT, cloud, security and the website', service1: 'it-amc-services-dubai', service2: 'cloud-services-dubai', service3: 'website-development' },
      ],
    },
  },

  // ---- Projects page (app/projects) and each project's page ----
  // Saved on the "projects" page and edited on the admin's "Projects page"
  // screen. The banner is that page's hero (Heroes screen); the projects
  // themselves are the Projects screen. The banner's figures are counts of
  // the published projects; only their labels are here.
  projects_page: {
    fields: {
      stat_projects: 'Case studies',
      stat_services: 'Services',
      stat_industries: 'Industries',
      stat_clients: 'Clients served',
      eyebrow: 'Case studies',
      heading: 'What each business needed,',
      heading_soft: 'and what we delivered.',
      filter_label: 'Filter by service',
      all_label: 'All work',
      empty_text: 'No projects for this service yet.',
      link_label: 'View case study',
    },
    lists: {},
  },
  projects_detail: {
    fields: {
      back_label: 'All projects',
      primary_label: 'Start a similar project',
      primary_link: '/contact-us',
      story_heading: 'The project',
      details_label: 'Project details',
      service_label: 'Service',
      industry_label: 'Industry',
      year_label: 'Year',
      delivered_label: 'What we delivered',
      tags_label: 'Technology used',
      more_eyebrow: 'More work',
      more_heading: 'Related projects',
      more_link_label: 'See all projects',
    },
    lists: {},
  },
  // The closing panel on the Projects page and every project's page, as on
  // About Us; the phone, email and address are Contact details & logo.
  projects_cta: {
    fields: {
      eyebrow: 'Have a project in mind?',
      heading: 'Tell us what you want to achieve.',
      heading_soft: 'We will come back with a plan.',
      intro: 'Tell us what you are trying to achieve and we will come back to you with a plan, not a sales pitch.',
      link_label: 'Start a conversation',
      link: '/contact-us',
      phone_label: 'Phone',
      email_label: 'Email',
      address_label: 'Location',
      support_label: 'Support',
      support_text: '24/7 — always available',
    },
    lists: {},
  },

  // ---- Blog page (app/blog) ----
  // Saved on the "blog" page and edited on the admin's "Blog page" screen.
  // The banner is that page's hero (Heroes screen); the articles are Blog
  // posts. The banner's figures are counts of the published posts; only
  // their labels are here. featured: a post's slug, or 'latest'.
  blog_page: {
    fields: {
      stat_articles: 'Articles published',
      stat_topics: 'Topics',
      stat_latest: 'Latest article',
      featured: 'latest',
      picked_badge: "Editor's pick",
      latest_badge: 'Latest',
      eyebrow: 'All articles',
      heading: 'Browse by topic,',
      heading_soft: 'or search for what you need.',
      all_label: 'All topics',
      filter_label: 'Filter by topic',
      search_label: 'Search articles',
      search_placeholder: 'Search articles…',
      article_word: 'article',
      articles_word: 'articles',
      clear_label: 'Clear filters',
      empty_text: 'No articles match your search.',
      more_label: 'Show more articles',
      read_label: 'Read article',
      author_fallback: 'Byteflow team',
    },
    lists: {},
  },
  // The closing panel, as on About Us; the phone, email and address are
  // Contact details & logo.
  blog_cta: {
    fields: {
      eyebrow: 'Have an IT problem you need solved?',
      heading: 'Reading about it is one thing.',
      heading_soft: 'Getting it fixed is another.',
      intro: 'Tell us what is going on and our team will help you sort it out, with no sales pitch.',
      link_label: 'Talk to our team',
      link: '/contact-us',
      phone_label: 'Phone',
      email_label: 'Email',
      address_label: 'Location',
      support_label: 'Support',
      support_text: '24/7 — always available',
    },
    lists: {},
  },

  // ---- IT AMC page (app/it-amc-services-dubai) ----
  // Saved on the "it-amc-services-dubai" page and edited on the admin's
  // "IT AMC page" screen. The banner is that page's hero (Heroes screen);
  // amc_layout sets which sections follow it, in what order. Starting
  // wording comes from the page's own published content; the admin replaces
  // it with the approved text.

  // The sections under the banner, in order. Each item's title is a
  // section's key (amcSectionKeys); "show" switches it on or off.
  amc_layout: {
    fields: {},
    lists: {
      sections: [
        { title: 'highlights', show: 'yes' },
        { title: 'intro', show: 'yes' },
        { title: 'services', show: 'yes' },
        { title: 'preventive', show: 'yes' },
        { title: 'plans', show: 'yes' },
        { title: 'costs', show: 'yes' },
        { title: 'breakfix', show: 'yes' },
        { title: 'industries', show: 'yes' },
        { title: 'why', show: 'yes' },
        { title: 'process', show: 'yes' },
        { title: 'sla', show: 'yes' },
        { title: 'coverage', show: 'yes' },
        { title: 'scope', show: 'yes' },
        { title: 'pageblocks', show: 'yes' },
        { title: 'related', show: 'yes' },
        { title: 'faq', show: 'yes' },
        { title: 'reviews', show: 'yes' },
        { title: 'contact', show: 'yes' },
      ],
    },
  },
  // The page's search title and description, as it had them until changed here.
  amc_seo: {
    fields: {
      title: 'IT AMC Support & Services in Dubai | Byteflow',
      description: 'IT AMC support across Dubai, Business Bay, JLT and WTC included. One fixed monthly fee, 2-hour on-site response, 24/7 monitoring and no surprise bills.',
    },
    lists: {},
  },
  // The figures under the banner's buttons.
  amc_figures: {
    fields: {},
    lists: {
      stats: [
        { title: '2 hrs', description: 'On-site response across Dubai' },
        { title: '24/7', description: 'Remote monitoring' },
        { title: '{years}+', description: 'Years looking after UAE businesses' },
      ],
    },
  },
  amc_highlights: {
    fields: {},
    lists: {
      items: [
        { title: 'One fixed monthly fee', description: 'Support, maintenance and monitoring on one invoice, with no per-incident charges.', icon: 'fee' },
        { title: '2-hour on-site response', description: 'Across Dubai, with Sharjah and Abu Dhabi covered under the same AMC.', icon: 'clock' },
        { title: '24/7 monitoring', description: 'Every laptop, desktop and server watched for problems around the clock.', icon: 'monitor' },
        { title: 'A dedicated account engineer', description: 'One person who knows your setup, and one number to call.', icon: 'person' },
      ],
    },
  },
  amc_intro: {
    fields: {
      eyebrow: 'What is IT AMC?',
      heading: 'IT support',
      heading_soft: 'on a fixed monthly plan.',
      text: 'An IT AMC (annual maintenance contract) covers the support, maintenance and monitoring of your office’s IT for one fixed monthly fee, instead of paying a technician each time something breaks.\n\nWith Byteflow, every device, server and network in your office is monitored, patched and supported, remotely and on site, by a team that already knows your setup.',
      points: 'Unlimited remote support\nOn-site visits when a fix needs an engineer\nMonitoring, patching and a monthly health report',
      image: '',
      image_alt: '',
    },
    lists: {},
  },
  // The categories are the "tabs" list; each service names its category.
  amc_services: {
    fields: {
      eyebrow: 'Complete IT AMC services',
      heading: 'Everything we look after,',
      heading_soft: 'grouped by area.',
      intro: 'Pick an area to see what the AMC covers there.',
    },
    lists: {
      tabs: [
        { title: 'End-User IT Support', description: 'Support for your people and the devices they work on.', icon: 'laptop', image: '', image_alt: '' },
        { title: 'Server & Network Infrastructure', description: 'The servers, network and connections your office runs on.', icon: 'server', image: '', image_alt: '' },
        { title: 'Microsoft 365 & Cloud Support', description: 'Email, files and collaboration, managed for you.', icon: 'cloud', image: '', image_alt: '' },
        { title: 'Cybersecurity & Business Continuity', description: 'Protection, backups and recovery.', icon: 'shield', image: '', image_alt: '' },
        { title: 'Additional IT Services', description: 'Installations and projects alongside your AMC, quoted separately.', icon: 'tools', image: '', image_alt: '' },
      ],
      services: [
        { title: 'Unlimited Remote Support', description: 'Raise a ticket or call us and get remote assistance within 30 minutes. No per-incident fees, no limits on the number of requests per month.', tab: 'End-User IT Support', image: '', image_alt: '' },
        { title: 'On-site Engineer Visits', description: 'When remote support is not enough, a certified engineer arrives at your office within 2 hours across Dubai, Sharjah and Abu Dhabi.', tab: 'End-User IT Support', image: '', image_alt: '' },
        { title: 'Endpoint Monitoring', description: 'Every laptop, desktop and workstation is monitored 24/7 for hardware issues, software conflicts, disk health and security threats.', tab: 'End-User IT Support', image: '', image_alt: '' },
        { title: 'Software Updates and Patching', description: 'We handle all OS updates, firmware patches and critical security fixes during off-hours so your team is never disrupted.', tab: 'End-User IT Support', image: '', image_alt: '' },
        { title: 'IT Asset Inventory', description: 'A live register of every device, licence and warranty expiry date in your office so you always know what you own and when it needs replacing.', tab: 'End-User IT Support', image: '', image_alt: '' },
        { title: 'Server and Network Management', description: 'We configure, patch and monitor your Windows or Linux servers, routers, switches and firewalls to keep everything running at peak performance.', tab: 'Server & Network Infrastructure', image: '', image_alt: '' },
        { title: 'Microsoft 365 User Administration', description: 'New starters set up, leavers removed, and mailboxes and access kept in order.', tab: 'Microsoft 365 & Cloud Support', image: '', image_alt: '' },
        { title: 'Licence Management', description: 'Your Microsoft 365 licences assigned, renewed and kept to the number you need.', tab: 'Microsoft 365 & Cloud Support', image: '', image_alt: '' },
        { title: 'SharePoint and Teams Configuration', description: 'Sites, channels and sharing set up for the way your team works.', tab: 'Microsoft 365 & Cloud Support', image: '', image_alt: '' },
        { title: 'Microsoft 365 Migrations', description: 'Email and files moved to Microsoft 365 from your old system.', tab: 'Microsoft 365 & Cloud Support', image: '', image_alt: '' },
        { title: 'Email Security', description: 'Spam and phishing filtered before it reaches your team.', tab: 'Cybersecurity & Business Continuity', image: '', image_alt: '' },
        { title: 'Antivirus Management', description: 'Antivirus kept installed, updated and watched on every device.', tab: 'Cybersecurity & Business Continuity', image: '', image_alt: '' },
        { title: 'Backup Configuration', description: 'Backups set up and checked as part of onboarding.', tab: 'Cybersecurity & Business Continuity', image: '', image_alt: '' },
        { title: 'Website Management & SEO Monitoring', description: 'Your website kept online, secure and visible: domain renewal, hosting and SSL certificates, and monthly SEO health monitoring.', tab: 'Additional IT Services', image: '', image_alt: '' },
        { title: 'CCTV and Access Control', description: 'Cameras and door access supplied, installed and supported.', tab: 'Additional IT Services', image: '', image_alt: '' },
        { title: 'Structured Cabling', description: 'Network cabling for new and existing offices.', tab: 'Additional IT Services', image: '', image_alt: '' },
        { title: 'VoIP and Desk Phones', description: 'Business phone systems set up and supported.', tab: 'Additional IT Services', image: '', image_alt: '' },
        { title: 'IT Procurement', description: 'Laptops, servers and network equipment sourced and installed.', tab: 'Additional IT Services', image: '', image_alt: '' },
        { title: 'Office Relocation', description: 'Your IT moved to a new office, scoped and quoted as a project.', tab: 'Additional IT Services', image: '', image_alt: '' },
      ],
    },
  },
  amc_preventive: {
    fields: { eyebrow: 'Preventive maintenance', heading: 'Problems fixed', heading_soft: 'before they stop your work.' },
    lists: {
      items: [
        { title: 'Monitoring around the clock', description: 'Every laptop, desktop and workstation is monitored 24/7 for hardware issues, software conflicts, disk health and security threats.', image: '', image_alt: '' },
        { title: 'Patching outside working hours', description: 'OS updates, firmware patches and critical security fixes are applied during off-hours, so your team is never disrupted.', image: '', image_alt: '' },
        { title: 'Monthly health reports', description: 'Every month you receive a report covering uptime, issues resolved, devices monitored and upcoming risks.', image: '', image_alt: '' },
        { title: 'Asset and warranty tracking', description: 'A live register of every device, licence and warranty expiry date, so replacements are planned, not urgent.', image: '', image_alt: '' },
      ],
    },
  },
  // The plans, also summed up in the card beside the banner, and compared
  // in a table: each row's plan1–plan4 is "yes", "no" or a short text.
  amc_plans: {
    fields: {
      ...planLabels,
      eyebrow: 'Plans and pricing',
      heading: 'Published prices,',
      heading_soft: 'per user, per month.',
      intro: '',
      card_label: 'Plans from',
      unit: 'per user / month',
      note: 'Prices exclude 5% VAT. A 10-person office on Essential is AED 300/month.',
      terms: 'No setup fee. No minimum term beyond the contract year. How often you call does not change the price — unlimited means unlimited.',
      button_label: 'Get a free quote',
      button_link: '/contact-us',
      compare_label: 'Compare plans',
      table_heading: 'Compare the plans',
    },
    lists: {
      plans: [
        { title: 'Essential', price: 'AED 30', summary: 'Remote support and monitoring for every device.', points: 'Unlimited remote support\n24/7 endpoint monitoring\nSoftware updates and patching', badge: '', ...planExtras },
        { title: 'Standard', price: 'AED 60', summary: 'Everything in Essential, plus:', points: 'On-site engineer visits\nServer and network management\nIT asset inventory', badge: 'Includes on-site visits', ...planExtras },
        { title: 'Complete', price: 'AED 90', summary: 'Everything in Standard, plus:', points: 'Website management and SEO monitoring\nPriority SLA\nA dedicated account manager', badge: '', ...planExtras },
      ],
      compare: [
        { title: 'Unlimited remote support', group: '', plan1: 'yes', plan2: 'yes', plan3: 'yes', plan4: '' },
        { title: '24/7 endpoint monitoring', group: '', plan1: 'yes', plan2: 'yes', plan3: 'yes', plan4: '' },
        { title: 'Software updates and patching', group: '', plan1: 'yes', plan2: 'yes', plan3: 'yes', plan4: '' },
        { title: 'On-site engineer visits', group: '', plan1: 'no', plan2: 'yes', plan3: 'yes', plan4: '' },
        { title: 'Server and network management', group: '', plan1: 'no', plan2: 'yes', plan3: 'yes', plan4: '' },
        { title: 'IT asset inventory', group: '', plan1: 'no', plan2: 'yes', plan3: 'yes', plan4: '' },
        { title: 'Website management and SEO monitoring', group: '', plan1: 'no', plan2: 'no', plan3: 'yes', plan4: '' },
        { title: 'Priority SLA', group: '', plan1: 'no', plan2: 'no', plan3: 'yes', plan4: '' },
        { title: 'A dedicated account manager', group: '', plan1: 'no', plan2: 'no', plan3: 'yes', plan4: '' },
      ],
    },
  },
  amc_costs: {
    fields: {
      eyebrow: 'Cost factors',
      heading: 'What sets the price',
      heading_soft: 'of an IT AMC in Dubai.',
      intro: 'Every quote is fixed and itemised. This is what it depends on.',
    },
    lists: {
      factors: [
        { title: 'Number of users', description: 'Plans are priced per user, per month, so the number of users sets most of the price.' },
        { title: 'Number of servers', description: 'Servers need more monitoring and maintenance than laptops and desktops.' },
        { title: 'Coverage hours', description: 'The hours you need support for shape the plan.' },
        { title: 'Number of sites', description: 'Each office location is covered, with an engineer assigned per site.' },
        { title: 'Plan level', description: 'Essential, Standard or Complete, depending on what you need included.' },
      ],
    },
  },
  amc_breakfix: {
    fields: {
      eyebrow: 'AMC or break-fix?',
      heading: 'Two ways',
      heading_soft: 'to pay for IT support.',
      us_label: 'IT AMC',
      them_label: 'Break-fix',
      footer: 'Break-fix is usually cheaper for very small teams and more expensive for everyone else, because nobody is being paid to prevent problems.',
    },
    lists: {
      rows: [
        { title: 'How you pay', us: 'One fixed monthly fee covering everything', them: 'A charge for each incident' },
        { title: 'Prevention', us: 'Systems monitored and maintained before problems start', them: 'Nobody is paid to prevent problems' },
        { title: 'Budgeting', us: 'The same invoice every month', them: 'Costs change with every call-out' },
        { title: 'Best for', us: 'Most offices', them: 'Very small teams with few issues' },
      ],
    },
  },
  // Each industry's link is its card on the Industries page.
  amc_industries: {
    fields: { eyebrow: 'Industries we support', heading: 'IT support for', heading_soft: 'the way your sector works.', link_label: 'See all industries', link: '/industries' },
    lists: {
      industries: [
        { title: 'Clinics & Healthcare', description: 'Clinic systems, patient records and front-desk technology that have to work for every appointment.', icon: 'health', link: '/industries#clinics-healthcare' },
        { title: 'Schools & Education', description: 'Classrooms, staff rooms and offices on one network that has to hold up all day.', icon: 'education', link: '/industries#schools-education' },
        { title: 'Real Estate', description: 'Agents on site visits, offices and showrooms, all working from the same listings and leads.', icon: 'real-estate', link: '/industries#real-estate' },
        { title: 'Retail & Ecommerce', description: 'Tills, stock and the online store, all needing to stay up while customers are buying.', icon: 'retail', link: '/industries#retail-ecommerce' },
        { title: 'Logistics', description: 'Warehouses, offices and drivers on different sites, with systems that run around the clock.', icon: 'logistics', link: '/industries#logistics' },
        { title: 'Hospitality', description: 'Guest Wi-Fi, cameras and property systems across buildings that never close.', icon: 'hospitality', link: '/industries#hospitality' },
        { title: 'Law Firms & Professional Services', description: 'Confidential files, constant email and people working from courts, client offices and home.', icon: 'legal', link: '/industries#law-firms-professional-services' },
        { title: 'Corporate Offices & SMEs', description: 'Growing teams without a full IT department, who need everything to just work.', icon: 'corporate', link: '/industries#corporate-offices-smes' },
      ],
    },
  },
  amc_benefits: {
    fields: { eyebrow: 'Why Byteflow', heading: 'Why businesses choose', heading_soft: 'Byteflow for their AMC.' },
    lists: {
      benefits: [
        { title: 'Predictable monthly cost', description: 'One fixed invoice replaces dozens of unpredictable repair bills. Budget with confidence every month of the year.' },
        { title: 'Faster issue resolution', description: 'A dedicated engineer already knows your setup, so problems are solved faster than starting from scratch with a new vendor every time.' },
        { title: 'Proactive maintenance', description: 'We identify failing hardware and software conflicts before they become outages, reducing unplanned downtime.' },
        { title: 'Single point of contact', description: 'One account manager, one phone number. No being passed between departments or waiting on hold with multiple vendors.' },
      ],
    },
  },
  amc_process: {
    fields: { eyebrow: 'Our IT AMC process', heading: 'From the first visit', heading_soft: 'to the monthly report.' },
    lists: {
      steps: [
        { title: 'Free IT Audit', description: 'We visit your office and document every device, server, licence and network component. No obligation, no cost.' },
        { title: 'Custom AMC Proposal', description: 'You receive a fixed-price proposal within 24 hours, itemised by service level and number of users. No hidden charges.' },
        { title: 'Onboarding and Baseline', description: 'Our engineers install monitoring agents, update all software, configure backups and document your entire IT environment.' },
        { title: 'Ongoing Management', description: 'From day one, your systems are monitored 24/7. Tickets are resolved remotely or on-site within the agreed SLA.' },
        { title: 'Monthly Reporting', description: 'Every month you receive a health report covering uptime, issues resolved, devices monitored and upcoming risks.' },
      ],
    },
  },
  // Each priority's response is the commitment shown beside it.
  amc_sla: {
    fields: {
      eyebrow: 'SLA & response times',
      heading: 'How fast we respond,',
      heading_soft: 'by priority.',
      intro: 'Every ticket is given a priority, and the priority sets how fast we act.',
      escalation_heading: 'Escalation',
      escalation: '',
    },
    lists: {
      priorities: [
        { title: 'Critical', description: 'A server outage or a fault stopping the whole office.', response: 'We mobilise immediately' },
        { title: 'Remote support', description: 'Any ticket that can be fixed remotely.', response: 'Within 30 minutes' },
        { title: 'On-site visit', description: 'When the fix needs an engineer at your office.', response: 'Within 2 hours across Dubai' },
      ],
    },
  },
  amc_areas: {
    fields: {
      eyebrow: 'Dubai & UAE coverage',
      heading: 'The same response time,',
      heading_soft: 'wherever your office is.',
      text: 'The two-hour on-site response applies across Dubai, with no premium zone and no area we charge extra to reach. Sharjah and Abu Dhabi are covered under the same AMC.',
      areas: 'Business Bay\nJLT\nWorld Trade Centre\nDIFC\nDowntown\nDeira\nAl Barsha\nTECOM\nSharjah\nAbu Dhabi',
    },
    lists: {},
  },
  // What the AMC covers ("included") beside what it does not ("items").
  amc_excluded: {
    fields: {
      eyebrow: 'No surprises',
      heading: 'What’s included and what isn’t',
      intro: 'Every AMC has exclusions. Most providers do not publish them, which is how businesses end up with invoices they did not expect. Ours are below.',
      included_heading: 'Included',
      excluded_heading: 'Not included',
      footer: 'If something falls outside your contract, we tell you before doing the work, not on the invoice afterwards.',
    },
    lists: {
      included: [
        { title: 'Unlimited remote support' },
        { title: 'On-site engineer visits (Standard and Complete)' },
        { title: 'Monitoring, patching and updates' },
        { title: 'Microsoft 365 administration' },
        { title: 'Antivirus management' },
        { title: 'A monthly health report' },
      ],
      items: [
        { title: 'Hardware and its replacement cost', description: 'We diagnose, source and install it, and the labour is covered by your contract. The equipment itself is quoted separately.' },
        { title: 'Third-party software licences', description: 'Microsoft 365, Adobe and similar are billed to you directly.' },
        { title: 'Major projects', description: 'Office relocations, full infrastructure rebuilds and large migrations are scoped and quoted separately.' },
        { title: 'Full website redesigns', description: 'Maintenance, updates and uptime monitoring are covered on the Complete plan. A new build is a separate piece of work.' },
        { title: 'Paid advertising spend', description: 'SEO monitoring is included on Complete. Google Ads and social media budget is not.' },
        { title: 'Specialist third-party applications', description: 'Unless agreed at contract stage.' },
      ],
    },
  },
  // The reviews are the published Customer reviews; case studies are added here.
  amc_reviews: {
    fields: { eyebrow: 'Clients', heading: 'What our clients', heading_soft: 'say about us.', count: '6', cases_heading: 'Related projects' },
    lists: { cases: [] },
  },
  // The page's own questions; FAQs added for this page on the FAQs screen follow them.
  amc_faq: {
    fields: { eyebrow: 'FAQ', heading: 'Questions we get', heading_soft: 'asked all the time.', intro: 'Everything you need to know about IT AMC support with Byteflow.' },
    lists: {
      faqs: [
        { title: 'What exactly does an IT AMC cover?', description: 'Our AMC covers unlimited remote and on-site support for all devices, servers, network equipment and software in your office. It includes proactive monitoring, patching, antivirus management and a dedicated account engineer. You pay one fixed monthly fee with no additional call-out or per-incident charges.' },
        { title: 'How quickly do you respond when something breaks?', description: 'Remote support is available within 30 minutes of a ticket being raised. For issues that require a physical presence, our engineers arrive on-site within 2 hours across Dubai, Sharjah and Abu Dhabi. For critical server outages, we treat it as a P1 and mobilise immediately.' },
        { title: 'Do you support businesses with multiple offices?', description: 'Yes. We manage multi-site businesses with offices across Dubai, Sharjah, Abu Dhabi and other UAE emirates. We assign a dedicated engineer per site and provide centralised monitoring from our NOC, so issues in any location are spotted and resolved quickly.' },
        { title: 'Can we add services to the AMC later?', description: 'Absolutely. Many clients start with basic IT support and later add cloud management, cyber security monitoring or Microsoft 365 administration. Your AMC can be expanded at any time without signing a new long-term contract.' },
        { title: 'Do you cover Business Bay, JLT and World Trade Centre?', description: 'Yes, and at the same service level as everywhere else. The two-hour on-site response applies across Dubai, so Business Bay, JLT, World Trade Centre, DIFC, Downtown, Deira, Al Barsha and TECOM are all covered on the same SLA — there is no premium zone and no area we charge extra to reach. Engineers are dispatched from whichever team is closest on the day. Sharjah and Abu Dhabi are covered under the same AMC.' },
        { title: 'What is the minimum contract length?', description: 'We offer monthly rolling plans as well as annual contracts. Annual plans come with better pricing and priority SLA guarantees. Most clients choose annual contracts because the savings are significant, but we never force you into a long-term commitment.' },
      ],
    },
  },
  amc_contact: {
    fields: {
      eyebrow: 'Get a quote',
      heading: 'Ready to put your IT',
      heading_soft: 'on one fixed fee?',
      intro: 'Tell us about your office and we’ll send a fixed, itemised AMC proposal within 24 hours.',
      call_label: 'Call us',
      whatsapp_label: 'WhatsApp us',
      promises: 'Free IT audit\nFixed, itemised proposal\nNo obligation',
    },
    lists: {},
  },
  // Each item's title is a service's slug.
  amc_related: {
    fields: { eyebrow: 'Related services', heading: 'Often added to an AMC' },
    lists: { services: [{ title: 'cyber-security' }, { title: 'cloud-services-dubai' }, { title: 'data-backup-recovery' }] },
  },

  // ---- Legal pages (app/privacy-policy, app/terms-and-conditions) ----
  // Each saved on its own page and edited on the admin's "Legal pages"
  // screen. The title is also the link in the footer's Legal column.
  legal_privacy: {
    fields: {
      eyebrow: 'Legal',
      title: 'Privacy Policy',
      updated: 'Last updated: 11 November 2026',
      intro: 'This policy explains what personal information Byteflow collects when you use byteflow.ae or contact us, why we collect it, who we share it with and the choices you have.',
    },
    lists: {
      sections: [
        { title: 'Who we are', description: 'Byteflow Information Technology Co. L.L.C. ("Byteflow", "we", "us") is an IT services company registered in Dubai, United Arab Emirates. We are responsible for the personal information described in this policy.\n\nByteflow Information Technology Co. L.L.C.\nEmaar Park 4, Greens, TECOM, Dubai, United Arab Emirates\nEmail: info@byteflow.ae\nPhone: +971 54 328 2042' },
        { title: 'Information we collect', description: 'Information you give us:\n- Your name, company, email address, phone number and message when you fill in a contact or inquiry form, or send us an email or WhatsApp message.\n- Details you share with us about your business, systems and requirements so we can prepare a quote or provide our services.\n\nInformation collected automatically when you visit the website:\n- Technical details such as your browser, device, approximate location (from your IP address) and the pages you view, collected through cookies and similar technologies.\n\nIf you are a client, we may also access information held on your systems while providing IT support. That access is governed by your service agreement with us, not by this policy.' },
        { title: 'How we use your information', description: 'We use your personal information to:\n- Reply to your inquiries and prepare quotes.\n- Provide, manage and invoice the services you have agreed with us.\n- Send you news and offers by email, where you have agreed to receive them. Every email has an unsubscribe link.\n- Understand how the website is used so we can improve it.\n- Protect the website and our forms against spam and misuse.\n- Meet our legal, tax and accounting obligations.' },
        { title: 'Cookies and analytics', description: 'The website uses cookies and similar technologies. We use Google Analytics to understand how visitors use the website, for example which pages are visited and which lead to an inquiry. Our forms are protected by Google reCAPTCHA, which checks that a form is being sent by a person and not an automated program.\n\nThese services are provided by Google, which processes the information under its own privacy policy. You can block or delete cookies in your browser settings; some parts of the website may not work as intended if you do.' },
        { title: 'Who we share it with', description: 'We do not sell your personal information. We share it only with:\n- Service providers who help us run our business, such as website hosting, email and analytics providers, and only for the purposes described in this policy.\n- Authorities, courts or advisers where the law requires it, or to protect our rights.\n\nSome of these providers may store or process information outside the United Arab Emirates. Where that happens, we take reasonable steps to make sure your information stays protected.' },
        { title: 'How long we keep it', description: 'We keep personal information only for as long as we need it for the purposes above, or for as long as the law requires us to keep it, for example for accounting records. When we no longer need it, we delete it or make it anonymous.' },
        { title: 'How we protect it', description: 'We use technical and organisational measures to protect personal information against loss, misuse and unauthorised access, including access controls and encrypted connections. No method of sending or storing information is completely secure, but we work to keep your information safe.' },
        { title: 'Your rights', description: 'Subject to the law that applies, including the UAE Personal Data Protection Law (Federal Decree-Law No. 45 of 2021), you may ask us to:\n- Tell you what personal information we hold about you and give you a copy.\n- Correct information that is wrong or incomplete.\n- Delete your information, or stop or limit how we use it.\n- Stop sending you marketing emails, at any time.\n\nTo make a request, email info@byteflow.ae. We may need to confirm your identity before we act on it.' },
        { title: 'Children', description: 'Our website and services are intended for businesses. They are not directed at children under 18, and we do not knowingly collect personal information from them.' },
        { title: 'Changes to this policy', description: 'We may update this policy from time to time. The date at the top of this page shows when it was last changed.' },
        { title: 'Contact us', description: 'If you have any questions about this policy or how we handle your personal information, please contact us:\n\nByteflow Information Technology Co. L.L.C.\nEmaar Park 4, Greens, TECOM, Dubai, United Arab Emirates\nEmail: info@byteflow.ae\nPhone: +971 54 328 2042' },
      ],
    },
  },
  legal_terms: {
    fields: {
      eyebrow: 'Legal',
      title: 'Terms & Conditions',
      updated: 'Last updated: 11 November 2026',
      intro: 'These terms apply to your use of byteflow.ae. By using the website you agree to them. Please read them carefully.',
    },
    lists: {
      sections: [
        { title: 'About these terms', description: 'The website byteflow.ae is operated by Byteflow Information Technology Co. L.L.C. ("Byteflow", "we", "us"), a company registered in Dubai, United Arab Emirates. These terms cover your use of the website. If you do not agree with them, please do not use the website.' },
        { title: 'Our services', description: 'The information on this website describes our services in general terms. It is not an offer that can be accepted. The services we provide to a client, and the price, are set out in a written quotation or service agreement. If anything in that quotation or agreement differs from this website or these terms, the quotation or agreement applies.' },
        { title: 'Quotes and prices', description: 'Quotes are valid for the period stated on them. Unless a quote says otherwise, prices are in UAE dirhams (AED) and exclude VAT, which is added at the applicable rate.' },
        { title: 'Using the website', description: 'You agree to use the website only for lawful purposes. You must not:\n- Try to gain unauthorised access to the website, its servers or any connected system.\n- Interfere with how the website works, including by introducing viruses or other harmful code.\n- Copy or collect content from the website by automated means without our written permission.\n- Use the contact forms to send spam or misleading information.' },
        { title: 'Intellectual property', description: 'The content of this website, including its text, design, graphics and the Byteflow name and logo, belongs to Byteflow or is used with permission. You may view and print pages for your own reference, but you may not copy, reproduce or use our content for commercial purposes without our written permission. Other names, logos and trademarks shown on the website belong to their owners.' },
        { title: 'Links to other websites', description: 'The website may link to websites run by others. We do not control those websites and are not responsible for their content or how they handle your information.' },
        { title: 'Accuracy of information', description: 'We work to keep the information on the website accurate and up to date, but we do not guarantee that it is complete, current or free of errors. We may change the website or its content at any time without notice.' },
        { title: 'Limitation of liability', description: 'The website is provided "as is". To the extent permitted by law, Byteflow is not liable for any indirect or consequential loss, or for any loss of data, profit or business, arising from your use of the website or your reliance on its content. Nothing in these terms limits any liability that cannot be limited under the law of the United Arab Emirates.' },
        { title: 'Privacy', description: 'How we collect and use personal information is explained in our Privacy Policy.' },
        { title: 'Governing law', description: 'These terms are governed by the laws of the Emirate of Dubai and the federal laws of the United Arab Emirates. The courts of Dubai have jurisdiction over any dispute arising from them.' },
        { title: 'Changes to these terms', description: 'We may update these terms from time to time. The date at the top of this page shows when they were last changed. Your continued use of the website means you accept the updated terms.' },
        { title: 'Contact us', description: 'If you have any questions about these terms, please contact us:\n\nByteflow Information Technology Co. L.L.C.\nEmaar Park 4, Greens, TECOM, Dubai, United Arab Emirates\nEmail: info@byteflow.ae\nPhone: +971 54 328 2042' },
      ],
    },
  },
} satisfies Record<string, HomeBlock>

export type HomeBlockKey = keyof typeof homeDefaults

const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

/** Saved content laid over the defaults: blank fields and empty lists fall back. */
export function mergeHomeBlock(key: HomeBlockKey, saved: Record<string, unknown> | null): HomeBlock {
  return mergeBlock(homeDefaults[key], saved)
}

/** A block as saved over the given defaults: blank fields and empty lists fall back to them. */
export function mergeBlock(defaults: HomeBlock, saved: Record<string, unknown> | null): HomeBlock {
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

/**
 * A list item's uploaded picture (`image`, described by `image_alt`), or
 * null when it has none, so the section shows its built-in artwork instead.
 * The admin won't save a picture without its description; the title is only
 * a safety net for rows written some other way.
 */
export function pictureOf(item: Item): { src: string; alt: string } | null {
  return item.image ? { src: item.image, alt: item.image_alt || item.title || '' } : null
}

/** "points" are typed one per line in the admin. */
export const lines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
