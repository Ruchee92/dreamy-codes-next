import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { SplitText } from 'gsap/SplitText';
import type Lenis from 'lenis';

// Plugins are registered once, client-side only. `dc` is the one entrance ease.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText);
  CustomEase.create('dc', '0.22,1,0.36,1');
  // The mobile URL bar showing/hiding must not trigger a full refresh mid-scroll.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, SplitText };

/** Pinned scenes, Lenis, magnetic buttons, cursor label: fine pointer on a desktop-width screen. */
export const MQ_DESKTOP =
  '(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
/** Everything else that still gets motion: lighter, native scroll. */
export const MQ_MOBILE =
  '(prefers-reduced-motion: no-preference) and (max-width: 1023px), ' +
  '(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (not (pointer: fine))';

/** Shared with the marquee and the testimonial rows so they can react to scroll speed. */
export const lenisRef: { current: Lenis | null } = { current: null };

/** `tall`: enough viewport height for the stacking case cards (they stick under the nav). */
export type MotionMode = { desktop: boolean; tall: boolean };

/**
 * Below-the-fold scenes are created off the critical path (G9/H7): held until
 * the hero shader has painted (D-009, see releaseDeferred), then one scene per
 * idle callback, or as soon as its section comes within 1.5 screens of the
 * viewport (early scroll, anchor glide), whichever is first. Each build is small
 * (tens of ms at 4x CPU), so an early scroll never meets one big task. Scenes
 * are built top-down; only if one was built ahead of an unbuilt scene above it
 * (whose layout may still change, e.g. the reel's travel) is ScrollTrigger
 * refreshed once at the end.
 */
type Job = { run: () => void; done: boolean };
const queue: Job[] = [];
const order: Job[] = [];
/** Scenes that came within reach while the queue was held: built first on release. */
const near: Job[] = [];
let outOfOrder = false;
let pumping = false;
let released = false;
let onDrain: (() => void) | null = null;

/**
 * D-009: the hero shader gets the main thread first. Deferred scenes are held
 * until MotionBoot releases them (shader painted, first scroll or a timeout,
 * whichever comes first). Scenes that came within reach meanwhile are then
 * built at once, in page order; the rest go back to one per idle callback.
 */
export function releaseDeferred() {
  if (released) return;
  released = true;
  const urgent = order.filter((j) => near.includes(j) && !j.done);
  near.length = 0;
  urgent.forEach((j) => {
    j.done = true;
    j.run();
  });
  // Built ahead of the queue: one batched refresh once everything exists.
  if (urgent.length) outOfOrder = true;
  if (queue.some((j) => !j.done)) schedule();
  else if (outOfOrder) {
    outOfOrder = false;
    onDrain?.();
  }
}

/** Re-arms the hold (MotionBoot unmount), so the next visit to the page holds again. */
export function holdDeferred() {
  released = false;
  near.length = 0;
}

/** MotionBoot registers what to do once every deferred scene exists. */
export function setDeferredDrain(fn: (() => void) | null) {
  onDrain = fn;
}

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
};

function pump() {
  pumping = false;
  const job = queue.shift();
  if (job && !job.done) {
    job.done = true;
    job.run();
  }
  if (queue.length) schedule();
  else if (outOfOrder) {
    outOfOrder = false;
    onDrain?.();
  }
}

function schedule() {
  if (pumping || !released) return;
  pumping = true;
  const w = window as IdleWindow;
  if (w.requestIdleCallback) w.requestIdleCallback(pump, { timeout: 400 });
  else window.setTimeout(pump, 32);
}

/**
 * Runs `setup` inside gsap.matchMedia scoped to `scope`. Everything GSAP creates
 * in there (tweens, ScrollTriggers) is reverted when the breakpoint flips or the
 * component unmounts. Under reduced motion neither branch matches, so nothing
 * is created and the static page stays as-is. `defer` moves the first run off
 * the hydration task (see above); pre-hidden content in a deferred section is
 * only ever below the fold until it runs.
 */
