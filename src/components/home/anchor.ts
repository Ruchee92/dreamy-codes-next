import { gsap, ScrollTrigger, lenisRef } from './motion';

/**
 * Anchor scrolling for the homepage (G1). One code path for every in-page
 * jump: hero CTA, sticky bar, mid-page CTAs, skip link, cold `/#contact`.
 *
 * Why not native `scrollIntoView({behavior:'smooth'})`: a ScrollTrigger
 * refresh (fonts, lazy images, the reel measuring its travel) restores the
 * scroll position synchronously and cancels a native glide wherever it is.
 * Here the glide is a tween that writes the scroll position every frame and
 * re-measures the target every frame, so layout can settle underneath it and a
 * refresh cannot stop it. After landing, a short settle phase keeps the target
 * at its offset until layout is quiet. Any user input hands control back.
 */

const NAV_OFFSET = -80;
const SETTLE_QUIET_MS = 700;
const SETTLE_MAX_MS = 5000;

/** Clears the fixed nav; an element can carry its own offset in data-anchor-offset. */
export const anchorOffset = (el: HTMLElement) => parseFloat(el.dataset.anchorOffset ?? String(NAV_OFFSET));

let busy = false;
let pendingRefresh = false;
let stopCurrent: (() => void) | null = null;

/** ScrollTrigger.refresh that waits while a glide owns the scroll position. */
/**
 * A ScrollTrigger refresh records the window's scroll position and restores it
 * afterwards, but it reads that position from a per-frame cache that can still
 * hold the previous page's value after a client-side navigation (no scroll
 * event reached it in between). On phones, menu -> /contact-us landed at 0 and
 * the next refresh jumped back to the old offset (QA iter 8 M1). Writing the
 * real position through the cached setter (a no-op scroll) re-syncs it.
 */
export function syncScrollCache() {
  ScrollTrigger.getScrollFunc(window)(window.scrollY);
}

export function safeRefresh() {
  if (busy) {
    pendingRefresh = true;
    return;
  }
  syncScrollCache();
  ScrollTrigger.refresh();
}

const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

const setScroll = (y: number) => {
  const lenis = lenisRef.current;
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
};

const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

/** Stops any glide/settle in progress (user input, unmount). */
export function cancelGlide() {
  stopCurrent?.();
}

/**
 * Scrolls so `el` sits at its anchor offset (or to the top for `null`).
 * `immediate`: jump, then settle (cold deep links, reduced motion).
 * `settleUntil`: keep the settle phase alive until this resolves (page load, fonts).
 */
export function glideTo(el: HTMLElement | null, opts: { immediate?: boolean; settleUntil?: Promise<unknown> } = {}) {
  cancelGlide();
  busy = true;

  const offset = el ? anchorOffset(el) : 0;
  const goal = () =>
    Math.round(Math.max(0, Math.min(maxScroll(), el ? el.getBoundingClientRect().top + window.scrollY + offset : 0)));

  let tween: gsap.core.Tween | null = null;
  let raf = 0;
  let stopped = false;

  const onKey = (e: KeyboardEvent) => {
    if (SCROLL_KEYS.has(e.key)) stop();
  };
  const listen = (on: boolean) => {
    const m = on ? 'addEventListener' : 'removeEventListener';
    window[m]('wheel', stop, { passive: true, capture: true } as AddEventListenerOptions);
    window[m]('touchstart', stop, { passive: true, capture: true } as AddEventListenerOptions);
    window[m]('keydown', onKey as EventListener, true);
  };

  function release() {
    busy = false;
    if (pendingRefresh) {
      pendingRefresh = false;
      ScrollTrigger.refresh();
    }
  }

  function stop() {
    if (stopped) return;
    stopped = true;
    tween?.kill();
    cancelAnimationFrame(raf);
    listen(false);
    if (stopCurrent === stop) stopCurrent = null;
    release();
  }

  // Settle: hold the target at its offset while layout finishes moving under it.
  const settle = () => {
    // Refreshes queued during the glide run now; the loop absorbs what they move.
    release();
    busy = true;
    const t0 = performance.now();
    let lastFix = t0;
    let waiting = !!opts.settleUntil;
    opts.settleUntil?.then(
      () => { waiting = false; lastFix = performance.now(); },
      () => { waiting = false; },
    );
    const loop = () => {
      if (stopped) return;
      const now = performance.now();
      const g = goal();
      if (Math.abs(g - window.scrollY) > 2) {
        setScroll(g);
        lastFix = now;
      }
      if ((!waiting && now - lastFix > SETTLE_QUIET_MS) || now - t0 > SETTLE_MAX_MS) {
        stop();
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  };

  stopCurrent = stop;
  listen(true);

  const from = window.scrollY;
  const dist = Math.abs(goal() - from);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (opts.immediate || reduce || dist < 2) {
    setScroll(goal());
    settle();
    return;
  }

  // ~0.8s for a screen or two, up to 1.4s for the whole page.
  const duration = Math.min(1.4, 0.75 + dist / 12000);
  const state = { p: 0 };
  tween = gsap.to(state, {
    p: 1,
    duration,
    ease: 'power3.inOut',
    onUpdate: () => setScroll(from + (goal() - from) * state.p),
    onComplete: () => {
      tween = null;
      settle();
    },
  });
}
