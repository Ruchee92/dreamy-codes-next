"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import FinalCTA from '../components/FinalCTA';

// 1. Added TypeScript Interfaces to define the data structures
interface Stat {
  value: string;
  label: string;
}

interface TableRow {
  challenge: string;
  result: string;
}

interface TableData {
  data: TableRow[];
}

interface CaseStudyItemProps {
  number: string;
  title: string;
  description: string;
  stats: Stat[];
  category: string;
  table?: TableData;
  link: string;
  imageSrc: string;
}

// 2. Applied the interface to the component props instead of using 'any'
const CaseStudyItem = ({ number, title, description, stats, category, table, link, imageSrc }: CaseStudyItemProps) => {
  const [isLoaded, setIsLoaded] = useState(true);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-brand-900 group bg-white overflow-hidden mb-12">
      <a href={link} target="_blank" rel="noopener noreferrer" className="bg-brand-50 relative min-h-[300px] md:min-h-[400px] flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-brand-900 block">
        <div className={`absolute inset-0 overflow-hidden ${isLoaded ? 'bg-transparent' : 'bg-gray-200 animate-pulse'}`}>
          <Image 
            src={imageSrc} 
            alt={`${title} - ${category} Successful Shopify Optimization`} 
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            onLoad={() => setIsLoaded(true)}
            className={`object-cover transform group-hover:scale-105 transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
          />
        </div>
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10 flex justify-between items-start w-[calc(100%-2rem)] md:w-[calc(100%-4rem)]">
          <div className="font-display text-3xl md:text-5xl font-bold text-white">{number}</div>
          <div className="text-white hover:scale-110 transition-transform">
            <ArrowUpRight className="w-8 h-8 md:w-12 md:h-12" strokeWidth={1} />
          </div>
        </div>
      </a>
      
      <div className="p-6 md:p-16 flex flex-col md:justify-center">
        <h4 className="font-display text-2xl md:text-4xl font-bold mb-4 md:mb-6 leading-tight">{title}</h4>
        <p className="text-gray-600 mb-6 md:mb-10 text-base md:text-lg leading-relaxed font-light">{description}</p>
        
        {table && (
          <div className="mb-8 md:mb-10">
            <div className="grid grid-cols-2 font-display uppercase tracking-widest text-xs font-bold border-b border-brand-900/10">
              <div className="p-3">Challenges</div>
              <div className="p-3">Results</div>
            </div>
            <div className="space-y-0">
              {/* 3. Added explicit types to the row and index */}
              {table.data.map((row: TableRow, i: number) => (
                <div key={i} className="grid grid-cols-2 text-sm border-b border-brand-900/10 last:border-b-0">
                  <div className="p-3 text-gray-700">{row.challenge}</div>
                  <div className="p-3 text-gray-700">{row.result}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 md:gap-8">
          {/* 4. Added explicit types to the stat and index */}
          {stats.map((stat: Stat, i: number) => (
            <div key={i}>
              <p className="font-display text-3xl md:text-4xl font-bold mb-1">{stat.value}</p>
              <p className="text-[10px] md:text-xs uppercase tracking-widest text-gray-500 font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CaseStudies = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const caseStudies = [
    {
      number: "01",
      title: "CRO-Optimized Shopify store for The Flake Homestead",
      description: "A growing homestead lifestyle brand needed an e-commerce store that clearly presents its from-scratch cookbooks and natural living products while turning a large social media audience into loyal customers.",
      category: "Handcrafted Goods",
      stats: [
        { value: "175%", label: "Sales Growth" },
        { value: "6%+", label: "Conversion Rate" }
      ],
      table: {
        data: [
          { challenge: "Social traffic not converting", result: "Optimized product purchase flow" },
          { challenge: "Unclear product organization", result: "Structured collections and bundles" },
          { challenge: "Limited trust signals", result: "Added reviews and credibility" }
        ]
      },
      link: "https://theflakehomestead.com/",
      imageSrc: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/PR1-1.jpg"
    },
    {
      number: "02",
      title: "Conversion-Focused Website for Mother of Macros Café",
      description: "A popular healthy meal prep company needed a website that clearly showcases its macro-balanced meals, simplifies online ordering, and helps busy customers choose nutritious meals quickly.",
      category: "Meal Prep",
      stats: [
        { value: "190%", label: "Increase in Orders" },
        { value: "5.6%", label: "Conversion Rate" }
      ],
      table: {
        data: [
          { challenge: "Confusing meal plan choices", result: "Clear meal comparison layout" },
          { challenge: "Customers unclear about meals", result: "Visual meal pack presentation" },
          { challenge: "Friction during ordering", result: "Simplified ordering navigation" }
        ]
      },
      link: "https://motherofmacroscafe.com/",
      imageSrc: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/PR2.jpg"
    },
    {
      number: "03",
      title: "High-Performing Subscription Store for Succly",
      description: "A subscription-based plant brand needed a storefront that clearly explains its monthly succulent boxes while encouraging customers to start or manage their plant subscription easily.",
      category: "Subscription Wellness",
      stats: [
        { value: "3.2×", label: "Subscription Growth" },
        { value: "4%", label: "Conversion Rate" }
      ],
      table: {
        data: [
          { challenge: "Subscription value unclear", result: "Clear subscription value messaging" },
          { challenge: "Complicated subscription selection", result: "Streamlined subscription purchase flow" },
          { challenge: "Weak plan differentiation", result: "Structured subscription plan layout" }
        ]
      },
      link: "https://succly.com/",
      imageSrc: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/PR3.jpg"
    },
    {
      number: "04",
      title: "Premium Shopify Store for For The Love of Golf",
      description: "A specialty golf retailer needed a modern online store that showcases its curated selection of stylish women’s golf apparel and accessories while improving product discovery and shopping experience.",
      category: "Golf Lifestyle",
      stats: [
        { value: "250%", label: "Revenue Growth" },
        { value: "4.9%", label: "Conversion Rate" }
      ],
      table: {
        data: [
          { challenge: "Outdated website design", result: "Modern premium Shopify layout" },
          { challenge: "Difficult product discovery", result: "Organized collections and filters" },
          { challenge: "Weak brand storytelling", result: "Lifestyle driven brand sections" }
        ]
      },
      link: "https://www.fortheloveofgolfnaples.com/",
      imageSrc: "https://wp.dreamycodes.com/wp-content/uploads/2026/03/PR4.jpg"
    }
  ];

  return (
    <div className="pt-32">
      <section className="px-6 lg:px-12 max-w-screen-2xl mx-auto mb-20">
        <div className="max-w-4xl">
          <p className="font-display font-bold text-brand-900/40 uppercase text-xs mb-6" style={{ letterSpacing: '0.2rem' }}>Success Stories</p>
          <h1 className="font-display text-5xl md:text-8xl font-bold uppercase tracking-tighter mb-8 leading-[0.9]">
            Case <span className="text-brand-600">Studies</span>
          </h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl">
            Deep dives into how we've helped brands solve complex technical challenges and achieve <span className="text-emerald-500 bg-emerald-50/50 px-1 rounded">record-breaking growth</span>.
          </p>
        </div>
      </section>

      <section className="px-6 lg:px-12 max-w-screen-2xl mx-auto">
        {caseStudies.map((cs, i) => (
          <CaseStudyItem 
            key={i} 
            number={cs.number}
            title={cs.title}
            description={cs.description}
            stats={cs.stats}
            category={cs.category}
            table={cs.table}
            link={cs.link}
            imageSrc={cs.imageSrc}
          />
        ))}
      </section>

      <FinalCTA 
        variant="light" 
        title={<>READY TO WRITE YOUR <br /> SUCCESS STORY?</>}
      />
    </div>
  );
};

export default CaseStudies;