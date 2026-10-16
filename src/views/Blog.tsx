"use client";

import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Calendar, User, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// WordPress excerpts arrive HTML-encoded and are rendered here as text, so
// without decoding the card showed a literal "You&#8217;ve done the hard part."
const decodeEntities = (html?: string) =>
  (html ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&(?:lsquo|rsquo);/g, '’')
    .replace(/&(?:ldquo|rdquo);/g, '"')
    .replace(/&hellip;/g, '…')
    .replace(/&(?:mdash|ndash);/g, '—')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Cards are visible in the server HTML (no JS / reduced motion = complete list).
 * Once JS runs, a card that is still below the fold is hidden and rises in when
 * it scrolls into view; cards already on screen are left alone (no flash).
 */
const Reveal = ({ delay = 0, className, children }: { delay?: number; className?: string; children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'static' | 'waiting' | 'in'>('static');
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      setState('in');
    }, { rootMargin: '0px 0px -10% 0px' });
    // Hidden only from here on, below the fold, so nothing visible ever blinks.
    const raf = requestAnimationFrame(() => setState('waiting'));
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);
  const style: React.CSSProperties =
    state === 'waiting'
      ? { opacity: 0, transform: 'translateY(20px)' }
      : state === 'in'
        ? { opacity: 1, transform: 'none', transition: `opacity 600ms ease ${delay}s, transform 600ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}s` }
        : {};
  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
};

const BlogCard = ({ title, excerpt, date, author, category, image, delay, slug }: any) => (
  <Reveal delay={delay} className="group">
    <Link href={`/blog/${slug}`} className="block">
      <div className="relative aspect-[16/9] overflow-hidden mb-6 border border-brand-900">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transform group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <div className="flex items-center gap-4 mb-4 text-[10px] font-display font-bold uppercase tracking-widest text-gray-500">
        <span className="flex items-center gap-1"><Calendar size={12} /> {date}</span>
        <span className="flex items-center gap-1"><User size={12} /> {author}</span>
        <span className="flex items-center gap-1 text-[#3432c7]"><Tag size={12} /> {category}</span>
      </div>
      <h2 className="font-display text-2xl font-bold tracking-[-1px] mb-4 group-hover:text-[#3432c7] transition-colors leading-snug">{title}</h2>
      <p className="text-gray-600 font-light mb-6 line-clamp-2">{excerpt}</p>
      <div className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
        Read More <ArrowRight size={16} />
      </div>
    </Link>
  </Reveal>
);

const Blog = ({ posts }: { posts: any[] }) => {
  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-24">
      <section className="px-6 lg:px-12 max-w-screen-2xl mx-auto mb-12 md:mb-20">
        <div className="max-w-4xl">
          <p className="font-display font-bold text-brand-900/40 uppercase tracking-[0.3em] text-xs mb-6">Unfiltered Insights</p>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-[-1px] mb-8 leading-[1.05]">
            Blog
          </h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl">
            Engineering, design, and conversion strategies for the modern D2C founder.
          </p>
        </div>
      </section>

      <section className="px-6 lg:px-12 max-w-screen-2xl mx-auto">
        <div
          className={`grid gap-12 ${
            posts.length === 1
              ? 'grid-cols-1 max-w-2xl'
              : posts.length === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {posts.map((post, i) => (
            <BlogCard
              key={post.slug}
              title={post.title}
              slug={post.slug}
              excerpt={decodeEntities(post.seo?.metaDesc || post.excerpt)}
              date={new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              author={post.author?.node?.name || 'Dreamy Codes'}
              category={post.categories?.nodes?.[0]?.name || 'Uncategorized'}
              image={post.featuredImage?.node?.sourceUrl || '/default-og.jpg'}
              delay={i * 0.08}
            />
          ))}
        </div>

        {posts.length === 0 && (
          <p className="font-display font-bold uppercase tracking-widest text-sm text-gray-500">
            No entries published yet. Check back soon.
          </p>
        )}
      </section>
    </div>
  );
};

export default Blog;
