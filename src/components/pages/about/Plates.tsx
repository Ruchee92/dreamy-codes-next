import Image from 'next/image';
import { PLATES } from './data';

const PLATE_LIST = [
  { ...PLATES.portrait, cls: 'ab-plate--portrait', parallax: '0.5', sizes: '(min-width: 1024px) 318px, 48vw' },
  { ...PLATES.sites, cls: 'ab-plate--sites', parallax: '1', sizes: '(min-width: 1024px) 546px, 100vw' },
  { ...PLATES.serum, cls: 'ab-plate--serum', parallax: '0.7', sizes: '(min-width: 1024px) 318px, 48vw' },
];

/**
 * "The work" plates between the mission and the team (D-051, AD R1): the
 * earlier /about imagery as single editorial plates on the grid, one stepped
 * row on desktop. No heading: it is the visual answer to "what's in our DNA".
 * Each plate wipes in; on desktop the image drifts against its frame
 * (`data-parallax`, PageMotion) at a different rate, so the row shears slightly.
 * Sources are 600px wide, so no plate is drawn wider than 546 CSS px.
 */
const Plates = () => (
  <section className="ab-plates" aria-label="Recent work">
    <div className="h-container h-grid ab-plates-grid">
      {PLATE_LIST.map((p, i) => (
        <figure
          key={p.src}
          className={`ab-plate ${p.cls}`}
          data-wipe
          data-delay={(i * 0.08).toFixed(2)}
          data-parallax={p.parallax}
        >
          <Image src={p.src} alt={p.alt} fill sizes={p.sizes} className="ab-plate-img" />
        </figure>
      ))}
    </div>
  </section>
);

export default Plates;
