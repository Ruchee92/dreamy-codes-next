"use client";
import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { IconButton, SecondaryActionButton } from './Buttons';
import { ALL_REVIEWS, REVIEWS_A, REVIEWS_B, type Review } from './data';
import ReviewAvatar from './ReviewAvatar';
import Stars from './Stars';
import { gsap, ScrollTrigger, initReveals, useHomeMotion } from './motion';

// Row cards are sized to their quote so the rows read as a rhythm, not a grid.
const sizeOf = (r: Review) => (r.excerpt.length < 90 ? 's' : r.excerpt.length < 120 ? 'm' : 'l');

const ReviewCard = ({ r, full = false }: { r: Review; full?: boolean }) => (
  <figure className="h-review" data-size={full ? undefined : sizeOf(r)}>
    <Stars />
    <blockquote className="h-review-quote">
      <p>{full ? r.quote : r.excerpt}</p>
    </blockquote>
    <figcaption className="h-review-by">
      <ReviewAvatar r={r} className="h-review-avatar" />
      <span>
        <span className="h-review-name">{r.name}</span>
        <span className="h-review-role">{r.role}</span>
      </span>
    </figcaption>
  </figure>
);

// Static rows (reduced motion / no JS) are native scrollers, so each is a named
// tab stop; the drifting rows drop the tabindex once the motion scene runs.
const Row = ({ reviews, id }: { reviews: Review[]; id: 'a' | 'b' }) => (
  <div className="h-row" data-row={id} role="group" aria-label={id === 'a' ? 'Reviews, first row' : 'Reviews, second row'} tabIndex={0}>
    <div className="h-row-track">
      <div className="h-row-set" data-set>
        {reviews.map((r) => (
          <ReviewCard key={`${r.name}-${r.role}`} r={r} />
        ))}
      </div>
      <div className="h-row-set" data-dup aria-hidden="true" inert>
        {reviews.map((r) => (
          <ReviewCard key={`${r.name}-${r.role}`} r={r} />
        ))}
      </div>
    </div>
  </div>
);

/**
 * Two drifting rows of excerpts (opposite directions), paused by hover, focus
 * or the visible pause control, plus a static grid with every full quote.
 * Reduced motion / no JS: the same two rows, still, as horizontal snap
 * scrollers (no duplicates, no pause control); "Read every review" still opens
 * the grid (instantly under reduced motion).
 */
