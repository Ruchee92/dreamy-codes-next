"use client";
import { useRef } from 'react';
import Num from './Num';
import { PROOF_STATS } from './data';
import { initReveals, observeCounts, useHomeMotion } from './motion';

/**
 * D-060: the four numbers, moved out of the black proof band into their own
 * light pause between the work reel and the case studies (Ruchi: logos and
 * numbers together "felt too much"). No heading: the figures are the content.
 * Each stat sits under its own drawn hairline (not one full-width rule, which
 * would double the reel's progress line just above). The count-up is the
 * original one (D-038): final values in the server HTML; counted once, on
 * screen; reduced motion and no-JS show the finals.
 */
const Numbers = () => {
  const ref = useRef<HTMLElement>(null);

  useHomeMotion(
    ref,
    (_mode, root) => {
      initReveals(root);
      const offCounts = observeCounts(root);
      return () => offCounts();
    },
    { defer: true },
  );

  return (
    <section ref={ref} className="h-numbers" aria-label="Results in numbers">
      <div className="h-container">
        <ul className="h-stats h-num-stats">
          {PROOF_STATS.map((stat, i) => (
            <li key={stat.label} className="h-num-stat">
              <span className="h-num-rule" data-draw data-delay={String(i * 0.08)} aria-hidden="true" />
              <Num final={stat.final} mode="count" className="h-d-l h-num-value" />
              <p className="h-label h-muted h-num-label">{stat.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Numbers;
