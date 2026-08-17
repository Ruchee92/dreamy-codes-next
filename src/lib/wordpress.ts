import { sanitizeUrl, sanitizeMediaUrl } from "@/components/SEO";

// One spelling of the brand everywhere. Google was picking its own site name
// because the schema said "DreamyCodes" and og:site_name said "Dreamy Codes".
export const SITE_NAME = "Dreamy Codes";

export async function fetchFromWordPress(query: string, variables: any = {}) {
  const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

  if (!wpUrl) {
    throw new Error("Missing WordPress API URL environment variable!");
  }

  const response = await fetch(wpUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    // Next.js caching: revalidate every 60 seconds so your site updates when you publish in WP
    next: { revalidate: 60 },
  });

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

export async function getWordPressSEO(id: string, type: "page" | "post" = "page") {
  const normalizedId = id === "/" ? "/" : `/${id.replace(/^\//, "").replace(/\/$/, "")}/`;

  try {
    // Only use URI for pages as SLUG is not a valid PageIdType
    const query = `
      query GetSEO($id: ID!, $idType: ${type === "page" ? "PageIdType" : "PostIdType"}) {
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
    return formatSeo(seo, type === "post" ? "article" : "website");

  } catch (error) {
    console.error(`Error in getWordPressSEO for ${id}:`, error);
    return null;
  }
}

function formatSeo(seo: any, ogType: "website" | "article" = "website") {
  const canonicalUrl = sanitizeUrl(seo.canonical) || "https://dreamycodes.com";

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
      creator: "@dreamycodes",
      images: [twitterImage],
    },
    robots: {
      index: seo.metaRobotsNoindex !== "noindex",
      follow: seo.metaRobotsNofollow !== "nofollow",
    },
    schema: seo.schema?.raw
  };
}
