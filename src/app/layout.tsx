import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Space_Grotesk, Manrope, Dancing_Script } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { OrganizationJsonLd } from "@/components/SEO";
import LazyWhatsAppWidget from "@/components/LazyWhatsAppWidget";
import BackToTop from "@/components/BackToTop";
import { LOGO_INTRO_SCRIPT } from "@/components/logoIntro";
import "./globals.css";

// Body copy. Variable font, so no explicit weight list is needed.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

// Headings, nav, and every `font-display` utility.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

// Used only for the founder signature. D-073: no page uses it any more (the signature
// went in D-036), so it is not preloaded: it stays available without costing every
// page a high-priority font download before first paint.
const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Dreamy Codes | Shopify Engineering for Scale",
  description: "We engineer high-converting Shopify stores for D2C brands.",
  metadataBase: new URL("https://dreamycodes.com"),
  // No canonical / og:url here (SEO M1): Next merges metadata per key, so a
  // site-wide default leaked the homepage URL onto every page without its own
  // (404s, WordPress outages). Each route sets them through buildMetadata.
  // Icons: /favicon.ico plus the app/icon.png and app/apple-icon.png files.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Dreamy Codes | Shopify Engineering for Scale",
    description: "We engineer high-converting Shopify stores for D2C brands.",
    siteName: "Dreamy Codes",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/default-og.jpg",
        width: 1200,
        height: 630,
        alt: "Dreamy Codes | Shopify Engineering for Scale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dreamy Codes | Shopify Engineering for Scale",
    description: "We engineer high-converting Shopify stores for D2C brands.",
    creator: "@RuchiShopify", // D-069
    images: ["/default-og.jpg"],
  },
  other: {
    "facebook-domain-verification": "erbjwg9yprmcvtzmwglqs1v64wdzz9",
  },
};

// Browser UI tint: the site's paper colour.
export const viewport: Viewport = {
  themeColor: "#fcfcfc",
};

// GA4 only on the live site (SEO M5). Vercel sets VERCEL_ENV=production for the
// dreamycodes.com deployment, "preview" for branch previews, nothing locally.
const isProd = process.env.VERCEL_ENV === "production";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the logo intro script below sets
    // data-logo-intro on <html> before hydration (this element only).
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta property="fb:app_id" content="956376413511772" />
        {/* Every image on the site is proxied from the WordPress host, and the
            hero avatars are priority loads, so the connection is worth opening
            before the HTML finishes parsing. */}
        <link rel="preconnect" href="https://wp.dreamycodes.com" />
        <link rel="dns-prefetch" href="https://wp.dreamycodes.com" />
        {/* Analytics loads late by design, so a DNS hint is enough here. */}
        {isProd && <link rel="dns-prefetch" href="https://www.googletagmanager.com" />}
        {/* Company-level facts for every page. Merges into Yoast's
            Organization node by @id. */}
        <OrganizationJsonLd />
        {/* One-time nav logo intro (D-013). Inline so it is in place before
            the logo starts loading; it only opts in, never hides for good. */}
        <script dangerouslySetInnerHTML={{ __html: LOGO_INTRO_SCRIPT }} />
      </head>
      <body
        className={`${manrope.variable} ${spaceGrotesk.variable} ${dancingScript.variable} antialiased`}
      >
        {/* Visually hidden until focused. The header is fixed and carries five
            links on every page, so keyboard users need a way past it. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-brand-900 focus:text-white focus:px-6 focus:py-3 focus:font-display focus:font-bold focus:uppercase focus:tracking-widest focus:text-sm"
        >
          Skip to main content
        </a>
        {children}
        <LazyWhatsAppWidget />
        <BackToTop />
        <Analytics />
        <SpeedInsights />
        {/* 164 KiB of it, two thirds unused, and it was the largest single
            contributor to main-thread blocking. Nothing on the page depends on
            gtag being ready early, so it waits for idle. */}
        {isProd && (
          <>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-ESWXVSE2R9"
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-ESWXVSE2R9');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
