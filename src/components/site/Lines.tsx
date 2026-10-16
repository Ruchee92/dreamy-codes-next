import { Fragment, type CSSProperties } from 'react';

/**
 * One segment of a display heading. A plain string is a segment that ends in a
 * line break at every width. `br` says where the break after it happens:
 * - `both` (default): always a new line after this segment
 * - `desktop`: new line only at >= 1024px (joined on phones)
 * - `mobile`: new line only below 1024px (joined on desktop)
 * - `none`: never (the next segment follows on the same line)
 * Example, "Ready to write your success story?" as 2 desktop / 3 phone lines:
 *   ['Ready to' (br 'mobile'), 'write' (br 'desktop'), 'your' (br 'mobile'), 'success story?']
 */
export type LineSpec = string | { text: string; outline?: boolean; br?: 'both' | 'desktop' | 'mobile' | 'none' };

const norm = (l: LineSpec) => (typeof l === 'string' ? { text: l, outline: false, br: 'both' as const } : { outline: false, br: 'both' as const, ...l });

/** Plain text of a heading (for aria-labels, length checks). */
export const linesText = (lines: LineSpec[]) => lines.map((l) => norm(l).text).join(' ');

/**
 * Renders heading segments as home's line masks (`.h-line > .h-line-in`), so
 * `data-rise` on the heading and the hero's CSS rise both work. Each segment
 * carries `--i` (its index) for staggered CSS delays. Breaks are explicit
 * elements, so the accessible text stays one sentence with normal spaces.
 */
const Lines = ({ lines }: { lines: LineSpec[] }) => {
  const segs = lines.map(norm);
  return (
    <>
      {segs.map((s, i) => (
        <Fragment key={i}>
          <span className="h-line pg-line" style={{ '--i': i } as CSSProperties}>
            <span className={s.outline ? 'h-line-in h-outline' : 'h-line-in'}>{s.text}</span>
          </span>
          {i < segs.length - 1 && (
            <>
              {' '}
              {s.br !== 'none' && <span className={`pg-br pg-br--${s.br}`} aria-hidden="true" />}
            </>
          )}
        </Fragment>
      ))}
    </>
  );
};

export default Lines;
