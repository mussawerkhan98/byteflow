/**
 * Choosing which services to offer a reader at the end of an article.
 *
 * The blog is where this site's search visibility actually lives: the ZKTeco
 * guide alone carries about two thirds of the site's impressions. Until now
 * every post ended with a single link to /contact-us, so none of that
 * standing reached the service pages and a reader who had just solved an
 * attendance-system problem was never shown the service that covers it.
 *
 * Pure and dependency-free so it can be tested on its own. Order matters:
 * the first rule that matches wins, so the more specific topics are listed
 * before the general ones.
 */

export type ServiceLink = { slug: string; label: string }

/** The anchor text each service is linked with. */
const LABELS: Record<string, string> = {
  'it-amc-services-dubai': 'IT AMC support in Dubai',
  'cyber-security': 'Cyber security services',
  'data-backup-recovery': 'Data backup and recovery',
  'cloud-services-dubai': 'Cloud services in Dubai',
  'system-integration': 'System integration',
  'website-development': 'Website development',
  'digital-marketing': 'Digital marketing',
}

const RULES: { test: RegExp; slugs: string[] }[] = [
  {
    // Attendance and access-control hardware: the biggest cluster on this
    // blog, and the readers are in-house IT staff at UAE businesses.
    test: /zkteco|biometric|attendance|access control|ua\s?\d{3}|fingerprint/i,
    slugs: ['it-amc-services-dubai', 'system-integration', 'cyber-security'],
  },
  {
    test: /ransomware|phish|cyber|hack|malware|firewall|secure it|security/i,
    slugs: ['cyber-security', 'it-amc-services-dubai', 'data-backup-recovery'],
  },
  {
    test: /backup|disaster recovery|restore|data loss/i,
    slugs: ['data-backup-recovery', 'it-amc-services-dubai', 'cyber-security'],
  },
  {
    test: /azure|microsoft 365|office 365|\bm365\b|cloud|migrat/i,
    slugs: ['cloud-services-dubai', 'it-amc-services-dubai', 'cyber-security'],
  },
  {
    test: /software|develop|custom app|web app|website/i,
    slugs: ['website-development', 'it-amc-services-dubai', 'digital-marketing'],
  },
  {
    test: /\bai\b|artificial intelligence|automation|chatbot/i,
    slugs: ['system-integration', 'it-amc-services-dubai', 'website-development'],
  },
]

/**
 * IT AMC is in every list and in the fallback because it is the service this
 * business actually sells; the other two slots are what the article was
 * about. Three links, not a directory: a wall of service links at the foot
 * of a post helps nobody and reads as filler.
 */
const FALLBACK = ['it-amc-services-dubai', 'cyber-security', 'cloud-services-dubai']

export function servicesForPost(
  title: unknown,
  category: unknown = '',
  known: readonly string[] = Object.keys(LABELS),
): ServiceLink[] {
  const haystack = `${String(title ?? '')} ${String(category ?? '')}`
  const matched = RULES.find((rule) => rule.test.test(haystack))
  const slugs = matched ? matched.slugs : FALLBACK
  return slugs
    // A rule may name a service that has no page yet; drop it rather than
    // link somewhere that 404s.
    .filter((slug) => known.includes(slug) && LABELS[slug])
    .map((slug) => ({ slug, label: LABELS[slug] }))
}