export function useHomeMotion(
  scope: RefObject<HTMLElement | null>,
  setup: (mode: MotionMode, root: HTMLElement) => void | (() => void),
  opts: { defer?: boolean } = {},
) {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    const mm = gsap.matchMedia(root);
    const start = () =>
      mm.add({ desktop: MQ_DESKTOP, mobile: MQ_MOBILE, tall: '(min-height: 821px)' }, (ctx) => {
        const c = ctx.conditions as { desktop?: boolean; mobile?: boolean; tall?: boolean };
        // `tall` alone must not start anything: reduced motion matches neither of the others.
        if (!c.desktop && !c.mobile) return;
        return setup({ desktop: !!c.desktop, tall: !!c.tall }, root);
      });

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!opts.defer || reduce) {
      start();
      return () => mm.revert();
    }

    const job: Job = { run: start, done: false };
    queue.push(job);
    order.push(job);
    schedule();
    const nearIO = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        nearIO.disconnect();
        if (job.done) return;
        if (!released) {
          near.push(job);
          return;
        }
        job.done = true;
        if (order.slice(0, order.indexOf(job)).some((j) => !j.done)) outOfOrder = true;
        start();
      },
      { rootMargin: '150% 0px 150% 0px' },
    );
    nearIO.observe(root);
    return () => {
      job.done = true;
      const i = order.indexOf(job);
      if (i >= 0) order.splice(i, 1);
      const n = near.indexOf(job);
      if (n >= 0) near.splice(n, 1);
      nearIO.disconnect();
      mm.revert();
    };
    // The setup closure is created once per mount on purpose: it only touches refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

type OnceVars = {
  trigger: gsap.DOMTarget;
  start: string | number | (() => string | number);
};

/**
 * Fires `run` exactly once when the scroll position reaches `start`, including
 * when the page loads already past it. `end: 'max'` keeps a fast scroll that
 * jumps beyond the trigger from skipping the callback.
 */
export function triggerOnce(vars: OnceVars, run: () => void): ScrollTrigger {
  let fired = false;
  const fire = () => {
    if (fired) return;
    fired = true;
    run();
  };
  const st = ScrollTrigger.create({
    trigger: vars.trigger,
    start: vars.start,
    end: 'max',
    once: true,
    invalidateOnRefresh: typeof vars.start === 'function',
    onEnter: fire,
  });
  if (st.scroll() >= st.start) fire();
  return st;
}

/**
 * Numbers (G3): the final string is the only value ever shown. Each glyph sits
 * in a mask and rolls up into place, staggered, the first time the number is
 * actually on screen (IntersectionObserver, so sticky cards report their real
 * position). Nothing is pre-hidden outside [data-motion]; SSR, no-JS, reduced
 * motion and the failsafe all show the final value.
 */
export function playRoll(el: HTMLElement, delay = 0) {
  const glyphs = el.querySelectorAll('.h-glyph');
  gsap.fromTo(
    glyphs,
    // y: 0 explicitly: GSAP otherwise reads the CSS pre-hide translate into `y`
    // and keeps it while yPercent animates, holding the glyph hidden to the end.
    { yPercent: 125, y: 0 },
    {
      yPercent: 0,
      y: 0,
      duration: 0.55,
      ease: 'dc',
      stagger: 0.03,
      delay,
      onComplete: () => {
        el.classList.add('is-in');
        gsap.set(glyphs, { clearProps: 'transform' });
      },
    },
  );
}

/**
 * Plays every [data-roll] in `root` just before it enters the viewport (12%
 * below the fold), so at normal scroll speeds the roll is already landing when
 * the number appears (H1: never blank > 300ms while visible). `stagger` delays
 * siblings that enter together.
 */
export function observeRolls(root: Element, stagger = 0.06) {
  const els = Array.from(root.querySelectorAll<HTMLElement>('[data-roll]:not(.is-in)'));
  if (!els.length) return () => {};
  const io = new IntersectionObserver(
    (entries) => {
      const entering = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
      entering.forEach((el, k) => {
        io.unobserve(el);
        playRoll(el, k * stagger);
      });
    },
    // Sideways too (D-017 case slider): the peeking next card's numbers roll before it slides in.
    { rootMargin: '0px 25% 12% 25%' },
  );
  els.forEach((el) => io.observe(el));
  return () => io.disconnect();
}

/**
 * D-038 count-up (as on the original site): "$2M+" counts $100K → $2M, "300+"
 * 0 → 300, "2.4x" 0.0 → 2.4, "4%" 0 → 4. The final value is server-rendered and
 * only swapped for the start value at the moment the number is on screen, so
 * nothing off screen ever reads as zero. Always ends on the exact final string.
 */
