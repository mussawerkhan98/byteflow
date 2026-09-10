import { db } from "@/app/lib/db";

export const dynamic = "force-dynamic";

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
      };
    });
    return Response.json({ sections });
  } catch {
    return Response.json({ sections: [] });
  }
}
