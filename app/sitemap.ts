import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { STATES } from "@/lib/states";
import { POSTS } from "@/lib/posts";

// The state/asset directory content (lib/states.ts, lib/assets.ts) last changed on this date.
// Bump it when that data actually changes — using build/request time here would tell crawlers
// every one of the 364 programmatic pages was "just updated" on every deploy, which isn't true.
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

  const statePages: MetadataRoute.Sitemap = STATES.map((s) => ({
    url: `${base}/unclaimed-property/${s.slug}`,
    lastModified: DIRECTORY_LAST_UPDATED,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const postPages: MetadataRoute.Sitemap = POSTS.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.updated),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  // State-and-asset pages remain available as contextual tools from their state hub and
  // claim flow, but they deliberately stay out of the sitemap. Their six shared templates
  // do not merit competing with the independently useful state hubs and editorial guides.
  return [...staticPages, ...statePages, ...postPages];
}
