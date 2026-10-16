"use client";
import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, MQ_DESKTOP, MQ_MOBILE } from '../../home/motion';

/**
 * What a store gets, in a store owner's words (Ruchi, D-070: no tech names here;
 * app names stay in the FAQ answers). About two words each; all things we
 * deliver; no numbers.
 */
const TOOLS = [
  'Faster pages',
  'Easy checkout',
  'Emails that sell',
  'Cart recovery',
  'Subscriptions',
  'Trusted reviews',
  'Loyalty rewards',
  'Upsells & bundles',
  'Mobile-first',
  'Clear tracking',
];

const ToolSet = ({ copy }: { copy: 0 | 1 }) => (
  <span className="sv2-tl-set" data-tl-set={copy === 0 ? '' : undefined} data-dup={copy === 1 ? '' : undefined}>
    {TOOLS.map((t, i) => (
      <span key={t} className="sv2-tl-item">
        <span className={i % 2 ? 'sv2-tl-word h-outline' : 'sv2-tl-word'}>{t}</span>
        <span className="sv2-tl-sep" />
      </span>
    ))}
  </span>
);

/**
 * D-070 C2: the page's one decorative-kinetic element. What a store gets, at
 * display size, alternating solid and outline, separated by indigo squares,
 * drifting on the homepage marquee's ticker (base speed, a scroll-velocity
 * boost that eases back, direction follows the scroll, paused off screen).
 * Transform only. Reduced motion / no JS: one static line from the first item.
 * The readable list is a visually hidden paragraph; the moving copy is hidden
 * from assistive tech.
 */
const ToolLine = () => {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const track = root.querySelector<HTMLElement>('.sv2-tl-track')!;
    const first = root.querySelector<HTMLElement>('[data-tl-set]')!;
    const mm = gsap.matchMedia(root);
    mm.add(`${MQ_DESKTOP}, ${MQ_MOBILE}`, () => {
      const setX = gsap.quickSetter(track, 'x', 'px') as (v: number) => void;
      let width = first.offsetWidth;
      let pos = 0;
      let speed = 40; // px/s, signed by direction
      let dir = 1;
      let boost = 0;
      const tick = (_t: number, deltaMs: number) => {
        const dt = Math.min(deltaMs, 50) / 1000;
        // The scroll boost eases back to the base speed over ~0.6s.
        boost *= Math.exp(-dt / 0.2);
        const target = dir * (40 + boost);
        speed += (target - speed) * (1 - Math.exp(-dt / 0.15));
        pos = (((pos + speed * dt) % width) + width) % width;
        setX(-pos);
      };
      const st = ScrollTrigger.create({
        trigger: root,
        start: 'top bottom',
        end: 'bottom top',
        onRefresh: () => {
          width = first.offsetWidth;
        },
        onToggle: (self) => (self.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)),
        onUpdate: (self) => {
          dir = self.direction;
          boost = Math.min(400, Math.abs(self.getVelocity()) * 0.25);
        },
      });
      if (st.isActive) gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        gsap.set(track, { clearProps: 'transform' });
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} className="sv2-tl" aria-label="What your store gets">
      <p className="sr-only">{TOOLS.join(', ')}</p>
      <div className="sv2-tl-row" aria-hidden="true">
        <div className="sv2-tl-track">
          <ToolSet copy={0} />
          <ToolSet copy={1} />
        </div>
      </div>
    </section>
  );
};

export default ToolLine;
