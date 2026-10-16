"use client";
import { Fragment, useLayoutEffect, useRef, type CSSProperties } from 'react';
import Image, { getImageProps } from 'next/image';
import { gsap, ScrollTrigger, MQ_DESKTOP } from '../../home/motion';
import Lines from '../../site/Lines';
import { SERVICES, type Service } from './data';
import AlsoLine from './AlsoLine';

/** Ribs in the glass: 28 on the staged desktop, 16 elsewhere (CSS hides 17–28 via --n). */
const RIBS = 28;
const RIBS_STACKED = 16;
/** Fake refraction: each rib's slice is shifted a little (precomputed, so no layout reads). */
const OFFSETS = Array.from({ length: RIBS }, (_, i) => Math.round(4 * Math.sin(i * 1.3) * 100) / 100);

/** Staged desktop: fine pointer, wide, tall enough, motion on. Must match services.css. */
const MQ_STAGE = `${MQ_DESKTOP} and (min-height: 720px)`;
const MQ_STACK =
  '(prefers-reduced-motion: no-preference) and (max-width: 1023px), ' +
  '(prefers-reduced-motion: no-preference) and (not (pointer: fine)), ' +
  '(prefers-reduced-motion: no-preference) and (max-height: 719px)';

const SIZES = '(min-width: 1024px) 768px, 100vw';

/**
 * The sharp image and its glass ribs share one srcSet + sizes, so the browser
 * picks the same file for both (one request, one decode).
 */
const imageProps = (s: Service, eager: boolean) =>
  getImageProps({ src: s.image.src, alt: '', width: s.image.w, height: s.image.h, sizes: SIZES, loading: eager ? 'eager' : 'lazy' }).props;

/** `eager`: service 01's image sits at the fold at common desktop sizes (the LCP candidate). */
const Frame = ({ s, eager }: { s: Service; eager: boolean }) => {
  const props = imageProps(s, eager);
  const pos = s.image.position ? { objectPosition: s.image.position } : undefined;
  return (
    <figure className="sv2-frame">
      <div className="sv2-window">
        {/* eslint-disable-next-line @next/next/no-img-element -- getImageProps output (shared with the ribs) */}
        <img {...props} alt={s.image.alt} className="sv2-sharp" style={pos} />
        <div className="sv2-glass" aria-hidden="true">
          {OFFSETS.map((o, i) => (
            <span key={i} className="sv2-rib" style={{ '--i': i, '--o': `${o}px` } as CSSProperties}>
              {/* eslint-disable-next-line @next/next/no-img-element -- same optimized source as the sharp image */}
              <img {...props} alt="" className="sv2-rib-img" style={pos} />
            </span>
          ))}
          {/* Frosted wash over the whole glass; fades out with the last ribs. */}
          <span className="sv2-wash" />
        </div>
      </div>
      {s.image.caption && <figcaption className="h-meta sv2-cap">{s.image.caption}</figcaption>}
      {s.proof && (
        // D-072 proof: a hard-edged dashboard card over the image's bottom-left corner
        // (staged desktop); under the image, full width, everywhere else.
        <figure className="sv2-dash">
          <Image src={s.proof.src} alt={s.proof.alt} width={s.proof.w} height={s.proof.h} sizes="(min-width: 1024px) 480px, 100vw" className="sv2-dash-img" />
          <figcaption className="h-meta sv2-dash-cap">{s.proof.caption}</figcaption>
        </figure>
      )}
    </figure>
  );
};

/**
 * /services signature, "Into focus" (D-065). Each service's store is seen through
 * fluted glass that clears rib by rib as you read it: DOM strips, each a softly
 * blurred, stretched slice (the blur is static, rastered once); only opacity and
 * transform animate.
 *
 * - Staged (desktop, fine pointer, >= 720px tall, motion on): the stage holds
 *   (CSS sticky, laid out under [data-motion] from first paint) while one scrub
 *   runs three segments: glass clears (0–0.45; the first service 0.08–0.53),
 *   hold, then a sequenced hand-off (outgoing text 0.80–0.88, incoming text
 *   0.90–1.00, both images sharing one wipe edge 0.80–0.94), so two services' text are
 *   never on screen together. All three stay in the DOM and the accessibility
 *   tree; off-stage ones are at opacity 0 with no pointer events.
 * - Stacked (phones, touch, short screens, motion on): each service is a block
 *   and its glass clears with its own scroll.
 * - Reduced motion / no JS: no glass, every service visible (static layout).
 */
