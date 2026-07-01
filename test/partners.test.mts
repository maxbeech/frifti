import assert from "node:assert";
import { buildClaimPlan } from "../lib/claims.ts";

// Set affiliate ids BEFORE importing lib/partners so the module captures them at eval time.
// NotaryLive uses a bare ID (Post Affiliate Pro a_aid=), Trust & Will uses a full Impact URL.
process.env.NEXT_PUBLIC_AFFILIATE_NOTARYLIVE = "cw-test";
process.env.NEXT_PUBLIC_AFFILIATE_TRUSTWILL = "https://trustandwill.sjv.io/testXXX";
const { PARTNERS, partnersForPlan, buildPartnerLink, hasAffiliatePartners } = await import("../lib/partners.ts");

let passed = 0;
function test(name: string, fn: () => void) {
  fn();
  passed++;
  console.log(`  ok - ${name}`);
}

test("partner registry is well-formed", () => {
  const slugs = new Set(PARTNERS.map((p) => p.slug));
  assert.strictEqual(slugs.size, PARTNERS.length, "slugs must be unique");
  for (const p of PARTNERS) assert.ok(/^https:\/\//.test(p.baseUrl), `${p.slug} baseUrl must be https`);
});

// Heir + insurance: notarizationLikely is always true for heirs (claims.ts:84).
// Priority order: notarylive(1), trust-will(1), naic-life-locator(2), proof(3), capitalize(5).
// Cap=3 gives: notarylive, trust-will, naic-life-locator. proof(3) and capitalize(5) are cut.
test("heir insurance claim surfaces the most relevant partners", () => {
  const plan = buildClaimPlan({ stateSlug: "florida", assetSlug: "insurance", ownerStatus: "heir" });
  const slugs = partnersForPlan({ plan, value: 0, ownerStatus: "heir" }).map((p) => p.slug);
  assert.ok(slugs.includes("notarylive"), "primary notarization option for heirs");
  assert.ok(slugs.includes("trust-will"), "estate help for heirs");
  assert.ok(slugs.includes("naic-life-locator"), "free locator for insurance");
  assert.strictEqual(slugs.includes("capitalize"), false, "lower-priority finder is capped out");
  // Raising cap to 5 lets both proof and capitalize in.
  const wider = partnersForPlan({ plan, value: 0, ownerStatus: "heir" }, 5).map((p) => p.slug);
  assert.ok(wider.includes("capitalize"), "capitalize visible at wider cap");
  assert.ok(wider.includes("proof"), "proof visible at wider cap");
});

// On a plain self claim with no other matches, only the always-on 401k finder shows.
test("always-on partner shows on a plain self claim", () => {
  const plan = buildClaimPlan({ stateSlug: "texas", assetSlug: "bank-accounts", estimatedValue: 50, ownerStatus: "self" });
  const slugs = partnersForPlan({ plan, value: 50, ownerStatus: "self" }).map((p) => p.slug);
  assert.deepStrictEqual(slugs, ["capitalize"]);
});

// Notarisation partners appear only when a notarised form is likely.
test("notary partners are gated on notarization likelihood", () => {
  const highValue = buildClaimPlan({ stateSlug: "texas", assetSlug: "bank-accounts", estimatedValue: 5000, ownerStatus: "self" });
  assert.ok(highValue.notarizationLikely);
  const highSlugs = partnersForPlan({ plan: highValue, value: 5000, ownerStatus: "self" }).map((p) => p.slug);
  assert.ok(highSlugs.includes("notarylive"), "NotaryLive shown when notarization likely");

  const lowValue = buildClaimPlan({ stateSlug: "texas", assetSlug: "bank-accounts", estimatedValue: 50, ownerStatus: "self" });
  assert.strictEqual(lowValue.notarizationLikely, false);
  const lowSlugs = partnersForPlan({ plan: lowValue, value: 50, ownerStatus: "self" }).map((p) => p.slug);
  assert.ok(!lowSlugs.includes("notarylive"), "NotaryLive hidden when notarization not needed");
  assert.ok(!lowSlugs.includes("proof"), "Proof hidden when notarization not needed");
});

// The list is capped and ordered by priority (most relevant first).
test("partner list is capped and priority-ordered", () => {
  const plan = buildClaimPlan({ stateSlug: "florida", assetSlug: "insurance", ownerStatus: "heir" });
  const list = partnersForPlan({ plan, value: 5000, ownerStatus: "heir" }, 3);
  assert.ok(list.length <= 3);
  for (let i = 1; i < list.length; i++) assert.ok(list[i - 1].priority <= list[i].priority);
});

// Bare-ID affiliate link (NotaryLive / Post Affiliate Pro): appends ?a_aid=ID.
test("bare-id affiliate link appends the correct param", () => {
  const nl = PARTNERS.find((p) => p.slug === "notarylive")!;
  const link = buildPartnerLink(nl);
  assert.strictEqual(link.isAffiliate, true);
  assert.ok(link.url.includes("a_aid=cw-test"), `expected a_aid=cw-test, got: ${link.url}`);
  assert.strictEqual(hasAffiliatePartners([nl]), true);
});

// Full-URL affiliate link (Impact.com): uses the stored URL directly, never appends params.
test("full-url affiliate link (Impact) is used as-is", () => {
  const tw = PARTNERS.find((p) => p.slug === "trust-will")!;
  const link = buildPartnerLink(tw);
  assert.strictEqual(link.isAffiliate, true);
  assert.strictEqual(link.url, "https://trustandwill.sjv.io/testXXX");
});

// Unconfigured partner falls back to plain public URL.
test("unconfigured affiliate falls back to plain public URL", () => {
  const capitalize = PARTNERS.find((p) => p.slug === "capitalize")!; // no env id set
  const capLink = buildPartnerLink(capitalize);
  assert.strictEqual(capLink.isAffiliate, false);
  assert.strictEqual(capLink.url, capitalize.baseUrl);
  assert.strictEqual(hasAffiliatePartners([capitalize]), false);
});

// Free/official resources never become affiliate links.
test("free resources are never affiliate links", () => {
  const naic = PARTNERS.find((p) => p.slug === "naic-life-locator")!;
  assert.strictEqual(naic.free, true);
  assert.strictEqual(buildPartnerLink(naic).isAffiliate, false);
});

console.log(`\n${passed} test blocks passed.`);
