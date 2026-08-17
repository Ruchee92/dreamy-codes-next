"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { serviceFaqs as faqs } from '@/data/serviceFaqs';
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
import FloatingParticles from '../components/FloatingParticles';

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


  return (
    <div className="bg-[#fcfcfc]">
      {/* Hero Section */}
      <section className="relative bg-grid-pattern pt-32 pb-8 md:pt-40 md:pb-20 min-h-[60vh] flex flex-col justify-center overflow-hidden">
        <FloatingParticles />
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
                We provide end-to-end e-commerce solutions. From the first line of code to the final checkout optimization, we build systems <span className="text-[#3432c7] bg-[#3432c7]/10 px-1 rounded">designed to generate revenue</span>.
              </p>
              <div className="flex flex-col md:flex-row gap-6">
                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-between md:gap-4 px-8 py-4 bg-[#3432c7] text-white hover:bg-white hover:text-[#3432c7] border border-[#3432c7] font-display font-bold text-lg uppercase tracking-wider group transition-all duration-300 cursor-pointer whitespace-nowrap"
                >
                  <span>Book Strategy Call</span>
                  <ArrowRight className="transform group-hover:translate-x-2 transition-transform" />
                </Link>
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
                <h2 className="font-display text-2xl font-bold uppercase mb-6 leading-tight text-white transition-colors">{service.title}</h2>
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
