"use client";
import { useRef } from 'react';
import Image from 'next/image';
import { gsap, SplitText, triggerOnce, useHomeMotion } from '../../home/motion';
import { ArrowLink } from '../../home/Buttons';
import ReviewAvatar from '../../home/ReviewAvatar';
import SectionHead from '../../site/SectionHead';
import { PRICE_LINE, PULL_QUOTE, TEAM } from './data';

const [founder, ...crew] = TEAM;

/**
 * The four people (design spec §6.3): 4:5 portraits that wipe in, names that
 * ride them. No hover: the portraits are not links. Then one pull quote (Mike,
 * repeat client) whose lines rise in their masks along the real wrap.
 */
const Team = () => {
  const ref = useRef<HTMLElement>(null);

  // Only the quote is scripted here; the wipes, the head and the attribution
  // are the shared verbs (PageMotion).
  useHomeMotion(ref, (_mode, root) => {
    const quote = root.querySelector<HTMLElement>('.ab-quote-text');
    const mark = root.querySelector<HTMLElement>('.ab-quote-mark');
    const fig = root.querySelector<HTMLElement>('.ab-quote');
    if (!quote || !mark || !fig) return;
    let revealed = false;
    const split = SplitText.create(quote, {
      type: 'lines',
      mask: 'lines',
      maskClass: 'h-smask',
      aria: 'none',
      autoSplit: true,
      onSplit: (self) => {
        if (!revealed) gsap.set(self.lines, { yPercent: 105 });
        quote.classList.add('is-split');
      },
    });
    triggerOnce({ trigger: quote, start: 'top 82%' }, () => {
      revealed = true;
      // y: 0 explicitly, or GSAP folds the mark's CSS pre-hide translate into `y` and keeps it.
      gsap.fromTo([mark, ...split.lines], { yPercent: 105, y: 0 }, {
        yPercent: 0, y: 0, duration: 0.9, ease: 'dc',
        // The mark and line 1 move together; the other lines follow at the usual stagger.
        stagger: (i) => Math.max(0, i - 1) * 0.08,
        onComplete: () => {
          quote.classList.add('is-in');
          fig.classList.add('is-in');
        },
      });
    });
    return () => {
      split.revert();
      gsap.set(mark, { clearProps: 'transform' });
    };
  }, { defer: true });

  return (
    <section ref={ref} className="ab-team" aria-labelledby="ab-team-title">
      <div className="h-container">
        <SectionHead
          id="ab-team-title"
          title={['Our team']}
          size="l"
        />
        {/* Founder + crew (push-9.5 §4): Ruchi large, the three as a smaller row whose
            portraits end on Ruchi's (a subgrid shares the portrait / caption rows ≥ 1024). */}
        <div className="h-grid ab-team-grid">
          <div className="ab-founder">
            <div className="ab-portrait ab-portrait--founder" data-wipe data-parallax="0.5">
              <Image
                src={founder.image}
                alt={`${founder.name}, ${founder.role} at Dreamy Codes`}
                fill
                // 546px frame × 1.12 parallax overscale; the 640px original caps it.
                sizes="(min-width: 1024px) 612px, 100vw"
                className="ab-portrait-img"
              />
            </div>
            <div className="ab-founder-cap">
              <h3 className="h-d-m ab-founder-name">{founder.name}</h3>
              {/* "You’ll talk to Ruchi" leads the hero facts and the CTA below (D-059: said once per section). */}
              <p className="h-meta ab-member-role ab-founder-role">
                {founder.role}
              </p>
            </div>
          </div>
          <ul className="ab-crew">
            {crew.map((m, i) => (
              <li key={m.name} className="ab-member">
                <div className="ab-portrait" data-wipe data-delay={(0.12 + i * 0.08).toFixed(2)}>
                  <Image
                    src={m.image}
                    alt={`${m.name}, ${m.role} at Dreamy Codes`}
                    fill
                    sizes="(min-width: 1536px) 236px, (min-width: 1024px) 204px, 30vw"
                    className="ab-portrait-img"
                  />
                </div>
                <div className="ab-member-cap">
                  <h3 className="ab-member-name">{m.name}</h3>
                  <p className="h-meta ab-member-role">{m.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <figure className="h-grid ab-quote">
          <blockquote className="ab-quote-body">
            {/* The opening mark hangs outside the column in its own mask and rises with line 1
                (kept out of the split text: SplitText breaks a negative-margin inline onto its own line). */}
            <span className="h-statement ab-quote-mark-mask" aria-hidden="true">
              <span className="ab-quote-mark">“</span>
            </span>
            <p className="h-statement ab-quote-text" data-split>
              {PULL_QUOTE.text}”
            </p>
          </blockquote>
          <figcaption className="ab-quote-by" data-fade>
            <ReviewAvatar r={PULL_QUOTE} className="ab-quote-avatar" />
            <span>
              <span className="h-label ab-quote-name">{PULL_QUOTE.name}</span>
              <span className="h-meta ab-quote-role">{PULL_QUOTE.role}</span>
            </span>
          </figcaption>
          <div className="ab-quote-cta" data-fade>
            <ArrowLink href="/contact-us">Talk to Ruchi’s team</ArrowLink>
            <p className="h-meta ab-quote-price">{PRICE_LINE}</p>
          </div>
        </figure>
      </div>
    </section>
  );
};

export default Team;
