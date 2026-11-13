import { PhoneIcon, PinIcon, WhatsAppIcon } from '../InlineIcons'
import { figuresFrom, type SiteFigures } from '../../lib/site-figures'
import { homePhotos } from '../../lib/home-photos'
import { Button, Photo, delay } from './ui'

const DEFAULT_PHONE = '+971 54 328 2042'

// Each promise here is one the site already makes in its FAQ, About and
// contact copy, gathered where a visitor deciding whether to call sees them.
const responseTimes = [
  { task: 'Most issues fixed remotely', detail: 'Counted from when you report it', value: '30', unit: 'min' },
  { task: 'Support on site or remote', detail: 'Anywhere in Dubai, Sharjah or Abu Dhabi', value: '2', unit: 'hrs' },
  { task: 'A tailored quote', detail: 'For a new project or an AMC plan', value: '24', unit: 'hrs' },
]

/** What the admin can set on the home page's top banner; blank fields use the wording below. */
export type HeroContent = {
  badge?: string
  heading?: string
  highlight?: string
  description?: string
  primaryButtonLabel?: string
  primaryButtonLink?: string
  secondaryButtonLabel?: string
  secondaryButtonLink?: string
  trustLine?: string
  stripText?: string
  stripLinkLabel?: string
  stripLink?: string
  /** The picture on the right, uploaded in the admin; blank keeps the built-in photograph. */
  image?: string
  imageAlt?: string
}

/** The H1 in two tones: the heading, then the highlight (or the heading's second line). */
function splitHeading(heading?: string, highlight?: string): [string, string | undefined] {
  if (!heading) return ['We handle your IT.', highlight || 'You focus on your business.']
  if (highlight) return [heading.trim(), highlight.trim()]
  const [lead, ...rest] = heading.split(/\r?\n/)
  return [lead.trim(), rest.join(' ').trim() || undefined]
}

/** A small icon for each service area in the hero's foot, picked from its name. */
const stripPaths = {
  support: 'M3 12a9 9 0 0118 0v4.5a2.25 2.25 0 01-2.25 2.25H17.5V12.75H21M3 12v4.5a2.25 2.25 0 002.25 2.25H6.5v-6H3',
  secure: 'M12 3l7.5 3v5.25c0 4.5-3.15 8.25-7.5 9.75-4.35-1.5-7.5-5.25-7.5-9.75V6L12 3zm-3 9l2 2 4-4.5',
  cloud: 'M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.33-7.26 3 3 0 00-3.76-3.85 5.25 5.25 0 00-10.23 2.33A4.5 4.5 0 002.25 15z',
  build: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5',
}

function StripIcon({ name, index }: { name: string; index: number }) {
  const key = name.toLowerCase()
  const kinds = Object.keys(stripPaths) as (keyof typeof stripPaths)[]
  const kind = kinds.find((k) => key.includes(k)) ?? kinds[index % kinds.length]
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d={stripPaths[kind]} />
    </svg>
  )
}

/**
 * The home hero: one white panel with the words on the left and, from lg, a
 * photograph filling the right side edge to edge with a diagonal left edge
 * (hp-hero-cut), the Google rating on it; the service areas along the
 * panel's foot; then the response times as a horizontal trust band. Everything above
 * the fold animates in with CSS (no JavaScript), and the photo is the page's
 * first image, so it is never lazy-loaded.
 */
