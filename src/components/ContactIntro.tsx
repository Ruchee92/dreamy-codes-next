"use client";
import React from 'react';
import { motion } from 'motion/react';
import { Star, Check } from 'lucide-react';

// Second-tier proof. The rating and project count lead; these sit under them as
// quieter credentials rather than competing on the same line.
const BADGES = ['Shopify Partners', 'Building Since 2023'];

const INCLUDED = [
  'Custom Shopify builds, redesigns and CRO work',
  'A direct line to the engineers, designers and CRO leads doing the work',
  'Official Shopify Partners',
];

/**
 * What a call covers. Beside the copy on desktop; on phones it reads better
 * after the form, so the page renders it there instead — hence a component
 * rather than markup fixed inside the intro.
 */
export const ContactInclusions = ({ className = '' }: { className?: string }) => (
  <div className={className}>
    <p className="font-display font-bold uppercase text-[10px] sm:text-xs text-gray-500 mb-3 sm:mb-4 tracking-[0.2em]">
      What you get
    </p>
    <ul className="divide-y divide-brand-900/10">
      {INCLUDED.map((item) => (
        <li key={item} className="flex items-start gap-3 py-3 sm:py-4 first:pt-0">
          <Check size={15} strokeWidth={2.5} className="text-[#3432c7] flex-shrink-0 mt-1" aria-hidden="true" />
          <span className="text-[13px] sm:text-[15px] text-brand-900 font-light leading-snug">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

/**
 * Opens /contact-us. Carries the page's h1, so the contact block below it
 * stays an h2 on this route.
 */
const ContactIntro = () => {
  return (
    <section className="bg-white pt-24 md:pt-36 pb-6 md:pb-14">
      {/* Same container padding as the contact block below, so the two line up. */}
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          // 50/50 with no column gap, so the divider lands on the container's
          // midpoint — the same x as the border splitting the contact block
          // below. A gap would push it off centre by half the gap.
          className="grid grid-cols-1 lg:grid-cols-2 gap-y-8 items-start"
        >
          {/* Left: the headline and its proof. Right: everything that
              supports it. Splitting the copy across the columns is what makes
              the two sides carry comparable weight — with the heading alone on
              the left, the right half could only ever be empty at the top or
              the bottom. */}
          {/* order-2 on phones: the heading should land first there, while on
              desktop the explicit grid placement below decides position and
              order is ignored. */}
          <div className="order-2 lg:order-none lg:col-start-1 lg:row-start-1 lg:pr-12">
            {/* Rating and the headline number read as one claim, so they share
                a line. */}
            <div className="flex items-center gap-2.5 mb-3">
              <span className="flex items-center gap-0.5" aria-label="Rated 5 out of 5">
                {[0, 1, 2, 3, 4].map((i) => (
                  // fill follows the text colour, so the stars read as part of
                  // the line beside them rather than a separate accent.
                  <Star key={i} size={14} className="text-brand-900" fill="currentColor" aria-hidden="true" />
                ))}
              </span>
              <span className="font-display font-bold uppercase text-[11px] sm:text-xs text-brand-900 tracking-[0.14em]">
                300+ Projects Completed
              </span>
            </div>

            <ul className="flex flex-wrap items-center gap-2 lg:mb-8">
              {BADGES.map((badge) => (
                <li
                  key={badge}
                  className="bg-brand-900/[0.05] px-2.5 py-1.5 font-display font-bold uppercase text-[10px] text-gray-600 tracking-[0.12em]"
                >
                  {badge}
                </li>
              ))}
            </ul>
          </div>

          {/* Heading and the supporting column share row 2, so the paragraph
              starts level with the top of the heading. */}
          <h1 className="order-1 lg:order-none lg:col-start-1 lg:row-start-2 lg:pr-12 font-display text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold uppercase tracking-tighter leading-[0.95] max-w-4xl">
            Ready to scale your <span className="text-[#3432c7]">Shopify</span> store?
          </h1>

          <div className="order-3 lg:order-none lg:col-start-2 lg:row-start-2 lg:border-l lg:border-brand-900/15 lg:pl-12">
            <p className="text-sm sm:text-lg text-gray-500 font-light leading-relaxed">
              Talk to a team that has seen your bottleneck before — and knows which fix actually
              moves revenue. Tell us where your store is stuck and we&rsquo;ll come back with a
              plan, not a pitch.
            </p>

            {/* Phones get this after the form instead — see the page. */}
            <ContactInclusions className="hidden lg:block mt-9" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactIntro;
