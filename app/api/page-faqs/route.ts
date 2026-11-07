import { readContent } from "@/app/lib/db";
import { getSiteFigures, getSiteSettings } from "@/app/lib/cms";
import { getHomeBlock } from "@/app/lib/home-blocks";
import { fillDeep } from "@/app/lib/site-figures";

const DEFAULT_PHONE = "+971 54 328 2042";
const DEFAULT_WHATSAPP = "https://wa.me/971543282042";

/** The section's words (home_faq) and the numbers its help card dials. */
async function faqFrame() {
  const [block, settings] = await Promise.all([getHomeBlock("home_faq"), getSiteSettings()]);
  const phone = String(settings?.header_phone || "") || DEFAULT_PHONE;
  return {
    copy: block.fields,
    contact: {
      phone: `tel:${phone.replace(/[^+\d]/g, "")}`,
      whatsapp: String(settings?.whatsapp_link || "") || DEFAULT_WHATSAPP,
      // When someone will pick up; shown on the help card when set.
      hours: String(settings?.business_hours || "").trim(),
    },
  };
}

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
    const [result, figures] = await Promise.all([
      readContent({
        sql: `SELECT f.id,f.category,f.question,f.answer
              FROM faqs f JOIN pages p ON p.id=f.page_id
              WHERE f.active=1 AND p.slug=? ORDER BY f.sort_order,f.id`,
        args: [slug],
      }),
      getSiteFigures(),
    ]);
    // Answers can quote the site-wide figures ({clients}, {founded}, …).
    const faqs = result.rows.map((row) => fillDeep({ ...row }, figures));
    // The section's words are only needed when there are questions to show.
    return Response.json({ faqs, ...(faqs.length ? await faqFrame() : {}) }, { headers: CACHE_HEADERS });
  } catch {
    return Response.json({ faqs: [] }, { headers: CACHE_HEADERS });
  }
}
