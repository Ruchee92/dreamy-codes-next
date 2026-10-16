// D-041: every published review is 5 stars.

/**
 * The review rating (homepage review cards and hero, /case-studies chapter
 * quotes). Static, no JS. D-073: one masked element (five 14px stars, 3px apart,
 * drawn in currentColor by .h-stars-art in home.css) instead of five inline SVGs
 * per card, which kept ~50 KB of repeated paths out of the homepage HTML.
 */
const Stars = ({ className = 'h-review-stars' }: { className?: string }) => (
  <p className={className}>
    <span className="sr-only">Rated 5 out of 5</span>
    <span className="h-stars-art" aria-hidden="true" />
  </p>
);

export default Stars;
