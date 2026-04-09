"use client";
import React, { useState, useEffect } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import FloatingParticles from '../components/FloatingParticles';
import LogoMarquee from '../components/LogoMarquee';

const Hero = () => {
  return (
    <section className="relative bg-grid-pattern pt-32 pb-24 md:pt-40 md:pb-32 min-h-[8vh] flex flex-col justify-center overflow-hidden">
      <FloatingParticles />

      <div className="absolute top-1/4 right-[10%] w-[500px] h-[500px] bg-gray-200 rounded-full mix-blend-multiply filter blur-[100px] animate-slow-glow -z-10"></div>
      <div className="absolute bottom-0 left-[10%] w-[400px] h-[400px] bg-gray-100 rounded-full mix-blend-multiply filter blur-[80px] animate-slow-glow -z-10" style={{ animationDelay: '4s' }}></div>

      <div className="px-6 lg:px-12 max-w-screen-2xl mx-auto w-full pb-5 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mt-6 md:mt-0 mb-8 relative z-10"
        >
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-blink"></div>
          <p className="font-display font-bold text-brand-900/60 uppercase text-[10px] md:text-sm" style={{ letterSpacing: '0.2rem' }}>ACCEPTING PARTNERS FOR Q2</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-9"
          >
            <h1 className="font-display text-[13vw] sm:text-[10vw] md:text-8xl lg:text-[7rem] font-bold leading-[1.1] md:leading-[0.9] tracking-tighter uppercase whitespace-nowrap">
              We engineer <br />
              <span className="text-outline">e-commerce</span> <br />
              for scale.
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-3 pb-4"
          >
            <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed mb-8">
              Scaling is tough. <br />
              Let our <span className="font-bold">Shopify experts</span> engineer your <span className="text-emerald-700 bg-emerald-50/50 px-1 rounded">high-converting storefront</span> so you can focus on D2C growth.
            </p>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col md:flex-row lg:flex-col md:items-center lg:items-start md:gap-8 gap-6">
                <Link
                  href="#contact"
                  className="inline-flex items-center justify-between w-full md:w-auto md:gap-4 px-8 py-4 bg-[#3432c7] text-white hover:bg-white hover:text-[#3432c7] border border-[#3432c7] font-display font-bold text-lg uppercase tracking-wider group transition-all duration-300 cursor-pointer whitespace-nowrap"
                >
                  <span>Book Strategy Call</span>
                  <ArrowRight className="transform group-hover:translate-x-2 transition-transform" />
                </Link>

                <Link href="#portfolio" className="inline-flex items-center gap-2 font-display font-bold text-sm uppercase tracking-[0.2em] text-brand-900/60 hover:text-brand-900 transition-colors cursor-pointer group pt-2 md:pt-0 whitespace-nowrap">
                  <span>View Our Work</span>
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="flex items-center gap-3">
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
                      alt="Satisfied Shopify Merchant Client Avatar"
                      width={48}
                      height={48}
                      priority={true}
                      sizes="48px"
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white object-cover shadow-sm"
                    />
                  ))}
                </div>
                <p className="text-xs md:text-sm font-display font-light uppercase tracking-widest text-brand-900/70 leading-tight md:whitespace-nowrap">
                  Trusted by 200+ <br /> Shopify merchants
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const CaseStudy = ({ number, title, description, stats, category, table, link, imageSrc }: { number: string, title: string, description: string, stats: { value: string, label: string }[], category: string, table?: { data: { challenge: string, result: string }[] }, link: string, imageSrc?: string }) => {
  const [isLoaded, setIsLoaded] = useState(true);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-brand-900 group h-full bg-white overflow-hidden">
      <a href={link} aria-label={`View the ${title} Case Study`} target="_blank" rel="noopener noreferrer" draggable={false} className="bg-brand-50 relative min-h-[300px] md:min-h-[400px] flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-brand-900 block">
        <div className={`absolute inset-0 overflow-hidden ${isLoaded ? 'bg-transparent' : 'bg-gray-200 animate-pulse'}`}>
          <Image
            src={imageSrc || `https://picsum.photos/seed/${category}/1200/800`}
            alt={`${title} - ${category} Success Case Study`}
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
                  <div className="p-3 text-gray-700">{row.challenge}</div>
                  <div className="p-3 text-gray-700">{row.result}</div>
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
  const [isLoaded, setIsLoaded] = useState(true);
  const initials = name.split(' ').map(n => n[0]).join('');
  return (
    <div className="bg-white p-8 border border-gray-200 flex flex-col h-full relative hover:bg-[#3432c7] hover:border-[#3432c7] cursor-pointer transition-colors duration-500 group/card">
      <div className="flex items-center gap-4 mb-6">
        {image ? (
          <div className={`w-12 h-12 rounded-full overflow-hidden ${isLoaded ? 'bg-transparent' : 'bg-gray-200 animate-pulse'}`}>
            <Image
              src={image}
              alt={`Shopify Store Founder ${name} - Client Success Testimonial`}
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

  const testimonials = [
    { name: "Kelly", role: "FOUNDER, CHICKITTY & SHAGGYCHIC", quote: "Ruchi at is a superstar . He exemplifies professionalism, knowledge, and a work ethic that we can always count on to assist with any of our Shopify needs. He is always highly responsive to our needs and remains one of the top partners that we have worked with.", rating: 5, image: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/Kelly.jpeg" },
    { name: "Mike", role: "FOUNDER, FOR THE LOVE OF GOLF NP", quote: "Another Job Well Done!!! That guy never misses!! This is my 4th or 5th time working with Ruchi on a project and I must say I wont even look anywhere else. Again, Thank you for believing in our business and putting in the heart and time to make sure that our site is top of the line.", rating: 5, image: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/Mike.jpeg" },
    { name: "Emily", role: "FOUNDER, SUCCLY", quote: "Ruchi is truly the best at what he does! He created an exceptional website for me, and when I needed a blog that had different categories, I knew he could deliver and of course, he did. The blog turned out beautifully, with perfectly sized photos (something we couldn’t get right before), clean drop down menus, and a professional, polished look. Ruchi is reliable, talented, and simply the best!!", rating: 5, image: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/Emily.jpg" },
    { name: "Tatiana", role: "FOUNDER, ALEJANDRA'S PANADERIA", quote: "The website Ruchi created for me was more than I ever could have imagined or even create for myself. It’s stunning and very easy to navigate.", rating: 5, image: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/tatiana.jpg" },
    { name: "Kiro", role: "FOUNDER, MACEDONIAN TREASURES", quote: "I'm repetitive customer of Ruchi's services. What i can say that on every new order he is delivering better and better. Very knowledgeable, patient and supportive. He is giving proposals from his side but also listening and taking in consideration of our needs and proposals. We will definitely continue to use his services. Thank you Ruchi!", rating: 5, image: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/Kiro.jpg" },
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
        <p className="text-gray-500 font-display uppercase tracking-widest text-sm font-bold">Real results from Shopify merchants, founders, and CTOs.</p>
      </div>

      <div className="relative">
        <motion.div
          initial={false}
          animate={{ height: showAll ? 'auto' : '580px' }}
          transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden testimonials-grid"
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

      <style dangerouslySetInnerHTML={{
        __html: `
        @media (max-width: 768px) {
          .testimonials-grid {
            height: ${showAll ? 'auto' : '960px'} !important;
          }
        }
      `}} />
    </section>
  );
};

const PortfolioItem = ({ title, category, seed, imageSrc, link }: { title: string, category: string, seed?: string, imageSrc?: string, link: string }) => {
  const [isLoaded, setIsLoaded] = useState(true);
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
      <div className={`aspect-[4/5] mb-5 overflow-hidden relative border border-black shadow-sm ${isLoaded ? 'bg-transparent' : 'bg-gray-200 animate-pulse'}`}>
        <Image
          src={imageSrc || `https://picsum.photos/seed/${seed}/800/1000`}
          alt={`${title} - High Converting Shopify Storefront`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          onLoad={() => setIsLoaded(true)}
          className={`absolute inset-0 object-cover transform group-hover:scale-105 transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
        />
        <div className="absolute top-5 right-5 z-10">
          <div className="text-white drop-shadow-lg transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">
            <ArrowUpRight size={32} strokeWidth={1.0} aria-label={`View the ${title} Project`} />
          </div>
        </div>
        <div className="absolute bottom-5 left-5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-[10px] font-display tracking-[0.2em] uppercase font-bold bg-black/50 px-2 py-1">
            {category}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 px-1">
        <h3 className="font-display font-bold text-xl text-gray-900 leading-[1.2] group-hover:text-brand-600 transition-colors duration-300 max-w-full">
          {title}
        </h3>
      </div>
    </motion.a>
  );
};

const ShopifyLogo = ({ className, size }: { className?: string, size?: number | string }) => (
  <Image
    src="https://wp.dreamycodes.com/wp-content/uploads/2026/03/shopify-logo-png_seeklogo-445424.png"
    alt="Official Shopify Plus Partner Logo"
    width={200}
    height={200}
    style={{ width: size, height: size }}
    className={`object-contain brightness-0 invert opacity-50 group-hover:opacity-100 transition-all duration-300 ${className || ''}`}
  />
);

// ADDED TYPES HERE
const Capability = ({ title, description, icon: Icon, details }: { title: string, description: string, icon: React.ElementType, details: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="py-8 border-b border-gray-700 group cursor-pointer hover:bg-white/5 transition-colors px-4 -mx-4" onClick={() => setIsOpen(!isOpen)}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <Icon className="text-gray-500 group-hover:text-white transition-colors" size={24} />
          <h3 className="font-display text-2xl md:text-3xl font-bold uppercase">{title}</h3>
        </div>
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }}>
          <Plus className="text-gray-500 group-hover:text-white transition-colors" />
        </motion.div>
      </div>
      <p className="text-gray-400 font-light max-w-2xl">{description}</p>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-6 pb-2 text-gray-300 font-light leading-relaxed max-w-2xl border-t border-gray-800 mt-6">
              <ul className="space-y-4">
                {details.split('. ').filter(s => s.trim()).map((sentence, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                    <span>
                      {sentence.includes('Liquid, Hydrogen, and Oxygen') ? (
                        <>We leverage Shopify's latest features including <span className="text-emerald-500 bg-emerald-500/10 px-1 rounded">Liquid, Hydrogen, and Oxygen</span> to deliver bespoke storefronts.</>
                      ) : sentence.includes('20-40% lift') ? (
                        <>Our optimizations typically yield a <span className="text-emerald-500 bg-emerald-500/10 px-1 rounded">20-40% lift</span> in conversion rates.</>
                      ) : sentence.includes('complex subscription logic') ? (
                        <>Whether it's <span className="text-emerald-500 bg-emerald-500/10 px-1 rounded">complex subscription logic</span> or real-time inventory syncing.</>
                      ) : (
                        sentence + (sentence.endsWith('.') ? '' : '.')
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
    { value: "$19M+", label: "Client Revenue Generated" },
    { value: "200+", label: "Stores Launched & Scaled" },
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

const Home = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Handle hash scrolling if coming from another page
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      access_key: "b60055de-dbc3-4b12-b737-b3eed8cfc062",
      name: formData.get('name'),
      email: formData.get('email'),
      url: formData.get('url'),
      message: formData.get('message'),
      subject: "New Contact Form Submission from Dreamy Codes",
    };
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setShowSuccessModal(true);
        (e.target as HTMLFormElement).reset();
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="relative">
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
              Have an awesome product? Partnering with Dreamy Codes is <span className="italic text-[#3432c7]">pouring gasoline on your sales</span>. Let our Shopify experts execute a data-driven Shopify store redesign to accelerate your brand's <span className="text-emerald-500 bg-emerald-50/50 px-1 rounded">revenue growth</span>.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          <PortfolioItem title="CRO Optimized Store For Natural Hair Product" category="Theme Dev & CRO" imageSrc="https://wp.dreamycodes.com/wp-content/uploads/2026/03/P1-9.jpg" link="https://adovz.com/" />
          <PortfolioItem title="Modern Shopify Store Redesign For Snack Brand" category="Full Site Redesign" imageSrc="https://wp.dreamycodes.com/wp-content/uploads/2026/03/p6-3.jpg" link="https://flowstastytreats.com/" />
          <PortfolioItem title="Subscription Store Design With 300% Sales Growth" category="Subscription Store Design" imageSrc="https://wp.dreamycodes.com/wp-content/uploads/2026/03/P3-11.jpg" link="https://succly.com/" />
          <PortfolioItem title="High-Converting Shopify Revamp For Barber Brand" category="Store Revamp & CRO" imageSrc="https://wp.dreamycodes.com/wp-content/uploads/2026/03/p7-1.jpg" link="https://modernbarbersupply.com/" />
          <PortfolioItem title="Luxury Watch Shopify Store With Advanced Filtering" category="Custom Dev & UX" imageSrc="https://wp.dreamycodes.com/wp-content/uploads/2026/03/P4-5.jpg" link="https://newyorkwatchoutlet.com/" />
          <PortfolioItem title="High Converting Redesign With 175% Sales Growth" category="Store Redesign & CRO" imageSrc="https://wp.dreamycodes.com/wp-content/uploads/2026/03/P5-3.jpg" link="https://andaliaheadspa.com/" />
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
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes radialMoveHome {
            0% { background-position: 0% 0%; }
            20% { background-position: 100% 30%; }
            40% { background-position: 20% 100%; }
            60% { background-position: 100% 80%; }
            80% { background-position: 10% 40%; }
            100% { background-position: 0% 0%; }
          }
        `}} />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, #3d3d3d 0%, transparent 50%)',
            backgroundSize: '250% 250%',
            animation: 'radialMoveHome 25s ease-in-out infinite'
          }}
        ></div>
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-30 pointer-events-none"></div>
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <h2 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-8 leading-tight">Services</h2>
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

      <section id="contact" className="pt-10 pb-20 md:pt-12 md:pb-20 border-b border-brand-900 bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 border border-brand-900">
            <div className="px-6 py-12 md:p-20 flex flex-col justify-center border-r lg:border-r border-brand-900 border-b lg:border-b-0 bg-[#fcfcfc]">
              <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-4">Don't leave conversions on the table!</h2>
              <p className="text-gray-600 mb-12 font-light">Fill out the form below to request a comprehensive consultation or to discuss a new e-commerce build.</p>
              <form className="space-y-8" onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="border-b border-brand-900 pb-2"><input name="name" type="text" placeholder="Your Name *" className="w-full bg-transparent focus:outline-none placeholder-gray-400 font-display text-sm tracking-widest cursor-text" required /></div>
                  <div className="border-b border-brand-900 pb-2"><input name="email" type="email" placeholder="Email Address *" className="w-full bg-transparent focus:outline-none placeholder-gray-400 font-display text-sm tracking-widest cursor-text" required /></div>
                </div>
                <div className="border-b border-brand-900 pb-2"><input name="url" type="text" placeholder="Current Store URL (If applicable)" className="w-full bg-transparent focus:outline-none placeholder-gray-400 font-display text-sm tracking-widest cursor-text" /></div>
                <div className="border-b border-brand-900 pb-2"><textarea name="message" rows={4} placeholder="Project Details / Current Bottlenecks *" className="w-full bg-transparent focus:outline-none placeholder-gray-400 font-display text-sm tracking-widest resize-none cursor-text" required></textarea></div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-[#3432c7] text-white hover:bg-white hover:text-[#3432c7] border border-[#3432c7] font-display font-bold uppercase tracking-widest py-5 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? 'Sending...' : 'Book Strategy Call'}</button>
              </form>
            </div>
            <div className="px-6 py-12 md:p-20 flex flex-col justify-center bg-brand-50 relative overflow-hidden">
              <div className="absolute -right-20 -bottom-20 text-[20rem] font-display font-bold text-brand-900/[0.03] leading-none pointer-events-none">DC</div>
              <h3 className="font-display text-2xl font-bold uppercase tracking-widest mb-12">Direct Contact</h3>
              <div className="space-y-10 relative z-10">
                <div>
                  <h4 className="font-display text-[10px] md:text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">General Inquiries & Sales</h4>
                  <a href="mailto:hello@dreamycodes.com" target="_blank" rel="noopener noreferrer" className="font-display text-xl md:text-3xl font-bold hover:text-gray-500 transition-colors inline-block border-b-2 border-transparent hover:border-brand-900 pb-1">hello@dreamycodes.com</a>
                </div>
                <div>
                  <h4 className="font-display text-[10px] md:text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">WhatsApp</h4>
                  <Link href="https://api.whatsapp.com/send?phone=94714166608" target="_blank" rel="noopener noreferrer" className="font-display text-xl md:text-3xl font-bold text-black hover:text-gray-500 transition-colors inline-flex items-center gap-4">
                    <Image
                      src="https://wp.dreamycodes.com/wp-content/uploads/2026/03/1-1.png"
                      alt="WhatsApp Contact for E-commerce Project Consultation"
                      width={40}
                      height={40}
                      className="w-6 h-6 md:w-10 md:h-10 object-contain"
                      referrerPolicy="no-referrer"
                    />
                    +94 (71) 416-6608
                  </Link>
                </div>
                <div className="pt-10 border-t border-brand-900/10"><p className="text-gray-500 font-light leading-relaxed max-w-sm">Based globally. <br /> Operating in EST & GMT timezones to seamlessly integrate with your executive team.</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSuccessModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white p-8 md:p-12 max-w-xl w-full border border-brand-900 shadow-2xl text-center">
              <button aria-label="Close modal" onClick={() => setShowSuccessModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-brand-900 transition-colors cursor-pointer">
                <X size={24} />
              </button>
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8"><Zap size={40} fill="currentColor" /></div>
              <h3 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tighter mb-6">Request Received</h3>
              <p className="text-gray-600 text-lg font-light leading-relaxed mb-10">Thank you we received your request, and we will send you a detailed audit to your site and send a calendly link to schedule a call.</p>
              <button onClick={() => setShowSuccessModal(false)} className="w-full bg-brand-900 text-white font-display font-bold uppercase tracking-widest py-4 hover:bg-black transition-colors cursor-pointer">Got it</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;