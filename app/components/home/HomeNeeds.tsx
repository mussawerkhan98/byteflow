import Link from 'next/link'
import { getServices } from '../../lib/db'
import { getHomeBlock } from '../../lib/home-blocks'
import { lines } from '../../lib/home-content'
import { homePhotos, nthPhoto } from '../../lib/home-photos'
import { needScenarios } from '../../lib/need-scenarios'
import { ServiceIcon } from '../ServiceIcon'
import { ArrowRight, Button, Eyebrow, Photo, delay } from './ui'

/**
 * Taller and shorter photos in turn, so the three columns don't read as a
 * row of identical cards. Landscape both, so the section fits a screen.
 */
const shapes = ['aspect-[4/3]', 'aspect-[16/10]', 'aspect-[4/3]']

/**
 * "Where does your IT need help?": the common starting points, each with a
 * photograph and a link to the service that answers it, then the steps of a
 * project. The middle column sits lower, an editorial stagger. Edited as the
 * home_needs block; hidden when every scenario is hidden.
 */
export default async function HomeNeeds() {
  const [block, services] = await Promise.all([getHomeBlock('home_needs'), getServices()])
  const scenarios = needScenarios(block, services)
  if (!scenarios.length) return null
  const copy = block.fields
  const steps = lines(copy.steps)

  return (
    <section aria-labelledby="needs-title" className="hp-section">
      <div className="page-container">
        <header data-reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-3xl">
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <h2 id="needs-title" className="hp-h2 mt-5">
              {copy.heading}
            </h2>
          </div>
          {copy.link_label && (
            <Button href={copy.link || '/contact-us'} className="self-start lg:self-auto">
              {copy.link_label}
            </Button>
          )}
        </header>

        {/* Phones swipe through the cards, the next one showing at the edge;
            from tablets up they sit in three columns. */}
        <ol className="hp-scroller -mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 items-start gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:mt-14 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:mt-20 lg:gap-8">
          {scenarios.map((scenario, i) => (
            <li key={scenario.number} data-reveal style={delay(i * 130)} className={`w-[82%] shrink-0 snap-start md:w-auto ${i % 3 === 1 ? 'md:mt-12' : ''}`}>
              <article className="group relative">
                <figure data-reveal="image" className={`hp-frame relative overflow-hidden rounded-[1.5rem] ${shapes[i % shapes.length]}`}>
                  {/* The scenario's own picture (admin), else the built-in photograph. */}
                  <Photo
                    slot={scenario.image ? { ...scenario.image, brief: '' } : nthPhoto(homePhotos.needs, i)}
                    sizes="(min-width: 768px) 30vw, 100vw"
                    zoom
                  />
                  <span aria-hidden="true" className="hp-glass absolute left-4 top-4 rounded-full px-3 py-1 font-display text-[13px] font-semibold tabular-nums text-[var(--hp-ink)]">
                    {scenario.number}
                  </span>
                </figure>
                <p className="hp-eyebrow mt-7">{scenario.label}</p>
                <h3 className="hp-h3 mt-3">{scenario.title}</h3>
                {scenario.description && <p className="mt-3 text-[15px] leading-relaxed text-[var(--hp-body)]">{scenario.description}</p>}
                {scenario.link && (
                  <Link
                    href={scenario.link.href}
                    className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--hp-line)] pt-5 text-[15px] font-semibold text-[var(--hp-ink)] after:absolute after:inset-0 after:content-['']"
                  >
                    <span className="flex items-center gap-3">
                      <span aria-hidden="true" className="hp-icon-tile h-9 w-9 rounded-xl">
                        <ServiceIcon link={scenario.link.href} className="h-4 w-4" />
                      </span>
                      {scenario.link.label}
                    </span>
                    <span aria-hidden="true" className="hp-round-arrow">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                )}
              </article>
            </li>
          ))}
        </ol>

        {(steps.length > 0 || copy.steps_link_label) && (
          <div data-reveal className="hp-band mt-16 flex flex-col gap-5 rounded-[1.5rem] p-5 sm:p-6 lg:mt-20 lg:flex-row lg:items-center lg:justify-between lg:rounded-full lg:py-3 lg:pl-8 lg:pr-3">
            <ol aria-label="How a project runs" className="grid grid-cols-2 gap-x-4 gap-y-3 sm:flex sm:flex-wrap sm:items-center">
              {steps.map((step, index) => (
                <li key={step} className="flex items-center gap-3">
                  {index > 0 && <span aria-hidden="true" className="hidden h-px w-8 bg-[var(--hp-line-strong)] sm:block lg:w-10" />}
                  <span className="hp-num-dot">{index + 1}</span>
                  <span className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[var(--hp-ink)]">{step}</span>
                </li>
              ))}
            </ol>
            {copy.steps_link_label && (
              <Button href={copy.steps_link || '/#how-we-work'} variant="ghost" className="self-start lg:self-auto">
                {copy.steps_link_label}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
