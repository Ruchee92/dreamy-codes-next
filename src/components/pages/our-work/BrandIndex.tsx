import type { CSSProperties } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import SectionHead from '../../site/SectionHead';
import { BRANDS } from './data';

/**
 * "More brands we've built for": a quiet 7x2 index of logo tiles (2 columns on
 * phones), each linking to the live store. Only the heading rises; the tiles
 * are static on purpose. Names are plain text (not headings).
 */
const BrandIndex = () => (
  <section className="ow-brands" aria-labelledby="ow-brands-title">
    <div className="h-container">
      <SectionHead
        id="ow-brands-title"
        size="m"
        title={['More brands', "we've built for"]}
        lede={<span className="h-label ow-brands-count">{BRANDS.length} brands</span>}
        className="ow-brands-head"
      />
      <ul className="ow-brand-grid">
        {BRANDS.map((b) => (
          <li key={b.name}>
            <a
              className="ow-brand"
              href={b.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${b.name} (opens the live store in a new tab)`}
            >
              <span className="ow-brand-logo" style={b.scale ? ({ '--s': b.scale } as CSSProperties) : undefined}>
                <Image src={b.logo} alt="" fill sizes="(min-width: 1024px) 140px, 34vw" className="ow-brand-img" />
              </span>
              <span className="h-meta ow-brand-name">{b.name}</span>
              <ArrowUpRight className="ow-brand-arrow" size={12} strokeWidth={1.75} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default BrandIndex;
