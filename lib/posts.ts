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

const WEEK2_POSTS: Post[] = [
  {
    slug: "unclaimed-property-by-state",
    title: "Unclaimed Property by State: How to Search Each",
    description:
      "Every state runs its own unclaimed-property portal. How to search the biggest states plus national aggregators if you have accounts in multiple places.",
    updated: "2026-06-20",
    body: [
      { p: "Every state, plus Washington D.C. and Puerto Rico, maintains its own unclaimed-property database. If you've lived, worked, or banked in more than one state, you may have funds in several treasuries simultaneously." },
      { h: "The national aggregators" },
      { p: "MissingMoney.com (run by NAUPA) searches many but not all states in one step. NAUPA's own directory at unclaimed.org links to every participating state. Use one aggregator as a starting point, then verify on each state's official portal for states that don't share data." },
      { h: "Largest states and their portals" },
      { ul: [
        "California — claimit.ca.gov (searches CA only; CA does not share with MissingMoney).",
        "Texas — claimittexas.org.",
        "New York — osc.ny.gov/unclaimed-funds.",
        "Florida — fltreasurehunt.gov.",
        "Pennsylvania — patreasury.gov/unclaimedproperty.",
        "Illinois — icash.illinois.gov.",
      ] },
      { h: "Search tips for every state" },
      { ul: [
        "Search your full legal name, maiden name, and common spelling variations.",
        "Search your last three or four known addresses by zip code — some portals match on address alone.",
        "If you inherited property, search the deceased's name as well.",
      ] },
    ],
  },
  {
    slug: "how-to-claim-unclaimed-money",
    title: "How to Claim Unclaimed Money Step by Step",
    description:
      "The step-by-step process for claiming unclaimed property: search the official portal, verify ownership, submit documents, and track your payment.",
    updated: "2026-06-20",
    body: [
      { p: "Claiming unclaimed property is free and relatively simple once you know the right steps. The process takes 5–30 minutes to initiate; the state then does the verification work, which takes 6–16 weeks." },
      { h: "Step 1: Find the property" },
      { p: "Search the official portal for your state (and every state you've lived in). Use your current name plus any maiden or former names. Note the property ID or claim number — you'll need it to submit." },
      { h: "Step 2: Start the claim online" },
      { p: "Most state portals have a 'Claim' button next to each result. You'll create an account or log in with your state ID number, then confirm your identity by matching your address history to the records on file." },
      { h: "Step 3: Upload your documents" },
      { p: "At minimum you'll upload a government-issued photo ID and proof of your current address. Estate claims also need a certified death certificate, a will or letters of administration, and proof of relationship to the deceased. Submit everything in the first upload — missing documents are the most common reason claims stall." },
      { h: "Step 4: Wait for processing" },
      { p: "Simple cash claims are typically processed in 6–10 weeks. High-value claims and estate claims can take 3–6 months. Most portals let you check status online with your claim number. If you haven't heard back in 12 weeks on a routine claim, call the treasurer's office to confirm receipt." },
    ],
  },
  {
    slug: "unclaimed-funds-search-tips",
    title: "Unclaimed Funds Search: 5 Tips to Find More",
    description:
      "Five search strategies that find unclaimed funds other people miss: name variations, old addresses, maiden names, business names, and deceased relatives.",
    updated: "2026-06-20",
    body: [
      { p: "Most people search only their current name in one state and stop there. Here are five search strategies that turn up accounts others miss." },
      { h: "1. Try every name variation you've used" },
      { p: "Holders report property using the name on file at the time of dormancy. Search your full middle name, your middle initial only, common misspellings of your surname, and — if applicable — a hyphenated or unhyphenated married name." },
      { h: "2. Use maiden names and former names" },
      { p: "If you've changed your name through marriage, divorce, or legal change, search every former name. Bank accounts opened under a maiden name are often reported under that name years later." },
      { h: "3. Search by old addresses" },
      { p: "Some portals accept a zip code or address as a search parameter. Searching a zip code where you banked 15 years ago can surface accounts your name search missed if the name on file was slightly different." },
      { h: "4. Search business names" },
      { p: "If you've ever operated a sole proprietorship, LLC, or corporation — even a dormant one — search the business name. Uncashed vendor payments, refunds, and payroll checks from wound-down entities regularly escheat under the business name." },
      { h: "5. Search for deceased relatives" },
      { p: "Property belonging to a deceased person remains claimable by legal heirs indefinitely in most states. Search the names of parents, grandparents, and other relatives whose estate you have a legal right to. Use the heir claim track to submit once you find something." },
    ],
  },
  {
    slug: "unclaimed-life-insurance-policy",
    title: "How to Find an Unclaimed Life Insurance Policy",
    description:
      "If a relative dies and you don't know who insured them, three free registries and one state-based option can track down an unclaimed life insurance policy.",
    updated: "2026-06-20",
    body: [
      { p: "Life insurance proceeds are one of the most common types of unclaimed property. When a policyholder dies and beneficiaries don't file a claim, insurers are required to turn the proceeds over to the state after the dormancy period — usually 3 to 5 years from the death." },
      { h: "Free registries to check first" },
      { ul: [
        "NAIC Life Insurance Policy Locator (naic.org) — free, submits requests to participating insurers nationwide. Results take up to 90 business days.",
        "MIB Policy Locator — searches MIB Group's application database for policies issued since 1996 (small fee).",
        "Veteran's Group Life Insurance (VGLI) and Servicemembers' Group Life Insurance (SGLI) for military — searchable through the VA.",
      ] },
      { h: "Search state unclaimed-property portals" },
      { p: "If enough time has passed, proceeds already paid to the state show up in the state's unclaimed-property database under the insured's name. Search every state where the deceased lived. File an heir claim if you find a match." },
      { h: "What you'll need to claim insurance proceeds" },
      { ul: [
        "Certified death certificate.",
        "Your government-issued ID.",
        "Proof of relationship to the insured (birth certificate, marriage certificate, or the policy itself naming you as beneficiary).",
        "The policy number, if known — speeds up processing significantly.",
      ] },
    ],
  },
  {
    slug: "unclaimed-money-from-deceased-relative",
    title: "Unclaimed Money from a Deceased Relative: How to Claim",
    description:
      "Claiming a deceased relative's unclaimed property requires proof of death and your legal relationship to the estate. Here's what documents states ask for.",
    updated: "2026-06-20",
    body: [
      { p: "You can claim unclaimed property on behalf of a deceased relative if you are a legal heir, executor, or administrator of the estate. Every state has a process for this — it just requires additional documentation compared to a standard owner claim." },
      { h: "Documents required for most heir claims" },
      { ul: [
        "Certified death certificate (not a photocopy — most states require the embossed original or a certified copy from the vital-records office).",
        "Your government-issued photo ID.",
        "Proof of relationship: birth certificate for children claiming a parent; marriage certificate for a spouse; court-issued letters testamentary for an executor.",
        "A copy of the will, if one exists.",
      ] },
      { h: "No will? Use letters of administration" },
      { p: "If the deceased died intestate (without a will) and the estate went through probate, you'll need letters of administration issued by the probate court naming you as administrator. If the estate was small enough to avoid probate in your state, check if the state allows a simplified small-estate affidavit instead." },
      { h: "How long it takes" },
      { p: "Estate claims take longer than owner claims — typically 3 to 6 months. Many states require notarized forms for heir claims above a low threshold (sometimes as little as $250). Budget time to obtain certified documents and return originals if the state requires them." },
    ],
  },
  {
    slug: "dormancy-period-unclaimed-property",
    title: "Unclaimed Property Dormancy Periods by Asset Type",
    description:
      "Dormancy periods run 1–7 years before a holder must turn property over to the state. How long each common asset type takes to become unclaimed property.",
    updated: "2026-06-20",
    body: [
      { p: "A dormancy period is the length of time an asset must go untouched before the holder (a bank, employer, insurer, etc.) is required to report and transfer it to the state as unclaimed property. The dormancy clock resets any time you make a transaction or make contact with the holder." },
      { h: "Common dormancy periods" },
      { ul: [
        "Savings and checking accounts: 3 years in most states (some allow 5).",
        "Uncashed checks (wages, dividends, refunds): 1–3 years.",
        "Life insurance proceeds: 3–5 years after the maturity date or the insured's death.",
        "Stocks and dividends held by a transfer agent: 3–5 years.",
        "Safe deposit box contents: 3–5 years after the lease expires.",
        "IRAs and retirement accounts: 3 years after the required minimum distribution date (varies by state).",
        "Gift cards and stored value: 2–7 years, and many states exempt them entirely.",
      ] },
      { h: "The Revised Uniform Unclaimed Property Act (RUUPA)" },
      { p: "Many states have adopted or are adopting the 2016 RUUPA, which standardizes dormancy periods across asset types and adds new rules for securities, digital assets, and foreign-held property. The National Conference of Commissioners on Uniform State Laws published the RUUPA, but each state's legislature must enact it individually — periods still vary." },
    ],
  },
  {
    slug: "unclaimed-wages-how-to-claim",
    title: "How to Recover Unclaimed Wages from a Former Employer",
    description:
      "If a former employer owes you final wages or a reimbursement they never paid, those funds may be sitting in state unclaimed-property or a DOL account.",
    updated: "2026-06-20",
    body: [
      { p: "Uncashed final paychecks, expense reimbursements, and commission payments employers never paid out are among the most common items in state unclaimed-property databases. There are two parallel systems that may hold them." },
      { h: "State unclaimed-property portals" },
      { p: "Once an uncashed check has been dormant for 1–3 years (depending on the state), employers are required to hand the funds over to the state treasury. Search under your name in every state where you worked for any employer that ever owed you a check." },
      { h: "The Department of Labor Back Wage system" },
      { p: "If your employer was subject to an FLSA investigation and found to owe you back wages, the Wage and Hour Division may be holding the money if the employer paid but you never cashed the check. Search the DOL's Workers Owed Wages database at dol.gov/agencies/whd/workers-owed-wages. Searches are free; you can file to claim directly through the portal." },
      { h: "State labor board accounts" },
      { p: "Some states have their own wage-claim resolution process that may have generated a settlement payment you never received. Check your state labor commissioner's website for any such database." },
    ],
  },
  {
    slug: "unclaimed-property-safe-deposit-box",
    title: "Safe Deposit Box Abandoned Property: What Happens",
    description:
      "After 3–5 years of inactivity, a bank drills the box and transfers its contents to the state as unclaimed property. How to search if a relative left one.",
    updated: "2026-06-20",
    body: [
      { p: "A safe deposit box is considered abandoned after the lease expires or after a set dormancy period (commonly 3–5 years) with no contact from the owner. At that point, the bank must drill the box, inventory the contents, and transfer them to the state." },
      { h: "What the state does with the contents" },
      { ul: [
        "Cash and negotiable securities are liquidated and credited to the state's unclaimed-property fund.",
        "Non-cash items (jewelry, coins, documents, collectibles) are typically stored by the state for a period, then auctioned if unclaimed.",
        "Documents like wills, deeds, and certificates are often retained longer and may be held in a secure archive.",
      ] },
      { h: "How to search for a deceased relative's safe deposit box" },
      { ul: [
        "Start with the bank they used — contact the branch to ask whether they had a box and what happened to the contents.",
        "Search the state unclaimed-property database for the cash or securities value that was transferred.",
        "For non-cash items already auctioned, you generally cannot recover them, only the proceeds.",
        "Ask the state treasurer's office directly — some maintain a separate database for box contents.",
      ] },
    ],
  },
  {
    slug: "unclaimed-property-for-businesses",
    title: "Unclaimed Property for Businesses: Compliance Guide",
    description:
      "Businesses that hold dormant payroll checks, vendor credits, or customer deposits may owe unclaimed-property reports to the state. A compliance overview.",
    updated: "2026-06-20",
    body: [
      { p: "Businesses are holders — not just owners — of unclaimed property. If your company has issued checks that went uncashed, holds customer deposits that were never applied, or has unclaimed gift card balances, you may be legally required to report and remit those funds to one or more states. Missing the annual reporting deadline can trigger audits and penalties." },
      { h: "Common business unclaimed-property liabilities" },
      { ul: [
        "Uncashed employee payroll, commission, bonus, and expense checks.",
        "Uncashed vendor or customer refund checks.",
        "Unapplied customer credits or deposits.",
        "Unredeemed gift cards and stored-value instruments (many states exempt small amounts).",
        "Uncashed dividend or interest payments.",
      ] },
      { h: "Reporting and remittance obligations" },
      { p: "Most states require an annual report — typically due between January and November, with the exact deadline varying by state. 'Delaware holders' (companies incorporated in Delaware) have special rules because Delaware claims property when the owner's state is unknown. Holders generally report the owner's name, last known address, and the amount." },
      { h: "Audit exposure and voluntary disclosure" },
      { p: "State unclaimed-property audits can go back 10 years or more and typically rely on a statistical extrapolation of records you can't fully produce. Voluntary disclosure agreements (VDAs) generally reduce look-back periods and waive penalties. Companies that have never filed should consult unclaimed-property counsel before their first report." },
    ],
  },
  {
    slug: "missingmoney-vs-state-portals",
    title: "MissingMoney.com vs State Portals: Which to Use",
    description:
      "MissingMoney.com aggregates many but not all states. Here is when to use the national aggregator versus going directly to each state's official portal.",
    updated: "2026-06-20",
    body: [
      { p: "MissingMoney.com is a free national aggregator operated by NAUPA (National Association of Unclaimed Property Administrators). It searches participating states with a single query — convenient, but not complete." },
      { h: "What MissingMoney.com covers" },
      { p: "As of 2026, MissingMoney covers approximately 40 participating states plus some Canadian provinces. If a state's result appears, it links you directly to that state's portal to claim. The search is genuinely free — MissingMoney.com does not charge any fee to find or claim property." },
      { h: "States that don't share data with MissingMoney" },
      { ul: [
        "California — search separately at claimit.ca.gov.",
        "New York — search at osc.ny.gov/unclaimed-funds.",
        "Some smaller states update the aggregator less frequently, so direct searches on those portals may show newer entries.",
      ] },
      { h: "When to go directly to the state portal" },
      { ul: [
        "Always, for California and New York — they're not on MissingMoney.",
        "For estate claims — state portals have dedicated heir-claim workflows that the aggregator can't initiate.",
        "To check claim status — once you've filed, track progress on the state portal, not MissingMoney.",
        "When MissingMoney shows no results — verify on the state portal before concluding there's nothing there.",
      ] },
    ],
  },
  {
    slug: "is-unclaimed-property-taxable",
    title: "Is Unclaimed Property Taxable? What You Owe",
    description:
      "Most unclaimed property refunds are not taxable income, but interest earned by the state, securities gains, and IRA proceeds have different rules.",
    updated: "2026-06-20",
    body: [
      { p: "The general rule is that receiving unclaimed property that was already yours — a refund, a deposit, your own bank balance — is not taxable income. You earned it before; you're just getting it back. But several situations are taxed." },
      { h: "Not taxable in most cases" },
      { ul: [
        "A refund or deposit you paid with after-tax money (utility deposit, layaway refund).",
        "A bank balance you already paid tax on when you earned it.",
        "Most uncashed personal checks.",
      ] },
      { h: "Potentially taxable situations" },
      { ul: [
        "Interest the state paid while holding your money — that is new income. Some states issue a 1099-INT for this; others do not, but the IRS still expects you to report it.",
        "Stock or securities whose value increased — the gain from the sale is a capital gain even if you didn't sell voluntarily. The state will report the cost basis if it has it; if not, your records control.",
        "Traditional IRA or 401(k) proceeds — these were never taxed and are ordinary income when paid to you, just as a normal distribution would be. Withholding may not have been applied.",
        "Business income or commissions — if the original payment should have been reported as income, the late receipt doesn't change that.",
      ] },
      { h: "Check for a 1099" },
      { p: "Some states issue a 1099-MISC or 1099-INT when returning unclaimed property that includes taxable amounts. If you don't receive one but suspect you should, contact the state's unclaimed-property office to request a tax statement." },
    ],
  },
  {
    slug: "unclaimed-property-claim-status",
    title: "How to Check Your Unclaimed Property Claim Status",
    description:
      "Most state unclaimed-property portals let you track claim status online after submission. What to do if the tracker shows no status or the claim stalls.",
    updated: "2026-06-20",
    body: [
      { p: "Once you've submitted a claim, you don't have to wait in the dark. Most state portals provide an online tracker — you'll find it under 'Check Claim Status' or 'My Claims' in the same portal you used to file." },
      { h: "What the status codes mean" },
      { ul: [
        "'Received' or 'Pending' — the claim is in the queue. Normal for the first 4–6 weeks.",
        "'Under review' or 'In process' — a examiner is verifying your documents. May last 4–10 weeks.",
        "'Additional documentation required' — the state emailed or mailed a request for more proof. Check the email address you used when you filed.",
        "'Approved' — payment is being issued. Expect a check or ACH within 2–4 weeks.",
        "'Denied' — a reason should be listed. Common reasons: insufficient ID, wrong relationship documents, or the property was already claimed.",
      ] },
      { h: "If the tracker shows nothing" },
      { p: "Submission confirmation emails can go to spam. Log into the state portal with the same account you used to file and look for your claim history. If it's genuinely not there, you may need to re-file — call the treasurer's office to confirm whether your submission was received before submitting again." },
      { h: "What to do if a claim stalls past the expected window" },
      { ul: [
        "Call the treasurer's unclaimed-property line directly — response times vary, but most offices have a specific line for claimants.",
        "Send a follow-up email with your claim number and reference the 'under review' status.",
        "If a state denies a claim you believe is valid, most states have an appeals process — ask the office for the procedure.",
      ] },
    ],
  },
];
POSTS.push(...WEEK2_POSTS);

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
