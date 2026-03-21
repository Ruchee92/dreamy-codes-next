"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Minus, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Search, 
  Layout, 
  Code, 
  Rocket,
  HelpCircle,
  Zap,
  TrendingUp,
  ShoppingBag
} from 'lucide-react';
import LogoMarquee from '../components/LogoMarquee';
import Image from 'next/image';
import FinalCTA from '../components/FinalCTA';

const FAQItem = ({ question, answer }: { question: string, answer: string, key?: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left group cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <HelpCircle className="text-brand-600 w-5 h-5 flex-shrink-0" />
          <span className="font-display font-bold text-lg md:text-xl text-brand-900 group-hover:text-brand-600 transition-colors">{question}</span>
        </div>
        <div className="ml-4 flex-shrink-0">
          {isOpen ? <Minus className="text-brand-600" /> : <Plus className="text-brand-900" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-gray-600 font-light leading-relaxed pl-9">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ServiceImage = ({ src, alt, className }: { src: string, alt: string, className?: string }) => {
  const [isLoaded, setIsLoaded] = useState(true);
  return (
    <div className={`relative overflow-hidden ${className} ${isLoaded ? 'bg-transparent' : 'bg-gray-200 animate-pulse'}`}>
      <Image 
        src={src} 
        alt={alt} 
        width={800}
        height={800}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
      />
    </div>
  );
};

const Services = () => {
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const steps = [
    {
      number: "01",
      title: "Strategy",
      description: "We deep dive into your brand, audience, and goals to build a roadmap for growth."
    },
    {
      number: "02",
      title: "Design & Build",
      description: "We engineer a high-converting Shopify storefront tailored to your unique brand identity."
    },
    {
      number: "03",
      title: "Launch & Scale",
      description: "We launch your store and implement optimization tactics to ensure continuous growth."
    }
  ];

  const faqs = [
    {
      question: "How much does Shopify web design and development cost?",
      answer: "Every Shopify project is unique, with pricing typically ranging from $990 to $5,000. The final investment depends on your specific needs, such as the number of custom page templates, the complexity of your tech stack, and any advanced third-party app integrations required to power your e-commerce engine."
    },
    {
      question: "What is the typical timeline for a Shopify project?",
      answer: "Most of our high-performance Shopify builds are completed within a 2 to 4-week window. This timeframe allows us to meticulously engineer your storefront while ensuring we have enough time for collaborative feedback and rigorous quality assurance before your big launch."
    },
    {
      question: "Do you use templates or build custom Shopify themes?",
      answer: "It's a combination of both! We typically engineer a custom design and then meticulously edit the Liquid, CSS, and HTML of a high-performance framework. This hybrid approach ensures your Shopify store is visually unique and conversion-optimized while remaining technically stable and easy to manage."
    },
    {
      question: "How do you optimize the Shopify user experience for conversions?",
      answer: "Our design philosophy is revenue-first. We leverage years of A/B testing data and CRO best practices to ensure every pixel on your Shopify store is placed with the intent of turning visitors into loyal customers. We focus on reducing friction and guiding users seamlessly toward the checkout."
    },
    {
      question: "Will my Shopify store be mobile-friendly?",
      answer: "Mobile is no longer an afterthought. It's the priority. With the majority of e-commerce traffic originating from mobile devices, we engineer every Shopify site to be fully responsive, ensuring a lightning-fast and intuitive shopping experience on any screen size."
    },
    {
      question: "Can I update the store myself after launch?",
      answer: "Absolutely. We build on Shopify specifically because of its intuitive management interface. You'll have full control over your products, content, and imagery. For more advanced layout adjustments or technical updates, our team is always a quick message away."
    },
    {
      question: "Can you help with Shopify copywriting and SEO?",
      answer: "We offer specialized e-commerce copywriting that doesn't just tell your story but also drives search engine visibility. Our content is engineered to rank for relevant keywords while maintaining a high-converting tone that resonates with your audience."
    },
    {
      question: "Do you offer branding and logo design?",
      answer: "We do. A strong brand identity is the foundation of a successful store. We can assist with logo design, color palettes, and comprehensive style guides that ensure your brand looks professional and cohesive across all digital touchpoints."
    },
    {
      question: "Do you provide ongoing Shopify maintenance and support?",
      answer: "We're here for the long haul. Whether you need a one-off technical fix or a monthly maintenance plan to keep your store optimized, we offer flexible support options to ensure your e-commerce engine never stops running."
    },
    {
      question: "Can you set up Google Analytics and tracking pixels?",
      answer: "Data is key to growth. We integrate Google Analytics 4 (GA4) into every build and can assist with setting up Meta pixels, TikTok tracking, and other essential data tools to help you monitor and scale your marketing efforts."
    },
    {
      question: "What is your process for collaborating with clients?",
      answer: "Transparency is our core value. We use a structured onboarding process to capture your vision early on, followed by regular syncs and collaborative tools to ensure you're involved in every step of the engineering process."
    },
    {
      question: "Will my store work on all browsers and devices?",
      answer: "Yes. Our rigorous QA process involves testing your Shopify store across all major browsers and devices. We ensure that whether your customer is on an old iPhone or the latest desktop browser, their experience is flawless."
    }
  ];

  return (
    <div className="bg-[#fcfcfc]">
      {/* Hero Section */}
      <section className="relative bg-grid-pattern pt-32 pb-8 md:pt-40 md:pb-20 min-h-[60vh] flex flex-col justify-center overflow-hidden">
        {/* Floating Tech Particles */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          {[...Array(15)].map((_, i) => {
            const size = Math.random() * 10 + 5; // 5px to 15px
            const startX = Math.random() * 100; // 0% to 100%
            const duration = Math.random() * 10 + 10; // 10s to 20s
            const delay = Math.random() * 5;
            const isEmerald = i % 4 === 0;
            const shapeType = i % 3; // 0: circle, 1: square, 2: plus
            
            return (
              <motion.div
                key={i}
                className={`absolute ${isEmerald ? 'text-emerald-500' : 'text-[#3432c7]'}`}
                style={{
                  left: `${startX}%`,
                  bottom: '-20px',
                  width: size,
                  height: size,
                }}
                animate={{
                  y: ['0vh', '-120vh'],
                  x: [0, Math.random() * 50 - 25, Math.random() * 50 - 25, 0],
                  rotate: [0, 180, 360],
                  opacity: [0, 0.4, 0.4, 0],
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: delay,
                }}
              >
                {shapeType === 0 && <div className="w-full h-full rounded-full border border-current" />}
                {shapeType === 1 && <div className="w-full h-full border border-current" />}
                {shapeType === 2 && (
                  <div className="relative w-full h-full">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-current -translate-y-1/2" />
                    <div className="absolute top-0 left-1/2 w-[1px] h-full bg-current -translate-x-1/2" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
        <div className="absolute top-1/4 right-[10%] w-[500px] h-[500px] bg-gray-200 rounded-full mix-blend-multiply filter blur-[100px] animate-slow-glow -z-10"></div>
        <div className="absolute bottom-0 left-[10%] w-[400px] h-[400px] bg-gray-100 rounded-full mix-blend-multiply filter blur-[80px] animate-slow-glow -z-10" style={{ animationDelay: '4s' }}></div>

        <div className="px-6 lg:px-12 max-w-screen-2xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-brand-900 leading-[0.9] tracking-tighter uppercase mb-8">
                Shopify <br />
                <span className="text-outline">Solutions</span> <br />
                That Scale
              </h1>
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-xl">
                We provide end-to-end e-commerce solutions. From the first line of code to the final checkout optimization, we build systems <span className="text-emerald-500 bg-emerald-50/50 px-1 rounded">designed to generate revenue</span>.
              </p>
              <div className="flex flex-col md:flex-row gap-6">
                <a 
                  href="/#contact" 
                  className="inline-flex items-center justify-between md:gap-4 px-8 py-4 bg-[#3432c7] text-white hover:bg-white hover:text-[#3432c7] border border-[#3432c7] font-display font-bold text-lg uppercase tracking-wider group transition-all duration-300 cursor-pointer whitespace-nowrap"
                >
                  <span>Book Strategy Call</span>
                  <ArrowRight className="transform group-hover:translate-x-2 transition-transform" />
                </a>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <ServiceImage src="https://wp.dreamycodes.com/wp-content/uploads/2026/03/s3.jpg" alt="Shopify Storefront Design Showcase - Mobile Responsive Layout" className="shadow-2xl border border-gray-100" />
                  <ServiceImage src="https://wp.dreamycodes.com/wp-content/uploads/2026/03/s2.jpg" alt="High Converting E-commerce User Experience and Interface Design" className="shadow-2xl border border-gray-100" />
                </div>
                <div className="space-y-4 pt-12">
                  <ServiceImage src="https://wp.dreamycodes.com/wp-content/uploads/2026/03/s1.jpg" alt="Custom Shopify Development for Specialized Brand Growth" className="shadow-2xl border border-gray-100" />
                  <ServiceImage src="https://wp.dreamycodes.com/wp-content/uploads/2026/03/s4.jpg" alt="Strategic E-commerce Roadmap and Brand Scaling Solutions" className="shadow-2xl border border-gray-100" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 md:py-20">
        <div className="px-6 lg:px-12 max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Shopify Design and Development",
                bullets: [
                  "Eye-Catching Shopify Websites: We develop custom, fast-loading storefronts designed to convert visitors into buyers.",
                  "Aesthetics & UX Design: Seamless user experiences combined with premium brand aesthetics.",
                  "Top Conversion Tactics: Proven strategies engineered to ensure your website earns you more sales."
                ],
                image: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/shopify.png",
                hoverImage: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/Shopify-dark.png"
              },
              {
                title: "Conversion Optimization",
                bullets: [
                  "Full-Funnel Optimization: Ensure your e-commerce store is optimized at every step of the customer journey.",
                  "Paid Ad Spend & Web Synergy: Blended expertise to maximize your return on ad spend (ROAS).",
                  "Sales Funnel Scaling: We push the limits of what's possible to increase your overall conversion rates."
                ],
                icon: TrendingUp
              },
              {
                title: "E-Commerce Integrations",
                bullets: [
                  "E-Commerce Retention Engine: Wire up your backend to maximize customer lifetime value (LTV).",
                  "Complex Klaviyo Flows: Automated email marketing strategies to recover carts and drive repeat purchases.",
                  "Subscriptions, Loyalty & ERP: Seamless integration with Recharge, Yotpo, and full ERP synchronization."
                ],
                icon: Zap
              }
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onMouseEnter={() => setHoveredService(i)}
                onMouseLeave={() => setHoveredService(null)}
                className="p-10 border border-brand-900/10 hover:bg-[#3432c7] hover:border-[#3432c7] transition-all duration-500 group bg-brand-900 cursor-pointer"
              >
                <div className="relative w-12 h-12 bg-white/10 text-white flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-[#3432c7] transition-colors overflow-hidden p-2">
                  {service.image ? (
                    <Image 
                      src={hoveredService === i && service.hoverImage ? service.hoverImage : service.image} 
                      alt={`${service.title} - E-commerce Service Icon`} 
                      fill
                      sizes="48px"
                      className="object-contain" 
                    />
                  ) : (
                    service.icon && <service.icon size={24} />
                  )}
                </div>
                <h3 className="font-display text-2xl font-bold uppercase mb-6 leading-tight text-white transition-colors">{service.title}</h3>
                <div className="text-gray-400 font-light leading-relaxed group-hover:text-white/80 transition-colors">
                  <ul className="space-y-4">
                    {service.bullets.map((bullet, bIdx) => {
                      const [heading, ...content] = bullet.split(': ');
                      return (
                        <li key={bIdx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                          <span>
                            <span className="text-white font-medium">{heading}:</span> {content.join(': ')}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How Does It Work Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <p className="font-display font-bold text-brand-600 uppercase text-xs mb-4" style={{ letterSpacing: '0.2rem' }}>Process</p>
              <h2 className="font-display text-4xl md:text-6xl font-bold text-brand-900 uppercase tracking-tighter">How Does It Work?</h2>
            </div>
            <p className="text-gray-500 font-light max-w-sm">
              A streamlined approach to engineering your e-commerce success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-200 bg-white">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="p-12 border-b md:border-b-0 md:border-r border-gray-200 last:border-r-0 group hover:bg-brand-50 transition-colors duration-500"
              >
                <span className="font-display text-6xl font-bold text-gray-100 group-hover:text-brand-900/10 transition-colors block mb-8">{step.number}</span>
                <h3 className="font-display text-2xl font-bold text-brand-900 uppercase mb-4">{step.title}</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-20 px-6 lg:px-12 max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-display text-4xl md:text-6xl font-bold text-brand-900 uppercase tracking-tighter">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <FinalCTA variant="dark" />
    </div>
  );
};

export default Services;
