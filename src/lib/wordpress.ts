import type { Metadata } from "next";
import { sanitizeUrl, sanitizeMediaUrl, SITE_HOST } from "@/components/SEO";
import { cache } from "react";

// One spelling of the brand everywhere. Google was picking its own site name
// because the schema said "DreamyCodes" and og:site_name said "Dreamy Codes".
export const SITE_NAME = "Dreamy Codes";

export async function fetchFromWordPress(query: string, variables: any = {}) {
  const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

  if (!wpUrl) {
    throw new Error("Missing WordPress API URL environment variable!");
  }

  // A network failure or a non-2xx answer throws (SEO audit, should-fix 2): "WordPress
  // is down" must not read as "this post does not exist". Pages that let it throw keep
  // serving their last good ISR copy; lookups that can live without it catch it.
  const response = await fetch(wpUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    // Next.js caching: revalidate every 60 seconds so your site updates when you publish in WP
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`WordPress API responded ${response.status} ${response.statusText}`);
  }

  const body = await response.json();

  if (body.errors) {
    // Log warnings but don't throw to allow fallbacks to proceed
    console.warn("WordPress API Warnings/Errors:", JSON.stringify(body.errors, null, 2));
  }

  return body.data;
}

// Note: nothing in WordPress uses the slug "primary" — the menus there are
// "main-menu" and "legal-menu" — so this lookup returns null and Navbar falls
// back to its hardcoded links. That fallback is currently the intended nav:
// the WordPress menu labels "Work" instead of "Our Work" and points the call
// to action at /contact-us/ rather than the on-page /#contact form. Switching
// the slug to "main-menu" connects the CMS but changes both, so it needs a
// content decision first.
export async function getWordPressMenu(slug: string = "primary") {
  try {
    const data = await fetchFromWordPress(`
      query GetMenu($slug: ID!) {
        menu(id: $slug, idType: SLUG) {
          menuItems {
            nodes {
              label
              uri
            }
          }
        }
      }
    `, { slug });

    return data?.menu?.menuItems?.nodes?.map((item: any) => ({
      name: item.label,
      href: sanitizeUrl(item.uri).replace(/\/$/, "") || "/",
    })) || [];
  } catch (error) {
    console.error("Error fetching menu:", error);
    return [];
  }
}

// Every SEO lookup below asks for the same Yoast fields. Image dimensions come
// along because og:image without width/height makes some scrapers skip the
// large card.
const SEO_FIELDS = `
            title
            metaDesc
            canonical
            opengraphTitle
            opengraphDescription
            opengraphImage { mediaItemUrl altText mediaDetails { width height } }
            twitterTitle
            twitterDescription
            twitterImage { mediaItemUrl }
            metaRobotsNoindex
            metaRobotsNofollow
            schema { raw }`;

