import type { CSSProperties } from 'react';
import Image from 'next/image';
import { ArrowLink } from '../home/Buttons';
import { WORK_WINDOW, type WorkItem } from '../home/data';

/**
 * A project for a WorkCard: either the v4 three-layer mockup (`base` / `screen`
 * / `phone`, D-043/D-045) or, for projects without one, a `legacy` 4:5 image
 * (rendered in the same frame, no auto-scroll, so a grid stays uniform).
 */
export type WorkCardItem = Pick<WorkItem, 'title' | 'category' | 'link'> &
  (
    | Pick<WorkItem, 'base' | 'screen' | 'phone' | 'screenW' | 'screenH'>
    | { legacy: string; base?: undefined }
  );

const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * The work card (frame, index, hover category, title), shared by the homepage
 * reel and the inner pages. With only `item` + `index` it renders exactly the
 * homepage reel's markup; every other prop is opt-in.
 *
 * - `domain`: an h-meta line under the title (inner pages).
 * - `caseHref`: a "Case study" link under the title/domain; `caseLabel` replaces its text
 *   (e.g. "175% sales growth · Case study"; also used in its aria-label).
 * - `delay`: data-delay for the desktop wipe (PageMotion reads it).
 * - `className` / `data`: extra class and data-* attributes on the <li> (e.g. filters).
 *
 * Motion hooks it carries: `data-wipe-d` (li, desktop), `data-wipe-m` (media,
 * phones), `data-screen` (D-045 auto-scroll, toggled live by `data-live`).
 */
const WorkCard = ({
  item,
  index,
  domain,
  caseHref,
  caseLabel,
  delay,
  className,
  data,
  sizes = '(min-width: 1024px) 30vw, 78vw',
  screenSizes = '(min-width: 1024px) 26vw, 67vw',
  eager = index < 2,
}: {
  item: WorkCardItem;
  index: number;
  domain?: string;
  caseHref?: string;
  caseLabel?: string;
  delay?: number;
  className?: string;
  data?: Record<string, string>;
  sizes?: string;
  screenSizes?: string;
  eager?: boolean;
}) => {
  const loading = eager ? 'eager' : 'lazy';
  const layered = item.base !== undefined;
  const dataAttrs = data ? Object.fromEntries(Object.entries(data).map(([k, v]) => [`data-${k}`, v])) : {};

  return (
    <li
      className={className ? `h-card ${className}` : 'h-card'}
      data-wipe-d
      {...(layered ? { 'data-screen': true } : {})}
      style={{ '--i': index } as CSSProperties}
      {...(delay !== undefined ? { 'data-delay': String(delay) } : {})}
      {...dataAttrs}
    >
      <a
        className="h-card-frame"
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${item.title} (opens the live site in a new tab)`}
      >
        <span className="h-card-media" data-wipe-m>
          {item.base !== undefined ? (
            <span className="h-card-stack">
              <Image
                src={item.base}
                alt={item.title}
                width={800}
                height={983}
                sizes={sizes}
                loading={loading}
                className="h-card-layer"
              />
              <span
                className="h-card-screen"
                style={{
                  left: `${WORK_WINDOW.left}%`,
                  top: `${WORK_WINDOW.top}%`,
                  width: `${WORK_WINDOW.width}%`,
                  height: `${WORK_WINDOW.height}%`,
                  // Share of the screenshot that scrolls out of the window.
                  '--travel': (1 - (WORK_WINDOW.ratio * item.screenW) / item.screenH).toFixed(4),
                } as CSSProperties}
              >
                <Image
                  src={item.screen}
                  alt=""
                  width={item.screenW}
                  height={item.screenH}
                  sizes={screenSizes}
                  loading={loading}
                  className="h-card-screen-img"
                />
              </span>
              <Image
                src={item.phone}
                alt=""
                width={800}
                height={983}
                sizes={sizes}
                loading={loading}
                className="h-card-layer"
              />
            </span>
          ) : (
            <span className="h-card-stack">
              <Image
                src={item.legacy}
                alt={item.title}
                width={800}
                height={1000}
                sizes={sizes}
                loading={loading}
                className="h-card-layer pg-card-legacy"
              />
            </span>
          )}
        </span>
        {/* D-028: index sits on the image; the category only shows on hover/focus. */}
        <span className="h-card-idx" aria-hidden="true">{pad2(index + 1)}</span>
        <span className="h-label h-card-cat" aria-hidden="true">{item.category}</span>
      </a>
      <div className="h-card-meta">
        <h3 className="h-card-title">{item.title}</h3>
        {domain && <p className="h-meta pg-card-domain">{domain}</p>}
        {caseHref && (
          <ArrowLink href={caseHref} className="pg-card-case" aria-label={`${caseLabel ?? 'Case study'}: ${item.title}`}>
            {caseLabel ?? 'Case study'}
          </ArrowLink>
        )}
      </div>
    </li>
  );
};

export default WorkCard;
