import type { ReactNode } from 'react';
import Lines, { type LineSpec } from './Lines';

const norm = (l: LineSpec) => (typeof l === 'string' ? l : l.text);

/**
 * Section heading on the 12-col grid: H2 cols 1–7 (rises in), optional lede
 * cols 9–12 on the H2's last line (fades in). No eyebrow, never centred.
 * `size` defaults to `l` (h-d-l, 96) when every line is <= 14 characters,
 * else `m` (h-d-m, 56). Inside a `.pg-dark` band the lede turns muted-dark.
 */
const SectionHead = ({
  id,
  title,
  size,
  lede,
  as: Tag = 'h2',
  className,
}: {
  id: string;
  title: LineSpec[];
  size?: 'l' | 'm';
  lede?: ReactNode;
  as?: 'h2' | 'h3';
  className?: string;
}) => {
  const s = size ?? (title.every((l) => norm(l).length <= 14) ? 'l' : 'm');
  return (
    <div className={`h-grid pg-head${className ? ` ${className}` : ''}`}>
      <Tag id={id} className={`${s === 'l' ? 'h-d-l' : 'h-d-m'} pg-head-title`} data-rise>
        <Lines lines={title} />
      </Tag>
      {lede && (
        <p className="h-lead pg-head-lede" data-fade>
          {lede}
        </p>
      )}
    </div>
  );
};

export default SectionHead;
