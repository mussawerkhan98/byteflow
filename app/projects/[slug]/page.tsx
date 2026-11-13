import '../../home.css'
import '../../about.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import sanitizeHtml from 'sanitize-html'
import AboutCta from '@/app/components/about/AboutCta'
import HomeMotion from '@/app/components/home/HomeMotion'
import { ArrowRight, Button, Check, Eyebrow, Photo, SectionTitle, TextLink, delay } from '@/app/components/home/ui'
import JsonLd from '@/app/components/JsonLd'
import { ProjectMeta, ProjectTile } from '@/app/components/projects/ProjectCards'
import { getSiteSettings } from '@/app/lib/cms'
import { getProjectBySlug, getProjects } from '@/app/lib/db'
import { getHomeBlock } from '@/app/lib/home-blocks'
import { projectCard } from '@/app/lib/project-cards'
import { projectPhoto, relatedProjects, serviceForCategory } from '@/app/lib/project-page'
import { absoluteUrl, breadcrumbSchema, graph, plainText } from '@/app/lib/structured-data'

export const revalidate = 3600

// No generateStaticParams: the root layout renders every page at request
// time (connection()), so nothing is prerendered anyway. With it, a build
// that read no published projects marked this route static, and every
// project page then failed at request time (DYNAMIC_SERVER_USAGE, a 500).

const storyHtml = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: ['p', 'br', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'blockquote', 'a', 'code', 'pre'],
    allowedAttributes: { a: ['href', 'title', 'target', 'rel'] },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  })

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return {}
  const title = `${project.title} | Byteflow Projects`
  const description = plainText(project.description)
  const photo = projectPhoto(project)
  return {
    title,
    description,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: { title, description, url: `/projects/${slug}`, type: 'article', ...(photo.src ? { images: [{ url: photo.src, alt: photo.alt }] } : {}) },
  }
}

const text = (value: unknown) => String(value ?? '').trim()

/**
 * A project's own page, every word of the story from its record on the
 * admin's Projects screen: the brief and its results over its picture, the
 * story beside its details, what we delivered and the technology used, then
 * related projects and the closing panel. The labels are the admin's
 * "Projects page" screen.
 */
