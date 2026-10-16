import Image from 'next/image';
import styles from './NavLogo.module.css';

const LOGO_SRC =
  'https://wp.dreamycodes.com/wp-content/uploads/2026/03/DREAMY-CODES-min-2.png';

// Same width/height as the base so next/image builds the same srcset and the
// browser serves every layer from the one download. 246x48 is the PNG's own
// ratio (1926x374), so a blocked or failed image reserves the logo's real box.
const LAYERS = [
  `${styles.dot} ${styles.dotTop}`,
  `${styles.dot} ${styles.dotBottom}`,
  `${styles.dot} ${styles.dotMiddle}`,
  `${styles.chevron} ${styles.chevronBlue}`,
  `${styles.chevron} ${styles.chevronBlack}`,
  styles.word,
];

/**
 * The nav logo. At rest (and whenever the intro cannot run) this is only the
 * original image; the clipped copies exist for the one-time intro driven by
 * html[data-logo-intro] (see logoIntro.ts / NavLogo.module.css).
 */
const NavLogo = () => (
  <span className="relative flex transition-transform group-hover:scale-105">
    <Image
      data-logo-base=""
      fetchPriority="high"
      src={LOGO_SRC}
      alt="Dreamy Codes"
      width={246}
      height={48}
      className={`${styles.base} h-10 md:h-12 w-auto object-contain`}
    />
    <span className={styles.layers} aria-hidden="true">
      {LAYERS.map((className) => (
        <Image
          key={className}
          data-logo-layer=""
          src={LOGO_SRC}
          alt=""
          width={246}
          height={48}
          loading="eager"
          className={`${styles.layer} ${className}`}
        />
      ))}
    </span>
  </span>
);

export default NavLogo;
