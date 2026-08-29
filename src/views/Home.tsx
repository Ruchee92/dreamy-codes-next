"use client";
import React, { useState, useEffect, useLayoutEffect, useRef, useId, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Plus,
  Zap,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  X,
  CheckCircle2,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import dynamic from 'next/dynamic';
import LogoMarquee from '../components/LogoMarquee';
import ContactSection from '../components/ContactSection';
import { scrollIntoViewRespectingMotionPreference, prefersReducedMotion } from '../utils/motion';

// WebGPU canvas — client-only, so nothing shader-related runs during SSR.
const GlassHeroBackground = dynamic(() => import('../components/GlassHeroBackground'), { ssr: false });

// Releases the hero copy once the shader backdrop has painted — and, failing
// that, on a short timer. It runs while the HTML is still parsing rather than
// at hydration, so the headline (the LCP element) is never waiting on the
// JavaScript bundle. `hero-backdrop-ready` comes from GlassHeroBackground.
const HERO_STAGE_BOOT = `(function(){
  var stage = document.currentScript && document.currentScript.parentElement;
  if (!stage) return;
  var done = false, timer;
  function reveal() {
    if (done) return;
    done = true;
    clearTimeout(timer);
    document.removeEventListener('hero-backdrop-ready', reveal);
    stage.classList.add('is-ready');
    window.__heroStageReady = true;
    document.dispatchEvent(new Event('hero-stage-ready'));
  }
  document.addEventListener('hero-backdrop-ready', reveal);
  timer = setTimeout(reveal, 700);
})();`;

// React-side mirror of the same signal, for the parts of the hero that animate
// in JavaScript rather than CSS. The stage flag is set outside React by the
// script above, so it is read as an external store: the server always renders
// the un-revealed state, and the client picks up whatever has happened by the
// time it hydrates.
const subscribeToHeroStage = (onChange: () => void) => {
  document.addEventListener('hero-stage-ready', onChange, { once: true });
  return () => document.removeEventListener('hero-stage-ready', onChange);
};

const useHeroStageReady = () =>
  useSyncExternalStore(
    subscribeToHeroStage,
    () => !!(window as unknown as { __heroStageReady?: boolean }).__heroStageReady,
    () => false
  );

const DrawInWord = ({ text, delay = 0.1, duration = 0.6, start = true }: { text: string; delay?: number; duration?: number; start?: boolean }) => {
  const textRef = useRef<SVGTextElement>(null);
  const revealedRef = useRef(false);
  const [box, setBox] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      if (!textRef.current) return;
      const bbox = textRef.current.getBBox();
      const length = textRef.current.getComputedTextLength();
      setBox({ x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height });
      if (revealedRef.current) {
        // Already fully drawn (e.g. this is a resize): go straight to the
        // clean undashed outline rather than re-deriving a dash pattern.
        textRef.current.style.transition = 'none';
        textRef.current.style.strokeDasharray = 'none';
        textRef.current.style.strokeDashoffset = '0';
        return;
      }
      textRef.current.style.transition = 'none';
      textRef.current.style.strokeDasharray = `${length}`;
      textRef.current.style.strokeDashoffset = `${length}`;
    };

    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready?.then(measure);

    // Hold the undrawn outline until the shader backdrop is up. The effect
    // re-runs when `start` flips, and the timers below schedule from there.
    if (!start) {
      return () => {
        window.removeEventListener('resize', measure);
      };
    }

    const timer = setTimeout(() => {
      if (!textRef.current) return;
      textRef.current.style.transition = `stroke-dashoffset ${duration}s cubic-bezier(0.22, 1, 0.36, 1)`;
      textRef.current.style.strokeDashoffset = '0';
      revealedRef.current = true;
    }, delay * 1000);

    // Once the draw-in has finished, drop the dash pattern altogether. The
    // dash length is the word's advance width, which is shorter than the true
    // glyph-outline perimeter, so the leftover segment (the closing baseline
    // stroke on both M's) would otherwise stay invisible even at dashoffset 0.
    // Clearing strokeDasharray guarantees the resting state is one continuous,
    // unbroken outline — without altering how the trace itself animates.
    const settle = setTimeout(() => {
      if (!textRef.current) return;
      textRef.current.style.transition = 'none';
      textRef.current.style.strokeDasharray = 'none';
      textRef.current.style.strokeDashoffset = '0';
    }, (delay + duration) * 1000 + 50);

    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(timer);
      clearTimeout(settle);
    };
  }, [text, delay, duration, start]);

  return (
    <svg
      viewBox={`${box.x} ${box.y} ${box.width} ${box.height}`}
      width={box.width || undefined}
      height={box.height || undefined}
      style={{ overflow: 'visible', display: 'block' }}
      // role + aria-label make this the accessible name for the word, so the
      // heading needs no second, visually hidden copy of it. This SVG is the
      // single source of the word in the DOM.
      role="img"
      aria-label={text}
    >
      <text
        ref={textRef}
        x="0"
        y="0"
        className="font-display text-[13vw] sm:text-[10vw] md:text-8xl lg:text-[7rem] font-bold tracking-tighter"
        fill="none"
        stroke="#111"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {text.toUpperCase()}
      </text>
    </svg>
  );
};

// Calendar quarters: Jan-Mar is Q1 through Oct-Dec is Q4. Computed at render,
// so the statically generated page picks up the change on its next
// revalidation rather than needing a deploy.
const currentQuarter = () => `Q${Math.floor(new Date().getMonth() / 3) + 1}`;

