/**
 * The top bar's own settings, edited in the admin under "Contact details &
 * logo" → Header bar. The menu links themselves come from "Header & footer
 * links".
 *
 * Kept out of Header.tsx, which is a client component: the server layout
 * reads site settings into this shape and passes it down.
 */
export type HeaderBar = {
  ctaLabel: string
  ctaLink: string
  showPhone: boolean
  /** Top-level menu links set in capitals. */
  uppercase: boolean
  dropdownNote: string
  dropdownCta: string
}

export const defaultHeaderBar: HeaderBar = {
  ctaLabel: 'Contact us',
  ctaLink: '/contact-us',
  showPhone: true,
  uppercase: true,
  dropdownNote: 'Not sure which one fits?',
  dropdownCta: 'Ask an engineer',
}

const text = (value: unknown, fallback: string) => (typeof value === 'string' && value.trim() ? value.trim() : fallback)

/** A switch the admin hasn't saved yet (column missing or blank) keeps its default. */
const flag = (value: unknown, fallback: boolean) =>
  value === undefined || value === null || value === '' ? fallback : value === 1 || value === '1' || value === true

/** Only site paths and web, phone or email links; anything else keeps the default. */
const link = (value: unknown, fallback: string) => {
  const url = text(value, '')
  return /^(\/(?!\/)|https?:\/\/|tel:|mailto:)/i.test(url) ? url : fallback
}

export function headerBarFrom(settings: Record<string, unknown> | null | undefined): HeaderBar {
  const s = settings ?? {}
  return {
    ctaLabel: text(s.header_cta_label, defaultHeaderBar.ctaLabel),
    ctaLink: link(s.header_cta_link, defaultHeaderBar.ctaLink),
    showPhone: flag(s.header_show_phone, defaultHeaderBar.showPhone),
    uppercase: flag(s.header_menu_uppercase, defaultHeaderBar.uppercase),
    dropdownNote: text(s.header_dropdown_note, defaultHeaderBar.dropdownNote),
    dropdownCta: text(s.header_dropdown_cta, defaultHeaderBar.dropdownCta),
  }
}
