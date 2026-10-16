import Image from 'next/image';
import type { Review } from './data';

/**
 * The avatar beside every review, on every page (D-055). A photo when the
 * reviewer has one; otherwise a monogram in the same box: the caller's avatar
 * class supplies the 40px circle, `.h-mono` the paper-2 fill and the indigo
 * Space Grotesk initial. Decorative either way (the name is printed beside it).
 */
const ReviewAvatar = ({ r, className }: { r: Pick<Review, 'name' | 'image' | 'monogram'>; className: string }) =>
  r.image ? (
    <Image src={r.image} alt="" width={40} height={40} className={className} />
  ) : (
    <span className={`${className} h-mono`} aria-hidden="true">
      {r.monogram ?? r.name.charAt(0)}
    </span>
  );

export default ReviewAvatar;
