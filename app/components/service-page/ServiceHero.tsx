import type { ReactNode } from 'react'
import Image from 'next/image'
import { unoptimizedSrc } from '../../lib/image-src'
import { Button, delay } from '../home/ui'
import { PhoneIcon } from '../InlineIcons'

type Link = { label: string; href: string }

/**
 * The banner of the IT AMC and service pages: the badge, the H1 in two
 * tones, the paragraph, the buttons and phone number, and the figures under
 * them on the left; on the right the hero picture (Heroes screen) when one
 * is set, with the card beside it (plans, or what's included) over its lower
 * edge, or the card alone. The banner's background picture (Heroes screen),
 * when set, lies behind it all under a light wash, so the words stay
 * readable; without one the banner keeps its plain backdrop.
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
  background = '',
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
  /** The banner's background picture: decorative, behind the words. */
  background?: string
  card: ReactNode
}) {
  return (
    <section aria-labelledby="service-title" className="relative isolate">
      {background && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
          <Image
            src={background}
            alt=""
            fill
            sizes="100vw"
            quality={50}
            preload
            fetchPriority="high"
            unoptimized={unoptimizedSrc(background)}
            className="object-cover"
          />
          {/* A light wash, strongest behind the words (top on phones, left on wide screens). */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(243,247,252,0.9)_0%,rgba(243,247,252,0.94)_60%,var(--hp-bg)_100%)] lg:bg-[linear-gradient(90deg,rgba(243,247,252,0.96)_0%,rgba(243,247,252,0.9)_50%,rgba(243,247,252,0.6)_100%)]" />
        </div>
      )}
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
                {/* Above the fold: loaded first, at the size each screen needs. */}
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  quality={70}
                  preload
                  fetchPriority="high"
                  unoptimized={unoptimizedSrc(image.src)}
                  className="object-cover"
                />
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
