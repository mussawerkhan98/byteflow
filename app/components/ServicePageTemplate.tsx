import Link from 'next/link'
import type { ServiceData } from '../lib/services-data'
import { services } from '../lib/services-data'
import ServiceFAQ from './ServiceFAQ'

export default function ServicePageTemplate({ service }: { service: ServiceData }) {
  const related = services.filter((s) => service.relatedSlugs.includes(s.slug))

  return (
    <main style={{ background: '#040D12' }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient glows */}
        <div
          className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 80% 20%, rgba(44,205,222,0.07) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 20% 80%, rgba(70,163,225,0.05) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl">
            {/* Section label */}
            <p className="text-[#2CCDDE] text-xs font-bold uppercase tracking-widest mb-5">
              {service.title}
            </p>

            {/* H1 */}
            <h1 className="text-5xl sm:text-6xl lg:text-[68px] font-bold leading-[1.04] tracking-tight mb-6">
              <span
                style={{
                  background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {service.tagline}
              </span>
            </h1>

            {/* Description */}
            <p className="text-[#5A6272] text-lg leading-relaxed mb-10 max-w-2xl">
              {service.description}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-black font-bold text-sm transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_40px_rgba(44,205,222,0.5)]"
                style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)' }}
              >
                Get a Free Quote
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <div className="p-[1px] rounded-full self-start sm:self-auto" style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)' }}>
                <a
                  href="tel:+97143388282"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-white font-bold text-sm transition-all duration-300 hover:bg-white/5"
                  style={{ background: '#040D12' }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  Call Us Now
                </a>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {service.heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col gap-1.5 p-5 rounded-2xl"
                  style={{
                    background: 'linear-gradient(160deg, rgba(44,205,222,0.06) 0%, #050F18 100%)',
                    border: '1px solid rgba(44,205,222,0.15)',
                  }}
                >
                  <span
                    className="text-2xl font-black leading-none"
                    style={{
                      background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-[#5A6272] text-xs leading-snug">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ──────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-[#2CCDDE] text-xs font-bold uppercase tracking-widest mb-4">
              What&apos;s Included
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
              Everything included in your plan
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {service.features.map((feature, i) => (
              <div
                key={feature.title}
                className="group flex flex-col gap-4 p-7 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(44,205,222,0.1)]"
                style={{
                  background: 'linear-gradient(160deg, rgba(44,205,222,0.06) 0%, #050F18 100%)',
                  border: '1px solid rgba(44,205,222,0.15)',
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-white font-bold text-base leading-snug group-hover:text-[#2CCDDE] transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <span
                    className="text-3xl font-black tabular-nums select-none leading-none flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, rgba(44,205,222,0.2), rgba(70,163,225,0.1))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-[#5A6272] text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ─────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left */}
            <div className="lg:sticky lg:top-28">
              <p className="text-[#2CCDDE] text-xs font-bold uppercase tracking-widest mb-5">
                Why It Matters
              </p>
              <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
                Real benefits for{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  your business
                </span>
              </h2>
              <p className="text-[#5A6272] text-base leading-relaxed">
                Every service we offer is designed around one goal: making your business more productive, more secure and less dependent on fragile ad-hoc IT arrangements.
              </p>
            </div>

            {/* Right — benefits list */}
            <div className="flex flex-col gap-4">
              {service.benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="flex gap-4 p-6 rounded-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(44,205,222,0.08)]"
                  style={{
                    background: 'linear-gradient(160deg, rgba(44,205,222,0.06) 0%, #050F18 100%)',
                    border: '1px solid rgba(44,205,222,0.15)',
                  }}
                >
                  {/* Cyan checkmark */}
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: 'linear-gradient(135deg, rgba(44,205,222,0.2), rgba(70,163,225,0.1))',
                      border: '1px solid rgba(44,205,222,0.4)',
                    }}
                  >
                    <svg
                      className="w-3 h-3"
                      style={{ color: '#2CCDDE' }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-white font-bold text-sm">{benefit.title}</h3>
                    <p className="text-[#5A6272] text-sm leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────────────────── */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(44,205,222,0.06) 0%, transparent 65%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-[#2CCDDE] text-xs font-bold uppercase tracking-widest mb-5">
              How It Works
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
              <span className="text-white">From first call to</span>
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                full delivery
              </span>
            </h2>
          </div>

          {/* Desktop horizontal timeline */}
          <div className="hidden lg:block">
            <div className="relative flex items-start justify-between gap-0">
              <div
                className="absolute top-[38px] left-[10%] right-[10%] h-[1px] pointer-events-none"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(44,205,222,0.08), rgba(44,205,222,0.25) 50%, rgba(44,205,222,0.08))',
                }}
              />
              {service.process.map((step) => (
                <div key={step.step} className="relative flex flex-col items-center flex-1 px-4">
                  <div
                    className="w-[10px] h-[10px] rounded-full mb-6 flex-shrink-0 relative z-10 mt-[34px]"
                    style={{
                      background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)',
                      boxShadow: '0 0 12px rgba(44,205,222,0.5)',
                    }}
                  />
                  <div
                    className="group w-full flex flex-col gap-4 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(44,205,222,0.1)]"
                    style={{
                      background: 'linear-gradient(160deg, rgba(44,205,222,0.06) 0%, rgba(70,163,225,0.02) 40%, #050F18 100%)',
                      border: '1px solid rgba(44,205,222,0.13)',
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className="text-3xl font-black tabular-nums select-none leading-none"
                        style={{
                          background: 'linear-gradient(135deg, rgba(44,205,222,0.18), rgba(70,163,225,0.08))',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {step.step}
                      </span>
                    </div>
                    <h3 className="text-white text-sm font-bold leading-snug group-hover:text-[#2CCDDE] transition-colors duration-200">
                      {step.title}
                    </h3>
                    <p className="text-[#5A6272] text-xs leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile vertical timeline */}
          <div className="lg:hidden flex flex-col">
            {service.process.map((step, i) => (
              <div key={step.step} className="relative flex gap-5">
                <div className="flex flex-col items-center flex-shrink-0" style={{ width: '40px' }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-xs font-black"
                    style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)', color: '#000' }}
                  >
                    {i + 1}
                  </div>
                  {i < service.process.length - 1 && (
                    <div
                      className="w-[1px] flex-1 mt-2"
                      style={{
                        background: 'linear-gradient(180deg, rgba(44,205,222,0.4), rgba(44,205,222,0.05))',
                        minHeight: '40px',
                      }}
                    />
                  )}
                </div>
                <div
                  className="flex flex-col gap-3 p-5 rounded-2xl mb-4 flex-1 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(160deg, rgba(44,205,222,0.06) 0%, #050F18 100%)',
                    border: '1px solid rgba(44,205,222,0.13)',
                  }}
                >
                  <h3 className="text-white text-sm font-bold">{step.title}</h3>
                  <p className="text-[#5A6272] text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#2CCDDE] text-xs font-bold uppercase tracking-widest mb-5">
              FAQ
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
              <span className="text-white">Questions we get</span>
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                asked all the time
              </span>
            </h2>
          </div>
          <ServiceFAQ faqs={service.faqs} />
        </div>
      </section>

      {/* ── CTA BAND ─────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div
            className="relative overflow-hidden rounded-3xl p-10 sm:p-14"
            style={{
              background: 'linear-gradient(160deg, rgba(44,205,222,0.1) 0%, rgba(70,163,225,0.05) 50%, #050F18 100%)',
              border: '1px solid rgba(44,205,222,0.25)',
            }}
          >
            {/* Background glow */}
            <div
              className="absolute top-0 right-0 w-[500px] h-[400px] pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 80% 20%, rgba(44,205,222,0.1) 0%, transparent 60%)',
                filter: 'blur(60px)',
              }}
            />

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-xl">
                <p className="text-[#2CCDDE] text-xs font-bold uppercase tracking-widest mb-4">
                  Get Started
                </p>
                <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
                  Ready to get started?
                </h2>
                <p className="text-[#5A6272] text-base leading-relaxed">
                  Talk to our team today. We will listen to your requirements, assess your current setup and deliver a clear proposal within 24 hours. No obligation, no jargon.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-black font-bold text-sm transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_40px_rgba(44,205,222,0.5)]"
                  style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)' }}
                >
                  Get a Free Quote
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <a
                  href="tel:+97143388282"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-bold text-sm transition-all duration-300 hover:text-white"
                  style={{
                    background: 'rgba(44,205,222,0.07)',
                    border: '1px solid rgba(44,205,222,0.25)',
                    color: '#2CCDDE',
                  }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  Call Us Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RELATED SERVICES ─────────────────────────────────── */}
      {related.length > 0 && (
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <p className="text-[#2CCDDE] text-xs font-bold uppercase tracking-widest mb-4">
                Related Services
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                You might also need
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/${rel.slug}`}
                  className="group flex flex-col gap-4 p-7 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(44,205,222,0.15)]"
                  style={{
                    background: 'linear-gradient(160deg, rgba(44,205,222,0.06) 0%, #050F18 100%)',
                    border: '1px solid rgba(44,205,222,0.15)',
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-white font-bold text-base leading-snug group-hover:text-[#2CCDDE] transition-colors duration-200">
                      {rel.title}
                    </h3>
                    <svg
                      className="w-4 h-4 flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                      style={{ color: '#2CCDDE' }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </div>
                  <p className="text-[#5A6272] text-sm leading-relaxed">{rel.tagline}</p>
                  <span
                    className="text-xs font-bold mt-auto pt-4 transition-colors duration-200 group-hover:text-white"
                    style={{
                      color: '#2CCDDE',
                      borderTop: '1px solid rgba(44,205,222,0.1)',
                    }}
                  >
                    Learn more
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  )
}
