"use client";
import { useId, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { PrimaryButton } from './Buttons';
import { CAPABILITIES } from './data';
import { gsap, ScrollTrigger, initReveals, magnetic, navOverDark, useHomeMotion } from './motion';

/**
 * The three services as an index. Desktop: everything is expanded, the active
 * service brightens and the sticky numeral rolls. Mobile: an accordion (CSS
 * grid-rows, so only the panel's own height changes). The black plate widens
 * to full bleed as the section arrives.
 */
const Capabilities = () => {
  const ref = useRef<HTMLElement>(null);
  const uid = useId();
  const [open, setOpen] = useState(0);

  useHomeMotion(ref, ({ desktop }, root) => {
    initReveals(root);

    const plate = root.querySelector<HTMLElement>('.h-caps-plate');
    if (plate) {
      // Desktop: a wide inset that visibly opens to full bleed, and closes again
      // (to 48px) once its bottom edge is on screen, so the end reads as a card
      // closing. The section behind is paper-2 above / paper below (home.css),
      // so the side strips always match the neighbouring band.
      const inset = desktop ? 96 : 12;
      gsap.fromTo(
        plate,
        { clipPath: `inset(0px ${inset}px 0px ${inset}px)` },
        {
          clipPath: 'inset(0px 0px 0px 0px)',
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: desktop ? 'top 90%' : 'top bottom',
            end: desktop ? 'top 20%' : 'top 30%',
            scrub: 0.6,
          },
        },
      );
      if (desktop) {
        gsap.fromTo(
          plate,
          { clipPath: 'inset(0px 0px 0px 0px)' },
          {
            clipPath: 'inset(0px 48px 0px 48px)',
            ease: 'none',
            immediateRender: false,
            scrollTrigger: { trigger: root, start: 'bottom 92%', end: 'bottom 45%', scrub: 0.6 },
          },
        );
      }
    }

    const offNav = navOverDark(root);
    if (!desktop) {
      return () => {
        offNav();
        if (plate) gsap.set(plate, { clearProps: 'clipPath' });
      };
    }

    const caps = Array.from(root.querySelectorAll<HTMLElement>('.h-cap'));
    const list = root.querySelector<HTMLElement>('.h-numeral-list');
    const cta = root.querySelector<HTMLElement>('[data-magnetic]');
    const cleanups: Array<() => void> = [];
    let current = -1;

    root.setAttribute('data-live', '');
    const activate = (idx: number) => {
      if (idx === current) return;
      current = idx;
      caps.forEach((c, i) => c.classList.toggle('is-active', i === idx));
      if (list) gsap.to(list, { yPercent: -(idx * 100) / caps.length, duration: 0.6, ease: 'dc', overwrite: 'auto' });
    };
    activate(0);

    caps.forEach((cap, i) => {
      // Enter/leave pairs (rather than isActive alone) keep the numeral right
      // after a fast scroll or an anchor jump that skips whole items.
      const last = caps.length - 1;
      ScrollTrigger.create({
        trigger: cap,
        start: 'top 55%',
        end: 'bottom 55%',
        onEnter: () => activate(i),
        onEnterBack: () => activate(i),
        onLeave: () => activate(Math.min(i + 1, last)),
        onLeaveBack: () => activate(Math.max(i - 1, 0)),
      });
      const on = () => activate(i);
      cap.addEventListener('pointerenter', on);
      cap.addEventListener('focusin', on);
      cleanups.push(() => {
        cap.removeEventListener('pointerenter', on);
        cap.removeEventListener('focusin', on);
      });
    });

    if (cta) cleanups.push(magnetic(cta));

    return () => {
      offNav();
      cleanups.forEach((fn) => fn());
      root.removeAttribute('data-live');
      caps.forEach((c) => c.classList.remove('is-active'));
      if (list) gsap.set(list, { clearProps: 'transform' });
      if (plate) gsap.set(plate, { clearProps: 'clipPath' });
    };
  }, { defer: true });

  return (
    <section ref={ref} id="capabilities" className="h-caps" aria-labelledby="h-caps-title">
      <noscript>
        <style>{`.h-cap-panel{grid-template-rows:1fr!important;visibility:visible!important}.h-cap-toggle{display:none!important}`}</style>
      </noscript>
      <div className="h-caps-plate">
        <div className="h-container h-grid h-caps-grid">
          <div className="h-caps-left">
            <h2 id="h-caps-title" className="h-d-m" data-rise>
              <span className="h-line"><span className="h-line-in">Shopify design,</span></span>{' '}
              <span className="h-line"><span className="h-line-in">CRO &amp;</span></span>{' '}
              <span className="h-line"><span className="h-line-in">integrations</span></span>
            </h2>
            <p className="h-lead h-muted-dark h-caps-lede" data-fade>
              Branded store design that converts, the testing that proves it, and the integrations behind your
              retention. All handled by one team.
            </p>
            <div className="h-caps-cta">
              <PrimaryButton href="#contact" magnetic className="h-btn--dark">
                Book a free strategy call
              </PrimaryButton>
            </div>
            <div className="h-numeral" aria-hidden="true">
              <span className="h-numeral-mask">
                <span className="h-numeral-list">
                  {CAPABILITIES.map((c) => (
                    <span key={c.index}>{c.index}</span>
                  ))}
                </span>
              </span>
            </div>
          </div>

          <ol className="h-caps-list">
            {CAPABILITIES.map((c, i) => {
              const titleId = `${uid}-t${i}`;
              const panelId = `${uid}-p${i}`;
              const isOpen = open === i;
              return (
                <li key={c.index} className="h-cap" data-open={isOpen ? 'true' : 'false'}>
                  <span className="h-cap-rule" data-draw aria-hidden="true" />
                  <span className="h-cap-rule-active" aria-hidden="true" />
                  <div className="h-cap-head">
                    <span className="h-label h-muted-dark h-cap-idx">{c.index}</span>
                    <h3 id={titleId} className="h-d-m h-cap-title">{c.title}</h3>
                    <button
                      type="button"
                      className="h-cap-toggle"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      aria-labelledby={titleId}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                    >
                      <Plus size={20} strokeWidth={1.75} aria-hidden="true" />
                    </button>
                  </div>
                  <div id={panelId} className="h-cap-panel">
                    <div className="h-cap-panel-clip">
                      <div className="h-cap-panel-in">
                        <p className="h-lead h-cap-desc">{c.description}</p>
                        <ul className="h-cap-details">
                          {c.details.map((d) => (
                            <li key={d} className="h-body">{d}</li>
                          ))}
                        </ul>
                        {/* Tags are phrases: each stays whole; the separator leads the next
                            tag, so a wrapped line never ends on a dangling dot (W-06). */}
                        <ul className="h-meta h-cap-meta">
                          {c.meta.map((t) => (
                            <li key={t}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Capabilities;
