import { getServices } from '../../lib/db'
import { getHomeBlock } from '../../lib/home-blocks'
import { aboutReasons } from '../../lib/about-reasons'
import { homePhotos } from '../../lib/home-photos'
import { Eyebrow, Photo, SectionTitle, TextLink, delay } from './ui'

/**
 * About Byteflow: the heading and paragraph, then a large photograph beside
 * the numbered reasons, each with its description and a link to the service
 * it relates to. Edited as "About Byteflow" on the admin's Home page sections.
 */
export default async function HomeAbout() {
  const [about, services] = await Promise.all([getHomeBlock('home_about'), getServices()])
  const copy = about.fields
  const reasons = aboutReasons(about, services)

  return (
    <section aria-labelledby="about-title" className="hp-section hp-tinted">
      <div className="page-container">
        <header data-reveal className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <SectionTitle id="about-title" heading={copy.heading} soft={copy.heading_soft} className="mt-5" />
          </div>
          <p className="hp-lead max-w-md lg:col-span-5 lg:justify-self-end lg:pb-2">{copy.intro}</p>
        </header>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:items-start lg:gap-16">
          <div data-reveal="image" className="lg:sticky lg:top-28 lg:col-span-5">
            <figure className="hp-frame relative aspect-[4/3] overflow-hidden rounded-[1.75rem] sm:aspect-[16/10] lg:aspect-[4/5]">
              <Photo slot={homePhotos.about} sizes="(min-width: 1024px) 40vw, 100vw" />
            </figure>
          </div>

          {reasons.length > 0 && (
            <ol className="lg:col-span-7">
              {reasons.map((reason, i) => (
                <li key={reason.number} data-reveal style={delay(i * 100)} className="hp-reason">
                  <div className="grid gap-4 py-8 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-6 lg:py-10">
                    <span className="hp-reason-num">{reason.number}</span>
                    <div>
                      <h3 className="hp-h3">{reason.title}</h3>
                      {reason.description && <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-[var(--hp-body)]">{reason.description}</p>}
                      <TextLink href={reason.link.href} className="mt-5">
                        {reason.link.label}
                      </TextLink>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  )
}
