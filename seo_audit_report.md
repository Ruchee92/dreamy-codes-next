# Headless Next.js SEO Audit Report

Based on a thorough review of your codebase, I found 3 distinct SEO issues. These range from critical missing metadata to performance bottlenecks that impact Core Web Vitals.

---

### 1. Missing Rich Metadata on Standard Dynamic Pages (Critical Severity)
**Location:** [src/app/[slug]/page.tsx](file:///c:/Users/USER/dreamy-codes-next/src/app/%5Bslug%5D/page.tsx)
**What's wrong:**
While your static pages (`/about`) and dynamic blog posts (`/blog/[slug]`) properly use your custom [getWordPressSEO()](file:///c:/Users/USER/dreamy-codes-next/src/lib/wordpress.ts#53-152) helper, the catch-all dynamic page router (`[slug]/page.tsx`) manually fetches only the `title` and `metaDesc` fields from WordPress.
**Impact on Google Rank:** 
 **CRITICAL**. Any page rendered through this route (like potential marketing landing pages) will be completely missing:
*   `<link rel="canonical">` tags (risks duplicate content penalties).
*   Open Graph tags (`og:title`, `og:image`) and Twitter Cards.
*   JSON-LD Schema markup.
**How to fix:**
Refactor [generateMetadata](file:///c:/Users/USER/dreamy-codes-next/src/app/about/page.tsx#9-21) in [src/app/[slug]/page.tsx](file:///c:/Users/USER/dreamy-codes-next/src/app/%5Bslug%5D/page.tsx) to use the [getWordPressSEO](file:///c:/Users/USER/dreamy-codes-next/src/lib/wordpress.ts#53-152) helper instead of the manual GraphQL query. 
```typescript
import { getWordPressSEO } from "@/lib/wordpress";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const seo = await getWordPressSEO(params.slug, "page");
  if (!seo) return { title: "Page Not Found" };

  return {
    title: seo.title,
    description: seo.description,
    alternates: seo.alternates,
    openGraph: seo.openGraph,
    twitter: seo.twitter,
  };
}
```
*(You will also need to add `<JsonLd schema={seoData?.schema} />` to the default export rendering the page).*

---

### 2. Unoptimized Images Hurting Core Web Vitals (High Severity)
**Location:** Across all UI Views ([src/views/Home.tsx](file:///c:/Users/USER/dreamy-codes-next/src/views/Home.tsx), [src/views/CaseStudies.tsx](file:///c:/Users/USER/dreamy-codes-next/src/views/CaseStudies.tsx), [src/views/BlogPost.tsx](file:///c:/Users/USER/dreamy-codes-next/src/views/BlogPost.tsx), etc.) and Components.
**What's wrong:**
The entire site heavily relies on standard HTML `<img src="..." />` tags instead of taking advantage of the Next.js `<Image />` component (`next/image`).
**Impact on Google Rank:** 
 **HIGH**. Google uses Core Web Vitals (specifically Largest Contentful Paint - LCP and Cumulative Layout Shift - CLS) as a direct ranking factor. Native `<img>` tags pull the original heavy images directly from WordPress. They are not served in next-gen formats (like WebP or AVIF), nor are they properly sized for mobile devices, causing slower load times.
**How to fix:**
Your [next.config.ts](file:///c:/Users/USER/dreamy-codes-next/next.config.ts) already correctly whitelists `wp.dreamycodes.com` for remote patterns! You just need to import `Image` from `next/image` and replace all native `<img>` tags across your project.
```tsx
import Image from "next/image";

// Replace:
<img src={image} alt="Testimonial" className="w-12 h-12 rounded-full" />

// With:
<Image src={image} alt="Testimonial" width={48} height={48} className="w-12 h-12 rounded-full" />
```

---

### 3. Missing WordPress "Pages" in XML Sitemap (Medium Severity)
**Location:** [src/app/sitemap.ts](file:///c:/Users/USER/dreamy-codes-next/src/app/sitemap.ts)
**What's wrong:**
Your sitemap generation script perfectly pulls all your dynamic **Blog Posts** and hardcodes your **Static Pages**. However, it completely ignores dynamically generated WordPress **Pages** that map to your `[slug]` route. If you publish a new page (e.g., `/pricing` or `/[landing-page]`) in WordPress, it will not exist in the sitemap.
**Impact on Google Rank:** 
 **MEDIUM**. Google discovers pages via internal links, but omitting them from the `sitemap.xml` severely slows down crawl efficiency and delays new landing pages from being indexed.
**How to fix:**
Update [src/app/sitemap.ts](file:///c:/Users/USER/dreamy-codes-next/src/app/sitemap.ts) to include a separate GraphQL query block (or expand the existing one) to fetch `pages(first: 100)` and append those dynamically created slugs to the final returned array, just like you already do for `blogPosts`.