export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [project, all, labelsBlock, cta, settings] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
    getHomeBlock('projects_detail'),
    getHomeBlock('projects_cta'),
    getSiteSettings(),
  ])
  if (!project) notFound()

  const labels = labelsBlock.fields
  const index = Math.max(0, all.findIndex((item) => item.slug === project.slug))
  const card = projectCard(project, index)
  const photo = projectPhoto(project)
  const service = serviceForCategory(project.category)
  const deliverables = project.bullet_points.map((item) => item.trim()).filter(Boolean)
  const tags = project.tags.map((item) => item.trim()).filter(Boolean)
  const related = relatedProjects(all, project)
  const details = [
    { label: labels.service_label, value: project.category.trim(), href: service?.href },
    { label: labels.industry_label, value: project.industry.trim() },
    { label: labels.year_label, value: project.year.trim() },
  ].filter((row) => row.label && row.value)
  const path = `/projects/${project.slug}`

  return (
    <article className="hp">
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Projects', path: '/projects' },
            { name: project.title, path },
          ]),
          {
            '@type': 'CreativeWork',
            name: project.title,
            description: plainText(project.description, 300),
            url: absoluteUrl(path),
            ...(photo.src ? { image: absoluteUrl(photo.src) } : {}),
            ...(project.year.trim() ? { dateCreated: project.year.trim() } : {}),
            ...(tags.length ? { keywords: tags.join(', ') } : {}),
          },
        )}
      />
      <HomeMotion />

      <header className="relative isolate">
        <div aria-hidden="true" className="ab-hero-bg pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem]" />
        <div className="page-container grid gap-8 pb-10 pt-8 sm:pt-12 lg:grid-cols-12 lg:items-end lg:gap-12 lg:pb-14">
          <div className="lg:col-span-7">
            <Link href="/projects" className="hp-enter-fade inline-flex items-center gap-2 text-[14px] font-semibold text-[var(--hp-accent)] hover:underline" style={delay(0)}>
              <ArrowRight className="h-4 w-4 rotate-180" />
              {labels.back_label}
            </Link>
            <div className="mt-6 hp-enter" style={delay(60)}>
              <ProjectMeta project={card} year={project.year.trim()} numbered={false} />
            </div>
            <h1 className="hp-h1 mt-5 !text-[clamp(2.25rem,1.6rem+2.6vw,3.75rem)] hp-enter" style={delay(120)}>
              {project.title}
            </h1>
          </div>
          <div className="lg:col-span-5 lg:pb-2">
            {card.requirement && (
              <p className="hp-lead hp-enter" style={delay(200)}>
                {card.requirement}
              </p>
            )}
            {labels.primary_label && labels.primary_link && (
              <span className="mt-6 block hp-enter sm:inline-block" style={delay(300)}>
                <Button href={labels.primary_link} className="w-full sm:w-auto">
                  {labels.primary_label}
                </Button>
              </span>
            )}
          </div>
        </div>

        <div className="page-container">
          <figure className="hp-frame hp-enter relative aspect-[4/3] overflow-hidden rounded-[1.75rem] sm:aspect-[16/9] lg:aspect-[21/9]" style={delay(360)}>
            <Photo slot={photo} sizes="(min-width: 1280px) 1200px, 100vw" priority />
          </figure>
          {card.metrics.length > 0 && (
            <dl className="hp-band hp-band-inline relative z-10 mx-3 -mt-12 grid grid-cols-3 overflow-hidden rounded-2xl sm:mx-8 sm:-mt-16 lg:mx-auto lg:max-w-4xl">
              {card.metrics.map((metric) => (
                <div key={metric.label} className="hp-band-cell flex flex-col p-4 sm:p-6">
                  <dt className="order-2 mt-1.5 text-[12.5px] leading-snug text-[var(--hp-body)] sm:text-[13.5px]">{metric.label}</dt>
                  <dd className="hp-stat order-1 !text-[1.75rem] sm:!text-[2.5rem]">{metric.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </header>

      <div className="page-container grid gap-10 py-16 lg:grid-cols-12 lg:gap-14 lg:py-24">
        <div className="min-w-0 lg:col-span-8">
          {labels.story_heading && <h2 className="hp-h3-lg mb-6">{labels.story_heading}</h2>}
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: storyHtml(project.description) }} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          {details.length > 0 && (
            <div className="hp-band rounded-[1.5rem] p-6">
              <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--hp-muted)]">{labels.details_label}</h2>
              <dl className="mt-4 divide-y divide-[var(--hp-line)]">
                {details.map((row) => (
                  <div key={row.label} className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="text-[14px] text-[var(--hp-muted)]">{row.label}</dt>
                    <dd className="text-right text-[15px] font-semibold text-[var(--hp-ink)]">
                      {row.href ? (
                        <Link href={row.href} className="inline-flex items-center gap-1.5 text-[var(--hp-accent)] hover:underline">
                          {row.value}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      ) : (
                        row.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {deliverables.length > 0 && (
            <div className="hp-band rounded-[1.5rem] p-6">
              <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--hp-muted)]">{labels.delivered_label}</h2>
              <ul className="mt-4 grid gap-3">
                {deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-snug text-[var(--hp-ink)]">
                    <span className="hp-tick mt-px">
                      <Check />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tags.length > 0 && (
            <div className="hp-band rounded-[1.5rem] p-6">
              <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--hp-muted)]">{labels.tags_label}</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <li key={tag} className="hp-pill">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="project-more-title" className="hp-tinted py-16 lg:py-24">
          <div className="page-container">
            <header data-reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                {labels.more_eyebrow && <Eyebrow>{labels.more_eyebrow}</Eyebrow>}
                <SectionTitle id="project-more-title" heading={labels.more_heading} className="mt-4" />
              </div>
              {labels.more_link_label && <TextLink href="/projects">{labels.more_link_label}</TextLink>}
            </header>
            <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item, i) => (
                <li key={item.slug}>
                  <ProjectTile project={projectCard(item, all.indexOf(item))} photo={projectPhoto(item)} index={i} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <AboutCta
        content={cta}
        contact={{
          phone: text(settings?.header_phone) || '+971 54 328 2042',
          email: text(settings?.primary_email) || 'info@byteflow.ae',
          address: text(settings?.physical_address) || 'Emaar Park 4, Greens, TECOM, Dubai, United Arab Emirates',
        }}
      />
    </article>
  )
}
