'use client';

import { useEffect } from 'react';

/**
 * iOS Safari only applies :active (and reliably dispatches touch events) once
 * something in the document is listening for touchstart. This mounts that
 * listener once, and briefly flags the tapped `.card-glow` card so the
 * animated border shows on a tap even after the finger lifts, not just for
 * the instant it's pressed.
 */
export default function CardTouchActivation() {
  useEffect(() => {
    const noop = () => {};
    document.addEventListener('touchstart', noop, { passive: true });

    let activeCard: Element | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const onTouchStart = (e: TouchEvent) => {
      const card = (e.target as Element | null)?.closest?.('.card-glow') ?? null;
      if (activeCard && activeCard !== card) {
        activeCard.classList.remove('is-touch-active');
      }
      activeCard = card;
      if (timer) clearTimeout(timer);
      if (!card) return;

      card.classList.add('is-touch-active');
      timer = setTimeout(() => {
        card.classList.remove('is-touch-active');
        if (activeCard === card) activeCard = null;
      }, 600);
    };

    document.addEventListener('touchstart', onTouchStart, { passive: true });

    return () => {
      document.removeEventListener('touchstart', noop);
      document.removeEventListener('touchstart', onTouchStart);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return null;
}