function countFrames(final: string): (p: number) => string {
  const m = final.match(/^(\$?)([\d.]+)(.*)$/);
  if (!m) return () => final;
  const [, prefix, num, suffix] = m;
  const target = parseFloat(num);
  if (prefix === '$' && suffix.startsWith('M')) {
    // Dollars, printed compactly like the original ($100K+ … $1.9M+ … $2M+).
    const from = 100_000;
    const to = target * 1_000_000;
    const rest = suffix.slice(1);
    return (p) => {
      if (p >= 1) return final;
      const v = from + (to - from) * p;
      return v >= 1_000_000 ? `$${(Math.floor(v / 100_000) / 10).toFixed(1)}M${rest}` : `$${Math.floor(v / 1000)}K${rest}`;
    };
  }
  const decimals = num.includes('.') ? num.split('.')[1].length : 0;
  return (p) => (p >= 1 ? final : `${prefix}${(Math.floor(target * p * 10 ** decimals) / 10 ** decimals).toFixed(decimals)}${suffix}`);
}

/**
 * Plays one [data-countup] (a `Num mode="count"`) now, with the same curve as
 * observeCounts. For pages that sequence a count after something else (the
 * /case-studies ledger); always lands on the exact final string.
 */
export function playCount(el: HTMLElement, delay = 0): gsap.core.Tween | null {
  const out = el.querySelector<HTMLElement>('.h-count');
  const final = el.dataset.countup ?? '';
  if (!out || el.classList.contains('is-in')) return null;
  const frame = countFrames(final);
  const state = { p: 0 };
  out.textContent = frame(0);
  return gsap.to(state, {
    p: 1,
    duration: 1.8,
    ease: 'power2.out',
    delay,
    onUpdate: () => {
      out.textContent = frame(state.p);
    },
    onComplete: () => {
      out.textContent = final;
      el.classList.add('is-in');
    },
  });
}

export function observeCounts(root: Element, stagger = 0.12) {
  const els = Array.from(root.querySelectorAll<HTMLElement>('[data-countup]:not(.is-in)'));
  if (!els.length) return () => {};
  const tweens: gsap.core.Tween[] = [];
  const io = new IntersectionObserver(
    (entries) => {
      const entering = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
      entering.forEach((el, k) => {
        io.unobserve(el);
        const out = el.querySelector<HTMLElement>('.h-count');
        const final = el.dataset.countup ?? '';
        if (!out) return;
        const frame = countFrames(final);
        const state = { p: 0 };
        out.textContent = frame(0);
        tweens.push(
          gsap.to(state, {
            p: 1,
            duration: 1.8,
            ease: 'power2.out',
            delay: k * stagger,
            onUpdate: () => {
              out.textContent = frame(state.p);
            },
            onComplete: () => {
              out.textContent = final;
              el.classList.add('is-in');
            },
          }),
        );
      });
    },
    { threshold: 0.5 },
  );
  els.forEach((el) => io.observe(el));
  return () => {
    io.disconnect();
    tweens.forEach((t) => t.kill());
    els.forEach((el) => {
      const out = el.querySelector<HTMLElement>('.h-count');
      if (out && el.dataset.countup) out.textContent = el.dataset.countup;
    });
  };
}

const STAGGER_ATTR = 'delay';

/**
 * The three verbs plus paragraphs. Elements carry data-rise / data-wipe /
 * data-draw / data-fade; the CSS pre-hides them only under
 * [data-motion] on .h-root and each tween ends by adding `is-in`, so the hidden state
 * is gone for good (also after a breakpoint re-run).
 */
export function initReveals(root: Element) {
  const delayOf = (el: HTMLElement) => parseFloat(el.dataset[STAGGER_ATTR] ?? '0') || 0;
  const startOf = (el: HTMLElement, fallback: string) => el.dataset.start ?? fallback;

  root.querySelectorAll<HTMLElement>('[data-rise]').forEach((el) => {
    if (el.classList.contains('is-in')) return;
    triggerOnce({ trigger: el, start: `top ${startOf(el, '82%')}` }, () => playRise(el, delayOf(el)));
  });

  root.querySelectorAll<HTMLElement>('[data-fade]').forEach((el) => {
    if (el.classList.contains('is-in')) return;
    triggerOnce({ trigger: el, start: `top ${startOf(el, '88%')}` }, () => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'dc',
          delay: 0.15 + delayOf(el),
          onComplete: () => {
            el.classList.add('is-in');
            gsap.set(el, { clearProps: 'opacity,transform' });
          },
        },
      );
    });
  });

  // Inner pages: where a [data-parallax] scene owns the image's transform
  // (desktop), the wipe animates the clip only. Home has no [data-parallax].
  const parallaxOn = window.matchMedia(MQ_DESKTOP).matches;
  root.querySelectorAll<HTMLElement>('[data-wipe]').forEach((el) => {
    if (el.classList.contains('is-in')) return;
    const owned = parallaxOn && (el.matches('[data-parallax]') || !!el.querySelector('[data-parallax]'));
    // The image is looked up when the wipe plays (it may mount late: NearImage, D-073).
    triggerOnce({ trigger: el, start: `top ${startOf(el, '85%')}` }, () => playWipe(el, owned ? null : el.querySelector('img'), delayOf(el)));
  });

  root.querySelectorAll<HTMLElement>('[data-draw]').forEach((el) => {
    if (el.classList.contains('is-in')) return;
    triggerOnce({ trigger: el, start: `top ${startOf(el, '90%')}` }, () => playDraw(el, delayOf(el)));
  });
}

