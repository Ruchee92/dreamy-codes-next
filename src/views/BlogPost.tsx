"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Tag, Twitter, Linkedin, Facebook, Clock } from 'lucide-react';
import Image from 'next/image';
import FinalCTA from '../components/FinalCTA';

interface RelatedPost {
  title: string;
  slug: string;
  date: string;
  featuredImage?: { node?: { sourceUrl?: string } };
}

const BlogPost = ({ post, relatedPosts = [] }: { post: any; relatedPosts?: RelatedPost[] }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const author = post?.author?.node;
  const authorName = author?.name || 'Dreamy Codes';
  const authorBio = author?.description || 'Lead e-commerce engineer and Shopify expert helping D2C brands scale through conversion-focused design and development.';
  const authorAvatar = author?.avatar?.url;
  const authorInitial = authorName[0];

  const handleShare = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    const title = post?.title || 'Check out this post on Dreamy Codes';
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
    }
  };

  return (
    <div className="pt-24 md:pt-32">
      {/* Hero / Header */}
      <article>
        <header className="px-6 lg:px-12 max-w-screen-2xl mx-auto mb-6 md:mb-10">
          <div className="max-w-4xl">
            {/* Category + date + read time */}
            <div className="flex flex-wrap items-center gap-4 mb-8 text-xs font-display font-bold uppercase tracking-widest text-brand-600">
              <span className="flex items-center gap-1"><Tag size={14} /> {post?.categories?.nodes?.[0]?.name || 'Journal'}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="text-gray-400 flex items-center gap-1"><Calendar size={14} /> {post?.date ? new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown Date'}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="text-gray-400 flex items-center gap-1"><Clock size={14} /> 5 min read</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-8xl font-bold uppercase tracking-tighter mb-6 md:mb-10 leading-[0.9] lg:leading-[0.85]">
              {post?.title}
            </h1>
          </div>
        </header>

        {/* Featured Image */}
        <div className="px-6 lg:px-12 max-w-screen-2xl mx-auto mb-8 md:mb-16">
          <div className="relative aspect-[21/9] overflow-hidden border border-brand-900 shadow-2xl">
            <Image
              src={post?.featuredImage?.node?.sourceUrl || 'https://picsum.photos/seed/placeholder/1920/1080'}
              alt={post?.title || 'Blog Post'}
              fill
              sizes="(max-width: 1536px) 100vw, 1536px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 lg:px-12 max-w-screen-2xl mx-auto mb-8 md:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            {/* Sidebar / Share */}
            <aside className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-32 flex flex-col gap-6 items-center">
                <p className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-gray-400 [writing-mode:vertical-rl] mb-4">Share Article</p>
                <button 
                  onClick={() => handleShare('twitter')}
                  aria-label="Share on Twitter"
                  className="p-3 border border-gray-100 hover:border-brand-900 transition-all rounded-full text-gray-400 hover:text-brand-900 hover:bg-gray-50 cursor-pointer"
                >
                  <Twitter size={18} />
                </button>
                <button 
                  onClick={() => handleShare('linkedin')}
                  aria-label="Share on LinkedIn"
                  className="p-3 border border-gray-100 hover:border-brand-900 transition-all rounded-full text-gray-400 hover:text-brand-900 hover:bg-gray-50 cursor-pointer"
                >
                  <Linkedin size={18} />
                </button>
                <button 
                  onClick={() => handleShare('facebook')}
                  aria-label="Share on Facebook"
                  className="p-3 border border-gray-100 hover:border-brand-900 transition-all rounded-full text-gray-400 hover:text-brand-900 hover:bg-gray-50 cursor-pointer"
                >
                  <Facebook size={18} />
                </button>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-8 lg:col-start-3">
              <div
                className="
                  max-w-none font-light text-gray-700
                  text-lg md:text-xl lg:text-2xl leading-relaxed md:leading-relaxed lg:leading-relaxed
                  [&>p]:mb-10 lg:[&>p]:mb-12
                  [&>h2]:font-display [&>h2]:font-bold [&>h2]:uppercase [&>h2]:tracking-tighter [&>h2]:text-3xl md:[&>h2]:text-4xl lg:[&>h2]:text-5xl [&>h2]:mt-12 md:[&>h2]:mt-20 [&>h2]:mb-6 md:[&>h2]:mb-10 [&>h2]:text-brand-900
                  [&>h3]:font-display [&>h3]:font-bold [&>h3]:uppercase [&>h3]:tracking-tighter [&>h3]:text-2xl md:[&>h3]:text-3xl [&>h3]:mt-10 md:[&>h3]:mt-16 [&>h3]:mb-4 md:[&>h3]:mb-8 [&>h3]:text-brand-800
                  [&>h4]:font-display [&>h4]:font-bold [&>h4]:uppercase [&>h4]:tracking-tight [&>h4]:text-xl [&>h4]:mt-8 md:[&>h4]:mt-12 [&>h4]:mb-3 md:[&>h4]:mb-6 [&>h4]:text-brand-700
                  [&>blockquote]:border-l-4 [&>blockquote]:border-brand-600 [&>blockquote]:bg-brand-50/50 [&>blockquote]:p-10 md:[&>blockquote]:p-12 [&>blockquote]:my-16 [&>blockquote]:font-display [&>blockquote]:text-2xl md:[&>blockquote]:text-3xl lg:[&>blockquote]:text-4xl [&>blockquote]:font-bold [&>blockquote]:uppercase [&>blockquote]:tracking-tighter [&>blockquote]:text-brand-900 [&>blockquote]:not-italic
                  [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-10 [&>ul]:space-y-4
                  [&>li]:pl-2
                "
                dangerouslySetInnerHTML={{ __html: post?.content || '' }}
              />

              {/* Tags / Share row */}
              <div className="mt-24 pt-12 border-t border-gray-100 flex flex-wrap gap-6 items-center justify-between">
                <div className="flex flex-wrap gap-3">
                  {(post?.categories?.nodes || []).map((cat: any) => (
                    <span key={cat.name} className="px-5 py-2.5 bg-gray-50 text-[10px] font-display font-bold uppercase tracking-widest text-gray-500 hover:bg-brand-900 hover:text-white transition-colors cursor-default">
                      #{cat.name}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-6 lg:hidden">
                  <Twitter 
                    onClick={() => handleShare('twitter')}
                    size={20} 
                    className="text-gray-400 hover:text-brand-900 cursor-pointer p-0.5 border border-transparent hover:border-brand-100 rounded-full" 
                  />
                  <Linkedin 
                    onClick={() => handleShare('linkedin')}
                    size={20} 
                    className="text-gray-400 hover:text-brand-900 cursor-pointer p-0.5 border border-transparent hover:border-brand-100 rounded-full" 
                  />
                  <Facebook 
                    onClick={() => handleShare('facebook')}
                    size={20} 
                    className="text-gray-400 hover:text-brand-900 cursor-pointer p-0.5 border border-transparent hover:border-brand-100 rounded-full" 
                  />
                </div>
              </div>

              {/* ── Author Bio Card ── */}
              <div className="mt-16 border border-brand-900/10 bg-brand-50/50 p-8 md:p-10 flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {authorAvatar ? (
                    <Image
                      src={authorAvatar}
                      alt={authorName}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover border-2 border-brand-900/10"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-brand-900 flex items-center justify-center font-display font-bold text-white text-2xl flex-shrink-0">
                      {authorInitial}
                    </div>
                  )}
                </div>
                {/* Info */}
                <div>
                  <p className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-brand-600 mb-1">Written by</p>
                  <h4 className="font-display text-xl md:text-2xl font-bold uppercase tracking-tighter text-brand-900 mb-1">{authorName}</h4>
                  <p className="text-[10px] font-display font-bold uppercase tracking-widest text-gray-400 mb-4">Lead E-commerce Engineer</p>
                  <p className="text-gray-600 font-light leading-relaxed text-base md:text-lg">{authorBio}</p>
                </div>
              </div>

              {/* Back to Journal */}
              <div className="mt-12">
                <Link href="/blog" className="inline-flex items-center gap-2 font-display font-bold text-xs uppercase tracking-widest text-gray-400 hover:text-brand-900 transition-colors">
                  <ArrowLeft size={16} /> Back to Journal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      <FinalCTA
        variant="dark"
        title={<>READY TO OPTIMIZE <br /> YOUR STORE?</>}
      />

      {/* Related Posts */}
      <section className="py-20 md:py-40 bg-brand-50 px-6 lg:px-12">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div>
              <p className="font-display font-bold text-brand-900/40 uppercase tracking-[0.3em] text-xs mb-6">Keep Reading</p>
              <h2 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter">Related <span className="text-brand-600">Insights</span></h2>
            </div>
            <Link href="/blog" className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-widest hover:gap-4 transition-all">
              View All Journal Entries <ArrowLeft className="rotate-180" size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {relatedPosts.length > 0 ? relatedPosts.map((related) => (
              <Link key={related.slug} href={`/blog/${related.slug}`} className="group">
                <div className="relative aspect-[16/9] overflow-hidden mb-8 border border-gray-200 shadow-lg">
                  <Image
                    src={related.featuredImage?.node?.sourceUrl || `https://picsum.photos/seed/${related.slug}/800/450`}
                    alt={related.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <p className="text-[10px] font-display font-bold uppercase tracking-widest text-gray-400 mb-4">
                  {related.date ? new Date(related.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                </p>
                <h3 className="font-display text-2xl md:text-3xl font-bold uppercase mb-4 group-hover:text-brand-600 transition-colors leading-tight">{related.title}</h3>
                <div className="flex items-center gap-2 font-display font-bold text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all text-brand-900">
                  Read Article <ArrowLeft className="rotate-180" size={14} />
                </div>
              </Link>
            )) : (
              <p className="text-gray-400 col-span-2 font-display text-sm uppercase tracking-widest">No related posts found.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
