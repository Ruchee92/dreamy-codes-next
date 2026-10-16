"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FocusEvent, type PointerEvent } from 'react';
import { Flip } from 'gsap/Flip';
import { gsap, ScrollTrigger, playRoll } from '../../home/motion';
import { safeRefresh } from '../../home/anchor';
import Num from '../../home/Num';
import { FILTERS, countOf, isWorkType, type WorkType } from './data';
import { endSpan } from './endSpan';
import { buildDrift, killDrift, DRIFT_MQ } from './drift';

// Flip is registered here only, so the homepage bundle doesn't carry it (design spec §1.1).
if (typeof window !== 'undefined') gsap.registerPlugin(Flip);

type Filter = WorkType | 'all';

export const GRID_ID = 'ow-grid';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Lets a card that the filter brings in skip its scroll wipe: it is marked
 * revealed and its pending reveal triggers are dropped (they would replay the
 * wipe on a card that is already on screen).
 */
function markRevealed(card: HTMLElement) {
  const parts = [card, ...Array.from(card.querySelectorAll<HTMLElement>('[data-wipe-m]'))];
  parts.forEach((el) => {
    gsap.killTweensOf(el);
    el.classList.add('is-in');
  });
  ScrollTrigger.getAll().forEach((st) => {
    if (st.trigger && parts.includes(st.trigger as HTMLElement)) st.kill();
  });
}

/**
 * /our-work signature, "the filter that re-flows". Four aria-pressed buttons
 * filter the project grid (rendered statically by ProjectGrid, all twelve visible
 * in the server HTML): GSAP Flip glides the cards that stay into their new
 * slots, wipes the arriving ones in and folds the leaving ones away, while the
 * count rolls to the new number. State lives in `?type=`. A click during a
 * re-flow is queued (last one wins). Reduced motion: an instant swap.
 * No JS: the buttons keep their space but stay hidden (they can't work); the
 * count still reads "12 projects".
 */
