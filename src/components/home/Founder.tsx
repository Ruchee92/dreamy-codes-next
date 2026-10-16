"use client";
import { useRef } from 'react';
import Image from 'next/image';
import { MessageSquare, ShieldCheck, Zap, type LucideIcon } from 'lucide-react';
import { SecondaryButton } from './Buttons';
import { FOUNDER_IMAGE, VALUES } from './data';
import { gsap, SplitText, initReveals, triggerOnce, useHomeMotion } from './motion';

// D-046: the original site's value icons, one per value, keyed by name.
const VALUE_ICONS: Record<string, LucideIcon> = { Evolve: Zap, Communicate: MessageSquare, Ownership: ShieldCheck };

/**
 * Founder spread (D-030/D-036): a portrait that opens out of an inset frame with
 * a role caption, the two-sentence statement as the section's display
 * heading (muted first sentence, ink second), and three quiet values.
 */
const Founder = () => {
  const ref = useRef<HTMLElement>(null);

  useHomeMotion(ref, ({ desktop }, root) => {
    initReveals(root);

    const portrait = root.querySelector<HTMLElement>('[data-inset]');
    const img = portrait?.querySelector('img') ?? null;
    if (portrait) {
      if (desktop) {
        const scrollTrigger = { trigger: portrait, start: 'top 85%', end: 'top 35%', scrub: 0.6 };
        gsap.fromTo(portrait, { clipPath: 'inset(10% 10% 10% 10%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger });
        if (img) gsap.fromTo(img, { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger });
      } else {
        triggerOnce({ trigger: portrait, start: 'top 80%' }, () => {
          gsap.fromTo(portrait, { clipPath: 'inset(10% 10% 10% 10%)' }, {
            clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'dc',
            onComplete: () => { portrait.classList.add('is-in'); gsap.set(portrait, { clearProps: 'clipPath' }); },
          });
          if (img) gsap.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1, ease: 'dc', onComplete: () => { gsap.set(img, { clearProps: 'transform' }); } });
        });
      }
    }

    // The statement: line masks that follow the real wrap, re-split if it reflows.
    const statement = root.querySelector<HTMLElement>('[data-split]');
    let split: SplitText | null = null;
    if (statement) {
      let revealed = false;
      split = SplitText.create(statement, {
        type: 'lines',
        mask: 'lines',
        maskClass: 'h-smask',
        autoSplit: true,
        onSplit: (self) => {
          if (!revealed) gsap.set(self.lines, { yPercent: 105 });
          statement.classList.add('is-split');
        },
      });
      triggerOnce({ trigger: statement, start: 'top 82%' }, () => {
        revealed = true;
        gsap.fromTo(split!.lines, { yPercent: 105 }, {
          yPercent: 0, duration: 0.9, ease: 'dc', stagger: 0.08,
          onComplete: () => statement.classList.add('is-in'),
        });
      });
    }

    return () => {
      split?.revert();
      if (portrait) gsap.set([portrait, img], { clearProps: 'clipPath,transform' });
    };
  }, { defer: true });

  return (
    <section ref={ref} className="h-founder" aria-labelledby="h-founder-title">
      <div className="h-container h-grid">
        {/* Below 1024 this wrapper dissolves so the portrait and its caption can be
            ordered around the statement and lede (D-021). */}
        <figure className="h-founder-media">
          <div className="h-portrait" data-inset>
            <Image
              src={FOUNDER_IMAGE}
              alt="Ruchi, Founder and Lead Engineer at Dreamy Codes"
              width={1086}
              height={1448}
              sizes="(min-width: 1536px) 470px, (min-width: 1024px) 30vw, 300px"
              className="h-portrait-img"
            />
          </div>
          <figcaption className="h-meta h-founder-cap">Ruchi — Founder &amp; Lead Engineer</figcaption>
        </figure>

        <div className="h-founder-copy">
          <div className="h-founder-top">
            <h2 id="h-founder-title" className="h-founder-title" data-split>
              {/* Two sentence blocks, no <br>: SplitText treats every <br> as a forced
                  break, even one hidden by CSS, which orphaned words on phones. */}
              <span className="h-sline h-sline--muted">We don’t just make stores look better.</span>{' '}
              <span className="h-sline">
                <span className="h-nowrap">We engineer</span> better ways for customers to buy.
              </span>
            </h2>
            <p className="h-lead h-muted h-founder-lede" data-fade>
              Dreamy Codes exists to help founders turn Shopify stores into businesses that grow.
            </p>
          </div>

          <div className="h-founder-bottom">
            <ul className="h-values" tabIndex={0} aria-label="Our values">
              {VALUES.map((v) => {
                const Icon = VALUE_ICONS[v.name];
                return (
                <li key={v.name} className="h-value">
                  {Icon && (
                    <span className="h-value-icon" aria-hidden="true">
                      <Icon size={20} strokeWidth={1.75} />
                    </span>
                  )}
                  <p className="h-value-name">{v.name}</p>
                  <p className="h-value-body">{v.body}</p>
                </li>
                );
              })}
            </ul>
            <div className="h-founder-cta">
              <SecondaryButton href="/about">
                <span className="h-lab-long">Read more about Dreamy Codes</span>
                <span className="h-lab-short">About Dreamy Codes</span>
              </SecondaryButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founder;