export const getWordPressSEO = cache(async function getWordPressSEO(id: string, type: "page" | "post" = "page") {
  const normalizedId = id === "/" ? "/" : `/${id.replace(/^\//, "").replace(/\/$/, "")}/`;

  // Posts are looked up by slug, not URI. The WordPress permalink structure
  // (/blog/%postname%/, dated, or plain) does not have to match the Next.js
  // route for this to resolve. The URI lookup below returns null whenever the
  // two differ, and posts have none of the fallbacks pages get, so the Yoast
  // schema — FAQPage included — was dropped silently.
  if (type === "post") {
    const slug = id.replace(/^\//, "").replace(/\/$/, "");

    try {
      const data = await fetchFromWordPress(`
        query GetPostSEO($id: ID!) {
          post(id: $id, idType: SLUG) {
            seo {
${SEO_FIELDS}
            }
          }
        }
      `, { id: slug });

      const seo = data?.post?.seo;
      if (!seo) return null;
      return formatSeo(seo, "article");
    } catch (error) {
      console.error(`Error in getWordPressSEO for post ${slug}:`, error);
      return null;
    }
  }

  try {
    // Only use URI for pages as SLUG is not a valid PageIdType
    const query = `
      query GetSEO($id: ID!, $idType: PageIdType) {
        ${type}(id: $id, idType: $idType) {
          seo {
${SEO_FIELDS}
          }
        }
      }
    `;

    // Try URI lookup
    let data = await fetchFromWordPress(query, {
      id: normalizedId,
      idType: "URI"
    });

    // Try without trailing slash if no result
    if (!data?.[type]) {
      data = await fetchFromWordPress(query, {
        id: normalizedId.slice(0, -1),
        idType: "URI"
      });
    }

    let seo = data?.[type]?.seo;

    // Fallback for pages that might not match URI exactly (like the posts page)
    if (!seo && type === "page") {
      const name = id.replace(/\//g, "");
      const findPageData = await fetchFromWordPress(`
        query FindPageBySlug($name: String!) {
          pages(where: { name: $name }) {
            nodes {
              seo {
${SEO_FIELDS}
              }
            }
          }
        }
      `, { name });
      seo = findPageData?.pages?.nodes?.[0]?.seo;
    }

    // Secondary fallback for dedicated blog/posts page check
    if (!seo && id.includes("blog")) {
      const blogData = await fetchFromWordPress(`
        query GetBlogPageSEO {
          nodeByUri(uri: "/blog/") {
            ... on Page {
              seo {
${SEO_FIELDS}
              }
            }
          }
        }
      `);
      seo = blogData?.nodeByUri?.seo;
    }

    if (!seo) return null;
    // Only pages reach this point; posts return above.
    return formatSeo(seo, "website");

  } catch (error) {
    console.error(`Error in getWordPressSEO for ${id}:`, error);
    return null;
  }
});

function formatSeo(seo: any, ogType: "website" | "article" = "website") {
  // Empty when Yoast has none (e.g. noindexed items): buildMetadata then supplies the
  // route's own URL. Defaulting to the homepage told Google the page was a duplicate of /.
  const canonicalUrl = sanitizeUrl(seo.canonical);

  // Uploads live on the WordPress host. sanitizeMediaUrl undoes Yoast's rewrite
  // to the front domain, which does not serve /wp-content and answers 403.
  const ogImage = sanitizeMediaUrl(seo.opengraphImage?.mediaItemUrl) || "/default-og.jpg";
  // Falling back to the OG image rather than the site default keeps both cards
  // showing the same picture.
  const twitterImage = sanitizeMediaUrl(seo.twitterImage?.mediaItemUrl) || ogImage;
  const ogImageDetails = seo.opengraphImage?.mediaDetails;

  return {
    title: seo.title,
    description: seo.metaDesc,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: seo.opengraphTitle || seo.title,
      description: seo.opengraphDescription || seo.metaDesc,
      type: ogType,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "en_US",
      images: [{
        url: ogImage,
        // Real dimensions when WordPress knows them; the bundled default is a
        // 1200x630 card.
        width: ogImageDetails?.width ?? 1200,
        height: ogImageDetails?.height ?? 630,
        alt: seo.opengraphImage?.altText || seo.opengraphTitle || seo.title,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle || seo.opengraphTitle || seo.title,
      description: seo.twitterDescription || seo.opengraphDescription || seo.metaDesc,
      creator: "@RuchiShopify", // D-069 (Ruchi): the site's X account
      images: [twitterImage],
    },
    robots: {
      index: seo.metaRobotsNoindex !== "noindex",
      follow: seo.metaRobotsNofollow !== "nofollow",
    },
    schema: seo.schema?.raw
  };
}

type WordPressSEO = Awaited<ReturnType<typeof getWordPressSEO>>;

/**
 * One metadata builder for every route (SEO audit M2). Yoast's values win when
 * present; any empty field falls back to the route's own: an absolute canonical
 * for this path, a non-empty title and description, and the default OG card.
 * Fallback titles carry "| Dreamy Codes"; Yoast titles are never rewritten.
 */
export function buildMetadata(
  seo: WordPressSEO,
  fb: { path: string; title: string; description: string }
): Metadata {
  const url = SITE_HOST + (fb.path === "/" ? "" : fb.path);
  const title = seo?.title?.trim() || fb.title;
  const description = seo?.description?.trim() || fb.description;
  const og = seo?.openGraph;
  const tw = seo?.twitter;
  return {
    title,
    description,
    alternates: { canonical: seo?.alternates?.canonical || url },
    openGraph: {
      type: og?.type ?? "website",
      siteName: SITE_NAME,
      locale: "en_US",
      images: og?.images ?? [{ url: "/default-og.jpg", width: 1200, height: 630, alt: title }],
      title: og?.title?.trim() || title,
      description: og?.description?.trim() || description,
      url: og?.url || url,
    },
    twitter: {
      card: "summary_large_image",
      creator: tw?.creator ?? "@RuchiShopify",
      images: tw?.images ?? ["/default-og.jpg"],
      title: tw?.title?.trim() || title,
      description: tw?.description?.trim() || description,
    },
    robots: seo?.robots,
  };
}

/**
 * Turns links to the site inside WordPress HTML (post and page bodies) into
 * relative paths, so a pasted wp.dreamycodes.com link never leaks the backend
 * host (SEO audit, should-fix 3). Uploads (/wp-content/) are left alone: only
 * WordPress serves them. Trailing slashes are dropped to match the canonicals.
 */
export function rewriteContentLinks(html: string | null | undefined): string {
  if (!html) return "";
  return html.replace(
    /href=(["'])https?:\/\/(?:wp\.)?dreamycodes\.com(\/[^"'#?]*)?([?#][^"']*)?\1/g,
    (match, quote: string, path: string | undefined, rest: string | undefined) => {
      if (path?.startsWith("/wp-content/")) return match;
      const clean = (path || "/").replace(/(.)\/$/, "$1");
      return `href=${quote}${clean}${rest ?? ""}${quote}`;
    }
  );
}
