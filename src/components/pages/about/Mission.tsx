"use client";
import { useRef } from 'react';
import Image from 'next/image';
import { gsap, SplitText, useHomeMotion } from '../../home/motion';
import Lines from '../../site/Lines';
import { MISSION, PLATES } from './data';

/**
 * /about signature, "the mission inks in" (design spec §6.2). The statement is
 * set twice in one grid cell: a faint base (aria-hidden) and the full-contrast
 * text on top. With motion, the top layer is split into its real lines and each
 * line is uncovered left to right (clip-path) as the block scrolls up, one after
 * the other, so the text reads as being written. Scrubbed, no pin, the same on
 * phones (native scroll). Reduced motion / no JS: the top layer is simply whole.
 */
const Mission = () => {
  const ref = useRef<HTMLElement>(null);

  useHomeMotion(ref, (_mode, root) => {
    const ink = root.querySelector<HTMLElement>('.ab-ink');
    if (!ink) return;
    const split = SplitText.create(ink, {
      type: 'lines',
      linesClass: 'ab-ink-line',
      // The lines carry the text for screen readers (a <p> can't take aria-label).
      aria: 'none',
      autoSplit: true,
      // Returned animation: SplitText kills it on a re-split (resize, fonts) and
      // carries its progress over to the new one.
      onSplit: (self) => {
        // Each line carries its own faint copy (behind) and the ink copy (on top,
        // clipped), so the two can never break differently: a separate base
        // paragraph drifted from the split lines after a re-wrap (D-059 copy).
        const inks = self.lines.map((line) => {
          const bg = document.createElement('span');
          bg.className = 'ab-ink-bg';
          bg.setAttribute('aria-hidden', 'true');
          bg.textContent = line.textContent;
          const fg = document.createElement('span');
          fg.className = 'ab-ink-fg';
          while (line.firstChild) fg.appendChild(line.firstChild);
          line.append(bg, fg);
          return fg;
        });
        // Every line starts covered (set, not a fromTo: staggered lines that a
        // scrubbed timeline hasn't reached yet would otherwise paint uncovered).
        gsap.set(inks, { clipPath: 'inset(0 100% 0 0)' });
        ink.classList.add('is-split');
        return gsap
          .timeline({
            scrollTrigger: { trigger: ink, start: 'top 78%', end: 'bottom 52%', scrub: 0.6 },
          })
          .to(inks, { clipPath: 'inset(0 0% 0 0)', ease: 'none', duration: 1, stagger: 0.55 });
      },
    });
    return () => {
      split.revert();
      ink.classList.remove('is-split');
    };
  });

  return (
    <section ref={ref} className="ab-mission pg-dark" aria-labelledby="ab-mission-title">
      <div className="h-container h-grid ab-mission-grid">
        {/* Desktop: the heading and the fluted-glass plate hold together while the statement inks in. */}
        <div className="ab-mission-side">
          <h2 id="ab-mission-title" className="h-d-m ab-mission-title" data-rise>
            <Lines lines={['Performance', 'over pretty.']} />
          </h2>
          <figure className="ab-mission-plate" data-wipe>
            <Image
              src={PLATES.glass.src}
              alt={PLATES.glass.alt}
              fill
             
              sizes="(min-width: 1536px) 432px, 30vw"
              className="ab-plate-img"
            />
          </figure>
        </div>
        <div className="ab-statement">
          <p className="h-statement ab-ink-base" aria-hidden="true">
            {MISSION}
          </p>
          <p className="h-statement ab-ink" data-split>
            {MISSION}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Mission;