/** Heading lines rise in their masks. Plays once, whoever asks first (scroll trigger or a sequence). */
export function playRise(el: HTMLElement, delay = 0) {
  if (el.classList.contains('is-in') || el.dataset.playing) return;
  el.dataset.playing = '';
  gsap.fromTo(
    el.querySelectorAll('.h-line-in'),
    { yPercent: 105, y: 0 },
    {
      yPercent: 0,
      duration: 0.9,
      ease: 'dc',
      stagger: 0.08,
      delay,
      onComplete: () => {
        el.classList.add('is-in');
        delete el.dataset.playing;
      },
    },
  );
}

export function playWipe(el: HTMLElement, img: Element | null, delay = 0) {
  gsap.fromTo(
    el,
    { clipPath: 'inset(0 0 100% 0)' },
    {
      clipPath: 'inset(0 0 0% 0)',
      duration: 1,
      ease: 'dc',
      delay,
      onComplete: () => {
        el.classList.add('is-in');
        gsap.set(el, { clearProps: 'clipPath' });
      },
    },
  );
  if (img) {
    gsap.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1, ease: 'dc', delay, onComplete: () => { gsap.set(img, { clearProps: 'transform' }); } });
  }
}

export function playDraw(el: HTMLElement, delay = 0) {
  gsap.fromTo(
    el,
    { scaleX: 0, transformOrigin: 'left center' },
    {
      scaleX: 1,
      duration: 0.8,
      ease: 'dc',
      delay,
      onComplete: () => {
        el.classList.add('is-in');
        gsap.set(el, { clearProps: 'transform' });
      },
    },
  );
}

/**
 * Magnetic hover for the primary CTA (pointer: fine only; caller guards).
 * The button follows the pointer by up to 6px, its label 3px more.
 */
export function magnetic(button: HTMLElement) {
  const label = button.querySelector<HTMLElement>('.h-btn-label');
  const pad = 24;
  const bx = gsap.quickTo(button, 'x', { duration: 0.45, ease: 'power3' });
  const by = gsap.quickTo(button, 'y', { duration: 0.45, ease: 'power3' });
  const lx = label ? gsap.quickTo(label, 'x', { duration: 0.45, ease: 'power3' }) : null;
  const ly = label ? gsap.quickTo(label, 'y', { duration: 0.45, ease: 'power3' }) : null;

  const onMove = (e: PointerEvent) => {
    const r = button.getBoundingClientRect();
    const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2 + pad);
    const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2 + pad);
    const cx = Math.max(-1, Math.min(1, nx));
    const cy = Math.max(-1, Math.min(1, ny));
    bx(cx * 6);
    by(cy * 6);
    lx?.(cx * 3);
    ly?.(cy * 3);
  };
  const reset = () => {
    gsap.to([button, label].filter(Boolean), { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.5)', overwrite: 'auto' });
  };

  // The hit area is the button plus 24px: a pseudo-free approach, so listen on
  // the window only while the pointer is near, via enter/leave on the parent.
  const zone = button.parentElement as HTMLElement;
  zone.addEventListener('pointermove', onMove);
  zone.addEventListener('pointerleave', reset);
  return () => {
    zone.removeEventListener('pointermove', onMove);
    zone.removeEventListener('pointerleave', reset);
    gsap.set([button, label].filter(Boolean), { clearProps: 'transform' });
  };
}

/**
 * Flips the (shared, unedited) nav to its dark treatment while a black chapter
 * is under it: sets html[data-h-nav="dark"], styled in home.css (desktop and mobile).
 */
export function navOverDark(el: Element) {
  const html = document.documentElement;
  const on = () => html.setAttribute('data-h-nav', 'dark');
  const off = () => html.removeAttribute('data-h-nav');
  ScrollTrigger.create({
    trigger: el,
    start: 'top 40px',
    end: 'bottom 40px',
    onEnter: on,
    onEnterBack: on,
    onLeave: off,
    onLeaveBack: off,
  });
  return off;
}
