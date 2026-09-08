import assert from "node:assert";
import { isValidEventName } from "../lib/openhelm-analytics-mp.ts";

let passed = 0;
function test(name: string, fn: () => void) {
  fn();
  passed++;
  console.log(`  ok - ${name}`);
}

// Every event name instrumented across the product's user journeys must be a name GA4
// actually accepts, per the same validator the Measurement Protocol sender uses — this pins
// the whole set against silently-always-zero metrics.
const JOURNEY_EVENT_NAMES = [
  "page_view",
  "state_selected",
  "claim_plan_generated",
  "portal_click",
  "select_item",
  "begin_checkout",
  "purchase",
  "partner_offer_click",
  "error_boundary_shown",
  "error_recovery_action",
];

test("every instrumented journey event name is a valid GA4 event name", () => {
  for (const name of JOURNEY_EVENT_NAMES) {
    assert.ok(isValidEventName(name), `expected "${name}" to be a valid GA4 event name`);
  }
});

test("rejects an event name GA4 would reject", () => {
  assert.strictEqual(isValidEventName("has a space"), false);
  assert.strictEqual(isValidEventName("1_starts_with_digit"), false);
});

console.log(`analytics.test.mts: ${passed} passed`);
