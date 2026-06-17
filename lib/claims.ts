// Deterministic claim-guidance engine. Given a state, an asset type and a few claim
// facts, it produces a complexity tier, a document checklist and an estimated timeline.
// Everything here is computed from explicit rules (no fabricated per-state numbers) so
// the output is reproducible and unit-testable. The official state portal in lib/states.ts
// is always authoritative; this is informational guidance.

import { getAsset, type AssetType } from "./assets";
import { getState, type StateInfo } from "./states";

export type OwnerStatus = "self" | "business" | "heir";

export type ClaimInput = {
  stateSlug: string;
  assetSlug: string;
  estimatedValue?: number;
  ownerStatus?: OwnerStatus;
};

export type ClaimPlan = {
  state: StateInfo;
  asset: AssetType;
  complexity: "standard" | "enhanced" | "complex";
  complexityScore: number;
  timelineWeeks: { min: number; max: number };
  documents: string[];
  steps: string[];
  notarizationLikely: boolean;
  portal: string;
};

// Threshold (USD) at which most states require a notarized claim form.
export const NOTARIZATION_THRESHOLD = 1000;
// Threshold (USD) at which a claim is treated as high-value (extra review time).
export const HIGH_VALUE_THRESHOLD = 10000;

const BASE_OWNER_DOCS = [
  "Government-issued photo ID (driver's license, state ID or passport)",
  "Proof of your Social Security number (SSN card, W-2 or 1099)",
  "Proof of your current mailing address (recent utility bill or bank statement)",
];

const HEIR_DOCS = [
  "Certified copy of the original owner's death certificate",
  "Proof of your relationship or legal authority (heirship affidavit, letters testamentary)",
  "Copy of the will or letters of administration, if the estate was probated",
];

const BUSINESS_DOCS = [
  "Proof the business is in good standing (certificate of existence)",
  "Documentation of your authority to claim on the entity's behalf (board resolution or officer letter)",
];

const TIMELINES = {
  standard: { min: 6, max: 10 },
  enhanced: { min: 8, max: 16 },
  complex: { min: 12, max: 26 },
} as const;

export function buildClaimPlan(input: ClaimInput): ClaimPlan {
  const state = getState(input.stateSlug);
  const asset = getAsset(input.assetSlug);
  if (!state) throw new Error(`Unknown state: ${input.stateSlug}`);
  if (!asset) throw new Error(`Unknown asset type: ${input.assetSlug}`);

  const value = Math.max(0, input.estimatedValue ?? 0);
  const ownerStatus: OwnerStatus = input.ownerStatus ?? "self";

  // Complexity score: asset base + value tiers + ownership path.
  let score = asset.weight;
  if (value >= NOTARIZATION_THRESHOLD) score += 1;
  if (value >= HIGH_VALUE_THRESHOLD) score += 1;
  if (ownerStatus === "heir") score += 2;
  if (ownerStatus === "business") score += 1;

  const complexity: ClaimPlan["complexity"] =
    score <= 1 ? "standard" : score <= 3 ? "enhanced" : "complex";

  // Timeline: start from the tier, add slack for tangible safe-deposit retrieval.
  const base = TIMELINES[complexity];
  const timelineWeeks = asset.tangible
    ? { min: base.min + 2, max: base.max + 4 }
    : { min: base.min, max: base.max };

  const notarizationLikely = value >= NOTARIZATION_THRESHOLD || ownerStatus === "heir";

  // Document checklist, de-duplicated, in claim order.
  const documents: string[] = [...BASE_OWNER_DOCS, ...asset.extraDocs];
  if (ownerStatus === "heir") documents.push(...HEIR_DOCS);
  if (ownerStatus === "business") documents.push(...BUSINESS_DOCS);
  if (notarizationLikely) documents.push("A notarized claim form (required for higher-value or estate claims in most states)");

  const steps = buildSteps(state, asset, ownerStatus);

  return { state, asset, complexity, complexityScore: score, timelineWeeks, documents, steps, notarizationLikely, portal: state.portal };
}

function buildSteps(state: StateInfo, asset: AssetType, ownerStatus: OwnerStatus): string[] {
  const steps = [
    `Search the official ${state.agency} portal for your name (and former names, maiden names and previous addresses).`,
    `Open every matching ${asset.name.toLowerCase()} record and start a claim — there is never a fee to claim from the state.`,
    "Confirm your identity by uploading the documents in the checklist below.",
  ];
  if (ownerStatus === "heir") {
    steps.push("Attach the estate documents proving you are the legal heir or executor.");
  }
  steps.push(
    "Submit the claim online (or print and mail it if the property is tangible or over the online limit).",
    `Track the claim — ${state.name} typically acknowledges receipt by email and pays approved claims by check or direct deposit.`,
  );
  return steps;
}

// Rough national estimate used only for illustrative copy, never as a per-claim figure.
export const NATIONAL_FACTS = {
  totalHeldBillions: 70,
  programsCount: 52,
  feeToClaim: 0,
};
