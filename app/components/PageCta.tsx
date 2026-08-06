"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Cta = {
  id: number;
  heading: string;
  description: string;
  background_image: string;
  button_label: string;
  button_link: string;
  phone_number: string;
  whatsapp_link: string;
};

export default function PageCta() {
  const pathname = usePathname();
  const [ctas, setCtas] = useState<Cta[]>([]);

  useEffect(() => {
    let active = true;
    void fetch(`/api/page-cta?path=${encodeURIComponent(pathname)}`, {
      cache: "no-store",
    })
      .then((response) => response.json())
      .then((data) => {
        if (active) setCtas(data.ctas ?? []);
      })
      .catch(() => {
        if (active) setCtas([]);
      });
    return () => {
      active = false;
    };
  }, [pathname]);

  if (!ctas.length) return null;

  return (
    <div>
      {ctas.map((cta) => (
        <section key={cta.id} className="px-4 py-8 sm:px-6 lg:px-8">
          <div
            className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-[#091820] bg-cover bg-center px-6 py-16 text-center shadow-2xl sm:px-12 sm:py-20"
            style={
              cta.background_image
                ? {
                    backgroundImage: `linear-gradient(90deg,rgba(4,13,18,.9),rgba(4,13,18,.72)),url(${cta.background_image})`,
                  }
                : undefined
            }
          >
            <div className="relative z-10 mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
                {cta.heading}
              </h2>
              {cta.description && (
                <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300">
                  {cta.description}
                </p>
              )}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {cta.button_label && cta.button_link && (
                  <Link
                    href={cta.button_link}
                    className="rounded-xl bg-cyan-300 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
                  >
                    {cta.button_label}
                  </Link>
                )}
                {cta.phone_number && (
                  <a
                    href={`tel:${cta.phone_number.replace(/[^+\d]/g, "")}`}
                    className="rounded-xl border border-white/20 bg-black/20 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:border-cyan-300"
                  >
                    Call {cta.phone_number}
                  </a>
                )}
                {cta.whatsapp_link && (
                  <a
                    href={cta.whatsapp_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/15"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
