import { getHomeBlock } from '../../lib/home-blocks'
import { tabIcon, techTabs } from '../../lib/tech-stack'
import { Button, Eyebrow, SectionTitle, delay } from './ui'

const iconPaths: Record<ReturnType<typeof tabIcon>, string> = {
  microsoft: 'M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z',
  shield: 'M12 3l7.5 3v5.25c0 4.5-3.15 8.25-7.5 9.75-4.35-1.5-7.5-5.25-7.5-9.75V6L12 3zm-3 9l2 2 4-4.5',
  network: 'M12 18.75h.01M8.6 15.4a4.8 4.8 0 016.8 0M5.2 12a9.6 9.6 0 0113.6 0M1.9 8.6a14.4 14.4 0 0120.2 0',
  backup: 'M20 7c0 1.66-3.58 3-8 3S4 8.66 4 7m16 0c0-1.66-3.58-3-8-3S4 5.34 4 7m16 0v10c0 1.66-3.58 3-8 3s-8-1.34-8-3V7m16 5c0 1.66-3.58 3-8 3s-8-1.34-8-3',
  cloud: 'M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.33-7.26 3 3 0 00-3.76-3.85 5.25 5.25 0 00-10.23 2.33A4.5 4.5 0 002.25 15z',
  code: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5',
  layers: 'M12 3l9 4.5-9 4.5-9-4.5L12 3zM3 12l9 4.5 9-4.5M3 16.5l9 4.5 9-4.5',
}

/** The first card's width, so the grid always closes without a gap (three columns wide, two on tablets). */
function leadSpan(count: number) {
  const lg = count % 3 === 2 ? 'lg:col-span-2' : count % 3 === 1 && count > 1 ? 'lg:col-span-3' : ''
  const md = count % 2 === 1 && count > 1 ? 'md:col-span-2' : ''
  return `${md} ${lg} ${md && !lg ? 'lg:col-span-1' : ''}`
}

/**
 * Technologies, in the hero's language and the brand's colours: the heading
 * and call to action, then a card per area. Each card carries the brand line
 * along its top, the area's icon, name and description, and its platforms on
 * a soft-blue base whose top edge is the hero's diagonal. The first area is
 * the navy card. A logo uploaded in the admin shows beside its platform's
 * name. Edited as "Technologies"; hidden when no area has a platform.
 */
export default async function HomeTech() {
  const block = await getHomeBlock('home_tech')
  const tabs = techTabs(block)
  if (!tabs.length) return null
  const copy = block.fields

  return (
    <section aria-labelledby="tech-title" className="hp-section">
      <div className="page-container">
        <header data-reveal className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-8">
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <SectionTitle id="tech-title" heading={copy.heading} soft={copy.heading_soft} className="mt-5" />
            {copy.intro && <p className="hp-lead mt-5 max-w-xl">{copy.intro}</p>}
          </div>
          {copy.link_label && (
            <div className="lg:col-span-4 lg:justify-self-end">
              <Button href={copy.link || '/contact-us'}>{copy.link_label}</Button>
            </div>
          )}
        </header>

        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {tabs.map((tab, i) => {
            const lead = i === 0
            return (
              <li key={tab.id} data-reveal style={delay((i % 3) * 90)} className={lead ? leadSpan(tabs.length) : ''}>
                <article className={`hp-tech-card group relative flex h-full flex-col overflow-hidden rounded-[0.75rem] ${lead ? 'is-lead' : ''}`}>
                  <div className="relative z-[1] flex items-start gap-4 p-6 pb-8 sm:p-7 sm:pb-9">
                    <span aria-hidden="true" className="hp-tech-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]">
                        <path d={iconPaths[tabIcon(tab.title)]} />
                      </svg>
                    </span>
                    <div className="min-w-0">
                      <h3 className="hp-tech-title font-display text-[1.25rem] font-semibold tracking-[-0.02em]">{tab.title}</h3>
                      {tab.description && <p className="hp-tech-desc mt-1.5 text-[14.5px] leading-relaxed">{tab.description}</p>}
                    </div>
                  </div>

                  <div className="hp-tech-base mt-auto px-6 pb-6 pt-9 sm:px-7 sm:pb-7">
                    <ul className="flex flex-wrap gap-2" aria-label={`${tab.title} platforms`}>
                      {tab.logos.map((item, logoIndex) => (
                        <li key={`${logoIndex}-${item.name}`} className="hp-tech-chip">
                          {item.logo ? (
                            // Uploaded logos are SVG or small WebP files, shown as they are.
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.logo} alt="" width={18} height={18} loading="lazy" decoding="async" className="h-[18px] w-[18px] object-contain" />
                          ) : (
                            <span aria-hidden="true" className="hp-tech-dot" />
                          )}
                          {item.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>

        {copy.note && (
          <p data-reveal className="mt-6 flex items-start gap-2 text-[13.5px] leading-relaxed text-[var(--hp-muted)]">
            <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.4} className="mt-0.5 h-3.5 w-3.5 shrink-0">
              <circle cx="8" cy="8" r="6.5" />
              <path d="M8 7.25v3.75M8 5h.01" strokeLinecap="round" />
            </svg>
            {copy.note}
          </p>
        )}
      </div>
    </section>
  )
}
