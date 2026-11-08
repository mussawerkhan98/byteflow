import { getHomeBlock } from '../../lib/home-blocks'
import { Button, delay } from './ui'

/**
 * The service promise ("Home page sections" → Service promise): the one deep
 * navy panel on the page, for contrast. The four standards are set as a
 * horizontal band of large figures divided by hairlines; the AMC link runs
 * along the foot.
 */
export default async function HomePromise() {
  const block = await getHomeBlock('home_promise')
  const copy = block.fields
  const rows = block.lists.rows

  return (
    <section aria-labelledby="promise-title" className="hp-section-tight">
      <div className="page-container">
        <div data-reveal className="hp-navy relative isolate overflow-hidden rounded-[2rem]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -right-40 -top-48 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgba(44,205,222,0.2),transparent)]" />
            <div className="absolute -bottom-56 -left-40 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgba(70,163,225,0.14),transparent)]" />
          </div>

          <div className="grid gap-6 px-6 pb-10 pt-10 sm:px-10 lg:grid-cols-12 lg:items-end lg:gap-10 lg:px-14 lg:pt-14">
            <div className="lg:col-span-8">
              <p className="hp-eyebrow !text-[#7fe3ec]">{copy.eyebrow}</p>
              <h2 id="promise-title" className="hp-h2 mt-5 !text-white">
                {copy.heading} <span className="text-[#8da0b3]">{copy.heading_soft}</span>
              </h2>
              {copy.intro && <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[#b4c0cc]">{copy.intro}</p>}
            </div>
            {copy.seal_text && (
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#7b8a9c] lg:col-span-4 lg:justify-self-end lg:text-right">
                {copy.seal_text.replace(/\s*·\s*$/, '')}
              </p>
            )}
          </div>

          <ol className="grid border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {rows.map((row, i) => (
              <li key={row.title} data-reveal style={delay(i * 110)} className="hp-navy-cell px-6 py-8 sm:px-10 lg:px-8 lg:py-10 xl:px-10">
                <p className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-display text-[3.25rem] font-semibold leading-none tracking-[-0.05em] tabular-nums text-white lg:text-[3.75rem]">{row.value}</span>
                  <span className="text-[14.5px] font-semibold text-[#7fe3ec]">{row.unit}</span>
                </p>
                <h3 className="mt-6 font-display text-[1.25rem] font-semibold tracking-[-0.015em] text-white">{row.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#a9b6c4]">{row.description}</p>
              </li>
            ))}
          </ol>

          <div className="flex flex-col gap-5 border-t border-white/10 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-14">
            <p className="text-[16px] text-[#a9b6c4]">
              {copy.footer_text} <span className="font-semibold text-white">{copy.footer_strong}</span>
            </p>
            <Button href={copy.link_href} variant="light" className="shrink-0 self-start sm:self-auto">
              {copy.link_label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
