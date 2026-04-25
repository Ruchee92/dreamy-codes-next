// File: src/components/SEO.tsx

/**
 * Strips 'wp.' from the backend URL and ensures all SEO metadata
 * points to the main frontend domain.
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url) return "";
  
  // Replace backend domain with frontend domain
  let sanitized = url.replace("https://wp.dreamycodes.com", "https://dreamycodes.com");

  // Remove trailing slash if it's not the root domain
  if (sanitized.endsWith("/") && sanitized !== "https://dreamycodes.com/") {
    sanitized = sanitized.slice(0, -1);
  }
  
  return sanitized;
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
  
  // Also sanitize URLs inside the schema string if needed
  const sanitizedSchema = schema.replace(/https:\/\/wp\.dreamycodes\.com/g, "https://dreamycodes.com");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: sanitizedSchema }}
    />
  );
}
