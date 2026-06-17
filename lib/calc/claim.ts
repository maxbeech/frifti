// Claim-guidance engine. Given an asset type, who is claiming, and the rough
// value, it produces a deterministic, defensible claim plan: the documents you
// will typically need, the ordered steps, whether notarization is usually
// required, common rejection reasons, and a TYPICAL processing-time estimate
// expressed as a week range.
//
// IMPORTANT (No-Fallbacks): the week range is a *general* estimate of how long
// straightforward claims commonly take across states — it is NOT a state SLA or
// guarantee. Exact requirements and timelines are set by each state program;
// the per-state pages always link to the authoritative official portal.

import type { AssetType } from "../data/assetTypes.ts";

export type ClaimantType = "owner" | "heir" | "business";

/** Claims at or above this value commonly require a notarized affidavit. */
export const NOTARIZE_THRESHOLD_USD = 1000;

/** Base week range for a straightforward, single-asset owner claim. */
export const BASE_WEEKS: Weeks = { min: 2, max: 8 };

const HEIR_WEEKS: Weeks = { min: 4, max: 12 };
const BUSINESS_WEEKS: Weeks = { min: 2, max: 6 };
const HIGH_VALUE_WEEKS: Weeks = { min: 1, max: 3 };
const PER_EXTRA_ASSET_WEEKS: Weeks = { min: 1, max: 4 };

export interface Weeks {
  min: number;
  max: number;
}

export interface ClaimInput {
  asset: AssetType;
  claimantType: ClaimantType;
  estimatedValueUSD: number;
  /** Number of distinct properties being claimed (default 1). */
  assetCount?: number;
}

export interface ClaimGuide {
  claimantType: ClaimantType;
  notarizationRequired: boolean;
  timelineWeeks: Weeks;
  requiredDocuments: string[];
  steps: string[];
  commonRejections: string[];
}

function addWeeks(a: Weeks, b: Weeks): Weeks {
  return { min: a.min + b.min, max: a.max + b.max };
}

export function buildClaimGuide(input: ClaimInput): ClaimGuide {
  const { asset, claimantType, estimatedValueUSD } = input;
  const assetCount = Math.max(1, input.assetCount ?? 1);
  const highValue = estimatedValueUSD >= NOTARIZE_THRESHOLD_USD;
  const notarizationRequired = claimantType !== "owner" || highValue;

  // ---- timeline ----
  let timelineWeeks = { ...BASE_WEEKS };
  if (claimantType === "heir") timelineWeeks = addWeeks(timelineWeeks, HEIR_WEEKS);
  if (claimantType === "business") timelineWeeks = addWeeks(timelineWeeks, BUSINESS_WEEKS);
  if (highValue) timelineWeeks = addWeeks(timelineWeeks, HIGH_VALUE_WEEKS);
  for (let i = 1; i < assetCount; i++) timelineWeeks = addWeeks(timelineWeeks, PER_EXTRA_ASSET_WEEKS);

  // ---- documents ----
  const requiredDocuments: string[] = [
    "Government-issued photo ID (driver's license, state ID or passport)",
    "Completed official state claim form",
    "Proof of your Social Security number or Taxpayer ID",
    ...asset.proofDocuments.filter((d) => !/photo id/i.test(d)),
  ];
  if (claimantType === "owner") {
    requiredDocuments.push("Proof of the address on the unclaimed record (utility bill, old statement or similar)");
  }
  if (claimantType === "heir") {
    requiredDocuments.push(
      "Certified death certificate of the original owner",
      "Proof of your relationship to the owner (birth/marriage certificate)",
      "Probate documentation: letters testamentary, or a small-estate affidavit where the estate qualifies",
    );
  }
  if (claimantType === "business") {
    requiredDocuments.push(
      "Proof the business exists (Articles of Incorporation or business registration)",
      "Federal EIN documentation",
      "Proof you are an authorized officer or signer for the business",
    );
  }

  // ---- steps ----
  const steps: string[] = [
    "Search the official state unclaimed-property database for your (or the owner's) name and any prior names.",
    "Confirm the property is yours by matching the reported name and last-known address.",
    "Start the claim on the state portal and download or complete the official claim form.",
    `Gather the ${requiredDocuments.length} required documents listed below.`,
  ];
  if (notarizationRequired) {
    steps.push("Sign the claim affidavit in front of a notary (required for this claim type/value in most states).");
  }
  steps.push(
    "Submit the claim by the state's accepted method (secure online upload or mail).",
    "Track your claim status online and respond promptly to any requests for more documentation.",
    `Receive payment — straightforward claims like this typically resolve in about ${timelineWeeks.min}–${timelineWeeks.max} weeks.`,
  );

  // ---- common rejections ----
  const commonRejections: string[] = [
    "The name or address on the claim does not match the reported record.",
    "Proof of identity is missing, expired or illegible.",
    "The claim form is incomplete or unsigned.",
  ];
  if (notarizationRequired) commonRejections.push("The affidavit was not notarized where the state requires it.");
  if (claimantType === "heir") commonRejections.push("Insufficient proof of relationship or estate/probate authority.");
  if (claimantType === "business") commonRejections.push("No proof of authority to act on behalf of the business.");

  return { claimantType, notarizationRequired, timelineWeeks, requiredDocuments, steps, commonRejections };
}

/** Friendly label for an estimated week range. */
export function timelineLabel(w: Weeks): string {
  return `${w.min}–${w.max} weeks`;
}
