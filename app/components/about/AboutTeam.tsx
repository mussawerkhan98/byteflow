import Image from 'next/image'
import type { CmsTeamMember } from '../../lib/cms'
import type { HomeBlock } from '../../lib/home-content'
import { Eyebrow, SectionTitle, delay } from '../home/ui'

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]!.toUpperCase())
    .join('')

/**
 * The team, from the admin's Team members screen, as photo cards; a member
 * with no photo gets their initials. The heading is "Our team" on the About
 * page sections. Left out while no member is published.
 */
export default function AboutTeam({ members, content }: { members: CmsTeamMember[]; content: HomeBlock }) {
  if (!members.length) return null
  const copy = content.fields

  return (
    <section aria-labelledby="team-title" className="hp-section">
      <div className="page-container">
        <header data-reveal className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <SectionTitle id="team-title" heading={copy.heading} soft={copy.heading_soft} className="mt-5" />
          </div>
          {copy.intro && <p className="hp-lead max-w-md lg:col-span-5 lg:justify-self-end lg:pb-2">{copy.intro}</p>}
        </header>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {members.map((member, i) => {
            const links = [
              member.email && { label: 'Email', href: `mailto:${member.email}` },
              member.linkedin_url && { label: 'LinkedIn', href: member.linkedin_url },
              member.github_url && { label: 'GitHub', href: member.github_url },
            ].filter((link): link is { label: string; href: string } => Boolean(link))
            return (
              <li key={member.id} data-reveal style={delay((i % 3) * 120)} className="min-w-0">
                <article className="hp-card group flex h-full flex-col overflow-hidden rounded-[1.75rem]">
                  <figure className="relative m-2 aspect-[4/3] overflow-hidden rounded-[1.35rem] bg-[var(--hp-soft)]">
                    {member.image_url ? (
                      <Image src={member.image_url} alt={member.image_alt || member.name} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw" className="hp-zoom object-cover" />
                    ) : (
                      <span aria-hidden="true" className="grid h-full place-items-center font-display text-[2.5rem] font-semibold text-[var(--hp-accent)]">
                        {initials(member.name)}
                      </span>
                    )}
                  </figure>
                  <div className="flex flex-1 flex-col px-6 pb-6 pt-4">
                    <h3 className="font-display text-[1.25rem] font-semibold leading-snug tracking-[-0.02em] text-[var(--hp-ink)]">{member.name}</h3>
                    {member.job_title && <p className="mt-1 text-[14px] font-semibold text-[var(--hp-accent)]">{member.job_title}</p>}
                    {member.biography && <p className="mt-3 text-[15px] leading-relaxed text-[var(--hp-body)]">{member.biography}</p>}
                    {links.length > 0 && (
                      <ul className="mt-auto flex flex-wrap gap-2 pt-5">
                        {links.map((link) => (
                          <li key={link.label}>
                            <a
                              href={link.href}
                              className="hp-pill transition-colors hover:border-[var(--hp-accent)] hover:text-[var(--hp-accent)]"
                              {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
