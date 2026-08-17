"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Zap } from 'lucide-react';

/**
 * The contact block that closes the homepage, and the whole of /contact-us.
 * Both routes render this same component so the form, the copy and the success
 * modal cannot drift apart.
 */
const ContactSection = ({ headingLevel = 'h2' }: { headingLevel?: 'h1' | 'h2' }) => {
  // On the homepage the hero owns the h1 and this block is a section, so it
  // stays an h2. On /contact-us it is the page's subject, and leaving it as an
  // h2 left that page with no h1 at all. Same text either way.
  const Heading = headingLevel;
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      access_key: "b60055de-dbc3-4b12-b737-b3eed8cfc062",
      name: formData.get('name'),
      email: formData.get('email'),
      url: formData.get('url'),
      message: formData.get('message'),
      subject: "New Contact Form Submission from Dreamy Codes",
      // Honeypot. The field is hidden from people and left blank by them, so
      // anything that fills it in is a bot; Web3Forms drops those submissions.
      botcheck: formData.get('botcheck') ? true : false,
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
        setSubmitError(
          "We couldn't send that just now. Please try again, or email hello@dreamycodes.com."
        );
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(
        "That didn't reach us — please check your connection and try again, or email hello@dreamycodes.com."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section id="contact" className="pt-10 pb-20 md:pt-12 md:pb-20 border-b border-brand-900 bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 border border-brand-900">
            <div className="px-6 py-12 md:p-20 flex flex-col justify-center border-r lg:border-r border-brand-900 border-b lg:border-b-0 bg-[#fcfcfc]">
              <Heading className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-4">Don't leave conversions on the table!</Heading>
              <p className="text-gray-600 mb-4 font-light">Fill out the form below to request a comprehensive consultation or to discuss a new e-commerce build.</p>
              <p className="text-sm font-display uppercase tracking-widest text-brand-900 font-bold mb-12">
                Projects start at <span className="text-[#3432c7]">$990</span>
              </p>
              <form className="space-y-8" onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="border-b border-brand-900 pb-2"><input name="name" type="text" placeholder="Your Name *" className="w-full bg-transparent focus:outline-none placeholder-gray-400 font-display text-sm tracking-widest cursor-text" required /></div>
                  <div className="border-b border-brand-900 pb-2"><input name="email" type="email" placeholder="Email Address *" className="w-full bg-transparent focus:outline-none placeholder-gray-400 font-display text-sm tracking-widest cursor-text" required /></div>
                </div>
                <div className="border-b border-brand-900 pb-2"><input name="url" type="text" placeholder="Current Store URL (If applicable)" className="w-full bg-transparent focus:outline-none placeholder-gray-400 font-display text-sm tracking-widest cursor-text" /></div>
                <div className="border-b border-brand-900 pb-2"><textarea name="message" rows={4} placeholder="Project Details / Current Bottlenecks *" className="w-full bg-transparent focus:outline-none placeholder-gray-400 font-display text-sm tracking-widest resize-none cursor-text" required></textarea></div>
                {/* Honeypot: off-screen rather than display:none, since some
                    bots skip hidden fields. Kept out of the tab order and the
                    accessibility tree so nobody real can reach it. */}
                <div className="absolute w-px h-px -left-[9999px] overflow-hidden" aria-hidden="true">
                  <label htmlFor="botcheck">Leave this field empty</label>
                  <input id="botcheck" name="botcheck" type="checkbox" tabIndex={-1} autoComplete="off" />
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-[#3432c7] text-white hover:bg-white hover:text-[#3432c7] border border-[#3432c7] font-display font-bold uppercase tracking-widest py-5 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? 'Sending...' : 'Contact Us'}</button>

                {submitError && (
                  // role="alert" so the failure is announced rather than only
                  // being visible; replaces a blocking alert() dialog.
                  <p role="alert" className="text-sm text-red-600 font-light leading-relaxed">
                    {submitError}
                  </p>
                )}
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
                      alt=""
                      width={40}
                      height={40}
                      className="w-6 h-6 md:w-10 md:h-10 object-contain"
                      referrerPolicy="no-referrer"
                    />
                    +94 (71) 416-6608
                  </Link>
                </div>
                <div className="pt-10 border-t border-brand-900/10"><p className="text-gray-500 font-light leading-relaxed max-w-sm">Based globally. <br /> Operating in EST &amp; GMT timezones to seamlessly integrate with your executive team.</p></div>
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
              <p className="text-gray-600 text-lg font-light leading-relaxed mb-10">Thanks — we&rsquo;ve got your request. We&rsquo;ll send you a detailed audit of your store, along with a Calendly link so you can book a call at a time that suits you.</p>
              <button onClick={() => setShowSuccessModal(false)} className="w-full bg-brand-900 text-white font-display font-bold uppercase tracking-widest py-4 hover:bg-black transition-colors cursor-pointer">Got it</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ContactSection;
