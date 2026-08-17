// The questions and answers rendered on /services. Kept here so the page and
// its FAQPage structured data read from one source and cannot drift apart.
export type ServiceFaq = { question: string; answer: string };

export const serviceFaqs: ServiceFaq[] = [
    {
      question: "How much does Shopify web design and development cost?",
      answer: "Every Shopify project is unique, with pricing typically ranging from $990 to $5,000. The final investment depends on your specific needs, such as the number of custom page templates, the complexity of your tech stack, and any advanced third-party app integrations required to power your e-commerce engine."
    },
    {
      question: "What is the typical timeline for a Shopify project?",
      answer: "Most of our high-performance Shopify builds are completed within a 2 to 4-week window. This timeframe allows us to meticulously engineer your storefront while ensuring we have enough time for collaborative feedback and rigorous quality assurance before your big launch."
    },
    {
      question: "Do you use templates or build custom Shopify themes?",
      answer: "It's a combination of both! We typically engineer a custom design and then meticulously edit the Liquid, CSS, and HTML of a high-performance framework. This hybrid approach ensures your Shopify store is visually unique and conversion-optimized while remaining technically stable and easy to manage."
    },
    {
      question: "How do you optimize the Shopify user experience for conversions?",
      answer: "Our design philosophy is revenue-first. We leverage years of A/B testing data and CRO best practices to ensure every pixel on your Shopify store is placed with the intent of turning visitors into loyal customers. We focus on reducing friction and guiding users seamlessly toward the checkout."
    },
    {
      question: "Will my Shopify store be mobile-friendly?",
      answer: "Mobile is no longer an afterthought. It's the priority. With the majority of e-commerce traffic originating from mobile devices, we engineer every Shopify site to be fully responsive, ensuring a lightning-fast and intuitive shopping experience on any screen size."
    },
    {
      question: "Can I update the store myself after launch?",
      answer: "Absolutely. We build on Shopify specifically because of its intuitive management interface. You'll have full control over your products, content, and imagery. For more advanced layout adjustments or technical updates, our team is always a quick message away."
    },
    {
      question: "Can you help with Shopify copywriting and SEO?",
      answer: "We offer specialized e-commerce copywriting that doesn't just tell your story but also drives search engine visibility. Our content is engineered to rank for relevant keywords while maintaining a high-converting tone that resonates with your audience."
    },
    {
      question: "Do you offer branding and logo design?",
      answer: "We do. A strong brand identity is the foundation of a successful store. We can assist with logo design, color palettes, and comprehensive style guides that ensure your brand looks professional and cohesive across all digital touchpoints."
    },
    {
      question: "Do you provide ongoing Shopify maintenance and support?",
      answer: "We're here for the long haul. Whether you need a one-off technical fix or a monthly maintenance plan to keep your store optimized, we offer flexible support options to ensure your e-commerce engine never stops running."
    },
    {
      question: "Can you set up Google Analytics and tracking pixels?",
      answer: "Data is key to growth. We integrate Google Analytics 4 (GA4) into every build and can assist with setting up Meta pixels, TikTok tracking, and other essential data tools to help you monitor and scale your marketing efforts."
    },
    {
      question: "What is your process for collaborating with clients?",
      answer: "Transparency is our core value. We use a structured onboarding process to capture your vision early on, followed by regular syncs and collaborative tools to ensure you're involved in every step of the engineering process."
    },
    {
      question: "Will my store work on all browsers and devices?",
      answer: "Yes. Our rigorous QA process involves testing your Shopify store across all major browsers and devices. We ensure that whether your customer is on an old iPhone or the latest desktop browser, their experience is flawless."
    }
  ];
