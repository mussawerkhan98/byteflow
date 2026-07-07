import Link from 'next/link'

export default function CTA() {
  return (
    <section className="relative overflow-hidden">

      {/* Fixed background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/images/hero/hero.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.78)' }} />

      {/* Cyan radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(44,205,222,0.12) 0%, transparent 70%)' }}
      />

      {/* Top fade from black */}
      <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #040D12 0%, transparent 100%)' }} />

      {/* Bottom fade to black */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #040D12 0%, transparent 100%)' }} />

      <div className="relative py-36 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 uppercase tracking-widest"
            style={{ background: 'rgba(44,205,222,0.08)', border: '1px solid rgba(44,205,222,0.3)', color: '#2CCDDE' }}
          >
            Get Started Today
          </div>

          {/* Headline */}
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.04] tracking-tight mb-6">
            <span className="text-white">Ready to Upgrade</span>
            <br />
            <span style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Your IT Setup?
            </span>
          </h2>

          {/* Subtext */}
          <p className="text-[#7A8494] text-lg leading-relaxed max-w-xl mx-auto mb-12">
            Let our certified engineers handle everything — from network setup to cloud migration and cybersecurity. One call is all it takes.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact-us"
              className="group inline-flex items-center gap-2.5 px-9 py-4 rounded-full text-black font-bold text-base transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_50px_rgba(44,205,222,0.6)]"
              style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)' }}
            >
              Talk to Our Team
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <div className="p-[1px] rounded-full" style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)' }}>
              <Link
                href="tel:+971543282042"
                className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full text-white font-bold text-base transition-all duration-300 hover:bg-white/5"
                style={{ background: '#040D12' }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                Call Us Now
              </Link>
            </div>
          </div>

          {/* Trust line */}
          <p className="mt-10 text-xs text-[#374151] font-medium tracking-wide uppercase">
            No contracts required &nbsp;·&nbsp; Free consultation &nbsp;·&nbsp; Response within 2 hours
          </p>

        </div>
      </div>

    </section>
  )
}
