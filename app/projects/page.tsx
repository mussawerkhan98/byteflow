import '../home.css'
import '../about.css'
import type { Metadata } from 'next'
import AboutCta from '../components/about/AboutCta'
import HomeMotion from '../components/home/HomeMotion'
import { Button, Eyebrow, SectionTitle, delay } from '../components/home/ui'
import JsonLd from '../components/JsonLd'
import ProjectsBrowser from '../components/projects/ProjectsBrowser'
import { getPageHero, getPageMetadata, getSiteFigures, getSiteSettings } from '../lib/cms'
import { getProjects } from '../lib/db'
import { getHeaderModel } from '../lib/header-data'
import { getHomeBlock } from '../lib/home-blocks'
import { projectCard } from '../lib/project-cards'
import { projectFilters, projectPhoto, projectStats } from '../lib/project-page'
import { breadcrumbSchema, graph, serviceListSchema } from '../lib/structured-data'

export const revalidate = 3600

const PATH = '/projects'

const fallbackTitle = 'Our Projects | IT & Software Case Studies Dubai'
const fallbackDescription = 'See how Byteflow delivered IT infrastructure, software and support for businesses across Dubai and the UAE.'

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getPageMetadata('projects')
  const title = cms?.title || fallbackTitle
  const description = cms?.description || fallbackDescription
  return {
    ...cms,
    title,
    description,
    alternates: { canonical: PATH },
    openGraph: { title, description, ...cms?.openGraph, url: PATH, type: 'website' },
  }
}

const text = (value: unknown) => String(value ?? '').trim()

/** The figures band's columns, by how many figures there are (whole class names, so Tailwind sees them). */
const statColumns = ['', 'grid-cols-1', 'grid-cols-2', 'grid-cols-1 sm:grid-cols-3', 'grid-cols-2 lg:grid-cols-4']

/**
 * The Projects page. The banner is the page's hero (Pages → Projects), with
 * figures counted from the published projects; the projects are the admin's
 * Projects screen, filtered by service; every other word is the admin's
 * "Projects page" screen. FAQs and a call to action added for this page in
 * the admin follow it (layout.tsx).
 */
export default async function ProjectsPage() {
  const [dbProjects, hero, figures, header, settings, copyBlock, cta] = await Promise.all([
    getProjects(),
    getPageHero('projects'),
    getSiteFigures(),
    getHeaderModel(),
    getSiteSettings(),
    getHomeBlock('projects_page'),
    getHomeBlock('projects_cta'),
  ])
  const copy = copyBlock.fields
  const projects = dbProjects.map((project, index) => ({ card: projectCard(project, index), photo: projectPhoto(project), featured: project.featured }))
  const counts = projectStats(dbProjects)
  const stats = [
    { value: counts.projects, label: copy.stat_projects },
    { value: counts.services, label: copy.stat_services },
    { value: counts.industries, label: copy.stat_industries },
    { value: figures.clients, label: copy.stat_clients },
  ].filter((stat) => stat.label && stat.value && stat.value !== '0')

  const heading = hero?.hero_heading || 'Projects that'
  const highlight = hero?.hero_highlight || (hero?.hero_heading ? '' : 'moved the needle.')

  return (
    <div className="hp">
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Projects', path: PATH },
          ]),
          serviceListSchema(dbProjects.map((project) => ({ name: project.title, path: `/projects/${project.slug}` }))),
        )}
      />
      <HomeMotion />

      <section aria-labelledby="projects-title" className="relative isolate">
        <div aria-hidden="true" className="ab-hero-bg pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem]" />
        <div className="page-container grid gap-8 pb-10 pt-10 sm:pt-14 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <p className="hp-badge hp-enter-fade" style={delay(0)}>
              <span aria-hidden="true" className="hp-dot" />
              {hero?.hero_label || 'Our work'}
            </p>
            <h1 id="projects-title" className="hp-h1 mt-6 hp-enter" style={delay(80)}>
              {heading}
              {highlight && ' '}
              {highlight && <span className="hp-h1-accent block">{highlight}</span>}
            </h1>
          </div>
          <div className="lg:col-span-5 lg:pb-2">
            <p className="hp-lead hp-enter" style={delay(200)}>
              {hero?.hero_description || 'Real work for UAE businesses: what each one needed, what we delivered and what changed.'}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <span className="block hp-enter sm:inline-block" style={delay(300)}>
                <Button href={hero?.hero_primary_link || header.cta.href} className="w-full sm:w-auto">
                  {hero?.hero_primary_label || header.cta.label}
                </Button>
              </span>
              <span className="block hp-enter sm:inline-block" style={delay(380)}>
                <Button href={hero?.hero_secondary_link || '/services'} variant="ghost" className="w-full sm:w-auto">
                  {hero?.hero_secondary_label || 'See all services'}
                </Button>
              </span>
            </div>
          </div>
        </div>

        {stats.length > 0 && (
          <div className="page-container pb-14 lg:pb-20">
            <dl className={`hp-band hp-enter grid gap-px overflow-hidden rounded-[1.5rem] !bg-[var(--hp-line)] ${statColumns[Math.min(stats.length, 4)]}`} style={delay(460)}>
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col bg-[var(--hp-card)] p-5 sm:p-7">
                  <dt className="order-2 mt-1 text-[13.5px] text-[var(--hp-body)]">{stat.label}</dt>
                  <dd className="hp-stat order-1 !text-[2rem] sm:!text-[2.5rem]">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </section>

      <section aria-labelledby="projects-work-title" className="page-container pb-16 lg:pb-24">
        <ProjectsBrowser
          heading={
            <div data-reveal className="max-w-2xl">
              {copy.eyebrow && <Eyebrow>{copy.eyebrow}</Eyebrow>}
              <SectionTitle id="projects-work-title" heading={copy.heading} soft={copy.heading_soft} softBlock className="mt-4" />
            </div>
          }
          projects={projects}
          filters={projectFilters(dbProjects)}
          labels={{ filter: copy.filter_label, all: copy.all_label, empty: copy.empty_text, link: copy.link_label }}
        />
      </section>

      <AboutCta
        content={cta}
        contact={{
          phone: text(settings?.header_phone) || '+971 54 328 2042',
          email: text(settings?.primary_email) || 'info@byteflow.ae',
          address: text(settings?.physical_address) || 'Emaar Park 4, Greens, TECOM, Dubai, United Arab Emirates',
        }}
      />
    </div>
  )
}
