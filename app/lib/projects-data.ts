export type Metric = { value: string; label: string }

export type Project = {
  slug: string
  client: string
  industry: string
  category: string
  year: string
  title: string
  story: string
  deliverables: string[]
  metrics: Metric[]
  tags: string[]
  featured?: boolean
  image: string
  visual: string
}

export const projects: Project[] = [
  {
    slug: 'al-mansouri-trading-group',
    client: 'Al Mansouri Trading Group',
    industry: 'Trading & Distribution',
    category: 'IT Support',
    year: '2024',
    title: 'Full IT Infrastructure Overhaul Across Three Dubai Offices',
    story: 'Three offices running on completely separate setups, no central management, engineers wasting half their week on duplicate issues. We came in, mapped the whole environment, and rebuilt it properly over a six-week window without taking anyone offline.',
    deliverables: [
      'IT AMC contract covering 62 users across all three sites',
      'Microsoft 365 migration from ageing on-premise Exchange',
      'Fortigate firewall deployment with per-office VLAN segmentation',
      'Structured cabling and server room consolidation',
    ],
    metrics: [
      { value: '40%', label: 'reduction in IT downtime' },
      { value: '48h', label: 'migration window, zero data loss' },
      { value: '62', label: 'users fully supported' },
    ],
    tags: ['IT AMC', 'Microsoft 365', 'Networking', 'Firewall'],
    featured: true,
    image: '/images/projects/al-mansouri-trading.jpg',
    visual: 'it',
  },
  {
    slug: 'gulf-logistics-llc',
    client: 'Gulf Logistics LLC',
    industry: 'Logistics',
    category: 'Cyber Security',
    year: '2023',
    title: 'Ransomware Attack Recovery in Under Six Hours',
    story: 'Friday evening call, servers encrypted, operations halted. By Saturday morning they were back up. No ransom paid, no permanent data loss.',
    deliverables: [
      'Emergency incident response and threat containment',
      'Full data restoration from verified offsite backup',
      'New backup architecture with on-site and cloud mirroring',
      'Staff phishing awareness and response training',
    ],
    metrics: [
      { value: '6h', label: 'total downtime' },
      { value: '100%', label: 'data recovered' },
      { value: 'AED 0', label: 'ransom paid' },
    ],
    tags: ['Ransomware', 'Incident Response', 'Backup'],
    featured: false,
    image: '/images/projects/gulf-logistics.jpg',
    visual: 'cyber',
  },
  {
    slug: 'zayed-law-associates',
    client: 'Zayed Law Associates',
    industry: 'Legal Services',
    category: 'Web & Apps',
    year: '2024',
    title: 'Website Rebuild and Organic Search Overhaul',
    story: 'Site untouched since 2019, buried on page four for every relevant keyword. We rebuilt from scratch and treated SEO as part of the build, not an afterthought.',
    deliverables: [
      'Full website redesign and custom development',
      'Technical and on-page SEO restructure',
      'Google Business Profile audit and optimisation',
      'Monthly content production and link building',
    ],
    metrics: [
      { value: '312%', label: 'organic traffic increase' },
      { value: '#1', label: 'for "law firm Dubai"' },
      { value: '4 months', label: 'to hit targets' },
    ],
    tags: ['Web Development', 'SEO', 'Content'],
    featured: false,
    image: '/images/projects/zayed-law.jpg',
    visual: 'web',
  },
  {
    slug: 'falcon-real-estate',
    client: 'Falcon Real Estate',
    industry: 'Real Estate',
    category: 'Cloud Services',
    year: '2023',
    title: 'Server Room Exit and Full Azure Migration',
    story: 'AED 180,000 a year on ageing hardware already past its refresh cycle. Moving to Azure was the obvious call. Getting there without disrupting 80 active brokers was the job.',
    deliverables: [
      'Azure infrastructure design and provisioning',
      'File server and line-of-business application migration',
      'Microsoft 365 deployment and licence optimisation',
      'Ongoing cloud management and cost monitoring',
    ],
    metrics: [
      { value: 'AED 180k', label: 'annual infra cost eliminated' },
      { value: '99.9%', label: 'uptime post-migration' },
      { value: '0', label: 'disruption incidents' },
    ],
    tags: ['Azure', 'Cloud Migration', 'Microsoft 365'],
    featured: false,
    image: '/images/projects/falcon-real-estate.jpg',
    visual: 'cloud',
  },
  {
    slug: 'techbridge-uae',
    client: 'TechBridge UAE',
    industry: 'Technology',
    category: 'Digital Marketing',
    year: '2024',
    title: 'Google Ads Rebuild and B2B Lead Generation Programme',
    story: 'High monthly spend, low-quality leads, no clear attribution. We restructured the account completely, rewrote every ad, tightened targeting, and added SEO to build something durable underneath.',
    deliverables: [
      'Full Google Ads account restructure and copy rewrite',
      'SEO programme with technical and content focus',
      'LinkedIn campaign management for enterprise prospects',
      'Monthly performance reporting with full attribution',
    ],
    metrics: [
      { value: '2.4x', label: 'lead volume increase' },
      { value: 'AED 12', label: 'cost per qualified lead' },
      { value: '67%', label: 'improvement in lead quality' },
    ],
    tags: ['Google Ads', 'SEO', 'LinkedIn', 'B2B'],
    featured: false,
    image: '/images/projects/techbridge-uae.jpg',
    visual: 'marketing',
  },
  {
    slug: 'marina-bay-hotel',
    client: 'Marina Bay Hotel',
    industry: 'Hospitality',
    category: 'System Integration',
    year: '2022',
    title: '240-Camera CCTV and Full Network Fit-Out, New Build',
    story: 'Brand-new 18-floor property, everything specified from scratch. Structured cabling, access points, full CCTV across every floor and both car parks, and a guest network that had to hold 300 concurrent devices without dropping.',
    deliverables: [
      'Structured cabling design and installation across 18 floors',
      '240-camera Hikvision CCTV system with central NVR room',
      'WiFi mesh covering guest floors, back-of-house and management',
      'IP intercom and access control integration',
    ],
    metrics: [
      { value: '240', label: 'cameras deployed' },
      { value: '18', label: 'floors covered' },
      { value: '42 days', label: 'full project completion' },
    ],
    tags: ['CCTV', 'Cabling', 'WiFi', 'Access Control'],
    featured: false,
    image: '/images/projects/marina-bay-hotel.jpg',
    visual: 'integration',
  },
  {
    slug: 'rashidi-group',
    client: 'Rashidi Group',
    industry: 'Conglomerate',
    category: 'Cyber Security',
    year: '2023',
    title: 'Enterprise Cybersecurity Programme After Critical Audit',
    story: 'Fourteen critical vulnerabilities in the first audit. We fixed every one and then built a standing programme to make sure the same gaps would not reopen.',
    deliverables: [
      'Full security audit and prioritised remediation roadmap',
      'Firewall replacement and endpoint protection rollout',
      'Email security filtering and anti-phishing deployment',
      'Ongoing SOC-lite monitoring with monthly reporting',
    ],
    metrics: [
      { value: '14', label: 'critical vulnerabilities remediated' },
      { value: '0', label: 'breaches in 18 months since' },
      { value: '100%', label: 'email threat interception' },
    ],
    tags: ['Security Audit', 'Firewall', 'Endpoint', 'Email Security'],
    featured: false,
    image: '/images/projects/rashidi-group.jpg',
    visual: 'cyber',
  },
  {
    slug: 'emirates-solutions-group',
    client: 'Emirates Solutions Group',
    industry: 'Financial Services',
    category: 'UI/UX Design',
    year: '2024',
    title: 'Brand Identity Rebuild and Web UI Redesign',
    story: 'Eight years of patched-together assets with no coherent system. Nothing matched across print, web and presentations. We went back to the beginning and built it out properly.',
    deliverables: [
      'New brand identity system and logo',
      'Web and mobile UI/UX design',
      'Design system and component library for the dev team',
      'Marketing collateral and presentation templates',
    ],
    metrics: [
      { value: '67%', label: 'increase in time on site' },
      { value: '4.8/5', label: 'user satisfaction post-launch' },
      { value: '3 weeks', label: 'design to dev handoff' },
    ],
    tags: ['Branding', 'UI Design', 'UX', 'Design System'],
    featured: false,
    image: '/images/projects/emirates-solutions.jpg',
    visual: 'design',
  },
  {
    slug: 'matla-al-anwar',
    client: 'Matla Al Anwar',
    industry: 'Cleaning Services',
    category: 'Web & Apps',
    year: '2024',
    title: 'A Professional Web Presence for a Growing Cleaning Business',
    story: 'Matla Al Anwar needed a website that reflected the quality of their cleaning services and made it easy for residential and commercial clients in Dubai to get in touch. We designed and built a clean, mobile-first site with clear service pages and direct contact options.',
    deliverables: [
      'Website design and development',
      'Service pages for residential and commercial cleaning',
      'WhatsApp click-to-chat and click-to-call integration',
      'Mobile-responsive layout for on-the-go enquiries',
    ],
    metrics: [],
    tags: ['Web Development', 'Cleaning Services'],
    featured: false,
    image: '/images/projects/matla-al-anwar.jpg',
    visual: 'web',
  },
]

export const CATEGORIES = [
  'All',
  'IT Support',
  'Cyber Security',
  'Cloud Services',
  'Web & Apps',
  'Digital Marketing',
  'System Integration',
  'UI/UX Design',
]
