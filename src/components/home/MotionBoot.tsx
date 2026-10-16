"use client";
import { useLayoutEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, lenisRef, MQ_DESKTOP, holdDeferred, observeRolls, releaseDeferred, setDeferredDrain } from './motion';
import { cancelGlide, glideTo, safeRefresh, syncScrollCache } from './anchor';

/**
 * Inline script, rendered first inside .h-root. It runs while the HTML is parsed,
 * before anything below it paints, and flags the homepage root (not <html>, whose
 * attributes React hydrates) with data-motion when motion is allowed. Sections
 * that animate in start hidden only under that flag; a 2.5s failsafe un-hides
 * everything if the GSAP init never reports ready.
 */
export const MOTION_PRELUDE = `(function(){
  var s = document.currentScript, r = s && s.parentElement;
  if (!r || !window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
  r.setAttribute('data-motion', '');
  window.__hMotionReady = false;
  setTimeout(function(){ if (!window.__hMotionReady) r.setAttribute('data-failsafe', ''); }, 2500);
})();`;

type MotionWindow = Window & { __hMotionReady?: boolean };

const DARK_BANDS = '.h-proof, .h-caps-plate, footer, .pg-dark';

// Route bookkeeping for the scroll-to-top on menu clicks. The path (not a mount
// count) tells a client-side arrival from a cold load, so StrictMode's double
// mount in dev is not mistaken for a navigation. Back/forward keep their restore.
let lastPath: string | null = null;
let arrivedByHistory = false;
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    arrivedByHistory = true;
  });
}

/** Sets html[data-h-btt="dark"] while a dark band crosses the BackToTop button's line. */
function watchBehindBackToTop(html: HTMLElement) {
  const bands = Array.from(document.querySelectorAll(DARK_BANDS));
  let io: IntersectionObserver | null = null;
  const under = new Set<Element>();
  const build = () => {
    io?.disconnect();
    under.clear();
    const line = Math.max(0, window.innerHeight - 46);
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? under.add(e.target) : under.delete(e.target)));
        if (under.size) html.setAttribute('data-h-btt', 'dark');
        else html.removeAttribute('data-h-btt');
      },
      { rootMargin: `-${line}px 0px -45px 0px` },
    );
    bands.forEach((b) => io!.observe(b));
  };
  build();
  let t = 0;
  const onResize = () => {
    window.clearTimeout(t);
    t = window.setTimeout(build, 200);
  };
  window.addEventListener('resize', onResize);
  return () => {
    window.clearTimeout(t);
    window.removeEventListener('resize', onResize);
    io?.disconnect();
    html.removeAttribute('data-h-btt');
  };
}

/**
 * Page-level motion plumbing; mounted last so every section has created its
 * triggers first. Owns: the js-motion class (for client-side arrivals, where
 * the inline script does not run), Lenis (desktop fine pointer only), every
 * in-page anchor (glideTo, see anchor.ts), batched ScrollTrigger refreshes
 * after fonts, images and deferred scenes, and the ready flag the failsafe
 * waits for. Everything is undone on unmount so
 * navigating away leaves no scroll hijack, ticker or pin spacer behind.
 */
