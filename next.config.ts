import type { NextConfig } from "next";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadParentDatabaseEnvironment() {
  if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) return;
  try {
    const entries = new Map<string, string>();
    for (const rawLine of readFileSync(
      resolve(process.cwd(), "..", ".env"),
      "utf8",
    ).split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const separator = line.indexOf("=");
      if (separator < 0) continue;
      const key = line.slice(0, separator).trim().toLowerCase();
      const value = line
        .slice(separator + 1)
        .trim()
        .replace(/^(['"])(.*)\1$/, "$2");
      entries.set(key, value);
    }
    process.env.TURSO_DATABASE_URL ||= entries.get("db url");
    process.env.TURSO_AUTH_TOKEN ||= entries.get("db token");
  } catch {
    // Standard project-local TURSO_* variables remain supported in production.
  }
}

loadParentDatabaseEnvironment();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  async redirects() {
    // Slugs WordPress used to serve that no longer have a page of their own,
    // mapped to where that content lives now.
    //
    // Each one is emitted three ways — the bare slug, the /blog/ form
    // WordPress also served it under, and its RSS feed URL — all pointing at
    // the final destination. Generating them together is what keeps these to
    // a single hop: the generic /blog/:slug rule below used to send
    // /blog/it-amc-dubai to /it-amc-dubai, which then redirected again, so
    // Google followed two hops and discounted the second.
    const retired: Record<string, string> = {
      "software-development-company": "/website-development",
      "cloud-services": "/cloud-services-dubai",
      "software-company-in-dubai": "/software-development-company-in-dubai",
      "simplifying-it-with-microsoft-365": "/cloud-services-dubai",

      // Legacy AMC / IT-support pages, consolidated onto one service page.
      "it-amc-support-dubai": "/it-amc-services-dubai",
      "it-amc-services-in-dubai": "/it-amc-services-dubai",
      "amc-support-in-business-bay-dubai": "/it-amc-services-dubai",
      "it-amc-dubai": "/it-amc-services-dubai",
      "why-businesses-need-it-support": "/it-amc-services-dubai",
      "it-company-in-dubai": "/it-amc-services-dubai",
      "amc-support-in-business-al-barsha-dubai": "/it-amc-services-dubai",
      "amc-support-in-dubai": "/it-amc-services-dubai",
      "remote-it-support-in-al-barsha": "/it-amc-services-dubai",
      "it-solutions-company-in-dubai": "/it-amc-services-dubai",
      "byteflow-it-services-in-dubai": "/it-amc-services-dubai",
      "remote-it-support-in-business-bay-dubai": "/it-amc-services-dubai",
      "local-it-support-dubai": "/it-amc-services-dubai",
      "it-amc-support": "/it-amc-services-dubai",
      "what-is-it-support-do-you-need-it": "/it-amc-services-dubai",
      "it-support-dubai": "/it-amc-services-dubai",
      "it-services-in-dubai": "/it-amc-services-dubai",
      "it-support-services-in-dubai": "/it-amc-services-dubai",
      "business-it-support-dubai": "/it-amc-services-dubai",
      "three-reasons-your-business-needs-managed-it-services-near-me":
        "/it-amc-services-dubai",
    };

    const retiredRedirects = Object.entries(retired).flatMap(
      ([slug, destination]) => [
        { source: `/${slug}`, destination, permanent: true },
        { source: `/blog/${slug}`, destination, permanent: true },
        { source: `/${slug}/feed`, destination, permanent: true },
      ],
    );

    return [
      { source: "/blogs", destination: "/blog", permanent: true },

      // The retired slugs are matched first so each one resolves in a single
      // hop. Anything not listed there falls through to the generic rules.
      ...retiredRedirects,

      // WordPress served posts under /blog/<slug>; this site serves them at
      // the root. A slug that is neither a live post nor retired still 404s,
      // which is correct.
      //
      // The blog's own feed goes first: without it the rule below would read
      // "feed" as a post slug and send it to /feed, which is nothing.
      { source: "/blog/feed", destination: "/blog", permanent: true },
      { source: "/blog/:slug", destination: "/:slug", permanent: true },

      // Legacy index files
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/home", destination: "/", permanent: true },

      // Retired project case studies
      {
        source: "/projects/apma-shipping",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/projects/npath-software",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/projects/carib-electrical",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/projects/sabi-construction",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/projects/hesabat-and-amwal",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/projects/tools-nest",
        destination: "/projects",
        permanent: true,
      },

      // WordPress RSS feed URLs for pages that still exist
      {
        source: "/ai-services-dubai/feed",
        destination: "/ai-services-dubai",
        permanent: true,
      },
      {
        source: "/ua300-installation-dubai/feed",
        destination: "/ua300-installation-dubai",
        permanent: true,
      },
      { source: "/:slug/feed", destination: "/:slug", permanent: true },
    ];
  },
};
export default nextConfig;
