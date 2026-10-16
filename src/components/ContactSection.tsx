"use client";
import React, { useCallback, useId, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import ContactSuccess from './ContactSuccess';
import { storeDomain } from '../data/contactNext';

/**
 * The contact block that closes the homepage, and the whole of /contact-us.
 * Both routes render this same component so the form, the copy and the success
 * modal cannot drift apart.
 */
const ContactSection = ({
  headingLevel = 'h2',
  title = "Don't leave conversions on the table!",
  variant = 'default',
  aside,
  onStatusChange,
  submitNote,
  promiseNote = true,
}: {
  headingLevel?: 'h1' | 'h2';
  title?: string;
  /**
   * `home`: the homepage's own layout (labelled fields, one calm side panel,
   * no rules). The homepage renders the heading and the #contact section around
   * it, so this variant has neither. `default` (/contact-us) is unchanged.
   */
  variant?: 'default' | 'home';
  /** Home variant only: extra content at the end of the side panel. */
  aside?: React.ReactNode;
  /** Optional observer of the submit lifecycle (the /contact-us progress steps). Renders nothing. */
  onStatusChange?: (status: 'sending' | 'success' | 'error') => void;
  /** Home variant only: a line directly above the submit row (/contact-us price + timezones). Not rendered when unset. */
  submitNote?: React.ReactNode;
  /** Home variant only: the promise line under submit. /contact-us turns it off (its panel says the same, D-059). */
  promiseNote?: boolean;
}) => {
  // The homepage keeps the pitch headline, since this block has to earn
  // attention at the end of a long scroll. On /contact-us the intro above
  // already made the pitch, so that route passes a plain title instead.
  const Heading = headingLevel;
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // Focus goes back to the form's submit button when the success dialog closes.
  const submitRef = useRef<HTMLButtonElement | null>(null);
  const closeSuccess = useCallback(() => setShowSuccessModal(false), []);
  const [sentStore, setSentStore] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const uid = useId();
  // Home variant only: per-field error text (W-03). Empty string = valid.
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    onStatusChange?.('sending');
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
        onStatusChange?.('success');
        // GA4 lead event (mark "generate_lead" as a key event in GA4). gtag only exists on
        // production (layout.tsx), so this is a no-op locally. No form values are sent.
        (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'generate_lead', {
          form_location: window.location.pathname,
        });
        submitRef.current = (e.target as HTMLFormElement).querySelector<HTMLButtonElement>('button[type="submit"]');
        setSentStore(storeDomain(String(formData.get('url') ?? '')));
        setShowSuccessModal(true);
        (e.target as HTMLFormElement).reset();
      } else {
        onStatusChange?.('error');
        setSubmitError(
          "We couldn't send that just now. Please try again, or email hello@dreamycodes.com."
        );
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      onStatusChange?.('error');
      setSubmitError(
        "That didn't reach us. Check your connection and try again, or email hello@dreamycodes.com."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const modal = <ContactSuccess open={showSuccessModal} onClose={closeSuccess} returnFocus={submitRef} store={sentStore} />;

  if (variant === 'home') {
    const field = (name: string) => `${uid}-${name}`;
    type Control = HTMLInputElement | HTMLTextAreaElement;
    const errorFor = (el: Control) => {
      if (el.validity.valid) return '';
      if (el.name === 'name') return 'Please enter your name';
      if (el.name === 'email') return el.validity.valueMissing ? 'Please enter your email address' : 'Please enter a valid email address';
      if (el.name === 'message') return 'Tell us a little about your store';
      return 'Please check this field';
    };
    const recheck = (el: Control) => setFieldErrors((prev) => ({ ...prev, [el.name]: errorFor(el) }));
    // Our own validation (noValidate): every invalid field gets its message at
    // once, focus goes to the first one, and only a valid form reaches the
    // shared submit handler.
    const onHomeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      const controls = Array.from(e.currentTarget.querySelectorAll<Control>('input[name]:not([name="botcheck"]), textarea[name]'));
      const next: Record<string, string> = {};
      controls.forEach((c) => (next[c.name] = errorFor(c)));
      setFieldErrors(next);
      const first = controls.find((c) => !c.validity.valid);
      if (first) {
        e.preventDefault();
        first.focus();
        return;
      }
      void handleFormSubmit(e);
    };
    const a11y = (name: string) => ({
      'aria-invalid': fieldErrors[name] ? true : undefined,
      'aria-describedby': fieldErrors[name] ? field(`${name}-err`) : undefined,
      onBlur: (e: React.FocusEvent<Control>) => {
        if (e.target.value || fieldErrors[name]) recheck(e.target);
      },
      onChange: (e: React.ChangeEvent<Control>) => {
        if (fieldErrors[name]) recheck(e.target);
      },
    });
    const errorText = (name: string) =>
      fieldErrors[name] ? (
        <p id={field(`${name}-err`)} className="cs-home-err">
          {fieldErrors[name]}
        </p>
      ) : null;
    return (
      <>
        <div className="cs-home">
          <form className="cs-home-form" onSubmit={onHomeSubmit} noValidate>
            <div className="cs-home-pair">
              <div className="cs-home-field">
                <label htmlFor={field('name')}>Your name <span aria-hidden="true">*</span></label>
                <input id={field('name')} name="name" type="text" autoComplete="name" placeholder="e.g. Sarah Johnson" required {...a11y('name')} />
                {errorText('name')}
              </div>
              <div className="cs-home-field">
                <label htmlFor={field('email')}>Email address <span aria-hidden="true">*</span></label>
                <input id={field('email')} name="email" type="email" autoComplete="email" placeholder="e.g. sarah@yourbrand.com" required {...a11y('email')} />
                {errorText('email')}
              </div>
            </div>
            <div className="cs-home-field">
              <label htmlFor={field('url')}>Store URL <span className="cs-home-opt">(optional)</span></label>
              <input id={field('url')} name="url" type="text" inputMode="url" autoComplete="url" placeholder="e.g. yourbrand.com" />
            </div>
            <div className="cs-home-field">
              <label htmlFor={field('message')}>What do you need help with? <span aria-hidden="true">*</span></label>
              <textarea id={field('message')} name="message" rows={4} placeholder="e.g. Good traffic, but sales are low. We want a redesign." required {...a11y('message')} />
              {errorText('message')}
            </div>
            {/* Honeypot, as in the default layout. */}
            <div className="absolute w-px h-px -left-[9999px] overflow-hidden" aria-hidden="true">
              <label htmlFor="botcheck">Leave this field empty</label>
              <input id="botcheck" name="botcheck" type="checkbox" tabIndex={-1} autoComplete="off" />
            </div>
            {submitNote}
            <div className="cs-home-submit">
              <button type="submit" disabled={isSubmitting} className="cs-home-btn">
                <span>{isSubmitting ? 'Sending...' : 'Book a free strategy call'}</span>
                <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" />
              </button>
              {promiseNote && (
                <p className="cs-home-note">
                  We&rsquo;ll send a detailed audit of your store with a Calendly link to book your call.
                </p>
              )}
            </div>
            {submitError && (
              <p role="alert" className="cs-home-error">
                {submitError}
              </p>
            )}
          </form>

          <aside className="cs-home-panel" aria-labelledby={field('direct')}>
            <h3 id={field('direct')} className="cs-home-panel-title">Direct contact</h3>
            <dl className="cs-home-list">
              <div>
                <dt>Email</dt>
                <dd>
                  <a href="mailto:hello@dreamycodes.com" target="_blank" rel="noopener noreferrer">hello@dreamycodes.com</a>
                </dd>
              </div>
              <div>
                <dt>WhatsApp</dt>
                <dd>
                  <Link href="https://api.whatsapp.com/send?phone=94714166608" target="_blank" rel="noopener noreferrer">
                    +94 (71) 416-6608
                  </Link>
                </dd>
              </div>
            </dl>
            {aside}
          </aside>
        </div>
        {modal}
      </>
    );
  }

  return (
    <>
      <section id="contact" className="pt-10 pb-20 md:pt-12 md:pb-20 border-b border-brand-900 bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 border border-brand-900">
            <div className="px-6 py-12 md:p-20 flex flex-col justify-center border-r lg:border-r border-brand-900 border-b lg:border-b-0 bg-[#fcfcfc]">
              <Heading className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-4">{title}</Heading>
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

                <button type="submit" disabled={isSubmitting} className="w-full bg-[#3432c7] text-white hover:bg-white hover:text-[#3432c7] border border-[#3432c7] font-display font-bold uppercase tracking-widest py-5 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? 'Sending...' : 'Book A Free Strategy Call'}</button>

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
                <div className="pt-10 border-t border-brand-900/10"><p className="text-gray-500 font-light leading-relaxed max-w-sm">We work in EST &amp; GMT timezones.</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {modal}
    </>
  );
};

export default ContactSection;
