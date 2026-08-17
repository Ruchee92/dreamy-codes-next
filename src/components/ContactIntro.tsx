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
 * Opens /contact-us. Carries the page's h1, so the contact block below it
 * stays an h2 on this route.
 */
const ContactIntro = () => {
  return (
    <section className="bg-white pt-24 md:pt-36 pb-6 md:pb-14">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            {/* Rating and the headline number read as one claim, so they share
                a line. */}
            <div className="flex items-center gap-2.5 mb-3">
              <span className="flex items-center gap-0.5" aria-label="Rated 5 out of 5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={14} className="text-[#3432c7] fill-[#3432c7]" aria-hidden="true" />
                ))}
              </span>
              <span className="font-display font-bold uppercase text-[11px] sm:text-xs text-brand-900 tracking-[0.14em]">
                500+ Projects Completed
              </span>
            </div>

            <ul className="flex flex-wrap items-center gap-2 mb-6 sm:mb-8">
              {BADGES.map((badge) => (
                <li
                  key={badge}
                  className="bg-brand-900/[0.05] px-2.5 py-1.5 font-display font-bold uppercase text-[10px] text-gray-600 tracking-[0.12em]"
                >
                  {badge}
                </li>
              ))}
            </ul>

            {/* Capped so the line does not stretch the full grid on wide
                screens, where it would read as a banner rather than a heading. */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold uppercase tracking-tighter leading-[0.95] mb-4 sm:mb-6 max-w-4xl">
              Ready to scale your <span className="text-[#3432c7]">Shopify</span> store?
            </h1>

            <p className="text-sm sm:text-lg text-gray-500 font-light leading-relaxed max-w-2xl">
              Talk to a team that has seen your bottleneck before — and knows which fix actually
              moves revenue. Tell us where your store is stuck and we&rsquo;ll come back with a
              plan, not a pitch.
            </p>
          </div>

          {/* Full width under the copy rather than a second column beside it:
              as a column it left a large hole at the top right and its rule
              floated with nothing to align to. Three across on desktop, a
              divided list on phones. */}
          <div className="mt-8 sm:mt-12 lg:mt-16 border-t border-brand-900 pt-5 sm:pt-6">
            <p className="font-display font-bold uppercase text-[10px] sm:text-xs text-gray-500 mb-3 sm:mb-5 tracking-[0.2em]">
              What you get
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-brand-900/10">
              {INCLUDED.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 py-3 sm:py-1 sm:px-6 sm:first:pl-0 sm:last:pr-0"
                >
                  <Check size={15} strokeWidth={2.5} className="text-[#3432c7] flex-shrink-0 mt-1" aria-hidden="true" />
                  <span className="text-[13px] sm:text-[15px] text-brand-900 font-light leading-snug">{item}</span>
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
