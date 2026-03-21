"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import FinalCTA from '../components/FinalCTA';


const PortfolioItem = ({ title, category, imageSrc, link }: { title: any, category: any, imageSrc: any, link: any }) => {
const [isLoaded, setIsLoaded] = useState(true);
  return (
    <motion.a 
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group cursor-pointer block"
    >
      <div className={`aspect-[4/5] mb-5 overflow-hidden relative border border-black shadow-sm ${isLoaded ? 'bg-transparent' : 'bg-gray-200 animate-pulse'}`}>
        <Image 
          src={imageSrc} 
          alt={`${title} - E-commerce Development Portfolio Item`} 
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          onLoad={() => setIsLoaded(true)}
          className={`absolute inset-0 object-cover transform group-hover:scale-105 transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
        />
        <div className="absolute top-5 right-5 z-10">
          <div className="text-white drop-shadow-lg transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">
            <ArrowUpRight size={32} strokeWidth={1.0} />
          </div>
        </div>
        <div className="absolute bottom-5 left-5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-[10px] font-display tracking-[0.2em] uppercase font-bold bg-black/50 px-2 py-1">
            {category}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 px-1">
        <h4 className="font-display font-bold text-xl text-gray-900 leading-[1.2] group-hover:text-brand-600 transition-colors duration-300">
          {title}
        </h4>
      </div>
    </motion.a>
  );
};

const OurWork = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const projects = [
    { title: "CRO Optimized Store For Natural Hair Product", category: "Theme Dev & CRO", imageSrc: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/P1-9.jpg", link: "https://adovz.com/" },
    { title: "Modern Shopify Store Redesign For Snack Brand", category: "Full Site Redesign", imageSrc: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/p6-3.jpg", link: "https://flowstastytreats.com/" },
    { title: "Subscription Store Design With 300% Sales Growth", category: "Subscription Store Design", imageSrc: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/P3-11.jpg", link: "https://succly.com/" },
    { title: "High-Converting Shopify Revamp For Barber Brand", category: "Store Revamp & CRO", imageSrc: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/p7-1.jpg", link: "https://modernbarbersupply.com/" },
    { title: "Luxury Watch Shopify Store With Advanced Filtering", category: "Custom Dev & UX", imageSrc: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/P4-5.jpg", link: "https://newyorkwatchoutlet.com/" },
    { title: "High Converting Redesign With 175% Sales Growth", category: "Store Redesign & CRO", imageSrc: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/P5-3.jpg", link: "https://andaliaheadspa.com/" },
    { title: "Premium Lifestyle Store for The Flake Homestead", category: "Full Build", imageSrc: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/P1-10.jpg", link: "https://theflakehomestead.com/" },
    { title: "Mother of Macros Café Ordering System", category: "Custom App Dev", imageSrc: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/P2-4.jpg", link: "https://motherofmacroscafe.com/" },
    { title: "For The Love of Golf Premium Storefront", category: "UI/UX Design", imageSrc: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/P3-12.jpg", link: "https://www.fortheloveofgolfnaples.com/" }
  ];

  return (
    <div className="pt-32">
      <section className="px-6 lg:px-12 max-w-screen-2xl mx-auto mb-20">
        <div className="max-w-4xl">
          <p className="font-display font-bold text-brand-900/40 uppercase text-xs mb-6" style={{ letterSpacing: '0.2rem' }}>Portfolio</p>
          <h1 className="font-display text-5xl md:text-8xl font-bold uppercase tracking-tighter mb-8 leading-[0.9]">
            Our <span className="text-brand-600">Work</span>
          </h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl">
            A curated selection of <span className="text-emerald-500 bg-emerald-50/50 px-1 rounded">high-performance Shopify stores</span> we've engineered for growth.
          </p>
        </div>
      </section>

      <section className="px-6 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {projects.map((project, i) => (
            <PortfolioItem 
              key={i} 
              title={project.title}
              category={project.category}
              imageSrc={project.imageSrc}
              link={project.link}
            />
          ))}
        </div>
      </section>

      <section className="px-6 lg:px-12 max-w-screen-2xl mx-auto mt-32 mb-32">
        <div className="mb-16">
          <p className="font-display font-bold text-brand-900/40 uppercase text-xs mb-4" style={{ letterSpacing: '0.2rem' }}>Client Index</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter">
            More Brands <span className="text-brand-600">We've Scaled</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-t border-l border-black">
          {[
            { title: "Urban Abseiler", logo: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/UA_logo_rectangular_sm-1.png", link: "https://urbanabseiler.com.au/" },
            { title: "Virginskin", logo: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/Logo-new_e99cb488-5a32-47f5-8bc2-a2992ad35340.png", link: "https://virginskinbeauty.com/" },
            { title: "ShaggyChic", logo: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/Main-Logo_4dd4af09-4841-43a9-b338-56aebfa08329.png", link: "https://shaggychic.com/" },
            { title: "Innovative Drinks", logo: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/ID-Logo_f4b38cee-9a86-407d-8fcb-a21f5caba1bc_500x126-2.png", link: "https://innovativedrinks.de/" },
            { title: "7Seeds", logo: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/logo-1.png", link: "https://7seeds.ca/" },
            { title: "Halal Beats", logo: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/3000x3000-vector-packageArtboard-1-copy-5-1.png2-2-1.png", link: "https://www.halalbeats.com/" },
            { title: "VoodooSpirit Coffee", logo: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/VDC_Stacked_Skull_VDS_DBLESHT_1C.png2_170x.png", link: "https://voodoospiritcoffee.com/" },
            { title: "SignatureSigns", logo: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/1_fa8b36ca-8cd9-479b-838b-724b7dd125f2.png", link: "https://www.signaturesynes.com/" },
            { title: "PeoBeo", logo: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/Emblena_neagra_-_Format_PNG.png", link: "https://www.peobeo.com/" },
            { title: "AllStar Terminals", logo: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/Logo-new.png", link: "https://allstarterminals.com/" },
            { title: "Griddle Guard", logo: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/GriddleGuardLogo_04140ca1-e508-4f0d-817c-1e3085ad34c9_200x-1.png", link: "https://griddleguard.com/" },
            { title: "Dimshade Co", logo: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/DIM_SHADE_LOGO.png", link: "https://dimshadeco.com/" }
          ].map((brand, i) => (
            <motion.a
              key={i}
              href={brand.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group border-r border-b border-black p-6 md:p-10 flex flex-col items-center justify-center text-center hover:bg-brand-50 transition-all duration-500 aspect-square md:aspect-auto md:h-64 relative"
            >
              <div className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-300 group-hover:text-brand-600 transition-colors duration-300">
                <ArrowUpRight className="w-[18px] h-[18px] md:w-5 md:h-5" strokeWidth={1.5} />
              </div>
              <div className="relative h-12 md:h-20 w-full flex items-center justify-center mb-4 md:mb-6 transition-all duration-500">
                <Image 
                  src={brand.logo} 
                  alt={`${brand.title} Brand Logo - Dreamy Codes Client`} 
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-contain opacity-100 group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <h4 className="font-display font-bold text-[9px] md:text-xs uppercase tracking-[0.15em] md:tracking-[0.2em] text-gray-400 group-hover:text-brand-900 transition-colors duration-500 px-2 break-words w-full">
                {brand.title}
              </h4>
            </motion.a>
          ))}
        </div>
      </section>

      <FinalCTA variant="light" />
    </div>
  );
};

export default OurWork;
