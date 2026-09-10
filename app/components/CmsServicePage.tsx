/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import Image from 'next/image'
import type { DbService } from '../lib/db'

/**
 * Service page for services created in the admin panel. The nine original
 * services have their own hand-written routes with far richer content; this
 * renders whatever the CMS actually has and skips every section that is
 * empty, so a sparsely filled service never leaves blank gaps on the page.
 */
export default function CmsServicePage({
  service,
  related,
}: {
  service: DbService
  related: DbService[]
}) {
  const iconIsImage = /^(?:data:image\/svg\+xml|https?:\/\/|\/)/i.test(service.icon)
  const paragraphs = service.description
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return (
    <main style={{ background: 'var(--bg-page)' }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 80% 20%, rgba(44,205,222,0.07) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-[#2CCDDE] text-xs font-bold uppercase tracking-widest mb-5">
              Our Services
            </p>

            <div className="flex items-start gap-5 mb-6">
              {service.icon && (
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(44,205,222,0.15), rgba(70,163,225,0.1))',
                    border: '1px solid rgba(44,205,222,0.3)',
                    color: '#2CCDDE',
                  }}
                >
                  {iconIsImage ? (
                    <img className="h-8 w-8 object-contain" src={service.icon} alt="" aria-hidden="true" />
                  ) : (
                    <span className="text-3xl leading-none">{service.icon}</span>
                  )}
                </div>
              )}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
                <span
                  style={{
                    background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {service.title}
                </span>
              </h1>
            </div>

            {service.excerpt && (
              <p className="text-[var(--text-muted)] text-lg leading-relaxed mb-10 max-w-2xl">
                {service.excerpt}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
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
              <div className="p-[1px] rounded-full self-start sm:self-auto" style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)' }}>
                <a
                  href="tel:+971543282042"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-[var(--text-primary)] font-bold text-sm transition-all duration-300 hover:bg-[var(--overlay-hover)]"
                  style={{ background: 'var(--bg-page)' }}
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

      {/* ── IMAGE ────────────────────────────────────────────── */}
      {service.image_url && (
        <section className="px-4 sm:px-6 lg:px-8 pb-4">
          <div className="max-w-7xl mx-auto">
            <div
              className="relative h-[280px] sm:h-[420px] rounded-3xl overflow-hidden"
              style={{ border: '1px solid rgba(44,205,222,0.15)' }}
            >
              <Image
                src={service.image_url}
                alt={service.title}
                fill
                sizes="(min-width: 1280px) 1280px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* ── DESCRIPTION ──────────────────────────────────────── */}
      {paragraphs.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-3xl">
              <p className="text-[#2CCDDE] text-xs font-bold uppercase tracking-widest mb-5">
                What&apos;s Included
              </p>
              <div className="flex flex-col gap-5">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-[var(--text-body)] text-base leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA BAND ─────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div
            className="relative overflow-hidden rounded-3xl p-10 sm:p-14"
            style={{
              background: 'linear-gradient(160deg, rgba(44,205,222,0.1) 0%, rgba(70,163,225,0.05) 50%, var(--bg-surface) 100%)',
              border: '1px solid rgba(44,205,222,0.25)',
            }}
          >
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-xl">
                <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] leading-tight mb-4">
                  Ready to get started?
                </h2>
                <p className="text-[var(--text-muted)] text-base leading-relaxed">
                  Talk to our team today. We will assess your setup and send a clear proposal within 24 hours.
                </p>
              </div>
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-black font-bold text-sm flex-shrink-0 transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_40px_rgba(44,205,222,0.5)]"
                style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)' }}
              >
                Get a Free Quote
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── RELATED ──────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <p className="text-[#2CCDDE] text-xs font-bold uppercase tracking-widest mb-4">
                Related Services
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                You might also need
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${item.slug}`}
                  className="group flex flex-col gap-4 p-7 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(44,205,222,0.15)]"
                  style={{
                    background: 'linear-gradient(160deg, rgba(44,205,222,0.06) 0%, var(--bg-surface) 100%)',
                    border: '1px solid rgba(44,205,222,0.15)',
                  }}
                >
                  <h3 className="text-[var(--text-primary)] font-bold text-base leading-snug group-hover:text-[#2CCDDE] transition-colors duration-200">
                    {item.title}
                  </h3>
                  {item.excerpt && (
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed line-clamp-3">{item.excerpt}</p>
                  )}
                  <span
                    className="text-xs font-bold mt-auto pt-4 transition-colors duration-200 group-hover:text-[var(--text-primary)]"
                    style={{ color: '#2CCDDE', borderTop: '1px solid rgba(44,205,222,0.1)' }}
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
