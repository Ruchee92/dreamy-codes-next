"use client";
import { useEffect, useId, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import Image from 'next/image';
import { Check, X } from 'lucide-react';
import { ArrowLink, PrimaryButton } from '../../home/Buttons';
import Num from '../../home/Num';
import ReviewAvatar from '../../home/ReviewAvatar';
import Stars from '../../home/Stars';
import { WORK_WINDOW } from '../../home/data';
import { gsap, playCount, playWipe, ScrollTrigger, triggerOnce, useHomeMotion } from '../../home/motion';
import { CHAPTERS, type Chapter, type Quote as QuoteData } from './data';

/** Seconds between ledger rows: one cause → effect at a time (design spec §4.3, AD override); tighter on phones (AD iter 6 R2). */
const ROW_GAP = 0.45;
const ROW_GAP_PHONE = 0.3;
/** The numbers count as the second row lands (AD iter 6 R2: was after the third, leaving the stat slots blank ~1.6s). */
const COUNT_AFTER_ROWS = 2;

const pad2 = (n: number) => String(n).padStart(2, '0');

/** The mid-page ask sits after this chapter (CRO fix pass 1: once, not after every chapter). */
const ASK_AFTER = 1;

/**
 * Founder quote (fix pass 5 ruling): every chapter shows the client's short
 * verbatim excerpt ("…" where cut, from home/data.ts). "Read the full review"
 * swaps in the whole quote. The button needs JS: it keeps its space but stays
 * hidden until hydration (no shift), so no-JS reads the excerpt only.
 */
const noopSubscribe = () => () => {};

const Quote = ({ q }: { q: QuoteData }) => {
  const [open, setOpen] = useState(false);
  // false in the server HTML, true once hydrated: the toggle only shows when it can work.
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const id = useId();
  const toggled = useRef(false);
  // The quote's height changed: later chapters' trigger starts move with it.
  useEffect(() => {
    if (!toggled.current) return;
    ScrollTrigger.refresh();
  }, [open]);
  // A cut at the start shows as a leading "…" too (the data marks only inner/trailing cuts).
  const lead = q.quote.startsWith(q.excerpt.split('…')[0]) ? '' : '…';
  return (
    // The figure's className must stay static: GSAP adds `is-in` to it (data-fade).
    <figure className="cs-quote" data-fade>
      {/* One row: the rating, and the toggle on the right (saves a row per chapter: height caps). */}
      <div className="cs-quote-top">
        <Stars className="h-review-stars cs-stars" />
        <button
          type="button"
          className="h-label cs-quote-more"
          aria-expanded={open}
          aria-controls={id}
          data-ready={ready ? '' : undefined}
          onClick={() => {
            toggled.current = true;
            setOpen((v) => !v);
          }}
        >
          {open ? 'Show less' : 'Read the full review'}
        </button>
      </div>
      <blockquote className="h-lead cs-quote-text" id={id}>
        <p>“{open ? q.quote : `${lead}${q.excerpt}`}”</p>
      </blockquote>
      <figcaption className="cs-quote-by">
        <ReviewAvatar r={q} className="cs-avatar" />
        <span>
          <span className="h-label cs-quote-name">{q.name}</span>
          <span className="h-meta cs-quote-role">{q.role}</span>
        </span>
      </figcaption>
    </figure>
  );
};

/** The v4 composition, static: base (tint + browser), the top of the store's page, the phone. */
/**
 * Chapter 01 (`first`) is in the first screen and is the page's LCP (CRO iter 6): its base and screen
 * layers preload at high priority, and it reveals with a CSS cover from first paint (`cs-first`, transform
 * only, case-studies.css) instead of the JS clip wipe, so the image is painted at once and never waits on
 * hydration. `is-in` in the server HTML makes the chapter trigger skip it.
 */
const CaseMedia = ({ c, first }: { c: Chapter; first: boolean }) => {
  const load = first ? ({ preload: true, fetchPriority: 'high' } as const) : ({ loading: 'lazy' } as const);
  return (
    <div className={first ? 'cs-media cs-first is-in' : 'cs-media'} data-cs-wipe>
      <span className="cs-stack">
        <Image src={c.media.base} alt={`${c.name} storefront on desktop and mobile`} fill sizes="(min-width: 1024px) 38vw, 92vw" {...load} className="cs-layer" />
        <span
          className="cs-screen"
          style={{ left: `${WORK_WINDOW.left}%`, top: `${WORK_WINDOW.top}%`, width: `${WORK_WINDOW.width}%`, height: `${WORK_WINDOW.height}%` } as CSSProperties}
        >
          <Image src={c.media.screen} alt="" width={736} height={1577} sizes="(min-width: 1024px) 33vw, 80vw" {...load} className="cs-screen-img" />
        </span>
        <Image src={c.media.phone} alt="" fill sizes="(min-width: 1024px) 38vw, 92vw" loading={first ? 'eager' : 'lazy'} className="cs-layer" />
      </span>
      <span className="h-label cs-media-n" aria-hidden="true">{c.number}</span>
    </div>
  );
};

const Ledger = ({ c }: { c: Chapter }) => (
  <div className="cs-ledger">
    <h3 className="sr-only">Challenge and what we did</h3>
    <div className="h-label cs-ledger-head" aria-hidden="true">
      <span>Challenge</span>
      <span>What we did</span>
    </div>
    <ul className="cs-rows">
      {c.rows.map((r) => (
        <li key={r.challenge} className="cs-row">
          <span className="cs-c">
            <span className="h-ledger-ico h-ledger-ico--x" aria-hidden="true">
              <X size={10} strokeWidth={2.75} />
            </span>
            <span>
              <span className="sr-only">Challenge: </span>
              <span className="cs-c-text">{r.challenge}</span>
            </span>
          </span>
          <span className="cs-r">
            <span className="h-ledger-ico h-ledger-ico--ok cs-ok" aria-hidden="true">
              <Check size={10} strokeWidth={3} />
            </span>
            <span className="h-line cs-r-line">
              <span className="h-line-in">
                <span className="sr-only">What we did: </span>
                {r.result}
              </span>
            </span>
          </span>
        </li>
      ))}
    </ul>
  </div>
);

/**
 * The four case chapters. Desktop: the mockup sticks (cols 1–5) while the story
 * scrolls (cols 7–12). Signature, the ledger: when a ledger reaches the
 * reading line, row by row the challenge fades/rises in (never struck through,
 * Ruchi fix pass 5), the fix rises with its ✓, and as the second row lands the
 * two results count up. If the results come into view first (fast scroll, deep
 * link), the whole sequence plays at double speed and the numbers count at once,
 * so a number is never shown parked at zero. SSR / no JS / reduced motion: the
 * final state; nothing is pre-hidden outside [data-motion].
 */
const CaseChapters = () => {
  const ref = useRef<HTMLDivElement>(null);

  useHomeMotion(ref, ({ desktop }, root) => {
    const live: Array<gsap.core.Animation> = [];
    const ios: IntersectionObserver[] = [];

    root.querySelectorAll<HTMLElement>('[data-cs-wipe]').forEach((el) => {
      if (el.classList.contains('is-in')) return;
      const stack = el.querySelector('.cs-stack');
      // Mirrored chapters (desktop): the media sits on the right, so it wipes in from the outer edge.
      const fromRight = desktop && !!el.closest('.cs-chapter--even');
      // Media already peeking into the first screen at load (chapter 01 at 1440x900) reveals on load,
      // not on the first scroll.
      const start = el.getBoundingClientRect().top < window.innerHeight ? 'top bottom' : 'top 85%';
      triggerOnce({ trigger: el, start }, () => {
        if (!fromRight) return playWipe(el, stack);
        live.push(
          gsap.fromTo(
            el,
            { clipPath: 'inset(0 0 0 100%)' },
            {
              clipPath: 'inset(0 0 0 0%)',
              duration: 1,
              ease: 'dc',
              onComplete: () => {
                el.classList.add('is-in');
                gsap.set(el, { clearProps: 'clipPath' });
              },
            },
          ),
        );
        if (stack) live.push(gsap.fromTo(stack, { scale: 1.12 }, { scale: 1, duration: 1, ease: 'dc', clearProps: 'transform' }));
      });
    });

    root.querySelectorAll<HTMLElement>('.cs-chapter').forEach((ch) => {
      const ledger = ch.querySelector<HTMLElement>('.cs-ledger');
      const statsBox = ch.querySelector<HTMLElement>('.cs-stats');
      if (!ledger || !statsBox) return;
      const rows = Array.from(ledger.querySelectorAll<HTMLElement>('.cs-row'));
      const stats = Array.from(statsBox.querySelectorAll<HTMLElement>('[data-countup]'));
      let fired = false;

      const count = () =>
        stats.forEach((s, k) => {
          s.classList.add('is-counting');
          const t = playCount(s, k * 0.12);
          if (t) live.push(t);
        });

      const fire = (fast: boolean) => {
        if (fired) return;
        fired = true;
        const tl = gsap.timeline();
        const gap = window.matchMedia('(max-width: 767px)').matches ? ROW_GAP_PHONE : ROW_GAP;
        rows.forEach((row, i) => {
          const at = i * gap;
          tl.fromTo(row.querySelector('.cs-c'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, ease: 'dc' }, at)
            .fromTo(row.querySelector('.cs-r-line .h-line-in'), { yPercent: 105, y: 0 }, { yPercent: 0, y: 0, duration: 0.7, ease: 'dc' }, at + 0.3)
            .fromTo(row.querySelector('.cs-ok'), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'dc' }, at + 0.35);
        });
        // The inline from-states now hold the pre-state; the CSS one can go.
        ledger.classList.add('is-in');
        if (fast) {
          tl.timeScale(2);
          count();
        } else tl.call(count, [], COUNT_AFTER_ROWS * gap);
        live.push(tl);
      };

      triggerOnce({ trigger: ledger, start: desktop ? 'top 85%' : 'top 88%' }, () => fire(false));
      const io = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          io.disconnect();
          fire(true);
        },
        { threshold: 0.5 },
      );
      io.observe(statsBox);
      ios.push(io);
    });

    // Breakpoint flip / unmount: land everything on its final state.
    return () => {
      ios.forEach((io) => io.disconnect());
      live.forEach((a) => a.progress(1).kill());
      root.querySelectorAll('.cs-ledger, [data-cs-wipe]').forEach((l) => l.classList.add('is-in'));
      live.forEach((a) => a.kill()); // count tweens started by the line above
      root.querySelectorAll<HTMLElement>('[data-countup]').forEach((s) => {
        const out = s.querySelector('.h-count');
        if (out) out.textContent = s.dataset.countup ?? '';
        s.classList.add('is-in');
      });
    };
  });

  return (
    <div ref={ref} className="cs-chapters">
      {CHAPTERS.map((c, ci) => {
        const id = `cs-title-${c.number}`;
        // Chapter 01 can sit in the first screen (short laptops): its reveals fire on load when in view.
        const first = ci === 0 ? { 'data-start': '100%' } : {};
        return (
          <article
            key={c.slug}
            id={c.slug}
            // Chapters 02 and 04 mirror at >= 1024 (media right): the sticky images zig-zag.
            className={ci % 2 === 1 ? 'cs-chapter cs-chapter--even' : 'cs-chapter'}
            aria-labelledby={id}
            data-anchor-offset="-112"
          >
            <div className="h-container">
              {/* The ask row's hairline doubles as the separator before the next chapter. */}
              {ci > 0 && ci !== ASK_AFTER + 1 && <span className="cs-sep" data-draw aria-hidden="true" />}
              <div className="h-grid cs-grid">
                <div className="cs-meta">
                  <span className="h-label">
                    {c.number} / {pad2(CHAPTERS.length)}
                  </span>
                  <span className="h-meta cs-domain">{c.client}</span>
                  <span className="cs-meta-rule" data-draw aria-hidden="true" {...first} />
                </div>

                <CaseMedia c={c} first={ci === 0} />

                <div className="cs-body">
                  <h2 id={id} className="h-d-m cs-title" data-rise {...first}>
                    <span className="h-line">
                      <span className="h-line-in">{c.title}</span>
                    </span>
                  </h2>
                  <p className="h-lead cs-brief" data-fade {...first}>
                    {c.description}
                  </p>

                  <Ledger c={c} />

                  <div className="cs-stats">
                    <h3 className="sr-only">Results</h3>
                    <ul className="cs-stat-list">
                      {c.stats.map((s) => (
                        <li key={s.label} className="cs-stat">
                          <Num final={s.final} mode="count" className="h-d-l cs-stat-num" />
                          <p className="h-meta cs-stat-label">{s.label}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {c.quote && <Quote q={c.quote} />}

                  <ArrowLink
                    href={c.link}
                    external
                    diagonal
                    className="cs-live"
                    aria-label={`Visit live store: ${c.client} (opens in a new tab)`}
                  >
                    Visit live store
                  </ArrowLink>
                </div>
              </div>
              {ci === ASK_AFTER && (
                <div className="cs-ask">
                  <span className="cs-ask-rule" data-draw aria-hidden="true" />
                  <div className="cs-ask-copy" data-fade>
                    <p className="h-title cs-ask-text">Sound like your store?</p>
                    <p className="h-meta cs-ask-note">
                      Projects start at $990 and most builds take 2–4 weeks. You get a detailed audit of your store before the call.
                    </p>
                  </div>
                  <div className="cs-ask-btn" data-fade>
                    <PrimaryButton href="/contact-us">Book a free strategy call</PrimaryButton>
                  </div>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default CaseChapters;
