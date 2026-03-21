"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  MessageSquare,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';
import FinalCTA from '../components/FinalCTA';

const DNAInteraction = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma && e.beta) {
        setMousePos({
          x: Math.max(-1, Math.min(1, e.gamma / 45)),
          y: Math.max(-1, Math.min(1, (e.beta - 45) / 45)),
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const strands = 35;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center opacity-30 md:opacity-50 translate-y-[140px] md:translate-y-0 scale-[0.6] md:scale-100">
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{ perspective: '1200px' }}
      >
        <div
          className="relative w-full h-full flex flex-col items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${mousePos.y * 15}deg) rotateY(${mousePos.x * 15}deg) rotateZ(-15deg)`,
            transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        >
          {Array.from({ length: strands }).map((_, i) => {
            return (
              <div
                key={i}
                className="absolute w-48 md:w-80 h-px flex justify-between items-center"
                style={{
                  top: `calc(50% - 350px + ${(i / strands) * 700}px)`,
                  transformStyle: 'preserve-3d',
                  animation: `dna-spin 8s linear infinite`,
                  animationDelay: `${-i * 0.25}s`
                }}
              >
                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-black"></div>
                <div className="h-full w-full bg-gradient-to-r from-black to-brand-900 opacity-40"></div>
                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-brand-900"></div>
              </div>
            );
          })}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes dna-spin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
      `}} />
    </div>
  );
};

const AboutImage = ({ src, alt, className }: { src: string, alt: string, className?: string }) => {
  const [isLoaded, setIsLoaded] = useState(true);
  // Ensure image URLs use https and the correct wp subdomain
  const secureSrc = src.replace(/^https?:\/\/(wp\.)?dreamycodes\.com/, 'https://wp.dreamycodes.com');

  return (
    <div className={`relative overflow-hidden ${className} ${isLoaded ? 'bg-transparent' : 'bg-gray-200 animate-pulse'}`}>
      <Image
        src={secureSrc}
        alt={alt}
        width={800}
        height={800}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
      />
    </div>
  );
};

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#fcfcfc]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 min-h-[70vh] flex flex-col justify-center overflow-hidden">
        <DNAInteraction />

        <div className="px-6 lg:px-12 max-w-screen-2xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <span className="w-12 h-[1px] bg-brand-900"></span>
                <p className="font-display font-bold text-brand-900 uppercase text-xs" style={{ letterSpacing: '0.2rem' }}>
                  About Dreamy Codes
                </p>
              </div>

              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter mb-10 leading-[0.9]">
                What's In <br />
                <span className="text-outline">Our DNA?</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed max-w-2xl">
                Dreamy Codes is a specialized Shopify engineering collective. We architect <span className="text-emerald-500 bg-emerald-50/50 px-1 rounded">high-performance commerce systems</span> for brands that refuse to settle for "good enough."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <AboutImage src="https://wp.dreamycodes.com/wp-content/uploads/2026/03/s8.jpg" alt="Dreamy Codes Shopify Portfolio - Modern E-commerce Storefront Design" className="shadow-2xl border border-gray-100" />
                  <AboutImage src="https://wp.dreamycodes.com/wp-content/uploads/2026/03/s8-2.jpg" alt="Performance Optimized Shopify Theme Architecture" className="shadow-2xl border border-gray-100" />
                </div>
                <div className="space-y-4 pt-12">
                  <AboutImage src="https://wp.dreamycodes.com/wp-content/uploads/2026/03/s7-1.jpg" alt="Conversion-Centric Shopify UX and UI Design Selection" className="shadow-2xl border border-gray-100" />
                  <AboutImage src="https://wp.dreamycodes.com/wp-content/uploads/2026/03/s8-1.jpg" alt="Scalable E-commerce Infrastructure and Engineering Strategy" className="shadow-2xl border border-gray-100" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Mission Section - High Impact */}
      <section
        className="py-24 md:py-40 text-white relative overflow-hidden bg-[#050505]"
      >
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes radialMove {
            0% { background-position: 0% 0%; }
            20% { background-position: 100% 30%; }
            40% { background-position: 20% 100%; }
            60% { background-position: 100% 80%; }
            80% { background-position: 10% 40%; }
            100% { background-position: 0% 0%; }
          }
        `}} />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, #3d3d3d 0%, transparent 50%)',
            backgroundSize: '250% 250%',
            animation: 'radialMove 25s ease-in-out infinite'
          }}
        ></div>
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-30 pointer-events-none"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full mix-blend-overlay filter blur-[120px] opacity-50 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full mix-blend-overlay filter blur-[120px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-4">
              <p className="font-display font-bold text-gray-400 uppercase text-sm mb-6" style={{ letterSpacing: '0.2rem' }}>Our Mission</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-tight">
                Performance <br />Over Pretty.
              </h2>
            </div>
            <div className="lg:col-span-8">
              <p className="text-2xl md:text-4xl font-light leading-snug text-gray-300">
                <span className="text-white font-bold">Most agencies focus on "pretty" websites. We focus on performance.</span> Our mission is to bridge the gap between aesthetic design and technical performance, ensuring your Shopify store is a <span className="italic text-white bg-[#3432c7] px-2 py-0.5 rounded font-medium">conversion machine</span> that scales as fast as your ambition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 md:py-32 bg-[#fcfcfc] border-t border-gray-100">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <p className="font-display font-bold text-brand-600 uppercase text-xs mb-4" style={{ letterSpacing: '0.2rem' }}>The Collective</p>
              <h2 className="font-display text-4xl md:text-6xl font-bold text-brand-900 uppercase tracking-tighter">Our Team</h2>
            </div>
            <p className="text-gray-500 font-light max-w-sm text-lg">
              A specialized group of Shopify engineers and strategists dedicated to your growth.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Ruchi", role: "Founder & Lead Engineer", image: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/1.jpg" },
              { name: "Sulakshi", role: "Head of Operations", image: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/4-1.jpg" },
              { name: "Asitha", role: "Senior Shopify Developer", image: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/3.jpg" },
              { name: "Lahiru", role: "CRO Specialist", image: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/2.jpg" }
            ].map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/5] overflow-hidden bg-gray-100 mb-6 relative">
                  <Image
                    src={member.image}
                    alt={`${member.name} - ${member.role} at Dreamy Codes Agency`}
                    width={400}
                    height={500}
                    className="w-full h-full object-cover grayscale absolute inset-0 group-hover:scale-105 transition-transform duration-700"
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-150px" }}
                    transition={{ duration: 1.5, delay: i * 0.4 }}
                    className="relative z-10 w-full h-full"
                  >
                    <Image
                      src={member.image}
                      alt={`${member.name} - ${member.role} at Dreamy Codes Agency`}
                      width={400}
                      height={500}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-brand-900/0 group-hover:bg-brand-900/10 transition-colors duration-500 z-20 pointer-events-none"></div>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold uppercase tracking-tight mb-2 group-hover:text-brand-600 transition-colors">{member.name}</h3>
                  <p className="text-gray-500 font-display uppercase tracking-widest text-xs font-bold">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-4">How We Operate</h2>
            <p className="text-gray-500 font-display uppercase tracking-widest text-sm font-bold">The principles that guide our engineering.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Radical Communication */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-12 border border-gray-200 hover:bg-[#3432c7] hover:border-[#3432c7] transition-colors duration-500 group bg-[#fcfcfc] cursor-pointer"
            >
              <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mb-8 group-hover:bg-white transition-colors duration-500">
                <MessageSquare className="text-brand-900 group-hover:text-[#3432c7] transition-colors duration-500" size={32} />
              </div>
              <h3 className="font-display text-3xl font-bold uppercase mb-6 tracking-tight group-hover:text-white transition-colors duration-500">Radical Communication</h3>
              <p className="text-gray-600 text-lg font-light leading-relaxed group-hover:text-white/90 transition-colors duration-500">
                Consistent, timely, and thorough dialogue is our baseline. We foster personalized collaboration to ensure your project's success. No black boxes, just clear updates.
              </p>
            </motion.div>

            {/* Total Ownership */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-12 border border-gray-200 hover:bg-[#3432c7] hover:border-[#3432c7] transition-colors duration-500 group bg-[#fcfcfc] cursor-pointer"
            >
              <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mb-8 group-hover:bg-white transition-colors duration-500">
                <ShieldCheck className="text-brand-900 group-hover:text-[#3432c7] transition-colors duration-500" size={32} />
              </div>
              <h3 className="font-display text-3xl font-bold uppercase mb-6 tracking-tight group-hover:text-white transition-colors duration-500">Total Ownership</h3>
              <p className="text-gray-600 text-lg font-light leading-relaxed group-hover:text-white/90 transition-colors duration-500">
                We look beyond the brief to solve root issues. By owning challenges end-to-end, we deliver solutions with deep context. Your success is our responsibility.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <FinalCTA variant="dark" />
    </div>
  );
};

export default About;