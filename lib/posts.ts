// Citable claim guides. Body is plain paragraphs/lists rendered server-side.
export type Post = {
  slug: string;
  title: string;
  description: string;
  updated: string;
  body: { h?: string; p?: string; ul?: string[] }[];
};

export const POSTS: Post[] = [
  {
    slug: "how-long-does-unclaimed-property-take",
    title: "How long does it take to get unclaimed property back?",
    description:
      "Most states pay an approved unclaimed-property claim in 6 to 16 weeks. Here is what drives the timeline and how to avoid the delays.",
    updated: "2026-06-18",
    body: [
      { p: "Once you submit a complete claim, most state unclaimed-property programs pay straightforward cash claims in about 6 to 10 weeks. More complex claims — securities, estate/heir claims, or amounts over a few thousand dollars — commonly take 12 to 26 weeks because they need extra verification." },
      { h: "What slows a claim down" },
      { ul: [
        "Missing or mismatched identity documents (name changes, old addresses).",
        "High-value claims that require a notarized claim form.",
        "Estate claims that need a death certificate and proof you are the legal heir.",
        "Securities that must be re-registered or liquidated before payout.",
      ] },
      { h: "How to make it faster" },
      { ul: [
        "Claim directly through the official state portal — never through a paid finder.",
        "Upload every document on the first submission so the state does not have to write back.",
        "Use the exact name and address the property was reported under, if you know it.",
      ] },
    ],
  },
  {
    slug: "what-documents-to-claim-unclaimed-property",
    title: "What documents do you need to claim unclaimed property?",
    description:
      "A plain-English checklist of the ID and proof documents states ask for, plus the extra paperwork for estate and securities claims.",
    updated: "2026-06-18",
    body: [
      { p: "Every state verifies that you are the rightful owner before releasing property. The core set is the same almost everywhere; specific property types and estate claims add a few items." },
      { h: "Standard owner documents" },
      { ul: [
        "Government-issued photo ID (driver's license, state ID, or passport).",
        "Proof of your Social Security number (SSN card, W-2, or 1099).",
        "Proof of your current mailing address (recent utility bill or bank statement).",
      ] },
      { h: "Extra documents by situation" },
      { ul: [
        "Estate / heir claims: certified death certificate, proof of relationship, and the will or letters of administration.",
        "Securities: a brokerage or transfer-agent statement and any original certificate numbers.",
        "Higher-value claims: a notarized claim form (the threshold is often around $1,000).",
      ] },
    ],
  },
  {
    slug: "is-unclaimed-property-search-free",
    title: "Is searching for unclaimed property free? (Yes — avoid the fees)",
    description:
      "Searching and claiming your own unclaimed property from a state is always free. Here is how to spot paid 'finder' services and skip them.",
    updated: "2026-06-18",
    body: [
      { p: "Searching for and claiming your own unclaimed property directly from a state treasury is always free. States are legally holding the money for you and never charge the owner to return it." },
      { p: "Paid 'asset recovery' or 'finder' firms send letters offering to recover money for a cut — often 10% or more. By law these finders can only point you to property that is already searchable for free on the official state portal. You never need them to claim property in your own name." },
      { h: "When a finder might be worth it" },
      { p: "The narrow exception is genuinely hard estate or multi-state cases where you would rather pay someone to do the legwork. Even then, confirm the property exists for free first — start from the official portal, not the letter." },
    ],
  },
  {
    slug: "how-to-find-unclaimed-money-in-multiple-states",
    title: "How to find unclaimed money in every state you've lived in",
    description:
      "If you've moved, your unclaimed property can be sitting in several different state treasuries. Here's the systematic way to check them all.",
    updated: "2026-06-18",
    body: [
      { p: "Unclaimed property is reported to the state of your last known address on file with the holder — not necessarily where you live now. If you've moved, banked, or worked across state lines, check every state you have a connection to." },
      { h: "A 15-minute sweep" },
      { ul: [
        "List every state you've lived, worked, or banked in.",
        "Search each state's official portal using your current name, maiden names, and middle-name variations.",
        "Also search former addresses — some portals match on address.",
        "Search the names of deceased relatives whose estate you're entitled to.",
      ] },
      { p: "The multi-state aggregator MissingMoney.com covers many but not all states, so always confirm directly on each official state portal for full coverage." },
    ],
  },
  {
    slug: "why-do-states-hold-unclaimed-property",
    title: "Why do states hold unclaimed property — and how much is there?",
    description:
      "An overview of escheatment, dormancy periods, and the roughly $70 billion in unclaimed property U.S. states are holding for their residents.",
    updated: "2026-06-18",
    body: [
      { p: "When a financial account, paycheck, refund, or insurance payout goes untouched for a set 'dormancy period' (often 3 to 5 years), the holder is legally required to turn it over to the state in a process called escheatment. The state then holds it indefinitely until the rightful owner claims it." },
      { p: "Across all 50 states, DC, and Puerto Rico, treasuries collectively hold tens of billions of dollars — commonly estimated around $70 billion — in unclaimed property. About one in seven Americans has unclaimed property somewhere." },
      { h: "What gets escheated" },
      { ul: [
        "Dormant bank balances, CDs, and uncashed checks.",
        "Unclaimed wages, commissions, and refunds.",
        "Insurance proceeds and matured annuities.",
        "Stocks, dividends, and contents of abandoned safe-deposit boxes.",
      ] },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
