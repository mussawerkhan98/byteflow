import Image from 'next/image'
import { unoptimizedSrc } from '../../lib/image-src'
import { PhoneIcon } from '../InlineIcons'
import { Button, Eyebrow } from '../home/ui'

export type Founder = {
  eyebrow: string
  heading: string
  /** Paragraphs, already split. */
  story: string[]
  name: string
  role: string
  company: string
  /** Empty: no photo is shown. */
  imageUrl: string
  imageAlt: string
  linkedinUrl: string
  phoneLabel: string
  /** A direct line only; empty when it would repeat the company number. */
  phoneUrl: string
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

/**
 * The founder, from the admin's "About Us — Founder" screen, as a signed
 * letter: the heading on a soft blue side panel (under the founder's photo,
 * once one is uploaded there), the story on the white page beside it,
 * opening large, and one signature: name or role, company, and the LinkedIn
 * and direct-line links.
 */
export default function AboutFounder({ founder }: { founder: Founder }) {
  const [first, ...more] = founder.story

  return (
    <section aria-labelledby="founder-title" className="hp-section">
      <div className="page-container">
        {/* Phones: heading, story, signature. Wide screens: the heading and
            the signature share the soft panel on the left, the story fills
            the right. */}
        <article data-reveal className="ab-letter grid overflow-hidden rounded-[2rem] lg:grid-cols-12 lg:grid-rows-[1fr_auto]">
          <header className="ab-letter-side flex flex-col gap-8 p-7 sm:p-10 lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:p-12 lg:pb-8">
            {founder.imageUrl && (
              <figure className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] border border-white/80 shadow-[var(--hp-shadow)] lg:aspect-[4/5]">
                <Image src={founder.imageUrl} unoptimized={unoptimizedSrc(founder.imageUrl)} alt={founder.imageAlt} fill sizes="(min-width: 1024px) 34vw, 100vw" className="object-cover object-top" />
              </figure>
            )}
            <div>
              <Eyebrow>{founder.eyebrow}</Eyebrow>
              <h2 id="founder-title" className="hp-h3-lg mt-5">
                {founder.heading}
              </h2>
            </div>
          </header>

          <div className="relative p-7 sm:p-10 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:p-14">
            <span aria-hidden="true" className="ab-quote-mark pointer-events-none absolute right-6 top-8 select-none sm:right-10 lg:right-14 lg:top-12">
              &ldquo;
            </span>
            {first && <p className="max-w-2xl pr-12 font-display text-[clamp(1.1875rem,1rem+0.6vw,1.5rem)] font-medium leading-[1.5] tracking-[-0.015em] text-[var(--hp-ink)]">{first}</p>}
            {more.map((paragraph) => (
              <p key={paragraph} className="mt-5 max-w-2xl text-[16.5px] leading-relaxed text-[var(--hp-body)]">
                {paragraph}
              </p>
            ))}
          </div>

          <footer className="bg-[var(--hp-soft)] px-7 pb-7 sm:px-10 sm:pb-10 lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:px-12 lg:pb-12">
            <div className="flex flex-wrap items-center justify-between gap-6 border-t border-[var(--hp-line-strong)] pt-7 lg:flex-col lg:items-start">
              <p className="flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-10 shrink-0 bg-[var(--hp-accent)]" />
                <span>
                  <span className="ab-signature block text-[17px]">{founder.name || founder.role}</span>
                  <span className="mt-0.5 block text-[14.5px] text-[var(--hp-body)]">
                    {founder.name && `${founder.role}, `}
                    {founder.company}
                  </span>
                </span>
              </p>

              {(founder.linkedinUrl || founder.phoneUrl) && (
                <div className="flex flex-wrap items-center gap-3">
                  {founder.linkedinUrl && (
                    <Button href={founder.linkedinUrl} variant="ghost">
                      <span className="inline-flex items-center gap-2">
                        <LinkedInIcon className="h-4 w-4 text-[#0a66c2]" />
                        LinkedIn
                      </span>
                    </Button>
                  )}
                  {founder.phoneUrl && (
                    <a href={founder.phoneUrl} className="inline-flex items-center gap-2.5 text-[15px] font-semibold tabular-nums text-[var(--hp-ink)] transition-colors hover:text-[var(--hp-accent)]">
                      <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full bg-[var(--hp-soft)] text-[var(--hp-accent)]">
                        <PhoneIcon className="h-4 w-4" />
                      </span>
                      {founder.phoneLabel}
                    </a>
                  )}
                </div>
              )}
            </div>
          </footer>
        </article>
      </div>
    </section>
  )
}
