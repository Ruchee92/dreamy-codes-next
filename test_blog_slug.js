
const wpUrl = "https://wp.dreamycodes.com/graphql";

async function fetchFromWordPress(query, variables = {}) {
  const response = await fetch(wpUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const body = await response.json();
  return body.data;
}

async function test_slug() {
  const query = `
    query GetPageBySlug($id: ID!) {
      page(id: $id, idType: SLUG) {
        title
        slug
        seo { title }
      }
    }
  `;
  const data = await fetchFromWordPress(query, { id: "blog" });
  console.log(`SLUG blog -> ${JSON.stringify(data?.page || "NOT FOUND")}`);
}

test_slug();
