"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Section = {
  id: number;
  name: string;
  heading: string;
  text: string;
  image_url: string;
  button_label: string;
  button_link: string;
};

/**
 * Content blocks added to a page from the admin panel. Rendered near the
 * bottom of whichever page they were assigned to. Every part is optional,
 * and anything empty is skipped rather than leaving a gap.
 */
export default function PageSections() {
  const pathname = usePathname();
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
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
  }, [pathname]);

  const shown = sections.filter(
    (section) => section.heading || section.text || section.image_url,
  );
  if (!shown.length) return null;

  return (
    <div>
      {shown.map((section) => (
        <section key={section.id} className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div
              className="overflow-hidden rounded-3xl"
              style={{
                background:
                  "linear-gradient(160deg, rgba(44,205,222,0.06) 0%, var(--bg-surface) 100%)",
                border: "1px solid rgba(44,205,222,0.15)",
              }}
            >
              <div
                className={`grid grid-cols-1 ${section.image_url ? "lg:grid-cols-2" : ""}`}
              >
                {section.image_url && (
                  <div className="relative h-64 lg:h-auto lg:min-h-[320px]">
                    <Image
                      src={section.image_url}
                      alt={section.heading || section.name}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col justify-center gap-5 p-8 sm:p-12">
                  {section.heading && (
                    <h2 className="text-3xl font-bold leading-tight text-[var(--text-primary)] sm:text-4xl">
                      {section.heading}
                    </h2>
                  )}
                  {section.text && (
                    <div className="flex flex-col gap-4">
                      {section.text
                        .split(/\n\s*\n/)
                        .map((paragraph) => paragraph.trim())
                        .filter(Boolean)
                        .map((paragraph) => (
                          <p
                            key={paragraph}
                            className="text-base leading-relaxed text-[var(--text-body)]"
                          >
                            {paragraph}
                          </p>
                        ))}
                    </div>
                  )}
                  {section.button_label && section.button_link && (
                    <Link
                      href={section.button_link}
                      className="inline-flex w-fit items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-bold text-black transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_36px_rgba(44,205,222,0.5)]"
                      style={{
                        background: "linear-gradient(135deg, #2CCDDE, #46A3E1)",
                      }}
                    >
                      {section.button_label}
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
