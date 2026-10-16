import type { CSSProperties, ReactNode } from 'react';
import { PrimaryButton } from '../home/Buttons';
import Lines, { type LineSpec } from './Lines';

export type PageHeroProps = {
  /** H1 segments (see LineSpec). Each line is unbreakable (D-023); check the longest fits at 320px. */
  lines: LineSpec[];
  lede: ReactNode;
  /** Primary CTA (magnetic on desktop). */
  cta?: { label: string; href: string; ariaLabel?: string };
  /** Meta row under the rule (h-label, muted). Ignored when `slot` is set. */
  meta?: ReactNode[];
  /** Replaces the meta row under the rule (filter bar, case index...). */
  slot?: ReactNode;
  /** Extra content under the lede, above the CTA. */
  aside?: ReactNode;
  /** `xl` = h-d-xl (144/~54), `l` = h-d-l (96/44, /contact-us). */
  size?: 'xl' | 'l';
  /**
   * Phones (< 1024): the H1 size as a share of the headline's width, in cqi.
   * Default 14.6cqi (xl) / 13.1cqi (l) under-fills most headlines, so every page
   * should pass its own value, putting the longest line at 94–98% of the width:
   *   fit = 14.6 × (0.96 × containerWidth) / longestLineWidthAtDefault   (cqi)
   * (measure the longest line at the default at 375; e.g. /services "THAT SCALE"
   * 252px of 335px → 18.6cqi). Capped at 104px (xl) / 44px (l).
   */
  fit?: string;
  id?: string;
  className?: string;
};

/**
 * Typographic inner-page hero (never `.h-hero`, which is home's full-height
 * shader stage). The H1 and lede animate with CSS keyframes only, so the LCP
 * never waits on JS; under reduced motion nothing animates.
 */
const PageHero = ({ lines, lede, cta, meta, slot, aside, size = 'xl', fit, id = 'pg-hero-title', className }: PageHeroProps) => (
  <section
    className={`pg-hero${size === 'l' ? ' pg-hero--l' : ''}${className ? ` ${className}` : ''}`}
    aria-labelledby={id}
    style={fit ? ({ '--pg-fit': fit } as CSSProperties) : undefined}
  >
    <div className="h-container">
      <div className="h-grid pg-hero-main">
        <h1 id={id} className={`${size === 'l' ? 'h-d-l' : 'h-d-xl'} pg-hero-h1 pg-nowrap`}>
          <Lines lines={lines} />
        </h1>
        <div className="pg-hero-aside">
          <div className="pg-hero-copy">
            <p className="h-lead pg-hero-lede pg-a-lede">{lede}</p>
            {aside && <div className="pg-hero-extra pg-a-meta">{aside}</div>}
          </div>
          {cta && (
            <div className="pg-hero-cta pg-a-cta">
              <PrimaryButton href={cta.href} magnetic aria-label={cta.ariaLabel}>
                {cta.label}
              </PrimaryButton>
            </div>
          )}
        </div>
      </div>
      <div className="pg-hero-bar">
        <span className="h-hero-rule pg-a-rule" aria-hidden="true" />
        {slot ? (
          <div className="pg-hero-slot">{slot}</div>
        ) : meta?.length ? (
          <ul className="h-label pg-hero-meta pg-a-meta">
            {meta.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  </section>
);

export default PageHero;
