import type { PageHero } from '../../lib/cms'
import type { HomeBlock } from '../../lib/home-content'
import { homePhotos, type PhotoSlot } from '../../lib/home-photos'
import type { SiteFigures } from '../../lib/site-figures'
import { PinIcon } from '../InlineIcons'
import { Button, Photo, delay } from '../home/ui'

/** The H1 in two tones: the heading, then the highlight (or the heading's second line). */
function splitHeading(heading: string | undefined, highlight: string | undefined, figures: SiteFigures): [string, string | undefined] {
  if (!heading) return [`The team behind ${figures.clients} businesses`, highlight || 'running smoothly.']
  if (highlight) return [heading.trim(), highlight.trim()]
  const [lead, ...rest] = heading.split(/\r?\n/)
  return [lead.trim(), rest.join(' ').trim() || undefined]
}

/**
 * The About Us banner, editorial rather than the home page's panel: a large
 * headline across the page over a faint blueprint grid, the paragraph and
 * buttons beside it, then a wide photograph with the figures (About page
 * sections → Figures) on a card over its lower edge. The words and picture
 * are the page's banner on the admin's Heroes screen; with no picture set
 * there, a home page photograph stands in.
 */
export default function AboutHero({ hero, stats, figures }: { hero: PageHero | null; stats: HomeBlock; figures: SiteFigures }) {
  const [lead, rest] = splitHeading(hero?.hero_heading, hero?.hero_highlight, figures)
  const picture = hero?.hero_image || hero?.hero_background_image
  const photo: PhotoSlot = picture ? { src: picture, alt: hero?.hero_image_alt || '', brief: '' } : homePhotos.about
  const rows = stats.lists.stats

  return (
    <section aria-labelledby="about-hero-title" className="relative isolate">
      <div aria-hidden="true" className="ab-hero-bg pointer-events-none absolute inset-x-0 top-0 -z-10 h-[42rem]" />

      <div className="page-container pt-8 sm:pt-10 lg:pt-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-8">
            <p className="hp-badge hp-enter-fade" style={delay(0)}>
              <span aria-hidden="true" className="hp-dot" />
              {hero?.hero_label || `Dubai, UAE · Since ${figures.founded}`}
            </p>
            <h1 id="about-hero-title" className="hp-h1 ab-h1 mt-6 hp-enter" style={delay(80)}>
              {lead}
              {rest && ' '}
              {rest && <span className="hp-h1-accent block">{rest}</span>}
            </h1>
          </div>

          <div className="lg:col-span-4 lg:pb-2">
            <p className="hp-lead hp-enter" style={delay(200)}>
              {hero?.hero_description ||
                'We are a Dubai-based IT company that handles everything technology-related for businesses across the UAE — so you never have to call three different vendors again.'}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <span className="block hp-enter sm:inline-block" style={delay(300)}>
                <Button href={hero?.hero_primary_link || '/contact-us'} className="w-full sm:w-auto">
                  {hero?.hero_primary_label || 'Talk to our team'}
                </Button>
              </span>
              <span className="block hp-enter sm:inline-block" style={delay(380)}>
                <Button href={hero?.hero_secondary_link || '#our-story'} variant="ghost" className="w-full sm:w-auto">
                  {hero?.hero_secondary_label || 'Our story'}
                </Button>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 lg:mt-12">
          <div className="hp-enter-image relative" style={delay(220)}>
            <figure className="hp-frame relative aspect-[4/3] overflow-hidden rounded-[1.5rem] sm:aspect-[16/8] lg:aspect-[16/5] lg:rounded-[2rem]">
              <Photo slot={photo} sizes="(min-width: 1024px) 88vw, 100vw" priority />
              <div aria-hidden="true" className="ab-hero-shade absolute inset-0" />
              <p className="hp-glass absolute left-4 right-4 top-4 flex items-center gap-2 rounded-xl px-3.5 py-2 sm:right-auto sm:rounded-full text-[13px] font-medium text-[var(--hp-ink)] sm:left-6 sm:top-6">
                <PinIcon className="h-4 w-4 shrink-0 text-[var(--hp-accent)]" />
                {hero?.hero_trust_line || `Dubai-based IT partner since ${figures.founded} · ${figures.rating}★ Google rating`}
              </p>
            </figure>
          </div>

          {rows.length > 0 && (
            // Hairlines between the figures: the card's line colour shows through the gaps.
            <dl
              className={`hp-band relative z-10 mx-3 -mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[1.25rem] !bg-[var(--hp-line)] hp-enter sm:mx-8 sm:-mt-16 lg:mx-14 ${rows.length >= 4 ? 'lg:grid-cols-4' : rows.length === 3 ? 'lg:grid-cols-3' : ''}`}
              style={delay(480)}
            >
              {rows.map((row) => (
                <div key={row.title + row.description} className="flex flex-col bg-[var(--hp-card)] p-5 last:odd:col-span-2 sm:p-7 lg:last:odd:col-span-1">
                  <dt className="order-2 mt-2 text-[13.5px] leading-snug text-[var(--hp-body)] sm:text-[15px]">{row.description}</dt>
                  <dd className="hp-stat order-1 !text-[2rem] sm:!text-[2.75rem]">{row.title}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  )
}
