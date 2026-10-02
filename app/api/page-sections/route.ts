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

/**
 * Custom content blocks an editor added to a page in the admin panel.
 * `hero` and `founder` sections are consumed directly by their own
 * components, so they're deliberately excluded here.
 */
export async function GET(request: Request) {
  const pathname = new URL(request.url).searchParams.get("path") || "/";
  const cleanPath = pathname.split("?")[0].replace(/^\/+|\/+$/g, "");
  const slug = cleanPath || "home";

  try {
    const result = await db.execute({
      sql: `SELECT s.id, s.name, s.content
            FROM page_sections s JOIN pages p ON p.id = s.page_id
            WHERE p.slug = ? AND s.section_type = 'custom'
              AND s.visible = 1 AND s.status = 'published'
            ORDER BY s.sort_order, s.id`,
      args: [slug],
    });
    const sections = result.rows.map((row) => {
      let content: Record<string, string> = {};
      try {
        content = JSON.parse(String(row.content ?? "{}"));
      } catch {
        content = {};
      }
      return {
        id: Number(row.id),
        name: String(row.name ?? ""),
        heading: String(content.heading ?? ""),
        text: String(content.text ?? ""),
        image_url: String(content.image_url ?? ""),
        button_label: String(content.button_label ?? ""),
        button_link: String(content.button_link ?? ""),
        // Chosen per block in the admin panel. Blocks saved before this
        // option existed have no value stored and have always rendered
        // above the FAQ, so that stays the default.
        placement: content.placement === "after_faq" ? "after_faq" : "before_faq",
      };
    });
    return Response.json({ sections }, { headers: CACHE_HEADERS });
  } catch {
    return Response.json({ sections: [] }, { headers: CACHE_HEADERS });
  }
}