const WorkFilter = () => {
  const [active, setActive] = useState<Filter>('all');
  const [ready, setReady] = useState(false);
  const [announce, setAnnounce] = useState('');
  const groupRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const previewRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const flipRef = useRef<gsap.core.Timeline | null>(null);
  const queued = useRef<Filter | null>(null);
  const firstCount = useRef(true);
  const activeRef = useRef<Filter>(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  /** The 2px bar under the active label: x + scaleX from the button's box (100px base width). */
  const moveBar = useCallback((type: Filter, animate: boolean) => {
    const group = groupRef.current;
    const bar = barRef.current;
    const btn = group?.querySelector<HTMLElement>(`[data-filter="${type}"]`);
    if (!bar || !btn) return;
    const vars = { x: btn.offsetLeft, scaleX: btn.offsetWidth / 100 };
    if (animate && !reduced()) gsap.to(bar, { ...vars, duration: 0.45, ease: 'dc', overwrite: true });
    else gsap.set(bar, vars);
  }, []);

  /**
   * O5: a faint second bar previews the label under the pointer (fine pointer) or
   * keyboard focus; it slides like the active bar and fades out on leave/blur.
   */
  const preview = (btn: HTMLElement | null) => {
    const el = previewRef.current;
    if (!el) return;
    const show = !!btn && btn.getAttribute('aria-pressed') !== 'true';
    if (!show) {
      gsap.to(el, { opacity: 0, duration: 0.2, ease: 'power1.out', overwrite: 'auto' });
      return;
    }
    const vars = { x: btn.offsetLeft, scaleX: btn.offsetWidth / 100 };
    if (reduced()) {
      gsap.set(el, { ...vars, opacity: 0.3 });
      return;
    }
    // Arriving from nowhere: jump into place, then fade; between labels: slide.
    if (Number(gsap.getProperty(el, 'opacity')) < 0.05) gsap.set(el, vars);
    gsap.to(el, { ...vars, opacity: 0.3, duration: 0.24, ease: 'dc', overwrite: 'auto' });
  };
  const onPointer = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === 'mouse') preview(e.currentTarget);
  };
  const onFocus = (e: FocusEvent<HTMLButtonElement>) => {
    if (e.currentTarget.matches(':focus-visible')) preview(e.currentTarget);
  };

  const apply = useCallback(function run(type: Filter, animate: boolean) {
    const grid = document.getElementById(GRID_ID);
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>('.ow-card'));
    const ask = grid.querySelector<HTMLElement>('.ow-ask');
    const end = grid.querySelector<HTMLElement>('.ow-end');
    // The two CTA cells re-flow with the cards (ProjectGrid).
    const targets = [...cards, ...(ask ? [ask] : []), ...(end ? [end] : [])];
    const show = (c: HTMLElement) => type === 'all' || c.dataset.type === type;
    // Inline display (not the `hidden` attribute): Flip can then show leavers for their exit.
    const toggle = () => {
      let n = 0;
      cards.forEach((c) => {
        const on = show(c);
        c.style.display = on ? '' : 'none';
        // Visible cards are numbered 01..n in their filtered order.
        if (on) {
          // Column from the visible order (>= 1280: column 1 is the stepped one, our-work.css).
          c.dataset.col = String(n % 3);
          n += 1;
          const idx = c.querySelector('.h-card-idx');
          if (idx) idx.textContent = String(n).padStart(2, '0');
        }
      });
      if (ask) ask.style.display = type === 'all' ? '' : 'none';
      if (end) {
        end.dataset.span = String(endSpan(n));
        end.dataset.col = String(n % 3);
      }
    };

    if (!animate || reduced()) {
      toggle();
      buildDrift(grid);
      safeRefresh();
      return;
    }

    const state = Flip.getState(targets);
    const wasShown = new Set(cards.filter((c) => c.style.display !== 'none'));
    const before = grid.offsetHeight;
    toggle();
    // While Flip holds the cards absolute the grid would collapse and the next
    // section would paint over them: hold the taller of both heights until done.
    grid.style.minHeight = `${Math.max(before, grid.offsetHeight)}px`;
    // Cards that stay but never got their scroll wipe (they were below the fold)
    // would glide into view still clipped: wipe them in with the arrivals.
    const waiting = cards.filter((c) => wasShown.has(c) && show(c) && !c.classList.contains('is-in'));
    waiting.forEach(markRevealed);
    if (waiting.length) {
      gsap.fromTo(
        waiting,
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'dc', stagger: 0.05, delay: 0.15, clearProps: 'clipPath' },
      );
    }
    const phone = window.innerWidth < 1024;
    flipRef.current = Flip.from(state, {
      duration: phone ? 0.45 : 0.7,
      ease: 'dc',
      absolute: true,
      scale: false,
      nested: false,
      stagger: 0.03,
      onEnter: (els) => {
        els.forEach((el) => markRevealed(el as HTMLElement));
        gsap.set(els, { opacity: 1, scale: 1 });
        return gsap.fromTo(
          els,
          { clipPath: 'inset(0 0 100% 0)' },
          { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'dc', stagger: 0.05, clearProps: 'clipPath' },
        );
      },
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.96, duration: 0.3, ease: 'power2.in' }),
      onComplete: () => {
        flipRef.current = null;
        // Leavers are display:none now; reset them for their next entrance.
        gsap.set(targets.filter((c) => getComputedStyle(c).display === 'none'), { clearProps: 'opacity,transform' });
        grid.style.minHeight = '';
        // Column 2 may hold different cards now: rebuild its drift.
        buildDrift(grid);
        // Cards moved: re-measure the reveal triggers of those still waiting below.
        safeRefresh();
        const next = queued.current;
        queued.current = null;
        if (next) run(next, true);
      },
    });
  }, []);

  const choose = (type: Filter) => {
    if (type === active) return;
    setActive(type);
    moveBar(type, true);
    const url = new URL(window.location.href);
    if (type === 'all') url.searchParams.delete('type');
    else url.searchParams.set('type', type);
    window.history.replaceState(window.history.state, '', url);
    setAnnounce(`Showing ${countOf(type)} projects`);
    if (flipRef.current?.isActive()) {
      queued.current = type;
      return;
    }
    queued.current = null;
    apply(type, true);
  };

  // Deep link (?type=): applied before the first paint after hydration, no animation.
  useLayoutEffect(() => {
    // The first row's phone media wipe is CSS-driven too (our-work.css): mark it revealed before
    // PageMotion (mounted after this) sets up its scroll wipes, so it is never replayed.
    document.querySelectorAll(`#${GRID_ID} .ow-first [data-wipe-m]`).forEach((el) => el.classList.add('is-in'));
    const t = new URLSearchParams(window.location.search).get('type');
    if (isWorkType(t)) {
      setActive(t);
      apply(t, false);
      moveBar(t, false);
    } else moveBar('all', false);
    setReady(true);
    const onResize = () => moveBar(activeRef.current, false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [apply, moveBar]);

  // The count is re-keyed per value; the new glyphs roll up (playRoll), except on load,
  // where MotionBoot's roll observer plays the first one.
  const count = countOf(active);
  useLayoutEffect(() => {
    if (firstCount.current) {
      firstCount.current = false;
      if (count === countOf('all')) return;
    }
    const el = countRef.current?.querySelector<HTMLElement>('[data-roll]');
    if (el && !reduced()) playRoll(el);
  }, [count]);

  useEffect(() => () => {
    flipRef.current?.kill();
  }, []);

  // Middle-column drift: built once the page is up, rebuilt when the drift breakpoint flips.
  useEffect(() => {
    const grid = document.getElementById(GRID_ID);
    if (!grid) return;
    const mq = window.matchMedia(DRIFT_MQ);
    const rebuild = () => buildDrift(grid);
    rebuild();
    mq.addEventListener('change', rebuild);
    return () => {
      mq.removeEventListener('change', rebuild);
      killDrift();
    };
  }, []);

  // Phones: the label row fades at the right edge while labels wait off screen.
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const check = () => group.classList.toggle('has-more', group.scrollLeft + group.clientWidth < group.scrollWidth - 1);
    check();
    group.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      group.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  return (
    <div className="ow-filter">
      <div
        ref={groupRef}
        className="ow-filter-group"
        role="group"
        aria-label="Filter projects by service"
        data-ready={ready ? '' : undefined}
      >
        {FILTERS.map((f) => (
          <button
            key={f.type}
            type="button"
            className="h-label ow-filter-btn"
            data-filter={f.type}
            aria-pressed={active === f.type}
            aria-controls={GRID_ID}
            onClick={() => {
              choose(f.type);
              preview(null);
            }}
            onPointerEnter={onPointer}
            onPointerLeave={() => preview(null)}
            onFocus={onFocus}
            onBlur={() => preview(null)}
          >
            {f.label}
          </button>
        ))}
        <span ref={previewRef} className="ow-filter-bar ow-filter-preview" aria-hidden="true" />
        <span ref={barRef} className="ow-filter-bar" aria-hidden="true" />
      </div>
      <p className="ow-count">
        <span ref={countRef} className="ow-count-mask">
          <Num key={count} final={String(count)} as="span" className="h-d-m ow-count-num" />
        </span>
        <span className="h-label ow-count-label">projects</span>
      </p>
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </div>
  );
};

export default WorkFilter;
