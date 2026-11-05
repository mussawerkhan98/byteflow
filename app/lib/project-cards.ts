/**
 * The home page Selected Work cards, built from the projects already
 * published on /projects. Every word comes from the project's own record;
 * nothing is made up. The business requirement falls back to the start of the
 * project's description when the admin field is left blank.
 *
 * No database access or React here, so the rules can be tested directly.
 */
import type { DbProject } from './db'
import { plainText } from './structured-data'

export type ProjectCard = {
  slug: string
  href: string
  /** "01", "02"… in homepage order. */
  number: string
  title: string
  category: string
  industry: string
  requirement: string
  /** The ticked "Byteflow scope" list: the first three deliverables. */
  scope: string[]
  tags: string[]
  image: { src: string; alt: string } | null
}

export const SCOPE_ITEMS = 3
export const TAG_ITEMS = 4

/** The first one or two sentences, kept short enough for a card. */
export function firstSentences(text: string, max = 2, maxChars = 220): string {
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [text]
  let out = ''
  for (const sentence of sentences.slice(0, max)) {
    const next = (out + sentence).trim()
    if (out && next.length > maxChars) break
    out = next + ' '
  }
  out = out.trim()
  return out.length > maxChars ? `${out.slice(0, maxChars).replace(/\s+\S*$/, '')}…` : out
}

const list = (items: string[], max: number) => items.map((item) => item.trim()).filter(Boolean).slice(0, max)

type ProjectInput = Pick<
  DbProject,
  'slug' | 'title' | 'description' | 'category' | 'industry' | 'bullet_points' | 'tags' | 'challenge' | 'card_image' | 'card_image_alt'
>

export function projectCard(project: ProjectInput, index = 0): ProjectCard {
  return {
    slug: project.slug,
    href: `/projects/${project.slug}`,
    number: String(index + 1).padStart(2, '0'),
    title: project.title,
    category: project.category.trim(),
    industry: project.industry.trim(),
    requirement: project.challenge || firstSentences(plainText(project.description)),
    scope: list(project.bullet_points, SCOPE_ITEMS),
    tags: list(project.tags, TAG_ITEMS),
    // The admin won't save a card picture without alt text; the title is
    // only a safety net for rows written some other way.
    image: project.card_image ? { src: project.card_image, alt: project.card_image_alt || project.title } : null,
  }
}
