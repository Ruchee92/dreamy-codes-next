"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, Tag, Twitter, Linkedin, Facebook, Clock } from 'lucide-react';
import Image from 'next/image';

interface RelatedPost {
  title: string;
  slug: string;
  date: string;
  featuredImage?: { node?: { sourceUrl?: string } };
}

const BlogPost = ({ post, relatedPosts = [] }: { post: any; relatedPosts?: RelatedPost[] }) => {
  // The old value was a hardcoded "5 min read" on every post; this one is ~15.
  const wordCount = (post?.content || '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.round(wordCount / 225));

  const author = post?.author?.node;
  const authorName = author?.name || 'Ruchira Madushan';

  const CTA_IMAGE = 'https://wp.dreamycodes.com/wp-content/uploads/2026/03/PR1-1.jpg';

  // Same portrait as the About page team section.
  const AUTHOR_PORTRAIT =
    'https://wp.dreamycodes.com/wp-content/uploads/2026/08/founder-Ruchi.jpg';

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
        <header className="px-6 lg:px-12 max-w-screen-2xl mx-auto mb-6 md:mb-8">
          <div className="max-w-4xl">
            {/* Category + date + read time */}
            <div className="flex flex-wrap items-center gap-4 mb-8 text-xs font-display font-bold uppercase tracking-widest text-[#3432c7]">
              <span className="flex items-center gap-1"><Tag size={14} /> {post?.categories?.nodes?.[0]?.name || 'Journal'}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="text-gray-500 flex items-center gap-1"><Calendar size={14} /> {post?.date ? new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown Date'}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="text-gray-500 flex items-center gap-1"><Clock size={14} /> {readMinutes} min read</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-1px] mb-6 md:mb-8 leading-[1.12] md:leading-[1.08] lg:leading-[1.05] text-brand-900 max-w-4xl text-balance">
              {post?.title}
            </h1>
          </div>
        </header>

        {/* Featured Image */}
        <div className="px-6 lg:px-12 max-w-screen-2xl mx-auto mb-8 md:mb-16">
          <div className="relative aspect-[16/9] md:aspect-[2/1] overflow-hidden border border-brand-900 shadow-2xl">
            <Image
              src={post?.featuredImage?.node?.sourceUrl || 'https://picsum.photos/seed/placeholder/1920/1080'}
              alt={post?.title || 'Blog Post'}
              fill
              priority
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
                <p className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-gray-500 [writing-mode:vertical-rl] mb-4">Share Article</p>
                <button 
                  onClick={() => handleShare('twitter')}
                  aria-label="Share on Twitter"
                  className="p-3 border border-gray-100 hover:border-brand-900 transition-all rounded-full text-gray-500 hover:text-brand-900 hover:bg-gray-50 cursor-pointer"
                >
                  <Twitter size={18} />
                </button>
                <button 
                  onClick={() => handleShare('linkedin')}
                  aria-label="Share on LinkedIn"
                  className="p-3 border border-gray-100 hover:border-brand-900 transition-all rounded-full text-gray-500 hover:text-brand-900 hover:bg-gray-50 cursor-pointer"
                >
                  <Linkedin size={18} />
                </button>
                <button 
                  onClick={() => handleShare('facebook')}
                  aria-label="Share on Facebook"
                  className="p-3 border border-gray-100 hover:border-brand-900 transition-all rounded-full text-gray-500 hover:text-brand-900 hover:bg-gray-50 cursor-pointer"
                >
                  <Facebook size={18} />
                </button>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-8 lg:col-start-3">
              <div
                className="
                  prose-dc max-w-none font-light text-gray-700
                  text-lg md:text-xl lg:text-2xl leading-relaxed md:leading-relaxed lg:leading-relaxed
                  [&_h2]:font-display [&_h2]:font-bold [&_h2]:tracking-[-1px] [&_h2]:text-3xl md:[&_h2]:text-4xl lg:[&_h2]:text-5xl [&_h2]:mt-12 md:[&_h2]:mt-20 [&_h2]:mb-6 md:[&_h2]:mb-10 [&_h2]:text-brand-900 [&_h2]:leading-[1.05]
                  [&_h3]:font-display [&_h3]:font-bold [&_h3]:tracking-[-1px] [&_h3]:text-2xl md:[&_h3]:text-3xl [&_h3]:mt-10 md:[&_h3]:mt-16 [&_h3]:mb-4 md:[&_h3]:mb-8 [&_h3]:text-brand-900 [&_h3]:leading-[1.1]
                  [&_h4]:font-display [&_h4]:font-bold [&_h4]:tracking-tight [&_h4]:text-xl [&_h4]:mt-8 md:[&_h4]:mt-12 [&_h4]:mb-3 md:[&_h4]:mb-6 [&_h4]:text-brand-900
                  [&_blockquote]:border-l-4 [&_blockquote]:border-[#3432c7] [&_blockquote]:bg-brand-50 [&_blockquote]:p-8 md:[&_blockquote]:p-12 [&_blockquote]:my-16 [&_blockquote]:font-display [&_blockquote]:text-2xl md:[&_blockquote]:text-3xl [&_blockquote]:font-bold [&_blockquote]:uppercase [&_blockquote]:tracking-tighter [&_blockquote]:text-brand-900 [&_blockquote]:not-italic
                "
                dangerouslySetInnerHTML={{ __html: post?.content || '' }}
              />

              {/* Share row (mobile only — the desktop rail handles this) */}
              <div className="mt-24 pt-12 border-t border-gray-100 flex items-center justify-end lg:hidden">
                <div className="flex items-center gap-6 lg:hidden">
                  <button aria-label="Share on Twitter" onClick={() => handleShare('twitter')} className="text-gray-500 hover:text-brand-900 cursor-pointer inline-flex items-center justify-center min-w-11 min-h-11 border border-transparent hover:border-brand-100 rounded-full transition-colors">
                    <Twitter size={20} />
                  </button>
                  <button aria-label="Share on LinkedIn" onClick={() => handleShare('linkedin')} className="text-gray-500 hover:text-brand-900 cursor-pointer inline-flex items-center justify-center min-w-11 min-h-11 border border-transparent hover:border-brand-100 rounded-full transition-colors">
                    <Linkedin size={20} />
                  </button>
                  <button aria-label="Share on Facebook" onClick={() => handleShare('facebook')} className="text-gray-500 hover:text-brand-900 cursor-pointer inline-flex items-center justify-center min-w-11 min-h-11 border border-transparent hover:border-brand-100 rounded-full transition-colors">
                    <Facebook size={20} />
                  </button>
                </div>
              </div>

              {/* ── Author bio ─────────────────────────────────────────── */}
              <div className="mt-16 border border-gray-200 bg-white p-8 md:p-10">
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
                  <Image
                    src={AUTHOR_PORTRAIT}
                    alt={`${authorName}, founder of Dreamy Codes`}
                    width={128}
                    height={128}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover flex-shrink-0"
                  />
                  <div>
                    <p className="text-xs font-display font-bold uppercase tracking-[0.15em] text-[#3432c7] mb-2">
                      Written by
                    </p>
                    <p className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-brand-900 leading-tight">
                      {authorName}
                    </p>
                    <p className="text-xs md:text-sm font-display font-bold uppercase tracking-widest text-gray-500 mt-2 mb-5">
                      Founder &middot; Shopify Designer &amp; CRO Specialist
                    </p>
                    <p className="text-gray-600 font-light leading-relaxed text-base md:text-lg">
                      Ruchira Madushan, known as &ldquo;Ruchi,&rdquo; is the founder of{' '}
                      <Link
                        href="/"
                        className="text-[#3432c7] underline underline-offset-[3px] decoration-1 hover:text-brand-900 transition-colors"
                      >
                        Dreamy Codes
                      </Link>{' '}
                      and a Shopify designer and CRO specialist with a decade of hands-on
                      experience. He helps brands create Shopify stores that look better,
                      work better, and convert better.
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Universal CTA ──────────────────────────────────────────
                  Service-agnostic on purpose: it suits any post topic rather
                  than pushing whatever the article happened to cover.

                  Padding lives on the text column, not the grid, so the artwork
                  can bleed to the card's edges without the heading and button
                  losing their own breathing room along with it. */}
              <div className="mt-8 overflow-hidden bg-gradient-to-br from-[#f0edfd] via-[#eae6fb] to-[#dedaf8]">
                <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] items-stretch lg:min-h-[26rem]">
                  <div className="flex flex-col justify-center p-8 md:p-12 lg:py-14 order-2 lg:order-1">
                    <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tighter text-brand-900 leading-[1.05] text-balance mb-8">
                      Ready to take your Shopify store to the next level?
                    </h2>
                    <Link
                      href="/contact-us"
                      className="inline-flex items-center justify-center gap-4 bg-[#3432c7] text-white px-8 md:px-10 py-5 font-display font-bold uppercase tracking-widest hover:bg-brand-900 border border-[#3432c7] hover:border-brand-900 transition-all duration-300 group whitespace-nowrap self-start"
                    >
                      <span>Let&rsquo;s Work Together</span>
                      <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
                    </Link>
                  </div>

                  <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto w-full order-1 lg:order-2">
                    <Image
                      src={CTA_IMAGE}
                      alt="Shopify product and homepage design work by Dreamy Codes shown on desktop and mobile"
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover object-center"
                    />
                  </div>
                </div>
              </div>

              {/* Back to Journal */}
              <div className="mt-12">
                <Link href="/blog" className="inline-flex items-center gap-2 font-display font-bold text-xs uppercase tracking-widest text-gray-500 hover:text-brand-900 transition-colors">
                  <ArrowLeft size={16} /> Back to Journal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts. Hidden entirely when there is nothing to link to,
          rather than rendering a heading over an empty-state message. */}
      {relatedPosts.length > 0 && (
        <section className="py-20 md:py-40 bg-brand-50 px-6 lg:px-12">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div>
                <p className="font-display font-bold text-brand-900/40 uppercase tracking-[0.3em] text-xs mb-6">Keep Reading</p>
                <h2 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter">Related <span className="text-[#3432c7]">Insights</span></h2>
              </div>
              <Link href="/blog" className="flex items-center gap-2 font-display font-bold text-xs uppercase tracking-widest hover:gap-4 transition-all">
                View All Journal Entries <ArrowLeft className="rotate-180" size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {relatedPosts.map((related) => (
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
                  <p className="text-[10px] font-display font-bold uppercase tracking-widest text-gray-500 mb-4">
                    {related.date ? new Date(related.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                  </p>
                  <h3 className="font-display text-2xl md:text-3xl font-bold uppercase mb-4 group-hover:text-[#3432c7] transition-colors leading-tight">{related.title}</h3>
                  <div className="flex items-center gap-2 font-display font-bold text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all text-brand-900">
                    Read Article <ArrowLeft className="rotate-180" size={14} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default BlogPost;
