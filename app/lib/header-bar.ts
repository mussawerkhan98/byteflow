/**
 * The top bar's own settings, edited in the admin under "Contact details &
 * logo" → Header bar. The menu links themselves come from "Header & footer
 * links", and the Services and Industries dropdowns from Home page sections →
 * Header menu.
 *
 * Kept out of Header.tsx, which is a client component: the server layout
 * reads site settings into this shape and passes it down.
 */
export type HeaderBar = {
  ctaLabel: string
  /** The button's wording on phones, where the bar has less room. */
  ctaShortLabel: string
  ctaLink: string
  showPhone: boolean
  dropdownNote: string
  dropdownCta: string
}

export const defaultHeaderBar: HeaderBar = {
  ctaLabel: 'Get a Free Quote',
  ctaShortLabel: 'Free Quote',
  ctaLink: '/contact-us',
  showPhone: true,
  dropdownNote: 'Not sure which one fits?',
  dropdownCta: 'Ask an engineer',
}

const text = (value: unknown, fallback: string) => (typeof value === 'string' && value.trim() ? value.trim() : fallback)

/** A switch the admin hasn't saved yet (column missing or blank) keeps its default. */
const flag = (value: unknown, fallback: boolean) =>
  value === undefined || value === null || value === '' ? fallback : value === 1 || value === '1' || value === true

/** Only site paths and web, phone or email links; anything else keeps the default. */
export const safeLink = (value: unknown, fallback: string) => {
  const url = text(value, '')
  return /^(\/(?!\/)|https?:\/\/|tel:|mailto:)/i.test(url) ? url : fallback
}

export function headerBarFrom(settings: Record<string, unknown> | null | undefined): HeaderBar {
  const s = settings ?? {}
  return {
    ctaLabel: text(s.header_cta_label, defaultHeaderBar.ctaLabel),
    ctaShortLabel: text(s.header_cta_short_label, defaultHeaderBar.ctaShortLabel),
    ctaLink: safeLink(s.header_cta_link, defaultHeaderBar.ctaLink),
    showPhone: flag(s.header_show_phone, defaultHeaderBar.showPhone),
    dropdownNote: text(s.header_dropdown_note, defaultHeaderBar.dropdownNote),
    dropdownCta: text(s.header_dropdown_cta, defaultHeaderBar.dropdownCta),
  }
}
