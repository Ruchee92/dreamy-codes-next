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
          clipPath: 'polygon(0 42%, 14% 18%, 100% 48%, 100% 100%, 0 100%)',
          backgroundImage: 'radial-gradient(circle at 70% 30%, #222 0%, #000 100%)',
        }}
      >
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 relative">
          <div className="flex flex-col items-start md:ml-[8%] text-white mb-6 md:mb-8">
            <div className="mt-0 flex flex-col items-start gap-1">
              <Image 
                src="https://wp.dreamycodes.com/wp-content/uploads/2026/03/kindpng_1738320.png" 
                alt="Shopify Experts logo" 
                width={200}
                height={44}
                className="h-8 md:h-11 w-auto object-contain" 
              />
              <p className="text-[14px] md:text-[18px] font-display font-black text-white uppercase opacity-90" style={{ letterSpacing: '3px' }}>
                Trusted by 200+ Brands
              </p>
            </div>
          </div>

          <div className="flex whitespace-nowrap animate-marquee">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-12 md:gap-24 px-6 md:px-12 flex-shrink-0">
                {logos.map((logo, j) => (
                  <Image 
                    key={j} 
                    src={logo} 
                    alt={`Trusted Shopify Client Brand Logo ${j + 1} - Scaling with Dreamy Codes`} 
                    width={150}
                    height={64}
                    className="h-10 md:h-16 w-auto max-w-none object-contain opacity-100 flex-shrink-0"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .marquee-bg {
            clip-path: polygon(0 0, 100% 25%, 100% 100%, 0 100%) !important;
          }
        }
      `}} />
    </div>
  );
};

export default LogoMarquee;
