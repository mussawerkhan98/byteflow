"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import FAQ from "./FAQ";

type FaqItem = {
  id: number;
  category: string;
  question: string;
  answer: string;
};

export default function PageFaq() {
  const pathname = usePathname();
  const [items, setItems] = useState<FaqItem[]>([]);

  useEffect(() => {
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
  }, [pathname]);

  return <FAQ items={items} fallback={false} />;
}