const MotionBoot = ({ immediate = false }: { immediate?: boolean }) => {
  useLayoutEffect(() => {
    // Queried rather than passed as a ref: a parent's ref is not attached yet
    // when a child's layout effect runs.
    const root = document.querySelector<HTMLElement>('.h-root');
    if (!root) return;
    const html = document.documentElement;
    const win = window as MotionWindow;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // A menu click (client-side push, no hash) starts the new page at the top.
    // Without this, the new Lenis starts from the old page's scroll position and
    // eases down to it after Next's own scroll-to-top, and the next trigger refresh
    // pins it mid-page. Cold loads and back/forward keep the browser's restore.
    const path = window.location.pathname;
    const clientArrival = lastPath !== null && lastPath !== path;
    if (clientArrival && !arrivedByHistory && window.location.hash.length <= 1) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
    // QA iter 8 M1: ScrollTrigger's cached scroll position can still be the old
    // page's after a client-side arrival; re-sync it to where the page really is
    // (the top after a menu click, the restored spot after Back), so a later
    // refresh does not "restore" the stale value.
    if (clientArrival) syncScrollCache();
    lastPath = path;
    arrivedByHistory = false;

    if (!reduce) root.setAttribute('data-motion', '');
    root.removeAttribute('data-failsafe');
    win.__hMotionReady = true;

    // Every display number's roll observer exists from mount (not in the idle
    // scene queue), so the plate and the first case card can never be late.
    const offRolls = reduce ? () => {} : observeRolls(root);

    // BackToTop (shared) takes the dark theme while a black band is behind its
    // own position (a 1px line ~46px above the bottom edge), not the nav's.
    const offBtt = watchBehindBackToTop(html);

    // Lenis: desktop + fine pointer + motion allowed. Re-evaluated on breakpoint change.
    const mm = gsap.matchMedia();
    mm.add(MQ_DESKTOP, () => {
      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      // Start from wherever the page actually is (top, after a menu click), not
      // from an animated value inherited mid-transition.
      lenis.scrollTo(window.scrollY, { immediate: true, force: true });
      lenisRef.current = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      return () => {
        gsap.ticker.remove(raf);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
        lenisRef.current = null;
      };
    });

    // Every same-page anchor (and the shared BackToTop) goes through glideTo, on
    // every path: Lenis or native, mouse, touch or keyboard.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const el = e.target as Element | null;
      if (el?.closest?.('button[aria-label="Back to top"]')) {
        e.preventDefault();
        e.stopPropagation();
        glideTo(null);
        return;
      }
      const a = el?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href')!;
      const id = decodeURIComponent(href.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (id && !target) return;
      e.preventDefault();
      e.stopPropagation();
      glideTo(target);
      // Keyboard users (skip link, in-page links) must land with focus on the target.
      if (target) {
        const focusEl = target.dataset.anchorFocus ? document.getElementById(target.dataset.anchorFocus) ?? target : target;
        if (!focusEl.hasAttribute('tabindex')) focusEl.setAttribute('tabindex', '-1');
        focusEl.focus({ preventScroll: true });
      }
      history.replaceState(null, '', id ? `#${id}` : window.location.pathname);
    };
    document.addEventListener('click', onClick, true);

    // Keyboard focus that lands off screen: a short glide instead of Lenis's
    // long catch-up (the reel handles its own cards).
    const onFocusIn = (e: FocusEvent) => {
      const lenis = lenisRef.current;
      const t = e.target as HTMLElement | null;
      if (!lenis || !t || t === document.body || t.closest('.h-reel-pin')) return;
      if (!t.matches(':focus-visible')) return;
      const r = t.getBoundingClientRect();
      if (r.top >= 96 && r.bottom <= window.innerHeight - 24) return;
      lenis.scrollTo(t, { offset: -160, duration: 0.6 });
    };
    document.addEventListener('focusin', onFocusIn);

    // Refresh trigger positions once fonts are in and after load (every image has
    // intrinsic dimensions, so image loads move nothing). Batched, run on idle,
    // never mid-scroll (a refresh is a full layout pass, ~170ms at 4x CPU; it
    // waits up to 3s for a pause) and never while an anchor glide owns the scroll.
    let lastScroll = 0;
    const onScroll = () => {
      lastScroll = performance.now();
      // A scroll (the visitor's, or a cold /#anchor jump) needs its scenes now.
      releaseDeferred();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const idleWin = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let refreshTimer = 0;
    let idleId = 0;
    let firstAsk = 0;
    const runRefresh = () => {
      const now = performance.now();
      if (now - lastScroll < 300 && now - firstAsk < 3000) {
        refreshTimer = window.setTimeout(runRefresh, 300);
        return;
      }
      firstAsk = 0;
      if (idleWin.requestIdleCallback) idleId = idleWin.requestIdleCallback(safeRefresh, { timeout: 500 });
      else safeRefresh();
    };
    const refresh = () => {
      if (!firstAsk) firstAsk = performance.now();
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(runRefresh, 200);
    };
    // D-009: below-the-fold scene builds wait for the hero shader to paint (it
    // gets the main thread first), the first scroll, or 1.8s, whichever is first.
    // `immediate` (inner pages): there is no shader to wait for.
    const releaseTimer = immediate ? 0 : window.setTimeout(releaseDeferred, 1800);
    if (immediate) releaseDeferred();
    else document.addEventListener('hero-backdrop-ready', releaseDeferred, { once: true });

    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    setDeferredDrain(refresh);

    // Arriving with a hash (/#contact, from another page or a cold load): jump
    // to it now, then hold it at its offset until the page has loaded and the
    // fonts are in (images, reel travel and fonts all move it).
    if (window.location.hash.length > 1) {
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (target) {
        const loaded = new Promise<void>((resolve) => {
          if (document.readyState === 'complete') resolve();
          else window.addEventListener('load', () => resolve(), { once: true });
        });
        const ready = Promise.all([loaded, document.fonts?.ready]).then(
          () => new Promise((r) => window.setTimeout(r, 400)),
        );
        // After this commit (Lenis now exists on desktop), not inside it.
        requestAnimationFrame(() => glideTo(target, { immediate: true, settleUntil: ready }));
      }
    }

    return () => {
      window.clearTimeout(releaseTimer);
      document.removeEventListener('hero-backdrop-ready', releaseDeferred);
      holdDeferred();
      window.clearTimeout(refreshTimer);
      if (idleId) idleWin.cancelIdleCallback?.(idleId);
      window.removeEventListener('scroll', onScroll);
      cancelGlide();
      offRolls();
      offBtt();
      setDeferredDrain(null);
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('focusin', onFocusIn);
      window.removeEventListener('load', refresh);
      mm.revert();
      // Safety net: nothing else on the site uses ScrollTrigger, so leave no pins behind.
      ScrollTrigger.getAll().forEach((t) => t.kill(true));
      root.removeAttribute('data-motion');
      root.removeAttribute('data-failsafe');
      html.removeAttribute('data-h-nav');
      win.__hMotionReady = undefined;
    };
  }, [immediate]);

  return null;
};

export default MotionBoot;
