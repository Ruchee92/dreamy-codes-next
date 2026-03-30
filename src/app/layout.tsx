import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dreamy Codes | Shopify Engineering for Scale",
  description: "We engineer high-converting Shopify stores for D2C brands.",
  metadataBase: new URL("https://dreamycodes.com"),
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
    "fb:app_id": "956376413511772",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ESWXVSE2R9"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
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
