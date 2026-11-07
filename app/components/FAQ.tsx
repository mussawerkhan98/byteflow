"use client";

import { useId, useState } from "react";
import { highlight, matchesFaq } from "../lib/faq-search";

/** The words around the questions: the "FAQ section (all pages)" home block. */
export type FaqCopy = {
  eyebrow: string;
  heading: string;
  heading_soft: string;
  intro: string;
  all_label: string;
  help_title: string;
  help_text: string;
  call_label: string;
  whatsapp_label: string;
  search_label: string;
  empty_text: string;
};

/** tel: and WhatsApp links and the business hours, from Contact details & logo. */
export type FaqContact = { phone: string; whatsapp: string; hours?: string };

type Faq = { category: string; question: string; answer: string };

const PhoneIcon = () => (
  <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
    />
  </svg>
);

const WhatsAppIcon = () => (
  <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.8h-.01a9.8 9.8 0 01-5-1.37l-.36-.21-3.72.98 1-3.63-.24-.37a9.77 9.77 0 01-1.5-5.21c0-5.42 4.41-9.83 9.84-9.83 2.63 0 5.1 1.03 6.95 2.88a9.77 9.77 0 012.88 6.96c0 5.42-4.41 9.83-9.83 9.83m8.37-18.2A11.76 11.76 0 0012.05 0C5.5 0 .17 5.33.17 11.88c0 2.09.55 4.14 1.59 5.94L.07 24l6.33-1.66a11.85 11.85 0 005.65 1.44h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.24-6.16-3.48-8.4" />
  </svg>
);

/** Text with the words searched for picked out in cyan. */
function Marked({ text, query }: { text: string; query: string }) {
  return (
    <>
      {highlight(text, query).map((piece, i) =>
        piece.match ? (
          <mark key={i} className="rounded-[4px] bg-[rgba(44,205,222,0.22)] px-0.5 text-inherit">
            {piece.text}
          </mark>
        ) : (
          piece.text
        ),
      )}
    </>
  );
}

const QUESTION_ICON = (
  <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01" />
    <circle cx="12" cy="12" r="9.5" />
  </svg>
);

type Item = Faq & { number: number };

