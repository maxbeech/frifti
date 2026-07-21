// Single source of truth for the adjacent services Frifti recommends alongside a
// claim. These are deliberately NOT "finder" or "asset recovery" firms — the whole site
// tells people never to pay a finder to claim their own property. Instead these are
// genuinely useful services tied to a real step in the journey: getting a form notarised,
// sorting out an estate, or tracking down other lost money (old 401ks, life policies).
//
// Trust rules baked in here:
//  - A partner only appears when it is actually relevant to the user's claim.
//  - Free / official tools (e.g. the NAIC life-policy locator) are recommended too, and
//    never earn us anything — they keep the recommendations honest.
//  - A link only becomes an affiliate link when its NEXT_PUBLIC_AFFILIATE_* id is set.
//    Until then we still link to the real service; we just don't earn a commission.
//  - Affiliate links are rendered rel="sponsored" with a visible disclosure.

import type { ClaimPlan, OwnerStatus } from "./claims";

export type PartnerTrigger = {
  ownerStatus?: OwnerStatus[];
  assetSlugs?: string[];
  whenNotarizationLikely?: boolean;
  minValue?: number;
  always?: boolean;
};

export type Partner = {
  slug: string;
  name: string;
  /** Short category label, e.g. "Online notarisation". */
  category: string;
  /** One plain sentence on why it's relevant to this claim. */
  pitch: string;
  cta: string;
  /** The real, public destination. Used as-is when no affiliate id is configured. */
  baseUrl: string;
  /** Query-param name the affiliate id is appended under, when configured. */
  affiliateParam?: string;
  /** Documents which env var supplies this partner's affiliate id (resolved via AFFILIATE_IDS). */
  affiliateEnv?: string;
  /** Free / official resource: never earns commission, shown purely to help the user. */
  free?: boolean;
  /** Lower number = shown first. */
  priority: number;
  trigger: PartnerTrigger;
};

// Static env references so Next.js can inline the NEXT_PUBLIC_* values into client bundles
// (dynamic process.env[key] access is NOT inlined). Absent vars resolve to undefined and
// the link falls back to the plain public URL.
//
// Impact.com partners (Trust & Will, Capitalize) issue a unique full redirect URL per
// affiliate — store the complete URL (e.g. "https://trustandwill.sjv.io/AbcXX") here,
// not a bare ID. buildPartnerLink detects full URLs and uses them directly.
//
// Post Affiliate Pro partners (NotaryLive) use a bare ID appended as ?a_aid=ID.
//
// Direct partners (Proof) also issue full links from their partner portal.
const AFFILIATE_IDS: Record<string, string | undefined> = {
  notarylive: process.env.NEXT_PUBLIC_AFFILIATE_NOTARYLIVE,
  proof: process.env.NEXT_PUBLIC_AFFILIATE_PROOF,
  "trust-will": process.env.NEXT_PUBLIC_AFFILIATE_TRUSTWILL,
  capitalize: process.env.NEXT_PUBLIC_AFFILIATE_CAPITALIZE,
};

