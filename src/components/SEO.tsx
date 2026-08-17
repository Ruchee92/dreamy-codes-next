// File: src/components/SEO.tsx

export const WP_HOST = "https://wp.dreamycodes.com";
export const SITE_HOST = "https://dreamycodes.com";

/**
 * Strips 'wp.' from the backend URL and ensures all SEO metadata
 * points to the main frontend domain.
 *
 * Uploads are the exception: only WordPress serves /wp-content, so a media URL
 * pointed at the front domain never resolves (Vercel answers 403). Yoast writes
 * those URLs against the site URL, so they arrive here already broken and have
 * to be sent back to the WordPress host.
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url) return "";

  if (isMediaUrl(url)) return sanitizeMediaUrl(url);

  // Replace backend domain with frontend domain
  let sanitized = url.replace(WP_HOST, SITE_HOST);

  // Remove trailing slash if it's not the root domain
  if (sanitized.endsWith("/") && sanitized !== `${SITE_HOST}/`) {
    sanitized = sanitized.slice(0, -1);
  }

  return sanitized;
}

/** True for anything served out of the WordPress uploads directory. */
export function isMediaUrl(url: string | null | undefined): boolean {
  return !!url && url.includes("/wp-content/");
}

/**
 * Points an upload at the host that actually serves it. Safe to call with a
 * URL that is already correct.
 */
export function sanitizeMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  return url.replace(`${SITE_HOST}/wp-content/`, `${WP_HOST}/wp-content/`);
}

interface SEOProps {
  schema?: string;
}

/**
 * A simple component to render JSON-LD schema if present.
 * This keeps our page components cleaner.
 */
export function JsonLd({ schema }: SEOProps) {
  if (!schema) return null;
  
  // Rewrite every URL in the graph to the host that actually serves it: pages
  // to the front domain, uploads to WordPress. Yoast emits both against the
  // site URL, which left the logo and image nodes pointing at dead URLs.
  const sanitizedSchema = schema
    .replace(/https:\/\/(?:wp\.)?dreamycodes\.com[^"\\\s]*/g, (match) =>
      isMediaUrl(match) ? sanitizeMediaUrl(match) : match.replace(WP_HOST, SITE_HOST)
    )
    // The schema arrives as raw text from WordPress and is injected without
    // React escaping it. Escaping "<" keeps a stray "</script>" in any SEO
    // field from closing this tag early and injecting markup into the page.
    // JSON parsers read < as "<", so the structured data is unchanged.
    .replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: sanitizedSchema }}
    />
  );
}

/**
 * Extends the Organization node Yoast emits. Sharing its @id merges these
 * properties into the same entity rather than declaring a second company.
 *
 * These live here rather than in Yoast because the fields that would hold them
 * ("Additional organization info": description, email, phone) are Premium-only.
 * Every value below is already published on the site — footer, contact block
 * and founder section — so nothing here asserts anything a visitor cannot see.
 */
export function OrganizationJsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${SITE_HOST}/#organization`,
    name: "Dreamy Codes",
    url: `${SITE_HOST}/`,
    description: "Scaling your D2C brand with expert Shopify engineering.",
    email: "hello@dreamycodes.com",
    telephone: "+94714166608",
    priceRange: "$990+",
    // No address is published anywhere on the site, and inventing one would be
    // worse than omitting it. "Based globally" is the claim the contact block
    // actually makes.
    areaServed: "Worldwide",
    knowsAbout: [
      "Shopify",
      "Shopify theme development",
      "Conversion rate optimization",
      "E-commerce development",
      "Headless commerce",
    ],
    founder: {
      "@type": "Person",
      "@id": `${SITE_HOST}/#founder`,
      name: "Ruchira Madushan",
      // The site and the wider industry know him as "Ruchi", so both names are
      // declared: search engines can reconcile the two into one person.
      alternateName: "Ruchi",
      jobTitle: "Founder & Lead Engineer",
      url: `${SITE_HOST}/about`,
      sameAs: ["https://www.linkedin.com/in/ruchiramadushan/"],
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "hello@dreamycodes.com",
      telephone: "+94714166608",
      availableLanguage: "English",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organization).replace(/</g, "\\u003c"),
      }}
    />
  );
}
