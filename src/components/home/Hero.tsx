"use client";
import { useEffect, useRef, useState } from 'react';
import { preload } from 'react-dom';
import dynamic from 'next/dynamic';
import Image, { getImageProps } from 'next/image';
import Stars from './Stars';
import { PrimaryButton, ArrowLink } from './Buttons';
import { AVATARS } from './data';
import { currentQuarter } from './quarter';
import { whenIdleAfterLoad } from '../../utils/idle';
import { gsap, ScrollTrigger, useHomeMotion, magnetic } from './motion';

// WebGPU canvas: client-only, so nothing shader-related runs during SSR.
const GlassHeroBackground = dynamic(() => import('../GlassHeroBackground'), { ssr: false });

type SaveDataNavigator = Navigator & { connection?: { saveData?: boolean }; gpu?: unknown };

/**
 * D-073 (SEO final, LCP): the shader library (~700 KB transferred, 2.5 MB parsed)
 * no longer loads at startup. Its chunk is requested only after `load` and an idle
 * moment, so it never competes with the poster (the LCP) or hydration; the poster
 * stays the painted hero until the canvas's first frame crossfades over it.
 * Skipped entirely on save-data, reduced motion and browsers without WebGPU, where
 * the poster simply stays (and the deferred scenes are released at once).
 */
function useDeferredShader() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const nav = navigator as SaveDataNavigator;
    const skip =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches || nav.connection?.saveData === true || !('gpu' in nav);
    if (skip) {
      document.dispatchEvent(new Event('hero-backdrop-ready'));
      return;
    }
    return whenIdleAfterLoad(() => setOn(true));
  }, []);
  return on;
}

const { props: POSTER } = getImageProps({
  src: '/home/hero-poster-d.webp',
  alt: '',
  width: 1440,
  height: 900,
  unoptimized: true,
  loading: 'eager',
  fetchPriority: 'high',
});

const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const shaderOn = useDeferredShader();
  // Hoisted into <head> during SSR, so the poster is fetched before the body is parsed.
  preload('/home/hero-poster-m.avif', { as: 'image', type: 'image/avif', fetchPriority: 'high', media: '(max-width: 767px)' });
  preload('/home/hero-poster-d.avif', { as: 'image', type: 'image/avif', fetchPriority: 'high', media: '(min-width: 768px)' });

  useHomeMotion(ref, ({ desktop }, hero) => {
    if (!desktop) return;
    const plate = document.querySelector<HTMLElement>('[data-plate]');
    const content = hero.querySelector<HTMLElement>('.h-hero-content');
    const cta = hero.querySelector<HTMLElement>('[data-magnetic]');
    const cleanups: Array<() => void> = [];

    // The plate slides over the sticky hero: the hero settles back while it does.
    if (plate && content) {
      gsap.fromTo(
        content,
        { scale: 1, opacity: 1, y: 0, transformOrigin: '50% 30%' },
        {
          scale: 0.94,
          opacity: 0.3,
          y: -48,
          ease: 'none',
          scrollTrigger: { trigger: plate, start: 'top bottom', end: 'top top', scrub: 0.6 },
        },
      );
      // Once the plate covers the hero entirely, stop compositing the shader.
      ScrollTrigger.create({
        trigger: plate,
        start: 'top top',
        end: 'max',
        onToggle: (self) => {
          hero.style.visibility = self.isActive ? 'hidden' : '';
        },
      });
    }

    if (cta) cleanups.push(magnetic(cta));

    return () => {
      hero.style.visibility = '';
      cleanups.forEach((fn) => fn());
    };
  });

  return (
    <section ref={ref} className="h-hero" aria-label="Introduction">
      {/* D-009: a still of the live shader at rest, in the server HTML, so the
          first paint already looks like the finished hero. The canvas (loaded after
          load + idle, D-073) fades in over it (its own 700ms opacity) on a
          near-identical frame. */}
      <picture className="h-poster">
        <source media="(max-width: 767px)" type="image/avif" srcSet="/home/hero-poster-m.avif" />
        <source media="(max-width: 767px)" type="image/webp" srcSet="/home/hero-poster-m.webp" />
        <source type="image/avif" srcSet="/home/hero-poster-d.avif" />
        <img {...POSTER} alt="" className="h-poster-img" />
      </picture>
      <div className="h-shader">{shaderOn && <GlassHeroBackground />}</div>
      <div className="h-hero-content">
        <div className="h-container h-hero-inner">
          <div className="h-hero-top">
            <p className="h-label h-status h-a-status">
              <span className="h-dot" aria-hidden="true" />
              <span>
                Accepting partners for <span suppressHydrationWarning>{currentQuarter()}</span>
              </span>
            </p>
            <p className="h-label h-hero-meta h-a-status">Shopify design, CRO &amp; integrations</p>
          </div>

          <div className="h-grid h-hero-main">
            <h1 className="h-d-xl h-hero-h1">
              <span className="h-line">
                <span className="h-line-in" style={{ animationDelay: '60ms' }}>We engineer</span>
              </span>{' '}
              <span className="h-line">
                <span className="h-line-in h-outline" style={{ animationDelay: '140ms' }}>E-commerce</span>
              </span>{' '}
              <span className="h-line">
                <span className="h-line-in" style={{ animationDelay: '220ms' }}>for scale.</span>
              </span>
            </h1>

            <div className="h-hero-aside">
              <p className="h-lead h-hero-sub h-a-sub">
                Scaling is tough. Let our Shopify experts engineer your high-converting storefront so you can focus on D2C
                growth.
              </p>
              <div className="h-hero-actions">
                <div className="h-a-cta">
                  <PrimaryButton
                    href="#contact"
                    magnetic
                    aria-label="Book a free strategy call — go to the enquiry form on this page"
                  >
                    Book a free strategy call
                  </PrimaryButton>
                </div>
                <ArrowLink href="#portfolio" className="h-a-link">
                  View our work
                </ArrowLink>
              </div>
            </div>
          </div>

          <div className="h-hero-bar">
            <span className="h-hero-rule h-a-rule" aria-hidden="true" />
            <div className="h-hero-bar-row">
              {/* D-067: five stars on the trust line; the whole block jumps to the reviews (glideTo handles #anchors). */}
              <a
                href="#testimonials"
                className="h-rating h-a-bar"
                aria-label="Rated 5 out of 5. Trusted by 300+ Shopify merchants. Read the reviews"
              >
                <div className="h-avatars" aria-hidden="true">
                  {AVATARS.map((src, i) => (
                    <Image
                      key={src}
                      src={src}
                      alt=""
                      width={40}
                      height={40}
                      loading="lazy"
                      className="h-avatar h-a-avatar"
                      style={{ ['--i' as string]: i }}
                    />
                  ))}
                </div>
                <div className="h-rating-copy">
                  <Stars className="h-review-stars h-rating-stars" />
                  <p className="h-label h-ink h-rating-text">Trusted by 300+ Shopify merchants</p>
                </div>
              </a>
              {/* D-033: no price in the hero (it lives in the contact panel); the brand count opens the proof plate. */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
