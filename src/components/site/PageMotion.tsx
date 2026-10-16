"use client";
import { useEffect, useLayoutEffect } from 'react';
import { gsap, MQ_DESKTOP, MQ_MOBILE, initReveals, magnetic, navOverDark, playWipe, triggerOnce } from '../home/motion';

/**
 * The shared motion layer of every inner page (mounted by PageShell, after the
 * page's own sections, so page scenes such as pins exist before the reveals
 * below them are measured). Pages only mark up; this owns:
 * - the three verbs + paragraph fade (`data-rise` / `data-wipe` / `data-draw` /
 *   `data-fade`, with optional `data-delay` / `data-start`), via initReveals
 * - WorkCard wipes: `[data-wipe-d]` on desktop, `[data-wipe-m]` on phones/touch
 * - navOverDark for every `.pg-dark` band (the nav turns dark over it)
 * - magnetic hover for every `[data-magnetic]` button (desktop, fine pointer)
 * - D-045 auto-scroll of WorkCard screens while >= 60% in view
 * - `data-parallax` (desktop, fine pointer): on an overflow-hidden frame, its
 *   <img> drifts with the scroll; `data-parallax="0.5"` scales the drift;
 *   `data-parallax-scale="1.04"` sets the overscale (default 1.12) and caps
 *   the drift at (scale - 1) / 2 of the frame, so no edge ever shows.
 *   Combine with `data-wipe` on the same frame (the wipe then clips only).
 *   Phones/touch, reduced motion and no JS: no transform, scale 1.
 *
 * Page components must NOT call initReveals themselves (it would double the
 * triggers); signature scenes use their own attributes and useHomeMotion.
 * Reduced motion: nothing here runs; the server HTML is the final page.
 */
const PageMotion = () => {
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>('.pg-root');
    if (!root) return;
    const mm = gsap.matchMedia(root);
    mm.add({ desktop: MQ_DESKTOP, mobile: MQ_MOBILE }, (ctx) => {
      const c = ctx.conditions as { desktop?: boolean; mobile?: boolean };
      if (!c.desktop && !c.mobile) return;
      initReveals(root);

      root.querySelectorAll<HTMLElement>(c.desktop ? '[data-wipe-d]' : '[data-wipe-m]').forEach((el) => {
        if (el.classList.contains('is-in')) return;
        const delay = c.desktop ? parseFloat(el.dataset.delay ?? '0') || 0 : 0;
        const inner = c.desktop ? null : el.querySelector('.h-card-stack');
        triggerOnce({ trigger: el, start: 'top 88%' }, () => playWipe(el, inner, delay));
      });

      // Image parallax (desktop only). The <img> drifts ±6% (× the attribute's
      // value) inside its overflow-hidden frame, held at scale 1.12 so no edge shows.
      if (c.desktop) {
        root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((frame) => {
          const img = frame.querySelector('img');
          if (!img) return;
          const k = parseFloat(frame.dataset.parallax || '1') || 1;
          // Optional overscale (website screenshots: ~1.04, so almost nothing is
          // cropped). The drift is capped at the overscale's margin, (scale - 1) / 2
          // of the frame, so an edge never shows.
          const scale = Math.max(1, parseFloat(frame.dataset.parallaxScale || '1.12') || 1.12);
          const drift = Math.min(6 * k, ((scale - 1) / 2) * 100);
          gsap.fromTo(
            img,
            { yPercent: -drift, scale },
            {
              yPercent: drift,
              scale,
              ease: 'none',
              scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
            },
          );
        });
      }

      const offs: Array<() => void> = [];
      root.querySelectorAll('.pg-dark').forEach((band) => offs.push(navOverDark(band)));
      if (c.desktop) root.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((b) => offs.push(magnetic(b)));
      return () => offs.forEach((fn) => fn());
    });
    return () => mm.revert();
  }, []);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.pg-root');
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.h-card[data-screen]'));
    if (!cards.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.toggleAttribute('data-live', e.intersectionRatio >= 0.6)),
      { threshold: [0, 0.6] },
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

  return null;
};

export default PageMotion;
