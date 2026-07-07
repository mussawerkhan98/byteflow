import Link from 'next/link'
import Image from 'next/image'

const stats = [
  { value: '500+', label: 'Businesses Served' },
  { value: '8+', label: 'Years Experience' },
  { value: '6+', label: 'IT Services' },
  { value: 'Dubai', label: 'UAE Based' },
]

const services = [
  'IT AMC',
  'Cloud Services',
  'Digital Marketing',
  'Website Development',
  'Graphic Design',
  'Landing Pages',
  'Network Infrastructure',
  'IT Consulting',
  'Managed IT',
  'Cybersecurity',
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden">

      {/* Hero background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/hero.png"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark overlay so text stays readable */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.92) 100%)' }}
        />
        {/* Cyan tint glow on top */}
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(44,205,222,0.12) 0%, transparent 70%)' }}
        />
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-0 flex flex-col items-center text-center">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 tracking-wide uppercase"
          style={{
            background: 'rgba(44,205,222,0.07)',
            border: '1px solid rgba(44,205,222,0.28)',
            color: '#2CCDDE',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: '#2CCDDE', animation: 'pulse-glow 2s ease-in-out infinite' }}
          />
          Trusted IT Partner Since 2017
        </div>

        {/* Headline */}
        <h1 className="max-w-5xl text-5xl sm:text-6xl lg:text-[72px] font-bold leading-[1.1] tracking-tight mb-6">
          <span className="text-white">We Handle Your </span>
          <span
            style={{
              background: 'linear-gradient(135deg, #2CCDDE 0%, #46A3E1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            IT,
          </span>
          <br />
          <span className="text-white">You Focus On Your </span>
          <span
            style={{
              background: 'linear-gradient(135deg, #46A3E1 0%, #2CCDDE 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Business.
          </span>
        </h1>

        {/* Subtext */}
        <p className="max-w-2xl text-lg text-[#4B5563] leading-relaxed mb-10">
          From network infrastructure to cloud services and digital marketing, Byteflow delivers complete IT solutions for businesses across Dubai and the UAE. One call, one team, all your IT handled.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20">
          <Link
            href="/contact-us"
            className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-black font-bold text-sm transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_40px_rgba(44,205,222,0.55)]"
            style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)' }}
          >
            Get Started Today
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          <div
            className="p-[1px] rounded-full transition-all duration-300 hover:shadow-[0_0_24px_rgba(44,205,222,0.2)]"
            style={{ background: 'linear-gradient(135deg, #2CCDDE40, #46A3E140)' }}
          >
            <Link
              href="/it-amc-services-dubai"
              className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-[#9CA3AF] font-semibold text-sm transition-all duration-300 hover:text-[#2CCDDE] bg-black"
            >
              Explore Services
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div
          className="w-full max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-px mb-20 rounded-2xl overflow-hidden"
          style={{ background: 'rgba(44,205,222,0.08)' }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center py-7 px-4"
              style={{ background: '#040D12' }}
            >
              <span
                className="text-3xl font-bold mb-1"
                style={{
                  background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {stat.value}
              </span>
              <span className="text-xs text-[#4B5563] font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Services marquee */}
      <div
        className="relative w-full overflow-hidden py-5"
        style={{ borderTop: '1px solid rgba(44,205,222,0.1)', borderBottom: '1px solid rgba(44,205,222,0.1)' }}
      >
        {/* fade edges */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #040D12 0%, transparent 100%)' }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(270deg, #040D12 0%, transparent 100%)' }}
        />

        <div className="flex whitespace-nowrap marquee-track">
          {[...services, ...services].map((s, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2 mx-5 text-sm font-medium flex-shrink-0"
              style={{ color: '#4B5563' }}
            >
              <span
                className="w-1 h-1 rounded-full flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #2CCDDE, #46A3E1)' }}
              />
              {s}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
