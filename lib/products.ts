// Single source of truth for Frifti's optional, one-time premium products.
// These are NEVER a fee to claim from a state — claiming is always free. They are
// paid-for help organising and filing YOUR own claim faster, sold once (not a
// subscription). The deliverable content is generated deterministically in lib/kit.ts.
//
// Each product maps to a Stripe Price via an env var (the Price's amount in Stripe must
// match `priceUsd` here — this file is the display source of truth, Stripe is the billing
// source of truth). When the env var is absent the product shows an honest "coming soon"
// state instead of a buy button (see /premium and /api/checkout).

import type { ClaimPlan, OwnerStatus } from "./claims";

export type ProductId = "claim-kit" | "estate-report";

export type RecommendContext = {
  plan: ClaimPlan;
  value: number;
  ownerStatus: OwnerStatus;
};

export type Product = {
  id: ProductId;
  name: string;
  tagline: string;
  /** Numeric price in USD — must equal the amount configured on the Stripe Price. */
  priceUsd: number;
  /** Display label, kept in sync with priceUsd by a unit test. */
  priceLabel: string;
  /** Name of the env var holding the Stripe Price ID for this product. */
  priceEnv: string;
  forWho: string;
  includes: string[];
  /** Whether this product is the best fit for a given claim context. */
  recommendFor: (ctx: RecommendContext) => boolean;
};

export const PRODUCTS: Product[] = [
  {
    id: "claim-kit",
    name: "Claim Kit",
    tagline: "Everything filled in and ready to file, for your specific state and property type.",
    priceUsd: 14.99,
    priceLabel: "$14.99",
    priceEnv: "STRIPE_PRICE_CLAIM_KIT",
    forWho: "Anyone filing a standard claim who wants it done right the first time.",
    includes: [
      "A pre-written cover letter addressed to your state's unclaimed-property office",
      "A personalised document checklist with what each item proves and where to get it",
      "A dated follow-up schedule so a stalled claim never slips through the cracks",
      "A step-by-step submission walkthrough for your exact state and property type",
      "The most common rejection reasons, and how to avoid each one",
      "A printable, save-anywhere PDF-ready format (no account needed)",
    ],
    // Default product. Best fit for non-estate claims, especially where there is real
    // money at stake, a notarised form, or above-standard complexity.
    recommendFor: ({ plan, value, ownerStatus }) =>
      ownerStatus !== "heir" && (value >= 250 || plan.notarizationLikely || plan.complexity !== "standard"),
  },
  {
    id: "estate-report",
    name: "Estate Claim Report",
    tagline: "A complete, executor-ready pack for recovering a deceased relative's unclaimed property.",
    priceUsd: 49,
    priceLabel: "$49",
    priceEnv: "STRIPE_PRICE_ESTATE_REPORT",
    forWho: "Heirs and executors recovering property for someone who has died.",
    includes: [
      "Everything in the Claim Kit, written for an estate/heir claim",
      "A multi-state heir search plan covering every state the deceased lived, worked or banked in",
      "An affidavit-of-heirship guide with the wording states expect",
      "The exact estate documents to attach (death certificate, letters testamentary, will)",
      "Guidance for probated vs. non-probated estates and small-estate thresholds",
      "A printable, save-anywhere PDF-ready format (no account needed)",
    ],
    recommendFor: ({ ownerStatus }) => ownerStatus === "heir",
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

/** The single best product to surface for a given claim context, if any. */
export function recommendedProduct(ctx: RecommendContext): Product | undefined {
  // Estate takes priority for heirs; otherwise the Claim Kit is the default upsell.
  const estate = getProduct("estate-report")!;
  if (estate.recommendFor(ctx)) return estate;
  const kit = getProduct("claim-kit")!;
  if (kit.recommendFor(ctx)) return kit;
  return undefined;
}

/** True when billing for this product is live (Stripe secret + this product's price set). */
export function isProductPurchasable(product: Product): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env[product.priceEnv]);
}
