/* eslint-disable @next/next/no-img-element */
import { getServices } from '../lib/db'
import { getHomeBlock } from '../lib/home-blocks'
import { services as serviceDetails } from '../lib/services-data'
import ServiceCard from './ServiceCard'
import { ServiceIcon } from './ServiceIcon'

// Each service's own page supplies the one-line tagline on the small cards,
// and the headline numbers and features on the featured and wide ones.
const detailsBySlug = new Map(serviceDetails.map((service) => [service.slug, service]))

// The service that gets the large card. Falls back to the first one listed.
const FEATURED_SLUG = 'it-amc-services-dubai'

/**
 * Bento placement. The featured card takes a 2×2 block, four cards sit beside
 * it, and the rest run in rows of four; on two columns it takes a full row.
 * Whatever is left over in the last row is widened so no row ends in a hole.
 */
function placement(index: number, count: number) {
  if (index === 0) return 'sm:col-span-2 xl:row-span-2'
  const classes: string[] = []
  const lastOnTwoColumns = (count - 1) % 2 === 1 && index === count - 1
  if (lastOnTwoColumns) classes.push('sm:col-span-2')
  const tail = count - 5
  const leftover = tail > 0 ? tail % 4 : 0
  if (leftover && index >= count - leftover) {
    if (leftover === 1) classes.push('xl:col-span-4')
    else if (leftover === 2) classes.push('xl:col-span-2')
    else if (index === count - 1) classes.push('xl:col-span-2')
  }
  if (lastOnTwoColumns && !classes.some((c) => c.startsWith('xl:'))) classes.push('xl:col-span-1')
  return classes.join(' ')
}

// ── Static fallback (shown when DB has no published services) ──────────────
const staticServices = [
  {
    num: '01',
    title: 'System Integration',
    desc: 'Connecting your computers, servers, printers, CCTV, cloud storage and Microsoft 365 into one seamless setup. No downtime, no confusion — just a connected, efficient office.',
    href: '/system-integration',
  },
  {
    num: '02',
    title: 'Cyber Security',
    desc: 'Firewalls, antivirus, email security and network protection for UAE businesses. Fast response, expert team and affordable packages for small and medium businesses.',
    href: '/cyber-security',
  },
  {
    num: '03',
    title: 'IT AMC / IT Support',
    desc: 'Manage your computers, servers, network and IT infrastructure for a fixed monthly fee. No surprise costs — reliable support across Dubai, Sharjah and Abu Dhabi.',
    href: '/it-amc-services-dubai',
  },
  {
    num: '04',
    title: 'Data Backup & Recovery',
    desc: 'Automatic cloud backup with fast recovery when you need it most. We protect your files, emails and systems so a server crash or ransomware attack never shuts you down.',
    href: '/data-backup-recovery',
  },
  {
    num: '05',
    title: 'Website / Apps / Bots',
    desc: 'Professional websites, mobile apps and AI chatbots built with WordPress, custom development and automation tools. From a simple website to a full e-commerce store.',
    href: '/website-development',
  },
  {
    num: '06',
    title: 'Cloud Services',
    desc: 'Microsoft 365 setup, cloud backup and cloud server solutions for Dubai businesses. We migrate your team, manage licenses and ensure your data is always secure.',
    href: '/cloud-services-dubai',
  },
  {
    num: '07',
    title: 'UI/UX & Graphics Design',
    desc: 'Logos, social media graphics, brochures and UI/UX designs for Dubai businesses. From a company logo to a full brand identity — fast turnaround, modern design.',
    href: '/graphics-designing',
  },
  {
    num: '08',
    title: 'Digital Marketing',
    desc: 'SEO, Google Ads, Facebook advertising and content marketing across Dubai and UAE. Data-driven campaigns with local search visibility that drive measurable results.',
    href: '/digital-marketing',
  },
]

function DbServiceIcon({ icon }: { icon: string }) {
  if (!icon)
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
      </svg>
    )
  if (/^(?:data:image\/svg\+xml|https?:\/\/|\/)/i.test(icon))
    return <img className="h-5 w-5 object-contain" src={icon} alt="" />
  return <span className="text-lg leading-none">{icon}</span>
}

export default async function Services() {
  // Try DB first; fall back to static list if empty
  const [dbServices, intro] = await Promise.all([getServices(), getHomeBlock('home_services_intro')])
  const copy = intro.fields
  const listed = dbServices.length
    ? dbServices.map((s) => ({
        key: s.id,
        slug: s.slug,
        title: s.title,
        desc: s.excerpt || s.description,
        icon: <DbServiceIcon icon={s.icon} />,
      }))
    : staticServices.map((s) => ({ key: s.num, slug: s.href.slice(1), title: s.title, desc: s.desc, icon: <ServiceIcon link={s.href} /> }))
  const featuredIndex = Math.max(0, listed.findIndex((s) => s.slug === FEATURED_SLUG))
  const cards = [listed[featuredIndex], ...listed.filter((_, i) => i !== featuredIndex)].filter(Boolean)

  return (
    <section id="services" className="home-services scroll-mt-28 py-20 sm:py-24 lg:py-32">
      {/* Same container as the header, so the section's left and right edges
          sit under the logo and the Contact button. */}
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <p className="mb-6 flex items-center gap-3 text-[13px] font-medium text-[var(--text-body)]">
              <span aria-hidden="true" className="h-px w-10 bg-[#2CCDDE]" />
              {copy.eyebrow}
            </p>
            <h2 className="text-balance text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl lg:text-[3.5rem]">
              {copy.heading}{' '}
              <span className="block text-[var(--ink-soft)]">{copy.heading_soft}</span>
            </h2>
          </div>
          <p className="max-w-md text-[17px] leading-relaxed text-[var(--text-body)] lg:col-span-5 lg:justify-self-end">
            {copy.intro}
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 xl:grid-cols-4">
          {cards.map((card, i) => {
            const details = detailsBySlug.get(card.slug)
            const featured = i === 0
            const place = placement(i, cards.length)
            return (
              <ServiceCard
                key={card.key}
                href={`/${card.slug}`}
                num={String(i + 1).padStart(2, '0')}
                title={card.title}
                summary={featured ? card.desc : details?.tagline || card.desc}
                features={details?.features.slice(0, featured ? 4 : 3).map((f) => f.title) ?? []}
                stats={featured ? (details?.heroStats.slice(0, 3) ?? []) : []}
                icon={card.icon}
                featured={featured}
                wide={/xl:col-span-[24]/.test(place)}
                className={place}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
