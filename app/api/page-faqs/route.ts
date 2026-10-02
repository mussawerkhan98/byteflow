import { db } from "@/app/lib/db";

/**
 * Cached at the edge for an hour, with a day of stale-while-revalidate.
 *
 * `revalidate` alone cannot cache this: reading the `path` search parameter
 * off the request makes the handler dynamic, so Next renders it per request
 * and only the CDN can spare the function invocation. The header below is
 * what actually does that on Vercel; `revalidate` applies if the handler
 * ever stops reading the request.
 */
export const revalidate = 3600;

const CACHE_HEADERS = {
  "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
} as const;

export async function GET(request: Request) {
  const pathname = new URL(request.url).searchParams.get("path") || "/";
  const cleanPath = pathname.split("?")[0].replace(/^\/+|\/+$/g, "");
  const slug = cleanPath || "home";

  try {
    const result = await db.execute({
      sql: `SELECT f.id,f.category,f.question,f.answer
            FROM faqs f JOIN pages p ON p.id=f.page_id
            WHERE f.active=1 AND p.slug=? ORDER BY f.sort_order,f.id`,
      args: [slug],
    });
    return Response.json({ faqs: result.rows }, { headers: CACHE_HEADERS });
  } catch {
    return Response.json({ faqs: [] }, { headers: CACHE_HEADERS });
  }
}
