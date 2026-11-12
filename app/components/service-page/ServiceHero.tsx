import type { ReactNode } from 'react'
import { Button, delay } from '../home/ui'
import { PhoneIcon } from '../InlineIcons'

type Link = { label: string; href: string }

/**
 * The banner of the IT AMC and service pages: the badge, the H1 in two
 * tones, the paragraph, the buttons and phone number, and the figures under
 * them on the left; on the right the hero picture (Heroes screen) when one
 * is set, with the card beside it (plans, or what's included) over its lower
 * edge, or the card alone.
 */
export default function ServiceHero({
  label,
  heading,
  highlight,
  description,
  primary,
  secondary,
  phone,
  stats,
  image,
  card,
}: {
  label: string
  heading: string
  highlight: string
  description: string
  primary: Link
  secondary: Link
  phone: string
  stats: Record<string, string>[]
  image: { src: string; alt: string } | null
  card: ReactNode
}) {
  return (
    <section aria-labelledby="service-title" className="relative isolate">
      <div aria-hidden="true" className="ab-hero-bg pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem]" />
      <div className="page-container grid gap-10 pb-16 pt-10 sm:pt-14 lg:grid-cols-12 lg:items-center lg:gap-14 lg:pb-20">
        <div className="lg:col-span-7">
          <p className="hp-badge hp-enter-fade" style={delay(0)}>
            <span aria-hidden="true" className="hp-dot" />
            {label}
          </p>
          <h1 id="service-title" className="hp-h1 mt-6 hp-enter" style={delay(80)}>
            {heading}
            {highlight && ' '}
            {highlight && <span className="hp-h1-accent block">{highlight}</span>}
          </h1>
          <p className="hp-lead mt-6 max-w-xl hp-enter" style={delay(200)}>
            {description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <span className="block hp-enter sm:inline-block" style={delay(300)}>
              <Button href={primary.href} className="w-full sm:w-auto">
                {primary.label}
              </Button>
            </span>
            {secondary.label && (
              <span className="block hp-enter sm:inline-block" style={delay(380)}>
                <Button href={secondary.href} variant="ghost" className="w-full sm:w-auto">
                  {secondary.label}
                </Button>
              </span>
            )}
            <a
              href={`tel:${phone.replace(/[^\d+]/g, '')}`}
              className="inline-flex items-center gap-2 px-1 text-[15px] font-semibold text-[var(--hp-ink)] transition-colors hover:text-[var(--hp-accent)] hp-enter"
              style={delay(440)}
            >
              <PhoneIcon className="h-4 w-4 text-[var(--hp-accent)]" />
              {phone}
            </a>
          </div>
          {stats.length > 0 && (
            <dl className="mt-10 grid max-w-xl grid-cols-3 border-t border-[var(--hp-line)] pt-6 hp-enter" style={delay(480)}>
              {stats.map((row) => (
                <div key={row.title + row.description} className="flex flex-col border-l border-[var(--hp-line)] px-3 first:border-l-0 first:pl-0 sm:px-5">
                  <dt className="order-2 mt-1.5 text-[12.5px] leading-snug text-[var(--hp-body)] sm:text-[13.5px]">{row.description}</dt>
                  <dd className="order-1 font-display text-[1.625rem] font-semibold leading-none tracking-[-0.03em] text-[var(--hp-ink)] sm:text-[2.125rem]">{row.title}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {(image || card) && (
          <div className="lg:col-span-5">
            {image && (
              <figure className="hp-frame relative aspect-[4/3] overflow-hidden rounded-[1.75rem] hp-enter-image" style={delay(220)}>
                {/* eslint-disable-next-line @next/next/no-img-element -- an uploaded picture of any origin, above the fold */}
                <img src={image.src} alt={image.alt} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
              </figure>
            )}
            {card && (
              <div className={`relative hp-enter ${image ? 'z-10 mx-4 -mt-24 sm:mx-8' : ''}`} style={delay(300)}>
                {card}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
