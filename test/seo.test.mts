import assert from "node:assert";
import { readFileSync } from "node:fs";
import { POSTS } from "../lib/posts/index.ts";
import { SITE } from "../lib/site.ts";
import { STATES } from "../lib/states.ts";

let passed = 0;
function test(name: string, fn: () => void) {
  fn();
  passed++;
  console.log(`  ok - ${name}`);
}

test("uses the www origin as the only sitemap origin", () => {
  const sitemapSource = readFileSync(new URL("../app/sitemap.ts", import.meta.url), "utf8");
  assert.match(sitemapSource, /const base = SITE\.url;/, "sitemap must use the central site origin");
  assert.doesNotMatch(sitemapSource, /frifti\.com/, "sitemap must not hard-code a competing origin");
  assert.strictEqual(SITE.url, "https://www.frifti.com", "central canonical origin must be HTTPS www");
});

test("includes only substantive state hubs and editorial guides", () => {
  const sitemapSource = readFileSync(new URL("../app/sitemap.ts", import.meta.url), "utf8");
  assert.strictEqual(7 + STATES.length + POSTS.length, 83, "unexpected intended sitemap URL count");
  assert.match(sitemapSource, /const statePages(?:: MetadataRoute\.Sitemap)? = STATES\.map/, "state hubs missing from sitemap route");
  assert.match(sitemapSource, /const postPages(?:: MetadataRoute\.Sitemap)? = POSTS\.map/, "editorial guides missing from sitemap route");
  assert.doesNotMatch(sitemapSource, /assetPages/, "state-and-asset pages must not be in sitemap");
});

test("keeps contextual state-and-asset tools out of search results", () => {
  const assetPage = readFileSync(new URL("../app/unclaimed-property/[state]/[asset]/page.tsx", import.meta.url), "utf8");
  assert.match(assetPage, /robots:\s*\{\s*index:\s*false,\s*follow:\s*true\s*\}/, "asset route needs noindex,follow metadata");
  assert.match(assetPage, /alternates:\s*\{\s*canonical:/, "asset route needs a self-canonical");
});

console.log(`seo.test.mts: ${passed} passed`);
