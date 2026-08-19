"use client";

import React from 'react';
import { motion } from 'motion/react';
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

const BlogCard = ({ title, excerpt, date, author, category, image, delay, slug }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="group"
  >
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
      <h2 className="font-display text-2xl font-bold uppercase mb-4 group-hover:text-[#3432c7] transition-colors">{title}</h2>
      <p className="text-gray-600 font-light mb-6 line-clamp-2">{excerpt}</p>
      <div className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
        Read More <ArrowRight size={16} />
      </div>
    </Link>
  </motion.div>
);

const Blog = ({ posts }: { posts: any[] }) => {
  return (
    <div className="pt-24 md:pt-32 pb-16 md:pb-24">
      <section className="px-6 lg:px-12 max-w-screen-2xl mx-auto mb-12 md:mb-20">
        <div className="max-w-4xl">
          <p className="font-display font-bold text-brand-900/40 uppercase tracking-[0.3em] text-xs mb-6">Unfiltered Insights</p>
          <h1 className="font-display text-5xl md:text-8xl font-bold uppercase tracking-tighter mb-8 leading-[0.9]">
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
              excerpt={decodeEntities(post.excerpt)}
              date={new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              author={post.author?.node?.name || 'Dreamy Codes'}
              category={post.categories?.nodes?.[0]?.name || 'Uncategorized'}
              image={post.featuredImage?.node?.sourceUrl || 'https://picsum.photos/seed/placeholder/800/450'}
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