const Hero = () => {
  const ready = useHeroStageReady();

  return (
    <section className="relative pt-28 pb-16 md:pt-40 md:pb-32 min-h-[8vh] flex flex-col justify-center">
      {/* Without JS the stage never gets marked ready, so let the entrance
          animations run on their own rather than leaving the copy hidden. */}
      <noscript>
        <style>{`.hero-stage .animate-hero-fade-up { animation-play-state: running !important; }`}</style>
      </noscript>

      <div className="hero-stage px-6 lg:px-12 max-w-screen-2xl mx-auto w-full pb-5 relative z-10">
        <script dangerouslySetInnerHTML={{ __html: HERO_STAGE_BOOT }} />
        <div className="animate-hero-fade-up flex items-center gap-3 mt-4 md:mt-0 mb-5 md:mb-8 relative z-10">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-blink"></div>
          <p className="font-display font-bold text-brand-900/60 uppercase text-[10px] md:text-sm" style={{ letterSpacing: '0.2rem' }}>ACCEPTING PARTNERS FOR {currentQuarter()}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 items-start relative z-10">
          <div className="lg:col-span-9">
            <h1 className="font-display text-[13vw] sm:text-[10vw] md:text-8xl lg:text-[7rem] font-bold leading-[1.02] md:leading-[0.92] tracking-tighter uppercase whitespace-nowrap">
              <div className="animate-hero-fade-up" style={{ animationDelay: '0.05s' }}>
                We engineer
              </div>
              {/* The drawn outline is the only copy of this word in the DOM.
                  It used to sit alongside an invisible sizing copy and a screen
                  reader copy, so the heading reached crawlers as
                  "We engineere-commerceE-COMMERCEe-commercefor scale."
                  The empty div only reserves the line box: the SVG is
                  absolutely positioned and has no measured size until the font
                  has loaded. */}
              <div className="relative">
                <div className="h-[1.02em] md:h-[0.92em]" aria-hidden="true"></div>
                <div className="absolute inset-0 flex items-center">
                  <DrawInWord text="e-commerce" delay={0.1} duration={0.6} start={ready} />
                </div>
              </div>
              <div className="animate-hero-fade-up" style={{ animationDelay: '0.35s' }}>
                for scale.
              </div>
            </h1>
          </div>
          <div className="lg:col-span-3 pb-4">
            <p className="animate-hero-fade-up text-lg md:text-xl text-gray-600 font-light leading-relaxed mb-6 md:mb-8" style={{ animationDelay: '0.45s' }}>
              Scaling is tough. <br />
              Let our <span className="font-bold">Shopify experts</span> engineer your <span className="text-[#3432c7]">high-converting storefront</span> so you can focus on D2C growth.
            </p>
            <div className="flex flex-col gap-6 md:gap-8">
              {/* One row from the smallest screens up, stacking only at lg
                  where the column is too narrow to hold both. */}
              <div className="flex flex-row items-center gap-3 md:gap-8 lg:flex-col lg:items-start">
                <Link
                  href="#contact"
                  // flex-1 on small screens so the primary action takes all the
                  // room left beside the secondary link. From md up it holds
                  // the 307px it measured when the label read "Book Strategy
                  // Call", so shortening the text did not shrink the button.
                  className="animate-hero-fade-up inline-flex flex-1 min-w-0 items-center justify-between px-4 sm:px-8 py-4 md:flex-none md:w-auto md:min-w-[307px] md:gap-4 bg-[#3432c7] text-white hover:bg-white hover:text-[#3432c7] border border-[#3432c7] font-display font-bold text-lg uppercase tracking-wider group transition-all duration-300 cursor-pointer whitespace-nowrap"
                  style={{ animationDelay: '0.55s' }}
                  // The footer carries a "Contact Us" link to /contact-us. This
                  // one jumps to the form further down this page, so it needs a
                  // distinct accessible name — identical text pointing at two
                  // destinations is what Lighthouse flags.
                  aria-label="Contact us — go to the enquiry form on this page"
                >
                  <span>Contact Us</span>
                  <ArrowRight className="transform group-hover:translate-x-2 transition-transform" />
                </Link>

                <Link
                  href="#portfolio"
                  // Kept as small as it can be on phones: with both items on
                  // one line and neither able to wrap, every pixel saved here
                  // is a pixel the primary CTA gains.
                  className="animate-hero-fade-up inline-flex flex-shrink-0 items-center gap-1.5 sm:gap-2 font-display font-bold text-[11px] sm:text-sm uppercase tracking-[0.08em] sm:tracking-[0.2em] text-brand-900/60 hover:text-brand-900 transition-colors cursor-pointer group whitespace-nowrap"
                  style={{ animationDelay: '0.60s' }}
                >
                  <span>View Our Work</span>
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="animate-hero-fade-up flex items-center gap-3" style={{ animationDelay: '0.65s' }}>
                <div className="flex -space-x-3 flex-shrink-0">
                  {[
                    "https://wp.dreamycodes.com/wp-content/uploads/2026/03/B9031D87-783F-403F-8E3D-CFFD27DFF404.jpeg",
                    "https://wp.dreamycodes.com/wp-content/uploads/2026/03/dfb535ea-8ab9-4efa-bcf0-978cb6e3a5c1.jpeg",
                    "https://wp.dreamycodes.com/wp-content/uploads/2026/03/07d658f9-c512-4850-9154-0f21cf891518.jpg",
                    "https://wp.dreamycodes.com/wp-content/uploads/2026/03/74b95bf9-4801-4714-bb25-4fe2ce9248da.jpeg"
                  ].map((src, i) => (
                    <Image
                      key={i}
                      src={src}
                      // Decorative: the adjacent text already states what this
                      // row of faces means.
                      alt=""
                      width={48}
                      height={48}
                      priority={true}
                      sizes="48px"
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white object-cover shadow-sm"
                    />
                  ))}
                </div>
                <p className="text-xs md:text-sm font-display font-light uppercase tracking-widest text-brand-900/70 leading-tight md:whitespace-nowrap">
                  Trusted by 300+ <br /> Shopify merchants
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// `category` is part of the case study data and arrives via the spread, but is
// not rendered by this card, so it is intentionally not destructured here.
const CaseStudy = ({ number, title, description, stats, table, link, imageSrc }: { number: string, title: string, description: string, stats: { value: string, label: string }[], category: string, table?: { data: { challenge: string, result: string }[] }, link: string, imageSrc: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-brand-900 group h-full bg-white overflow-hidden">
      <a href={link} aria-label={`View the ${title} Case Study`} target="_blank" rel="noopener noreferrer" draggable={false} className="bg-brand-50 relative min-h-[300px] md:min-h-[400px] flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-brand-900 block">
        <div className={`absolute inset-0 overflow-hidden ${isLoaded ? 'bg-transparent' : 'bg-gray-200 animate-pulse'}`}>
          <Image
            src={imageSrc}
            alt={`${title} — case study`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            onLoad={() => setIsLoaded(true)}
            draggable={false}
            className={`object-cover transform group-hover:scale-105 transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
          />
        </div>
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10 flex justify-between items-start w-[calc(100%-2rem)] md:w-[calc(100%-4rem)]">
          <div className="font-display text-3xl md:text-5xl font-bold text-white" aria-hidden="true">{number}</div>
          <div className="text-white hover:scale-110 transition-transform">
            <ArrowUpRight className="w-8 h-8 md:w-12 md:h-12" strokeWidth={1} aria-hidden="true" />
          </div>
        </div>
      </a>

      <div className="p-6 md:p-16 flex flex-col md:justify-center flex-grow">
        <h3 className="font-display text-2xl md:text-4xl font-bold mb-4 md:mb-6 leading-tight">{title}</h3>
        <p className="text-gray-600 mb-6 md:mb-10 text-base md:text-lg leading-relaxed font-light">{description}</p>

        {table && (
          <div className="mb-8 md:mb-10">
            <div className="grid grid-cols-2 font-display uppercase tracking-widest text-xs font-bold border-b border-brand-900/10">
              <div className="p-3">Challenges</div>
              <div className="p-3">Results</div>
            </div>
            <div className="space-y-0">
              {table.data.map((row, i) => (
                <div key={i} className="grid grid-cols-2 text-sm border-b border-brand-900/10 last:border-b-0">
                  <div className="p-3 text-gray-700 flex items-start gap-2">
                    <X size={16} strokeWidth={2.5} className="text-brand-900 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{row.challenge}</span>
                  </div>
                  <div className="p-3 text-gray-700 flex items-start gap-2">
                    <CheckCircle2 size={16} strokeWidth={2.5} className="text-[#3432c7] flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{row.result}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 md:gap-8">
          {stats.map((stat, i) => (
            <div key={i}>
              <p className="font-display text-3xl md:text-4xl font-bold mb-1">{stat.value}</p>
              <p className="text-[10px] md:text-xs uppercase tracking-widest text-gray-500 font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CaseStudiesSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const caseStudies = [
    {
      number: "01",
      title: "CRO-Optimized Shopify store for The Flake Homestead",
      description: "A growing homestead lifestyle brand needed an e-commerce store that clearly presents its from-scratch cookbooks and natural living products while turning a large social media audience into loyal customers.",
      category: "Handcrafted Goods",
      stats: [
        { value: "175%", label: "Sales Growth" },
        { value: "6%+", label: "Conversion Rate" }
      ],
      table: {
        data: [
          { challenge: "Social traffic not converting", result: "Optimized product purchase flow" },
          { challenge: "Unclear product organization", result: "Structured collections and bundles" },
          { challenge: "Limited trust signals", result: "Added reviews and credibility" }
        ]
      },
      link: "https://theflakehomestead.com/",
      imageSrc: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/PR1-1.jpg"
    },
    {
      number: "02",
      title: "Conversion-Focused Website for Mother of Macros Café",
      description: "A popular healthy meal prep company needed a website that clearly showcases its macro-balanced meals, simplifies online ordering, and helps busy customers choose nutritious meals quickly.",
      category: "Meal Prep",
      stats: [
        { value: "190%", label: "Increase in Orders" },
        { value: "5.6%", label: "Conversion Rate" }
      ],
      table: {
        data: [
          { challenge: "Confusing meal plan choices", result: "Clear meal comparison layout" },
          { challenge: "Customers unclear about meals", result: "Visual meal pack presentation" },
          { challenge: "Friction during ordering", result: "Simplified ordering navigation" }
        ]
      },
      link: "https://motherofmacroscafe.com/",
      imageSrc: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/PR2.jpg"
    },
    {
      number: "03",
      title: "High-Performing Subscription Store for Succly",
      description: "A subscription-based plant brand needed a storefront that clearly explains its monthly succulent boxes while encouraging customers to start or manage their plant subscription easily.",
      category: "Subscription Wellness",
      stats: [
        { value: "3.2×", label: "Subscription Growth" },
        { value: "4%", label: "Conversion Rate" }
      ],
      table: {
        data: [
          { challenge: "Subscription value unclear", result: "Clear subscription value messaging" },
          { challenge: "Complicated subscription selection", result: "Streamlined subscription purchase flow" },
          { challenge: "Weak plan differentiation", result: "Structured subscription plan layout" }
        ]
      },
      link: "https://succly.com/",
      imageSrc: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/PR3.jpg"
    },
    {
      number: "04",
      title: "Premium Shopify Store for For The Love of Golf",
      description: "A specialty golf retailer needed a modern online store that showcases its curated selection of stylish women’s golf apparel and accessories while improving product discovery and shopping experience.",
      category: "Golf Lifestyle",
      stats: [
        { value: "250%", label: "Revenue Growth" },
        { value: "4.9%", label: "Conversion Rate" }
      ],
      table: {
        data: [
          { challenge: "Outdated website design", result: "Modern premium Shopify layout" },
          { challenge: "Difficult product discovery", result: "Organized collections and filters" },
          { challenge: "Weak brand storytelling", result: "Lifestyle driven brand sections" }
        ]
      },
      link: "https://www.fortheloveofgolfnaples.com/",
      imageSrc: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/PR4.jpg"
    }
  ];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + caseStudies.length) % caseStudies.length);
  };

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <h2 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter flex-grow w-full md:w-auto">CASE STUDIES</h2>
        <div className="hidden md:flex gap-4 self-end md:self-center">
          <button
            onClick={() => paginate(-1)}
            aria-label="Previous Case Study"
            className="w-12 h-12 border border-brand-900 flex items-center justify-center hover:bg-brand-900 hover:text-white transition-colors group cursor-pointer"
          >
            <ChevronLeft size={20} className="group-hover:scale-110 transition-transform" aria-hidden="true" />
          </button>
          <button
            onClick={() => paginate(1)}
            aria-label="Next Case Study"
            className="w-12 h-12 border border-brand-900 flex items-center justify-center hover:bg-brand-900 hover:text-white transition-colors group cursor-pointer"
          >
            <ChevronRight size={20} className="group-hover:scale-110 transition-transform" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="relative min-h-[1100px] lg:min-h-[650px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 200, damping: 25 },
              opacity: { duration: 0.3 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -10000 || offset.x < -75) {
                paginate(1);
              } else if (swipe > 10000 || offset.x > 75) {
                paginate(-1);
              }
            }}
            className="w-full absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <CaseStudy {...caseStudies[currentIndex]} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-3 mt-6">
        {caseStudies.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => {
              setDirection(i > currentIndex ? 1 : -1);
              setCurrentIndex(i);
            }}
            className={`h-1.5 transition-all duration-500 rounded-full cursor-pointer ${i === currentIndex ? 'bg-brand-900 w-12' : 'bg-brand-900/20 w-4'}`}
          />
        ))}
      </div>
      <div className="text-center mt-4 lg:hidden">
        <p className="text-xs font-display uppercase tracking-widest text-gray-500">Swipe to view more</p>
      </div>
    </div>
  );
};

// ADDED TYPES HERE
const TestimonialCard = ({ name, role, quote, rating, image }: { name: string, role: string, quote: string, rating: number, image?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const initials = name.split(' ').map(n => n[0]).join('');
  return (
    // No pointer cursor: the card is not a link and clicking it does nothing.
    // The colour change on hover stays as decoration.
    <div className="bg-white p-8 border border-gray-200 flex flex-col h-full relative hover:bg-[#3432c7] hover:border-[#3432c7] transition-colors duration-500 group/card">
      <div className="flex items-center gap-4 mb-6">
        {image ? (
          <div className={`w-12 h-12 rounded-full overflow-hidden ${isLoaded ? 'bg-transparent' : 'bg-gray-200 animate-pulse'}`}>
            <Image
              src={image}
              alt={name}
              width={48}
              height={48}
              onLoad={() => setIsLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-display font-bold text-gray-500 text-lg group-hover/card:bg-white group-hover/card:text-[#3432c7] transition-colors duration-500">
            {initials}
          </div>
        )}
        <div>
          <p className="font-display font-bold text-base uppercase tracking-tight group-hover/card:text-white transition-colors duration-500">{name}</p>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest group-hover/card:text-white/80 transition-colors duration-500">{role}</p>
        </div>
      </div>
      <div className="flex gap-1 mb-6">
        {[...Array(rating)].map((_, i) => (
          <svg key={i} className="w-5 h-5 fill-yellow-400 group-hover/card:fill-yellow-400 transition-colors duration-500" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-gray-600 text-base md:text-lg leading-relaxed font-light italic flex-grow group-hover/card:text-white transition-colors duration-500">
        "{quote}"
      </p>
    </div>
  );
};

const Testimonials = () => {
  const [showAll, setShowAll] = useState(false);

  // The collapsed grid has to clear a whole number of rows, and the column
  // count changes at each breakpoint, so the height is resolved here rather
  // than with a stylesheet override. Previously the mobile value was forced
  // with !important, which also blocked the expand animation on mobile and
  // left the two-column tablet range clipping a row in half.
  const [collapsedHeight, setCollapsedHeight] = useState('580px');

  useEffect(() => {
    const oneColumn = window.matchMedia('(max-width: 767px)');
    const twoColumn = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');

    const apply = () => {
      if (oneColumn.matches) setCollapsedHeight('960px');
      else if (twoColumn.matches) setCollapsedHeight('780px');
      else setCollapsedHeight('580px');
    };

    apply();
    oneColumn.addEventListener('change', apply);
    twoColumn.addEventListener('change', apply);
    return () => {
      oneColumn.removeEventListener('change', apply);
      twoColumn.removeEventListener('change', apply);
    };
  }, []);

  const testimonials = [
    { name: "Kelly", role: "FOUNDER, CHICKITTY & SHAGGYCHIC", quote: "Ruchi is a superstar. He exemplifies professionalism, knowledge, and a work ethic that we can always count on to assist with any of our Shopify needs. He is always highly responsive to our needs and remains one of the top partners that we have worked with.", rating: 5, image: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/Kelly.jpeg" },
    { name: "Mike", role: "FOUNDER, FOR THE LOVE OF GOLF NP", quote: "Another Job Well Done!!! That guy never misses!! This is my 4th or 5th time working with Ruchi on a project and I must say I wont even look anywhere else. Again, Thank you for believing in our business and putting in the heart and time to make sure that our site is top of the line.", rating: 5, image: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/Mike.jpeg" },
    { name: "Emily", role: "FOUNDER, SUCCLY", quote: "Ruchi is truly the best at what he does! He created an exceptional website for me, and when I needed a blog that had different categories, I knew he could deliver and of course, he did. The blog turned out beautifully, with perfectly sized photos (something we couldn’t get right before), clean drop down menus, and a professional, polished look. Ruchi is reliable, talented, and simply the best!!", rating: 5, image: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/Emily.jpg" },
    { name: "Tatiana", role: "FOUNDER, ALEJANDRA'S PANADERIA", quote: "The website Ruchi created for me was more than I ever could have imagined or even create for myself. It’s stunning and very easy to navigate.", rating: 5, image: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/tatiana.jpg" },
    { name: "Kiro", role: "FOUNDER, MACEDONIAN TREASURES", quote: "I'm a repeat customer of Ruchi's services. What I can say is that on every new order he is delivering better and better. Very knowledgeable, patient and supportive. He is giving proposals from his side but also listening and taking in consideration of our needs and proposals. We will definitely continue to use his services. Thank you Ruchi!", rating: 5, image: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/Kiro.jpg" },
    { name: "Albert", role: "FOUNDER, MODERN BARBER", quote: "Ruchi, is very knowledge and is responsive and clear to all my questions. He understood the vision, and the results were terrific. Much pleasure working with him and actually doing another project with Ruchi.", rating: 5, image: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/Albert.jpg" },
    { name: "Virginie", role: "FOUNDER, MOTIVINK TATTOOS", quote: "Ruchi was a dream to work with. He is Highly professional and was a pleasure to work with! His turn around time was very fast! He communicates beautifully and explained everything very clearly. His work exceeded my expectations! Can't recommend him enough!!", rating: 5, image: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/Virginie.jpg" },
    { name: "Ife Thomas", role: "PUBLIC SPEAKER", quote: "I’ve been working with Ruchi for what seems like years, and I must say, he is an absolutely incredible developer. Not only is his skill set top-notch, but his easygoing nature makes him a pleasure to work with. Ruchi truly is the best-kept secret in my business!", rating: 5, image: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/Ife-Thomas.jpg" },
    { name: "Stacy", role: "FOUNDER, BE SEEN BY STACY", quote: "I had an amazing experience working with Ruchi. His customer service was exceptional- he was patient, responsive and open to collaborating. Ruchi totally exceeded my expectations! He delivered a fabulous upgraded shop with a luxury feel. I’m sooooo excited to show it off! I highly recommend Ruchi and look forward to working with him again soon.", rating: 5, image: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/Stacy.jpg" },
    { name: "Ben", role: "D2C STRATEGIST", quote: "I was pleasantly surprised to wake up to my newly designed and built Shopify store. This is my second time using Ruchi in as many months. He did not disappoint! Very impressed with how he goes the extra mile to help me with any other queries I have about running my store. Thanks again my friend!", rating: 5, image: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/Ben.jpeg" },
    { name: "Chad", role: "FOUNDER, NUTRINOCHE", quote: "I love using Ruchi. He knows how to work on Shopify and has been doing it for years. Do not hesitate to work with him at all:)", rating: 5, image: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/Chad.jpeg" }
  ];

  return (
    <section className="pt-32 pb-12 md:pb-16 px-6 lg:px-12 max-w-screen-2xl mx-auto overflow-hidden">
      <div className="text-center mb-20">
        <h2 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-4">UNFILTERED FEEDBACK</h2>
        <p className="text-gray-500 font-display uppercase tracking-widest text-sm font-bold">Real results from Shopify merchants and founders.</p>
      </div>

      <div className="relative">
        <motion.div
          initial={false}
          animate={{ height: showAll ? 'auto' : collapsedHeight }}
          transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <TestimonialCard {...t} />
            </motion.div>
          ))}
        </motion.div>

        <div className={`absolute bottom-0 left-0 w-full flex items-end justify-center transition-all duration-500 ${!showAll ? 'h-80 bg-gradient-to-t from-[#fcfcfc] via-[#fcfcfc]/80 to-transparent pb-32 md:pb-10' : 'h-24 pt-12 relative bg-transparent'}`}>
          <button
            onClick={() => setShowAll(!showAll)}
            className="border-2 border-brand-900 text-brand-900 bg-transparent px-12 py-4 font-display font-bold uppercase tracking-widest hover:bg-brand-900 hover:text-white transition-all duration-300 z-10 flex items-center gap-3 group shadow-xl cursor-pointer"
          >
            <span>{showAll ? 'See Less' : 'See More'}</span>
            <motion.div animate={{ rotate: showAll ? 180 : 0 }}>
              <Plus size={16} className={showAll ? 'rotate-45' : ''} />
            </motion.div>
          </button>
        </div>
      </div>

    </section>
  );
};

const PortfolioItem = ({ title, category, imageSrc, link }: { title: string, category: string, imageSrc: string, link: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group cursor-pointer block"
    >
      <div className={`aspect-[4/5] mb-3 md:mb-5 overflow-hidden relative border border-black shadow-sm ${isLoaded ? 'bg-transparent' : 'bg-gray-200 animate-pulse'}`}>
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          onLoad={() => setIsLoaded(true)}
          className={`absolute inset-0 object-cover transform group-hover:scale-105 transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
        />
        <div className="absolute top-3 right-3 md:top-5 md:right-5 z-10">
          <div className="text-white drop-shadow-lg transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">
            <ArrowUpRight size={22} strokeWidth={1.0} className="md:w-8 md:h-8" aria-label={`View the ${title} Project`} />
          </div>
        </div>
        <div className="absolute bottom-5 left-5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-[10px] font-display tracking-[0.2em] uppercase font-bold bg-black/50 px-2 py-1">
            {category}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 px-1">
        <h3 className="font-display font-bold text-sm md:text-xl text-gray-900 leading-[1.25] md:leading-[1.2] group-hover:text-brand-600 transition-colors duration-300 max-w-full">
          {title}
        </h3>
      </div>
    </motion.a>
  );
};

const ShopifyLogo = ({ className, size }: { className?: string, size?: number | string }) => (
  <Image
    src="https://wp.dreamycodes.com/wp-content/uploads/2026/03/shopify-logo-png_seeklogo-445424.png"
    alt="Shopify"
    width={200}
    height={200}
    style={{ width: size, height: size }}
    className={`object-contain brightness-0 invert opacity-50 group-hover:opacity-100 transition-all duration-300 ${className || ''}`}
  />
);

// ADDED TYPES HERE
const Capability = ({ title, description, icon: Icon, details }: { title: string, description: string, icon: React.ElementType, details: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  // Ties the trigger to the panel it controls, so assistive tech can announce
  // the relationship and the expanded state.
  const panelId = `${useId()}-capability-panel`;

  return (
    <div className="border-b border-gray-700 group">
      {/* A real button rather than a click handler on a div: this has to be
          reachable and operable from the keyboard, and expose its state. */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full text-left py-8 px-4 -mx-4 cursor-pointer hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <Icon className="text-gray-500 group-hover:text-white transition-colors" size={24} />
            <h3 className="font-display text-2xl md:text-3xl font-bold uppercase">{title}</h3>
          </div>
          <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }}>
            <Plus className="text-gray-500 group-hover:text-white transition-colors" aria-hidden="true" />
          </motion.div>
        </div>
        <p className="text-gray-400 font-light max-w-2xl">{description}</p>
      </button>
      {/* The panel stays mounted so the id in aria-controls always resolves;
          unmounting it would leave the button pointing at nothing while
          collapsed. `inert` keeps the hidden copy out of the tab order and the
          accessibility tree. */}
      <motion.div
        id={panelId}
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        inert={!isOpen}
        className="overflow-hidden px-4 -mx-4"
      >
        <div className="pt-6 pb-8 text-gray-300 font-light leading-relaxed max-w-2xl border-t border-gray-800">
              <ul className="space-y-4">
                {details.split('. ').filter(s => s.trim()).map((sentence, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                    <span>
                      {sentence.includes('Liquid, Hydrogen, and Oxygen') ? (
                        <>We leverage Shopify's latest features including <span className="text-[#3432c7] bg-[#3432c7]/10 px-1 rounded">Liquid, Hydrogen, and Oxygen</span> to deliver bespoke storefronts.</>
                      ) : sentence.includes('20-40% lift') ? (
                        <>Our optimizations typically yield a <span className="text-[#3432c7] bg-[#3432c7]/10 px-1 rounded">20-40% lift</span> in conversion rates.</>
                      ) : sentence.includes('complex subscription logic') ? (
                        <>Whether it's <span className="text-[#3432c7] bg-[#3432c7]/10 px-1 rounded">complex subscription logic</span> or real-time inventory syncing.</>
                      ) : (
                        sentence + (sentence.endsWith('.') ? '' : '.')
                      )}
                    </span>
                  </li>
                ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

// ADDED TYPES HERE
const Counter = ({ value, duration = 2 }: { value: string, duration?: number }) => {
  const [count, setCount] = useState(0);
  const [ref, setRef] = useState<HTMLSpanElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    if (!isInView) return;
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));

    // The count-up runs on a timer, so the reduced-motion rules in globals.css
    // cannot stop it. Jump straight to the final figure instead.
    if (prefersReducedMotion()) {
      setCount(numericValue);
      return;
    }

    let frame = 0;
    const totalFrames = duration * 60;
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      if (frame === totalFrames) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(numericValue * progress);
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  const formattedCount = value.includes('.') ? count.toFixed(1) : Math.floor(count);
  const displayValue = value.startsWith('$')
    ? `$${formattedCount}${value.replace(/[0-9.$]/g, '')}`
    : `${formattedCount}${value.replace(/[0-9.]/g, '')}`;

  return <span ref={setRef}>{displayValue}</span>;
};

const StatsSection = () => {
  const stats = [
    { value: "$4M+", label: "Client Revenue Generated" },
    { value: "300+", label: "Stores Launched & Scaled" },
    { value: "2.4x", label: "Average ROI Increase" },
    { value: "4%", label: "AVG. Conversion Rate" }
  ];
  return (
    <section className="py-5 md:py-10 bg-[#fcfcfc]">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 pt-2 md:pt-5 pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
          {stats.map((stat, i) => (
            <div key={i} className={`text-center group px-4 py-12 md:py-0 ${i % 2 === 0 ? 'border-r border-brand-900/10' : ''} ${i < 2 ? 'border-b border-brand-900/10 lg:border-b-0' : ''} ${i % 2 !== 0 ? 'lg:border-r lg:border-brand-900/10' : ''} ${i === 1 ? 'lg:border-r lg:border-brand-900/10' : ''} ${i === 2 ? 'lg:border-r lg:border-brand-900/10' : ''} ${i === 3 ? 'lg:border-r-0' : ''}`}>
              <div className="font-display text-5xl md:text-7xl font-bold mb-4 tracking-tighter group-hover:scale-110 transition-transform duration-500">
                <Counter value={stat.value} />
              </div>
              <p className="text-xs md:text-sm uppercase tracking-[0.2em] font-bold text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FounderStory = () => {
  const values = [
    {
      label: "Evolve",
      icon: Zap,
      body: "Keep learning. Keep improving. Stay ahead."
    },
    {
      label: "Communicate",
      icon: MessageSquare,
      body: "Clear updates. Direct collaboration. No black boxes."
    },
    {
      label: "Ownership",
      icon: ShieldCheck,
      body: "Find the real problem. Build the solution. Chase meaningful growth."
    }
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
        >
          {/* Photo panel — three layers: backdrop block, portrait, signature card */}
          <div className="relative w-full max-w-[300px] sm:max-w-[380px] lg:max-w-[480px] mx-auto lg:mx-0 pr-5 sm:pr-6 lg:pr-8 pb-8 sm:pb-10 lg:pb-12">
            {/* Layer 1 — backdrop block */}
            <div
              className="absolute right-0 bottom-0 left-6 sm:left-8 top-1/4 bg-[#efedea]"
              aria-hidden="true"
            ></div>

            {/* Layer 2 — portrait */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#efedea]">
              <Image
                src="https://wp.dreamycodes.com/wp-content/uploads/2026/08/Founder.jpg"
                alt="Ruchi, Founder and Lead Engineer at Dreamy Codes"
                fill
                sizes="(max-width: 640px) 300px, (max-width: 1024px) 380px, 480px"
                className="object-cover"
              />
            </div>

            {/* Layer 3 — signature + title, riding half over the portrait */}
            <div className="relative z-10 -mt-7 sm:-mt-8">
              <Image
                src="https://wp.dreamycodes.com/wp-content/uploads/2026/08/sign-2.png"
                alt="Ruchi's signature"
                width={520}
                height={200}
                sizes="220px"
                className="h-14 sm:h-16 w-auto object-contain object-left -ml-1"
              />
              <p className="font-display font-bold uppercase text-[10px] sm:text-xs text-gray-500 mt-1.5" style={{ letterSpacing: '0.2em' }}>
                Founder &amp; Lead Engineer
              </p>
            </div>
          </div>

          {/* Content panel */}
          <div className="flex flex-col justify-center">
            <p className="font-display font-bold text-gray-500 uppercase text-[10px] sm:text-xs mb-3" style={{ letterSpacing: '0.2em' }}>
              Founder&rsquo;s Story &amp; Mission
            </p>

            <h2 className="font-display text-5xl md:text-6xl xl:text-7xl font-bold uppercase tracking-tighter leading-[0.95]">
              Built to <span className="text-[#3432c7]">Convert</span>
            </h2>

            <div className="w-12 h-[3px] bg-brand-900 my-5" aria-hidden="true"></div>

            <p className="text-sm sm:text-base text-gray-500 font-light leading-relaxed max-w-xl mb-5">
              Dreamy Codes exists to help founders turn Shopify stores into businesses that grow.
            </p>

            <div className="border-l-2 border-brand-900 pl-4 mb-7">
              <p className="text-sm sm:text-base font-bold text-brand-900 leading-snug">
                We don’t just make stores look better.
              </p>
              <p className="text-sm sm:text-base font-bold text-brand-900 leading-snug">
                We engineer better ways for customers to buy.
              </p>
            </div>

            <div className="relative mb-6">
              {/* One rule down the whole list. Drawing it per row left a gap
                  wherever the row padding sat, so it broke after every item.
                  Its offset is the number column plus the gap after it, which
                  is where the spacer below reserves space. */}
              <span
                className="absolute top-0 bottom-0 left-10 sm:left-14 w-px bg-brand-900/10"
                aria-hidden="true"
              ></span>

              {values.map((value, i) => {
                const Icon = value.icon;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 sm:gap-5 py-3 ${i > 0 ? 'border-t border-brand-900/10' : ''}`}
                  >
                    <span className="font-serif text-xl sm:text-2xl text-gray-400 w-7 sm:w-9 flex-shrink-0 tabular-nums" aria-hidden="true">
                      {`0${i + 1}`}
                    </span>
                    {/* Reserves the rule's column; the rule itself is drawn
                        once for the whole list above. */}
                    <span className="w-px flex-shrink-0" aria-hidden="true"></span>
                    <Icon size={22} strokeWidth={1.75} className="text-brand-900 flex-shrink-0" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="font-display font-bold uppercase text-xs sm:text-sm text-brand-900 tracking-wide mb-0.5">
                        {value.label}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 font-light leading-snug">
                        {value.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              href="/about"
              className="self-start inline-flex items-center gap-3 font-display font-bold uppercase text-xs sm:text-sm text-brand-900 border-b-2 border-brand-900 pb-1.5 hover:gap-4 transition-all duration-300 group"
              style={{ letterSpacing: '0.15em' }}
            >
              <span>Read More About Dreamy Codes</span>
              <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Home = () => {
  useEffect(() => {
    // Handle hash scrolling if coming from another page
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) scrollIntoViewRespectingMotionPreference(element);
      }, 100);
    }
  }, []);

  return (
    <div>
      {/* The backdrop spans the hero AND the black marquee band below it, so
          the corners the marquee's diagonal leaves uncovered show the shader
          rather than bare white. */}
      <div className="relative isolate bg-white overflow-hidden">
        <GlassHeroBackground />
        <Hero />
        <LogoMarquee className="-mt-12 md:-mt-24" />
      </div>

      <section id="portfolio" className="py-32 px-6 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-5xl">
            <p className="font-display font-bold text-gray-600 uppercase text-xs mb-4" style={{ letterSpacing: '2px' }}>YOU HANDLE THE PRODUCT, WE CONVERT THE CLICKS</p>
            <h2 className="font-display text-[12vw] sm:text-[10vw] md:text-7xl font-bold uppercase tracking-tighter mb-8 leading-[1.1] md:leading-[0.9] whitespace-nowrap md:whitespace-normal">
              <span className="md:hidden">Rocket Fuel <br /> For Growing <br /> Your Brand</span>
              <span className="hidden md:block">Rocket Fuel For <br /> Growing Your Brand</span>
            </h2>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl">
              Have an awesome product? Partnering with Dreamy Codes is <span className="italic text-[#3432c7]">pouring gasoline on your sales</span>. Let our Shopify experts execute a data-driven Shopify store redesign to accelerate your brand's <span className="text-[#3432c7] bg-[#3432c7]/10 px-1 rounded">revenue growth</span>.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-12 gap-y-10 md:gap-y-20">
          <PortfolioItem title="CRO Optimized Store For Natural Hair Product" category="Theme Dev & CRO" imageSrc="https://wp.dreamycodes.com/wp-content/uploads/2026/03/P1-9.jpg" link="https://adovz.com/" />
          <PortfolioItem title="Modern Shopify Store Redesign For Snack Brand" category="Full Site Redesign" imageSrc="https://wp.dreamycodes.com/wp-content/uploads/2026/03/p6-3.jpg" link="https://flowstastytreats.com/" />
          <PortfolioItem title="Subscription Store Design With 3.2x Subscription Growth" category="Subscription Store Design" imageSrc="https://wp.dreamycodes.com/wp-content/uploads/2026/03/P3-11.jpg" link="https://succly.com/" />
          <PortfolioItem title="High-Converting Shopify Revamp For Barber Brand" category="Store Revamp & CRO" imageSrc="https://wp.dreamycodes.com/wp-content/uploads/2026/03/p7-1.jpg" link="https://modernbarbersupply.com/" />
          <PortfolioItem title="Luxury Watch Shopify Store With Advanced Filtering" category="Custom Dev & UX" imageSrc="https://wp.dreamycodes.com/wp-content/uploads/2026/03/P4-5.jpg" link="https://newyorkwatchoutlet.com/" />
          <PortfolioItem title="Serene Booking-Led Redesign For A Head Spa" category="Store Redesign & CRO" imageSrc="https://wp.dreamycodes.com/wp-content/uploads/2026/03/P5-3.jpg" link="https://andaliaheadspa.com/" />
        </div>

        <div className="mt-20 pt-12 border-t border-brand-900/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-xl">
            <h3 className="font-display text-2xl md:text-3xl font-bold uppercase mb-4">Curious to see more?</h3>
            <p className="text-gray-600 font-light leading-relaxed">
              We've built hundreds of high-performance stores across various industries. Explore our full portfolio to see how we've helped brands like yours scale to new heights.
            </p>
          </div>
          <Link href="/our-work" className="border-2 border-brand-900 text-brand-900 px-10 py-4 font-display font-bold uppercase tracking-widest hover:bg-brand-900 hover:text-white transition-all duration-300 whitespace-nowrap group flex items-center gap-3">
            <span>See More Work</span>
            <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <section id="case-studies" className="py-16 md:py-32 px-6 lg:px-12 max-w-screen-2xl mx-auto border-t border-brand-900">
        <CaseStudiesSlider />
      </section>

      <StatsSection />

      <section
        id="capabilities"
        className="py-32 text-white relative overflow-hidden bg-[#050505]"
      >
        <div
          className="absolute inset-0 pointer-events-none animate-radial-move"
          style={{
            background: 'radial-gradient(circle at center, #3d3d3d 0%, transparent 50%)',
            backgroundSize: '250% 250%',
          }}
        ></div>
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-30 pointer-events-none"></div>
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <h2 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-8 leading-tight">Shopify design, CRO &amp; integrations</h2>
              <p className="text-white text-lg font-light leading-relaxed max-w-md">We provide end-to-end e-commerce solutions. From the first line of code to the final checkout optimization, we build systems <span className="text-white bg-[#3432c7] px-2 py-0.5 rounded font-medium text-nowrap">designed to generate revenue</span>.</p>
            </div>
            <div className="lg:col-span-7">
              <div className="border-t border-gray-700">
                <Capability title="Shopify Design and Development" icon={ShopifyLogo} description="We develop eye-catching websites that convert. Where aesthetics and UX are combined with top conversion tactics to ensure your website does what it should be doing: earning you more sales." details="Our architecture is built for speed and scalability. We leverage Shopify's latest features including Liquid, Hydrogen, and Oxygen to deliver bespoke storefronts that outperform the competition. Every line of code is optimized for Core Web Vitals and long-term maintainability." />
                <Capability title="Conversion Optimization" icon={TrendingUp} description="Ensure you are optimized every step of the funnel. Our blended expertise of paid ad spend + web design makes us the perfect partners in pushing the limit for what's possible in your sales funnel." details="We don't just guess; we test. Using heatmaps, session recordings, and rigorous A/B testing, we identify friction points in your customer journey. Our optimizations typically yield a 20-40% lift in conversion rates by streamlining navigation and perfecting the checkout experience." />
                <Capability title="E-Commerce Integrations" icon={Zap} description="Wiring up your retention engine. Complex Klaviyo flows, Recharge subscriptions, Yotpo loyalty, and ERP synchronization." details="Your tech stack should work as one. We specialize in deep API integrations that sync your marketing, logistics, and customer support tools. Whether it's complex subscription logic or real-time inventory syncing with your warehouse, we ensure your data flows perfectly." />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      <FounderStory />

      <ContactSection />
    </div>
  );
};

export default Home;