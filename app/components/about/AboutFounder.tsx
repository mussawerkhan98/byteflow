import Image from 'next/image'
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
  imageUrl: string
  imageAlt: string
  linkedinUrl: string
  phoneLabel: string
  phoneUrl: string
}

/** "Byteflow Information Technology" → "BI": the tile shown when there's no photo. */
const initials = (text: string) =>
  text
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]!.toUpperCase())
    .join('')

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

/**
 * The founder, from the admin's "About Us — Founder" screen, as a signed
 * letter: who they are on a soft blue side panel (their photo once one is
 * set, otherwise their initials), and the story on the white page beside it,
 * opening large and closing with their name and role.
 */
export default function AboutFounder({ founder }: { founder: Founder }) {
  const [first, ...more] = founder.story
  const who = founder.name || founder.role

  return (
    <section aria-labelledby="founder-title" className="hp-section">
      <div className="page-container">
        <article data-reveal className="ab-letter grid overflow-hidden rounded-[2rem] lg:grid-cols-12">
          <aside className="ab-letter-side order-2 flex flex-col gap-8 p-7 sm:p-10 lg:order-1 lg:col-span-4 lg:justify-between">
            {founder.imageUrl ? (
              <figure className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] border border-white/80 shadow-[var(--hp-shadow)] sm:aspect-[4/3] lg:aspect-[4/5]">
                <Image src={founder.imageUrl} alt={founder.imageAlt} fill sizes="(min-width: 1024px) 28vw, 100vw" className="object-cover object-top" />
              </figure>
            ) : (
              <span aria-hidden="true" className="grid h-24 w-24 place-items-center rounded-[1.5rem] border border-white bg-white font-display text-[2rem] font-semibold text-[var(--hp-accent)] shadow-[var(--hp-shadow)]">
                {initials(founder.name || founder.company)}
              </span>
            )}

            <div>
              <p className="font-display text-[1.375rem] font-semibold tracking-[-0.02em] text-[var(--hp-ink)]">{who}</p>
              {founder.name && <p className="mt-1 text-[15px] text-[var(--hp-body)]">{founder.role}</p>}
              <p className="mt-1 text-[15px] font-medium text-[var(--hp-accent)]">{founder.company}</p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {founder.linkedinUrl && (
                  <Button href={founder.linkedinUrl} variant="ghost" className="!bg-white">
                    <span className="inline-flex items-center gap-2">
                      <LinkedInIcon className="h-4 w-4 text-[#0a66c2]" />
                      LinkedIn
                    </span>
                  </Button>
                )}
                {founder.phoneUrl && (
                  <a href={founder.phoneUrl} className="inline-flex items-center gap-2.5 text-[15px] font-semibold tabular-nums text-[var(--hp-ink)] transition-colors hover:text-[var(--hp-accent)]">
                    <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full bg-white text-[var(--hp-accent)] shadow-[var(--hp-shadow-sm)]">
                      <PhoneIcon className="h-4 w-4" />
                    </span>
                    {founder.phoneLabel}
                  </a>
                )}
              </div>
            </div>
          </aside>

          <div className="relative order-1 p-7 sm:p-10 lg:order-2 lg:col-span-8 lg:p-14">
            <span aria-hidden="true" className="ab-quote-mark pointer-events-none absolute right-6 top-8 select-none sm:right-10 lg:right-14 lg:top-12">
              &ldquo;
            </span>
            <Eyebrow>{founder.eyebrow}</Eyebrow>
            <h2 id="founder-title" className="hp-h3-lg mt-5 max-w-2xl pr-12">
              {founder.heading}
            </h2>

            <div className="mt-8 max-w-3xl border-t border-[var(--hp-line)] pt-8">
              {first && <p className="font-display text-[clamp(1.1875rem,1rem+0.6vw,1.5rem)] font-medium leading-[1.5] tracking-[-0.015em] text-[var(--hp-ink)]">{first}</p>}
              {more.map((paragraph) => (
                <p key={paragraph} className="mt-5 text-[16.5px] leading-relaxed text-[var(--hp-body)]">
                  {paragraph}
                </p>
              ))}
              <p className="mt-8 flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-10 bg-[var(--hp-accent)]" />
                <span className="ab-signature text-[17px]">
                  {who}, {founder.company}
                </span>
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
