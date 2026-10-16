import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    // No `host` here: it is a Yandex directive. Google reports it as
    // "Rule ignored by Googlebot" in Search Console's robots.txt report.
    sitemap: 'https://www.byteflow.ae/sitemap.xml',
  }
}
