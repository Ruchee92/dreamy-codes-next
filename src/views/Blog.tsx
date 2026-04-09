"use client";

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Calendar, User, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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
        <span className="flex items-center gap-1 text-brand-600"><Tag size={12} /> {category}</span>
      </div>
      <h2 className="font-display text-2xl font-bold uppercase mb-4 group-hover:text-brand-600 transition-colors">{title}</h2>
      <p className="text-gray-600 font-light mb-6 line-clamp-2">{excerpt}</p>
      <div className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
        Read More <ArrowRight size={16} />
      </div>
    </Link>
  </motion.div>
);

const Blog = ({ posts }: { posts: any[] }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {posts.map((post) => (
            <BlogCard
              key={post.slug}
              title={post.title}
              slug={post.slug}
              excerpt={post.excerpt ? post.excerpt.replace(/<[^>]*>?/gm, '').substring(0, 115) + '...' : ''}
              date={new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              author={post.author?.node?.name || 'Dreamy Codes'}
              category={post.categories?.nodes?.[0]?.name || 'Uncategorized'}
              image={post.featuredImage?.node?.sourceUrl || 'https://picsum.photos/seed/placeholder/800/450'}
              delay={0.1}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Blog;
