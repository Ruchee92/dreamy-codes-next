import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk, Manrope, Dancing_Script } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { OrganizationJsonLd } from "@/components/SEO";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import BackToTop from "@/components/BackToTop";
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

// Used only for the founder signature.
const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dreamy Codes | Shopify Engineering for Scale",
  description: "We engineer high-converting Shopify stores for D2C brands.",
  metadataBase: new URL("https://dreamycodes.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Dreamy Codes | Shopify Engineering for Scale",
    description: "We engineer high-converting Shopify stores for D2C brands.",
    url: "https://dreamycodes.com",
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
    creator: "@dreamycodes",
    images: ["/default-og.jpg"],
  },
  other: {
    "facebook-domain-verification": "erbjwg9yprmcvtzmwglqs1v64wdzz9",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta property="fb:app_id" content="956376413511772" />
        {/* Every image on the site is proxied from the WordPress host, and the
            hero avatars are priority loads, so the connection is worth opening
            before the HTML finishes parsing. */}
        <link rel="preconnect" href="https://wp.dreamycodes.com" />
        <link rel="dns-prefetch" href="https://wp.dreamycodes.com" />
        {/* Analytics loads late by design, so a DNS hint is enough here. */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {/* Company-level facts for every page. Merges into Yoast's
            Organization node by @id. */}
        <OrganizationJsonLd />
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
        <WhatsAppWidget />
        <BackToTop />
        <Analytics />
        <SpeedInsights />
        {/* 164 KiB of it, two thirds unused, and it was the largest single
            contributor to main-thread blocking. Nothing on the page depends on
            gtag being ready early, so it waits for idle. */}
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
      </body>
    </html>
  );
}
