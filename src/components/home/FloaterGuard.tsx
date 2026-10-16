"use client";
import { useEffect } from 'react';

/**
 * Keeps the shared BackToTop button off homepage controls (see home.css):
 * html.h-over-slider while the case slider, a reel/slider counter or the reviews
 * pause/expand controls (UX P6) pass the
 * bottom 88px of the screen, html.h-at-contact while the contact block is up.
 * Renders nothing. (The mobile sticky CTA bar it grew out of was removed, D-025.)
 */
const FloaterGuard = () => {
  useEffect(() => {
    const root = document.documentElement;
    const observers: IntersectionObserver[] = [];

    const contact = document.getElementById('contact');
    if (contact) {
      const io = new IntersectionObserver(([e]) => root.classList.toggle('h-at-contact', e.isIntersecting));
      io.observe(contact);
      observers.push(io);
    }

    const parts = Array.from(document.querySelectorAll('.h-stack, .h-cases-hud, .h-reel-hud, .h-reviews-controls'));
    let sliderIo: IntersectionObserver | null = null;
    const over = new Set<Element>();
    const build = () => {
      sliderIo?.disconnect();
      over.clear();
      root.classList.remove('h-over-slider');
      sliderIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => (e.isIntersecting ? over.add(e.target) : over.delete(e.target)));
          root.classList.toggle('h-over-slider', over.size > 0);
        },
        { rootMargin: `-${Math.max(0, window.innerHeight - 88)}px 0px 0px 0px` },
      );
      parts.forEach((p) => sliderIo!.observe(p));
    };
    if (parts.length) build();

    let t = 0;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(build, 200);
    };
    if (parts.length) window.addEventListener('resize', onResize);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener('resize', onResize);
      sliderIo?.disconnect();
      observers.forEach((o) => o.disconnect());
      root.classList.remove('h-over-slider', 'h-at-contact');
    };
  }, []);

  return null;
};

export default FloaterGuard;
