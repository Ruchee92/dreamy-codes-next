"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';
import ContactSection from '../../ContactSection';
import { gsap } from '../../home/motion';
import StoreStep from '../../StoreStep';
import { storeDomain } from '../../../data/contactNext';
import ReviewAvatar from '../../home/ReviewAvatar';
import { FOUNDER, PRE_SUBMIT, REQUIRED, REVIEWS, SENT, STEPS } from './data';

type Status = 'sending' | 'success' | 'error';

// D-041: one shared star path (as on home's review cards), drawn five times.
const STAR = 'M10 1.6l2.47 5.3 5.8.67-4.3 3.94 1.16 5.72L10 14.35l-5.13 2.88 1.16-5.72-4.3-3.94 5.8-.67z';

/** "n/3": only the digit rolls (up when a field becomes valid, down when one stops being valid). */
const Counter = ({ n }: { n: number }) => (
  <span className="h-title ct-count" aria-hidden="true">
    <span className="ct-count-d">
      <span key={n} className="ct-count-in">{n}</span>
    </span>
    /3
  </span>
);

const Track = ({ n }: { n: number }) => (
  <span className="ct-track" aria-hidden="true">
    <span className="ct-fill" style={{ transform: `scaleX(${n / REQUIRED.length})` }} />
  </span>
);

/**
 * /contact-us form block and the page's signature, "the brief fills in"
 * (design spec §7.2–7.3 + iteration-1 fixes). The shared form (ContactSection,
 * home variant) sits on the left with the price and timezones right above its
 * submit; its side panel carries what happens next (counter on the heading
 * row) and the variant's Direct contact. Facts and two reviews follow the form.
 *
 * The counter tracks the required fields as they become valid (one delegated
 * listener on the form, reading `validity`, so the shared component is not
 * touched): a rolling 0/3 → 3/3 and an indigo fill under the heading. At 3/3
 * the submit arrow runs one conveyor pass. On a successful send, step 01 ticks
 * and step 02 lights. Phones mirror the counter in a slim bar that sticks to
 * the top of the form while it is being filled in (and steps away once the
 * panel's own counter is on screen).
 *
 * No JS: the steps are plain text; the counter and its track keep their space
 * but stay hidden (they would only ever read 0/3). Reduced motion: the fill and
 * the counter jump, no roll, no conveyor.
 */
