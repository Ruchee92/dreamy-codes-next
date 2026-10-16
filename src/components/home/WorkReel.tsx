"use client";
import { useEffect, useRef } from 'react';
import { ArrowLink, SecondaryButton } from './Buttons';
import { WORK } from './data';
import WorkCard from '../site/WorkCard';
import { gsap, ScrollTrigger, initReveals, lenisRef, playRise, playWipe, triggerOnce, useHomeMotion } from './motion';

/** Scroll px of dwell before the reel travels, and scroll px spent per px of sideways travel. Keep in sync with home.css. */
const REEL_DWELL = 140;
const REEL_RATIO = 0.38;

const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * Selected work. Desktop (fine pointer, motion allowed): the section pins and
 * the rail slides sideways with the scroll. Everything else gets a native
 * snap scroller (< 1024px) or a plain grid (reduced motion, touch desktops);
 * those layouts are pure CSS, this component only enhances them.
 */
const WorkReel = () => {
  const ref = useRef<HTMLElement>(null);

  useHomeMotion(ref, ({ desktop }, root) => {
    initReveals(root);

    const counterList = root.querySelector<HTMLElement>('.h-counter-list');
    const fill = root.querySelector<HTMLElement>('.h-progress-fill');
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.h-card'));
    const total = WORK.length;
    let active = -1;

    const setActive = (idx: number) => {
      const next = Math.max(0, Math.min(total - 1, idx));
      if (next === active || !counterList) return;
      active = next;
      gsap.to(counterList, { yPercent: -(next * 100) / total, duration: 0.4, ease: 'dc', overwrite: 'auto' });
    };
    const setFill = fill ? (gsap.quickSetter(fill, 'scaleX') as (v: number) => void) : null;
    setActive(0);

    if (!desktop) {
      // Native snap scroller: wipe each card in as it snaps into view, drive the HUD from scroll.
      const scroller = root.querySelector<HTMLElement>('.h-reel-scroller');
      if (!scroller) return;
      // First time the scroller is on screen, wipe every card in (staggered) so
      // the peeking ones are never empty boxes.
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          io.disconnect();
          cards.forEach((card, i) => {
            const media = card.querySelector<HTMLElement>('[data-wipe-m]');
            if (media && !media.classList.contains('is-in')) playWipe(media, media.querySelector('.h-card-stack'), i * 0.08);
          });
        },
        { threshold: 0.1 },
      );
      io.observe(scroller);

      let max = Math.max(1, scroller.scrollWidth - scroller.clientWidth);
      let raf = 0;
      const update = () => {
        raf = 0;
        const p = Math.max(0, Math.min(1, scroller.scrollLeft / max));
        setFill?.(p);
        setActive(Math.round(p * total));
      };
      const onScroll = () => {
        if (!raf) raf = requestAnimationFrame(update);
      };
      const ro = new ResizeObserver(() => {
        max = Math.max(1, scroller.scrollWidth - scroller.clientWidth);
      });
      ro.observe(scroller);
      scroller.addEventListener('scroll', onScroll, { passive: true });
      update();
      return () => {
        io.disconnect();
        ro.disconnect();
        scroller.removeEventListener('scroll', onScroll);
        if (raf) cancelAnimationFrame(raf);
      };
    }

    // .h-reel-pin is a tall wrapper; .h-reel-stage inside it is position: sticky.
    // Sticky (not a GSAP pin) keeps this a CSS-only hold: no fixed/static switch
    // at the ends, so no layout-shift entries and nothing to jitter under Lenis.
    const pin = root.querySelector<HTMLElement>('.h-reel-pin');
    const rail = root.querySelector<HTMLElement>('.h-reel-rail');
    const cursor = root.querySelector<HTMLElement>('.h-cursor');
    if (!pin || !rail) return;

    // The headline leads, the work follows: cards wipe in (left to right) just
    // after the heading's lines start to rise, never before it.
    const heading = root.querySelector<HTMLElement>('.h-reel-intro [data-rise]');
    const wipeCards = cards.filter((c) => c.hasAttribute('data-wipe-d'));
    // Fires on whichever comes first: the heading reaching 95% or the first
    // card's top reaching 88%, so the frames are never blank while on screen.
    let sequenced = false;
    const sequence = () => {
      if (sequenced) return;
      sequenced = true;
      if (heading) playRise(heading);
      wipeCards.forEach((card, i) => {
        if (!card.classList.contains('is-in')) playWipe(card, null, 0.45 + i * 0.08);
      });
    };
    if (heading) triggerOnce({ trigger: heading, start: 'top 95%' }, sequence);
    if (wipeCards[0]) triggerOnce({ trigger: wipeCards[0], start: 'top 88%' }, sequence);

    const travel = () => Math.max(0, rail.offsetWidth - window.innerWidth);
    let centers: number[] = [];

    const tween = gsap.to(rail, {
      x: () => -travel(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        // A short dwell first so the headline holds, then the rail travels at
        // REEL_RATIO of the scroll (the wrapper height in CSS matches this).
        start: `top+=${REEL_DWELL} top`,
        end: 'bottom bottom',
        scrub: 1,
        invalidateOnRefresh: true,
        onRefresh: () => {
          // CSS already estimates the travel; this makes the wrapper exact.
          pin.style.setProperty('--reel-travel', `${travel()}px`);
          centers = cards.slice(0, total).map((c) => c.offsetLeft + c.offsetWidth / 2);
        },
        onUpdate: (self) => {
          setFill?.(self.progress);
          if (!centers.length) return;
          const mid = self.progress * travel() + window.innerWidth / 2;
          let best = 0;
          let bestD = Infinity;
          for (let i = 0; i < centers.length; i++) {
            const d = Math.abs(centers[i] - mid);
            if (d < bestD) {
              bestD = d;
              best = i;
            }
          }
          setActive(best);
        },
      },
    });
    const st = tween.scrollTrigger as ScrollTrigger;

    // D-044: no in-frame drift/overscale; the mockups are composed edge-to-edge and must stay uncropped.

    // Keyboard: bring a focused, off-screen card into view by scrolling the page.
    const onFocusIn = (e: FocusEvent) => {
      const card = (e.target as Element).closest<HTMLElement>('.h-card');
      if (!card) return;
      const r = card.getBoundingClientRect();
      if (r.left >= 0 && r.right <= window.innerWidth) return;
      const y = st.start + Math.max(0, card.offsetLeft - 48) * REEL_RATIO;
      const lenis = lenisRef.current;
      if (lenis) lenis.scrollTo(y, { duration: 0.8 });
      else window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
    };
    pin.addEventListener('focusin', onFocusIn);

    // "Visit site" tag that follows the pointer over the frames.
    const frames = Array.from(root.querySelectorAll<HTMLElement>('.h-card-frame'));
    let offCursor = () => {};
    if (cursor) {
      gsap.set(cursor, { xPercent: -50, yPercent: -50, scale: 0.6, opacity: 0 });
      const qx = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
      const qy = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });
      const move = (e: PointerEvent) => {
        qx(e.clientX);
        qy(e.clientY);
      };
      const show = (e: PointerEvent) => {
        gsap.set(cursor, { x: e.clientX, y: e.clientY });
        gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
      };
      const hide = () => gsap.to(cursor, { scale: 0.6, opacity: 0, duration: 0.2, ease: 'power2.in', overwrite: 'auto' });
      frames.forEach((f) => {
        f.addEventListener('pointerenter', show);
        f.addEventListener('pointermove', move);
        f.addEventListener('pointerleave', hide);
      });
      offCursor = () =>
        frames.forEach((f) => {
          f.removeEventListener('pointerenter', show);
          f.removeEventListener('pointermove', move);
          f.removeEventListener('pointerleave', hide);
        });
    }

    return () => {
      pin.style.removeProperty('--reel-travel');
      pin.removeEventListener('focusin', onFocusIn);
      offCursor();
      if (cursor) gsap.set(cursor, { clearProps: 'all' });
    };
  }, { defer: true });

  // D-045: each desktop screenshot auto-scrolls (pure CSS keyframes) only while
  // its card is on screen and the tab is visible. Reduced motion never starts it.
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.h-card[data-screen]'));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.toggleAttribute('data-live', e.isIntersecting)),
      { threshold: 0.2 },
    );
    cards.forEach((c) => io.observe(c));
    const onVis = () => root.toggleAttribute('data-tab-hidden', document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      cards.forEach((c) => c.removeAttribute('data-live'));
    };
  }, []);

  return (
    <section ref={ref} className="h-reel" aria-labelledby="h-reel-title">
      {/* #portfolio is a marker 80px into the section, so the shared 80px anchor
          offset puts the section (and the pinned stage) flush with the top. */}
      <span id="portfolio" className="h-anchor" data-anchor-focus="h-reel-title" />
      <div className="h-reel-pin">
        <div className="h-reel-stage">
          <div className="h-reel-rail">
            <div className="h-reel-intro">
              <h2 id="h-reel-title" className="h-d-m" data-rise data-start="95%">
                <span className="h-line"><span className="h-line-in">Rocket fuel</span></span>{' '}
                <span className="h-line"><span className="h-line-in">for growing</span></span>{' '}
                <span className="h-line"><span className="h-line-in">your brand.</span></span>
              </h2>
              {/* D-018: the old headline lives on as the lede's opening sentence, in ink. */}
              <p className="h-lead h-muted h-reel-lead" data-fade>
                <span className="h-reel-lead-in">You handle the product. We convert the clicks.</span>
                <span className="h-reel-lead-more"> Have an awesome product? Let our Shopify experts execute a data-driven
                Shopify store redesign to accelerate your brand&rsquo;s revenue growth.</span>
              </p>
              <ArrowLink href="/our-work" className="h-reel-intro-link">
                View all work
              </ArrowLink>
            </div>

            <div className="h-reel-scroller" tabIndex={0} role="region" aria-label="Selected work">
              <ul className="h-reel-track">
                {WORK.map((item, i) => (
                  <WorkCard key={item.link} item={item} index={i} eager={false} />
                ))}
                <li className="h-card h-card--end" data-wipe-d>
                  <div className="h-card-end">
                    <h3 className="h-d-m">Curious to see more?</h3>
                    <SecondaryButton href="/our-work">See more work</SecondaryButton>
                  </div>
                </li>
              </ul>
            </div>

          </div>

          <div className="h-reel-hud h-container">
            <p className="h-label h-counter" aria-hidden="true">
              <span className="h-counter-mask">
                <span className="h-counter-list">
                  {WORK.map((_, i) => (
                    <span key={i}>{pad2(i + 1)}</span>
                  ))}
                </span>
              </span>
              <span className="h-counter-total">/ {pad2(WORK.length)}</span>
            </p>
            <span className="h-progress" aria-hidden="true">
              <span className="h-progress-fill" />
            </span>
          </div>

          <div className="h-reel-more">
            <SecondaryButton href="/our-work">See more work</SecondaryButton>
          </div>
        </div>
      </div>

      <div className="h-cursor" aria-hidden="true">
        Visit site <span>↗</span>
      </div>
    </section>
  );
};

export default WorkReel;