const ServicesStage = () => {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const stage = ref.current;
    if (!stage) return;
    const items = Array.from(stage.querySelectorAll<HTMLElement>('.sv2-svc'));
    const parts = items.map((li) => ({
      li,
      text: li.querySelector<HTMLElement>('.sv2-text')!,
      giant: li.querySelector<HTMLElement>('.sv2-giant')!,
      wash: li.querySelector<HTMLElement>('.sv2-wash')!,
      lines: li.querySelectorAll<HTMLElement>('.sv2-title .h-line-in, .sv2-count-in'),
      // The dashboard card (service 02) rides with the text, so it is never on screen with 01/03.
      body: li.querySelectorAll<HTMLElement>('.sv2-tools, .sv2-row, .sv2-cap, .sv2-dash'),
      // The wipe clips the image window, not the figure (the caption hangs outside it).
      frame: li.querySelector<HTMLElement>('.sv2-window')!,
      ribs: li.querySelectorAll<HTMLElement>('.sv2-rib'),
      ribImgs: Array.from(li.querySelectorAll<HTMLElement>('.sv2-rib-img')),
    }));
    const mm = gsap.matchMedia(stage);

    mm.add({ stage: MQ_STAGE, stack: MQ_STACK }, (ctx) => {
      const c = ctx.conditions as { stage?: boolean; stack?: boolean };
      // Clears one service's glass from the centre out (opacity + the refraction shift).
      const clear = (tl: gsap.core.Timeline, k: number, at: number, len: number, ribCount: number) => {
        const ribs = Array.from(parts[k].ribs).slice(0, ribCount);
        const imgs = parts[k].ribImgs.slice(0, ribCount);
        const each = len * 0.3;
        const stagger = { amount: len - each, from: 'center' as const };
        tl.fromTo(ribs, { opacity: 1 }, { opacity: 0, ease: 'none', duration: each, stagger }, at);
        tl.fromTo(
          imgs,
          { x: (i: number) => OFFSETS[i] },
          { x: 0, ease: 'none', duration: each, stagger },
          at,
        );
        tl.fromTo(parts[k].wash, { opacity: 1 }, { opacity: 0, ease: 'none', duration: each }, at + len - each);
      };

      if (c.stage) {
        stage.setAttribute('data-staged', '');
        // Services 02/03 wait off stage at opacity 0 (CSS pre-state). M4: they stay in
        // the accessibility tree (no aria-hidden / visibility); the stage has no
        // focusable elements, so nothing hidden can take focus.
        const tl = gsap.timeline({ defaults: { ease: 'none' } });
        parts.forEach((p, k) => {
          // V4 / K3: the first service arrives under glass (the first full black screen shows
          // it frosted) and clears on the reader's own scroll.
          if (k === 0) clear(tl, 0, 0.08, 0.45, RIBS);
          else clear(tl, k, k, 0.45, RIBS);
          if (k === parts.length - 1) return;
          const n = parts[k + 1];
          const at = k + 0.8;
          // Outgoing text 0.80–0.88, then hidden (immediateRender off: these only apply
          // once the hand-off starts). Its frame wipes up 0.80–0.92.
          tl.fromTo(p.lines, { yPercent: 0, y: 0 }, { yPercent: -105, y: 0, duration: 0.07, stagger: 0.005, immediateRender: false }, at);
          tl.fromTo(p.body, { opacity: 1, y: 0 }, { opacity: 0, y: -12, duration: 0.08, immediateRender: false }, at);
          tl.set(p.text, { opacity: 0 }, k + 0.88);
          // D-070: the giant outline counter changes in the same windows as the text.
          tl.fromTo(p.giant, { yPercent: 0, y: 0, opacity: 1 }, { yPercent: -30, y: 0, opacity: 0, duration: 0.08, immediateRender: false }, at);
          // W1: one wipe. Both windows share 0.80–0.94 with the same linear value p:
          // outgoing inset(0 0 p 0), incoming inset(100%-p 0 0 0), so a single sharp
          // edge sweeps up and the new store arrives under its glass. Its text waits
          // until 0.90. Start states = the CSS pre-states, so first paint matches.
          tl.set(n.li, { opacity: 1, pointerEvents: 'auto' }, at);
          tl.fromTo(p.frame, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.14, immediateRender: false }, at);
          tl.fromTo(n.frame, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.14 }, at);
          tl.set(n.text, { opacity: 1 }, k + 0.9);
          // y: 0 explicitly: GSAP otherwise reads the CSS pre-state translate into `y` and keeps it.
          tl.fromTo(n.lines, { yPercent: 105, y: 0 }, { yPercent: 0, y: 0, duration: 0.07, stagger: 0.01 }, k + 0.9);
          tl.fromTo(n.body, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.06, stagger: 0.008 }, k + 0.91);
          tl.fromTo(n.giant, { yPercent: 30, y: 0, opacity: 0 }, { yPercent: 0, y: 0, opacity: 1, duration: 0.1 }, k + 0.9);
          tl.set(p.li, { opacity: 0, pointerEvents: 'none' }, k + 1);
        });
        tl.set({}, {}, parts.length); // the last service holds crisp to the end
        // The track (not the whole plate, which also holds the "Also" line) carries the hold.
        const track = stage.querySelector<HTMLElement>('.sv2-track')!;
        ScrollTrigger.create({ trigger: track, start: 'top top', end: 'bottom bottom', scrub: 0.6, animation: tl, invalidateOnRefresh: true });
        return () => {
          stage.removeAttribute('data-staged');
          parts.forEach((p) => {
            p.li.style.removeProperty('opacity');
            p.li.style.removeProperty('pointer-events');
            p.text.style.removeProperty('opacity');
          });
        };
      }

      if (c.stack) {
        parts.forEach((p, k) => {
          const tl = gsap.timeline();
          clear(tl, k, 0, 1, RIBS_STACKED);
          ScrollTrigger.create({ trigger: p.frame, start: 'top 85%', end: 'top 35%', scrub: 0.5, animation: tl });
        });
      }
    });
    return () => mm.revert();
  }, []);

  return (
    // D-070: the stage sits on a black plate (pg-dark: the nav and BackToTop flip over it).
    <section ref={ref} className="sv2-stage pg-dark" aria-label="Services">
      <div className="sv2-track">
      <div className="sv2-pin">
        <ol className="h-container sv2-list">
          {SERVICES.map((s, i) => (
            <li key={s.id} id={s.id} className="sv2-svc">
              {i > 0 && <span className="sv2-sep" data-draw aria-hidden="true" />}
              {/* Display moment: a giant outlined counter behind the text (decorative). */}
              <span className="sv2-giant" aria-hidden="true">{`0${i + 1}`}</span>
              <div className="h-grid sv2-grid">
                <div className="sv2-text">
                  <p className="h-label h-muted sv2-count">
                    <span className="h-line"><span className="h-line-in sv2-count-in">{`0${i + 1} / 0${SERVICES.length}`}</span></span>
                  </p>
                  <h2 className="h-d-m sv2-title">
                    <Lines lines={s.title} />
                  </h2>
                  {/* Each tag stays whole; the dot trails it, so a wrapped line never starts with one. */}
                  <p className="h-meta sv2-tools">
                    {s.tools.map((t, j) => (
                      <Fragment key={t}>
                        <span className="sv2-tool">
                          {t}
                          {j < s.tools.length - 1 ? ' ·' : ''}
                        </span>{' '}
                      </Fragment>
                    ))}
                  </p>
                  <ul className="sv2-rows">
                    {s.rows.map((r) => (
                      <li key={r.title} className="sv2-row">
                        <h3 className="h-title sv2-row-title">{r.title}</h3>
                        <p className="h-body h-muted sv2-row-body">{r.body}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <Frame s={s} eager={i === 0} />
              </div>
            </li>
          ))}
        </ol>
      </div>
      </div>
      <AlsoLine />
    </section>
  );
};

export default ServicesStage;
