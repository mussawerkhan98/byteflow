import Link from 'next/link'
import { getHomeBlock } from '../lib/home-blocks'
import { ArrowUpRightIcon } from './InlineIcons'

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

/** The grid's columns for however many commitments there are (up to six). */
const columns: Record<number, string> = {
  1: '',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
}

/**
 * The service promise ("Home page sections" → Service promise): a tinted
 * panel set out like a service-level agreement. Each commitment is a cell of
 * a spec sheet with its standard in large type, and the AMC link runs along
 * the bottom.
 */
export default async function ServicePromise() {
  const promise = await getHomeBlock('home_promise')
  const promiseCopy = promise.fields
  const rows = promise.lists.rows

  return (
    <div className="home-promise bg-[var(--bg-page)] py-14 lg:py-20">
      <div className="page-container">
        <section
          aria-labelledby="about-commitments-title"
          className="tint-panel relative isolate overflow-hidden rounded-[2rem] border border-[var(--border-default)] bg-[var(--bg-surface)]"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(closest-side,rgba(44,205,222,0.16),transparent)]" />
            <div className="absolute inset-0 bg-[linear-gradient(var(--border-default)_1px,transparent_1px),linear-gradient(90deg,var(--border-default)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(180deg,black,transparent_45%)]" />
          </div>

          <div className="grid gap-6 px-6 pb-8 pt-9 sm:px-9 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-11 lg:pt-11">
            <div className="lg:col-span-8">
              <p className="flex items-center gap-3 font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-[var(--promise-accent)]">
                <span aria-hidden="true" className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#2CCDDE] opacity-60 motion-reduce:animate-none" />
                  <span className="relative h-2 w-2 rounded-full bg-[#2CCDDE]" />
                </span>
                {promiseCopy.eyebrow}
              </p>
              <h2
                id="about-commitments-title"
                className="mt-4 text-balance font-display text-[2rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--text-primary)] sm:text-[2.5rem] lg:text-[3rem]"
              >
                {promiseCopy.heading} <span className="text-[var(--ink-soft)]">{promiseCopy.heading_soft}</span>
              </h2>
              {promiseCopy.intro && <p className="mt-4 max-w-xl text-pretty text-[15.5px] leading-relaxed text-[var(--text-body)]">{promiseCopy.intro}</p>}
            </div>
            <div className="hidden lg:col-span-4 lg:flex lg:justify-end">
              <PromiseSeal text={promiseCopy.seal_text} />
            </div>
          </div>

          {/* The commitments: one cell each, divided by hairlines like a spec
              sheet. On phones they are a row you swipe through. */}
          <ol
            className={`flex snap-x snap-mandatory gap-px overflow-x-auto border-y border-[var(--border-default)] bg-[var(--border-default)] [scrollbar-width:none] sm:grid sm:overflow-visible [&::-webkit-scrollbar]:hidden ${columns[Math.min(rows.length, 4)] ?? columns[4]} ${rows.length > 4 ? 'lg:grid-cols-3' : ''}`}
          >
            {rows.map((v, i) => (
              <li key={v.title} className="group relative flex w-[80%] shrink-0 snap-start flex-col bg-[var(--bg-surface)] px-6 py-7 transition-colors duration-300 hover:bg-[var(--promise-tile)] sm:w-auto sm:px-7 lg:py-8">
                {/* A cyan line runs along the top of the cell on hover. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-[linear-gradient(90deg,#2CCDDE,#46A3E1)] transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none"
                />

                <div className="flex items-center justify-between gap-3">
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[var(--border-default)] bg-[var(--promise-tile)] text-[var(--promise-accent)] transition-colors duration-300 group-hover:border-[#2CCDDE] group-hover:bg-[#2CCDDE] group-hover:text-[#04121A] [&_svg]:h-5 [&_svg]:w-5"
                  >
                    {promiseIcons[i % promiseIcons.length]}
                  </span>
                  <span className="flex items-center gap-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-[var(--text-nav)]">
                    SLA {String(i + 1).padStart(2, '0')}
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.18)]" />
                  </span>
                </div>

                <p className="mt-7 flex flex-wrap items-baseline gap-x-2">
                  <span className="font-display text-[3rem] font-semibold leading-none tracking-[-0.05em] tabular-nums text-[var(--text-primary)] transition-colors duration-300 group-hover:text-[var(--promise-accent)] sm:text-[3.25rem]">
                    {v.value}
                  </span>
                  <span className="text-[14px] font-semibold text-[var(--promise-accent)]">{v.unit}</span>
                </p>

                <h3 className="mt-5 font-display text-[1.125rem] font-semibold tracking-[-0.015em] text-[var(--text-primary)]">{v.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-body)]">{v.description}</p>
              </li>
            ))}
          </ol>

          <Link
            href={promiseCopy.link_href}
            className="group flex flex-col gap-4 bg-[#0f1b27] px-6 py-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-9 lg:px-11"
          >
            <span className="text-[15px] text-[#a9b6c4]">
              {promiseCopy.footer_text} <span className="font-semibold text-white">{promiseCopy.footer_strong}</span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-3 rounded-full bg-[#2CCDDE] py-1.5 pl-5 pr-1.5 text-[14.5px] font-semibold text-[#04121A] transition-transform duration-200 group-hover:-translate-y-0.5">
              {promiseCopy.link_label}
              <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full bg-[#04121A] text-[#2CCDDE] transition-transform duration-300 group-hover:rotate-45 motion-reduce:transition-none">
                <ArrowUpRightIcon className="h-3.5 w-3.5" />
              </span>
            </span>
          </Link>
        </section>
      </div>
    </div>
  )
}
