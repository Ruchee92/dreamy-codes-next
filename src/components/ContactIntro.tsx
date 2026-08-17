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
    <section className="bg-white pt-24 md:pt-36 pb-8 md:pb-14">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-10 lg:gap-16 items-end"
        >
          <div>
            {/* Stars on their own line, proof points beneath. Keeping them on
                one row only worked at the widest breakpoints — everywhere else
                the list wrapped and left the divider dangling. */}
            <div className="flex flex-col gap-y-2.5 mb-7 sm:mb-8">
              <span className="flex items-center gap-1" aria-label="Rated 5 out of 5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={15} className="text-[#3432c7] fill-[#3432c7]" aria-hidden="true" />
                ))}
              </span>
              <ul className="flex flex-wrap items-center gap-x-2.5 sm:gap-x-4 gap-y-1 font-display font-bold uppercase text-[10px] sm:text-xs text-gray-500 tracking-[0.12em] sm:tracking-[0.18em]">
                {CREDENTIALS.map((item, i) => (
                  <li key={item} className="flex items-center gap-2.5 sm:gap-4">
                    {i > 0 && <span className="w-1 h-1 rounded-full bg-brand-900/25" aria-hidden="true"></span>}
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

          {/* A bordered card from sm up, matching the contact block below. On
              phones the box and its padding cost most of a screen for three
              short lines, so it collapses to a plain divided list. */}
          <div className="sm:border sm:border-brand-900 sm:bg-[#fcfcfc] sm:px-8 sm:py-9">
            <p className="font-display font-bold uppercase text-[10px] sm:text-xs text-gray-500 mb-3 sm:mb-6 tracking-[0.2em]">
              What you get
            </p>
            <ul className="divide-y divide-brand-900/10 sm:divide-y-0 sm:space-y-4">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-2.5 sm:gap-3 py-2.5 sm:py-0">
                  <Check size={15} strokeWidth={2.5} className="text-[#3432c7] flex-shrink-0 mt-1 sm:mt-0.5 sm:w-[18px] sm:h-[18px]" aria-hidden="true" />
                  <span className="text-[13px] sm:text-base text-brand-900 font-light leading-snug">{item}</span>
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
