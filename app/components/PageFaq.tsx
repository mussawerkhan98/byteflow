"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import FAQ from "./FAQ";
import { services } from "../lib/services-data";

type FaqItem = {
  id: number;
  category: string;
  question: string;
  answer: string;
};

// The 9 original services render their own FAQ section (via
// ServicePageTemplate/ServiceFAQ) already merged with any CMS-added
// questions for that page. Rendering this global block there too used to
// show a second, duplicate FAQ section underneath — so it's skipped here.
const SERVICE_PAGE_PATHS = new Set(services.map((s) => `/${s.slug}`));

export default function PageFaq() {
  const pathname = usePathname();
  const [items, setItems] = useState<FaqItem[]>([]);
  const skip = SERVICE_PAGE_PATHS.has(pathname);

  useEffect(() => {
    if (skip) return;
    let active = true;
    void fetch(`/api/page-faqs?path=${encodeURIComponent(pathname)}`, {
      cache: "no-store",
    })
      .then((response) => response.json())
      .then((data) => {
        if (active) setItems(data.faqs ?? []);
      })
      .catch(() => {
        if (active) setItems([]);
      });
    return () => {
      active = false;
    };
  }, [pathname, skip]);

  if (skip) return null;

  return <FAQ items={items} fallback={false} />;
}
