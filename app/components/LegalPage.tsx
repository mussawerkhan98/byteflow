import type { Metadata } from 'next'
import { Fragment, type ReactNode } from 'react'
import { getPageMetadata } from '../lib/cms'
import { getHomeBlock } from '../lib/home-blocks'
import { legalAnchors, legalBlocks } from '../lib/legal-text'
import { breadcrumbSchema, graph } from '../lib/structured-data'
import JsonLd from './JsonLd'
import HomeMotion from './home/HomeMotion'

export type LegalKey = 'legal_privacy' | 'legal_terms'

const PATHS: Record<LegalKey, string> = {
  legal_privacy: '/privacy-policy',
  legal_terms: '/terms-and-conditions',
}

/** Email addresses in the text become mailto: links. */
function withLinks(text: string): ReactNode {
  const parts = text.split(/([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/)
  return parts.map((part, i) =>
    i % 2 ? (
      <a key={i} href={`mailto:${part}`} className="font-medium text-[var(--hp-accent)] underline decoration-[var(--hp-line-strong)] underline-offset-4 hover:decoration-current">
        {part}
      </a>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

/** The page's SEO details from its row under Pages, otherwise from its own title and intro. */
export async function legalMetadata(key: LegalKey): Promise<Metadata> {
  const path = PATHS[key]
  const [cms, content] = await Promise.all([getPageMetadata(path.slice(1)), getHomeBlock(key)])
  const title = cms?.title || `${content.fields.title} | Byteflow`
  const description = cms?.description || content.fields.intro
  return { ...cms, title, description, alternates: { canonical: path }, openGraph: { title, description, ...cms?.openGraph, url: path, type: 'website' } }
}

/**
 * A legal page (Privacy Policy, Terms & Conditions), edited on the admin's
 * Legal pages screen: the title, last updated line and intro, then the
 * sections, with a contents list beside them on wide screens. In the home
 * page's colours and type (.hp, home.css).
 */
export default async function LegalPage({ contentKey }: { contentKey: LegalKey }) {
  const content = await getHomeBlock(contentKey)
  const copy = content.fields
  const sections = content.lists.sections
  const anchors = legalAnchors(sections.map((section) => section.title))
  const path = PATHS[contentKey]

  return (
    <div className="hp">
      <JsonLd data={graph(breadcrumbSchema([{ name: 'Home', path: '/' }, { name: copy.title, path }]))} />
      <HomeMotion />

      <header className="page-container pb-10 pt-10 sm:pt-14 lg:pb-14">
        <p className="hp-badge hp-enter-fade">
          <span aria-hidden="true" className="hp-dot" />
          {copy.eyebrow}
        </p>
        <h1 className="hp-h2 mt-6 hp-enter">{copy.title}</h1>
        {copy.updated && <p className="mt-4 text-[14px] font-medium text-[var(--hp-muted)]">{copy.updated}</p>}
        {copy.intro && <p className="hp-lead mt-5 max-w-2xl">{copy.intro}</p>}
      </header>

      <div className="page-container grid gap-10 pb-20 lg:grid-cols-12 lg:gap-12 lg:pb-28">
        {sections.length > 1 && (
          <nav aria-label="On this page" className="hidden lg:col-span-4 lg:block lg:sticky lg:top-28 lg:self-start">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--hp-muted)]">On this page</p>
            <ol className="mt-4 space-y-1 border-l border-[var(--hp-line-strong)]">
              {sections.map((section, i) => (
                <li key={anchors[i]}>
                  <a href={`#${anchors[i]}`} className="-ml-px block border-l border-transparent py-1.5 pl-4 text-[14.5px] text-[var(--hp-body)] transition-colors hover:border-[var(--hp-accent)] hover:text-[var(--hp-accent)]">
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <article className={`rounded-[1.5rem] border border-[var(--hp-line)] bg-[var(--hp-card)] p-6 shadow-[var(--hp-shadow)] sm:p-10 lg:p-12 ${sections.length > 1 ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          {sections.map((section, i) => (
            <section key={anchors[i]} id={anchors[i]} aria-labelledby={`${anchors[i]}-title`} className="scroll-mt-28 border-t border-[var(--hp-line)] pt-8 first:border-t-0 first:pt-0 [&+&]:mt-8">
              <h2 id={`${anchors[i]}-title`} className="font-display text-[1.25rem] font-semibold leading-snug tracking-[-0.02em] text-[var(--hp-ink)] sm:text-[1.375rem]">
                <span aria-hidden="true" className="mr-3 tabular-nums text-[var(--hp-accent)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {section.title}
              </h2>
              <div className="mt-4 space-y-4 text-[15.5px] leading-relaxed text-[var(--hp-body)]">
                {legalBlocks(section.description).map((block, j) =>
                  block.kind === 'list' ? (
                    <ul key={j} className="list-disc space-y-2 pl-5 marker:text-[var(--hp-accent)]">
                      {block.items.map((item, k) => (
                        <li key={k}>{withLinks(item)}</li>
                      ))}
                    </ul>
                  ) : (
                    <p key={j}>
                      {block.lines.map((line, k) => (
                        <Fragment key={k}>
                          {k > 0 && <br />}
                          {withLinks(line)}
                        </Fragment>
                      ))}
                    </p>
                  ),
                )}
              </div>
            </section>
          ))}
        </article>
      </div>
    </div>
  )
}
