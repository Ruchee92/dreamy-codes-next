
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
  query GetAllPages {
    pages {
      nodes {
        title
        uri
        slug
      }
    }
  }
`;

async function test() {
  const data = await fetchFromWordPress(query);
  console.log(JSON.stringify(data.pages.nodes, null, 2));
}

test();
