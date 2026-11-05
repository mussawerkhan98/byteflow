/* eslint-disable @next/next/no-img-element -- logos are SVG or WebP at their own size; next/image would refuse the SVGs */
import type { ClientLogo, Stat } from '../lib/site-figures'
import CountUp from './CountUp'

/** Logos share one height; the width follows each file's own shape. */
const LOGO_HEIGHT = 32
const LOGO_MAX_WIDTH = 140
/** The box a logo gets when its file's size isn't recorded. */
const LOGO_FALLBACK_WIDTH = 120

export type SizedLogo = ClientLogo & { width: number; height: number }

/** A logo's width and height at the strip's logo height. */
export function logoBox(size: { width: number; height: number } | undefined) {
  if (!size) return { width: LOGO_FALLBACK_WIDTH, height: LOGO_HEIGHT }
  return {
    width: Math.min(LOGO_MAX_WIDTH, Math.round((LOGO_HEIGHT * size.width) / size.height)),
    height: LOGO_HEIGHT,
  }
}

/**
 * Dividers between stats. Three or fewer sit in one row at every width;
 * four go two by two on phones and one row from sm.
 */
function cellClass(index: number, count: number) {
  if (count <= 3) return ['py-5 sm:py-6', index > 0 ? 'border-l pl-3 sm:pl-6' : '', index < count - 1 ? 'pr-3 sm:pr-6' : ''].join(' ')
  return ['py-5 sm:py-6', index % 2 ? 'border-l pl-4' : 'pr-4', index >= 2 ? 'border-t sm:border-t-0' : '', index > 0 ? 'sm:border-l sm:px-6' : 'sm:pr-6'].join(
    ' ',
  )
}

const gridClass = (count: number) => (count <= 3 ? ['', 'grid-cols-1', 'grid-cols-2', 'grid-cols-3'][count] : 'grid-cols-2 sm:grid-cols-4')

function StatBody({ stat }: { stat: Stat }) {
  // The rating's star is drawn in amber beside the number it follows.
  const star = stat.figure === 'rating' && stat.value.endsWith('★')
  return (
    <>
      <p className="whitespace-nowrap font-display text-[1.625rem] font-semibold leading-none tracking-[-0.03em] text-[var(--text-primary)] sm:text-[2rem]">
        <CountUp value={star ? stat.value.slice(0, -1) : stat.value} />
        {star && <span className="ml-0.5 text-[0.8em] text-[#F5B400]">★</span>}
      </p>
      <p className="mt-2 text-[12px] leading-snug text-[var(--text-body)] sm:text-[13px]">
        {stat.text}
        {stat.href && (
          <span aria-hidden="true" className="ml-1 inline-block transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px">
            ↗
          </span>
        )}
      </p>
    </>
  )
}

function Logo({ logo, copy }: { logo: SizedLogo; copy: boolean }) {
  const image = (
    <img
      src={logo.image}
      alt={copy ? '' : logo.name}
      width={logo.width}
      height={logo.height}
      loading="lazy"
      decoding="async"
      className="h-8 w-auto max-w-[140px] object-contain opacity-60 grayscale transition duration-300 group-hover/logo:opacity-100 group-hover/logo:grayscale-0 group-focus-visible/logo:opacity-100 group-focus-visible/logo:grayscale-0"
    />
  )
  return (
    // The copy only exists to make the marquee loop; it is hidden from
    // assistive technology and keyboard focus, and from wide screens.
    <li aria-hidden={copy || undefined} data-copy={copy || undefined} className="trust-logo shrink-0 pr-10 lg:pr-0">
      {logo.href ? (
        <a
          href={logo.href}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={copy ? -1 : undefined}
          className="group/logo block rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0e7490]"
        >
          {image}
        </a>
      ) : (
        <span className="group/logo block">{image}</span>
      )}
    </li>
  )
}

/**
 * The strip under the home page banner: the site-wide numbers on the left,
 * client logos on the right. With no logos up, the logo side is left out and
 * a stand-in stat takes its place (Home page sections → Trust strip).
 *
 * Deliberately no heading: it is a band of proof, not a section of its own.
 * Every number is real text in the server's HTML; CountUp only animates it.
 */
export default function TrustStrip({ stats, logos, logosLabel }: { stats: Stat[]; logos: SizedLogo[]; logosLabel: string }) {
  if (!stats.length && !logos.length) return null
  return (
    // Inside the shared container, so its rules run edge to edge with the
    // hero panel above; the content is inset by the panel's own padding, so
    // the first number lines up with the hero heading and the header logo.
    // No background: just the two rules.
    <section aria-label="Byteflow at a glance" className="pt-9">
      <div className="page-container">
        <div className={`panel-px border-y border-[var(--border-default)] ${logos.length ? 'lg:grid lg:grid-cols-[45fr_55fr]' : ''}`}>
          {stats.length > 0 && (
            <ul className={`grid ${gridClass(stats.length)}`}>
              {stats.map((stat, i) => (
                <li key={stat.key} className={`border-[var(--border-default)] ${cellClass(i, stats.length)}`}>
                  {stat.href ? (
                    <a
                      href={stat.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group -m-1.5 block rounded-lg p-1.5 transition-colors hover:bg-[var(--overlay-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0e7490]"
                    >
                      <StatBody stat={stat} />
                      <span className="sr-only"> (our reviews on Google, opens in a new tab)</span>
                    </a>
                  ) : (
                    <StatBody stat={stat} />
                  )}
                </li>
              ))}
            </ul>
          )}

          {logos.length > 0 && (
            // The divider runs the strip's full height; the logos sit in its middle.
            <div className="min-w-0 border-t border-[var(--border-default)] py-5 lg:flex lg:flex-col lg:justify-center lg:border-l lg:border-t-0 lg:py-6 lg:pl-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-nav)]">{logosLabel}</p>
              <div className="trust-logos mt-4 overflow-hidden">
                <ul className="trust-marquee flex w-max items-center lg:w-full lg:justify-between lg:gap-6">
                  {logos.map((logo) => (
                    <Logo key={logo.key} logo={logo} copy={false} />
                  ))}
                  {logos.map((logo) => (
                    <Logo key={`${logo.key}-copy`} logo={logo} copy />
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
