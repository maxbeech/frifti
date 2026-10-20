// Permanent redirects from pages removed in the October 2026 consolidation
// (docs/seo_recovery_2026_10.md). Each old URL goes to the page that best answers the same query.
export const POST_REDIRECTS: Record<string, string> = {
  "missingmoney-com-vs-state-portal": "/blog/is-missingmoney-com-legit",
  "how-to-claim-unclaimed-property": "/blog/what-documents-to-claim-unclaimed-property",
  "claim-unclaimed-property-for-a-business": "/blog/what-documents-to-claim-unclaimed-property",
  "what-is-unclaimed-property": "/blog/why-do-states-hold-unclaimed-property",
  "dormant-bank-account-explained": "/blog/why-do-states-hold-unclaimed-property",
  "search-unclaimed-money-by-social-security-number": "/blog/how-to-find-unclaimed-money-complete-guide",
  "how-to-find-a-lost-bank-account": "/blog/how-to-find-unclaimed-money-complete-guide",
  "why-unclaimed-money-searches-are-rising": "/blog/how-to-find-unclaimed-money-complete-guide",
  "how-to-verify-unclaimed-property": "/blog/unclaimed-money-scams-red-flags",
  "is-unclaimed-money-real": "/blog/is-unclaimed-property-search-free",
  "unclaimed-property-after-death": "/blog/unclaimed-inheritance-from-deceased-relative",
  "missingmoney-com-alternative-state-searches": "/blog/is-missingmoney-com-legit",
  "unclaimed-property-trends-2026": "/blog/unclaimed-money-by-state-data-study",
  "florida-treasure-hunt-explained": "/unclaimed-property/florida",
  "ct-big-list-explained": "/unclaimed-property/connecticut",
  "nc-cash-explained": "/unclaimed-property/north-carolina",
};

export const REDIRECTS: { source: string; destination: string; permanent: true }[] = [
  ...Object.entries(POST_REDIRECTS).map(([slug, destination]) => ({
    source: `/blog/${slug}`,
    destination,
    permanent: true as const,
  })),
  // State x property-type pages folded into the state hub.
  { source: "/unclaimed-property/:state/:asset", destination: "/unclaimed-property/:state", permanent: true },
];
