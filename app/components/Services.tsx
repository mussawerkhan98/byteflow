/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { getServices } from '../lib/db'
import { services as serviceDetails } from '../lib/services-data'
import { ArrowIcon } from './InlineIcons'
import ServiceCard from './ServiceCard'

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
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Cyber Security',
    desc: 'Firewalls, antivirus, email security and network protection for UAE businesses. Fast response, expert team and affordable packages for small and medium businesses.',
    href: '/cyber-security',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'IT AMC / IT Support',
    desc: 'Manage your computers, servers, network and IT infrastructure for a fixed monthly fee. No surprise costs — reliable support across Dubai, Sharjah and Abu Dhabi.',
    href: '/it-amc-services-dubai',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Data Backup & Recovery',
    desc: 'Automatic cloud backup with fast recovery when you need it most. We protect your files, emails and systems so a server crash or ransomware attack never shuts you down.',
    href: '/data-backup-recovery',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
  },
  {
    num: '05',
    title: 'Website / Apps / Bots',
    desc: 'Professional websites, mobile apps and AI chatbots built with WordPress, custom development and automation tools. From a simple website to a full e-commerce store.',
    href: '/website-development',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  {
    num: '06',
    title: 'Cloud Services',
    desc: 'Microsoft 365 setup, cloud backup and cloud server solutions for Dubai businesses. We migrate your team, manage licenses and ensure your data is always secure.',
    href: '/cloud-services-dubai',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      </svg>
    ),
  },
  {
    num: '07',
    title: 'UI/UX & Graphics Design',
    desc: 'Logos, social media graphics, brochures and UI/UX designs for Dubai businesses. From a company logo to a full brand identity — fast turnaround, modern design.',
    href: '/graphics-designing',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
  {
    num: '08',
    title: 'Digital Marketing',
    desc: 'SEO, Google Ads, Facebook advertising and content marketing across Dubai and UAE. Data-driven campaigns with local search visibility that drive measurable results.',
    href: '/digital-marketing',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
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
  const dbServices = await getServices()
  const listed = dbServices.length
    ? dbServices.map((s) => ({
        key: s.id,
        slug: s.slug,
        title: s.title,
        desc: s.excerpt || s.description,
        icon: <DbServiceIcon icon={s.icon} />,
      }))
    : staticServices.map((s) => ({ key: s.num, slug: s.href.slice(1), title: s.title, desc: s.desc, icon: s.icon }))
  const featuredIndex = Math.max(0, listed.findIndex((s) => s.slug === FEATURED_SLUG))
  const cards = [listed[featuredIndex], ...listed.filter((_, i) => i !== featuredIndex)].filter(Boolean)

  return (
    <section className="home-services py-20 sm:py-24 lg:py-32">
      {/* Same container as the header, so the section's left and right edges
          sit under the logo and the Contact button. */}
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <p className="mb-6 flex items-center gap-3 text-[13px] font-medium text-[var(--text-body)]">
              <span aria-hidden="true" className="h-px w-10 bg-[#2CCDDE]" />
              What we do
            </p>
            <h2 className="text-balance text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl lg:text-[3.5rem]">
              Services built for
              <span className="block text-[var(--ink-soft)]">real business growth.</span>
            </h2>
          </div>
          <p className="max-w-md text-[17px] leading-relaxed text-[var(--text-body)] lg:col-span-5 lg:justify-self-end">
            End-to-end technology and creative services, all under one roof so you never have to chase multiple vendors again.
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

        <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[15px] text-[var(--text-body)]">
            Not sure which service you need?{' '}
            <span className="font-medium text-[var(--text-primary)]">Our team will guide you.</span>
          </p>
          <Link
            href="/contact-us"
            className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#2CCDDE] pl-6 pr-5 text-[15px] font-semibold text-[#04121A] transition-colors duration-200 hover:bg-[#5BDCE9]"
          >
            Talk to our team
            <ArrowIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
