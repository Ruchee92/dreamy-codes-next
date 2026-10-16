"use client";
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import NearImage from './NearImage';
import { ArrowLink, IconButton, SecondaryButton } from './Buttons';
import Num from './Num';
import { CASES, PROCESS } from './data';
import { gsap, initReveals, playWipe, triggerOnce, useHomeMotion } from './motion';

const STICKY_BASE = 96;

/** D-017: phones, tablets and touch screens get a snap slider (CSS); keep in sync with home.css. */
const MQ_SLIDER = '(max-width: 1023px), (not (pointer: fine))';
const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * Slider behaviour on top of the CSS snap row: counter, progress and prev/next
 * follow the scroll position (one scrollLeft read per frame, card pitch measured
 * on resize only), and carousel semantics are applied only while the row is a
 * slider. Without JS the row still swipes; the controls stay hidden.
 */
function useCaseSlider(listRef: React.RefObject<HTMLOListElement | null>, hudRef: React.RefObject<HTMLDivElement | null>) {
  const [index, setIndex] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  useEffect(() => {
    const list = listRef.current;
    const hud = hudRef.current;
    if (!list || !hud) return;
    const cards = Array.from(list.children) as HTMLElement[];
    const fill = hud.querySelector<HTMLElement>('.h-progress-fill');
    const mq = window.matchMedia(MQ_SLIDER);
    let pitch = 1;
    let max = 1;
    let raf = 0;
    const measure = () => {
      pitch = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : list.clientWidth;
      max = Math.max(1, list.scrollWidth - list.clientWidth);
    };
    const update = () => {
      raf = 0;
      const x = list.scrollLeft;
      if (fill) fill.style.transform = `scaleX(${Math.min(1, x / max)})`;
      setIndex(Math.max(0, Math.min(cards.length - 1, Math.round(x / pitch))));
      setAtEnd(x >= max - 2);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const ro = new ResizeObserver(() => {
      measure();
      update();
    });
    const apply = () => {
      const on = mq.matches;
      if (on) {
        list.setAttribute('role', 'region');
        list.setAttribute('aria-roledescription', 'carousel');
        list.setAttribute('aria-label', 'Case studies');
        cards.forEach((c, i) => {
          c.setAttribute('role', 'group');
          c.setAttribute('aria-roledescription', 'slide');
          c.setAttribute('aria-label', `${i + 1} of ${cards.length}`);
        });
        hud.setAttribute('data-ready', '');
      } else {
        ['role', 'aria-roledescription', 'aria-label'].forEach((a) => {
          list.removeAttribute(a);
          cards.forEach((c) => c.removeAttribute(a));
        });
        hud.removeAttribute('data-ready');
      }
    };
    apply();
    measure();
    update();
    mq.addEventListener('change', apply);
    list.addEventListener('scroll', onScroll, { passive: true });
    ro.observe(list);
    return () => {
      mq.removeEventListener('change', apply);
      list.removeEventListener('scroll', onScroll);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [listRef, hudRef]);

  const go = (dir: -1 | 1) => {
    const list = listRef.current;
    if (!list) return;
    const cards = Array.from(list.children) as HTMLElement[];
    const target = cards[Math.max(0, Math.min(cards.length - 1, index + dir))];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    list.scrollTo({ left: target.offsetLeft - cards[0].offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
  };
  return { index, atStart: index === 0, atEnd, go };
}
const STICKY_STEP = 20;
const STACK_GAP = 64;

/**
 * Four case studies as ledger cards. Desktop: they stack (CSS sticky) and each
 * card settles back as the next one arrives. Mobile: plain flow with the same
 * wipe/rise verbs. All positions below are derived from the cards' natural
 * (un-stuck) layout, because a stuck card reports a shifted rect.
 */
const CaseStudies = () => {
  const ref = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const slider = useCaseSlider(listRef, hudRef);

  useHomeMotion(ref, ({ desktop, tall }, root) => {
    const header = root.querySelector<HTMLElement>('.h-cases-head');
    if (header) initReveals(header);

    const process = root.querySelector<HTMLElement>('.h-process');
    if (process) initReveals(process);

    const stack = root.querySelector<HTMLElement>('.h-stack');
    const items = Array.from(root.querySelectorAll<HTMLElement>('.h-case'));
    if (!stack || !items.length) return;

    if (!desktop) {
      items.forEach((item) => {
        item.querySelectorAll('[data-m-fade]').forEach((el) => el.setAttribute('data-fade', ''));
        initReveals(item);
      });
    } else {
      const natTop = (i: number) => {
        let y = stack.getBoundingClientRect().top + window.scrollY;
        for (let j = 0; j < i; j++) y += items[j].offsetHeight + STACK_GAP;
        return y;
      };
      const stickyTop = (i: number) => STICKY_BASE + i * STICKY_STEP;

      items.forEach((item, i) => {
        const shade = item.querySelector('.h-case-shade');
        const media = item.querySelector<HTMLElement>('[data-wipe]');

        // The previous card steps back while this one travels to its sticky spot.
        if (tall && i < items.length - 1) {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: stack,
                start: () => natTop(i + 1) - window.innerHeight,
                end: () => natTop(i + 1) - stickyTop(i + 1),
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            })
            .fromTo(item, { scale: 1, transformOrigin: '50% 0%' }, { scale: 0.94, ease: 'none' }, 0)
            .fromTo(shade, { opacity: 0 }, { opacity: 0.1, ease: 'none' }, 0);
        }

        if (media) {
          triggerOnce({ trigger: stack, start: () => natTop(i) - window.innerHeight }, () => {
            if (!media.classList.contains('is-in')) playWipe(media, media.querySelector('img'));
          });
        }
      });
    }

    return () => {
      gsap.set(items, { clearProps: 'transform' });
    };
  }, { defer: true });

  return (
    <section ref={ref} id="case-studies" className="h-cases" aria-labelledby="h-cases-title">
      <div className="h-container">
        <header className="h-cases-head">
          <h2 id="h-cases-title" className="h-d-l" data-rise>
            <span className="h-line"><span className="h-line-in">Case studies</span></span>
          </h2>
        </header>

        <ol ref={listRef} className="h-stack">
          {CASES.map((c, i) => (
            <li key={c.number} className="h-case" style={{ ['--i' as string]: i }}>
              <div className="h-case-media">
                <a
                  href={c.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="h-case-media-link"
                >
                  <span className="h-case-imgwrap" data-wipe>
                    <NearImage
                      src={c.image}
                      alt={`${c.title} - case study`}
                      width={1980}
                      height={1980}
                      sizes="(min-width: 1440px) 660px, (min-width: 1024px) 50vw, 100vw"
                      className="h-case-img"
                    />
                  </span>
                </a>
              </div>

              <div className="h-case-body">
                <div className="h-case-top">
                  <p className="h-label h-muted">{c.number}</p>
                  <p className="h-label h-muted h-case-client">{c.client}</p>
                </div>
                <h3 className="h-title h-case-title" data-m-fade>{c.title}</h3>
                <p className="h-body h-muted h-case-desc" data-m-fade>{c.description}</p>

                <ul className="h-case-stats">
                  {c.stats.map((s) => (
                    <li key={s.label} className="h-case-stat">
                      <Num final={s.final} className="h-d-m h-accent-ind" />
                      <p className="h-meta">{s.label}</p>
                    </li>
                  ))}
                </ul>

                {/* D-029: challenge (✕) beside what we did (✓), as on the original site. */}
                <div className="h-ledger-head" aria-hidden="true">
                  <span>Challenge</span>
                  <span>What we did</span>
                </div>
                <ul className="h-ledger">
                  {c.rows.map((r) => (
                    <li key={r.challenge} className="h-ledger-row">
                      <span className="h-ledger-c">
                        <span className="h-ledger-ico h-ledger-ico--x" aria-hidden="true">
                          <X size={10} strokeWidth={2.75} />
                        </span>
                        <span>
                          <span className="sr-only">Challenge: </span>
                          {r.challenge}
                        </span>
                      </span>
                      <span className="h-ledger-r">
                        <span className="h-ledger-ico h-ledger-ico--ok" aria-hidden="true">
                          <Check size={10} strokeWidth={3} />
                        </span>
                        <span>
                          <span className="sr-only">What we did: </span>
                          {r.result}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>

                <ArrowLink
                  href={c.link}
                  external
                  diagonal
                  className="h-case-link"
                  aria-label={`Visit live store: ${c.client} (opens in a new tab)`}
                >
                  Visit live store
                </ArrowLink>
              </div>

              <div className="h-case-shade" aria-hidden="true" />
            </li>
          ))}
        </ol>

        {/* D-017 slider controls (hidden on the desktop stack and until JS is up). */}
        <div ref={hudRef} className="h-cases-hud">
          <p className="h-label h-counter" aria-hidden="true">
            <span className="h-counter-mask">
              <span className="h-counter-list" style={{ transform: `translateY(${-slider.index * 1.2}em)` }}>
                {CASES.map((c, i) => (
                  <span key={c.number}>{pad2(i + 1)}</span>
                ))}
              </span>
            </span>
            <span>/ {pad2(CASES.length)}</span>
          </p>
          <span className="h-progress" aria-hidden="true">
            <span className="h-progress-fill" />
          </span>
          <div className="h-cases-nav">
            <IconButton aria-label="Previous case study" disabled={slider.atStart} onClick={() => slider.go(-1)}>
              <ArrowLeft size={18} strokeWidth={1.75} aria-hidden="true" />
            </IconButton>
            <IconButton aria-label="Next case study" disabled={slider.atEnd} onClick={() => slider.go(1)}>
              <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" />
            </IconButton>
          </div>
        </div>

        {/* How an engagement runs (G6): the published three steps, then the ask. */}
        <div className="h-process">
          <p className="h-body h-muted h-process-label">How does it work?</p>
          <ol className="h-process-steps">
            {PROCESS.map((step, i) => (
              <li key={step.number} className="h-process-step">
                <span className="h-process-rule" data-draw data-delay={i * 0.1} aria-hidden="true" />
                {/* No "01/02/03" label: the ordered list and the rules already carry the sequence (H6). */}
                <h3 className="h-title h-process-title">{step.title}</h3>
                <p className="h-body h-muted">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Outline, not solid: the capabilities primary is often in the same view (H4). */}
        <div className="h-cases-cta">
          <SecondaryButton href="#contact">Book a free strategy call</SecondaryButton>
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
