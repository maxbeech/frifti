import assert from "node:assert";
import { buildClaimPlan, NOTARIZATION_THRESHOLD, HIGH_VALUE_THRESHOLD } from "../lib/claims.ts";
import { STATES } from "../lib/states.ts";
import { ASSET_TYPES } from "../lib/assets.ts";

let passed = 0;
function test(name: string, fn: () => void) {
  fn();
  passed++;
  console.log(`  ok - ${name}`);
}

// Case A: small self-claim on a bank account → standard, 6-10 weeks, 4 docs, no notary.
test("small bank-account self claim is standard", () => {
  const p = buildClaimPlan({ stateSlug: "texas", assetSlug: "bank-accounts", estimatedValue: 500, ownerStatus: "self" });
  assert.strictEqual(p.complexity, "standard");
  assert.strictEqual(p.complexityScore, 0);
  assert.deepStrictEqual(p.timelineWeeks, { min: 6, max: 10 });
  assert.strictEqual(p.documents.length, 4); // 3 base + 1 asset extra
  assert.strictEqual(p.notarizationLikely, false);
  assert.strictEqual(p.portal, "https://claimittexas.gov/");
});

// Case B: high-value securities self-claim → complex, 12-26 weeks, 6 docs, notary.
test("high-value securities self claim is complex", () => {
  const p = buildClaimPlan({ stateSlug: "new-york", assetSlug: "securities", estimatedValue: 15000, ownerStatus: "self" });
  assert.strictEqual(p.complexityScore, 4); // 2 asset + 1 (>=1000) + 1 (>=10000)
  assert.strictEqual(p.complexity, "complex");
  assert.deepStrictEqual(p.timelineWeeks, { min: 12, max: 26 });
  assert.strictEqual(p.documents.length, 6); // 3 base + 2 asset + 1 notary
  assert.strictEqual(p.notarizationLikely, true);
});

// Case C: heir insurance claim of unknown value → enhanced, 8-16 weeks, notary, heir docs.
test("heir insurance claim is enhanced with estate docs", () => {
  const p = buildClaimPlan({ stateSlug: "florida", assetSlug: "insurance", estimatedValue: 0, ownerStatus: "heir" });
  assert.strictEqual(p.complexityScore, 3); // 1 asset + 2 heir
  assert.strictEqual(p.complexity, "enhanced");
  assert.deepStrictEqual(p.timelineWeeks, { min: 8, max: 16 });
  // 3 base + 1 asset extra + 3 heir + 1 notary (heir always notarizes) = 8
  assert.strictEqual(p.documents.length, 8);
  assert.strictEqual(p.notarizationLikely, true);
  assert.ok(p.documents.some((d) => d.includes("death certificate")));
});

// Case D: tangible safe-deposit box adds retrieval slack to the timeline.
test("safe-deposit box adds tangible timeline slack", () => {
  const p = buildClaimPlan({ stateSlug: "ohio", assetSlug: "safe-deposit-boxes", estimatedValue: 0, ownerStatus: "self" });
  assert.strictEqual(p.complexityScore, 2); // weight 2, no value/heir add
  assert.strictEqual(p.complexity, "enhanced");
  // enhanced base {8,16} + tangible {+2,+4} = {10,20}
  assert.deepStrictEqual(p.timelineWeeks, { min: 10, max: 20 });
});

// Case E: thresholds and unknown inputs.
test("thresholds and error handling", () => {
  assert.strictEqual(NOTARIZATION_THRESHOLD, 1000);
  assert.strictEqual(HIGH_VALUE_THRESHOLD, 10000);
  assert.throws(() => buildClaimPlan({ stateSlug: "atlantis", assetSlug: "bank-accounts" }));
  assert.throws(() => buildClaimPlan({ stateSlug: "texas", assetSlug: "bitcoin" }));
});

// Data integrity: every state has a unique slug and an official portal URL.
test("state and asset data integrity", () => {
  assert.strictEqual(STATES.length, 52); // 50 states + DC + PR
  const slugs = new Set(STATES.map((s) => s.slug));
  assert.strictEqual(slugs.size, 52);
  for (const s of STATES) assert.ok(/^https:\/\//.test(s.portal), `${s.name} portal must be https`);
  assert.strictEqual(ASSET_TYPES.length, 6);
});

console.log(`\n${passed} test blocks passed.`);
