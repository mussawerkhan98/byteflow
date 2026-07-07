import Link from 'next/link'

const stats = [
  { value: '500+', label: 'Businesses Served' },
  { value: '8+', label: 'Years Experience' },
  { value: '6+', label: 'IT Services' },
  { value: '24/7', label: 'Support Available' },
]

const highlights = [
  { title: 'Full IT Under One Roof', desc: 'Infrastructure, cloud, security, design and marketing — all managed by one expert team with full accountability.' },
  { title: 'Zero Hidden Costs', desc: 'Fixed monthly or annual packages so you always know what you pay. No surprises, no extra invoices.' },
  { title: 'Rapid On-Site Response', desc: 'Certified engineers on-site or remote within 2 hours across Dubai, Sharjah and Abu Dhabi.' },
  { title: 'Microsoft & Cloud Ready', desc: 'Official Microsoft 365 setup, cloud migrations and ongoing management for UAE businesses of every size.' },
]

const values = [
  {
    title: 'Fast Response',
    desc: 'On-site or remote support within 2 hours. We never leave you waiting when your business is down.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: 'Expert Team',
    desc: 'Certified IT professionals with deep expertise across infrastructure, cloud, security and design.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
  {
    title: 'Fixed Pricing',
    desc: 'Transparent monthly or annual packages with no surprise bills. Budget with complete confidence.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
  {
    title: 'One Team, All IT',
    desc: 'From IT support to web development and digital marketing — one vendor, zero hassle, full accountability.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
]

export default function AboutUs() {
  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">

      {/* Ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(44,205,222,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      {/* Watermark year */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 text-[220px] font-black select-none pointer-events-none leading-none pr-8 hidden lg:block"
        style={{ color: 'rgba(44,205,222,0.03)', letterSpacing: '-0.05em' }}
      >
        2017
      </div>

      <div className="relative max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-7 uppercase tracking-widest"
            style={{ background: 'rgba(44,205,222,0.07)', border: '1px solid rgba(44,205,222,0.25)', color: '#2CCDDE' }}
          >
            About Byteflow
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <h2 className="text-5xl sm:text-6xl lg:text-[68px] font-bold leading-[1.05] tracking-tight">
              <span className="text-[var(--text-primary)]">Your Trusted </span>
              <span style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                IT Partner
              </span>
              <br />
              <span className="text-[var(--text-primary)]">Serving Dubai </span>
              <span style={{ background: 'linear-gradient(135deg, #46A3E1, #2CCDDE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Since 2017
              </span>
            </h2>
            <p className="text-[var(--text-muted)] text-base leading-relaxed max-w-sm lg:text-right lg:pb-2 flex-shrink-0">
              We make enterprise-grade IT accessible to every business in the UAE — so you can focus entirely on growth.
            </p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 gap-4 mb-16">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center justify-center py-10 px-8 rounded-2xl"
              style={{
                background: 'linear-gradient(160deg, rgba(44,205,222,0.06) 0%, var(--bg-surface) 100%)',
                border: '1px solid rgba(44,205,222,0.15)',
              }}
            >
              <span
                className="text-5xl font-black mb-2"
                style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                {s.value}
              </span>
              <span className="text-sm text-[var(--text-muted)] font-medium text-center">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Highlights grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px mb-16 rounded-2xl overflow-hidden"
          style={{ background: 'rgba(44,205,222,0.08)' }}>
          {highlights.map((h) => (
            <div
              key={h.title}
              className="group flex gap-5 p-8 transition-all duration-300"
              style={{ background: 'linear-gradient(160deg, rgba(44,205,222,0.04) 0%, var(--bg-page) 100%)' }}
            >
              <div
                className="w-2 flex-shrink-0 rounded-full mt-1 self-stretch max-h-5"
                style={{ background: 'linear-gradient(180deg, #2CCDDE, #46A3E1)', minHeight: '20px', maxHeight: '20px' }}
              />
              <div>
                <h3 className="text-[var(--text-primary)] font-bold text-base mb-2 group-hover:text-[#2CCDDE] transition-colors duration-300">
                  {h.title}
                </h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">{h.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-20">
          <p className="text-[var(--text-muted)] text-sm max-w-md">
            Byteflow handles your entire IT ecosystem — from a single laptop to a full corporate network setup across the UAE.
          </p>
          <Link
            href="/contact-us"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-black font-bold text-sm flex-shrink-0 transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_36px_rgba(44,205,222,0.5)]"
            style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)' }}
          >
            Get in Touch
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Values */}
        <div style={{ borderTop: '1px solid rgba(44,205,222,0.1)' }} className="pt-16">
          <p className="text-center text-xs font-bold uppercase tracking-widest mb-10" style={{ color: '#2CCDDE' }}>
            Why Businesses Choose Us
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="group flex flex-col gap-4 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(44,205,222,0.1)]"
                style={{
                  background: 'linear-gradient(160deg, rgba(44,205,222,0.06) 0%, rgba(70,163,225,0.02) 40%, var(--bg-surface) 100%)',
                  border: '1px solid rgba(44,205,222,0.15)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(44,205,222,0.4)]"
                  style={{
                    background: 'linear-gradient(135deg, rgba(44,205,222,0.14), rgba(70,163,225,0.08))',
                    border: '1px solid rgba(44,205,222,0.25)',
                    color: '#2CCDDE',
                  }}
                >
                  {v.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1.5 group-hover:text-[#2CCDDE] transition-colors duration-300">
                    {v.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
