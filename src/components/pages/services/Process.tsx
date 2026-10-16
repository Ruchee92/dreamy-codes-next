"use client";
import { useLayoutEffect, useRef } from 'react';
import { gsap, MQ_DESKTOP, MQ_MOBILE, triggerOnce } from '../../home/motion';
import SectionHead from '../../site/SectionHead';
import { STEPS } from './data';

/**
 * How we work, D-070 C3: an indigo band (pg-dark) with 160px outline step
 * numerals that fill once on entry (a solid white layer revealed by clip-path),
 * white titles and soft-white detail lines (D-059 copy). Rules draw, titles rise,
 * bodies fade (kit verbs, PageMotion). Reduced motion / no JS: numerals filled.
 */
const Process = () => {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const fills = Array.from(root.querySelectorAll<HTMLElement>('.sv2-num-f'));
    const mm = gsap.matchMedia(root);
    mm.add(`${MQ_DESKTOP}, ${MQ_MOBILE}`, () => {
      const list = root.querySelector<HTMLElement>('.sv2-steps')!;
      triggerOnce({ trigger: list, start: 'top 75%' }, () => {
        fills.forEach((f, i) => {
          if (f.classList.contains('is-in')) return;
          gsap.fromTo(
            f,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 0.9,
              ease: 'dc',
              delay: i * 0.15,
              onComplete: () => {
                f.classList.add('is-in');
                gsap.set(f, { clearProps: 'clipPath' });
              },
            },
          );
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} className="sv2-process pg-dark" aria-labelledby="sv2-process-title">
      <div className="h-container">
        <SectionHead id="sv2-process-title" title={['How does', 'it work?']} size="l" />
        <ol className="h-grid sv2-steps">
          {STEPS.map((s, i) => (
            <li key={s.number} className="sv2-step">
              <span className="sv2-step-rule" data-draw data-delay={String(i * 0.1)} aria-hidden="true" />
              <span className="sv2-num" aria-hidden="true">
                <span className="sv2-num-o">{s.number}</span>
                <span className="sv2-num-f">{s.number}</span>
              </span>
              <h3 className="h-title sv2-step-title" data-rise data-delay={String(i * 0.1)}>
                <span className="h-line"><span className="h-line-in">{s.title}</span></span>
              </h3>
              <ul className="sv2-step-details" data-fade data-delay={String(i * 0.1)}>
                {s.details.map((d) => (
                  <li key={d} className="h-body">{d}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Process;
