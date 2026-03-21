
const wpUrl = "https://wp.dreamycodes.com/graphql";

async function fetchFromWordPress(query, variables = {}) {
  try {
    const response = await fetch(wpUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    const body = await response.json();
    return body.data;
  } catch (e) {
    return null;
  }
}

async function test(id) {
  const normalizedId = id === "/" ? "/" : `/${id.replace(/^\//, "").replace(/\/$/, "")}/`;
  console.log(`Testing ID: ${id}, Normalized: ${normalizedId}`);
  
  const query = `
    query GetSEO($id: ID!, $idType: PageIdType) {
      page(id: $id, idType: $idType) {
        title
        seo { title }
      }
    }
  `;

  let data = await fetchFromWordPress(query, { id: normalizedId, idType: "URI" });
  if (data?.page) {
    console.log(`FOUND via URI ${normalizedId}: ${data.page.seo.title}`);
    return;
  }

  data = await fetchFromWordPress(query, { id: normalizedId.slice(0, -1), idType: "URI" });
  if (data?.page) {
    console.log(`FOUND via URI ${normalizedId.slice(0, -1)}: ${data.page.seo.title}`);
    return;
  }

  // Blog fallback
  if (id.includes("blog")) {
    const postsPageData = await fetchFromWordPress(`
      query GetPostsPageSEO {
        nodeByUri(uri: "/blog/") {
          ... on Page {
            seo { title }
          }
        }
      }
    `);
    if (postsPageData?.nodeByUri?.seo) {
      console.log(`FOUND via nodeByUri /blog/: ${postsPageData.nodeByUri.seo.title}`);
      return;
    }
  }

  console.log("NOT FOUND");
}

async function run() {
  await test("/about");
  await test("/blog");
}

run();
