/**
 * The enquiry form filled in from a package's quote button
 * (/contact-us?service=cloud-services-dubai&package=Business): the service
 * picked in its list and the package named in the message. Kept small and
 * apart from the pricing rules, since the form loads it in the browser.
 */

/** The form's service options by service page, for the ?service= the package buttons send. */
const OPTION_BY_SLUG: Record<string, string> = {
  'it-amc-services-dubai': 'IT AMC / IT Support',
  'cyber-security': 'Cyber Security',
  'cloud-services-dubai': 'Cloud Services / Microsoft 365',
  'data-backup-recovery': 'Data Backup & Recovery',
  'website-development': 'Website / App Development',
  'landing-page-designing': 'Website / App Development',
  'digital-marketing': 'Digital Marketing',
  'graphics-designing': 'UI/UX & Graphic Design',
  'system-integration': 'System Integration',
}

/**
 * What to fill in from the address's query, or null when it names neither a
 * service nor a package. A service the list doesn't have is left unpicked.
 */
export function quotePrefill(search: string, options: string[]): { service: string; message: string } | null {
  const params = new URLSearchParams(search)
  const service = (params.get('service') ?? '').trim().slice(0, 100)
  const pkg = (params.get('package') ?? '').trim().slice(0, 120)
  if (!service && !pkg) return null
  const wanted = OPTION_BY_SLUG[service.toLowerCase()] ?? service
  const option = options.find((item) => item.toLowerCase() === wanted.toLowerCase()) ?? ''
  return { service: option, message: pkg ? `Package: ${pkg}\n\n` : '' }
}
