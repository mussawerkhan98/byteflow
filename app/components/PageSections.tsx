"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { services } from "../lib/services-data";
import PageSectionCards, {
  hasContent,
  placementOf,
  type PageSection,
  type Placement,
} from "./PageSectionCards";

// The 9 original service pages fetch their own blocks on the server and
// render them inside ServicePageTemplate, so the content is in the HTML
// rather than appearing only after this component has run in the browser.
// Skipping here is what stops those pages showing every block twice.
const SERVICE_PAGE_PATHS = new Set(services.map((s) => `/${s.slug}`));

/**
 * Content blocks added to a page from the admin panel, for every page that
 * isn't one of the 9 static service pages. Rendered near the bottom of
 * whichever page they were assigned to.
 *
 * `placement` picks which blocks this copy renders. Each page is rendered
 * with one copy above the FAQ and one below it, and every block chooses
 * which of the two it belongs to in the admin panel.
 */
export default function PageSections({
  placement = "before_faq",
}: { placement?: Placement } = {}) {
  const pathname = usePathname();
  const [sections, setSections] = useState<PageSection[]>([]);
  const skip = SERVICE_PAGE_PATHS.has(pathname);

  useEffect(() => {
    if (skip) return;
    let active = true;
    void fetch(`/api/page-sections?path=${encodeURIComponent(pathname)}`, {
      cache: "no-store",
    })
      .then((response) => response.json())
      .then((data) => {
        if (active) setSections(data.sections ?? []);
      })
      .catch(() => {
        if (active) setSections([]);
      });
    return () => {
      active = false;
    };
  }, [pathname, skip]);

  if (skip) return null;

  return (
    <PageSectionCards
      sections={sections.filter(
        (section) => placementOf(section) === placement && hasContent(section),
      )}
    />
  );
}
