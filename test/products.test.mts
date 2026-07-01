import assert from "node:assert";
import { PRODUCTS, getProduct, recommendedProduct, isProductPurchasable } from "../lib/products.ts";
import { buildClaimPlan } from "../lib/claims.ts";

let passed = 0;
function test(name: string, fn: () => void) {
  fn();
  passed++;
  console.log(`  ok - ${name}`);
}

// Registry integrity: stable ids, prices, and labels that match the numeric price.
test("product registry is well-formed", () => {
  assert.strictEqual(PRODUCTS.length, 2);
  const ids = new Set(PRODUCTS.map((p) => p.id));
  assert.strictEqual(ids.size, 2);
  for (const p of PRODUCTS) {
    assert.ok(p.priceUsd > 0, `${p.id} must have a positive price`);
    const labelValue = Number(p.priceLabel.replace(/[^0-9.]/g, ""));
    assert.strictEqual(labelValue, p.priceUsd, `${p.id} priceLabel must match priceUsd`);
    assert.ok(p.priceEnv.startsWith("STRIPE_PRICE_"), `${p.id} priceEnv must be a STRIPE_PRICE_* var`);
    assert.ok(p.includes.length >= 4, `${p.id} should list what's included`);
  }
});

// Heirs are always steered to the Estate Claim Report.
test("heir claims recommend the estate report", () => {
  const plan = buildClaimPlan({ stateSlug: "florida", assetSlug: "insurance", ownerStatus: "heir" });
  const rec = recommendedProduct({ plan, value: 0, ownerStatus: "heir" });
  assert.strictEqual(rec?.id, "estate-report");
});

// A meaningful self claim gets the Claim Kit.
test("self claim with real value recommends the claim kit", () => {
  const plan = buildClaimPlan({ stateSlug: "texas", assetSlug: "bank-accounts", estimatedValue: 500, ownerStatus: "self" });
  const rec = recommendedProduct({ plan, value: 500, ownerStatus: "self" });
  assert.strictEqual(rec?.id, "claim-kit");
});

// A trivial standard self claim gets no upsell (don't nag tiny claims).
test("tiny standard self claim recommends nothing", () => {
  const plan = buildClaimPlan({ stateSlug: "texas", assetSlug: "bank-accounts", estimatedValue: 50, ownerStatus: "self" });
  assert.strictEqual(plan.complexity, "standard");
  const rec = recommendedProduct({ plan, value: 50, ownerStatus: "self" });
  assert.strictEqual(rec, undefined);
});

// A complex self claim (securities) is upsold even with no entered value.
test("complex self claim recommends the kit without a value", () => {
  const plan = buildClaimPlan({ stateSlug: "ohio", assetSlug: "securities", ownerStatus: "self" });
  const rec = recommendedProduct({ plan, value: 0, ownerStatus: "self" });
  assert.strictEqual(rec?.id, "claim-kit");
});

// Billing is off unless both the secret key and the product's price id are present.
test("products are not purchasable without Stripe configuration", () => {
  delete process.env.STRIPE_SECRET_KEY;
  for (const p of PRODUCTS) assert.strictEqual(isProductPurchasable(p), false);

  process.env.STRIPE_SECRET_KEY = "sk_test_dummy";
  const kit = getProduct("claim-kit")!;
  assert.strictEqual(isProductPurchasable(kit), false, "still false without the price id");
  process.env[kit.priceEnv] = "price_dummy";
  assert.strictEqual(isProductPurchasable(kit), true);

  // Clean up so other test modules see an unconfigured environment.
  delete process.env.STRIPE_SECRET_KEY;
  delete process.env[kit.priceEnv];
});

console.log(`\n${passed} test blocks passed.`);
