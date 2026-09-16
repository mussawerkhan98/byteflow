import type { NextConfig } from 'next'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function loadParentDatabaseEnvironment() {
  if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) return
  try {
    const entries = new Map<string, string>()
    for (const rawLine of readFileSync(resolve(process.cwd(), '..', '.env'), 'utf8').split(/\r?\n/)) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) continue
      const separator = line.indexOf('=')
      if (separator < 0) continue
      const key = line.slice(0, separator).trim().toLowerCase()
      const value = line.slice(separator + 1).trim().replace(/^(['"])(.*)\1$/, '$2')
      entries.set(key, value)
    }
    process.env.TURSO_DATABASE_URL ||= entries.get('db url')
    process.env.TURSO_AUTH_TOKEN ||= entries.get('db token')
  } catch {
    // Standard project-local TURSO_* variables remain supported in production.
  }
}

loadParentDatabaseEnvironment()

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
   async redirects() {
    return [
      { source: '/blogs', destination: '/blog', permanent: true },
      { source: '/software-development-company', destination: '/website-development', permanent: true },

      // Legacy index files
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/index.php', destination: '/', permanent: true },
      { source: '/home', destination: '/', permanent: true },

      // Retired project case studies
      { source: '/projects/apma-shipping', destination: '/projects', permanent: true },
      { source: '/projects/npath-software', destination: '/projects', permanent: true },
      { source: '/projects/carib-electrical', destination: '/projects', permanent: true },
      { source: '/projects/sabi-construction', destination: '/projects', permanent: true },
      { source: '/projects/hesabat-and-amwal', destination: '/projects', permanent: true },
      { source: '/projects/tools-nest', destination: '/projects', permanent: true },

      // WordPress RSS feed URLs
      { source: '/ai-services-dubai/feed', destination: '/ai-services-dubai', permanent: true },
      { source: '/it-company-in-dubai/feed', destination: '/it-company-in-dubai', permanent: true },
      { source: '/ua300-installation-dubai/feed', destination: '/ua300-installation-dubai', permanent: true },
      { source: '/:slug/feed', destination: '/:slug', permanent: true },

      // Retired service slugs
      { source: '/cloud-services', destination: '/cloud-services-dubai', permanent: true },
      { source: '/it-amc-support-dubai', destination: '/it-amc-services-dubai', permanent: true },
      { source: '/software-company-in-dubai', destination: '/software-development-company-in-dubai', permanent: true },

      // --- AMC consolidation ---
      { source: '/it-amc-services-in-dubai', destination: '/it-amc-services-dubai', permanent: true },
      { source: '/amc-support-in-business-bay-dubai', destination: '/it-amc-services-dubai', permanent: true },
      { source: '/it-amc-dubai', destination: '/it-amc-services-dubai', permanent: true },
      { source: '/why-businesses-need-it-support', destination: '/it-amc-services-dubai', permanent: true },
      { source: '/it-company-in-dubai', destination: '/it-amc-services-dubai', permanent: true },
      { source: '/amc-support-in-business-al-barsha-dubai', destination: '/it-amc-services-dubai', permanent: true },
      { source: '/amc-support-in-dubai', destination: '/it-amc-services-dubai', permanent: true },
      { source: '/remote-it-support-in-al-barsha', destination: '/it-amc-services-dubai', permanent: true },
      { source: '/it-solutions-company-in-dubai', destination: '/it-amc-services-dubai', permanent: true },
      { source: '/byteflow-it-services-in-dubai', destination: '/it-amc-services-dubai', permanent: true },
      { source: '/remote-it-support-in-business-bay-dubai', destination: '/it-amc-services-dubai', permanent: true },
      { source: '/local-it-support-dubai', destination: '/it-amc-services-dubai', permanent: true },
      { source: '/it-amc-support', destination: '/it-amc-services-dubai', permanent: true },
      { source: '/what-is-it-support-do-you-need-it', destination: '/it-amc-services-dubai', permanent: true },
      { source: '/it-support-dubai', destination: '/it-amc-services-dubai', permanent: true },
      { source: '/it-services-in-dubai', destination: '/it-amc-services-dubai', permanent: true },
      { source: '/it-support-services-in-dubai', destination: '/it-amc-services-dubai', permanent: true },
      { source: '/business-it-support-dubai', destination: '/it-amc-services-dubai', permanent: true },
      { source: '/three-reasons-your-business-needs-managed-it-services-near-me', destination: '/it-amc-services-dubai', permanent: true },
      { source: '/simplifying-it-with-microsoft-365', destination: '/cloud-services-dubai', permanent: true },
    ]
  },
}
export default nextConfig
