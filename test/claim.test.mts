// Engine tests — validate the claim-guidance engine against hand-computed
// values, plus data integrity for the 50-state + DC dataset and asset types.
// Run: npm test
import { buildClaimGuide, BASE_WEEKS, NOTARIZE_THRESHOLD_USD } from "../lib/calc/claim.ts";
import { ASSET_TYPES, getAssetType } from "../lib/data/assetTypes.ts";
import { STATES, getState } from "../lib/data/states.ts";

let pass = 0,
  fail = 0;
function eq(actual: unknown, expected: unknown, msg: string) {
  if (actual === expected) pass++;
  else {
    fail++;
    console.error(`✗ ${msg}\n    expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}
function ok(cond: boolean, msg: string) {
  eq(cond, true, msg);
}

const bank = getAssetType("bank-accounts")!;
const insurance = getAssetType("insurance")!;
const stocks = getAssetType("stocks-dividends")!;

// ---- constants are the documented defaults ----
eq(NOTARIZE_THRESHOLD_USD, 1000, "notarize threshold = $1000");
eq(BASE_WEEKS.min, 2, "base min = 2 weeks");
eq(BASE_WEEKS.max, 8, "base max = 8 weeks");

// ---- owner, small bank account: simplest path ----
const ownerSmall = buildClaimGuide({ asset: bank, claimantType: "owner", estimatedValueUSD: 200 });
eq(ownerSmall.notarizationRequired, false, "owner + $200 → no notarization");
eq(ownerSmall.timelineWeeks.min, 2, "owner small timeline min = 2");
eq(ownerSmall.timelineWeeks.max, 8, "owner small timeline max = 8");
ok(!ownerSmall.requiredDocuments.some((d) => /death certificate/i.test(d)), "owner claim has no death certificate");
ok(ownerSmall.requiredDocuments.some((d) => /address on the unclaimed record/i.test(d)), "owner claim needs proof of record address");

// ---- owner, high-value bank account: notarization kicks in at threshold ----
const ownerBig = buildClaimGuide({ asset: bank, claimantType: "owner", estimatedValueUSD: 1000 });
eq(ownerBig.notarizationRequired, true, "owner + $1000 (==threshold) → notarization required");
eq(ownerBig.timelineWeeks.min, 3, "owner high-value timeline min = 2+1 = 3");
eq(ownerBig.timelineWeeks.max, 11, "owner high-value timeline max = 8+3 = 11");

// ---- heir, insurance $5000: death cert + relationship + probate, notarized ----
const heir = buildClaimGuide({ asset: insurance, claimantType: "heir", estimatedValueUSD: 5000 });
eq(heir.notarizationRequired, true, "heir → notarization required");
eq(heir.timelineWeeks.min, 7, "heir high-value timeline min = 2+4+1 = 7");
eq(heir.timelineWeeks.max, 23, "heir high-value timeline max = 8+12+3 = 23");
ok(heir.requiredDocuments.some((d) => /death certificate/i.test(d)), "heir needs death certificate");
ok(heir.requiredDocuments.some((d) => /probate|small-estate/i.test(d)), "heir needs probate documentation");
ok(heir.commonRejections.some((r) => /relationship|estate/i.test(r)), "heir rejection mentions relationship/estate");

// ---- business, stocks $10000: EIN + authority docs, notarized ----
const biz = buildClaimGuide({ asset: stocks, claimantType: "business", estimatedValueUSD: 10000 });
eq(biz.notarizationRequired, true, "business → notarization required");
eq(biz.timelineWeeks.min, 5, "business high-value timeline min = 2+2+1 = 5");
eq(biz.timelineWeeks.max, 17, "business high-value timeline max = 8+6+3 = 17");
ok(biz.requiredDocuments.some((d) => /EIN/i.test(d)), "business needs EIN documentation");
ok(biz.requiredDocuments.some((d) => /authorized officer/i.test(d)), "business needs authority proof");

// ---- multi-asset owner: each extra asset adds +1/+4 weeks ----
const multi = buildClaimGuide({ asset: bank, claimantType: "owner", estimatedValueUSD: 200, assetCount: 2 });
eq(multi.timelineWeeks.min, 3, "2-asset owner timeline min = 2+1 = 3");
eq(multi.timelineWeeks.max, 12, "2-asset owner timeline max = 8+4 = 12");

// ---- notarization adds a notary step ----
ok(heir.steps.some((s) => /notary/i.test(s)), "notarized claim has a notary step");
ok(!ownerSmall.steps.some((s) => /notary/i.test(s)), "non-notarized claim has no notary step");

// ---- data integrity ----
eq(STATES.length, 51, "50 states + DC = 51 program pages");
eq(new Set(STATES.map((s) => s.slug)).size, 51, "state slugs are unique");
ok(STATES.every((s) => s.official.startsWith("https://")), "every state has an https official portal");
ok(STATES.every((s) => s.agency.length > 5), "every state names its administering agency");
eq(getState("california")!.agency.includes("Controller"), true, "California → State Controller's Office");
eq(getState("texas")!.official.includes("claimittexas.gov"), true, "Texas → claimittexas.gov");
eq(new Set(ASSET_TYPES.map((a) => a.slug)).size, ASSET_TYPES.length, "asset-type slugs are unique");
ok(ASSET_TYPES.length >= 6, "at least 6 asset-type categories");
ok(ASSET_TYPES.every((a) => a.proofDocuments.length > 0), "every asset type lists proof documents");

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
