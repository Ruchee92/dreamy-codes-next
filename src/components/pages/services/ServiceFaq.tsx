"use client";
import { useEffect, useLayoutEffect, useState } from 'react';
import { anchorOffset, glideTo } from '../../home/anchor';
import { ScrollTrigger } from '../../home/motion';
import { reviewBy } from '../../home/data';
import ReviewAvatar from '../../home/ReviewAvatar';
import Lines from '../../site/Lines';
import { serviceFaqs } from '@/data/serviceFaqs';

/**
 * The 12 FAQs, rendered from the same array FaqJsonLd reads, so the visible
 * text and the schema cannot drift. Every answer is in the server HTML
 * (collapsed with grid-template-rows, never unmounted); without JS they all
 * show open. `#faq-<slug>` (on load, or from the "Also" links) opens its item;
 * MotionBoot's anchor glide then brings it into view. D-065: no button in the
 * side column; the hero and the closing band are the page's only primary CTAs.
 */
/**
 * Hyphenated words ("mobile-friendly", "e-commerce") never split at the hyphen. They sit in a
 * nowrap span, so the text itself stays identical to the FAQPage schema.
 */
const keepHyphenated = (s: string) =>
  s.split(/(\S+-\S+)/).map((part, i) => (i % 2 ? <span key={i} className="sv-nowrap">{part}</span> : part));

// D-055: Kuldeep (Style-on Eyewear): "knows what is needed to create a converting
// shopify store". No reviewer repeats across inner pages.
const VOICE = reviewBy('Kuldeep');

const ServiceFaq = () => {
  const [open, setOpen] = useState<ReadonlySet<string>>(() => new Set([serviceFaqs[0].slug]));

  // A cold `#faq-*` load: open the item before MotionBoot's glide measures it
  // (layout effect, so it is open in the first painted frame). Safety net for
  // slow devices/networks (QA iter 6): once the page has loaded, the fonts are
  // in and the scroll scenes have refreshed, re-land the item at its anchor
  // offset if it drifted, unless the reader has scrolled meanwhile.
  useLayoutEffect(() => {
    const m = window.location.hash.match(/^#faq-(.+)$/);
    const slug = m ? decodeURIComponent(m[1]) : '';
    if (!serviceFaqs.some((f) => f.slug === slug)) return;
    const openIt = () => setOpen((prev) => new Set(prev).add(slug));
    openIt();
    let cancelled = false;
    const onUser = () => {
      cancelled = true;
    };
    const opts = { passive: true, once: true } as const;
    window.addEventListener('wheel', onUser, opts);
    window.addEventListener('touchstart', onUser, opts);
    window.addEventListener('keydown', onUser, { once: true });
    const loaded = new Promise<void>((res) => {
      if (document.readyState === 'complete') res();
      else window.addEventListener('load', () => res(), { once: true });
    });
    // Re-land after load + fonts at 0.9s, 2.5s and 5s, and after any ScrollTrigger refresh
    // in the first 6s (late layout passes moved it in QA iter 7), unless the reader scrolled.
    const timers: number[] = [];
    const t0 = performance.now();
    const reland = () => {
      const btn = document.getElementById(`faq-${slug}`);
      if (cancelled || !btn) return;
      if (Math.abs(btn.getBoundingClientRect().top + anchorOffset(btn)) > 4) glideTo(btn, { immediate: true });
    };
    const onRefresh = () => {
      if (performance.now() - t0 < 6000) requestAnimationFrame(reland);
    };
    ScrollTrigger.addEventListener('refresh', onRefresh);
    Promise.all([loaded, document.fonts?.ready]).then(() => {
      [900, 2500, 5000].forEach((ms) => timers.push(window.setTimeout(reland, ms)));
    });
    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
      ScrollTrigger.removeEventListener('refresh', onRefresh);
      window.removeEventListener('wheel', onUser);
      window.removeEventListener('touchstart', onUser);
      window.removeEventListener('keydown', onUser);
    };
  }, []);

  useEffect(() => {
    // React owns the open state from here; the pre-hydration :target rule switches off.
    document.getElementById('faq')?.setAttribute('data-ready', '');
    const openSlug = (slug: string) => {
      if (serviceFaqs.some((f) => f.slug === slug)) setOpen((prev) => new Set(prev).add(slug));
    };
    const onHash = () => {
      const m = window.location.hash.match(/^#faq-(.+)$/);
      if (m) openSlug(decodeURIComponent(m[1]));
    };
    window.addEventListener('hashchange', onHash);
    // Capture phase, like MotionBoot's anchor handler (which stops the click
    // from reaching React): both listeners on document still run.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#faq-"]');
      if (a) openSlug(decodeURIComponent(a.getAttribute('href')!.slice(5)));
    };
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('hashchange', onHash);
    };
  }, []);

  const toggle = (slug: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });

  return (
    <section id="faq" className="sv-faq" aria-labelledby="sv-faq-title">
      <noscript>
        <style>{`.sv-faq-a{grid-template-rows:1fr!important;visibility:visible!important}.sv-faq-a-in{opacity:1!important}.sv-faq-ico{display:none!important}`}</style>
      </noscript>
      <div className="h-container h-grid sv-faq-grid">
        {/* D-070 C4: the head as one display line (three on phones). */}
        <h2 id="sv-faq-title" className="h-d-l sv-faq-title pg-nowrap" data-rise>
          <Lines lines={[{ text: 'Frequently', br: 'mobile' }, { text: 'asked', br: 'mobile' }, 'questions']} />
        </h2>
        <div className="sv-faq-side">
          <div className="sv-faq-aside">
            <p className="h-body sv-faq-line">
              Still have a question? Email{' '}
              <a href="mailto:hello@dreamycodes.com" className="sv-inline">
                hello@dreamycodes.com
              </a>
              .
            </p>
            {/* CRO: a client voice beside the questions. PUBLISHED excerpt, verbatim. */}
            <figure className="sv-faq-quote">
              <blockquote className="h-body">
                <p>&ldquo;{VOICE.excerpt}&rdquo;</p>
              </blockquote>
              <figcaption className="sv-faq-by">
                <ReviewAvatar r={VOICE} className="sv-faq-avatar" />
                <span>
                  <span className="h-label sv-faq-name">{VOICE.name}</span>
                  <span className="h-meta sv-faq-role">{VOICE.role}</span>
                </span>
              </figcaption>
            </figure>
          </div>
        </div>

        <ul className="sv-faq-list">
          {serviceFaqs.map((f, i) => {
            const isOpen = open.has(f.slug);
            return (
              <li key={f.slug} className="sv-faq-item" data-open={isOpen ? 'true' : 'false'}>
                <h3 className="sv-faq-q">
                  <button
                    type="button"
                    id={`faq-${f.slug}`}
                    // Lands below the nav with the item's top rule in view (kit rule, PageShell).
                    data-anchor-offset="-112"
                    className="sv-faq-btn"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${f.slug}-a`}
                    onClick={() => toggle(f.slug)}
                  >
                    <span className="h-label sv-faq-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    <span className="sv-faq-q-text">{keepHyphenated(f.question)}</span>
                    <span className="sv-faq-ico" aria-hidden="true" />
                  </button>
                </h3>
                <div id={`faq-${f.slug}-a`} className="sv-faq-a" role="region" aria-labelledby={`faq-${f.slug}`}>
                  <div className="sv-faq-a-clip">
                    <p className="h-body h-muted sv-faq-a-in">{keepHyphenated(f.answer)}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default ServiceFaq;