export const PARTNERS: Partner[] = [
  {
    // NotaryLive: open affiliate programme, instant approval, 15% CPA, 30-day cookie.
    // Join: notarylive.com/affiliate-program (Post Affiliate Pro). Param: a_aid=YOUR_ID
    slug: "notarylive",
    name: "NotaryLive",
    category: "Online notarisation",
    pitch:
      "Higher-value and estate claims usually need a notarised claim form. NotaryLive lets you notarise documents online by video, no need to find a notary in person.",
    cta: "Notarise your claim form online",
    baseUrl: "https://notarylive.com/",
    affiliateParam: "a_aid",
    affiliateEnv: "NEXT_PUBLIC_AFFILIATE_NOTARYLIVE",
    priority: 1,
    trigger: { whenNotarizationLikely: true },
  },
  {
    // Proof.com: market leader (formerly Notarize). Direct programme — contact via
    // proof.com/partner. On approval they issue a full affiliate link; store it in
    // NEXT_PUBLIC_AFFILIATE_PROOF as the complete URL. Shown alongside NotaryLive.
    slug: "proof",
    name: "Proof (formerly Notarize)",
    category: "Online notarisation",
    pitch:
      "Proof is the most widely recognised online-notarisation service. If your state agency specifically mentions Notarize, use Proof to notarise your claim form by video.",
    cta: "Notarise with Proof",
    baseUrl: "https://www.proof.com/",
    affiliateEnv: "NEXT_PUBLIC_AFFILIATE_PROOF",
    // No affiliateParam — Proof issues a full link from their portal (stored as URL in env).
    // Priority 3: shown after NotaryLive (1) and official/free tools (2); requires direct
    // outreach to proof.com/partner to obtain an affiliate link before it earns anything.
    priority: 3,
    trigger: { whenNotarizationLikely: true },
  },
  {
    slug: "trust-will",
    name: "Trust & Will",
    category: "Estate & probate help",
    pitch:
      "Recovering a relative's property is easier with the estate sorted. Trust & Will handles wills, probate and estate plans online, with attorney-backed documents.",
    cta: "Sort out the estate with Trust & Will",
    baseUrl: "https://trustandwill.com/",
    affiliateParam: "ref",
    affiliateEnv: "NEXT_PUBLIC_AFFILIATE_TRUSTWILL",
    priority: 1,
    trigger: { ownerStatus: ["heir"] },
  },
  {
    slug: "naic-life-locator",
    name: "NAIC Life Policy Locator",
    category: "Free official tool",
    pitch:
      "Looking for unclaimed insurance? The National Association of Insurance Commissioners runs a free locator that asks insurers to search for policies in your or a relative's name.",
    cta: "Search the free NAIC locator",
    baseUrl: "https://eapps.naic.org/life-policy-locator/",
    free: true,
    priority: 2,
    trigger: { assetSlugs: ["insurance"] },
  },
  {
    slug: "capitalize",
    name: "Capitalize",
    category: "Find old 401(k)s",
    pitch:
      "Unclaimed money is often only part of the picture: old workplace 401(k)s get left behind too. Capitalize finds and rolls over forgotten 401(k)s, free for you.",
    cta: "Find a lost 401(k) for free",
    baseUrl: "https://www.hicapitalize.com/",
    affiliateParam: "ref",
    affiliateEnv: "NEXT_PUBLIC_AFFILIATE_CAPITALIZE",
    priority: 5, // "while you're at it" — always shown but ranked last
    trigger: { always: true },
  },
];

function matches(t: PartnerTrigger, ctx: { plan: ClaimPlan; value: number; ownerStatus: OwnerStatus }): boolean {
  if (t.always) return true;
  if (t.ownerStatus && t.ownerStatus.includes(ctx.ownerStatus)) return true;
  if (t.assetSlugs && t.assetSlugs.includes(ctx.plan.asset.slug)) return true;
  if (t.whenNotarizationLikely && ctx.plan.notarizationLikely) return true;
  if (typeof t.minValue === "number" && ctx.value >= t.minValue) return true;
  return false;
}

/** Partners relevant to a claim, most relevant first, capped to keep the page honest. */
export function partnersForPlan(
  ctx: { plan: ClaimPlan; value: number; ownerStatus: OwnerStatus },
  limit = 3,
): Partner[] {
  return PARTNERS.filter((p) => matches(p.trigger, ctx))
    .sort((a, b) => a.priority - b.priority)
    .slice(0, limit);
}

export type PartnerLink = { url: string; isAffiliate: boolean };

/** Build the outbound URL, upgrading to an affiliate link only when an id is configured.
 *
 * Two tracking styles are supported:
 *  - Full URL  (Impact.com, Proof direct): the env var holds the complete redirect link
 *    (e.g. "https://trustandwill.sjv.io/AbcXX"). Detected by an "http" prefix; used as-is.
 *  - Bare ID   (Post Affiliate Pro / NotaryLive): env var holds only the ID; appended as
 *    ?{affiliateParam}={id} to the partner's baseUrl.
 */
export function buildPartnerLink(partner: Partner): PartnerLink {
  const id = AFFILIATE_IDS[partner.slug];
  if (!id) return { url: partner.baseUrl, isAffiliate: false };

  // Full-URL affiliate links (Impact.com issues unique redirect URLs per affiliate).
  if (id.startsWith("http")) return { url: id, isAffiliate: true };

  // Bare-ID affiliate links (Post Affiliate Pro, etc.).
  if (!partner.affiliateParam) return { url: partner.baseUrl, isAffiliate: false };
  const sep = partner.baseUrl.includes("?") ? "&" : "?";
  return {
    url: `${partner.baseUrl}${sep}${partner.affiliateParam}=${encodeURIComponent(id)}`,
    isAffiliate: true,
  };
}

/** True if any shown partner could earn a commission — drives whether we show the disclosure. */
export function hasAffiliatePartners(partners: Partner[]): boolean {
  return partners.some((p) => buildPartnerLink(p).isAffiliate);
}