const Testimonials = () => {
  const ref = useRef<HTMLElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const expandedRef = useRef(false);
  const mounted = useRef(false);

  useHomeMotion(ref, ({ desktop }, root) => {
    initReveals(root);

    const rowsEl = rowsRef.current;
    if (!rowsEl) return;
    const rows = Array.from(rowsEl.querySelectorAll<HTMLElement>('.h-row'));
    const speed = desktop ? 36 : 24;
    const setters = rows.map((r) => gsap.quickSetter(r.querySelector('.h-row-track'), 'x', 'px') as (v: number) => void);
    const widths = rows.map((r) => r.querySelector<HTMLElement>('[data-set]')!.offsetWidth);
    const measure = () => {
      rows.forEach((r, i) => {
        widths[i] = r.querySelector<HTMLElement>('[data-set]')!.offsetWidth;
      });
    };
    const offsets = rows.map(() => 0);

    let hovering = false;
    let pauseF = 1;
    let boost = 0;
    let lastScroll = 0;
    let velocity = 0;

    const tick = (_t: number, deltaMs: number) => {
      if (expandedRef.current) return;
      const dt = Math.min(deltaMs, 50) / 1000;
      const stopped = hovering || pausedRef.current;
      // 0.6s to stop, 0.8s to resume.
      pauseF += ((stopped ? 0 : 1) - pauseF) * (1 - Math.exp(-dt * (stopped ? 5 : 4)));
      const moving = performance.now() - lastScroll < 140;
      const targetBoost = desktop && moving ? Math.min(2, velocity / 800) : 0;
      boost += (targetBoost - boost) * (1 - Math.exp(-dt * 4));
      const step = speed * dt * pauseF * (1 + boost);
      rows.forEach((_, i) => {
        const w = widths[i];
        if (!w) return;
        offsets[i] = (offsets[i] + step) % w;
        // Row A drifts left, row B drifts right.
        setters[i](i === 0 ? -offsets[i] : offsets[i] - w);
      });
    };

    rowsEl.setAttribute('data-live', '');
    rows.forEach((r) => r.removeAttribute('tabindex'));
    const stopHover = () => {
      hovering = false;
    };
    const startHover = () => {
      hovering = true;
    };
    rowsEl.addEventListener('pointerenter', startHover);
    rowsEl.addEventListener('pointerleave', stopHover);
    rowsEl.addEventListener('focusin', startHover);
    rowsEl.addEventListener('focusout', stopHover);

    const st = ScrollTrigger.create({
      trigger: rowsEl,
      start: 'top bottom',
      end: 'bottom top',
      onRefresh: measure,
      onToggle: (self) => {
        if (self.isActive) gsap.ticker.add(tick);
        else gsap.ticker.remove(tick);
      },
      onUpdate: (self) => {
        velocity = Math.abs(self.getVelocity());
        lastScroll = performance.now();
      },
    });
    if (st.isActive) gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      rowsEl.removeAttribute('data-live');
      rows.forEach((r) => r.setAttribute('tabindex', '0'));
      rowsEl.removeEventListener('pointerenter', startHover);
      rowsEl.removeEventListener('pointerleave', stopHover);
      rowsEl.removeEventListener('focusin', startHover);
      rowsEl.removeEventListener('focusout', stopHover);
      rows.forEach((r) => gsap.set(r.querySelector('.h-row-track'), { clearProps: 'transform' }));
    };
  }, { defer: true });

  // Rows -> grid: rows fade, cards rise, focus moves into the grid. Grid -> rows: reverse.
  useEffect(() => {
    expandedRef.current = expanded;
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const grid = gridRef.current;
    const rowsEl = rowsRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (expanded && grid) {
      if (reduce) {
        grid.querySelector<HTMLElement>('.h-review-wrap')?.focus({ preventScroll: true });
        return;
      }
      const cards = grid.querySelectorAll<HTMLElement>('.h-review-wrap');
      gsap.fromTo(
        cards,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'dc', stagger: 0.04, clearProps: 'opacity,transform' },
      );
      cards[0]?.focus({ preventScroll: true });
    } else if (rowsEl) {
      if (reduce) {
        ref.current?.querySelector<HTMLElement>('.h-reviews-toggle button')?.focus({ preventScroll: true });
        return;
      }
      gsap.fromTo(rowsEl, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out', clearProps: 'opacity' });
      ref.current?.querySelector<HTMLElement>('.h-reviews-toggle button')?.focus({ preventScroll: true });
    }
  }, [expanded]);

  const onToggle = () => {
    const rowsEl = rowsRef.current;
    if (expanded) {
      setExpanded(false);
    } else if (rowsEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.to(rowsEl, { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => setExpanded(true) });
    } else {
      setExpanded(true);
    }
  };

  const onPause = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
  };

  return (
    <section ref={ref} id="testimonials" className="h-reviews" aria-labelledby="h-reviews-title" data-expanded={expanded}>
      <div className="h-container">
        <header className="h-reviews-head">
          <h2 id="h-reviews-title" className="h-d-l" data-rise>
            <span className="h-line"><span className="h-line-in">Why founders</span></span>{' '}
            <span className="h-line"><span className="h-line-in">come back</span></span>
          </h2>
          <div className="h-reviews-aside">
            <p className="h-lead h-muted" data-fade>Their words, unedited.</p>
            <div className="h-reviews-controls">
              <IconButton
                aria-label={paused ? 'Play testimonials' : 'Pause testimonials'}
                aria-pressed={paused}
                onClick={onPause}
                data-reviews-pause=""
              >
                {paused ? <Play size={16} strokeWidth={1.75} aria-hidden="true" /> : <Pause size={16} strokeWidth={1.75} aria-hidden="true" />}
              </IconButton>
              <span className="h-reviews-toggle">
                <SecondaryActionButton aria-expanded={expanded} aria-controls="h-reviews-grid" onClick={onToggle}>
                  {expanded ? 'Show fewer' : 'Read every review'}
                </SecondaryActionButton>
              </span>
            </div>
          </div>
        </header>
      </div>

      {/* data-off, not the hidden attribute: Tailwind's preflight makes [hidden]
          display:none !important. */}
      <div ref={rowsRef} className="h-rows" data-off={expanded ? '' : undefined}>
        <Row reviews={REVIEWS_A} id="a" />
        <Row reviews={REVIEWS_B} id="b" />
      </div>

      <div className="h-container">
        <div ref={gridRef} id="h-reviews-grid" className="h-reviews-grid" data-off={expanded ? undefined : ''}>
          {ALL_REVIEWS.map((r) => (
            <div key={`${r.name}-${r.role}`} tabIndex={-1} className="h-review-wrap">
              <ReviewCard r={r} full />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
