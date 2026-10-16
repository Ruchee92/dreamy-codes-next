"use client";
import { useEffect, useId, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { ArrowRight, X } from 'lucide-react';
import { lenisRef } from './home/motion';
import { CONTACT_FOUNDER, CONTACT_STEPS } from '../data/contactNext';
import StoreStep from './StoreStep';
import './contact-success.css';

const EXIT_MS = 220;
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The dialog after a successful contact form send (home + /contact-us), in the
 * Engineered Editorial system: hard edges, ink on paper, one indigo action.
 * It restates the published promise as the same three steps as the /contact-us
 * panel (shared data), with step 01 ticked and step 02 next.
 *
 * Portalled to <body> (above the fixed nav, outside any section's stacking
 * context). Open: the panel rises out of a clip, the check draws, the steps
 * follow; close reverses quickly. Reduced motion: instant. A11y: modal dialog
 * labelled by its heading, focus moved in and trapped, Esc / × / backdrop /
 * "Back to the site" close it, focus returns to the submit button. While open
 * the page doesn't scroll (Lenis stopped, overflow hidden with a stable
 * scrollbar gutter, so nothing shifts).
 */
const ContactSuccess = ({
  open,
  onClose,
  returnFocus,
  store,
}: {
  open: boolean;
  onClose: () => void;
  returnFocus?: RefObject<HTMLElement | null>;
  /** The sent store URL as a bare domain (storeDomain), shown in step 02. */
  store?: string | null;
}) => {
  const uid = useId();
  const panel = useRef<HTMLDivElement>(null);
  // Mounted while open and for the exit animation.
  const [shown, setShown] = useState(open);
  const [closing, setClosing] = useState(false);
  if (open && !shown) setShown(true);
  if (!open && shown && !closing) setClosing(true);

  useEffect(() => {
    if (!closing) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = window.setTimeout(() => {
      setShown(false);
      setClosing(false);
    }, reduce ? 0 : EXIT_MS);
    return () => window.clearTimeout(t);
  }, [closing]);

  // Scroll lock + focus handling for the whole time it is on screen.
  useEffect(() => {
    if (!shown) return;
    const html = document.documentElement;
    const prev = { overflow: html.style.overflow, gutter: html.style.scrollbarGutter };
    // Keep the space of a classic scrollbar (none to keep with overlay scrollbars).
    if (window.innerWidth - html.clientWidth > 0) html.style.scrollbarGutter = 'stable';
    html.style.overflow = 'hidden';
    lenisRef.current?.stop();
    panel.current?.focus({ preventScroll: true });
    const back = returnFocus?.current;
    return () => {
      html.style.overflow = prev.overflow;
      html.style.scrollbarGutter = prev.gutter;
      // Order matters. 1) Focus goes back to the submit button while Lenis is still
      // stopped: MotionBoot glides to any keyboard-focused element that is off
      // screen, and a stopped Lenis ignores that glide (it was the ~680px jump
      // after Esc). 2) Lenis is re-synced to where the page actually is (a native
      // scroll may have moved it), 3) then resumes, so nothing catches up.
      back?.focus({ preventScroll: true });
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(window.scrollY, { immediate: true, force: true });
        lenis.start();
      }
    };
  }, [shown, returnFocus]);

  useEffect(() => {
    if (!shown || closing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panel.current) return;
      const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === panel.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [shown, closing, onClose]);

  if (!shown) return null;

  return createPortal(
    <div className="csm" data-state={closing ? 'closing' : 'open'}>
      <div className="csm-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        ref={panel}
        className="csm-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-t`}
        aria-describedby={`${uid}-d`}
        tabIndex={-1}
      >
        <span className="csm-bar" aria-hidden="true" />
        <button type="button" className="csm-x" onClick={onClose} aria-label="Close">
          <X size={20} strokeWidth={1.75} aria-hidden="true" />
        </button>
        <h2 id={`${uid}-t`} className="csm-title">Thanks, we’ve got it.</h2>
        <ol id={`${uid}-d`} className="csm-steps">
          {CONTACT_STEPS.map((text, i) => (
            <li key={text} className={`csm-step${i === 0 ? ' is-done' : i === 1 ? ' is-next' : ''}`} style={{ '--i': i } as CSSProperties}>
              <span className="csm-idx">
                {i === 0 ? (
                  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
                    <path className="csm-check" d="M2.5 8.5l3.5 3.5 7.5-8" />
                  </svg>
                ) : (
                  String(i + 1).padStart(2, '0')
                )}
              </span>
              <span className="csm-step-t">
                {i === 1 ? <StoreStep text={text} store={store} className="csm-store" /> : text}
                {i === 0 && <span className="csm-tag"> Done</span>}
                {i === 1 && <span className="csm-tag"> Next</span>}
              </span>
            </li>
          ))}
        </ol>
        <div className="csm-foot">
          <p className="csm-who">
            <Image src={CONTACT_FOUNDER.image} alt="" width={40} height={50} sizes="40px" className="csm-who-img" />
            <span>
              <span className="csm-who-t">{CONTACT_FOUNDER.title}</span>
              <span className="csm-who-r">{CONTACT_FOUNDER.role}</span>
            </span>
          </p>
          <button type="button" className="csm-btn" onClick={onClose}>
            <span>Back to the site</span>
            <span className="csm-btn-arrow" aria-hidden="true">
              <ArrowRight size={18} strokeWidth={1.75} />
              <ArrowRight size={18} strokeWidth={1.75} />
            </span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ContactSuccess;
