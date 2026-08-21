import type { Post } from "./types";
import { post as capitalize401kFinderReview } from "./data/capitalize-401k-finder-review";
import { post as claimittexasGovExplained } from "./data/claimittexas-gov-explained";
import { post as doYouPayTaxesOnUnclaimedMoney } from "./data/do-you-pay-taxes-on-unclaimed-money";
import { post as findMassMoneyFindmassmoneyGovExplained } from "./data/find-mass-money-findmassmoney-gov-explained";
import { post as governmentUnclaimedMoneyFullList } from "./data/government-unclaimed-money-full-list";
import { post as howLongDoesUnclaimedPropertyTake } from "./data/how-long-does-unclaimed-property-take";
import { post as howToFindALostPension } from "./data/how-to-find-a-lost-pension";
import { post as howToFindOld401k } from "./data/how-to-find-old-401k";
import { post as howToFindUnclaimedMoneyCompleteGuide } from "./data/how-to-find-unclaimed-money-complete-guide";
import { post as howToFindUnclaimedMoneyInMultipleStates } from "./data/how-to-find-unclaimed-money-in-multiple-states";
import { post as howToFindUnclaimedSavingsBonds } from "./data/how-to-find-unclaimed-savings-bonds";
import { post as irsUnclaimedMoneyFederalRefund } from "./data/irs-unclaimed-money-federal-refund";
import { post as isMissingmoneyComLegit } from "./data/is-missingmoney-com-legit";
import { post as isUnclaimedPropertySearchFree } from "./data/is-unclaimed-property-search-free";
import { post as trustAndWillEstatePlanningReview } from "./data/trust-and-will-estate-planning-review";
import { post as unclaimedInheritanceFromDeceasedRelative } from "./data/unclaimed-inheritance-from-deceased-relative";
import { post as unclaimedLifeInsurancePolicyFinder } from "./data/unclaimed-life-insurance-policy-finder";
import { post as unclaimedMoneyByStateDataStudy } from "./data/unclaimed-money-by-state-data-study";
import { post as unclaimedMoneyScamsRedFlags } from "./data/unclaimed-money-scams-red-flags";
import { post as unclaimedSurplusFundsCaseStudy } from "./data/unclaimed-surplus-funds-case-study";
import { post as whatDocumentsToClaimUnclaimedProperty } from "./data/what-documents-to-claim-unclaimed-property";
import { post as whatIsNaupaUnclaimedProperty } from "./data/what-is-naupa-unclaimed-property";
import { post as whyDoStatesHoldUnclaimedProperty } from "./data/why-do-states-hold-unclaimed-property";

export type { Post, PostCategory, ContentFormat, Block, FeaturedImage, ReviewMeta } from "./types";

export const POSTS: Post[] = [
  howLongDoesUnclaimedPropertyTake,
  whatDocumentsToClaimUnclaimedProperty,
  isUnclaimedPropertySearchFree,
  howToFindUnclaimedMoneyInMultipleStates,
  whyDoStatesHoldUnclaimedProperty,
  howToFindUnclaimedMoneyCompleteGuide,
  howToFindOld401k,
  capitalize401kFinderReview,
  unclaimedLifeInsurancePolicyFinder,
  unclaimedInheritanceFromDeceasedRelative,
  trustAndWillEstatePlanningReview,
  unclaimedSurplusFundsCaseStudy,
  unclaimedMoneyByStateDataStudy,
  isMissingmoneyComLegit,
  unclaimedMoneyScamsRedFlags,
  irsUnclaimedMoneyFederalRefund,
  whatIsNaupaUnclaimedProperty,
  doYouPayTaxesOnUnclaimedMoney,
  claimittexasGovExplained,
  howToFindALostPension,
  howToFindUnclaimedSavingsBonds,
  findMassMoneyFindmassmoneyGovExplained,
  governmentUnclaimedMoneyFullList,
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
