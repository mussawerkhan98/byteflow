import Link from 'next/link'
import Image from 'next/image'
import { ArrowIcon, PhoneIcon, WhatsAppIcon } from './InlineIcons'

const DEFAULT_PHONE = '+971 54 328 2042'

// Each promise here is one the site already makes in its FAQ, About and
// contact copy. The hero gathers them where a visitor deciding whether to
// call will see them first.
const responseTimes = [
  { task: 'Most issues fixed remotely', detail: 'Counted from when you report it', value: '30', unit: 'min' },
  { task: 'Support on site or remote', detail: 'Anywhere in Dubai, Sharjah or Abu Dhabi', value: '2', unit: 'hrs' },
  { task: 'A tailored quote', detail: 'For a new project or an AMC plan', value: '24', unit: 'hrs' },
]

const facts = [
  { label: 'Clients', value: '574', note: 'Businesses across the UAE' },
  { label: 'Google rating', value: '4.9', note: 'From 500+ reviews', stars: true },
  { label: 'Established', value: '2017', note: 'Based in Dubai' },
  { label: 'Plans for', value: '1200+', note: 'Users, on one fixed monthly fee' },
]

// Two columns on small screens, four from lg. The outer cells sit flush with
// the content edges, under the logo and the Contact button. The hairlines
// between cells are borders, so the photo variant still shows through them.
const factCellClass = [
  'pr-4 lg:pr-8',
  'border-l pl-5 lg:px-8',
  'border-t pr-4 lg:border-l lg:border-t-0 lg:px-8',
  'border-l border-t pl-5 lg:border-t-0 lg:pl-8',
]

type HeroContent = { badge?: string; heading?: string; description?: string; primaryButtonLabel?: string; primaryButtonLink?: string; secondaryButtonLabel?: string; secondaryButtonLink?: string; backgroundImage?: string }

/**
 * The headline is set in two tones. The built-in one splits after its first
 * sentence; a heading from the admin panel splits at its first line break, and
 * stays one tone if it has none.
 */
function splitHeading(heading?: string): [string, string | undefined] {
  if (!heading) return ['We handle your IT.', 'You focus on your business.']
  const [lead, ...rest] = heading.split(/\r?\n/)
  return [lead.trim(), rest.join(' ').trim() || undefined]
}

function Stars() {
  return (
    <span aria-hidden="true" className="flex gap-0.5 text-[#F5B400]">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} className="h-3 w-3 sm:h-3.5 sm:w-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.25 4.1 1 5.85L10 14.9l-5.25 2.75 1-5.85L1.5 7.7l5.9-.9z" />
        </svg>
      ))}
    </span>
  )
}

/** A registration mark on the facts rule, at the content edges the header shares. */
function Crosshair({ side }: { side: 'left' | 'right' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 11 11"
      className={`pointer-events-none absolute top-0 hidden h-[11px] w-[11px] -translate-y-1/2 text-[var(--text-dim)] md:block ${
        side === 'left' ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'
      }`}
    >
      <path d="M5.5 0v11M0 5.5h11" stroke="currentColor" strokeWidth={1} />
    </svg>
  )
}

