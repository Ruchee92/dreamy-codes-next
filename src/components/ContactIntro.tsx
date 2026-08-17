"use client";
import React from 'react';
import { motion } from 'motion/react';
import { Star, Check } from 'lucide-react';

const CREDENTIALS = [
  '500+ Projects Completed',
  'Shopify Partners',
  'Building Since 2023',
];

const INCLUDED = [
  'Custom Shopify builds, redesigns and CRO work',
  'A direct line to the engineers, designers and CRO leads doing the work',
  'Official Shopify Partners',
];

/**
 * Opens /contact-us. Carries the page's h1, so the contact block below it
 * stays an h2 on this route.
 */
const ContactIntro = () => {
  return (
    <section className="bg-white pt-28 md:pt-36 pb-10 md:pb-14">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-10 lg:gap-16 items-end"
        >
          <div>
            {/* Rating, then the proof points as one editorial line. */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mb-8">
              <span className="flex items-center gap-1" aria-label="Rated 5 out of 5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={16} className="text-[#3432c7] fill-[#3432c7]" aria-hidden="true" />
                ))}
              </span>
              <span className="h-4 w-px bg-brand-900/15" aria-hidden="true"></span>
              <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 font-display font-bold uppercase text-[10px] sm:text-xs text-gray-500" style={{ letterSpacing: '0.18em' }}>
                {CREDENTIALS.map((item, i) => (
                  <li key={item} className="flex items-center gap-4">
                    {i > 0 && <span className="h-4 w-px bg-brand-900/15" aria-hidden="true"></span>}
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <h1 className="font-display text-5xl md:text-6xl xl:text-7xl font-bold uppercase tracking-tighter leading-[0.95] mb-6">
              Ready to scale your <span className="text-[#3432c7]">Shopify</span> store?
            </h1>

            <p className="text-base sm:text-lg text-gray-500 font-light leading-relaxed max-w-2xl">
              Talk to a team that has seen your bottleneck before — and knows which fix actually
              moves revenue. Tell us where your store is stuck and we&rsquo;ll come back with a
              plan, not a pitch.
            </p>
          </div>

          {/* What the call covers, as a bordered card matching the contact block below. */}
          <div className="border border-brand-900 bg-[#fcfcfc] px-6 py-8 sm:px-8 sm:py-9">
            <p className="font-display font-bold uppercase text-[10px] sm:text-xs text-gray-500 mb-6" style={{ letterSpacing: '0.2em' }}>
              What you get
            </p>
            <ul className="space-y-4">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check size={18} strokeWidth={2.5} className="text-[#3432c7] flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-sm sm:text-base text-brand-900 font-light leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactIntro;
