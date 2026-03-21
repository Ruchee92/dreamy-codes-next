// File: verify_seo.js
const { sanitizeUrl } = require('./src/components/SEO');

function testSanitizeUrl() {
  const tests = [
    {
      input: "https://wp.dreamycodes.com/wp-content/uploads/2024/03/image.jpg",
      expected: "https://dreamycodes.com/wp-content/uploads/2024/03/image.jpg"
    },
    {
      input: "https://wp.dreamycodes.com/my-post/",
      expected: "https://dreamycodes.com/my-post/"
    },
    {
      input: "https://dreamycodes.com/already-correct",
      expected: "https://dreamycodes.com/already-correct"
    },
    {
      input: null,
      expected: ""
    },
    {
      input: undefined,
      expected: ""
    }
  ];

  let passed = true;
  tests.forEach((t, i) => {
    const result = sanitizeUrl(t.input);
    if (result !== t.expected) {
      console.error(`Test ${i} FAILED: input="${t.input}", expected="${t.expected}", result="${result}"`);
      passed = false;
    } else {
      console.log(`Test ${i} PASSED`);
    }
  });

  return passed;
}

if (testSanitizeUrl()) {
  console.log("All URL sanitization tests PASSED!");
} else {
  process.exit(1);
}
