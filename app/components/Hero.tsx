import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRightIcon, PhoneIcon, PinIcon, WhatsAppIcon } from './InlineIcons'
import { figuresFrom, type SiteFigures } from '../lib/site-figures'

const DEFAULT_PHONE = '+971 54 328 2042'

// Each promise here is one the site already makes in its FAQ, About and
// contact copy. The hero gathers them where a visitor deciding whether to
// call will see them first.
const responseTimes = [
  { task: 'Most issues fixed remotely', detail: 'Counted from when you report it', value: '30', unit: 'min' },
  { task: 'Support on site or remote', detail: 'Anywhere in Dubai, Sharjah or Abu Dhabi', value: '2', unit: 'hrs' },
  { task: 'A tailored quote', detail: 'For a new project or an AMC plan', value: '24', unit: 'hrs' },
]

/**
 * Everything the admin can set on the home page's top banner. Blank fields
 * show the wording below, so the hero reads well before anything is saved.
 */
type HeroContent = {
  badge?: string
  heading?: string
  highlight?: string
  description?: string
  primaryButtonLabel?: string
  primaryButtonLink?: string
  secondaryButtonLabel?: string
  secondaryButtonLink?: string
  trustLine?: string
  backgroundImage?: string
  image?: string
  imageAlt?: string
  stripText?: string
  stripLinkLabel?: string
  stripLink?: string
}

/**
 * The H1 is set in two tones: the heading in white and an optional highlight
 * line in light cyan. Without a highlight, a heading from the admin panel can
 * still split at its first line break. The built-in heading splits after its
 * first sentence.
 */
function splitHeading(heading?: string, highlight?: string): [string, string | undefined] {
  if (!heading) return ['We handle your IT.', highlight || 'You focus on your business.']
  if (highlight) return [heading.trim(), highlight.trim()]
  const [lead, ...rest] = heading.split(/\r?\n/)
  return [lead.trim(), rest.join(' ').trim() || undefined]
}

