"use client";

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { scrollToRespectingMotionPreference } from '@/utils/motion';

// Appears once a quarter of the scrollable distance is behind the visitor.
const REVEAL_FRACTION = 0.25;

/**
 * Floating "back to top" control, mounted once in the root layout alongside the
 * WhatsApp widget.
 *
 * Sits bottom-left so it never overlaps that widget, which owns bottom-right.
 */
const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      // Scrollable distance, not total height: on a short page these are very
      // different numbers and the latter never reveals the button.
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      // Nothing to scroll back up to on a page that barely scrolls.
      if (scrollable < 200) {
        setIsVisible(false);
        return;
      }
      setIsVisible(window.scrollY > scrollable * REVEAL_FRACTION);
    };

    update();
    // Passive: this only reads scroll position and never calls preventDefault,
    // so it must not block the scroll it is measuring.
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => scrollToRespectingMotionPreference({ top: 0 })}
      aria-label="Back to top"
      // Kept mounted and hidden rather than unmounted, so the fade runs in both
      // directions. aria-hidden and tabIndex keep it off the a11y tree and out
      // of the tab order while it is invisible.
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      className={`fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-[90] print:hidden
        inline-flex h-12 w-12 items-center justify-center
        border border-brand-900 bg-white text-brand-900
        shadow-[0_6px_20px_rgba(0,0,0,0.12)]
        transition-all duration-300 ease-out
        hover:bg-[#3432c7] hover:border-[#3432c7] hover:text-white
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3432c7]
        ${isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-3 pointer-events-none'}`}
    >
      <ArrowUp size={20} strokeWidth={2.5} aria-hidden="true" />
    </button>
  );
};

export default BackToTop;
