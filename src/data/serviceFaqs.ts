// The questions and answers rendered on /services. Kept here so the page and
// its FAQPage structured data read from one source and cannot drift apart.
// `slug` is the item's deep link on the page (#faq-<slug>); the schema ignores it.
export type ServiceFaq = { slug: string; question: string; answer: string };

export const serviceFaqs: ServiceFaq[] = [
    {
      slug: "cost",
      question: "How much does Shopify web design and development cost?",
      answer: "Most projects cost between $990 and $5,000. The price depends on how many custom page templates you need, how complex your tech stack is, and which third-party apps we need to integrate."
    },
    {
      slug: "timeline",
      question: "What is the typical timeline for a Shopify project?",
      answer: "Most builds take 2 to 4 weeks. That covers the build, your feedback and QA before launch."
    },
    {
      slug: "custom-themes",
      question: "Do you use templates or build custom Shopify themes?",
      answer: "Both. We create a custom design, then build it by editing the Liquid, CSS and HTML of a high-performance framework. The store looks like your brand, and the code stays stable and easy to manage."
    },
    {
      slug: "conversion-ux",
      question: "How do you optimize the Shopify user experience for conversions?",
      answer: "We decide layouts from heatmaps, session recordings and A/B tests, then remove whatever slows shoppers down on the way to checkout."
    },
    {
      slug: "mobile",
      question: "Will my Shopify store be mobile-friendly?",
      answer: "Yes. We design for phones first, and every store we build is fully responsive and fast on any screen size."
    },
    {
      slug: "self-editing",
      question: "Can I update the store myself after launch?",
      answer: "Yes. You'll have full control over your products, content and imagery in the Shopify admin. For layout changes or technical work, send us a message."
    },
    {
      slug: "copywriting-seo",
      question: "Can you help with Shopify copywriting and SEO?",
      answer: "Yes. We write e-commerce copy that targets the keywords your customers search for and sounds like your brand."
    },
    {
      slug: "branding",
      question: "Do you offer branding and logo design?",
      answer: "Yes. We design logos, color palettes and style guides, so your brand looks consistent everywhere it appears online."
    },
    {
      slug: "maintenance",
      question: "Do you provide ongoing Shopify maintenance and support?",
      answer: "Yes. We take one-off technical fixes and offer monthly maintenance plans."
    },
    {
      slug: "analytics",
      question: "Can you set up Google Analytics and tracking pixels?",
      answer: "Yes. Google Analytics 4 (GA4) goes into every build. We can also set up the Meta pixel, TikTok tracking and any other tracking you use."
    },
    {
      slug: "collaboration",
      question: "What is your process for collaborating with clients?",
      answer: "We start with a structured onboarding to understand what you want. Then we hold regular syncs while we build, so you can give feedback at every step."
    },
    {
      slug: "browsers",
      question: "Will my store work on all browsers and devices?",
      answer: "Yes. We test every store on all major browsers and devices before launch, from older iPhones to the latest desktop browsers."
    }
  ];
