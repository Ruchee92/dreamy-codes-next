import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FinalCTAProps {
  variant?: 'light' | 'dark';
  title?: React.ReactNode;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ variant = 'light', title }) => {
  const isLight = variant === 'light';
  const defaultTitle = <>DON'T LEAVE CONVERSIONS <br /> ON THE TABLE!</>;
  
  return (
    <section className="pt-4 pb-16 md:pt-8 md:pb-32 px-6 lg:px-12 max-w-screen-2xl mx-auto">
      <div className={`${isLight ? 'bg-white border-gray-200' : 'bg-brand-900 border-brand-900'} p-8 md:p-24 border relative overflow-hidden`}>
        <div className={`absolute inset-0 ${isLight ? 'bg-grid-pattern' : 'bg-grid-pattern-dark'} z-0 [mask-image:radial-gradient(circle_at_bottom_right,transparent_20%,black_70%)]`}></div>
        <div className={`absolute -right-20 -bottom-20 text-[20rem] font-display font-bold ${isLight ? 'text-brand-900/[0.03]' : 'text-white/[0.05]'} leading-none pointer-events-none z-[1]`}>DC</div>
        <div className="relative z-10 max-w-3xl">
          <h2 className={`font-display text-4xl md:text-7xl font-bold uppercase tracking-tighter mb-8 ${isLight ? 'text-brand-900' : 'text-white'}`}>
            {title || defaultTitle}
          </h2>
          <p className={`${isLight ? 'text-gray-600' : 'text-gray-400'} text-lg md:text-xl font-light leading-relaxed mb-12`}>
            Let's discuss how our Shopify engineering expertise can help you reach your next revenue milestone.
          </p>
          <a 
            href="/#contact" 
            className="inline-flex items-center justify-center gap-4 bg-[#3432c7] text-white px-8 md:px-10 py-5 font-display font-bold uppercase tracking-widest hover:bg-white hover:text-[#3432c7] border border-[#3432c7] transition-all duration-300 group whitespace-nowrap"
          >
            <span>Let's Talk</span>
            <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
