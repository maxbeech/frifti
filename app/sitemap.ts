import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { STATES } from "@/lib/data/states";
import { ASSET_TYPES } from "@/lib/data/assetTypes";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const urls: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: now, priority: 1 },
    { url: `${SITE.url}/states`, lastModified: now, priority: 0.8 },
    { url: `${SITE.url}/how-to-claim`, lastModified: now, priority: 0.7 },
    { url: `${SITE.url}/missingmoney-alternative`, lastModified: now, priority: 0.6 },
    { url: `${SITE.url}/pricing`, lastModified: now, priority: 0.5 },
  ];
  for (const s of STATES) {
    urls.push({ url: `${SITE.url}/unclaimed-property/${s.slug}`, lastModified: now, priority: 0.7 });
    for (const a of ASSET_TYPES) {
      urls.push({ url: `${SITE.url}/unclaimed-property/${s.slug}/${a.slug}`, lastModified: now, priority: 0.5 });
    }
  }
  return urls;
}
