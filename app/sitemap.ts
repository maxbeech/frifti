import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { STATES } from "@/lib/states";
import { ASSET_TYPES } from "@/lib/assets";
import { POSTS } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/missingmoney-alternative`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const statePages: MetadataRoute.Sitemap = STATES.map((s) => ({
    url: `${base}/unclaimed-property/${s.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const assetPages: MetadataRoute.Sitemap = [];
  for (const s of STATES) {
    for (const a of ASSET_TYPES) {
      assetPages.push({
        url: `${base}/unclaimed-property/${s.slug}/${a.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  const postPages: MetadataRoute.Sitemap = POSTS.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.updated),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticPages, ...statePages, ...assetPages, ...postPages];
}