export default function Hero({
  content = {},
  phone = DEFAULT_PHONE,
  whatsappUrl,
  figures = figuresFrom(null),
}: {
  content?: HeroContent
  phone?: string
  whatsappUrl?: string
  /** Clients, rating and founding year, for the built-in trust line. */
  figures?: SiteFigures
}) {
  const [lead, rest] = splitHeading(content.heading, content.highlight)
  const whatsapp = whatsappUrl || `https://wa.me/${phone.replace(/\D/g, '')}`
  const stripLink = content.stripLink || '#how-we-work'

  return (
    <section className="home-hero pt-4 lg:pt-5">
      <div className="page-container">
        {/* A dark panel in either site theme. It fills the same container as
            the header bar and pads by the same --panel-px, so its edges are the
            bar's edges and the heading starts under the logo. */}
        <div className="relative isolate overflow-hidden rounded-3xl bg-[#0f1b27] text-white ring-1 ring-white/[0.06]">
          {content.backgroundImage ? (
            <>
              <Image
                src={content.backgroundImage}
                alt=""
                fill
                preload
                fetchPriority="high"
                sizes="(min-width: 1280px) 1232px, 100vw"
                className="-z-20 object-cover object-center"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(15,27,39,0.96)_0%,rgba(15,27,39,0.86)_50%,rgba(15,27,39,0.7)_100%)]"
              />
            </>
          ) : (
            // Light only: a cyan glow off the top right and a fine grid that
            // fades out towards the text. Plain CSS, nothing to download.
            // Every layer is pinned to the top at a fixed size: when the web
            // fonts swap in and the panel grows a little, nothing moves.
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute -right-40 -top-48 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(closest-side,rgba(44,205,222,0.22),transparent)]" />
              <div className="absolute left-1/3 top-[22rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgba(70,163,225,0.12),transparent)]" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_80%_at_85%_30%,#000,transparent_75%)]" />
            </div>
          )}

          <div className="panel-px grid gap-12 pb-10 pt-10 sm:pb-12 sm:pt-12 lg:grid-cols-12 lg:gap-10 lg:pb-14 lg:pt-16">
            <div className="flex flex-col justify-center lg:col-span-7 lg:max-w-[42rem]">
              <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#6fd0da]">
                {content.badge || 'IT Support & AMC · Dubai, UAE'}
              </p>

              <h1 className="mt-5 text-balance font-display text-[2.375rem] font-semibold leading-[1.05] tracking-[-0.04em] text-white sm:text-[3.25rem] lg:text-[3.5rem] xl:text-[4rem]">
                {lead}
                {rest && ' '}
                {rest && <span className="block text-[#7fe3ec]">{rest}</span>}
              </h1>

              <p className="mt-6 max-w-[36rem] text-[16.5px] leading-relaxed text-[#aab7c6] sm:text-lg">
                {content.description || 'From network infrastructure to cloud services and digital marketing, Byteflow delivers complete IT solutions for businesses across Dubai and the UAE. One call, one team, all your IT handled.'}
              </p>

              <div className="mt-9 grid gap-3 sm:flex sm:flex-wrap sm:items-center">
                <Link
                  href={content.primaryButtonLink || '/contact-us'}
                  className="group inline-flex h-[52px] items-center justify-between gap-4 rounded-full bg-[#2CCDDE] pl-6 pr-1.5 text-[15px] font-bold text-[#04121A] transition-colors duration-200 hover:bg-[#5BDCE9] sm:justify-center"
                >
                  {content.primaryButtonLabel || 'Get a Free Quote'}
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#04121A] text-[#2CCDDE]">
                    <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
                  </span>
                </Link>
                <Link
                  href={content.secondaryButtonLink || '/it-amc-services-dubai'}
                  className="group inline-flex h-[52px] items-center justify-center gap-2 rounded-full border border-white/20 px-6 text-[15px] font-semibold text-white transition-colors duration-200 hover:border-white/50 hover:bg-white/[0.04]"
                >
                  {content.secondaryButtonLabel || 'Explore services'}
                  <ArrowUpRightIcon className="h-4 w-4 text-[#2CCDDE] transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
                </Link>
              </div>

              <p className="mt-7 flex items-start gap-2 text-[13.5px] leading-snug text-[#94a3b8]">
                <PinIcon className="mt-px h-4 w-4 shrink-0 text-[#2CCDDE]" />
                {content.trustLine || `Dubai-based IT partner since ${figures.founded} · ${figures.rating}★ Google rating`}
              </p>
            </div>

            <div className="relative lg:col-span-5 lg:self-center xl:col-span-4 xl:col-start-9">
              {content.image ? (
                // Uploaded in the admin. It loads first: when there is one,
                // it is the largest thing in view.
                <Image
                  src={content.image}
                  alt={content.imageAlt || ''}
                  width={1200}
                  height={1000}
                  preload
                  fetchPriority="high"
                  sizes="(min-width: 1024px) 420px, 90vw"
                  className="pointer-events-none absolute -inset-x-6 -top-10 -z-10 h-[calc(100%+5rem)] w-[calc(100%+3rem)] max-w-none rounded-3xl object-cover opacity-70"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-16 left-1/2 -z-10 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(44,205,222,0.18),transparent)]"
                />
              )}

              <aside
                aria-labelledby="hero-response-title"
                className="rounded-2xl border border-white/10 bg-white/[0.05] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.7)] backdrop-blur-md"
              >
                <div className="px-6 pt-6 sm:px-7 sm:pt-7">
                  <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#94a3b8]">Response times</p>
                  <p id="hero-response-title" className="mt-2 font-display text-[1.375rem] font-semibold leading-snug tracking-[-0.02em] text-white">
                    When something breaks
                  </p>
                </div>

                <ul className="mt-6 border-t border-white/10">
                  {responseTimes.map((row) => (
                    <li key={row.task} className="flex items-center justify-between gap-6 border-b border-white/10 px-6 py-5 sm:px-7">
                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold text-white">{row.task}</p>
                        <p className="mt-1 text-[13px] leading-snug text-[#aab7c6]">{row.detail}</p>
                      </div>
                      <p className="shrink-0 text-right leading-none">
                        <span className="block text-[11px] font-medium uppercase tracking-[0.08em] text-[#94a3b8]">Within</span>
                        <span className="mt-1.5 inline-block font-display text-[1.75rem] font-semibold tracking-[-0.03em] tabular-nums text-[#2CCDDE]">
                          {row.value}
                        </span>
                        <span className="ml-1 text-[14px] font-medium text-[#cbd5e1]">{row.unit}</span>
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="flex gap-3 p-6 sm:p-7">
                  <a
                    href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/20 px-4 text-[14px] font-semibold tabular-nums text-white transition-colors duration-200 hover:bg-white/[0.07]"
                  >
                    <PhoneIcon className="h-4 w-4 text-[#2CCDDE]" />
                    Call {phone}
                  </a>
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat on WhatsApp"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 text-[#25D366] transition-colors duration-200 hover:bg-white/[0.07]"
                  >
                    <WhatsAppIcon className="h-[18px] w-[18px]" />
                  </a>
                </div>
              </aside>
            </div>
          </div>

          <div className="panel-px flex flex-col gap-3 border-t border-white/10 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.24em] text-[#7b8a9c]">
              {content.stripText || 'Support / Secure / Cloud / Build'}
            </p>
            <a
              href={stripLink}
              className="group inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#cbd5e1] transition-colors hover:text-[#2CCDDE]"
            >
              {content.stripLinkLabel || 'See how we work'}
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-y-0.5">↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
