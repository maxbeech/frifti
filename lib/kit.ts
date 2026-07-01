// Generates the real, deliverable contents of a paid Claim Kit / Estate Claim Report.
// Everything is derived deterministically from the same claim engine (lib/claims.ts) plus
// the state/asset data, so the buyer receives genuine, personalised material — not a
// placeholder. No randomness and no dates here (relative week offsets only) so the output
// is fully unit-testable; the success page stamps real calendar dates at render time.

import { buildClaimPlan, type ClaimInput, type ClaimPlan, type OwnerStatus } from "./claims";
import type { ProductId } from "./products";

export type KitChecklistItem = { item: string; why: string };
export type KitFollowUp = { offsetWeeks: number; label: string; action: string };
export type KitTip = { problem: string; fix: string };
export type KitSection = { h: string; p?: string; ul?: string[] };

export type KitInput = ClaimInput & { product: ProductId };

export type ClaimKit = {
  product: ProductId;
  title: string;
  intro: string;
  coverLetter: string;
  checklist: KitChecklistItem[];
  followUps: KitFollowUp[];
  submissionSteps: string[];
  rejectionTips: KitTip[];
  estateSections?: KitSection[];
  plan: ClaimPlan;
};

// Maps a checklist document to a plain-English reason + where to get it. Matched on
// keywords so it stays in sync with the document strings produced by lib/claims.ts.
function whyForDocument(doc: string): string {
  const d = doc.toLowerCase();
  if (d.includes("photo id")) return "Proves who you are. A current driver's licence, state ID or passport all work.";
  if (d.includes("social security")) return "Links the property to your SSN. Your SSN card, a W-2 or a 1099 all show it.";
  if (d.includes("mailing address")) return "Shows where to send payment. Use a utility bill or bank statement from the last 90 days.";
  if (d.includes("death certificate")) return "Confirms the original owner has died. Order certified copies from the state vital-records office.";
  if (d.includes("relationship") || d.includes("heirship")) return "Proves your legal right to claim on the estate's behalf. Get it from probate court or a notary.";
  if (d.includes("will") || d.includes("letters of administration")) return "Shows the court recognised you to act for the estate, if it was probated.";
  if (d.includes("good standing") || d.includes("certificate of existence")) return "Confirms the business still legally exists. Download it from your Secretary of State.";
  if (d.includes("authority to claim") || d.includes("board resolution")) return "Shows you may act for the entity. A board resolution or officer letter on letterhead works.";
  if (d.includes("notarized claim form")) return "Required on higher-value and estate claims. See the online notarisation option in your kit.";
  if (d.includes("brokerage") || d.includes("transfer-agent")) return "Identifies the exact shares. Ask the broker or transfer agent for a statement.";
  if (d.includes("certificate number")) return "Speeds up matching of physical stock certificates, if you still hold them.";
  if (d.includes("account or check number")) return "Helps the state match the exact account. Old statements or chequebook stubs may show it.";
  if (d.includes("employer")) return "Helps match unclaimed wages. Old pay stubs or a W-2 confirm employer and dates.";
  if (d.includes("policy number") || d.includes("insurer")) return "Identifies the policy. Check old paperwork, or use the free NAIC locator in your kit.";
  if (d.includes("account number or service address")) return "Matches the deposit to your old utility account or service address.";
  if (d.includes("branch") || d.includes("box number") || d.includes("inventory")) return "Helps the state locate the right safe-deposit box and its contents.";
  return "Supporting evidence the state may request to verify your claim.";
}

function coverLetter(plan: ClaimPlan, ownerStatus: OwnerStatus): string {
  const { state, asset } = plan;
  const claimantLine =
    ownerStatus === "heir"
      ? "I am claiming as the heir/executor of the original owner, whose details and death certificate are enclosed."
      : ownerStatus === "business"
        ? "I am claiming on behalf of the business named below, and enclose proof of my authority to do so."
        : "I am the original owner named on the property record.";
  return [
    "[Today's date]",
    "",
    `${state.agency}`,
    "Unclaimed Property Division",
    "",
    `Re: Claim for unclaimed ${asset.name.toLowerCase()} — Claim/Property ID: [PROPERTY OR CLAIM ID]`,
    "",
    "To the Unclaimed Property team,",
    "",
    `I am writing to claim unclaimed ${asset.name.toLowerCase()} that ${state.name} is holding under my name. ${claimantLine}`,
    "",
    "My details:",
    "  • Full legal name (and any former names): [YOUR FULL LEGAL NAME / MAIDEN NAME]",
    "  • Current address: [YOUR CURRENT ADDRESS]",
    "  • Address(es) the property may have been reported under: [PREVIOUS ADDRESSES]",
    "  • Daytime phone and email: [PHONE] / [EMAIL]",
    "",
    "I enclose the documents listed on the attached checklist to verify my identity and right to this property. Please confirm receipt of this claim and let me know if anything further is required.",
    "",
    "Thank you for your help returning this property.",
    "",
    "Sincerely,",
    "[YOUR SIGNATURE]",
    "[YOUR PRINTED NAME]",
  ].join("\n");
}

