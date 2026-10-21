import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { POSTS } from "@/lib/posts";

// The state/asset directory content (lib/states.ts, lib/assets.ts) last changed on this date.
// Bump it when that data actually changes — using build/request time here would tell crawlers
// every programmatic page was "just updated" on every deploy, which isn't true.
const DIRECTORY_LAST_UPDATED = new Date("2026-07-01");

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/premium`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/missingmoney-alternative`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/disclosure`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const postPages: MetadataRoute.Sitemap = POSTS.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.updated),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  // /unclaimed-property/{state}/{asset} no longer exists (301 to the state hub), and the state hubs are noindex, so only static pages and guides are listed.
  return [...staticPages, ...postPages];
}
