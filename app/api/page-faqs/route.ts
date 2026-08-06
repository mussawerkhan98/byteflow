import { db } from "@/app/lib/db";

export const dynamic = "force-dynamic";

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
    return Response.json({ faqs: result.rows });
  } catch {
    return Response.json({ faqs: [] });
  }
}
