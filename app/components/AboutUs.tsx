import Image from 'next/image'
import Link from 'next/link'
import { getSection } from '../lib/cms'
import { ArrowIcon } from './InlineIcons'

const FOUNDED = 2017
// Counted from the founding year, so the figure doesn't go stale.
const YEARS = new Date().getFullYear() - FOUNDED

// Each reason links to the page that backs it up.
const highlights = [
  { title: 'Full IT under one roof', href: '/about-us', desc: 'Infrastructure, cloud, security, design and marketing, all managed by one expert team with full accountability.' },
  { title: 'Zero hidden costs', href: '/it-amc-services-dubai', desc: 'Fixed monthly or annual packages so you always know what you pay. No surprises, no extra invoices.' },
  { title: 'Rapid on-site response', href: '/contact-us', desc: 'Certified engineers on-site or remote within 2 hours across Dubai, Sharjah and Abu Dhabi.' },
  { title: 'Microsoft & cloud ready', href: '/cloud-services-dubai', desc: 'Official Microsoft 365 setup, cloud migrations and ongoing management for UAE businesses of every size.' },
]

/** Round button whose arrow points up and right, and swaps for a fresh one on hover. */
function ArrowButton() {
  return (
    <span
      aria-hidden="true"
      className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full border border-[var(--border-strong)] text-[var(--text-primary)] transition-colors duration-300 group-hover:border-[#2CCDDE] group-hover:bg-[#2CCDDE] group-hover:text-[#04121A] sm:h-14 sm:w-14"
    >
      <ArrowIcon className="h-4 w-4 -rotate-45 transition-transform duration-300 ease-out group-hover:translate-x-7 group-hover:-translate-y-7 motion-reduce:transition-none" />
      <ArrowIcon className="absolute h-4 w-4 -translate-x-7 translate-y-7 -rotate-45 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0 motion-reduce:transition-none" />
    </span>
  )
}

const values = [
  {
    title: 'Fast response',
    value: '2',
    unit: 'hrs',
    desc: 'On-site or remote support within 2 hours. We never leave you waiting when your business is down.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: 'Expert team',
    value: '100%',
    unit: 'certified engineers',
    desc: 'Certified IT professionals with deep expertise across infrastructure, cloud, security and design.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
  {
    title: 'Fixed pricing',
    value: '0',
    unit: 'surprise bills',
    desc: 'Transparent monthly or annual packages with no surprise bills. Budget with complete confidence.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
  {
    title: 'One team, all IT',
    value: '1',
    unit: 'vendor to call',
    desc: 'From IT support to web development and digital marketing — one vendor, zero hassle, full accountability.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
]

// One column on phones, two on tablets, four on desktop. Hairlines between
// cells are borders, so none runs along the panel's outer edge.
const commitmentCellClass = [
  '',
  'border-t sm:border-l sm:border-t-0',
  'border-t lg:border-l lg:border-t-0',
  'border-t sm:border-l lg:border-t-0',
]

export default async function AboutUs() {
  // The front frame shows the founder photo from the About page. As there, an
  // existing record with no photo means none; no record means the bundled one.
  const founder = await getSection('about-us', 'founder')
  const founderImage = founder ? String(founder.image_url || '') : '/images/owner/owner.png'
  const founderAlt = String(founder?.image_alt || 'Byteflow founder')

  return (
    <section className="home-about border-t border-[var(--border-default)] py-20 sm:py-24 lg:py-32">
      {/* Same container as the header, so the section's edges sit under the
          logo and the Contact button. */}
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <p className="mb-6 flex items-center gap-3 text-[13px] font-medium text-[var(--text-body)]">
              <span aria-hidden="true" className="h-px w-10 bg-[#2CCDDE]" />
              About Byteflow
            </p>
            {/* Always two lines: each line holds together, and the size scales
                with the viewport so the longer one still fits its column. */}
            <h2 className="text-[clamp(1.5rem,5.4vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-[var(--text-primary)] lg:text-[clamp(1.75rem,3.1vw,3.25rem)]">
              <span className="block whitespace-nowrap">Your trusted IT partner,</span>
              <span className="block whitespace-nowrap text-[var(--ink-soft)]">serving Dubai since {FOUNDED}.</span>
            </h2>
            <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-[var(--text-body)]">
              We make enterprise-grade IT accessible to every business in the UAE, so you can focus entirely on growth.
            </p>

            {/* Two frames: the technology behind, the people in front. */}
            <div className="relative mt-12 pb-24 pr-12 sm:pr-28 lg:mt-14">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[#040D12]">
                <Image
                  src="/images/hero/hero.png"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  // Mirrored so the cube lands on the left, clear of the portrait.
                  className="-scale-x-100 object-cover object-[100%_55%]"
                />
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[rgba(4,13,18,0.7)] px-3.5 py-1.5 text-[12.5px] font-medium text-white backdrop-blur-md sm:left-5 sm:top-5">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#2CCDDE]" />
                  Based in Dubai since {FOUNDED}
                </span>
              </div>

              {founderImage && (
                <div className="absolute bottom-0 right-0 w-[46%] overflow-hidden rounded-3xl border-[6px] border-[var(--bg-page)] bg-[var(--bg-surface)] shadow-(--shadow-pop)">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={founderImage}
                      alt={founderAlt}
                      fill
                      sizes="(min-width: 1024px) 20vw, 45vw"
                      className="object-cover object-top"
                    />
                  </div>
                </div>
              )}

              {/* Sits in the space the offset frame leaves under the first one. */}
              <p className="absolute bottom-0 left-0 flex items-baseline gap-3">
                <span className="font-display text-[3rem] font-semibold leading-none tracking-[-0.05em] tabular-nums text-[var(--text-primary)] sm:text-[3.5rem]">
                  {YEARS}+
                </span>
                <span className="text-[14px] leading-snug text-[var(--text-body)]">
                  years keeping UAE
                  <br />
                  businesses running
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:col-span-5 lg:col-start-8 lg:pt-12">
            <ul className="border-t border-[var(--border-default)]">
              {highlights.map((h) => (
                <li key={h.title}>
                  <Link
                    href={h.href}
                    className="group grid grid-cols-[auto_1fr] items-start gap-5 border-b border-[var(--border-default)] py-7 sm:gap-7 lg:py-8"
                  >
                    <ArrowButton />
                    <div>
                      <h3 className="font-display text-[1.375rem] font-semibold leading-snug tracking-[-0.025em] text-[var(--text-primary)] sm:text-[1.5rem]">
                        {h.title}
                      </h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-body)]">{h.desc}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-10 grid gap-3 sm:flex sm:flex-wrap sm:items-center">
              <Link
                href="/contact-us"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#2CCDDE] pl-6 pr-5 text-[15px] font-semibold text-[#04121A] transition-colors duration-200 hover:bg-[#5BDCE9]"
              >
                Get in touch
                <ArrowIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/about-us"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--border-strong)] px-6 text-[15px] font-semibold text-[var(--text-primary)] transition-colors duration-200 hover:border-[var(--text-primary)]"
              >
                More about Byteflow
              </Link>
            </div>
          </div>
        </div>

        {/* Why choose us: one panel of commitments, each led by the figure behind it. */}
        <section
          aria-labelledby="about-commitments-title"
          className="mt-20 overflow-hidden rounded-3xl lg:mt-28 border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-(--shadow-card)"
        >
          <div className="grid gap-5 border-b border-[var(--border-default)] px-6 py-9 sm:px-8 lg:grid-cols-12 lg:items-end lg:gap-10 lg:px-10 lg:py-12">
            <div className="lg:col-span-7">
              <p className="flex items-center gap-3 text-[13px] font-medium text-[var(--text-body)]">
                <span aria-hidden="true" className="h-px w-10 bg-[#2CCDDE]" />
                Why businesses choose us
              </p>
              <h3
                id="about-commitments-title"
                className="mt-4 font-display text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.035em] text-[var(--text-primary)] sm:text-[2.25rem] lg:text-[2.5rem]"
              >
                What you can count on,{' '}
                <span className="text-[var(--ink-soft)]">every time.</span>
              </h3>
            </div>
            <p className="max-w-md text-[15px] leading-relaxed text-[var(--text-body)] lg:col-span-5 lg:justify-self-end lg:text-right">
              The standards every Byteflow client gets, from a single laptop to a full office.
            </p>
          </div>

          <ul className="grid sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <li
                key={v.title}
                className={`group relative isolate flex flex-col overflow-hidden border-[var(--border-default)] px-6 pb-9 pt-8 sm:px-8 lg:pb-11 lg:pt-10 ${commitmentCellClass[i]}`}
              >
                {/* Fills in along the top edge on hover. */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-0.5 w-0 bg-[#2CCDDE] transition-[width] duration-500 group-hover:w-full motion-reduce:transition-none"
                />
                <span
                  aria-hidden="true"
                  className="about-glow pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                {/* Ghost numeral, tucked into the top-right corner. */}
                <span
                  aria-hidden="true"
                  className="about-ghost pointer-events-none absolute right-5 top-5 -z-10 select-none font-display text-[5.5rem] font-bold leading-none tracking-[-0.05em] tabular-nums sm:right-7 sm:top-6 sm:text-[6.5rem]"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span
                  aria-hidden="true"
                  className="about-accent grid h-12 w-12 place-items-center rounded-2xl border border-[var(--border-default)] bg-[var(--bg-page)] transition-colors duration-300 group-hover:border-[#2CCDDE]/50"
                >
                  {v.icon}
                </span>

                <p className="mt-12 flex flex-wrap items-baseline gap-x-2.5">
                  <span className="font-display text-[2.75rem] font-semibold leading-none tracking-[-0.045em] tabular-nums text-[var(--text-primary)] sm:text-[3rem]">
                    {v.value}
                  </span>
                  <span className="text-[14px] font-medium text-[var(--text-body)]">{v.unit}</span>
                </p>

                <span aria-hidden="true" className="mt-7 block h-px w-8 bg-[var(--border-strong)] transition-[width,background-color] duration-500 group-hover:w-14 group-hover:bg-[#2CCDDE] motion-reduce:transition-none" />

                <h4 className="mt-5 font-display text-[1.0625rem] font-semibold tracking-[-0.015em] text-[var(--text-primary)]">{v.title}</h4>
                <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--text-body)]">{v.desc}</p>
              </li>
            ))}
          </ul>
        </section>

      </div>
    </section>
  )
}
