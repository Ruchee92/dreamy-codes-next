import { sanitizeUrl } from "@/components/SEO";

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

export async function getWordPressSEO(id: string, type: "page" | "post" = "page") {
  const normalizedId = id === "/" ? "/" : `/${id.replace(/^\//, "").replace(/\/$/, "")}/`;

  try {
    // Only use URI for pages as SLUG is not a valid PageIdType
    const query = `
      query GetSEO($id: ID!, $idType: ${type === "page" ? "PageIdType" : "PostIdType"}) {
        ${type}(id: $id, idType: $idType) {
          seo {
            title
            metaDesc
            canonical
            opengraphTitle
            opengraphDescription
            opengraphImage { mediaItemUrl }
            twitterTitle
            twitterDescription
            twitterImage { mediaItemUrl }
            schema { raw }
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
                title
                metaDesc
                canonical
                opengraphTitle
                opengraphDescription
                opengraphImage { mediaItemUrl }
                twitterTitle
                twitterDescription
                twitterImage { mediaItemUrl }
                schema { raw }
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
                title
                metaDesc
                canonical
                opengraphTitle
                opengraphDescription
                opengraphImage { mediaItemUrl }
                twitterTitle
                twitterDescription
                twitterImage { mediaItemUrl }
                schema { raw }
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
      images: seo.opengraphImage?.mediaItemUrl 
        ? [{ url: sanitizeUrl(seo.opengraphImage.mediaItemUrl) }] 
        : [{ url: "/default-og.jpg" }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle || seo.opengraphTitle || seo.title,
      description: seo.twitterDescription || seo.opengraphDescription || seo.metaDesc,
      images: seo.twitterImage?.mediaItemUrl 
        ? [sanitizeUrl(seo.twitterImage.mediaItemUrl)] 
        : ["/default-og.jpg"],
    },
    schema: seo.schema?.raw
  };
}
