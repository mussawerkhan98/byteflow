import Image from 'next/image'
import Link from 'next/link'
import AboutReviews from '../components/AboutReviews'
import Team from '../components/Team'
import { getPageHero, getSection, getTeam, getTestimonials } from '../lib/cms'

export default async function AboutPage() {
  const [hero, founder, testimonials, team] = await Promise.all([getPageHero('about-us'), getSection('about-us', 'founder'), getTestimonials(), getTeam()])
  const founderStory = String(founder?.story || 'Byteflow was born out of frustration. Too many Dubai businesses were being overcharged, underserved, and left waiting days for a simple fix. We started in 2017 with one goal: build the kind of IT company that actually shows up.\n\nEight years later, we manage IT for over 500 businesses across Dubai, Sharjah and Abu Dhabi. We have grown from a two-person team to a full-service operation covering everything from server rooms to Google Ads campaigns — all under one roof, one monthly fee.\n\nThe philosophy has never changed: respond fast, be honest about pricing, and treat every client like they are your only one.')
  return (
    <main>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-0 px-4 sm:px-6 lg:px-8 overflow-hidden" style={hero?.hero_background_image ? { backgroundImage: `linear-gradient(rgba(4,13,18,.78),rgba(4,13,18,.94)),url(${hero.hero_background_image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
        <div className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 80% 20%, rgba(44,205,222,0.07) 0%, transparent 60%)', filter: 'blur(60px)' }} />

        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="text-[#2CCDDE] text-sm font-semibold uppercase tracking-widest mb-4">{hero?.hero_label || 'Dubai, UAE — Since 2017'}</p>
            {hero?.hero_heading ? <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-bold leading-[1.04] tracking-tight mb-6 text-[var(--text-primary)]">{hero.hero_heading}</h1> : <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-bold leading-[1.04] tracking-tight mb-6">
              <span className="text-[var(--text-primary)]">The team behind </span>
              <span style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                500+ businesses
              </span>
              <br />
              <span className="text-[var(--text-primary)]">running smoothly.</span>
            </h1>}
            <p className="text-[var(--text-muted)] text-lg leading-relaxed">
              {hero?.hero_description || 'We are a Dubai-based IT company that handles everything technology-related for businesses across the UAE — so you never have to call three different vendors again.'}
            </p>
          </div>

          {/* Inline stats bar */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 mb-0 rounded-t-2xl overflow-hidden"
            style={{ border: '1px solid rgba(44,205,222,0.12)', borderBottom: 'none' }}
          >
            {[
              { value: '500+', label: 'Businesses served across the UAE' },
              { value: '8+', label: 'Years operating in Dubai' },
              { value: '2 hrs', label: 'On-site response guarantee' },
              { value: '24/7', label: 'Monitoring and support' },
            ].map((s, i, arr) => (
              <div
                key={s.label}
                className="flex flex-col justify-center py-8 px-7"
                style={{
                  background: 'linear-gradient(160deg, rgba(44,205,222,0.05) 0%, var(--bg-surface) 100%)',
                  borderRight: i < arr.length - 1 ? '1px solid rgba(44,205,222,0.08)' : 'none',
                }}
              >
                <span
                  className="text-3xl font-black mb-1 block"
                  style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  {s.value}
                </span>
                <span className="text-xs text-[var(--text-muted)] leading-snug">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founder ──────────────────────────────────────────── */}
      <section className="relative py-0 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto">

          {/* Full-width card that continues from stats */}
          <div
            className="rounded-b-2xl rounded-t-none overflow-hidden mb-6"
            style={{ border: '1px solid rgba(44,205,222,0.12)', borderTop: 'none', background: 'linear-gradient(160deg, rgba(44,205,222,0.04) 0%, var(--bg-surface) 100%)' }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">

              {/* Photo */}
              <div className="relative h-[480px] lg:h-auto overflow-hidden">
                <Image
                  src={String(founder?.image_url || '/images/owner/owner.png')}
                  alt={String(founder?.image_alt || 'Byteflow Founder')}
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to right, transparent 60%, var(--bg-surface) 100%)' }} />
                <div className="absolute inset-0 lg:hidden"
                  style={{ background: 'linear-gradient(to top, var(--bg-surface) 20%, transparent 70%)' }} />

                {/* Floating tag */}
                <div
                  className="absolute bottom-6 left-6 px-4 py-2 rounded-xl"
                  style={{
                    background: 'rgba(4,13,18,0.85)',
                    border: '1px solid rgba(44,205,222,0.25)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <p className="text-[var(--text-primary)] text-sm font-bold">{String(founder?.role || 'Founder & CEO')}</p>
                  <p className="text-[#2CCDDE] text-xs font-medium">{String(founder?.company || 'Byteflow Information Technology')}</p>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center p-10 lg:p-14">
                <p className="text-[#2CCDDE] text-xs font-bold uppercase tracking-widest mb-4">{String(founder?.eyebrow || 'Meet the founder')}</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] leading-tight mb-6">
                  {String(founder?.heading || 'Started with a laptop and a promise to fix IT in Dubai properly.')}
                </h2>

                <div className="flex flex-col gap-4 text-[var(--text-muted)] text-sm leading-relaxed mb-8">
                  {founder?.story ? founderStory.split(/\n\s*\n/).filter(Boolean).map((paragraph) => <p key={paragraph}>{paragraph}</p>) : <>
                  <p>
                    Byteflow was born out of frustration. Too many Dubai businesses were being overcharged, underserved, and left waiting days for a simple fix. We started in 2017 with one goal: build the kind of IT company that actually shows up.
                  </p>
                  <p>
                    Eight years later, we manage IT for over 500 businesses across Dubai, Sharjah and Abu Dhabi. We have grown from a two-person team to a full-service operation covering everything from server rooms to Google Ads campaigns — all under one roof, one monthly fee.
                  </p>
                  <p>
                    The philosophy has never changed: respond fast, be honest about pricing, and treat every client like they are your only one.
                  </p>
                  </>}
                </div>

                <div
                  className="flex items-center gap-4 pt-6"
                  style={{ borderTop: '1px solid rgba(44,205,222,0.1)' }}
                >
                  <a
                    href={String(founder?.linkedin_url || 'https://ae.linkedin.com/company/byteflow-techcascade')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(44,205,222,0.3)]"
                    style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)', color: '#000' }}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                  <a
                    href={String(founder?.phone_url || 'tel:+971543282042')}
                    className="text-[var(--text-muted)] text-sm hover:text-[#2CCDDE] transition-colors duration-200"
                  >
                    {String(founder?.phone_label || '+971 54 328 2042')}
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── Story timeline ───────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

            {/* Left — heading */}
            <div>
              <p className="text-[#2CCDDE] text-xs font-bold uppercase tracking-widest mb-4">Our story</p>
              <h2 className="text-4xl font-bold text-[var(--text-primary)] leading-snug mb-6">
                Eight years.<br />
                <span style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  One mission.
                </span>
              </h2>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                From a small IT support operation to a full-service technology company — here is how Byteflow grew to become one of Dubai's most trusted IT partners.
              </p>
            </div>

            {/* Right — timeline */}
            <div className="lg:col-span-2 flex flex-col gap-0">
              {[
                {
                  year: '2017',
                  title: 'Byteflow is founded in Dubai',
                  desc: 'Started as a lean IT support team serving small businesses in Deira and Bur Dubai. First 10 clients onboarded within the first month.',
                },
                {
                  year: '2019',
                  title: 'Expanded to cloud and Microsoft 365',
                  desc: 'Became an official Microsoft partner. Started handling full cloud migrations and Microsoft 365 deployments for UAE businesses of all sizes.',
                },
                {
                  year: '2020',
                  title: 'Launched digital marketing and web services',
                  desc: 'Added website development, SEO, and Google Ads to the service portfolio — giving clients a single vendor for both IT and digital growth.',
                },
                {
                  year: '2022',
                  title: 'Crossed 300+ business clients',
                  desc: 'Expanded coverage to Sharjah and Abu Dhabi with dedicated on-site engineers. Introduced the 2-hour response SLA across all AMC plans.',
                },
                {
                  year: '2024',
                  title: '500+ businesses and still growing',
                  desc: 'Now serving over 500 businesses across the UAE with a full team of certified engineers, designers, marketers and cloud specialists.',
                },
              ].map((item, i, arr) => (
                <div key={item.year} className="flex gap-6 group">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center flex-shrink-0" style={{ width: 48 }}>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black z-10 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(44,205,222,0.5)]"
                      style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)', color: '#000' }}
                    >
                      {i + 1}
                    </div>
                    {i < arr.length - 1 && (
                      <div className="w-[1px] flex-1 mt-1"
                        style={{ background: 'linear-gradient(180deg, rgba(44,205,222,0.3), rgba(44,205,222,0.05))', minHeight: 40 }} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-10 flex-1">
                    <p
                      className="text-xs font-bold uppercase tracking-widest mb-1"
                      style={{ color: '#2CCDDE' }}
                    >
                      {item.year}
                    </p>
                    <h3 className="text-[var(--text-primary)] text-base font-bold mb-1.5">{item.title}</h3>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── How we work ──────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(44,205,222,0.12)' }}
          >
            {/* Top bar */}
            <div
              className="px-10 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              style={{ borderBottom: '1px solid rgba(44,205,222,0.1)', background: 'linear-gradient(160deg, rgba(44,205,222,0.06) 0%, var(--bg-surface) 100%)' }}
            >
              <div>
                <p className="text-[#2CCDDE] text-xs font-bold uppercase tracking-widest mb-1">How we work</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">No jargon. No surprises. Just results.</h2>
              </div>
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-black font-bold text-sm flex-shrink-0 transition-all duration-300 hover:shadow-[0_0_28px_rgba(44,205,222,0.4)]"
                style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)' }}
              >
                Get Started
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Principles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x" style={{ borderColor: 'rgba(44,205,222,0.08)' }}>
              {[
                {
                  icon: '01',
                  title: 'We respond in 2 hours — guaranteed',
                  desc: 'Every AMC plan includes a 2-hour on-site or remote response SLA. Not next business day. Not "as soon as possible." Two hours.',
                },
                {
                  icon: '02',
                  title: 'Fixed price, zero hidden fees',
                  desc: 'You get one monthly invoice. No call-out fees, no emergency surcharges, no per-ticket billing. We cover everything in your plan.',
                },
                {
                  icon: '03',
                  title: 'One team handles everything',
                  desc: 'IT support, cloud, security, website, marketing — the same team, the same account manager, one phone number. No handoffs.',
                },
              ].map((p) => (
                <div
                  key={p.icon}
                  className="flex flex-col gap-4 p-8"
                  style={{ background: 'linear-gradient(160deg, rgba(44,205,222,0.03) 0%, var(--bg-surface) 100%)' }}
                >
                  <span
                    className="text-4xl font-black"
                    style={{ background: 'linear-gradient(135deg, rgba(44,205,222,0.2), rgba(70,163,225,0.1))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                  >
                    {p.icon}
                  </span>
                  <h3 className="text-[var(--text-primary)] text-sm font-bold leading-snug">{p.title}</h3>
                  <p className="text-[var(--text-muted)] text-xs leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
            <div>
              <p className="text-[#2CCDDE] text-xs font-bold uppercase tracking-widest mb-3">What we do</p>
              <h2 className="text-4xl font-bold text-[var(--text-primary)] leading-snug">
                Everything your business needs,<br />
                <span style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  under one roof.
                </span>
              </h2>
            </div>
            <Link href="/" className="text-sm font-semibold flex-shrink-0 transition-colors duration-200 hover:text-[var(--text-primary)]" style={{ color: '#2CCDDE' }}>
              See all services →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px"
            style={{ background: 'rgba(44,205,222,0.07)', borderRadius: 16, overflow: 'hidden' }}>
            {[
              { num: '01', title: 'IT AMC / IT Support', desc: 'Fixed monthly support for all your devices, servers and network.', href: '/it-amc-services-dubai' },
              { num: '02', title: 'Cyber Security', desc: 'Firewalls, antivirus, email protection and network monitoring.', href: '/cyber-security' },
              { num: '03', title: 'Cloud & Microsoft 365', desc: 'Full cloud setup, migration and ongoing management.', href: '/cloud-services-dubai' },
              { num: '04', title: 'Data Backup & Recovery', desc: 'Automated backups and fast recovery when disaster strikes.', href: '/data-backup-recovery' },
              { num: '05', title: 'System Integration', desc: 'Connecting all your devices, offices and cloud systems.', href: '/system-integration' },
              { num: '06', title: 'Website & App Development', desc: 'Professional websites, mobile apps and AI chatbots.', href: '/website-development' },
              { num: '07', title: 'Digital Marketing', desc: 'SEO, Google Ads and social media that drives real leads.', href: '/digital-marketing' },
              { num: '08', title: 'UI/UX & Graphic Design', desc: 'Logos, branding, social media graphics and full brand identity.', href: '/graphics-designing' },
            ].map((s) => (
              <Link
                key={s.num}
                href={s.href}
                className="group flex flex-col gap-3 p-7 transition-all duration-300 hover:shadow-[inset_0_0_40px_rgba(44,205,222,0.05)]"
                style={{ background: 'linear-gradient(160deg, rgba(44,205,222,0.04) 0%, var(--bg-surface) 100%)' }}
              >
                <span className="text-xs font-bold" style={{ color: '#2CCDDE' }}>{s.num}</span>
                <h3 className="text-[var(--text-primary)] text-sm font-bold leading-snug group-hover:text-[#2CCDDE] transition-colors duration-200">{s.title}</h3>
                <p className="text-[var(--text-muted)] text-xs leading-relaxed">{s.desc}</p>
                <span className="text-xs font-semibold mt-auto pt-2 transition-colors duration-200" style={{ color: 'var(--text-dim)' }}>
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────────── */}
      <Team members={team} />
      <AboutReviews items={testimonials} />

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div
              className="flex flex-col justify-between p-10 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(44,205,222,0.1) 0%, rgba(70,163,225,0.05) 100%)',
                border: '1px solid rgba(44,205,222,0.25)',
              }}
            >
              <div>
                <p className="text-[#2CCDDE] text-xs font-bold uppercase tracking-widest mb-4">Free consultation</p>
                <h2 className="text-3xl font-bold text-[var(--text-primary)] leading-snug mb-4">
                  Tell us about your setup. We will handle the rest.
                </h2>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-8">
                  No commitment, no sales pitch. Just a straight conversation about what your business needs and how we can help.
                </p>
              </div>
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-black font-bold text-sm self-start transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_36px_rgba(44,205,222,0.5)]"
                style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)' }}
              >
                Get in Touch
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { label: 'Phone', value: '+971 54 328 2042', href: 'tel:+971543282042' },
                { label: 'Email', value: 'info@byteflow.ae', href: 'mailto:info@byteflow.ae' },
                { label: 'Location', value: 'Dubai, United Arab Emirates', href: null },
                { label: 'Support', value: '24/7 — always available', href: null },
              ].map((item) => {
                const inner = (
                  <div
                    className="flex items-center justify-between px-7 py-5 rounded-xl transition-all duration-200 group"
                    style={{ background: 'linear-gradient(160deg, rgba(44,205,222,0.05) 0%, var(--bg-surface) 100%)', border: '1px solid rgba(44,205,222,0.1)' }}
                  >
                    <span className="text-xs text-[var(--text-dim)] font-semibold uppercase tracking-wider w-20 flex-shrink-0">{item.label}</span>
                    <span className="text-[var(--text-primary)] text-sm font-semibold group-hover:text-[#2CCDDE] transition-colors duration-200 flex-1 text-right">{item.value}</span>
                  </div>
                )
                return item.href ? (
                  <a key={item.label} href={item.href}>{inner}</a>
                ) : (
                  <div key={item.label}>{inner}</div>
                )
              })}
            </div>

          </div>
        </div>
      </section>

    </main>
  )
}