export default function HomeHero({
  content = {},
  phone = DEFAULT_PHONE,
  whatsappUrl,
  figures = figuresFrom(null),
}: {
  content?: HeroContent
  phone?: string
  whatsappUrl?: string
  figures?: SiteFigures
}) {
  const [lead, rest] = splitHeading(content.heading, content.highlight)
  // The admin's picture, described by its alt text (else by the heading).
  const heroPhoto = content.image
    ? { src: content.image, alt: content.imageAlt || [lead, rest].filter(Boolean).join(' '), brief: '' }
    : homePhotos.hero
  const whatsapp = whatsappUrl || `https://wa.me/${phone.replace(/\D/g, '')}`
  const strip = (content.stripText || 'Support / Secure / Cloud / Build')
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean)

  return (
    <section aria-labelledby="hero-title" className="hp-hero relative isolate overflow-hidden">
      <div className="page-container pt-5 sm:pt-6 lg:pt-8">
        {/* One white panel: the words on the left, the photograph framed on
            the right, the service areas along the foot. */}
        <div className="hp-hero-panel relative overflow-hidden rounded-[1rem] hp-enter-fade" style={delay(0)}>
          <div className="relative">
            <div className="relative z-[1] flex flex-col justify-center px-6 pb-8 pt-7 sm:px-10 sm:pb-9 sm:pt-9 lg:w-[58%] lg:py-10 lg:pl-12 lg:pr-6 xl:py-11 xl:pl-14 xl:pr-8">
              <p className="hp-badge self-start hp-enter-fade" style={delay(60)}>
                <span aria-hidden="true" className="hp-dot" />
                {content.badge || 'IT Support & AMC · Dubai, UAE'}
              </p>

              <h1 id="hero-title" className="hp-h1 hp-h1-hero mt-5 hp-enter" style={delay(120)}>
                {lead}
                {rest && ' '}
                {rest && <span className="hp-h1-accent block">{rest}</span>}
              </h1>

              <p className="hp-lead mt-4 max-w-[42rem] hp-enter" style={delay(240)}>
                {content.description ||
                  'From network infrastructure to cloud services and digital marketing, Byteflow delivers complete IT solutions for businesses across Dubai and the UAE. One call, one team, all your IT handled.'}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <span className="block hp-enter sm:inline-block" style={delay(340)}>
                  <Button href={content.primaryButtonLink || '/contact-us'} className="w-full sm:w-auto">
                    {content.primaryButtonLabel || 'Get a Free Quote'}
                  </Button>
                </span>
                <span className="block hp-enter sm:inline-block" style={delay(450)}>
                  <Button href={content.secondaryButtonLink || '/it-amc-services-dubai'} variant="ghost" className="w-full sm:w-auto">
                    {content.secondaryButtonLabel || 'Explore services'}
                  </Button>
                </span>
              </div>

              <p className="mt-7 flex items-start gap-2.5 border-t border-[var(--hp-line)] pt-5 lg:mr-[10%] text-[14px] leading-snug text-[var(--hp-body)] hp-enter-fade" style={delay(560)}>
                <PinIcon className="mt-px h-[18px] w-[18px] shrink-0 text-[var(--hp-accent)]" />
                {content.trustLine || `Dubai-based IT partner since ${figures.founded} · ${figures.rating}★ Google rating`}
              </p>
            </div>

            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
              <div className="hp-enter-image relative h-full" style={delay(160)}>
                <div className="hp-hero-cut relative aspect-[16/10] h-full overflow-hidden bg-[var(--hp-soft)] lg:aspect-auto">
                  <Photo slot={heroPhoto} sizes="(min-width: 1024px) 48vw, 100vw" priority />
                </div>

                {/* The Google rating, on a small card in the photo's widest corner. */}
                <div className="hp-glass absolute bottom-3 right-3 flex items-center gap-3 rounded-md px-3.5 py-2.5 sm:bottom-4 sm:right-4 lg:bottom-5 lg:right-5">
                  {/* eslint-disable-next-line @next/next/no-img-element -- the Google mark, a small static SVG */}
                  <img src="/google.svg" alt="" width={28} height={28} className="h-7 w-7 shrink-0" />
                  <div>
                    <p className="flex items-center gap-2 leading-none">
                      <span className="font-display text-[1.25rem] font-semibold tabular-nums text-[var(--hp-ink)]">{figures.rating}</span>
                      <span aria-hidden="true" className="text-[13px] tracking-[0.08em] text-[#F5B301]">★★★★★</span>
                    </p>
                    <p className="mt-1 text-[12px] font-medium text-[var(--hp-muted)]">Google rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* The service areas along the panel's foot. */}
          <div className="flex flex-col gap-4 border-t border-[var(--hp-line)] px-6 py-4 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:pl-12 lg:pr-8 xl:pl-14">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:flex sm:flex-wrap sm:items-center sm:gap-0" aria-label="What we do">
              {strip.map((part, i) => (
                <li key={part} className="flex items-center gap-2.5 text-[14px] font-semibold text-[var(--hp-ink)] sm:border-l sm:border-[var(--hp-line)] sm:px-6 sm:first:border-l-0 sm:first:pl-0">
                  <span aria-hidden="true" className="hp-icon-tile h-7 w-7 rounded-md">
                    <StripIcon name={part} index={i} />
                  </span>
                  {part}
                </li>
              ))}
            </ul>
            <a href={content.stripLink || '#how-we-work'} className="hp-textlink group self-start text-[14px] lg:self-auto">
              {content.stripLinkLabel || 'See how we work'}
              <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-y-0.5">↓</span>
            </a>
          </div>
        </div>
      </div>

      {/* Trust band: the response times, large, divided by hairlines. */}
      <div className="page-container pb-14 pt-4 sm:pb-16 lg:pb-20">
        <div
          aria-labelledby="hero-response-title"
          role="region"
          className="hp-band grid overflow-hidden rounded-[1rem] sm:grid-cols-2 lg:grid-cols-[1.15fr_repeat(3,1fr)] hp-enter"
          style={delay(600)}
        >
          <div className="flex flex-col justify-between gap-5 p-5 sm:p-6">
            <div>
              <p className="hp-eyebrow">Response times</p>
              <p id="hero-response-title" className="mt-2 font-display text-[1.375rem] font-semibold leading-snug tracking-[-0.02em] text-[var(--hp-ink)]">
                When something breaks
              </p>
            </div>
            <div className="flex gap-2.5">
              <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="hp-chip-btn flex-1 tabular-nums">
                <PhoneIcon className="h-4 w-4 text-[var(--hp-accent)]" />
                Call {phone}
              </a>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="hp-chip-btn hp-chip-icon shrink-0 text-[#1fa855]">
                <WhatsAppIcon className="h-[18px] w-[18px]" />
              </a>
            </div>
          </div>

          {responseTimes.map((row) => (
            <div key={row.task} className="hp-band-cell p-5 sm:p-6">
              <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-[var(--hp-muted)]">Within</p>
              <p className="mt-2 flex items-baseline gap-1.5">
                <span className="hp-stat hp-stat-hero">{row.value}</span>
                <span className="text-[16px] font-semibold text-[var(--hp-accent)]">{row.unit}</span>
              </p>
              <p className="mt-3 text-[15.5px] font-semibold text-[var(--hp-ink)]">{row.task}</p>
              <p className="mt-1 text-[14px] leading-snug text-[var(--hp-body)]">{row.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