function followUps(plan: ClaimPlan): KitFollowUp[] {
  const { min, max } = plan.timelineWeeks;
  return [
    { offsetWeeks: 0, label: "File", action: `Submit your complete claim through the official ${plan.state.agency} portal and save a copy of everything.` },
    { offsetWeeks: 1, label: "Confirm receipt", action: "Check your email (and spam) for an acknowledgement, and record your claim/reference number." },
    { offsetWeeks: 4, label: "Mid-point check", action: "No update yet? That's normal. Log in to the portal and confirm your claim still shows as received/in review." },
    { offsetWeeks: min, label: "Chase a decision", action: `You're now at the early end of the typical ${min}–${max} week window. Contact ${plan.state.agency} with your claim number to confirm it's progressing.` },
    { offsetWeeks: max, label: "Escalate if needed", action: "Still unpaid past the typical window? Request a written status update and re-confirm every document was received and legible." },
  ];
}

function rejectionTips(plan: ClaimPlan, ownerStatus: OwnerStatus): KitTip[] {
  const tips: KitTip[] = [
    { problem: "Name doesn't match the record", fix: "Claim under the exact name the property was reported in — include maiden and former names if you've changed it." },
    { problem: "Address can't be verified", fix: "Attach proof of a current address and, if you can, an old address that matches the reported record." },
    { problem: "Blurry or partial document scans", fix: "Upload full-page, in-focus colour scans — cropped or dark photos are the most common reason claims stall." },
  ];
  if (plan.notarizationLikely)
    tips.push({ problem: "Missing notarisation", fix: "Higher-value and estate claims usually need a notarised claim form — get it notarised before you file, not after a rejection." });
  if (ownerStatus === "heir")
    tips.push({ problem: "Estate authority not proven", fix: "Include the death certificate plus letters testamentary or an heirship affidavit — states will not release estate funds without them." });
  if (plan.asset.slug === "securities")
    tips.push({ problem: "Shares need re-registration", fix: "Securities can take longer because they may be liquidated or re-registered — send any brokerage statement or certificate numbers up front." });
  return tips;
}

function estateSections(plan: ClaimPlan): KitSection[] {
  return [
    {
      h: "Search every state the deceased touched",
      p: "Property is reported to the owner's last known address on file with the holder — not where they died. Search each state they lived, worked, banked or owned property in.",
      ul: [
        "List every state connected to the deceased and search each official portal by full name, maiden name and middle-name variants.",
        `Start with ${plan.state.name}, then repeat the same search in every other connected state.`,
        "Also search the deceased's former addresses where the portal allows address matching.",
      ],
    },
    {
      h: "Affidavit of heirship — what states expect",
      p: "When an estate wasn't formally probated, most states accept an affidavit of heirship. It typically must state:",
      ul: [
        "The deceased's full name, date of death and last address.",
        "That the estate was not (or no longer is) in probate, where that applies.",
        "Each heir's name, relationship and share, signed before a notary — and sometimes by a disinterested witness.",
      ],
    },
    {
      h: "Probated vs. non-probated estates",
      p: "If the estate went through probate, attach letters testamentary or letters of administration naming you. If it didn't, check whether the amount is under the state's small-estate threshold, which often allows a simpler affidavit route instead of opening probate.",
    },
  ];
}

export function buildClaimKit(input: KitInput): ClaimKit {
  const plan = buildClaimPlan(input);
  const ownerStatus: OwnerStatus = input.ownerStatus ?? "self";
  const isEstate = input.product === "estate-report";

  const title = isEstate
    ? `Estate Claim Report — ${plan.state.name} ${plan.asset.name}`
    : `Claim Kit — ${plan.state.name} ${plan.asset.name}`;

  const intro = isEstate
    ? `A complete, executor-ready pack for recovering ${plan.asset.name.toLowerCase()} that ${plan.state.name} is holding for a relative who has died. Remember: claiming from the state is free — this report exists to make a complex estate claim faster and harder to get wrong.`
    : `Everything you need to file a clean ${plan.state.name} claim for ${plan.asset.name.toLowerCase()} the first time. Claiming from the state is always free — this kit just does the organising for you.`;

  const checklist: KitChecklistItem[] = plan.documents.map((item) => ({ item, why: whyForDocument(item) }));

  const submissionSteps = [
    ...plan.steps,
    "Keep a dated copy of the full submission and every document — your proof if anything is queried.",
    "File under the exact name and address the property was reported in wherever you know it.",
  ];

  return {
    product: input.product,
    title,
    intro,
    coverLetter: coverLetter(plan, ownerStatus),
    checklist,
    followUps: followUps(plan),
    submissionSteps,
    rejectionTips: rejectionTips(plan, ownerStatus),
    estateSections: isEstate ? estateSections(plan) : undefined,
    plan,
  };
}
