import { getHomeProjects } from '../../lib/db'
import { getHomeBlock } from '../../lib/home-blocks'
import { homePhotos, nthPhoto } from '../../lib/home-photos'
import { projectCard, type ProjectCard } from '../../lib/project-cards'
import { ProjectLead, ProjectTile } from '../projects/ProjectCards'
import { Button, Eyebrow, SectionTitle } from './ui'

/**
 * Selected work: up to four real projects from /projects, picked on the
 * admin's Projects screen. The first is the lead case study; the others sit
 * beneath it. The photographs are representative scenes (home-photos.ts),
 * never presented as pictures of the client's own site. Hidden with no
 * published projects.
 */
/** A card's picture: its "Homepage card — image" from the admin, else the built-in scene for its place. */
const cardPhoto = (card: ProjectCard, place: number) => (card.image ? { ...card.image, brief: '' } : nthPhoto(homePhotos.work, place))

export default async function HomeWork() {
  const [projects, block] = await Promise.all([getHomeProjects(), getHomeBlock('home_work')])
  if (!projects.length) return null
  const copy = block.fields
  const [lead, ...rest] = projects.map((project, index) => projectCard(project, index))

  return (
    <section aria-labelledby="work-title" className="hp-section hp-tinted">
      <div className="page-container">
        <header data-reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-3xl">
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <SectionTitle id="work-title" heading={copy.heading} soft={copy.heading_soft} className="mt-5" />
          </div>
          {/* The paragraph and the button side by side, so the column is
              no taller than the heading and the two sit on one line. */}
          <div className="lg:flex lg:max-w-2xl lg:items-end lg:gap-8 lg:pb-1.5">
            {copy.intro && <p className="hp-lead lg:max-w-md">{copy.intro}</p>}
            <Button href={copy.link || '/projects'} variant="ghost" className="mt-6 shrink-0 lg:mt-0">
              {copy.link_label}
            </Button>
          </div>
        </header>

        <div className="mt-14 lg:mt-20">
          <ProjectLead project={lead} photo={cardPhoto(lead, 0)} linkLabel="View case study" />
        </div>

        {rest.length > 0 && (
          // Phones swipe through two or more, the next showing at the edge;
          // from tablets up they sit in a grid.
          <ul
            className={`mt-14 lg:mt-20 ${
              rest.length === 1
                ? 'grid'
                : `hp-scroller -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:gap-6 md:overflow-visible md:px-0 md:pb-0 ${rest.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'}`
            }`}
          >
            {rest.map((project, i) => (
              <li key={project.slug} className={rest.length === 1 ? '' : 'w-[82%] shrink-0 snap-start md:w-auto'}>
                <ProjectTile project={project} photo={cardPhoto(project, i + 1)} index={i} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
