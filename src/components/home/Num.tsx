/**
 * A display number. The final string is what the server renders and what
 * screen readers get, as one piece of text.
 * - `roll` (default): the visible copy is split into glyphs that roll up into
 *   place once (playRoll in motion.ts) when the number first comes on screen.
 * - `count` (D-038, the original design's count-up): the visible copy counts
 *   up to the final value once it is on screen (observeCounts in motion.ts).
 * Without motion either one simply shows the final value.
 */
const Num = ({
  final,
  className = '',
  as: Tag = 'p',
  mode = 'roll',
}: {
  final: string;
  className?: string;
  as?: 'p' | 'span';
  mode?: 'roll' | 'count';
}) =>
  mode === 'count' ? (
    <Tag className={`h-numwrap ${className}`} data-countup={final}>
      <span className="sr-only">{final}</span>
      <span className="h-count" aria-hidden="true">{final}</span>
    </Tag>
  ) : (
    <Tag className={`h-numwrap ${className}`} data-roll>
      <span className="sr-only" data-count>{final}</span>
      <span className="h-roll" aria-hidden="true">
        {Array.from(final).map((ch, i) => (
          <span key={i} className="h-glyph">{ch}</span>
        ))}
      </span>
    </Tag>
  );

export default Num;
