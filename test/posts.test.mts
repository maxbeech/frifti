import assert from "node:assert";
import { POSTS } from "../lib/posts/index.ts";
import type { Block } from "../lib/posts/types.ts";

let passed = 0;
function test(name: string, fn: () => void) {
  fn();
  passed++;
  console.log(`  ok - ${name}`);
}

function wordCount(body: Block[]): number {
  let words = 0;
  const add = (s: string) => { words += s.trim().split(/\s+/).filter(Boolean).length; };
  for (const b of body) {
    if ("h2" in b) add(b.h2);
    else if ("h3" in b) add(b.h3);
    else if ("p" in b) add(b.p);
    else if ("note" in b) add(b.note);
    else if ("quote" in b) add(b.quote.text);
    else if ("ul" in b) b.ul.forEach(add);
    else if ("ol" in b) b.ol.forEach(add);
    else if ("table" in b) b.table.rows.forEach((row) => row.forEach(add));
  }
  return words;
}

test("expects at least 20 posts", () => {
  assert.ok(POSTS.length >= 20, `expected at least 20 posts, found ${POSTS.length}`);
});

test("slugs are unique and match published category enum", () => {
  const slugs = new Set(POSTS.map((p) => p.slug));
  assert.strictEqual(slugs.size, POSTS.length, "duplicate slug found");
  for (const p of POSTS) {
    assert.ok(["academy", "news", "reviews"].includes(p.category), `${p.slug} has invalid category`);
  }
});

test("every post meets SEO metadata requirements", () => {
  for (const p of POSTS) {
    assert.ok(p.description.length <= 155, `${p.slug} description is ${p.description.length} chars (max 155)`);
    assert.ok(p.primaryKeyword.length > 0, `${p.slug} missing primaryKeyword`);
    assert.ok(p.supportingKeywords.length >= 6 && p.supportingKeywords.length <= 12, `${p.slug} has ${p.supportingKeywords.length} supporting keywords (want 6-12)`);
    assert.ok(p.longTailPhrases.length >= 2, `${p.slug} needs at least 2 long-tail phrases`);
  }
});

test("every post is a substantial, complete article", () => {
  for (const p of POSTS) {
    const words = wordCount(p.body);
    assert.ok(words >= 1000 && words <= 2700, `${p.slug} body is ${words} words (want ~1200-2500)`);
    assert.ok(p.faq.length >= 3 && p.faq.length <= 5, `${p.slug} has ${p.faq.length} FAQ entries (want 3-5)`);
    assert.ok(p.body.some((b) => "table" in b), `${p.slug} is missing a table/chart block`);
    assert.ok(p.body.some((b) => "quote" in b), `${p.slug} is missing an expert quote block`);
    assert.ok(p.body.some((b) => "note" in b), `${p.slug} is missing a TL;DR note block`);
  }
});

test("every post has a unique, valid featured image", () => {
  const seen = new Set<string>();
  for (const p of POSTS) {
    assert.ok(p.featuredImage.src.startsWith("https://images.pexels.com/"), `${p.slug} featured image must be a Pexels URL`);
    assert.ok(p.featuredImage.alt.length >= 10, `${p.slug} featured image alt text is too short`);
    assert.ok(!seen.has(p.featuredImage.src), `${p.slug} reuses a featured image already used by another post`);
    seen.add(p.featuredImage.src);
  }
});

test("related links point at real posts, and review posts carry review data", () => {
  const slugs = new Set(POSTS.map((p) => p.slug));
  for (const p of POSTS) {
    assert.ok(p.related.length >= 1 && p.related.length <= 6, `${p.slug} should list 1-6 related posts`);
    for (const r of p.related) assert.ok(slugs.has(r), `${p.slug} links to unknown related slug "${r}"`);
    if (p.category === "reviews") {
      assert.ok(p.review, `${p.slug} is a review post but has no review block`);
      assert.ok(p.review!.ratingValue >= 1 && p.review!.ratingValue <= 5, `${p.slug} review rating must be 1-5`);
    }
  }
});

console.log(`posts.test.mts: ${passed} passed`);
