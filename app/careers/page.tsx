import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Careers | Byteflow Information Technology',
  description: 'Join the team behind 500+ businesses across Dubai and the UAE. See how we work and how to reach us about opportunities at Byteflow.',
}

const values = [
  {
    title: 'Ownership, not micromanagement',
    desc: 'You get real client problems to solve and the trust to solve them. We care about outcomes, not hours logged.',
  },
  {
    title: 'Work that ships fast',
    desc: 'Small team, short feedback loops. What you build this week is usually live for a client within weeks, not quarters.',
  },
  {
    title: 'Room to grow across disciplines',
    desc: 'IT support, cloud, security, dev, design, marketing — all under one roof, so you can broaden your skills instead of staying in one narrow lane.',
  },
  {
    title: 'Straight talk, no politics',
    desc: 'Flat structure, direct communication. If something is not working, we say so and fix it — with clients and with each other.',
  },
]

export default function CareersPage() {
  return (
    <main>
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 80% 20%, rgba(44,205,222,0.07) 0%, transparent 60%)', filter: 'blur(80px)' }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-[#2CCDDE] text-sm font-semibold uppercase tracking-widest mb-4">Careers</p>
          <h1 className="text-5xl sm:text-6xl font-bold leading-[1.04] tracking-tight mb-6">
            <span className="text-[var(--text-primary)]">Help us keep </span>
            <span
              style={{
                background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              500+ businesses
            </span>
            <span className="text-[var(--text-primary)]"> running smoothly.</span>
          </h1>
          <p className="text-[var(--text-muted)] text-lg leading-relaxed max-w-xl mx-auto">
            We don&apos;t have specific openings listed right now, but we&apos;re always happy to hear from
            good people across IT support, development, design and marketing.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="flex flex-col gap-3 p-7 rounded-2xl"
                style={{
                  background: 'linear-gradient(160deg, rgba(44,205,222,0.06) 0%, var(--bg-surface) 100%)',
                  border: '1px solid rgba(44,205,222,0.15)',
                }}
              >
                <h3 className="text-[var(--text-primary)] font-bold text-base leading-snug">{v.title}</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-28">
        <div className="max-w-4xl mx-auto">
          <div
            className="relative overflow-hidden rounded-2xl px-8 py-14 flex flex-col items-center text-center gap-6"
            style={{
              background: 'linear-gradient(135deg, rgba(44,205,222,0.08) 0%, rgba(70,163,225,0.04) 50%, var(--bg-surface) 100%)',
              border: '1px solid rgba(44,205,222,0.18)',
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(44,205,222,0.6), transparent)' }}
            />
            <div>
              <p className="text-[var(--text-primary)] text-xl font-bold mb-2">Interested in working with us?</p>
              <p className="text-[var(--text-muted)] text-sm max-w-md mx-auto">
                Send your CV and a short note about what you do to{' '}
                <a href="mailto:info@byteflow.ae" className="font-semibold" style={{ color: '#2CCDDE' }}>
                  info@byteflow.ae
                </a>{' '}
                and we&apos;ll get back to you if there&apos;s a fit.
              </p>
            </div>
            <a
              href="mailto:info@byteflow.ae"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-black text-sm font-bold flex-shrink-0 transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_28px_rgba(44,205,222,0.45)]"
              style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)' }}
            >
              Email Your CV
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
