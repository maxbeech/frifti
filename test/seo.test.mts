import assert from "node:assert";
import { existsSync, readFileSync } from "node:fs";
import { POST_REDIRECTS, REDIRECTS } from "../lib/redirects.ts";
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

test("lists only static pages and editorial guides; state hubs are noindex and unlisted", () => {
  const sitemapSource = readFileSync(new URL("../app/sitemap.ts", import.meta.url), "utf8");
  assert.strictEqual(7 + POSTS.length, 32, "unexpected intended sitemap URL count");
  assert.doesNotMatch(sitemapSource, /statePages|STATES/, "state hubs must not be in the sitemap");
  const hub = readFileSync(new URL("../app/unclaimed-property/[state]/page.tsx", import.meta.url), "utf8");
  assert.match(hub, /robots: \{ index: false, follow: true \}/, "state hubs must be noindex,follow");
  assert.match(sitemapSource, /const postPages(?:: MetadataRoute\.Sitemap)? = POSTS\.map/, "editorial guides missing from sitemap route");
  assert.doesNotMatch(sitemapSource, /assetPages/, "state-and-asset pages must not be in sitemap");
});

test("state-and-asset URLs 301 to the state hub", () => {
  const r = REDIRECTS.find((x) => x.source === "/unclaimed-property/:state/:asset");
  assert.ok(r, "asset redirect missing");
  assert.strictEqual(r.destination, "/unclaimed-property/:state");
  assert.strictEqual(r.permanent, true);
  assert.ok(!existsSync(new URL("../app/unclaimed-property/[state]/[asset]", import.meta.url)), "asset route must be gone");
});

test("removed guides redirect permanently to a live page", () => {
  const live = new Set([...POSTS.map((p) => `/blog/${p.slug}`), ...STATES.map((s) => `/unclaimed-property/${s.slug}`)]);
  for (const [slug, dest] of Object.entries(POST_REDIRECTS)) {
    assert.ok(live.has(dest), `${slug} redirects to ${dest}, which is not a live page`);
    assert.ok(!POSTS.some((p) => p.slug === slug), `${slug} is redirected but still published`);
    assert.ok(REDIRECTS.some((r) => r.source === `/blog/${slug}` && r.permanent), `${slug} must be a permanent redirect`);
  }
  assert.ok(Object.keys(POST_REDIRECTS).length >= 16);
});

test("no state hub links to a state-and-asset URL", () => {
  const hub = readFileSync(new URL("../app/unclaimed-property/[state]/page.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(hub, /\$\{s\.slug\}\/\$\{/, "state hub must not link to asset URLs");
});

console.log(`seo.test.mts: ${passed} passed`);