export default function Hero({
  content = {},
  phone = DEFAULT_PHONE,
  whatsappUrl,
}: {
  content?: HeroContent
  phone?: string
  whatsappUrl?: string
}) {
  const [lead, rest] = splitHeading(content.heading)
  const onImage = Boolean(content.backgroundImage)
  const whatsapp = whatsappUrl || `https://wa.me/${phone.replace(/\D/g, '')}`

  return (
    <section
      className={`home-hero relative isolate overflow-hidden border-b border-[var(--border-default)] ${onImage ? 'hero-on-image' : ''}`}
    >
      {content.backgroundImage && (
        <>
          <Image
            src={content.backgroundImage}
            alt=""
            fill
            preload
            sizes="100vw"
            className="-z-10 object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(4,13,18,0.94)_0%,rgba(4,13,18,0.82)_45%,rgba(4,13,18,0.6)_100%)]"
          />
        </>
      )}

      {/* Same container as the header: the text starts under the logo and
          the card ends under the Contact button. */}
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <div className="grid gap-14 py-14 sm:py-20 lg:grid-cols-12 lg:gap-10 lg:py-24 xl:py-28">
          <div className="flex flex-col justify-center lg:col-span-7">
            <p className="mb-8 flex items-center gap-3 text-[13px] font-medium text-[var(--text-body)]">
              <span aria-hidden="true" className="h-px w-10 bg-[#2CCDDE]" />
              {content.badge || 'Trusted IT partner since 2017'}
            </p>

            <h1 className="text-balance text-[2.625rem] font-semibold leading-[1.03] tracking-[-0.045em] text-[var(--text-primary)] sm:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem] 2xl:text-[5rem]">
              {lead}
              {rest && <span className="block text-[var(--ink-soft)]">{rest}</span>}
            </h1>

            <p className="mt-7 max-w-[36rem] text-[17px] leading-relaxed text-[var(--text-body)] sm:text-lg">
              {content.description || 'From network infrastructure to cloud services and digital marketing, Byteflow delivers complete IT solutions for businesses across Dubai and the UAE. One call, one team, all your IT handled.'}
            </p>

            <div className="mt-10 grid gap-3 sm:flex sm:flex-wrap sm:items-center">
              <Link
                href={content.primaryButtonLink || '/contact-us'}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#2CCDDE] pl-6 pr-5 text-[15px] font-semibold text-[#04121A] transition-colors duration-200 hover:bg-[#5BDCE9]"
              >
                {content.primaryButtonLabel || 'Get started today'}
                <ArrowIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={content.secondaryButtonLink || '/it-amc-services-dubai'}
                className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--border-strong)] px-6 text-[15px] font-semibold text-[var(--text-primary)] transition-colors duration-200 hover:border-[var(--text-primary)]"
              >
                {content.secondaryButtonLabel || 'Explore services'}
              </Link>
            </div>
          </div>

          <aside
            aria-labelledby="hero-response-title"
            className={`rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-(--shadow-card) lg:col-span-5 lg:self-center xl:col-span-4 xl:col-start-9 ${onImage ? 'backdrop-blur-md' : ''}`}
          >
            <div className="px-6 pt-6 sm:px-7 sm:pt-7">
              <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--text-nav)]">
                Response times
              </p>
              <p
                id="hero-response-title"
                className="mt-2 font-display text-[1.375rem] font-semibold leading-snug tracking-[-0.02em] text-[var(--text-primary)]"
              >
                When something breaks
              </p>
            </div>

            <ul className="mt-6 border-t border-[var(--border-default)]">
              {responseTimes.map((row) => (
                <li
                  key={row.task}
                  className="flex items-center justify-between gap-6 border-b border-[var(--border-default)] px-6 py-5 sm:px-7"
                >
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-[var(--text-primary)]">{row.task}</p>
                    <p className="mt-1 text-[13px] leading-snug text-[var(--text-body)]">{row.detail}</p>
                  </div>
                  <p className="shrink-0 text-right leading-none">
                    <span className="block text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--text-nav)]">
                      Within
                    </span>
                    <span className="mt-1.5 inline-block font-display text-[1.75rem] font-semibold tracking-[-0.03em] tabular-nums text-[var(--text-primary)]">
                      {row.value}
                    </span>
                    <span className="ml-1 text-[14px] font-medium text-[var(--text-body)]">{row.unit}</span>
                  </p>
                </li>
              ))}
            </ul>

            <div className="flex gap-3 p-6 sm:p-7">
              <a
                href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[var(--border-strong)] px-4 text-[14px] font-semibold tabular-nums text-[var(--text-primary)] transition-colors duration-200 hover:bg-[var(--overlay-hover)]"
              >
                <PhoneIcon className="h-4 w-4" />
                Call {phone}
              </a>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--border-strong)] text-[#25D366] transition-colors duration-200 hover:bg-[var(--overlay-hover)]"
              >
                <WhatsAppIcon className="h-[18px] w-[18px]" />
              </a>
            </div>
          </aside>
        </div>
      </div>

      {/* The rule runs edge to edge; the facts under it keep to the content
          edges, which the two marks pick out. */}
      <div className="border-t border-[var(--border-default)]">
        <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <Crosshair side="left" />
            <Crosshair side="right" />
            <dl className="grid grid-cols-2 lg:grid-cols-4">
              {facts.map((fact, i) => (
                <div
                  key={fact.label}
                  className={`border-[var(--border-default)] py-6 sm:py-8 ${factCellClass[i]}`}
                >
                  <dt className="text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--text-nav)]">
                    {fact.label}
                  </dt>
                  <dd className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                    <span className="whitespace-nowrap font-display text-[2rem] font-semibold leading-none tracking-[-0.03em] tabular-nums text-[var(--text-primary)] sm:text-[2.5rem]">
                      {fact.value}
                    </span>
                    {fact.stars && <Stars />}
                  </dd>
                  <dd className="mt-2 text-[13px] text-[var(--text-body)]">{fact.note}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
