import { db } from "@/app/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const pathname = new URL(request.url).searchParams.get("path") || "/";
  const cleanPath = pathname.split("?")[0].replace(/^\/+|\/+$/g, "");
  const slug = cleanPath || "home";

  try {
    const result = await db.execute({
      sql: `SELECT c.id,c.heading,c.description,c.background_image,c.button_label,c.button_link,c.phone_number,c.whatsapp_link
            FROM ctas c JOIN pages p ON p.id=c.page_id
            WHERE c.visible=1 AND p.slug=? ORDER BY c.sort_order,c.id`,
      args: [slug],
    });
    return Response.json({ ctas: result.rows });
  } catch {
    return Response.json({ ctas: [] });
  }
}
