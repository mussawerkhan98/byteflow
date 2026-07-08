export type ServiceData = {
  slug: string
  title: string
  tagline: string
  description: string
  heroStats: { value: string; label: string }[]
  features: { title: string; desc: string }[]
  benefits: { title: string; desc: string }[]
  process: { step: string; title: string; desc: string }[]
  faqs: { q: string; a: string }[]
  relatedSlugs: string[]
}

export const services: ServiceData[] = [
  {
    slug: 'it-amc-services-dubai',
    title: 'IT AMC',
    tagline: 'Predictable IT costs. Zero surprises.',
    description:
      'A fully managed Annual Maintenance Contract that covers every device, server and network in your office. One fixed monthly fee replaces unpredictable repair bills and slow response times across Dubai, Sharjah and Abu Dhabi.',
    heroStats: [
      { value: '2 hrs', label: 'On-site response guarantee' },
      { value: '500+', label: 'Businesses on AMC contracts' },
      { value: '24/7', label: 'Remote monitoring' },
      { value: '8+ yrs', label: 'Serving UAE businesses' },
    ],
    features: [
      {
        title: 'Unlimited Remote Support',
        desc: 'Raise a ticket or call us and get remote assistance within 30 minutes. No per-incident fees, no limits on the number of requests per month.',
      },
      {
        title: 'On-site Engineer Visits',
        desc: 'When remote support is not enough, a certified engineer arrives at your office within 2 hours across Dubai, Sharjah and Abu Dhabi.',
      },
      {
        title: 'Server and Network Management',
        desc: 'We configure, patch and monitor your Windows or Linux servers, routers, switches and firewalls to keep everything running at peak performance.',
      },
      {
        title: 'Endpoint Monitoring',
        desc: 'Every laptop, desktop and workstation is monitored 24/7 for hardware issues, software conflicts, disk health and security threats.',
      },
      {
        title: 'Software Updates and Patching',
        desc: 'We handle all OS updates, firmware patches and critical security fixes during off-hours so your team is never disrupted.',
      },
      {
        title: 'IT Asset Inventory',
        desc: 'A live register of every device, licence and warranty expiry date in your office so you always know what you own and when it needs replacing.',
      },
    ],
    benefits: [
      {
        title: 'Predictable monthly cost',
        desc: 'One fixed invoice replaces dozens of unpredictable repair bills. Budget with confidence every month of the year.',
      },
      {
        title: 'Faster issue resolution',
        desc: 'A dedicated engineer already knows your setup, so problems are solved faster than starting from scratch with a new vendor every time.',
      },
      {
        title: 'Proactive maintenance',
        desc: 'We identify failing hardware and software conflicts before they become outages, reducing unplanned downtime to near zero.',
      },
      {
        title: 'Single point of contact',
        desc: 'One account manager, one phone number. No being passed between departments or waiting on hold with multiple vendors.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Free IT Audit',
        desc: 'We visit your office and document every device, server, licence and network component. No obligation, no cost.',
      },
      {
        step: '02',
        title: 'Custom AMC Proposal',
        desc: 'You receive a fixed-price proposal within 24 hours, itemised by service level and number of users. No hidden charges.',
      },
      {
        step: '03',
        title: 'Onboarding and Baseline',
        desc: 'Our engineers install monitoring agents, update all software, configure backups and document your entire IT environment.',
      },
      {
        step: '04',
        title: 'Ongoing Management',
        desc: 'From day one, your systems are monitored 24/7. Tickets are resolved remotely or on-site within the agreed SLA.',
      },
      {
        step: '05',
        title: 'Monthly Reporting',
        desc: 'Every month you receive a health report covering uptime, issues resolved, devices monitored and upcoming risks.',
      },
    ],
    faqs: [
      {
        q: 'What exactly does an IT AMC cover?',
        a: 'Our AMC covers unlimited remote and on-site support for all devices, servers, network equipment and software in your office. It includes proactive monitoring, patching, antivirus management and a dedicated account engineer. You pay one fixed monthly fee with no additional call-out or per-incident charges.',
      },
      {
        q: 'How quickly do you respond when something breaks?',
        a: 'Remote support is available within 30 minutes of a ticket being raised. For issues that require a physical presence, our engineers arrive on-site within 2 hours across Dubai, Sharjah and Abu Dhabi. For critical server outages, we treat it as a P1 and mobilise immediately.',
      },
      {
        q: 'Do you support businesses with multiple offices?',
        a: 'Yes. We manage multi-site businesses with offices across Dubai, Sharjah, Abu Dhabi and other UAE emirates. We assign a dedicated engineer per site and provide centralised monitoring from our NOC, so issues in any location are spotted and resolved quickly.',
      },
      {
        q: 'Can we add services to the AMC later?',
        a: 'Absolutely. Many clients start with basic IT support and later add cloud management, cyber security monitoring or Microsoft 365 administration. Your AMC can be expanded at any time without signing a new long-term contract.',
      },
      {
        q: 'What is the minimum contract length?',
        a: 'We offer monthly rolling plans as well as annual contracts. Annual plans come with better pricing and priority SLA guarantees. Most clients choose annual contracts because the savings are significant, but we never force you into a long-term commitment.',
      },
    ],
    relatedSlugs: ['cyber-security', 'cloud-services-dubai', 'data-backup-recovery'],
  },

  {
    slug: 'cyber-security',
    title: 'Cyber Security',
    tagline: 'Enterprise-grade protection built for UAE businesses.',
    description:
      'Layered cyber security covering firewalls, endpoint protection, email security and real-time network monitoring. We protect Dubai businesses from ransomware, phishing, data breaches and insider threats with solutions that scale from 5 to 500 users.',
    heroStats: [
      { value: '99.9%', label: 'Threat detection rate' },
      { value: '0', label: 'Ransomware payouts by clients' },
      { value: '24/7', label: 'Security monitoring' },
      { value: '30 min', label: 'Incident response time' },
    ],
    features: [
      {
        title: 'Next-Gen Firewall',
        desc: 'Enterprise firewall configured with intrusion prevention, application control and geo-blocking to stop attacks at the perimeter before they reach your network.',
      },
      {
        title: 'Endpoint Detection and Response',
        desc: 'AI-powered EDR on every device that detects and isolates threats in real time, not just after a signature update. Covers Windows, macOS and mobile devices.',
      },
      {
        title: 'Email Security and Anti-Phishing',
        desc: 'Multi-layer email filtering that catches phishing, business email compromise, malware attachments and spoofed senders before they reach your inbox.',
      },
      {
        title: 'Network Security Monitoring',
        desc: '24/7 monitoring of all network traffic for anomalies, lateral movement and data exfiltration attempts. Alerts reach our team in seconds.',
      },
      {
        title: 'Security Awareness Training',
        desc: 'Simulated phishing campaigns and staff training modules that reduce human error, the cause of over 80% of successful breaches in UAE businesses.',
      },
      {
        title: 'Vulnerability Assessments',
        desc: 'Scheduled scans of your network, servers and web-facing assets to identify and remediate vulnerabilities before attackers can exploit them.',
      },
    ],
    benefits: [
      {
        title: 'Stops ransomware before encryption',
        desc: 'Our EDR and backup combination means ransomware is detected and quarantined in seconds. Even if it executes, clean data is restored within hours.',
      },
      {
        title: 'Meets UAE compliance requirements',
        desc: 'Our security stack aligns with UAE NESA, ADHICS and sector-specific data protection requirements, reducing your regulatory exposure.',
      },
      {
        title: 'No impact on productivity',
        desc: 'Policies are tuned for Dubai business environments so legitimate tools and workflows are never blocked. Security without the frustration.',
      },
      {
        title: 'Clear incident reports',
        desc: 'When a threat is detected, you get a plain-language summary of what happened, what was blocked and what action was taken. No jargon.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Security Assessment',
        desc: 'We audit your current posture, identify gaps and map your exposure across network, email, endpoints and user behaviour.',
      },
      {
        step: '02',
        title: 'Protection Deployment',
        desc: 'Firewall, EDR, email security and monitoring tools are deployed with zero downtime during off-peak hours.',
      },
      {
        step: '03',
        title: 'Policy Configuration',
        desc: 'Rules are tuned to your business context so security is tight without blocking legitimate work for your team.',
      },
      {
        step: '04',
        title: 'Staff Training',
        desc: 'Your team completes a phishing simulation and security awareness module to close the human vulnerability gap.',
      },
      {
        step: '05',
        title: 'Ongoing Monitoring',
        desc: '24/7 threat monitoring with monthly security reports and quarterly vulnerability reassessments.',
      },
    ],
    faqs: [
      {
        q: 'What is the most common cyber threat facing Dubai businesses?',
        a: 'Phishing and business email compromise are the leading threats for UAE businesses. Attackers impersonate suppliers, partners or senior management to trick staff into transferring money or sharing credentials. Our email security and staff training programme cuts successful phishing rates by over 90% within 3 months.',
      },
      {
        q: 'What happens if one of our computers gets infected with ransomware?',
        a: 'Our EDR isolates the infected device within seconds, stopping lateral spread. Our backup system then restores your data from a clean recovery point, typically within 2-4 hours. None of our clients under active protection have paid a ransom.',
      },
      {
        q: 'Do I need a dedicated IT security team to use your service?',
        a: 'No. We act as your outsourced security team. Our analysts monitor your environment, respond to alerts and handle incidents. You get enterprise-level protection without the cost of hiring full-time security staff.',
      },
      {
        q: 'How do you handle a confirmed security incident?',
        a: 'We follow an established incident response plan: contain the threat, preserve evidence, eradicate the cause, restore normal operations and provide a full post-incident report. For serious breaches, our team is on-site within 2 hours.',
      },
      {
        q: 'Can you help us comply with UAE data protection regulations?',
        a: 'Yes. We align your security controls with UAE Federal Decree-Law No. 45 on Personal Data Protection, NESA guidelines and industry-specific requirements for healthcare, finance and government contractors. We produce the documentation your auditors will need.',
      },
    ],
    relatedSlugs: ['it-amc-services-dubai', 'data-backup-recovery', 'cloud-services-dubai'],
  },

  {
    slug: 'system-integration',
    title: 'System Integration',
    tagline: 'Every device, every office, one connected system.',
    description:
      'We connect your computers, servers, printers, IP phones, CCTV, access control, cloud storage and Microsoft 365 into one cohesive infrastructure. From a single-office setup in Business Bay to a multi-site network across the UAE, we design and build it all.',
    heroStats: [
      { value: '500+', label: 'Systems integrated across UAE' },
      { value: '0', label: 'Hours of planned downtime on average' },
      { value: '48 hrs', label: 'Typical installation time' },
      { value: '8+ yrs', label: 'Integration experience' },
    ],
    features: [
      {
        title: 'Network Design and Cabling',
        desc: 'Structured CAT6/CAT6A cabling, patch panels, network racks and Wi-Fi access points designed for your floor plan with full coverage and minimal interference.',
      },
      {
        title: 'Server Setup and Configuration',
        desc: 'Physical and virtual server deployment for file sharing, domain management, CCTV NVR and application hosting with RAID, UPS and redundancy built in.',
      },
      {
        title: 'CCTV and Access Control',
        desc: 'IP camera installation, NVR configuration, door access systems and intercom integration. Remote viewing from any device, anywhere in the world.',
      },
      {
        title: 'VoIP and IP Telephony',
        desc: 'PBX setup with extension mapping, auto-attendant, call recording and Microsoft Teams Phone integration so all communication flows through one system.',
      },
      {
        title: 'Cloud and On-Premise Hybrid Setup',
        desc: 'We connect your on-premise servers with Azure, Microsoft 365, Google Workspace or any cloud platform to give staff seamless access from office or home.',
      },
      {
        title: 'Multi-Site Network Integration',
        desc: 'Site-to-site VPN, SD-WAN and MPLS solutions that securely connect multiple offices in Dubai, other emirates or internationally with low-latency links.',
      },
    ],
    benefits: [
      {
        title: 'One unified infrastructure',
        desc: 'All devices, systems and applications work together seamlessly, eliminating the compatibility issues that slow down growing businesses.',
      },
      {
        title: 'Faster onboarding of new staff',
        desc: 'A properly integrated system means new employees are set up with accounts, devices and access on their first day rather than their first week.',
      },
      {
        title: 'Lower long-term IT costs',
        desc: 'Well-integrated infrastructure reduces support calls, duplicate systems and the hidden costs of siloed technology that does not communicate.',
      },
      {
        title: 'Scales as you grow',
        desc: 'Systems are designed with headroom so adding new users, sites or services means plugging in, not rebuilding from scratch.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Site Survey',
        desc: 'We visit your office, map the physical layout, existing cabling, power points and identify any constraints before designing the solution.',
      },
      {
        step: '02',
        title: 'Network and System Design',
        desc: 'A detailed diagram and bill of materials is produced covering every device, cable run, rack position and configuration requirement.',
      },
      {
        step: '03',
        title: 'Procurement and Installation',
        desc: 'We source hardware at competitive prices, deliver and install everything in a planned window that minimises disruption to your business.',
      },
      {
        step: '04',
        title: 'Configuration and Testing',
        desc: 'Every device is configured, tested end-to-end and documented. We verify connectivity, speed, security policies and failover behaviour.',
      },
      {
        step: '05',
        title: 'Handover and Training',
        desc: 'Your team is walked through the new setup, given documentation and trained on any new tools. We remain on-call for 30 days post-installation.',
      },
    ],
    faqs: [
      {
        q: 'How long does a typical office network installation take?',
        a: 'A standard 20-50 user office takes 1-3 days depending on cabling complexity. We always work during off-hours or weekends when possible to avoid disrupting your operations. Larger or multi-site projects are phased so you are never fully offline at any point.',
      },
      {
        q: 'Can you work in a building that already has an existing network?',
        a: 'Yes. We assess existing cabling and equipment and either integrate it into the new design or replace what is below standard. We never recommend replacing equipment that is still fit for purpose just to sell hardware.',
      },
      {
        q: 'Do you work with specific brands or can we choose our own hardware?',
        a: 'We work with Cisco, Ubiquiti, HPE Aruba, Fortinet, Hikvision and other proven brands. If you have a preference or existing hardware you want to keep, we will design around it. We do not push specific vendors unless they are the right fit for your needs.',
      },
      {
        q: 'Can you connect our Dubai office with our branch in another emirate?',
        a: 'Yes. We design and deploy site-to-site VPN and SD-WAN solutions that connect offices securely across the UAE. Staff in all locations access the same file servers, printers and applications as if they were on the same local network.',
      },
      {
        q: 'Do you provide support after the installation is complete?',
        a: 'Yes. We offer post-installation support under an IT AMC contract, which covers the infrastructure we built plus all other IT in your office. Alternatively, we can provide a time-and-materials support arrangement for ad hoc issues.',
      },
    ],
    relatedSlugs: ['it-amc-services-dubai', 'cyber-security', 'cloud-services-dubai'],
  },

  {
    slug: 'data-backup-recovery',
    title: 'Data Backup and Recovery',
    tagline: 'Your data survives ransomware, hardware failure and human error.',
    description:
      'Automated multi-destination backups running every hour, with fast recovery that restores individual files or entire servers within hours. Purpose-built for UAE businesses that cannot afford extended downtime or data loss.',
    heroStats: [
      { value: '1 hr', label: 'Backup frequency' },
      { value: '4 hrs', label: 'Maximum recovery time' },
      { value: '99.99%', label: 'Backup success rate' },
      { value: '0', label: 'Data loss incidents for protected clients' },
    ],
    features: [
      {
        title: 'Hourly Automated Backups',
        desc: 'Backups run every hour in the background with no performance impact. Onsite, offsite and cloud copies are maintained simultaneously for maximum resilience.',
      },
      {
        title: 'Cloud Backup to UAE Data Centres',
        desc: 'Data is replicated to enterprise cloud storage hosted in UAE data centres, meeting local data residency requirements for regulated industries.',
      },
      {
        title: 'Bare-Metal Server Recovery',
        desc: 'In the event of a total server failure, we restore the entire system including OS, applications and data to new hardware or a virtual machine within hours.',
      },
      {
        title: 'Microsoft 365 Backup',
        desc: 'Microsoft does not backup your emails, Teams data or SharePoint files. We do. Point-in-time recovery for every mailbox and every document.',
      },
      {
        title: 'Ransomware-Proof Storage',
        desc: 'Backup copies are stored with immutability settings that prevent ransomware from encrypting or deleting recovery points even if your network is compromised.',
      },
      {
        title: 'Backup Monitoring and Alerts',
        desc: 'Every backup job is monitored. Failed or missed backups trigger immediate alerts to our team so problems are fixed before you even know they happened.',
      },
    ],
    benefits: [
      {
        title: 'Recover from ransomware without paying',
        desc: 'Immutable backups mean you restore clean data and refuse the ransom. Our clients have recovered from full ransomware attacks without paying a single dirham.',
      },
      {
        title: 'Protects against accidental deletion',
        desc: 'Hourly snapshots mean an accidentally deleted folder or overwritten file can be restored in minutes. No drama, no data loss.',
      },
      {
        title: 'Minimal downtime after hardware failure',
        desc: 'Server failures are recovered to new hardware or the cloud in hours, not days. Your team gets back to work before the replacement parts even arrive.',
      },
      {
        title: 'Auditable compliance records',
        desc: 'Detailed backup logs and recovery test reports provide the documentation auditors require for ISO 27001, ADHICS and UAE data protection compliance.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Data Discovery',
        desc: 'We map all critical data: servers, databases, Microsoft 365, shared drives and any custom applications that hold business-critical information.',
      },
      {
        step: '02',
        title: 'Backup Architecture Design',
        desc: 'A backup plan is designed following the 3-2-1 rule: 3 copies, 2 different media types, 1 offsite. Recovery time objectives are agreed upfront.',
      },
      {
        step: '03',
        title: 'Deployment and Initial Seeding',
        desc: 'Backup agents are deployed, initial full backups are completed and the first cloud replication is verified. Typically done overnight.',
      },
      {
        step: '04',
        title: 'Recovery Testing',
        desc: 'We perform a full test recovery before handing over. Files, folders and full servers are restored to verify the process works exactly as designed.',
      },
      {
        step: '05',
        title: 'Monitoring and Reporting',
        desc: 'Daily automated checks with monthly reports confirming backup health, storage usage, recovery readiness and any anomalies detected.',
      },
    ],
    faqs: [
      {
        q: 'Is Microsoft 365 backup included in the service?',
        a: 'Yes. Microsoft 365 backup is a separate module we strongly recommend to all clients. Microsoft provides service availability but does not backup your data against accidental deletion, ransomware or departing employee data loss. We back up all mailboxes, Teams, SharePoint and OneDrive with point-in-time recovery.',
      },
      {
        q: 'How quickly can you restore data after a ransomware attack?',
        a: 'Recovery time depends on data volume, but most clients are fully operational within 2-4 hours of initiating a recovery. For individual files and folders, restoration takes minutes. Our immutable backups mean recovery points cannot be encrypted by ransomware, so you always have a clean copy to restore from.',
      },
      {
        q: 'Where is the backup data stored? Is it kept in the UAE?',
        a: 'By default, cloud backups are stored in UAE-based data centres to meet local data residency requirements. For clients with specific compliance needs, we can also replicate to a secondary region. All data is encrypted at rest and in transit using AES-256.',
      },
      {
        q: 'How do you verify that backups are actually working?',
        a: 'Every backup job is monitored for completion and success. We perform scheduled test restores quarterly, or more frequently for critical systems, and provide you with the test report. You never have to take our word for it.',
      },
      {
        q: 'Can you recover data from a server that has physically failed?',
        a: 'Yes. Bare-metal recovery allows us to restore an entire server, including its operating system and applications, to new hardware or a virtual machine. Most clients are back up within 4 hours of hardware failure, which is far faster than waiting for a replacement server to be shipped and configured from scratch.',
      },
    ],
    relatedSlugs: ['cyber-security', 'it-amc-services-dubai', 'cloud-services-dubai'],
  },

  {
    slug: 'website-development',
    title: 'Websites, Apps and Bots',
    tagline: 'Digital products built to perform in the UAE market.',
    description:
      'Professional websites, e-commerce stores, mobile applications and AI-powered chatbots built by our in-house development team. From a sharp corporate site on WordPress to a fully custom web application, we design and build everything with Dubai business goals in mind.',
    heroStats: [
      { value: '150+', label: 'Websites and apps launched' },
      { value: '3 wks', label: 'Average website delivery time' },
      { value: '98%', label: 'Client satisfaction score' },
      { value: '100%', label: 'Mobile responsive' },
    ],
    features: [
      {
        title: 'Corporate and Business Websites',
        desc: 'Clean, fast and fully responsive websites built on WordPress or custom frameworks. SEO-optimised from day one with a content management system your team can update without technical knowledge.',
      },
      {
        title: 'E-commerce Development',
        desc: 'WooCommerce and custom e-commerce stores with UAE payment gateway integration (Network International, PayTabs, Stripe), Arabic language support and VAT-compliant invoicing.',
      },
      {
        title: 'Custom Web Applications',
        desc: 'Bespoke internal tools, customer portals and SaaS products built with modern frameworks. We design the database, backend logic and frontend interface end-to-end.',
      },
      {
        title: 'Mobile App Development',
        desc: 'iOS and Android apps built with React Native for consistent performance across both platforms. From concept and wireframes through to App Store submission.',
      },
      {
        title: 'AI Chatbots and Automation',
        desc: 'WhatsApp bots, website live chat agents and internal workflow automation powered by GPT-4 and Claude. Qualify leads, answer FAQs and route enquiries automatically.',
      },
      {
        title: 'Landing Pages and Campaigns',
        desc: 'High-converting landing pages for Google Ads and social media campaigns with A/B testing, heatmaps and conversion tracking built in from launch.',
      },
    ],
    benefits: [
      {
        title: 'Owned by you, fully',
        desc: 'All source code, domain and hosting accounts are in your name. You are never locked into a proprietary platform you cannot migrate away from.',
      },
      {
        title: 'Optimised for UAE search',
        desc: 'On-page SEO, fast local hosting, Arabic language support and Google Business Profile integration give you the best possible visibility in UAE search results.',
      },
      {
        title: 'Integrated with your tools',
        desc: 'CRM integration, email marketing, accounting software and social media API connections mean your website is part of your workflow, not isolated from it.',
      },
      {
        title: 'Built for performance',
        desc: 'Core Web Vitals optimised, CDN-hosted assets and clean code ensure your site loads fast across the UAE regardless of the visitor\'s connection.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Discovery and Brief',
        desc: 'We learn your business goals, target audience, competitors and the specific functionality you need. This defines the project scope and avoids surprises later.',
      },
      {
        step: '02',
        title: 'Design and Wireframes',
        desc: 'High-fidelity mockups of every page are presented for your approval before a single line of code is written. You see exactly what you will get.',
      },
      {
        step: '03',
        title: 'Development',
        desc: 'Your designer\'s vision is built by our developers with clean, maintainable code. Progress is visible on a staging link throughout.',
      },
      {
        step: '04',
        title: 'Testing and QA',
        desc: 'Cross-browser, cross-device and performance testing. All forms, payment flows and integrations are verified before going live.',
      },
      {
        step: '05',
        title: 'Launch and Handover',
        desc: 'We deploy to your hosting, set up analytics, submit to Google Search Console and train your team on managing content.',
      },
    ],
    faqs: [
      {
        q: 'How long does it take to build a website?',
        a: 'A standard corporate website with up to 10 pages takes 2-4 weeks from signed brief to launch. E-commerce and custom web applications are scoped individually and typically take 6-12 weeks. We provide a firm timeline at the start of every project.',
      },
      {
        q: 'Can you build Arabic language websites?',
        a: 'Yes. We build fully bilingual English and Arabic websites with proper RTL layout, Arabic typography and separate content management for each language. This is standard for businesses targeting both the expatriate and local UAE markets.',
      },
      {
        q: 'Do you work with UAE payment gateways?',
        a: 'Yes. We integrate Network International, PayTabs, Checkout.com, Stripe and other payment gateways used by UAE businesses. We also handle the technical side of connecting with your bank\'s merchant services for direct debit payments.',
      },
      {
        q: 'Who handles hosting and the domain after the site is launched?',
        a: 'We can manage hosting and the domain on your behalf as part of a maintenance plan, or hand everything over to you. All accounts and credentials are always in your name. We recommend UAE or GCC-based hosting for faster load times for your target audience.',
      },
      {
        q: 'What is a WhatsApp bot and how does it help my business?',
        a: 'A WhatsApp bot connects to your business WhatsApp account and automatically handles incoming messages: answering common questions, collecting lead details, booking appointments or routing enquiries to the right team member. For businesses that receive high volumes of WhatsApp messages, it dramatically reduces the time your staff spend on repetitive conversations.',
      },
    ],
    relatedSlugs: ['digital-marketing', 'graphics-designing', 'cloud-services-dubai'],
  },

  {
    slug: 'cloud-services-dubai',
    title: 'Cloud Services',
    tagline: 'Your business in the cloud, fully managed from day one.',
    description:
      'Microsoft 365 setup and migration, Azure cloud servers, cloud backup and hybrid infrastructure management for Dubai businesses. We handle every aspect of your cloud environment so you can focus on running your business, not managing your IT.',
    heroStats: [
      { value: '200+', label: 'Microsoft 365 migrations completed' },
      { value: '0', label: 'Data loss incidents during migrations' },
      { value: '40%', label: 'Average IT cost reduction after cloud move' },
      { value: '24/7', label: 'Cloud monitoring and support' },
    ],
    features: [
      {
        title: 'Microsoft 365 Setup and Migration',
        desc: 'Full migration of email, files, contacts and calendars to Microsoft 365 with zero data loss. Includes user provisioning, license management and post-migration support.',
      },
      {
        title: 'Azure Cloud Servers',
        desc: 'Virtual machine deployment on Microsoft Azure with right-sized configurations for your workloads. Includes backup, monitoring, patching and cost optimisation.',
      },
      {
        title: 'SharePoint and Teams Configuration',
        desc: 'SharePoint intranets, document libraries, Teams channels and Microsoft 365 groups structured to match your organisation\'s workflow and department hierarchy.',
      },
      {
        title: 'Cloud Backup and Disaster Recovery',
        desc: 'Automated backup to UAE-hosted cloud storage with tested recovery procedures. Covers on-premise servers, Microsoft 365 and any cloud-hosted applications.',
      },
      {
        title: 'Microsoft 365 Licence Management',
        desc: 'We manage all licence assignments, renewals, add-ons and compliance reporting. You always have exactly the right number of licences at the best available price.',
      },
      {
        title: 'Hybrid Cloud Infrastructure',
        desc: 'Seamless connection between on-premise servers and cloud services. Staff access the same tools whether they are in the office, at home or travelling.',
      },
    ],
    benefits: [
      {
        title: 'Work from anywhere in the UAE',
        desc: 'Cloud-hosted files, email and applications are accessible from any device, from any location, with the same security policies applied everywhere.',
      },
      {
        title: 'No more on-premise email servers',
        desc: 'Eliminate the cost, complexity and failure risk of running your own Exchange server. Microsoft 365 delivers 99.9% uptime with enterprise-grade spam filtering.',
      },
      {
        title: 'Instant scalability',
        desc: 'Add or remove users and storage in minutes without ordering hardware. Growing from 10 to 100 users is a configuration change, not an infrastructure project.',
      },
      {
        title: 'Lower total cost of ownership',
        desc: 'Eliminating on-premise servers removes hardware purchase, power, cooling and maintenance costs. Most clients see 30-40% IT cost reductions within 12 months.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Cloud Readiness Assessment',
        desc: 'We review your existing infrastructure, internet connectivity, compliance requirements and workloads to design the right cloud architecture.',
      },
      {
        step: '02',
        title: 'Migration Plan',
        desc: 'A detailed migration plan is produced covering data, email, applications and user cutover schedule. Each phase is tested before go-live.',
      },
      {
        step: '03',
        title: 'Parallel Running',
        desc: 'New cloud systems run alongside existing ones during migration so your business is never fully dependent on an untested setup.',
      },
      {
        step: '04',
        title: 'Cutover and Training',
        desc: 'The final cutover is scheduled for minimum disruption. Staff training is completed before the switch so everyone is ready on day one.',
      },
      {
        step: '05',
        title: 'Ongoing Cloud Management',
        desc: 'Monthly cost reviews, licence optimisation, security policy updates and 24/7 monitoring keep your cloud environment efficient and secure.',
      },
    ],
    faqs: [
      {
        q: 'How long does a Microsoft 365 migration take?',
        a: 'For a small business with up to 25 users, migration typically takes 2-3 days. For larger organisations with 50-200 users, we typically run a phased migration over 1-2 weeks. We schedule the final email cutover overnight or over a weekend to minimise disruption during business hours.',
      },
      {
        q: 'Will we lose any emails during the migration?',
        a: 'No. We use a staged migration approach where both your old and new email systems run simultaneously until the final cutover. All historical emails, folders and attachments are migrated and verified before any legacy system is decommissioned. We have completed over 200 migrations with zero email data loss.',
      },
      {
        q: 'What Microsoft 365 plan do you recommend for a small Dubai business?',
        a: 'For most small businesses, Microsoft 365 Business Standard provides the best value, including desktop Office apps, 1TB OneDrive, Exchange email and Teams. We assess your specific requirements and ensure you are not paying for licences you do not need.',
      },
      {
        q: 'Can you manage our Microsoft 365 on an ongoing basis?',
        a: 'Yes. Ongoing Microsoft 365 management is included in our IT AMC contracts. This covers adding and removing users, password resets, Teams configuration, SharePoint administration, licence reconciliation and compliance monitoring.',
      },
      {
        q: 'Is cloud hosting suitable for businesses in regulated UAE industries?',
        a: 'Yes, with the right configuration. For healthcare (ADHICS), finance and government suppliers, we deploy Microsoft 365 Government Community Cloud or Azure configurations that meet UAE data residency and sector compliance requirements. We produce the compliance documentation your auditors need.',
      },
    ],
    relatedSlugs: ['it-amc-services-dubai', 'data-backup-recovery', 'cyber-security'],
  },

  {
    slug: 'graphics-designing',
    title: 'UI/UX and Graphics Design',
    tagline: 'A brand that looks as serious as the business behind it.',
    description:
      'Logo design, brand identity, UI/UX design, social media graphics, company profiles, brochures and presentation design for Dubai businesses. Fast turnaround, unlimited revisions and a creative team that understands the UAE market.',
    heroStats: [
      { value: '300+', label: 'Brands designed for UAE businesses' },
      { value: '48 hrs', label: 'Logo concept delivery' },
      { value: '100%', label: 'Unlimited revisions until approved' },
      { value: '5 star', label: 'Average client rating' },
    ],
    features: [
      {
        title: 'Logo and Brand Identity',
        desc: 'Primary logo, logo variations, colour palette, typography guide and brand usage rules delivered in all formats for print, digital and signage.',
      },
      {
        title: 'Social Media Design',
        desc: 'Instagram, LinkedIn and Facebook post templates, story designs and profile assets that maintain brand consistency across every platform your business uses.',
      },
      {
        title: 'Company Profile and Brochure Design',
        desc: 'Professionally designed company profiles, product brochures, capability statements and catalogues in both Arabic and English for Dubai and UAE audiences.',
      },
      {
        title: 'UI/UX Design',
        desc: 'User interface design for websites, mobile apps and web applications. Wireframes, interactive prototypes and design systems that development teams can build from directly.',
      },
      {
        title: 'Presentation and Pitch Deck Design',
        desc: 'PowerPoint and Google Slides presentations designed to impress in UAE boardrooms. Data visualisation, infographics and consistent slide templates for your team.',
      },
      {
        title: 'Signage and Print Design',
        desc: 'Office signage, exhibition banners, vehicle wraps, business cards and packaging design with print-ready files supplied to UAE printing standards.',
      },
    ],
    benefits: [
      {
        title: 'Designed for UAE cultural context',
        desc: 'Our team understands Arabic typography, UAE colour preferences and local business presentation standards. Your brand works for both expat and local audiences.',
      },
      {
        title: 'Consistent across every touchpoint',
        desc: 'From your website to your business card, every asset follows the same brand rules so your business looks credible and professional everywhere.',
      },
      {
        title: 'Files you actually own',
        desc: 'All source files in AI, PSD, Figma and print-ready PDF formats are handed over. You own every asset and can use any printer or agency in the future.',
      },
      {
        title: 'Fast turnaround for busy teams',
        desc: 'Logo concepts in 48 hours, social media designs in 24 hours. We work to your schedule, not the other way around.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Creative Brief',
        desc: 'We learn your industry, target audience, competitors, brand values and any visual preferences. The more specific you are, the better the first concepts.',
      },
      {
        step: '02',
        title: 'Concept Design',
        desc: 'Three distinct design directions are presented with rationale. You pick a direction, provide feedback and we refine from there.',
      },
      {
        step: '03',
        title: 'Refinement',
        desc: 'Unlimited revisions until you are completely satisfied. We iterate on colours, typography and layouts until every element is exactly right.',
      },
      {
        step: '04',
        title: 'Final Files',
        desc: 'Approved designs are exported in every format you need: web, print, social media, dark and light variants, with and without tagline.',
      },
      {
        step: '05',
        title: 'Brand Guidelines',
        desc: 'A brand usage guide is produced covering colours (CMYK, RGB, HEX), typography rules, spacing, do\'s and don\'ts for your in-house team.',
      },
    ],
    faqs: [
      {
        q: 'How many logo concepts will I receive?',
        a: 'We present three distinct logo concepts after the initial brief. Each concept explores a different creative direction. You choose the one that resonates, and we refine it with unlimited revisions until it is exactly right. Most clients are satisfied by the second round of revisions.',
      },
      {
        q: 'What file formats will I receive for my logo?',
        a: 'You receive the master file in Adobe Illustrator (AI) format plus exports in EPS, PDF (print-ready), PNG (transparent background, multiple sizes) and SVG for web use. If you need additional formats for specific applications, we provide them at no extra cost.',
      },
      {
        q: 'Can you design in both English and Arabic?',
        a: 'Yes. We design bilingual logos and brand assets with proper Arabic typography and RTL layout. Many Dubai businesses require dual-language branding for signage, company profiles and marketing materials, and our team handles both languages natively.',
      },
      {
        q: 'Do you provide social media templates my team can edit themselves?',
        a: 'Yes. Social media templates are delivered as editable Canva, Adobe Express or PowerPoint files so your marketing team can create new content on brand without needing a designer for every post.',
      },
      {
        q: 'Can you redesign an existing logo while keeping some elements?',
        a: 'Absolutely. Brand refresh projects where we modernise an existing identity while retaining elements of recognition are some of our most common briefs. We present evolved options that respect the equity in your current brand while improving its execution.',
      },
    ],
    relatedSlugs: ['website-development', 'digital-marketing', 'it-amc-services-dubai'],
  },

  {
    slug: 'digital-marketing',
    title: 'Digital Marketing',
    tagline: 'More leads from Dubai. Measurable results every month.',
    description:
      'SEO, Google Ads, social media advertising, content marketing and email campaigns built around UAE search behaviour and buying patterns. Every campaign is tracked to actual leads and revenue, not just impressions and clicks.',
    heroStats: [
      { value: '3x', label: 'Average lead increase in 90 days' },
      { value: '120+', label: 'Active campaigns managed across UAE' },
      { value: '40%', label: 'Average reduction in cost per lead' },
      { value: 'Top 3', label: 'Google rankings for 80% of client keywords' },
    ],
    features: [
      {
        title: 'Search Engine Optimisation',
        desc: 'Technical SEO, on-page optimisation, local SEO for Dubai and UAE searches, content strategy and link building. Rankings that bring qualified traffic month after month.',
      },
      {
        title: 'Google Ads Management',
        desc: 'Search, display and Performance Max campaigns with continuous keyword refinement, negative keyword management and conversion tracking tied to real business outcomes.',
      },
      {
        title: 'Social Media Advertising',
        desc: 'Meta (Facebook and Instagram), LinkedIn and TikTok ads targeted to UAE demographics, industries and decision-makers. Full creative production and campaign management.',
      },
      {
        title: 'Social Media Management',
        desc: 'Regular content creation, posting schedules, community management and monthly analytics reports for Instagram, LinkedIn and Facebook. Consistent brand presence without the overhead.',
      },
      {
        title: 'Content Marketing',
        desc: 'Blog articles, case studies, whitepapers and video scripts written for UAE audiences and optimised for target keywords. Authority content that ranks and converts.',
      },
      {
        title: 'Email Marketing and Automation',
        desc: 'Lead nurture sequences, promotional campaigns and automated workflows built on Mailchimp, HubSpot or ActiveCampaign. Measure open rates, clicks and conversions.',
      },
    ],
    benefits: [
      {
        title: 'UAE-specific market knowledge',
        desc: 'We know that Dubai buyers search differently, compare on WhatsApp and expect Arabic-language touchpoints. Our campaigns are built for this reality, not copied from generic Western playbooks.',
      },
      {
        title: 'Full transparency on spend',
        desc: 'You see exactly where every dirham of your ad budget goes. Monthly reports break down spend, leads generated, cost per lead and return on ad spend in plain language.',
      },
      {
        title: 'No long-term lock-in',
        desc: 'We earn your business every month. Campaigns are fully portable and all accounts, creatives and data remain yours if you ever decide to move.',
      },
      {
        title: 'Integrated with your sales team',
        desc: 'We connect campaign results to your CRM and sales pipeline so you see which campaigns are generating closed deals, not just enquiries.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Audit and Strategy',
        desc: 'We audit your existing digital presence, analyse competitors and identify the highest-value channels and keywords for your specific business in the UAE.',
      },
      {
        step: '02',
        title: 'Campaign Setup',
        desc: 'Ad accounts, tracking pixels, conversion goals and analytics are configured correctly from the start. Foundations that make every future decision data-driven.',
      },
      {
        step: '03',
        title: 'Content and Creative Production',
        desc: 'Ad copy, landing pages, social media content and any creative assets are produced in-house and submitted for your approval before going live.',
      },
      {
        step: '04',
        title: 'Launch and Optimisation',
        desc: 'Campaigns go live. In the first 30 days we monitor closely, cut underperforming ad sets and scale what is working based on actual conversion data.',
      },
      {
        step: '05',
        title: 'Monthly Review',
        desc: 'A clear monthly report covers every metric that matters, with recommendations for the next month. You always know what is working and why.',
      },
    ],
    faqs: [
      {
        q: 'How quickly will I see results from SEO?',
        a: 'SEO results in Dubai typically become visible within 3-6 months for competitive keywords. For less competitive local terms, we often see page-one rankings within 6-8 weeks. We are transparent about realistic timelines from day one and show you ranking progress monthly so you can see the trajectory even before traffic significantly increases.',
      },
      {
        q: 'What budget do I need for Google Ads in Dubai?',
        a: 'Minimum effective budgets in Dubai vary by industry. For most B2B services, AED 3,000-5,000 per month in ad spend gives enough data to optimise effectively. Highly competitive industries such as legal, real estate and finance typically require AED 10,000+ per month. We advise the right budget for your goals before you commit.',
      },
      {
        q: 'Do you run Arabic language campaigns?',
        a: 'Yes. We create and manage Arabic ad copy, Arabic landing pages and Arabic social media content for businesses targeting UAE nationals and Arabic-speaking expatriates. Arabic search campaigns often have lower competition and cost per click than their English equivalents for many industries.',
      },
      {
        q: 'Can you manage both the website and the marketing?',
        a: 'Yes, and this is where we deliver the most value. When the same team manages your website and marketing, landing pages are optimised for conversion, tracking is properly implemented and there is no blame-shifting between a web agency and a marketing agency when results are not where you want them.',
      },
      {
        q: 'How do you report on campaign performance?',
        a: 'Monthly reports include all key metrics: impressions, clicks, conversions, cost per lead, return on ad spend and keyword rankings. We connect Google Analytics, Google Search Console and your ad platforms into a single dashboard so you can check performance at any time, not just when we send a report.',
      },
    ],
    relatedSlugs: ['website-development', 'graphics-designing', 'it-amc-services-dubai'],
  },

  {
    slug: 'landing-page-designing',
    title: 'Landing Page Designing',
    tagline: 'A page built to convert, not just to look good.',
    description:
      'High-converting landing pages for Google Ads, social media campaigns and product launches. Fast load times, mobile-first design and clear calls to action built around what Dubai audiences actually respond to.',
    heroStats: [
      { value: '48 hrs', label: 'Typical design turnaround' },
      { value: '2 wks', label: 'Design to live page' },
      { value: '100%', label: 'Mobile responsive' },
      { value: '100%', label: 'Unlimited revisions until approved' },
    ],
    features: [
      {
        title: 'Conversion-Focused Design',
        desc: 'Every section is structured around a single goal: getting the visitor to call, message or fill in your form. No distracting navigation or competing calls to action.',
      },
      {
        title: 'Campaign-Specific Pages',
        desc: 'A dedicated page for each Google Ads or social campaign so your message matches exactly what the visitor clicked on, improving quality score and conversion rate.',
      },
      {
        title: 'Mobile-First Build',
        desc: 'Designed for the phone screen first, since most UAE ad traffic arrives on mobile. Buttons, forms and click-to-call links are sized and placed for thumbs, not mice.',
      },
      {
        title: 'Fast Load Times',
        desc: 'Optimised images and lean code so the page loads in under two seconds. Every extra second of load time costs you conversions on paid traffic.',
      },
      {
        title: 'Lead Capture and Tracking',
        desc: 'Forms, WhatsApp click-to-chat buttons and click-to-call links wired up with conversion tracking so you know exactly which ads and keywords are producing leads.',
      },
      {
        title: 'A/B Testing Ready',
        desc: 'Pages are structured to support headline, layout and offer variants so you can test what actually improves conversion rate instead of guessing.',
      },
    ],
    benefits: [
      {
        title: 'Higher return on ad spend',
        desc: 'A page built for one goal converts far better than sending paid traffic to a general homepage, meaning every dirham of ad spend works harder.',
      },
      {
        title: 'Consistent message from ad to page',
        desc: 'The headline and offer visitors see in your ad is exactly what they see on the page, which reduces bounce rate and improves ad platform quality scores.',
      },
      {
        title: 'Launch campaigns faster',
        desc: 'A dedicated landing page can be designed and live within days, so you are never waiting weeks to get a new offer or promotion in front of customers.',
      },
      {
        title: 'Clear data on what works',
        desc: 'Because each campaign has its own page, you get clean data on which offers, headlines and audiences actually convert, not muddied results from a shared page.',
      },
    ],
    process: [
      {
        step: '01',
        title: 'Campaign Brief',
        desc: 'We learn the offer, audience and goal of the campaign so the page is built around a single, clear conversion action.',
      },
      {
        step: '02',
        title: 'Design Concept',
        desc: 'A mobile-first design is presented for your approval, covering headline, layout, imagery and call-to-action placement before development starts.',
      },
      {
        step: '03',
        title: 'Build and Tracking Setup',
        desc: 'The page is built, optimised for speed and wired up with form submissions, click-to-call and conversion tracking for your ad platforms.',
      },
      {
        step: '04',
        title: 'Review and Refinement',
        desc: 'You review the live staging link and request any changes. We refine copy, layout or offer positioning until it is ready to launch.',
      },
      {
        step: '05',
        title: 'Launch and Monitor',
        desc: 'The page goes live and we monitor initial performance, ready to suggest quick adjustments based on real visitor behaviour.',
      },
    ],
    faqs: [
      {
        q: 'How is a landing page different from a normal website page?',
        a: 'A landing page removes navigation, competing links and distractions, focusing the visitor entirely on one action: calling, messaging or submitting a form. It is built specifically to match the offer in a single ad campaign rather than serve as a general information page.',
      },
      {
        q: 'How long does it take to get a landing page live?',
        a: 'Most landing pages are designed and live within one to two weeks, depending on revisions. If you need something faster for a time-sensitive campaign, we can turn around a simpler page in a few days.',
      },
      {
        q: 'Can you connect the page to our Google Ads or Meta Ads account?',
        a: 'Yes. We set up conversion tracking so form submissions, WhatsApp clicks and phone calls from the page are reported back to your ad platform, giving you accurate data on cost per lead and return on ad spend.',
      },
      {
        q: 'Do you write the copy for the page as well?',
        a: 'Yes, copywriting is included. We write headlines and body copy focused on your offer and audience, though you are welcome to provide your own copy or brand guidelines for us to work within.',
      },
      {
        q: 'Can one landing page be used for multiple campaigns?',
        a: 'It can, but we usually recommend a dedicated page per distinct offer or audience segment, since matching the page message exactly to the ad significantly improves conversion rates and quality scores.',
      },
    ],
    relatedSlugs: ['digital-marketing', 'website-development', 'graphics-designing'],
  },
]
