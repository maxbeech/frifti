// Clean, citable Q&A used both as on-page FAQ sections and as FAQPage JSON-LD
// for GEO (AI discoverability). Answers are short, factual and sourced to NAUPA
// / state programs.

export interface QA {
  q: string;
  a: string;
}

export const HOME_FAQ: QA[] = [
  {
    q: "What is unclaimed property?",
    a: "Unclaimed property is money or assets a business or government owes you but could not deliver — dormant bank accounts, uncashed checks, insurance proceeds, final paychecks, utility deposits, stocks and dividends. After a dormancy period the holder must turn it over to the state treasury, which holds it for you indefinitely until you claim it.",
  },
  {
    q: "Is it really free to claim my own unclaimed money?",
    a: "Yes. Searching and claiming through your official state program is always free. ClaimWise HQ routes you only to free, official government portals (your state treasury and the NAUPA-sponsored MissingMoney.com). We never charge a finder's fee to recover money that is already yours.",
  },
  {
    q: "Where should I search for unclaimed money?",
    a: "Search your state's official unclaimed-property program (run by the State Treasurer, Comptroller or Department of Revenue) and MissingMoney.com, the free multi-state search sponsored by the National Association of Unclaimed Property Administrators (NAUPA). Search every state where you have lived or worked, and check former names.",
  },
  {
    q: "How long does it take to get unclaimed money back?",
    a: "A straightforward owner claim for a single property commonly resolves in about 2 to 8 weeks. Heir claims (which need a death certificate and estate documentation) and business claims take longer, and higher-value claims often require a notarized affidavit. Exact timelines are set by each state program.",
  },
  {
    q: "What documents do I need to claim unclaimed property?",
    a: "Almost every claim needs a government photo ID, the completed state claim form, and proof of your Social Security or Taxpayer ID. Owners also prove the address on the record; heirs add a death certificate, proof of relationship and probate documents; businesses add incorporation papers, an EIN and proof of authority. ClaimWise HQ's claim guide lists the exact set for your situation.",
  },
  {
    q: "Why is unclaimed property suddenly in the news?",
    a: "There is an estimated tens of billions of dollars in unclaimed property sitting in US state treasuries, and roughly one in seven Americans has some. Most people never search because it is spread across separate state databases. ClaimWise HQ brings every official state portal into one place and adds a guided claim journey.",
  },
  {
    q: "Are paid 'finder' services worth it?",
    a: "Almost never for property you can find yourself. State searches are free and many states cap what a third-party finder can charge. If you can locate the property on your state portal or MissingMoney.com, claim it directly and keep 100% of it. ClaimWise HQ exists to help you do exactly that, for free.",
  },
];

export const CLAIM_FAQ: QA[] = [
  {
    q: "Do I need a notary to claim unclaimed property?",
    a: "Often, yes. Many states require a notarized claim affidavit for higher-value claims (commonly at or above $1,000) and for almost all heir and business claims. Lower-value owner claims frequently do not require notarization. The state claim form states the requirement.",
  },
  {
    q: "How do I claim a deceased relative's unclaimed property?",
    a: "As an heir you submit a certified death certificate, proof of your relationship to the owner, and estate authority — letters testamentary or, for small estates, a small-estate affidavit if the estate qualifies. The claim is usually notarized and takes longer than an owner claim.",
  },
];
