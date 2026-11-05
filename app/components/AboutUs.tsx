import { getServices } from '../lib/db'
import { getHomeBlock } from '../lib/home-blocks'
import { aboutReasons } from '../lib/about-reasons'
import AboutReasons from './AboutReasons'

/**
 * About Byteflow: a full-width navy band with the heading and paragraph, then
 * the numbered reasons beside a light preview card (a phone accordion).
 * Edited as "About Byteflow" on the admin's Home page sections screen; each
 * reason's link is labelled with its service's name from the Services screen.
 */
export default async function AboutUs() {
  const [about, services] = await Promise.all([getHomeBlock('home_about'), getServices()])
  const copy = about.fields
  const reasons = aboutReasons(about, services)

  return (
    <section aria-labelledby="about-title" className="home-about relative isolate overflow-hidden bg-[#0f1b27] py-20 text-white sm:py-24 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-48 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(closest-side,rgba(44,205,222,0.16),transparent)]" />
        <div className="absolute -bottom-56 right-[-10rem] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(closest-side,rgba(70,163,225,0.12),transparent)]" />
      </div>

      <div className="page-container">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <p className="mb-6 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#2CCDDE]">
              <span aria-hidden="true" className="h-px w-10 bg-[#2CCDDE]" />
              {copy.eyebrow}
            </p>
            <h2 id="about-title" className="text-balance text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-[3.5rem]">
              {copy.heading} <span className="text-[#8da0b3]">{copy.heading_soft}</span>
            </h2>
          </div>
          <p className="max-w-md text-[17px] leading-relaxed text-[#a9b6c4] lg:col-span-5 lg:justify-self-end lg:pb-2">{copy.intro}</p>
        </div>

        {reasons.length > 0 && <AboutReasons reasons={reasons} />}
      </div>
    </section>
  )
}
