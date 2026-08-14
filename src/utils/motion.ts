/**
 * True when the visitor has asked their operating system to reduce motion.
 * Safe to call during SSR, where it reports false.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Scrolls an element into view, animating only when the visitor has not asked
 * for reduced motion.
 *
 * The `scroll-behavior: auto !important` rule in globals.css cannot do this on
 * its own: a behaviour passed to scrollIntoView takes precedence over the CSS
 * property, so a hardcoded 'smooth' would still animate for everyone.
 */
export function scrollIntoViewRespectingMotionPreference(element: Element) {
  // "instant", not "auto": per spec "auto" defers to the CSS scroll-behavior
  // property, which is `smooth` on <html>, so it would still animate.
  element.scrollIntoView({
    behavior: prefersReducedMotion() ? "instant" : "smooth",
  });
}

/**
 * Window-level equivalent of the above, for "back to top" style jumps.
 */
export function scrollToRespectingMotionPreference(options: ScrollToOptions) {
  window.scrollTo({
    ...options,
    behavior: prefersReducedMotion() ? "instant" : "smooth",
  });
}
