import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export type PageNextProps = {
  /** Destination name, shown at h-d-m ("Case studies"). */
  label: string;
  href: string;
  /** Appended to the aria-label (copy.md's secondary-link text, e.g. "See the numbers"). */
  hint?: string;
};

/**
 * The next-page row: last element before the footer. An ink layer wipes up on
 * hover (fine pointer) or press (touch) and meets the black footer; the arrow
 * runs the button conveyor. The top hairline draws in (`data-draw`).
 */
const PageNext = ({ label, href, hint }: PageNextProps) => (
  <Link href={href} className="pg-next" aria-label={`Next page: ${label}${hint ? `. ${hint}` : ''}`}>
    <span className="pg-next-rule" data-draw aria-hidden="true" />
    <span className="h-grid pg-next-in">
      <span className="h-label pg-next-k">Next</span>
      <span className="h-d-m pg-next-t">{label}</span>
      <span className="pg-next-arrow" aria-hidden="true">
        <ArrowRight strokeWidth={1.5} />
        <ArrowRight strokeWidth={1.5} />
      </span>
    </span>
  </Link>
);

export default PageNext;
