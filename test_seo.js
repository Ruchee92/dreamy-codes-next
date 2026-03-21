
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

const query = `
  query GetSEO($id: ID!) {
    page(id: $id, idType: URI) {
      seo {
        title
        metaDesc
        canonical
      }
    }
  }
`;

async function test() {
  const ids = ["/about", "about", "/about/", "about/", "/blog", "blog"];
  for (const id of ids) {
    const data = await fetchFromWordPress(query, { id });
    console.log(`ID: ${id} -> Title: ${data?.page?.seo?.title || "NOT FOUND"}`);
  }
}

test();
