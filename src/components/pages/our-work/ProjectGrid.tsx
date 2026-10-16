import { Fragment } from 'react';
import Image from 'next/image';
import WorkCard from '../../site/WorkCard';
import { PrimaryButton } from '../../home/Buttons';
import { reviewBy } from '../../home/data';
import { PROJECTS } from './data';
import { endSpan } from './endSpan';
import { GRID_ID } from './WorkFilter';

/** Cards that can sit in the first screen at load (the first row at >= 1280). */
const FIRST_ROW = 3;

/** CRO 4 (fix pass 4): the page's client voice is a client on this page (All Star Terminals, card 04). */
const ABDUL = reviewBy('Abdul');

/** Abdul's published excerpt, verbatim, with his photo: in the card-06 row and the end cell. */
const ClientQuote = () => (
  <figure className="ow-quote">
    <blockquote className="h-body ow-quote-text">
      <p>“{ABDUL.excerpt}”</p>
    </blockquote>
    <figcaption className="ow-quote-by">
      {ABDUL.image && <Image src={ABDUL.image} alt="" width={40} height={40} sizes="40px" className="ow-avatar" />}
      <span>
        <span className="h-label ow-quote-name">{ABDUL.name}</span>
        <span className="h-meta ow-quote-role">{ABDUL.role}</span>
      </span>
    </figcaption>
  </figure>
);

/** The mid-grid ask follows this many cards (CRO fix pass 1). */
const ASK_AFTER = 6;

/**
 * All twelve projects as equal WorkCards (D-012), each tagged with its service
 * type for the filter, plus two call-to-action cells that re-flow with them:
 * - `.ow-ask`: a hairline row after card 06 (< 1280, "All" only)
 * - `.ow-end`: fills the last row's empty columns at >= 1280 (`data-span`,
 *   kept in step with the visible count by WorkFilter); a full last row
 *   (span 0) gets it as its own full-width row
 * Static markup: the filter only toggles display and re-flows (WorkFilter).
 * Wipes, D-045 auto-scroll and hover come from the shared card + PageMotion.
 */
/**
 * D-028 keeps the category tag hover-only on the image. Touch has no hover, so
 * there it is appended to the meta line (our-work.css, `hover: none`) from a
 * per-card custom property. Static CSS: works without JS.
 */
const CATEGORY_CSS = PROJECTS.map((p, i) => `.ow-card[data-n="${i}"]{--cat:${JSON.stringify(` · ${p.item.category}`)}}`).join('');

const ProjectGrid = () => (
  <section className="ow-work" aria-labelledby="ow-work-title">
    {/* Static string built from our own data (no user input); innerHTML so quotes and & stay CSS. */}
    <style dangerouslySetInnerHTML={{ __html: CATEGORY_CSS }} />
    <div className="h-container">
      <h2 id="ow-work-title" className="sr-only">Projects</h2>
      <ul id={GRID_ID} className="ow-grid">
        {PROJECTS.map((p, i) => (
          <Fragment key={p.item.link}>
            <WorkCard
              item={p.item}
              index={i}
              domain={p.domain}
              caseHref={p.caseSlug ? `/case-studies#${p.caseSlug}` : undefined}
              // CRO fix pass 5: the result and the case link are one link ("175% sales growth · Case study").
              caseLabel={p.result ? `${p.result} · Case study` : undefined}
              delay={(i % 3) * 0.08}
              // First row: revealed by a CSS wipe from first paint (our-work.css), not the JS one,
              // so it never waits on hydration. `is-in` in the server HTML makes PageMotion skip it.
              className={i < FIRST_ROW ? 'ow-card ow-first is-in' : 'ow-card'}
              // col: >= 1280 the middle column (1) steps down; WorkFilter keeps it in step after filtering.
              data={{ type: p.type, n: String(i), col: String(i % 3) }}
              sizes="(min-width: 1280px) 30vw, (min-width: 768px) 46vw, 92vw"
              screenSizes="(min-width: 1280px) 26vw, (min-width: 768px) 40vw, 80vw"
              eager={i < 3}
            />
            {i === ASK_AFTER - 1 && (
              <li className="ow-ask">
                <div className="ow-ask-copy">
                  <p className="h-title ow-ask-text">Have a store like these?</p>
                  <ClientQuote />
                </div>
                <div className="ow-ask-btn">
                  <PrimaryButton href="/contact-us">Book a free strategy call</PrimaryButton>
                  <p className="h-meta ow-price">Projects start at $990 and most builds take 2–4 weeks. You&apos;ll talk to Ruchi.</p>
                </div>
              </li>
            )}
          </Fragment>
        ))}
        <li className="ow-end" data-span={endSpan(PROJECTS.length)} data-col={String(PROJECTS.length % 3)}>
          <ClientQuote />
          <p className="h-d-m ow-end-title">300+ projects completed.</p>
          <div className="ow-end-btn">
            <PrimaryButton href="/contact-us">Book a free strategy call</PrimaryButton>
            <p className="h-meta ow-price">Projects start at $990 and most builds take 2–4 weeks. You&apos;ll talk to Ruchi.</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
);

export default ProjectGrid;
