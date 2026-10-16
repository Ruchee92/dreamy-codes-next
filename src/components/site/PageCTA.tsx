import type { ReactNode } from 'react';
import { PrimaryButton } from '../home/Buttons';
import Lines, { type LineSpec } from './Lines';
import PageNext, { type PageNextProps } from './PageNext';

/** The closing-band lead (copy sweep D-059; the homepage FinalCTA keeps its own line). */
export const PAGE_CTA_LEAD =
  'Send us your store and what isn’t working. We’ll audit it before we talk.';

/**
 * Closing band of an inner page (replaces the boxed FinalCTA): H2 cols 1–8,
 * lead + magnetic primary button cols 9–12, then the PageNext row, which runs
 * into the footer (no bottom padding). The H2 lines never wrap: on phones the
 * size follows the band width (`fit`, default 13.1cqi, capped at 44px).
 */
const PageCTA = ({
  title,
  lead = PAGE_CTA_LEAD,
  cta = { label: 'Book a free strategy call', href: '/contact-us' },
  next,
  id = 'pg-cta-title',
}: {
  title: LineSpec[];
  lead?: ReactNode;
  cta?: { label: string; href: string };
  next?: PageNextProps;
  id?: string;
}) => (
  <section className="pg-cta" aria-labelledby={id}>
    <div className="h-container">
      <div className="h-grid pg-cta-grid">
        <h2 id={id} className="h-d-l pg-cta-title pg-nowrap" data-rise>
          <Lines lines={title} />
        </h2>
        <div className="pg-cta-side" data-fade>
          <p className="h-lead pg-cta-lead">{lead}</p>
          <div className="pg-cta-btn">
            <PrimaryButton href={cta.href} magnetic>
              {cta.label}
            </PrimaryButton>
          </div>
        </div>
      </div>
      {next && <PageNext {...next} />}
    </div>
  </section>
);

export default PageCTA;
