
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

async function test_settings() {
  const query = `
    query GetSettings {
      generalSettings {
        title
        description
      }
      pages(where: { name: "blog" }) {
        nodes {
          id
          title
          uri
          seo { title }
        }
      }
    }
  `;
  const data = await fetchFromWordPress(query);
  console.log(`Settings: ${JSON.stringify(data || "NOT FOUND", null, 2)}`);
}

test_settings();
