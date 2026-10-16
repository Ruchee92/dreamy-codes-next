"use client";
import { useSyncExternalStore } from 'react';
import { MessageSquare, ShieldCheck, Zap, type LucideIcon } from 'lucide-react';
import SectionHead from '../../site/SectionHead';
import Lines from '../../site/Lines';
import { ABOUT_VALUES } from './data';

// D-046: the original site's value icons, keyed by name (as on home's Founder).
const ICONS: Record<string, LucideIcon> = { Evolve: Zap, Communicate: MessageSquare, Ownership: ShieldCheck };

const SLIDER = '(max-width: 767px)';
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(SLIDER);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

/**
 * "How we operate" (design spec §6.4, AD A4/A5): the homepage's three values
 * with their longer /about bodies, set large (names at display size, bodies at
 * lead size) under drawn ink rules. No boxes. Phones (< 768, D-047): a native
 * snap slider, one value in view and the next peeking; it is a tab stop only
 * while it scrolls (the server HTML keeps it, so no-JS phones can scroll it by
 * keyboard). Nothing here is interactive, so nothing hovers.
 */
const Values = () => {
  const isSlider = useSyncExternalStore(subscribe, () => window.matchMedia(SLIDER).matches, () => true);
  return (
    <section className="ab-values" aria-labelledby="ab-values-title">
      <div className="h-container">
        <SectionHead id="ab-values-title" title={['How we', 'operate']} size="l" />
        <ul className="ab-values-list" tabIndex={isSlider ? 0 : undefined} aria-label="How we operate">
          {ABOUT_VALUES.map((v, i) => {
            const Icon = ICONS[v.name];
            return (
              <li key={v.name} className="ab-value">
                <span className="ab-value-rule" data-draw data-delay={(i * 0.1).toFixed(1)} aria-hidden="true" />
                <p className="h-label ab-value-idx">
                  {Icon && (
                    <span className="ab-value-icon" aria-hidden="true">
                      <Icon size={20} strokeWidth={1.5} />
                    </span>
                  )}
                  {v.index}
                </p>
                <h3 className="h-d-m ab-value-name" data-rise data-delay={(i * 0.1).toFixed(1)}>
                  <Lines lines={[v.name]} />
                </h3>
                <p className="h-lead ab-value-body" data-fade data-delay={(i * 0.1).toFixed(1)}>
                  {v.body}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Values;
