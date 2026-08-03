import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// AI answer-engine and assistant crawlers. Listed explicitly (rather than relying on the
// "*" rule alone) so the welcome is unambiguous to anyone auditing robots.txt by eye or by
// tool, and so a future tightening of the default "*" rule can't accidentally lock these out.
const AI_CRAWLER_USER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/success"] },
      { userAgent: AI_CRAWLER_USER_AGENTS, allow: "/", disallow: ["/api/", "/success"] },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
