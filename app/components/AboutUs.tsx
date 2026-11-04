import Image from 'next/image'
import Link from 'next/link'
import { getSection } from '../lib/cms'
import { getHomeBlock } from '../lib/home-blocks'
import { homeDefaults } from '../lib/home-content'
import { ArrowIcon } from './InlineIcons'

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

// Service promise icons, by row position. The words come from the admin panel
// ("Home page sections" → Service promise); a fifth row reuses the first icon.
const promiseIcons = [
  <svg key="bolt" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>,
  <svg key="badge" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
  </svg>,
  <svg key="cash" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
  </svg>,
  <svg key="team" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>,
]

/**
 * A seal for the promise panel. The wording and a dashed inner ring turn in
 * opposite directions, and a soft pulse leaves the check mark.
 */
function PromiseSeal({ text }: { text: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 140 140" className="h-24 w-24 shrink-0 overflow-visible sm:h-28 sm:w-28">
      <defs>
        <path id="about-seal-path" d="M70 70 m-54 0 a54 54 0 1 1 108 0 a54 54 0 1 1 -108 0" />
      </defs>
      <circle cx="70" cy="70" r="68" fill="var(--promise-tile)" stroke="var(--border-default)" />
      <g className="about-seal-ring">
        <text className="fill-[var(--text-body)] text-[9.5px] font-semibold uppercase">
          {/* Stretched to go once round the ring, however long the wording. */}
          <textPath href="#about-seal-path" textLength="333" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </g>
      <circle className="about-seal-dash" cx="70" cy="70" r="41" fill="none" stroke="rgba(44,205,222,0.45)" strokeDasharray="1.5 4.5" />
      <circle className="about-seal-pulse" cx="70" cy="70" r="30" fill="#2CCDDE" />
      <circle cx="70" cy="70" r="30" fill="#2CCDDE" />
      <path d="M58.5 70.5l7.5 7.5 15.5-16" fill="none" stroke="#04121A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// A headline line stays on one line only while it is short enough to fit the
// column; longer wording from the admin wraps instead of running off screen.
const holdTogether = (line: string) => (line.length <= 26 ? 'whitespace-nowrap' : '')

export default async function AboutUs() {
  const [founder, about, promise] = await Promise.all([
    // The front frame shows the founder photo from the About page. As there,
    // an existing record with no photo means none; no record means the bundled one.
    getSection('about-us', 'founder'),
    getHomeBlock('home_about'),
    getHomeBlock('home_promise'),
  ])
  const founderImage = founder ? String(founder.image_url || '') : '/images/owner/owner.png'
  const founderAlt = String(founder?.image_alt || 'Byteflow founder')

  const copy = about.fields
  const promiseCopy = promise.fields
  // Counted from the founding year, so the figure doesn't go stale.
  const founded = Number.parseInt(copy.founded_year, 10)
  const years = new Date().getFullYear() - (Number.isFinite(founded) ? founded : 2017)
  // The built-in artwork is mirrored so its cube clears the portrait; an
  // uploaded image is shown as it is.
  const defaultImage = copy.image_url === homeDefaults.home_about.fields.image_url

  return (
    <section className="home-about border-t border-[var(--border-default)] py-20 sm:py-24 lg:py-32">
      {/* Same container as the header, so the section's edges sit under the
          logo and the Contact button. */}
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <p className="mb-6 flex items-center gap-3 text-[13px] font-medium text-[var(--text-body)]">
              <span aria-hidden="true" className="h-px w-10 bg-[#2CCDDE]" />
              {copy.eyebrow}
            </p>
            {/* Two lines: each holds together while it fits, and the size scales
                with the viewport so the longer one still fits its column. */}
            <h2 className="text-[clamp(1.5rem,5.4vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-[var(--text-primary)] lg:text-[clamp(1.75rem,3.1vw,3.25rem)]">
              <span className={`block ${holdTogether(copy.heading)}`}>{copy.heading}</span>{' '}
              <span className={`block text-[var(--ink-soft)] ${holdTogether(copy.heading_soft)}`}>{copy.heading_soft}</span>
            </h2>
            <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-[var(--text-body)]">{copy.intro}</p>

            {/* Two frames: the technology behind, the people in front. */}
            <div className="relative mt-12 pb-24 pr-12 sm:pr-28 lg:mt-14">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[#040D12]">
                <Image
                  src={copy.image_url}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className={`object-cover ${defaultImage ? '-scale-x-100 object-[100%_55%]' : 'object-center'}`}
                />
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[rgba(4,13,18,0.7)] px-3.5 py-1.5 text-[12.5px] font-medium text-white backdrop-blur-md sm:left-5 sm:top-5">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#2CCDDE]" />
                  {copy.image_badge}
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

              {/* Floating badge over the first frame's bottom-left corner. */}
              <p className="absolute bottom-8 left-4 flex items-center gap-4 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-page)] py-4 pl-5 pr-6 shadow-(--shadow-pop) sm:left-6">
                <span className="font-display text-[2.5rem] font-semibold leading-none tracking-[-0.05em] tabular-nums text-[var(--text-primary)]">
                  {years}
                  <span className="text-[#2CCDDE]">+</span>
                </span>
                <span aria-hidden="true" className="h-10 w-px bg-[var(--border-default)]" />
                <span className="max-w-[10.5rem] text-[13px] font-medium leading-snug text-[var(--text-body)]">
                  {copy.years_label}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:col-span-5 lg:col-start-8 lg:pt-12">
            <ul className="border-t border-[var(--border-default)]">
              {about.lists.highlights.map((h) => (
                <li key={h.title}>
                  <Link
                    href={h.link || '/contact-us'}
                    className="group grid grid-cols-[auto_1fr] items-start gap-5 border-b border-[var(--border-default)] py-7 sm:gap-7 lg:py-8"
                  >
                    <ArrowButton />
                    <div>
                      <h3 className="font-display text-[1.375rem] font-semibold leading-snug tracking-[-0.025em] text-[var(--text-primary)] sm:text-[1.5rem]">
                        {h.title}
                      </h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-body)]">{h.description}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-10 grid gap-3 sm:flex sm:flex-wrap sm:items-center">
              <Link
                href={copy.primary_link}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#2CCDDE] pl-6 pr-5 text-[15px] font-semibold text-[#04121A] transition-colors duration-200 hover:bg-[#5BDCE9]"
              >
                {copy.primary_label}
                <ArrowIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={copy.secondary_link}
                className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--border-strong)] px-6 text-[15px] font-semibold text-[var(--text-primary)] transition-colors duration-200 hover:border-[var(--text-primary)]"
              >
                {copy.secondary_label}
              </Link>
            </div>
          </div>
        </div>

        {/* Why choose us: the service promise, set out like an agreement, on
            a tinted panel so it reads as its own band under the About block. */}
        <section
          aria-labelledby="about-commitments-title"
          className="tint-panel relative isolate mt-16 overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--bg-surface)] lg:mt-20"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(closest-side,rgba(44,205,222,0.14),transparent)]"
          />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-48 -left-32 -z-10 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(closest-side,rgba(70,163,225,0.08),transparent)]"
          />

          <div className="grid gap-6 px-6 py-8 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-10 lg:py-9">
            <div className="lg:col-span-7">
              <p className="flex items-center gap-3 text-[13px] font-medium text-[var(--text-body)]">
                <span aria-hidden="true" className="h-px w-10 bg-[#2CCDDE]" />
                {promiseCopy.eyebrow}
              </p>
              <h3
                id="about-commitments-title"
                className="mt-4 font-display text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.035em] text-[var(--text-primary)] sm:text-[2.125rem] lg:text-[2.375rem]"
              >
                {promiseCopy.heading}{' '}
                <span className="text-[var(--ink-soft)]">{promiseCopy.heading_soft}</span>
              </h3>
            </div>
            <p className="max-w-sm text-pretty text-[15px] leading-relaxed text-[var(--text-body)] lg:col-span-3">
              {promiseCopy.intro}
            </p>
            <div className="lg:col-span-2 lg:justify-self-end">
              <PromiseSeal text={promiseCopy.seal_text} />
            </div>
          </div>

          {/* Column headings, shown once the rows lay out as a table. */}
          <div
            aria-hidden="true"
            className="hidden grid-cols-12 gap-6 border-t border-[var(--border-default)] px-10 py-3 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--text-nav)] lg:grid"
          >
            <span className="col-span-4">Commitment</span>
            <span className="col-span-3">Standard</span>
            <span className="col-span-5">What it means for you</span>
          </div>

          <ol className="border-t border-[var(--border-default)]">
            {promise.lists.rows.map((v, i) => (
              <li
                key={v.title}
                className="reveal group relative grid gap-4 border-b border-[var(--border-default)] px-6 py-6 transition-colors duration-300 hover:bg-[var(--promise-row-hover)] sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-6 lg:px-10 lg:py-5"
              >
                {/* Lights the row's edge on hover. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 bg-[#2CCDDE] transition-transform duration-300 group-hover:scale-y-100 motion-reduce:transition-none"
                />

                <div className="flex items-center gap-4 lg:col-span-4">
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[var(--border-default)] bg-[var(--promise-tile)] text-[var(--promise-accent)] transition-colors duration-300 group-hover:border-[#2CCDDE] group-hover:bg-[#2CCDDE] group-hover:text-[#04121A]"
                  >
                    {promiseIcons[i % promiseIcons.length]}
                  </span>
                  <div>
                    <span className="block text-[12px] font-medium tabular-nums text-[var(--text-nav)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h4 className="font-display text-[1.0625rem] font-semibold tracking-[-0.015em] text-[var(--text-primary)]">
                      {v.title}
                    </h4>
                  </div>
                </div>

                <p className="flex flex-wrap items-baseline gap-x-2.5 lg:col-span-3">
                  <span className="font-display text-[1.875rem] font-semibold leading-none tracking-[-0.04em] tabular-nums text-[var(--text-primary)] transition-colors duration-300 group-hover:text-[var(--promise-accent)] sm:text-[2rem]">
                    {v.value}
                  </span>
                  <span className="text-[14px] font-medium text-[var(--promise-accent)]">{v.unit}</span>
                </p>

                <p className="max-w-xl text-[14px] leading-relaxed text-[var(--text-body)] lg:col-span-5">{v.description}</p>
              </li>
            ))}
          </ol>

          <Link
            href={promiseCopy.link_href}
            className="group flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10"
          >
            <span className="text-[15px] text-[var(--text-body)]">
              {promiseCopy.footer_text}{' '}
              <span className="font-medium text-[var(--text-primary)]">{promiseCopy.footer_strong}</span>
            </span>
            <span className="inline-flex items-center gap-4 text-[15px] font-semibold text-[var(--text-primary)]">
              {promiseCopy.link_label}
              <ArrowButton />
            </span>
          </Link>
        </section>

      </div>
    </section>
  )
}
