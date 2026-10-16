"use client";
import { useEffect, useRef, useState } from 'react';
import Image, { type ImageProps } from 'next/image';

/**
 * D-073 (LCP): an image that is only requested once it comes within `margin` of
 * the viewport. Chrome's own lazy-load distance is large on slow connections, so
 * far-below-the-fold images (the homepage case studies) were fetched before first
 * paint and competed with it. The box around it must be sized by CSS (no CLS).
 * No JS: the <noscript> copy renders the image as before.
 */
const NearImage = ({ margin = '800px', alt, ...props }: ImageProps & { margin?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setNear(true);
      },
      { rootMargin: `${margin} 0px` },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  if (near) return <Image alt={alt} {...props} />;
  return (
    <>
      <span ref={ref} aria-hidden="true" style={{ position: 'absolute', inset: 0 }} />
      <noscript>
        <Image alt={alt} {...props} />
      </noscript>
    </>
  );
};

export default NearImage;
