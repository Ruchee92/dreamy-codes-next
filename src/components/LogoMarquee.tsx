import React from 'react';
import Image from 'next/image';

const LogoMarquee = ({ className = "" }) => {
  const logos = [
    "https://wp.dreamycodes.com/wp-content/uploads/2026/03/1.png",
    "https://wp.dreamycodes.com/wp-content/uploads/2026/03/2.png",
    "https://wp.dreamycodes.com/wp-content/uploads/2026/03/3.png",
    "https://wp.dreamycodes.com/wp-content/uploads/2026/03/4.png",
    "https://wp.dreamycodes.com/wp-content/uploads/2026/03/5.png",
    "https://wp.dreamycodes.com/wp-content/uploads/2026/03/6.png",
    "https://wp.dreamycodes.com/wp-content/uploads/2026/03/7.png",
    "https://wp.dreamycodes.com/wp-content/uploads/2026/03/8.png",
    "https://wp.dreamycodes.com/wp-content/uploads/2026/03/9.png"
  ];

  return (
    <div className={`relative z-20 overflow-hidden ${className}`}>
      <div
        className="marquee-bg bg-black pt-20 pb-6 md:pt-28 md:pb-10 relative"
        style={{
          backgroundImage: 'radial-gradient(circle at 70% 30%, #222 0%, #000 100%)',
        }}
      >
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 relative">
          <div className="flex flex-col items-start md:ml-[8%] text-white mb-6 md:mb-8">
            <div className="mt-0 flex flex-col items-start gap-1">
              <Image 
                src="https://wp.dreamycodes.com/wp-content/uploads/2026/03/kindpng_1738320.png" 
                alt="Shopify Experts"
                width={200}
                height={44}
                className="h-8 md:h-11 w-auto object-contain" 
              />
              <p className="text-[14px] md:text-[18px] font-display font-black text-white uppercase opacity-90" style={{ letterSpacing: '3px' }}>
                Trusted by 300+ Brands
              </p>
            </div>
          </div>

          <div className="flex whitespace-nowrap animate-marquee">
            {[...Array(2)].map((_, i) => (
              // Each copy is one exact repeating period: the logo gaps plus a
              // trailing gap of the same size. Symmetric side padding would
              // halve the spacing at the seam between the two copies, making
              // the rhythm visibly hitch every time the -50% loop point passed.
              //
              // The second copy exists only to hide that seam, so it is hidden
              // from assistive tech to avoid announcing every logo twice.
              <div
                key={i}
                aria-hidden={i === 1 ? 'true' : undefined}
                className="flex items-center gap-12 md:gap-24 pr-12 md:pr-24 flex-shrink-0"
              >
                {logos.map((logo, j) => (
                  <Image
                    key={j}
                    src={logo}
                    // Placeholder until the real brand names are supplied —
                    // swap each one for its actual client name, which reads
                    // better to both people and crawlers than a generic label.
                    alt="Client brand logo"
                    width={150}
                    height={64}
                    loading="lazy"
                    className="h-10 md:h-16 w-auto max-w-none object-contain opacity-100 flex-shrink-0"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoMarquee;
