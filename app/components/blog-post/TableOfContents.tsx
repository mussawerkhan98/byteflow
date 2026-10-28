"use client";

import { useEffect, useRef, useState } from "react";
import type { TocItem } from "../../lib/post-article";

/** How far below the top of the window a heading counts as "current". */
const ACTIVATION_OFFSET = 140;

/**
 * The id of the section being read: the last heading that has scrolled above
 * the activation line. Read on animation frames from one scroll listener,
 * which stays correct for short sections an IntersectionObserver can skip.
 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  const key = ids.join("|");

  useEffect(() => {
    const list = key ? key.split("|") : [];
    if (!list.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = list[0];
      for (const id of list) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= ACTIVATION_OFFSET) current = id;
      }
      // At the very bottom the last short section may never reach the line.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        const last = document.getElementById(list[list.length - 1]);
        if (last && last.getBoundingClientRect().top < window.innerHeight) current = list[list.length - 1];
      }
      setActive((prev) => (prev === current ? prev : current));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
    };
  }, [key]);

  return active;
}

function TocList({
  items,
  active,
  onNavigate,
}: {
  items: TocItem[];
  active: string;
  onNavigate?: () => void;
}) {
  return (
    <ol className="post-toc-list">
      {items.map((item) => {
        const current = item.id === active;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={current ? "location" : undefined}
              className={`post-toc-link${current ? " is-active" : ""}`}
              onClick={onNavigate}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

/** Sticky "On this page" list for the desktop sidebar. */
export function DesktopToc({ items }: { items: TocItem[] }) {
  const active = useActiveSection(items.map((item) => item.id));
  if (!items.length) return null;
  return (
    <nav aria-labelledby="toc-heading-desktop" className="post-toc">
      <p id="toc-heading-desktop" className="post-eyebrow mb-3">
        On this page
      </p>
      <TocList items={items} active={active} />
    </nav>
  );
}

/** Collapsible list shown above the article on phones and tablets. */
export function MobileToc({ items }: { items: TocItem[] }) {
  const active = useActiveSection(items.map((item) => item.id));
  const details = useRef<HTMLDetailsElement>(null);
  if (!items.length) return null;
  const activeText = items.find((item) => item.id === active)?.text;
  return (
    <nav aria-label="On this page" className="lg:hidden mb-8">
      <details ref={details} className="post-toc-mobile">
        <summary>
          <span className="flex min-w-0 flex-col">
            <span className="post-eyebrow">On this page</span>
            {activeText && (
              <span className="truncate text-sm text-[var(--text-body)]">{activeText}</span>
            )}
          </span>
          <svg
            className="post-toc-chevron h-4 w-4 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="px-4 pb-4">
          <TocList
            items={items}
            active={active}
            onNavigate={() => details.current?.removeAttribute("open")}
          />
        </div>
      </details>
    </nav>
  );
}
