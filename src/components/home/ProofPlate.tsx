"use client";
import { useRef } from 'react';
import Image from 'next/image';
import { LOGOS, SHOPIFY_BADGE } from './data';
import { gsap, ScrollTrigger, initReveals, navOverDark, useHomeMotion } from './motion';

const LOGO_SET_ID = 'h-logo-set';

/**
 * Black proof plate: the partner badge, the brand line and the client logos in
 * a marquee that speeds up with the scroll and follows its direction. D-060: the
 * four numbers moved to their own light section (Numbers.tsx) after the reel.
 */
const ProofPlate = () => {
  const ref = useRef<HTMLElement>(null);

  useHomeMotion(ref, ({ desktop }, root) => {
    initReveals(root);

    const offNav = navOverDark(root);

    // Logo marquee, driven by a ticker (not a tween) so it can run in either direction.
    const band = root.querySelector<HTMLElement>('.h-logos');
    const track = root.querySelector<HTMLElement>('.h-logos-track');
    const firstSet = root.querySelector<HTMLElement>(`#${LOGO_SET_ID}`);
    if (!band || !track || !firstSet) {
      return () => {
        offNav();
      };
    }

    const setX = gsap.quickSetter(track, 'x', 'px') as (v: number) => void;
    const maxBoost = desktop ? 4 : 2;
    let setWidth = firstSet.offsetWidth;
    let pos = 0;
    let cur = 1;
    let dir = 1;
    let velocity = 0;
    let lastScroll = 0;

    const tick = (_time: number, deltaMs: number) => {
      const dt = Math.min(deltaMs, 50) / 1000;
      const moving = performance.now() - lastScroll < 140;
      const boost = moving ? Math.min(maxBoost, 1 + velocity / 600) : 1;
      const target = dir * boost;
      // ~0.5s to catch up while scrolling, ~0.8s to settle back to ±1.
      cur += (target - cur) * (1 - Math.exp(-dt * (moving ? 7 : 4.5)));
      pos = (pos + cur * (setWidth / 40) * dt + setWidth) % setWidth;
      setX(-pos);
    };

    const st = ScrollTrigger.create({
      trigger: band,
      start: 'top bottom',
      end: 'bottom top',
      onRefresh: () => {
        setWidth = firstSet.offsetWidth;
      },
      onToggle: (self) => {
        if (self.isActive) gsap.ticker.add(tick);
        else gsap.ticker.remove(tick);
      },
      onUpdate: (self) => {
        dir = self.direction;
        velocity = Math.abs(self.getVelocity());
        lastScroll = performance.now();
      },
    });
    if (st.isActive) gsap.ticker.add(tick);

    return () => {
      offNav();
      gsap.ticker.remove(tick);
      gsap.set(track, { clearProps: 'transform' });
    };
  });

  const logoSet = (copy: 0 | 1) => (
    <div
      className="h-logos-set"
      id={copy === 0 ? LOGO_SET_ID : undefined}
      aria-hidden={copy === 1 ? true : undefined}
      data-dup={copy === 1 ? '' : undefined}
    >
      {LOGOS.map((src) => (
        <Image
          key={`${copy}-${src}`}
          src={src}
          alt=""
          width={140}
          height={64}
          loading="lazy"
          className="h-logo"
        />
      ))}
    </div>
  );

  return (
    <section ref={ref} className="h-proof" data-plate aria-label="Proof">
      {/* D-027 / D-060: the partner badge and the brand line, then the client marquee.
          The four numbers follow the work reel (Numbers.tsx). */}
      <div className="h-container h-badge-row">
        <Image src={SHOPIFY_BADGE} alt="Shopify Experts" width={209} height={36} sizes="210px" className="h-badge" />
        <p className="h-label h-badge-label">Brands we partner with</p>
      </div>
      <div className="h-logos-wrap">
        <div className="h-logos">
          <div className="h-logos-track">
            {logoSet(0)}
            {logoSet(1)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProofPlate;