const ContactBrief = () => {
  const ref = useRef<HTMLElement>(null);
  const [valid, setValid] = useState(0);
  const [sent, setSent] = useState(false);
  const prev = useRef(0);
  const hold = useRef(false);
  // The brief answers back (push-9.5 §5): the typed store URL as a bare domain, or null.
  const [store, setStore] = useState<string | null>(null);

  useEffect(() => {
    const root = ref.current;
    const form = root?.querySelector('form');
    if (!root || !form) return;
    root.setAttribute('data-live', '');
    const count = () =>
      REQUIRED.filter((name) => (form.elements.namedItem(name) as HTMLInputElement | null)?.validity.valid).length;
    let raf = 0;
    const update = () => {
      // After a successful send the form resets: the count holds at 3/3 until
      // the visitor types again (no "Sent 0/3").
      if (hold.current) return;
      cancelAnimationFrame(raf);
      // Checked again at paint time: a count scheduled just before the send must not land after the reset.
      raf = requestAnimationFrame(() => {
        if (!hold.current) setValid(count());
      });
    };
    let storeT = 0;
    const onInput = (e: Event) => {
      hold.current = false;
      update();
      if ((e.target as HTMLInputElement).name === 'url') {
        const value = (e.target as HTMLInputElement).value;
        window.clearTimeout(storeT);
        storeT = window.setTimeout(() => setStore(storeDomain(value)), 250);
      }
    };
    form.addEventListener('input', onInput);
    form.addEventListener('focusout', update);
    form.addEventListener('reset', update);
    update(); // browser autofill can arrive before hydration

    // Phones: the sticky bar steps away once the form has scrolled up past it
    // (Chrome bounds sticky by the parent, not the grid area, so CSS alone
    // would keep it over the side panel), and while the panel's own counter is
    // on screen, so the count never shows twice.
    const bar = root.querySelector<HTMLElement>('.ct-bar');
    const next = root.querySelector<HTMLElement>('.ct-next');
    let past = false;
    let twin = false;
    let formIn = false;
    let barIn = false;
    // The floating WhatsApp launcher and Back to top step aside only while the
    // form is on screen, or the phone bar is actually showing (its 0/3 sits where
    // the launcher is; UX N1): html.ct-form-in, contact.css. A bar that has
    // stepped away (is-past) no longer counts, so they return as the form leaves.
    const html = document.documentElement;
    const sync = () => {
      const hidden = past || twin;
      bar?.classList.toggle('is-past', hidden);
      html.classList.toggle('ct-form-in', formIn || (barIn && !hidden));
    };
    const io = new IntersectionObserver(([e]) => {
      past = !e.isIntersecting && e.boundingClientRect.top < 0;
      sync();
    }, { rootMargin: '-130px 0px 0px 0px' });
    io.observe(form);
    const io2 = new IntersectionObserver(([e]) => {
      twin = e.isIntersecting;
      sync();
    });
    if (next) io2.observe(next);
    const io3 = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target === form) formIn = e.isIntersecting;
        else barIn = e.isIntersecting;
      });
      sync();
    });
    io3.observe(form);
    if (bar) io3.observe(bar);
    return () => {
      io.disconnect();
      io2.disconnect();
      io3.disconnect();
      html.classList.remove('ct-form-in');
      cancelAnimationFrame(raf);
      form.removeEventListener('input', onInput);
      window.clearTimeout(storeT);
      form.removeEventListener('focusout', update);
      form.removeEventListener('reset', update);
      root.removeAttribute('data-live');
    };
  }, []);

  useLayoutEffect(() => {
    const root = ref.current;
    const from = prev.current;
    prev.current = valid;
    if (!root || from === valid || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const dir = valid > from ? 1 : -1;
    gsap.fromTo(root.querySelectorAll('.ct-count-in'), { yPercent: 110 * dir }, { yPercent: 0, duration: 0.5, ease: 'dc' });
    if (valid === REQUIRED.length) {
      const btn = root.querySelector<HTMLElement>('.cs-home-btn');
      if (!btn) return;
      btn.classList.remove('ct-pass');
      void btn.offsetWidth; // restart the keyframes if it was mid-pass
      btn.classList.add('ct-pass');
      const t = window.setTimeout(() => btn.classList.remove('ct-pass'), 700);
      return () => window.clearTimeout(t);
    }
  }, [valid]);

  const onStatus = useCallback((s: Status) => {
    if (s !== 'success') return;
    hold.current = true;
    setValid(REQUIRED.length);
    setSent(true);
  }, []);

  const full = valid === REQUIRED.length;

  const review = (r: (typeof REVIEWS)[number]) => (
    <figure key={r.name} className="ct-review">
      <p className="ct-stars">
        <span className="sr-only">Rated 5 out of 5</span>
        {Array.from({ length: 5 }, (_, i) => (
          <svg key={i} viewBox="0 0 20 20" width="12" height="12" aria-hidden="true" focusable="false">
            <path d={STAR} />
          </svg>
        ))}
      </p>
      <blockquote className="ct-review-q">
        <p className="h-body">{r.excerpt}</p>
      </blockquote>
      <figcaption className="ct-review-by">
        <ReviewAvatar r={r} className="ct-review-avatar" />
        <span>
          <span className="h-label ct-review-name">{r.name}</span>
          <span className="h-meta ct-review-role">{r.role}</span>
        </span>
      </figcaption>
    </figure>
  );

  // The side panel: what happens next (with the counter on its heading row),
  // then the variant's own Direct contact. Facts and reviews follow the form.
  const aside = (
    <div className="ct-next">
      <div className="ct-next-head">
        <h3 className="ct-panel-title">What happens next</h3>
        <Counter n={valid} />
      </div>
      <Track n={valid} />
      <ol className={`ct-steps${sent ? ' is-sent' : ''}`}>
        {STEPS.map((text, i) => (
          <li key={text} className="ct-step">
            <div className="ct-step-row">
              <span className="h-label ct-step-idx">
                <span className="ct-idx-n">{String(i + 1).padStart(2, '0')}</span>
                {i === 0 && (
                  <span className="ct-idx-tick" aria-hidden="true">
                    <Check size={14} strokeWidth={2} />
                  </span>
                )}
              </span>
              <span className="h-body ct-step-t">
                {i === 1 ? <StoreStep text={text} store={store} className="ct-store" /> : text}
                {i === 0 && sent && <span className="sr-only"> (done)</span>}
              </span>
            </div>
            {i === 0 && sent && (
              <p className="h-meta ct-sent" role="status">
                {SENT}
              </p>
            )}
          </li>
        ))}
      </ol>
      <div className="ct-founder">
        <Image src={FOUNDER.image} alt="Ruchi, Founder and Lead Engineer at Dreamy Codes" width={64} height={80} sizes="64px" className="ct-founder-img" />
        <p>
          <span className="h-title ct-founder-t">{FOUNDER.title}</span>
          <span className="h-meta ct-founder-r">{FOUNDER.role}</span>
        </p>
      </div>
      <p className="sr-only" aria-live="polite">
        {sent ? '' : `${valid} of ${REQUIRED.length} required fields complete`}
      </p>
    </div>
  );

  return (
    <section ref={ref} id="contact" data-anchor-offset="-112" className={`ct-form${full ? ' is-full' : ''}`} aria-labelledby="ct-form-title">
      <div className="h-container">
        {/* D-074: visually hidden (the visible version repeated the hero intro); still names the form section. */}
        <h2 id="ct-form-title" className="sr-only">Tell us about your store</h2>
        {/* D-074: the trust facts moved to the hero meta row. */}
        <div className="ct-body">
          {/* Phones: the counter, mirrored where it can be seen while typing. */}
          <div className="ct-bar" aria-hidden="true">
            <span className="ct-bar-row">
              <span className="h-label ct-bar-k">{sent ? 'Sent' : 'Required fields'}</span>
              <Counter n={valid} />
            </span>
            <Track n={valid} />
          </div>
          <ContactSection
            variant="home"
            aside={aside}
            onStatusChange={onStatus}
            submitNote={<p className="h-body ct-pre">{PRE_SUBMIT}</p>}
            promiseNote={false}
          />
        </div>
        <div className="h-grid ct-after">
          <div className="ct-reviews">{REVIEWS.map(review)}</div>
        </div>
      </div>
    </section>
  );
};

export default ContactBrief;
