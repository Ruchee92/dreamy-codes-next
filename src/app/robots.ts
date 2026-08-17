import { MetadataRoute } from 'next';

// Answer-engine crawlers. They are allowed the same access as search crawlers,
// but naming them explicitly matters: several of these treat an unlisted agent
// as undefined rather than allowed, and an explicit rule is also what gets
// checked when a page fails to appear in an AI answer.
const AI_CRAWLERS = [
    'GPTBot',            // OpenAI, training + browsing
    'OAI-SearchBot',     // OpenAI, ChatGPT search index
    'ChatGPT-User',      // OpenAI, user-initiated fetches
    'ClaudeBot',         // Anthropic, crawling
    'Claude-User',       // Anthropic, user-initiated fetches
    'Claude-SearchBot',  // Anthropic, search index
    'PerplexityBot',     // Perplexity index
    'Perplexity-User',   // Perplexity, user-initiated fetches
    'Google-Extended',   // Gemini / AI Overviews grounding
    'Applebot-Extended', // Apple Intelligence
    'Bingbot',           // Bing, feeds Copilot
    'CCBot',             // Common Crawl
    'meta-externalagent' // Meta AI
];

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
            },
            ...AI_CRAWLERS.map((userAgent) => ({
                userAgent,
                allow: '/',
            })),
        ],
        sitemap: 'https://dreamycodes.com/sitemap.xml',
        host: 'https://dreamycodes.com',
    };
}
