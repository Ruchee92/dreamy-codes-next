import { gsap, ScrollTrigger } from '../../home/motion';

/** Drift runs on 3-column desktops with a fine pointer and motion allowed only. */
const MQ = '(min-width: 1280px) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
/** px: column 2 travels +AMP → −AMP across the grid's pass through the viewport. */
const AMP = 40;

let st: ScrollTrigger | null = null;
let moving: HTMLElement[] = [];

/**
 * /our-work "the grid breaks on purpose" (push-9.5 spec §1): the stepped middle
 * column counter-drifts against the other two as the grid scrolls by. It moves
 * the card's contents (frame + meta), never the `.ow-card` itself, so it can't
 * fight Flip, which transforms the cards. Values follow scroll progress through
 * quickTo (0.6s), so a rebuild after a filter glides to the new place instead
 * of jumping; cards that left column 2 glide back to rest. No layout reads in
 * the scroll callback (progress only). Call after load and after each re-flow.
 */
export function buildDrift(grid: HTMLElement) {
  st?.kill();
  st = null;
  const on = window.matchMedia(MQ).matches;
  const next = on
    ? Array.from(grid.querySelectorAll<HTMLElement>('.ow-card[data-col="1"]'))
        .filter((c) => c.style.display !== 'none')
        .flatMap((c) => Array.from(c.querySelectorAll<HTMLElement>(':scope > .h-card-frame, :scope > .h-card-meta')))
    : [];
  moving
    .filter((el) => !next.includes(el))
    .forEach((el) => gsap.to(el, { y: 0, duration: 0.6, ease: 'dc', overwrite: true, clearProps: 'transform' }));
  moving = next;
  if (!next.length) return;
  const setters = next.map((el) => gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' }));
  const place = (p: number) => setters.forEach((set) => set(AMP - 2 * AMP * p));
  st = ScrollTrigger.create({
    trigger: grid,
    start: 'top bottom',
    end: 'bottom top',
    invalidateOnRefresh: true,
    onUpdate: (self) => place(self.progress),
  });
  place(st.progress);
}

/** Unmount: drop the trigger and put everything back at rest. */
export function killDrift() {
  st?.kill();
  st = null;
  if (moving.length) gsap.set(moving, { clearProps: 'transform' });
  moving = [];
}

export const DRIFT_MQ = MQ;
