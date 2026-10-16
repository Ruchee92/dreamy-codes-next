"use client";
import { useRef } from 'react';
import { gsap, initReveals, useHomeMotion } from './motion';
import { OBJECTIONS } from './data';

/**
 * Header of the homepage contact block (D-014): one headline that addresses the
 * visitor, a one-line intro, and the form directly below (ContactSection,
 * variant "home"). The heading drifts in on desktop and settles on the grid edge.
 */
const SignOff = () => {
  const ref = useRef<HTMLElement>(null);

  useHomeMotion(ref, ({ desktop }, root) => {
    initReveals(root);
    const text = root.querySelector<HTMLElement>('[data-drift]');
    if (desktop && text) {
      gsap.fromTo(
        text,
        { x: '6vw' },
        { x: 0, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'top 30%', scrub: 0.6 } },
      );
    }
    return () => {
      if (text) gsap.set(text, { clearProps: 'transform' });
    };
  }, { defer: true });

  return (
    <header ref={ref} className="h-contact-head">
      <h2 id="h-contact-title" className="h-d-l h-contact-title" data-drift data-rise>
        <span className="h-line"><span className="h-line-in">Let’s talk.</span></span>
      </h2>
      <p className="h-lead h-muted h-contact-intro" data-fade>
        Fill out the form below to request a comprehensive consultation or to discuss a new e-commerce build.
      </p>
    </header>
  );
};

/** The four objection answers (R3), as a plain list for the contact panel. */
export const ContactFacts = () => (
  <dl className="cs-home-list cs-home-facts">
    {OBJECTIONS.map((o) => (
      <div key={o.label}>
        <dt>{o.label}</dt>
        <dd>{o.body}</dd>
      </div>
    ))}
  </dl>
);

export default SignOff;
