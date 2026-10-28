"use client";

import { useEffect, useRef } from "react";

/**
 * A thin bar across the top of the window that fills as the article is read.
 *
 * Measures the article element rather than the whole document, so the bar
 * reaches the end when the reader finishes the text -- not after scrolling
 * past the related posts, FAQs and footer. Writes the width straight to the
 * element on animation frames instead of through React state, so scrolling
 * never re-renders anything.
 */
export default function ReadingProgress({ targetId }: { targetId: string }) {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = document.getElementById(targetId);
    const el = bar.current;
    if (!target || !el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = target.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const read = total > 0 ? -rect.top / total : rect.top <= 0 ? 1 : 0;
      const value = Math.min(1, Math.max(0, read));
      el.style.transform = `scaleX(${value})`;
      el.parentElement?.setAttribute("aria-valuenow", String(Math.round(value * 100)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [targetId]);

  return (
    <div
      className="fixed inset-x-0 top-0 z-[80] h-[3px] pointer-events-none"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <div
        ref={bar}
        className="h-full w-full origin-left"
        style={{
          transform: "scaleX(0)",
          background: "linear-gradient(90deg, #2CCDDE, #46A3E1)",
        }}
      />
    </div>
  );
}