/** One question: a card that opens to show its answer at full height. */
function Question({ faq, open, onToggle, query, baseId }: { faq: Item; open: boolean; onToggle: () => void; query: string; baseId: string }) {
  return (
    <li
      className={`relative overflow-hidden rounded-[1.25rem] border transition-[border-color,background-color,box-shadow] duration-300 ${
        open
          ? "border-[#2CCDDE]/45 bg-[linear-gradient(160deg,rgba(44,205,222,0.09),var(--bg-surface)_60%)] shadow-[0_24px_50px_-30px_rgba(44,205,222,0.45)]"
          : "border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[#2CCDDE]/30"
      }`}
    >
      <h3>
        <button
          type="button"
          id={`${baseId}-q`}
          aria-expanded={open}
          aria-controls={`${baseId}-a`}
          onClick={onToggle}
          className="group flex w-full items-start gap-4 p-5 text-left"
        >
          <span
            className={`mt-px grid h-7 w-7 shrink-0 place-items-center rounded-lg font-mono text-[11px] font-semibold tabular-nums transition-colors ${
              open ? "bg-[#2CCDDE] text-[#04121A]" : "bg-[var(--overlay-hover)] text-[var(--text-dim)] group-hover:text-[#2CCDDE]"
            }`}
          >
            {String(faq.number).padStart(2, "0")}
          </span>
          <span className={`flex-1 pt-0.5 text-[15.5px] font-semibold leading-snug transition-colors ${open ? "text-[var(--text-primary)]" : "text-[var(--text-nav)] group-hover:text-[var(--text-primary)]"}`}>
            <Marked text={faq.question} query={query} />
          </span>
          <span
            aria-hidden="true"
            className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition-all duration-300 motion-reduce:transition-none ${
              open ? "rotate-45 bg-[linear-gradient(135deg,#2CCDDE,#46A3E1)] text-[#04121A]" : "border border-[var(--border-strong)] text-[var(--text-nav)] group-hover:border-[#2CCDDE] group-hover:text-[#2CCDDE]"
            }`}
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.6}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </span>
        </button>
      </h3>
      {/* Grows to the answer's own height, so long answers are never cut off. */}
      <div
        id={`${baseId}-a`}
        role="region"
        aria-labelledby={`${baseId}-q`}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pl-16">
            {faq.category && <p className="accent-ink mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em]">{faq.category}</p>}
            <p className="whitespace-pre-line text-[14.5px] leading-relaxed text-[var(--text-muted)]">
              <Marked text={faq.answer} query={query} />
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}

/**
 * The FAQ section on every page that has questions (PageFaq), laid out like a
 * help centre: the heading, a search box and topic tabs centred on top, the
 * questions below in two columns (one on phones), and a "Still have
 * questions?" bar along the bottom. Nothing is sticky, so the columns always
 * line up. Questions come from FAQs in the admin; the words around them from
 * the "FAQ section (all pages)" home block.
 */
export default function FAQ({ items, copy, contact }: { items: Faq[]; copy: FaqCopy; contact: FaqContact }) {
  const id = useId();
  // All closed to start, so the two columns sit level.
  const [open, setOpen] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const categories = Array.from(new Set(items.map((faq) => faq.category.trim()).filter(Boolean)));
  const inTopic = active ? items.filter((faq) => faq.category.trim() === active) : items;
  const shown: Item[] = inTopic.filter((faq) => matchesFaq(faq, query)).map((faq, i) => ({ ...faq, number: i + 1 }));
  // Two columns read top to bottom: the first half on the left, the rest on the right.
  const half = Math.ceil(shown.length / 2);
  const columns = shown.length > 3 ? [shown.slice(0, half), shown.slice(half)] : [shown];
  const autoOpen = query.trim() !== "" && shown.length === 1;

  if (!items.length) return null;

  const tab = (label: string, value: string | null, count: number) => {
    const on = active === value;
    return (
      <button
        key={label}
        type="button"
        aria-pressed={on}
        onClick={() => {
          setActive(value);
          setOpen(null);
        }}
        className={`inline-flex shrink-0 items-center gap-2 rounded-full py-2 pl-4 pr-2 text-[13.5px] font-semibold transition-colors duration-200 ${
          on ? "bg-[linear-gradient(135deg,#2CCDDE,#46A3E1)] text-[#04121A]" : "border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-nav)] hover:border-[#2CCDDE]/50 hover:text-[var(--text-primary)]"
        }`}
      >
        {label}
        <span className={`min-w-6 rounded-full px-1.5 py-0.5 text-center text-[11px] tabular-nums ${on ? "bg-[#04121A]/15" : "bg-[var(--overlay-hover)]"}`}>{count}</span>
      </button>
    );
  };

  return (
    <section aria-labelledby={`${id}-title`} className="faq-section relative overflow-hidden py-16 sm:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgba(44,205,222,0.1),transparent)]" />
      </div>

      <div className="page-container relative">
        {/* Heading on the left, intro and search on the right, as the other sections. */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <p className="accent-ink flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.18em]">
              <span aria-hidden="true" className="h-px w-10 bg-current" />
              {copy.eyebrow}
            </p>
            <h2 id={`${id}-title`} className="mt-5 text-balance text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl lg:text-[3.5rem]">
              {copy.heading} <span className="bg-[linear-gradient(100deg,#2CCDDE,#46A3E1)] bg-clip-text text-transparent">{copy.heading_soft}</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pb-1.5">
            {copy.intro && <p className="text-[16px] leading-relaxed text-[var(--text-muted)]">{copy.intro}</p>}
            <label className="relative mt-5 block">
              <span className="sr-only">{copy.search_label}</span>
              <svg aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2CCDDE]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setOpen(null);
                }}
                placeholder={`${copy.search_label}…`}
                className="w-full rounded-full border border-[var(--border-strong)] bg-[var(--bg-surface)] py-3 pl-11 pr-4 text-[15px] text-[var(--input-text)] outline-none transition-colors placeholder:text-[var(--text-dim)] focus:border-[#2CCDDE]/70"
              />
            </label>
          </div>
        </div>

        {/* Topics on the left, how many questions are showing on the right. */}
        <div className="mt-10 flex flex-col gap-3 border-b border-[var(--border-default)] pb-4 sm:flex-row sm:items-center sm:justify-between">
          {categories.length > 1 ? (
            <div role="group" aria-label="Filter questions by topic" className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
              {tab(copy.all_label, null, items.length)}
              {categories.map((category) => tab(category, category, items.filter((faq) => faq.category.trim() === category).length))}
            </div>
          ) : (
            <span />
          )}
          <p aria-live="polite" className="hidden shrink-0 font-mono text-[12px] font-medium tabular-nums text-[var(--text-dim)] sm:block">
            {String(shown.length).padStart(2, "0")} / {String(inTopic.length).padStart(2, "0")}
          </p>
        </div>

        {/* The questions, in two columns on wide screens. */}
        {shown.length ? (
          <div className={`mt-6 grid items-start gap-3 ${columns.length > 1 ? "lg:grid-cols-2 lg:gap-4" : ""}`}>
            {columns.map((column, c) => (
              <ol key={c} className="grid gap-3 lg:gap-4">
                {column.map((faq) => (
                  <Question
                    key={faq.question}
                    faq={faq}
                    open={autoOpen || open === faq.question}
                    onToggle={() => setOpen(open === faq.question ? null : faq.question)}
                    query={query}
                    baseId={`${id}-${faq.number}`}
                  />
                ))}
              </ol>
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-3 rounded-[1.5rem] border border-dashed border-[var(--border-strong)] px-6 py-12 text-center">
            <span aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-full bg-[rgba(44,205,222,0.1)] text-[#2CCDDE] [&_svg]:h-6 [&_svg]:w-6">
              {QUESTION_ICON}
            </span>
            <p className="max-w-sm text-[14.5px] leading-relaxed text-[var(--text-muted)]">{copy.empty_text}</p>
          </div>
        )}

        {/* Still have questions? Always dark, so it stands out on either theme. */}
        <div className="relative mt-10 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0b1520] p-6 text-white sm:p-7 lg:flex lg:items-center lg:justify-between lg:gap-8 lg:px-9">
          <div aria-hidden="true" className="absolute -left-16 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,rgba(44,205,222,0.3),transparent)]" />
          <div className="relative flex items-start gap-4">
            <span aria-hidden="true" className="hidden h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#2CCDDE,#46A3E1)] text-[#04121A] sm:grid [&_svg]:h-6 [&_svg]:w-6">
              {QUESTION_ICON}
            </span>
            <div>
              <p className="font-display text-[1.25rem] font-semibold">{copy.help_title}</p>
              {copy.help_text && <p className="mt-1 text-[14px] leading-relaxed text-white/65">{copy.help_text}</p>}
              {/* A plain clock, not a "live" light: the bar can't tell whether it is open right now. */}
              {contact.hours && (
                <p className="mt-2 flex items-center gap-2 text-[12.5px] text-white/60">
                  <svg aria-hidden="true" className="h-3.5 w-3.5 text-[#2CCDDE]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="9" />
                    <path strokeLinecap="round" d="M12 7v5l3 2" />
                  </svg>
                  {contact.hours}
                </p>
              )}
            </div>
          </div>
          <div className="relative mt-5 flex shrink-0 flex-wrap gap-2 lg:mt-0">
            <a href={contact.phone} className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#2CCDDE,#46A3E1)] px-5 py-2.5 text-[14px] font-semibold text-[#04121A] transition-transform hover:-translate-y-0.5">
              <PhoneIcon />
              {copy.call_label}
            </a>
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[14px] font-semibold transition-colors hover:border-[#25D366] hover:bg-[rgba(37,211,102,0.1)]"
            >
              <span className="text-[#25D366]">
                <WhatsAppIcon />
              </span>
              {copy.whatsapp_label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
