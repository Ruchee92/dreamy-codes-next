
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

async function test_general() {
  const query = `
    query GetGeneralSEO {
      seo {
        home {
          title
          description
        }
      }
    }
  `;
  const data = await fetchFromWordPress(query);
  console.log(`General SEO -> ${JSON.stringify(data?.seo || "NOT FOUND")}`);
}

test_general();
