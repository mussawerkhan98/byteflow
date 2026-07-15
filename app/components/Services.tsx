import Link from 'next/link'
import { getServices } from '../lib/db'

// ── Static fallback (shown when DB has no published services) ──────────────
const staticServices = [
  {
    num: '01',
    title: 'System Integration',
    desc: 'Connecting your computers, servers, printers, CCTV, cloud storage and Microsoft 365 into one seamless setup. No downtime, no confusion — just a connected, efficient office.',
    href: '/system-integration',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
]

// ── Shared card shell ──────────────────────────────────────────────────────
function CardShell({
  href,
  num,
  icon,
  title,
  desc,
}: {
  href: string
  num: string
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(44,205,222,0.2),_0_20px_40px_rgba(0,0,0,0.6)]"
      style={{
        background: 'linear-gradient(160deg, rgba(44,205,222,0.07) 0%, rgba(70,163,225,0.03) 30%, var(--bg-surface) 100%)',
        border: '1px solid rgba(44,205,222,0.2)',
      }}
    >
      <div className="h-[2px] w-full flex-shrink-0 transition-all duration-300 group-hover:h-[3px]"
        style={{ background: 'linear-gradient(90deg, #2CCDDE, #46A3E1)' }} />
      <div className="flex flex-col flex-1 p-6 gap-5">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:shadow-[0_0_24px_rgba(44,205,222,0.5)]"
            style={{ background: 'linear-gradient(135deg, rgba(44,205,222,0.15), rgba(70,163,225,0.1))', border: '1px solid rgba(44,205,222,0.3)', color: '#2CCDDE' }}>
            {icon}
          </div>
          <span className="text-4xl font-black tabular-nums select-none leading-none"
            style={{ background: 'linear-gradient(135deg, rgba(44,205,222,0.15), rgba(70,163,225,0.08))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {num}
          </span>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <h3 className="text-base font-bold text-[var(--text-primary)] leading-snug transition-colors duration-300 group-hover:text-[#2CCDDE]">{title}</h3>
          <p className="text-[var(--text-muted)] text-sm leading-relaxed">{desc}</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold pt-4 transition-all duration-300"
          style={{ color: '#2CCDDE', borderTop: '1px solid rgba(44,205,222,0.12)' }}>
          Learn More
          <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

export default async function Services() {
  // Try DB first; fall back to static list if empty
  const dbServices = await getServices()
  const useDb = dbServices.length > 0

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-20 left-10 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(44,205,222,0.07) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(70,163,225,0.07) 0%, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5 uppercase tracking-widest"
              style={{ background: 'rgba(44,205,222,0.07)', border: '1px solid rgba(44,205,222,0.25)', color: '#2CCDDE' }}>
              What We Do
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
              <span className="text-[var(--text-primary)]">Services Built for</span><br />
              <span style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Real Business Growth
              </span>
            </h2>
          </div>
          <p className="text-[var(--text-footer-link)] text-base leading-relaxed max-w-sm lg:text-right">
            End-to-end technology and creative services, all under one roof so you never have to chase multiple vendors again.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {useDb
            ? dbServices.map((s, i) => (
                <CardShell
                  key={s.id}
                  href={`/${s.slug}`}
                  num={String(i + 1).padStart(2, '0')}
                  title={s.title}
                  desc={s.excerpt || s.description}
                  icon={
                    s.icon ? (
                      <span className="text-2xl leading-none">{s.icon}</span>
                    ) : (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    )
                  }
                />
              ))
            : staticServices.map((s) => (
                <CardShell
                  key={s.num}
                  href={s.href}
                  num={s.num}
                  title={s.title}
                  desc={s.desc}
                  icon={s.icon}
                />
              ))}
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-14 pt-10"
          style={{ borderTop: '1px solid var(--overlay-hover)' }}>
          <p className="text-[var(--text-footer-link)] text-sm">
            Not sure which service you need? Our team will guide you.
          </p>
          <Link href="/contact-us"
            className="group inline-flex items-center gap-2.5 px-7 py-3 rounded-full text-black font-bold text-sm transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_36px_rgba(44,205,222,0.5)]"
            style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)' }}>
            Talk to Our Team
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
