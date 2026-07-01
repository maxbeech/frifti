import assert from "node:assert";
import { buildClaimKit } from "../lib/kit.ts";
import { buildClaimPlan } from "../lib/claims.ts";

let passed = 0;
function test(name: string, fn: () => void) {
  fn();
  passed++;
  console.log(`  ok - ${name}`);
}

// A standard Claim Kit mirrors the engine's checklist and carries the personalised letter.
test("claim kit is personalised and complete", () => {
  const kit = buildClaimKit({ stateSlug: "texas", assetSlug: "bank-accounts", estimatedValue: 500, ownerStatus: "self", product: "claim-kit" });
  const plan = buildClaimPlan({ stateSlug: "texas", assetSlug: "bank-accounts", estimatedValue: 500, ownerStatus: "self" });

  assert.strictEqual(kit.checklist.length, plan.documents.length);
  for (const c of kit.checklist) assert.ok(c.why.length > 0, "every checklist item explains why");
  assert.ok(kit.coverLetter.includes("Texas Comptroller") || kit.coverLetter.includes(plan.state.agency));
  assert.ok(kit.coverLetter.includes("[YOUR FULL LEGAL NAME"), "letter has fill-in fields");
  assert.strictEqual(kit.followUps.length, 5);
  assert.ok(kit.rejectionTips.length >= 3);
  assert.strictEqual(kit.estateSections, undefined, "no estate sections on a self kit");
});

// Follow-up offsets are non-negative and ordered, anchored to the plan timeline.
test("follow-up schedule is ordered and bounded by the timeline", () => {
  const kit = buildClaimKit({ stateSlug: "ohio", assetSlug: "securities", ownerStatus: "self", product: "claim-kit" });
  const offsets = kit.followUps.map((f) => f.offsetWeeks);
  for (let i = 1; i < offsets.length; i++) assert.ok(offsets[i] >= offsets[i - 1], "offsets are non-decreasing");
  assert.strictEqual(offsets[0], 0);
  assert.strictEqual(offsets.at(-1), kit.plan.timelineWeeks.max);
});

// The Estate Report adds estate sections and the death-certificate checklist item.
test("estate report includes estate guidance", () => {
  const kit = buildClaimKit({ stateSlug: "florida", assetSlug: "insurance", ownerStatus: "heir", product: "estate-report" });
  assert.ok(kit.title.startsWith("Estate Claim Report"));
  assert.ok(kit.estateSections && kit.estateSections.length >= 3);
  assert.ok(kit.checklist.some((c) => c.item.toLowerCase().includes("death certificate")));
  assert.ok(kit.rejectionTips.some((t) => t.problem.toLowerCase().includes("estate")));
  assert.ok(kit.intro.toLowerCase().includes("estate"));
});

// Generation is fully deterministic (no dates/randomness) so it is safe to cache and test.
test("kit generation is deterministic", () => {
  const a = buildClaimKit({ stateSlug: "california", assetSlug: "wages", estimatedValue: 1200, ownerStatus: "self", product: "claim-kit" });
  const b = buildClaimKit({ stateSlug: "california", assetSlug: "wages", estimatedValue: 1200, ownerStatus: "self", product: "claim-kit" });
  assert.deepStrictEqual(a, b);
});

// Bad input fails loudly (delegates to the engine's validation).
test("unknown state/asset throws", () => {
  assert.throws(() => buildClaimKit({ stateSlug: "atlantis", assetSlug: "bank-accounts", product: "claim-kit" }));
});

console.log(`\n${passed} test blocks passed.`);
