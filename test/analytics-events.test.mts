import assert from "node:assert";
import { analyticsUserRef } from "../lib/analytics-ref.ts";
import { userRefFor } from "../lib/openhelm-analytics-mp.ts";
import { PRODUCTS } from "../lib/products.ts";
import { claimOnce, checkoutReturnEvent, purchaseCall, purchaseFailureReason, EVENTS } from "../lib/analytics-events.ts";

let passed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  await fn();
  passed++;
  console.log(`  ok - ${name}`);
}

const kit = PRODUCTS[0];
const kitRef = { id: kit.id, name: kit.name, priceUsd: kit.priceUsd };

await test("user ref matches the contract test vector", async () => {
  assert.strictEqual(analyticsUserRef("00000000-0000-0000-0000-000000000000"), "12b9377cbe7e5c94");
});

await test("server and browser hashing agree, and the ref is 16 hex characters", async () => {
  const id = "cs_test_a1B2c3D4e5";
  assert.strictEqual(analyticsUserRef(id), await userRefFor(id));
  assert.match(analyticsUserRef(id), /^[0-9a-f]{16}$/);
  assert.ok(!analyticsUserRef(id).includes(id));
});

await test("failure and cancel events carry a short code, never free text", () => {
  assert.deepStrictEqual(checkoutReturnEvent("error", "claim-kit"), {
    name: "checkout_failed",
    params: { reason: "checkout_error", product: "claim-kit" },
  });
  assert.deepStrictEqual(checkoutReturnEvent("soon", "estate-report"), {
    name: "checkout_failed",
    params: { reason: "not_available", product: "estate-report" },
  });
  assert.deepStrictEqual(checkoutReturnEvent("cancelled", "claim-kit"), {
    name: "checkout_cancelled",
    params: { product: "claim-kit" },
  });
  assert.strictEqual(checkoutReturnEvent("", "claim-kit"), null);
  assert.strictEqual(checkoutReturnEvent("<script>", "claim-kit"), null);
});

await test("every event checkoutReturnEvent can return is a declared event", () => {
  const declared = new Set<string>(Object.values(EVENTS));
  for (const s of ["error", "soon", "cancelled"]) {
    const call = checkoutReturnEvent(s, "claim-kit");
    assert.ok(call && declared.has(call.name), `${s} -> ${call?.name}`);
  }
});

await test("purchase reports what Stripe charged, with the catalogue item", () => {
  assert.deepStrictEqual(purchaseCall({ sessionId: "cs_1", amountTotal: 12.5, currency: "usd", product: kitRef }), {
    name: "purchase",
    params: {
      transaction_id: "cs_1",
      currency: "USD",
      value: 12.5,
      items: [{ item_id: kit.id, item_name: kit.name, price: kit.priceUsd }],
    },
  });
});

await test("purchase falls back to the catalogue price only when Stripe omits the amount", () => {
  const call = purchaseCall({ sessionId: "cs_2", amountTotal: null, currency: null, product: kitRef });
  assert.ok(call && call.name === "purchase");
  assert.strictEqual(call.params.value, kit.priceUsd);
  assert.strictEqual(call.params.currency, "USD");
});

await test("purchase without a known product still reports the charge, without items", () => {
  const call = purchaseCall({ sessionId: "cs_3", amountTotal: 30, currency: "usd", product: null });
  assert.ok(call && call.name === "purchase");
  assert.strictEqual(call.params.items, undefined);
  assert.strictEqual(call.params.value, 30);
});

await test("no charge, or no session, is not a purchase", () => {
  assert.strictEqual(purchaseCall({ sessionId: "cs_4", amountTotal: 0, currency: "usd", product: kitRef }), null);
  assert.strictEqual(purchaseCall({ sessionId: "", amountTotal: 10, currency: "usd", product: kitRef }), null);
  assert.strictEqual(purchaseCall({ sessionId: "cs_5", amountTotal: null, currency: null, product: null }), null);
});

await test("purchase failure reasons distinguish unconfigured, unreachable and unpaid", () => {
  assert.strictEqual(purchaseFailureReason({ configured: false, session: null }), "not_configured");
  assert.strictEqual(purchaseFailureReason({ configured: true, session: null }), "unverified");
  assert.strictEqual(purchaseFailureReason({ configured: true, session: { paid: false } }), "not_paid");
  assert.strictEqual(purchaseFailureReason({ configured: true, session: { paid: true } }), "no_amount");
});

await test("claimOnce lets a key through once, and never blocks on broken storage", () => {
  const data = new Map<string, string>();
  const store = { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) };
  assert.strictEqual(claimOnce(store, "a"), true);
  assert.strictEqual(claimOnce(store, "a"), false);
  assert.strictEqual(claimOnce(store, "b"), true);
  const broken = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); } };
  assert.strictEqual(claimOnce(broken, "a"), true);
  assert.strictEqual(claimOnce(null, "a"), true);
});

console.log(`analytics-events.test.mts: ${passed} passed`);
