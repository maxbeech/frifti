import type { ContentFormat, Post, PostCategory } from "../types";

type Article = {
  slug: string;
  title: string;
  category: PostCategory;
  format: ContentFormat;
  published: string;
  description: string;
  keyword: string;
  supporting: string[];
  longTail: string[];
  image: [string, string, string, string];
  angle: string;
  answer: string;
  example: string;
  steps: string[];
  pitfalls: string[];
  table: string[][];
  quote: string;
  quoteAttribution: string;
  officialSource: string;
  officialLabel: string;
  related: string[];
  review?: Post["review"];
};

const USA_GOV = "https://www.usa.gov/unclaimed-money";
const NAUPA = "https://unclaimed.org/";

/**
 * September's editorial batch. The shared composition below deliberately keeps the factual
 * spine consistent (official sources first, free claim path first) while each record supplies
 * its own search intent, worked situation, decision points, table and pitfalls.
 */
function makePost(a: Article): Post {
  const isReview = a.category === "reviews";
  const isNews = a.category === "news";
  const journeyHeading = isReview ? "What to expect before you use this service" : isNews ? "Why this matters now" : "The practical route";
  const actionHeading = isReview ? "How to use it without missing a better route" : isNews ? "What to do with this information" : "A sensible way to proceed";
  const recordKeeping = isReview
    ? "For a review or comparison, write down the service's stated scope before you search. Does it cover one state or several? Is it the holder of the record or merely a search layer? Is the claim submitted there or with an agency elsewhere? Those four answers stop a useful tool being mistaken for a complete solution. A good comparison is not about declaring one search box the winner; it is about knowing when the direct source has more authority."
    : isNews
      ? "For a news-led search, date your notes. Public figures, deadlines and database refreshes can change, and a headline is not a personal result. Recording the source page, the date you looked and the action it suggested gives you a way to distinguish a current official update from a recycled social post. If a deadline affects you, return to the agency page rather than relying on a summary."
      : "Keep the claim record modest but complete: the date of the search, the programme used, the spelling searched, the address that matched and the property ID. Save a PDF or screenshot for your own reference, but regard the programme's live record as authoritative. This lets you explain a match quickly if a claimant-services officer asks, without resubmitting every document you own or trying to reconstruct the search months later.";
  const sourceSentence = `Start with **[${a.officialLabel}](${a.officialSource})** and cross-check it through **[USAGov's unclaimed-money directory](${USA_GOV})**. The directory matters because it makes a useful distinction: state-held property, federal refunds, pensions, closed-bank deposits and court funds live in different systems. One search cannot honestly cover them all.`;

  return {
    slug: a.slug,
    title: a.title,
    category: a.category,
    format: a.format,
    author: "Frifti Content Team",
    published: a.published,
    updated: a.published,
    description: a.description,
    primaryKeyword: a.keyword,
    supportingKeywords: a.supporting,
    longTailPhrases: a.longTail,
    featuredImage: { src: a.image[0], alt: a.image[1], credit: `Photo by ${a.image[2]}`, creditUrl: a.image[3] },
    body: [
      { note: `${a.answer} ${a.angle} The free, official route comes first; paid help is optional and should never be needed merely to search or submit your own claim.` },
      { p: `${a.answer} That is the useful short answer, but the detail changes what you do next. A name match, a former address or an old employer can look convincing on screen without being enough to prove entitlement. This guide separates the quick check from the paperwork, so you can move with confidence rather than hand over personal information because a page makes a big promise.` },
      { p: `${a.angle} It is worth doing carefully now. A tidy 20-minute search can uncover a forgotten balance or rule one out for good; a hurried one often produces a false lead, a duplicate submission or a request for documents you did not need to send. The aim is not to make the process grander than it is. It is to use the right public record, keep a simple trail and stop when the evidence says stop.` },
      { h2: journeyHeading },
      { p: sourceSentence },
      { p: `Think of the process as two separate jobs. First, identify a record that could be connected to you, your business or an estate. Second, prove the connection to the holder's standard. The first job is usually a name-and-address search. The second may call for a photo ID, a historic address, a company role or probate papers. Keeping those jobs apart is the easiest way to avoid oversharing too early.` },
      { ol: a.steps.map((step, index) => `**${index + 1}. ${step}**`) },
      { h2: "What evidence actually carries weight" },
      { p: `The most useful proof is contemporaneous: a document created at the time the account, job, policy or address existed. A current driving licence proves who you are today. An old utility bill, a payroll record, a bank statement or a filed business record helps connect that identity to the listing. Do not assume a screenshot of a search result does the same job. It helps you keep a reference number, but it is not ownership evidence.` },
      { p: `For a straightforward personal claim, begin with the minimum the official portal asks for and keep copies of everything submitted. For a claim involving a former name, business or deceased person, make a one-page chronology before uploading anything: the name used then, the relevant address, the dates, and the document that anchors each point. That small bit of preparation makes a follow-up request much less annoying.` },
      { table: { caption: `Decision guide for ${a.keyword}: use the official record and evidence that fits the claimant.`, headers: ["Situation", "Best first evidence", "Useful next move"], rows: a.table } },
      { h2: "A worked example" },
      { p: a.example },
      { p: `The point of the example is not that every claim will follow the same timetable. States, agencies and holders set their own checks. It shows the pattern that tends to work: make one precise search, save the record number, match the record to a dated document, then respond only to the official request. That is slower than clicking every advert in the results page, but it is much safer and usually less work in the end.` },
      { h2: "Keep the next step orderly" },
      { p: recordKeeping },
      { p: "Avoid turning a simple search into a document dump. Put a copy of each submitted item, the confirmation page and any case number in one folder. Name files plainly, for example `old-address-lease-2017.pdf`, rather than `scan003.pdf`. If a portal has a message centre, check that rather than replying to an unexpected email. A state office may ask for more evidence, but it should be able to connect that request to a real claim you started." },
      { p: "If nothing matches, that is still a useful result. Note the names, addresses and states searched, then add a reminder to check again after a meaningful life event: a move, a name change, a former employer closing a plan or discovery of an old address. Unclaimed-property programmes receive new reports over time. Repeating a targeted search later is sensible; repeating the same broad search every week is not." },
      { p: "One final practical detail: use a private connection and your own device when you review records that may later require identity proof. Close shared-browser sessions when you finish, and keep any confirmation email with the claim record rather than forwarding it around. These are ordinary housekeeping steps, but they preserve the calm, documented trail that makes a genuine claim easier to finish." },
      { quote: { text: a.quote, attribution: a.quoteAttribution } },
      { h2: "Common mistakes to avoid" },
      { ul: a.pitfalls.map((pitfall) => pitfall) },
      { p: `There is a useful rule of thumb here: an official office may need sensitive evidence to pay a claim, but it should not need your full financial history just to let you look. Use the direct government or programme domain, check the privacy notice before an upload, and never pay an advance fee to release money that is already recorded in your name. **[NAUPA](${NAUPA})** and USAGov both point searchers towards official state programmes.` },
      { h2: actionHeading },
      { p: isReview
        ? `Use this service as one input, not as a substitute for the responsible state or federal office. Read the scope, note what it does not search, then run the official search before deciding whether any convenience feature is worth your time. If the result is a match, the claim itself belongs with the agency holding the property.`
        : isNews
          ? `Treat the change as a prompt to review your own paper trail, not as a reason to panic. Search every relevant state under name variants, save a modest log of results and revisit the official source if a deadline or policy changes. The broader lesson is simple: fragmented public records reward methodical searches more than quick guesses.`
          : `Set aside one calm session to work through the official route. Start with the state or programme most closely tied to the record, try name variants and old addresses, and keep the reference number with your evidence. If the claim becomes an estate, business or multi-state matter, our **[claim-document checklist](/blog/what-documents-to-claim-unclaimed-property)** and **[multi-state guide](/blog/how-to-find-unclaimed-money-in-multiple-states)** explain the next layer without hiding the free route.` },
      { h2: "Before you close the tab" },
      { p: `Write down what you searched, including the spelling used and the date. A short record prevents you from repeating the same empty search next month and makes it easier to return if you find an old address later. For a wider sweep, use our **[complete unclaimed-money guide](/blog/how-to-find-unclaimed-money-complete-guide)** as the starting list, then follow the official link for each programme. That is the sensible awareness-stage next step: free, concrete and in your control.` },
    ],
    faq: [
      { q: `Is ${a.keyword} free?`, a: "Searching official unclaimed-property programmes is free, and an owner can normally file their own claim without a finder fee. A particular claim may require documents or a notary under the holder's rules, so check the official instructions for the listing." },
      { q: `What should I prepare before I start ${a.keyword}?`, a: "Have the relevant current and former names, old addresses, approximate dates and a place to save record numbers. Do not upload identity documents until an official programme asks for them as part of a claim." },
      { q: "How do I know a search result is genuine?", a: "Confirm the programme through USAGov, NAUPA or the named state agency, then use its direct official domain. A result page alone is not proof of ownership; the agency will set the evidence needed for a claim." },
      { q: "Can somebody else claim on my behalf?", a: "It depends on the programme and relationship. Heirs, authorised representatives and business officers commonly need extra proof of authority. Check the official claim instructions before sending documents." },
    ],
    related: a.related,
    review: a.review,
  };
}

const articles: Article[] = [
  {
    slug: "how-to-claim-unclaimed-property",
    title: "How to Claim Unclaimed Property",
    category: "academy", format: "how-to", published: "2026-09-24",
    description: "Claim unclaimed property through the official state route, with the documents, checks and follow-up steps that make a claim easier.",
    keyword: "how to claim unclaimed property",
    supporting: ["claim unclaimed money", "unclaimed property claim", "claim money online", "unclaimed funds claim", "state treasury claim", "claim proof documents", "free property claim"],
    longTail: ["how to claim unclaimed property online", "what documents do I need for an unclaimed property claim"],
    image: ["https://images.pexels.com/photos/8962441/pexels-photo-8962441.jpeg", "Unclaimed property claim paperwork on a desk", "Leeloo The First", "https://www.pexels.com/@leeloothefirst"],
    answer: "To claim unclaimed property, file with the state or agency that holds the record and provide the specific identity and ownership evidence it asks for.",
    angle: "Most delays come from treating a search match as a completed claim, when the real work is connecting your current identity to the older record.",
    steps: ["Search the official portal using current and former names", "Open the record and save its property or claim number", "Read the holder's document list before starting an application", "Submit only the requested proof through the official claim route", "Track the acknowledgement and answer a follow-up from the holder"],
    pitfalls: ["Submitting a claim to the state where you live now rather than the state shown on the record.", "Uploading a full Social Security card before the official claim form requests it.", "Using a paid finder before trying the free claimant route."],
    table: [["Your current name matches", "Photo ID and current address", "Start the online claim"], ["Former address appears", "Old bill, lease or bank record", "Add it only if requested"], ["Name changed", "Marriage, divorce or court record", "Link old and current names"]],
    example: "Mina found a small listing from the state where she had rented after university. Her current name matched, but the address did not. She saved the listing number, found an old tenancy email with the address, and attached it only after the portal requested proof. The agency asked for no elaborate story: the record number, ID and dated address evidence did the job.",
    quote: "Search for unclaimed money from your state's unclaimed property office.", quoteAttribution: "USAGov, unclaimed-money guidance (accessed 23 September 2026)", officialSource: USA_GOV, officialLabel: "USAGov's official unclaimed-money guidance",
    related: ["what-documents-to-claim-unclaimed-property", "how-long-does-unclaimed-property-take", "is-unclaimed-property-search-free"],
  },
  {
    slug: "what-is-unclaimed-property",
    title: "What Is Unclaimed Property?",
    category: "academy", format: "deep-dive", published: "2026-09-24",
    description: "What unclaimed property means, where it comes from and how to check official state records without paying a finder.",
    keyword: "what is unclaimed property",
    supporting: ["unclaimed money definition", "unclaimed funds", "escheatment", "state held property", "lost money", "unclaimed assets", "unclaimed property examples"],
    longTail: ["what counts as unclaimed property", "why does the state hold unclaimed money"],
    image: ["https://images.pexels.com/photos/6329026/pexels-photo-6329026.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", "Person organising financial records for unclaimed property", "Karolina Grabowska", "https://www.pexels.com/@karola-g"],
    answer: "Unclaimed property is money or an asset owed to an owner that a business, financial institution or government body could not deliver or contact them about.",
    angle: "It usually starts with an ordinary loose end, such as an uncashed cheque, a deposit or an inactive account, rather than a mysterious windfall.",
    steps: ["Identify the type of property you are asking about", "List the states connected to its last known address", "Search each official programme under name variations", "Separate a state listing from federal, pension or court sources", "Keep the official record number if you see a credible match"],
    pitfalls: ["Assuming all unclaimed property sits in one national database.", "Confusing a dormant account with a forfeited account.", "Treating a public listing as permission to claim somebody else's property."],
    table: [["Uncashed payment", "State programme after its dormancy period", "Search the last-known-address state"], ["Old pension", "PBGC or plan provider", "Use the retirement-benefits search"], ["Tax refund", "IRS", "Use the IRS refund route"]],
    example: "A former employer sent Jay's final expenses cheque to an address he had already left. Years later, he remembered the job while checking the state programme under an old address. The listing was not a bonus or a new benefit. It was his own unrecovered payment, transferred into the state's custody after the employer could not reach him.",
    quote: "If a business, financial institution, or government owes you money that you did not collect, it is considered unclaimed money or property.", quoteAttribution: "USAGov, unclaimed-money guidance (accessed 23 September 2026)", officialSource: USA_GOV, officialLabel: "USAGov's definition and source directory",
    related: ["why-do-states-hold-unclaimed-property", "how-to-find-unclaimed-money-complete-guide", "what-is-naupa-unclaimed-property"],
  },
  {
    slug: "search-unclaimed-money-by-social-security-number",
    title: "Can You Search Unclaimed Money by SSN?",
    category: "academy", format: "how-to", published: "2026-09-25",
    description: "Learn when an official programme may use the last four digits of an SSN, and how to search unclaimed money without oversharing data.",
    keyword: "search unclaimed money by social security number",
    supporting: ["unclaimed money ssn search", "find money by social security number", "unclaimed property search", "last four SSN digits", "official money search", "identity verification", "safe unclaimed money search"],
    longTail: ["free unclaimed money search by social security number", "can I search unclaimed property with the last four digits of my SSN"],
    image: ["https://images.pexels.com/photos/45113/pexels-photo-45113.jpeg", "Identity document used for a secure unclaimed money search", "Dom J", "https://www.pexels.com/@dom-j-7304"],
    answer: "Do not give a full Social Security number to a general unclaimed-money search site; some official programmes use only the last four digits later to confirm a match.",
    angle: "The safest search begins with a name and former address. A legitimate identity check is specific to the programme, clear about why it is needed and happens on its official domain.",
    steps: ["Search the state programme by name and former address first", "Confirm the programme through USAGov or the state agency", "Read the privacy notice before entering any identifier", "Use only the exact identifier and field the official page requests", "Leave the site if it asks for a card payment or an unnecessary full SSN"],
    pitfalls: ["Entering a full SSN into a search advert or data-broker page.", "Mistaking a name match for identity verification.", "Assuming PBGC rules apply to every state programme."],
    table: [["State name search", "Name and prior address", "Usually enough to browse records"], ["PBGC benefit search", "Last name and last four SSN digits", "Use only PBGC's official search"], ["Claim application", "Holder-specific proof", "Follow the listed instructions"]],
    example: "Erin found a pension lead after leaving a manufacturing job years earlier. The state search gave her no results, so she used PBGC's official retirement-benefits search. It asked for her surname and last four digits, not a full number. That difference mattered: she could check a defined purpose on a government site instead of handing a full identifier to a broad search page.",
    quote: "Enter your last name and the last four digits of your Social Security number.", quoteAttribution: "PBGC, Find unclaimed retirement benefits (database updated 5 August 2026)", officialSource: "https://www.pbgc.gov/workers-retirees/find-unclaimed-retirement-benefits/search-unclaimed", officialLabel: "PBGC's official retirement-benefits search",
    related: ["how-to-find-old-401k", "how-to-find-a-lost-pension", "unclaimed-money-scams-red-flags"],
  },
  {
    slug: "claim-unclaimed-property-for-a-business",
    title: "Claim Unclaimed Property for a Business",
    category: "academy", format: "how-to", published: "2026-09-25",
    description: "A practical guide to finding and claiming unclaimed property for a business, including authority, records and common delays.",
    keyword: "claim unclaimed property for a business",
    supporting: ["business unclaimed property", "company unclaimed funds", "business claim form", "corporate property claim", "business ownership proof", "unclaimed assets", "state treasury business claim"],
    longTail: ["how to claim unclaimed money for a business", "what documents does a business need for an unclaimed property claim"],
    image: ["https://images.pexels.com/photos/7309483/pexels-photo-7309483.jpeg", "Business owner reviewing company records for an unclaimed property claim", "RDNE Stock project", "https://www.pexels.com/@rdne"],
    answer: "A business can claim property recorded in its legal name, but the signer must show both the company's connection to the record and their authority to act.",
    angle: "The awkward bit is rarely finding the listing. It is reconciling a trading name, merger, old address or departed officer with the current entity record.",
    steps: ["Search the legal entity name and historic trading names", "Record the listed owner name, address and property ID", "Check the state's business-claim requirements", "Gather formation, tax or registry evidence that links old and current names", "Have an authorised officer submit and retain the confirmation"],
    pitfalls: ["Searching only the brand name and not the legal entity name.", "Letting a staff member sign without proof of authority.", "Sending current records that do not show the historic address or predecessor entity."],
    table: [["Same legal name", "Current registry extract and signer authority", "File with the state holder"], ["Former DBA", "DBA filing or tax record", "Show the name connection"], ["Merger or acquisition", "Merger certificate or assignment", "Explain succession briefly"]],
    example: "A small design studio found a listing under the name it used before incorporating. Its finance manager did not rush to submit a personal claim. She matched the old invoice address to a DBA registration, obtained a short officer authorisation and filed the company claim. The state had a clean chain from the old public-facing name to the present business.",
    quote: "State governments hold most unclaimed money.", quoteAttribution: "USAGov, unclaimed-money guidance (accessed 23 September 2026)", officialSource: USA_GOV, officialLabel: "USAGov's official source directory",
    related: ["how-to-claim-unclaimed-property", "what-documents-to-claim-unclaimed-property", "how-to-find-unclaimed-money-in-multiple-states"],
  },
  {
    slug: "how-to-verify-unclaimed-property",
    title: "How to Verify an Unclaimed Property Match",
    category: "academy", format: "how-to", published: "2026-09-26",
    description: "Verify an unclaimed property match safely by comparing names, addresses and official record details before you send documents.",
    keyword: "verify unclaimed property",
    supporting: ["unclaimed property match", "verify unclaimed money", "property ID", "official state portal", "claimant proof", "unclaimed funds verification", "state treasury record"],
    longTail: ["how do I verify an unclaimed property match", "is an unclaimed money listing really mine"],
    image: ["https://images.pexels.com/photos/6862458/pexels-photo-6862458.jpeg", "Person checking a financial record before verifying unclaimed property", "cottonbro studio", "https://www.pexels.com/@cottonbro"],
    answer: "Verify an unclaimed property match by comparing the official listing's owner name and address with records from the same period before starting a claim.",
    angle: "Similar names are common, especially in large states. A careful cross-check protects you from a wasted claim and from sharing documents with a lookalike site.",
    steps: ["Open the result on the named state programme, not a search-ad link", "Save the property ID and every non-sensitive detail shown", "Compare old addresses, employers and name variants with your records", "Check whether a joint owner or business name changes the claimant", "Begin the official claim only when the connection is coherent"],
    pitfalls: ["Claiming solely because a name looks familiar.", "Ignoring a middle initial or old address that points to another person.", "Using email links in unsolicited finder messages instead of the state portal."],
    table: [["Exact name, wrong address", "Historic address records", "Do not assume it is yours"], ["Former name and right address", "Name-change record", "Likely worth claiming"], ["Business or joint owner", "Authority or relationship proof", "Read the special instructions"]],
    example: "Alberto saw a listing with his surname and first initial but paused when the town did not ring a bell. A second record carried a former address from his first job and an old middle initial. He claimed the second one, not the first. The extra five minutes avoided a false claim and gave him the exact record number the state needed.",
    quote: "There is no single place to look for all unclaimed money.", quoteAttribution: "USAGov, unclaimed-money guidance (accessed 23 September 2026)", officialSource: USA_GOV, officialLabel: "USAGov's official source directory",
    related: ["how-to-claim-unclaimed-property", "unclaimed-money-scams-red-flags", "is-missingmoney-com-legit"],
  },
  {
    slug: "is-unclaimed-money-real",
    title: "Is Unclaimed Money Real?",
    category: "academy", format: "deep-dive", published: "2026-09-26",
    description: "Yes, unclaimed money is real. Learn why states hold it, how official searches work and how to avoid paid finder traps.",
    keyword: "is unclaimed money real",
    supporting: ["is unclaimed property real", "unclaimed money legitimate", "state held money", "unclaimed funds scam", "free official search", "state treasury records", "find lost money"],
    longTail: ["is unclaimed money from the government real", "are unclaimed money sites legitimate"],
    image: ["https://images.pexels.com/photos/8062357/pexels-photo-8062357.jpeg", "Person checking whether an unclaimed money notice is real", "Nataliya Vaitkevich", "https://www.pexels.com/@n-voitkevich"],
    answer: "Unclaimed money is real, but a message about it is not automatically trustworthy; the dependable route is to search the responsible public programme yourself.",
    angle: "The underlying records are legitimate. The confusion comes from fragmented programmes and commercial sites that sit between people and a free government claim route.",
    steps: ["Ignore urgency in an unsolicited message", "Find the named state or agency independently", "Search your own name and former addresses", "Compare the result with personal records", "File directly with the holder if it is yours"],
    pitfalls: ["Believing an advert that says it searches every possible source.", "Paying a percentage before confirming a record exists.", "Assuming an official-looking badge proves a site is government-run."],
    table: [["Official programme", "Named government agency and direct domain", "Use it for search and claim"], ["Finder service", "May charge for convenience", "Check the free route first"], ["Scam message", "Pressure or up-front payment", "Close it and search independently"]],
    example: "When Ruth received a letter offering to recover funds for a percentage, she was suspicious for good reason. She did not call the number. Instead, she found her state's programme through USAGov, searched her former surname and discovered a genuine listing. The record was real; the paid shortcut was unnecessary.",
    quote: "You may be able to file for unclaimed money owed to you.", quoteAttribution: "USAGov, unclaimed-money guidance (accessed 23 September 2026)", officialSource: USA_GOV, officialLabel: "USAGov's official unclaimed-money guidance",
    related: ["unclaimed-money-scams-red-flags", "is-unclaimed-property-search-free", "how-to-find-unclaimed-money-complete-guide"],
  },
  {
    slug: "how-to-find-a-lost-bank-account",
    title: "How to Find a Lost Bank Account",
    category: "academy", format: "how-to", published: "2026-09-27",
    description: "Find a lost bank account by tracing old banks, addresses and state unclaimed-property records through the free official route.",
    keyword: "how to find a lost bank account",
    supporting: ["forgotten bank account", "old bank account search", "dormant account", "unclaimed bank money", "lost savings account", "bank account unclaimed property", "state property search"],
    longTail: ["how do I find an old bank account in my name", "can a forgotten bank account become unclaimed property"],
    image: ["https://images.pexels.com/photos/6961857/pexels-photo-6961857.png?auto=compress&cs=tinysrgb&h=650&w=940", "Laptop used to trace a lost bank account", "Firmbee.com", "https://www.pexels.com/@firmbee-com-22729701"],
    answer: "To find a lost bank account, start with the bank if you can identify it, then search the official unclaimed-property programme for the state of the account's last known address.",
    angle: "An old savings account does not vanish because you forgot it. It may remain with the bank, move through a merger or eventually be reported to a state programme after the required dormancy process.",
    steps: ["List old banks, credit unions and addresses", "Search archived statements, tax forms and email for account clues", "Contact a known institution through its official customer channel", "Search the relevant state programme under name variants", "Keep the inquiry separate from a formal claim until you have a match"],
    pitfalls: ["Calling a number from a search advert rather than the bank's official site.", "Searching only the state where you live now.", "Assuming a bank merger means an old balance disappeared."],
    table: [["You know the bank", "Old statement or account fragment", "Contact its official support"], ["You know only the address", "Former address and name", "Search that state's programme"], ["Bank failed", "Institution name and records", "Check the FDIC route via USAGov"]],
    example: "Marcus remembered opening a savings account near a summer job but had no account number. A digitised tax return showed interest from a bank that had since merged. He contacted the successor institution, then searched the state tied to his former address. The latter search produced the record number he needed; guessing a bank branch would not have done it.",
    quote: "Bank accounts ... are common sources of unclaimed funds.", quoteAttribution: "USAGov, unclaimed-money guidance (accessed 23 September 2026)", officialSource: USA_GOV, officialLabel: "USAGov's official source directory",
    related: ["what-is-unclaimed-property", "how-to-find-unclaimed-money-in-multiple-states", "why-do-states-hold-unclaimed-property"],
  },
  {
    slug: "dormant-bank-account-explained",
    title: "What Happens to a Dormant Bank Account?",
    category: "academy", format: "deep-dive", published: "2026-09-27",
    description: "Understand dormant bank accounts, what can happen after inactivity and when an account may appear in state unclaimed-property records.",
    keyword: "dormant bank account",
    supporting: ["inactive bank account", "forgotten bank account", "unclaimed bank funds", "bank account dormancy", "escheatment", "lost savings account", "state unclaimed property"],
    longTail: ["what happens when a bank account becomes dormant", "how long before a dormant account is sent to unclaimed property"],
    image: ["https://images.pexels.com/photos/28403067/pexels-photo-28403067.jpeg", "Financial documents explaining a dormant bank account", "gabriel bodhi", "https://www.pexels.com/@gabrielbodhi"],
    answer: "A dormant bank account is an inactive account under the bank's rules; if contact remains unsuccessful over the relevant period, the funds may eventually be reported to the applicable state unclaimed-property programme.",
    angle: "The key word is eventually. Bank policy, state law and the address on record determine the route, so there is no honest national countdown for every account.",
    steps: ["Check whether the account is still held by a known institution", "Update contact details if the bank confirms an open account", "Identify the last address tied to the account", "Search that state's official property programme if the bank cannot locate it", "Use the property ID and required proof for a claim"],
    pitfalls: ["Assuming inactivity automatically means the bank has closed the account.", "Using a current address when the relevant account used an older one.", "Relying on a third-party dormancy timetable for a different state."],
    table: [["Recent inactive account", "Bank statement or account detail", "Ask the institution about status"], ["Bank cannot locate account", "Former address and name", "Check state property records"], ["Closed institution", "Bank name and closure date", "Use the federal route in USAGov's directory"]],
    example: "Daphne had not used a small account since moving for a new role. Rather than assume it had become unclaimed property, she checked the bank's official support route first. The account had been transferred during a merger. Only when that lead was exhausted did she search the last-address state programme, which is the order that kept the search simple.",
    quote: "Search for unclaimed money from your state's unclaimed property office.", quoteAttribution: "USAGov, unclaimed-money guidance (accessed 23 September 2026)", officialSource: USA_GOV, officialLabel: "USAGov's official source directory",
    related: ["how-to-find-a-lost-bank-account", "what-is-unclaimed-property", "why-do-states-hold-unclaimed-property"],
  },
  {
    slug: "unclaimed-property-after-death",
    title: "Unclaimed Property After a Death",
    category: "academy", format: "case-study", published: "2026-09-28",
    description: "How heirs can search for and claim a deceased relative's unclaimed property, with a clear evidence trail and official sources.",
    keyword: "unclaimed property after death",
    supporting: ["unclaimed money deceased relative", "claim deceased property", "heir unclaimed funds", "estate claim", "inheritance property search", "death certificate claim", "probate documents"],
    longTail: ["how to claim unclaimed property for a deceased parent", "can an heir claim unclaimed money from a deceased relative"],
    image: ["https://images.pexels.com/photos/32201000/pexels-photo-32201000.jpeg", "Family reviewing estate documents for an unclaimed property claim", "Joachim Schnürle", "https://www.pexels.com/@joa70"],
    answer: "An heir may be able to claim a deceased relative's unclaimed property, but must usually prove the person's death, their own identity and their legal right to receive the property.",
    angle: "Estate claims are often slow because a vague family connection is not the same as legal authority. A calm evidence trail is more useful than a long explanation.",
    steps: ["List every state where the relative lived, worked or held accounts", "Search their full legal name and known name variants", "Save each official listing and its property ID", "Read the estate or heir instructions for that state", "Gather death, relationship and authority documents before filing"],
    pitfalls: ["Submitting a personal claim in the deceased person's name.", "Assuming a will alone always establishes the right claimant.", "Mixing records for two relatives with similar names."],
    table: [["Named executor", "Court appointment and death certificate", "Use the estate claim route"], ["No formal estate", "Death and heirship evidence", "Check the state's small-estate rules"], ["Several heirs", "State-specific authority documents", "Agree the authorised claimant first"]],
    example: "After her aunt died, Leanne searched only the state where the funeral took place and found nothing. A later search in the state where her aunt had worked produced a listing. Leanne did not submit it under her own name. She first obtained the estate documents requested by that state, then used the property number to keep each item of proof tied to the correct listing.",
    quote: "You may be able to file for unclaimed money ... owed to a deceased relative if you are their legal heir.", quoteAttribution: "USAGov, unclaimed-money guidance (accessed 23 September 2026)", officialSource: USA_GOV, officialLabel: "USAGov's official estate-search guidance",
    related: ["unclaimed-inheritance-from-deceased-relative", "what-documents-to-claim-unclaimed-property", "how-to-find-unclaimed-money-in-multiple-states"],
  },
  {
    slug: "missingmoney-com-alternative-state-searches",
    title: "MissingMoney.com Alternatives: State Searches",
    category: "reviews", format: "review", published: "2026-09-28",
    description: "Compare MissingMoney.com with official state unclaimed-property searches and learn when a direct state portal is the better option.",
    keyword: "MissingMoney.com alternative",
    supporting: ["MissingMoney alternatives", "state unclaimed property search", "official unclaimed money search", "free property finder", "unclaimed funds search", "NAUPA search", "state treasury portal"],
    longTail: ["best alternative to MissingMoney.com", "should I search the state portal instead of MissingMoney"],
    image: ["https://images.pexels.com/photos/5831661/pexels-photo-5831661.jpeg", "Laptop showing an online state unclaimed property search", "AlphaTradeZone", "https://www.pexels.com/@alphatradezone"],
    answer: "The best MissingMoney.com alternative is usually the official portal for each state connected to your old address, because the state holder is the place that processes the claim.",
    angle: "A multi-state tool can be a convenient first pass, but convenience is not coverage. Direct state searches are the durable backstop when a result matters.",
    steps: ["Use a multi-state tool only as an initial sweep", "List every state it might not cover or where you lived", "Open each official state portal from USAGov or NAUPA", "Run the same name and address variants", "File with the state that holds a confirmed listing"],
    pitfalls: ["Assuming no result means every state was searched.", "Treating a third-party result as an official claim submission.", "Paying for a report before checking state portals."],
    table: [["Multi-state tool", "Quick first pass", "Check scope and gaps"], ["Official state portal", "Direct holder records", "Use for verification and claim"], ["Paid finder", "Convenience service", "Try free official options first"]],
    example: "A couple searched a multi-state service before moving house and found nothing. They later reviewed their address list and checked two state portals directly. One had a record under a shortened version of a surname. The lesson was not that the first service was fraudulent; it was that a broad starting point was not a complete search plan.",
    quote: "Search for unclaimed money from your state's unclaimed property office.", quoteAttribution: "USAGov, unclaimed-money guidance (accessed 23 September 2026)", officialSource: USA_GOV, officialLabel: "USAGov's official state-directory guidance",
    related: ["is-missingmoney-com-legit", "how-to-find-unclaimed-money-in-multiple-states", "unclaimed-money-scams-red-flags"],
    review: { itemName: "MissingMoney.com search approach", ratingValue: 3.8, pros: ["Useful starting point", "Free to search", "Simple name lookup"], cons: ["Not a substitute for every state portal", "Coverage and record timing can vary", "Claim still belongs with the holder"] },
  },
  {
    slug: "florida-treasure-hunt-explained",
    title: "Florida Treasure Hunt Explained",
    category: "reviews", format: "review", published: "2026-09-29",
    description: "What Florida Treasure Hunt is, how to search it safely and what to prepare before claiming Florida unclaimed property.",
    keyword: "Florida Treasure Hunt",
    supporting: ["Florida unclaimed property", "FL Treasure Hunt", "Florida unclaimed money", "Florida property search", "Florida claim form", "Florida Department of Financial Services", "find Florida funds"],
    longTail: ["is Florida Treasure Hunt official", "how do I claim money from Florida Treasure Hunt"],
    image: ["https://images.pexels.com/photos/11482767/pexels-photo-11482767.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", "Florida resident using an official unclaimed property search", "Sebastian Angarita", "https://www.pexels.com/@sebastian-angarita-188980555"],
    answer: "Florida Treasure Hunt is the Florida Department of Financial Services' official unclaimed-property search and claim route.",
    angle: "Its plain name can make it look like a competition page, but the useful test is the agency: follow the Department of Financial Services route and read the record details before applying.",
    steps: ["Open the Florida Department of Financial Services portal directly", "Search current and former names", "Use former Florida addresses to assess a result", "Save the property ID and review claim requirements", "File only through the official claim flow"],
    pitfalls: ["Clicking a paid advert above the official result.", "Searching just one spelling of a married or shortened surname.", "Expecting the portal to cover money held by another state or federal agency."],
    table: [["Florida address match", "ID and address link", "Begin the official claim"], ["Former name", "Name-change proof", "Add it if requested"], ["Out-of-state record", "Relevant state portal", "Search that state instead"]],
    example: "A Florida retiree remembered a utility deposit from a move years ago but could not remember the provider's name. Searching the official programme under a maiden name revealed an address match. She printed the record number, gathered the requested identification and kept the state page as the only claim channel, rather than responding to a finder advert.",
    quote: "State governments hold most unclaimed money.", quoteAttribution: "USAGov, unclaimed-money guidance (accessed 23 September 2026)", officialSource: "https://www.fltreasurehunt.gov/", officialLabel: "Florida Treasure Hunt's official portal",
    related: ["how-to-claim-unclaimed-property", "how-to-find-unclaimed-money-in-multiple-states", "is-unclaimed-property-search-free"],
    review: { itemName: "Florida Treasure Hunt", ratingValue: 4.5, pros: ["Official state programme", "Free search and claim route", "Direct Florida record access"], cons: ["Florida records only", "Documentation depends on the listing", "Former names still need separate searches"] },
  },
  {
    slug: "ct-big-list-explained",
    title: "CT Big List Explained",
    category: "reviews", format: "review", published: "2026-09-29",
    description: "A clear guide to CT Big List, Connecticut's official unclaimed-property search, with safe search and claim steps.",
    keyword: "CT Big List",
    supporting: ["Connecticut unclaimed property", "CT unclaimed money", "Connecticut property search", "CT Big List claim", "Connecticut Treasurer", "unclaimed funds Connecticut", "find CT money"],
    longTail: ["is CT Big List official", "how to claim money on CT Big List"],
    image: ["https://images.pexels.com/photos/7857567/pexels-photo-7857567.jpeg", "Connecticut claimant reviewing financial paperwork at home", "Kampus Production", "https://www.pexels.com/@kampus"],
    answer: "CT Big List is Connecticut's official unclaimed-property search site, operated for the Office of the Treasurer.",
    angle: "The name is informal; the process is not. Treat each listing as a lead that needs an address and ownership check before you send an application.",
    steps: ["Open CT Big List from the Connecticut Treasurer route", "Search exact and former names", "Check the address and listed owner details", "Record the property ID for any credible match", "Follow Connecticut's requested claim steps"],
    pitfalls: ["Assuming a surname-only match belongs to you.", "Skipping an old Connecticut address because you no longer live there.", "Uploading documents to a lookalike domain."],
    table: [["Exact owner and address", "Current ID plus address proof", "Start the CT claim"], ["Former surname", "Name-change document", "Show the connection"], ["Similar owner", "No matching address", "Leave it unclaimed"]],
    example: "Noah found three listings under his surname. Two used towns he had never lived in. The third carried the address on a saved first-apartment lease. By checking the address before filing, he gave Connecticut a clean match and avoided cluttering the system with claims for unrelated people.",
    quote: "Search for unclaimed money from your state's unclaimed property office.", quoteAttribution: "USAGov, unclaimed-money guidance (accessed 23 September 2026)", officialSource: "https://ctbiglist.com/", officialLabel: "CT Big List's official portal",
    related: ["how-to-verify-unclaimed-property", "how-to-claim-unclaimed-property", "unclaimed-money-scams-red-flags"],
    review: { itemName: "CT Big List", ratingValue: 4.4, pros: ["Official Connecticut route", "Free public search", "Clear property records"], cons: ["Connecticut only", "Similar names need careful checks", "Claim requirements vary"] },
  },
  {
    slug: "nc-cash-explained",
    title: "NC Cash: How North Carolina Searches Work",
    category: "reviews", format: "review", published: "2026-09-30",
    description: "How NC Cash works, how to search North Carolina unclaimed money and the checks to make before filing a claim.",
    keyword: "NC Cash unclaimed money",
    supporting: ["NC Cash", "North Carolina unclaimed property", "North Carolina unclaimed funds", "NCCash search", "North Carolina claim", "state treasury money", "find NC money"],
    longTail: ["is NC Cash the official North Carolina unclaimed property site", "how to claim unclaimed money in North Carolina"],
    image: ["https://images.pexels.com/photos/1181449/pexels-photo-1181449.jpeg", "North Carolina user making an official online unclaimed money search", "Christina Morillo", "https://www.pexels.com/@divinetechygirl"],
    answer: "NC Cash is the North Carolina Department of State Treasurer's official route for searching and claiming North Carolina unclaimed property.",
    angle: "North Carolina searches are strongest when you use the owner name that was on the original account and the address that holder would have had, not merely today's details.",
    steps: ["Open NC Cash from the State Treasurer's official domain", "Search current, former and business names separately", "Compare every promising result with North Carolina addresses", "Save the listing details before beginning a claim", "Follow the Treasurer's document request exactly"],
    pitfalls: ["Claiming a common-name result without an address check.", "Mixing a business claim with a personal claim.", "Assuming a match in North Carolina excludes property elsewhere."],
    table: [["Personal name", "Old NC address", "Use the individual claim route"], ["Business name", "Business record and authority", "Use the business instructions"], ["Deceased relative", "Death and estate evidence", "Read heir requirements first"]],
    example: "A former Raleigh resident searched NC Cash under her current surname and saw nothing. When she repeated the search under the surname used when she opened an old account, a listing appeared. The match was only convincing once she checked the former address. That is exactly why one careful search beats a broad guess.",
    quote: "Search for unclaimed money from your state's unclaimed property office.", quoteAttribution: "USAGov, unclaimed-money guidance (accessed 23 September 2026)", officialSource: "https://www.nccash.com/", officialLabel: "NC Cash's official portal",
    related: ["how-to-find-unclaimed-money-in-multiple-states", "how-to-verify-unclaimed-property", "unclaimed-property-after-death"],
    review: { itemName: "NC Cash", ratingValue: 4.5, pros: ["Official state route", "Free search and claim process", "Personal, business and estate pathways"], cons: ["North Carolina records only", "Old names need separate searches", "Evidence still determines the claim"] },
  },
  {
    slug: "unclaimed-property-trends-2026",
    title: "Unclaimed Property Trends to Watch in 2026",
    category: "news", format: "trend", published: "2026-09-30",
    description: "The 2026 unclaimed-property trends worth watching: fragmented searches, electronic refunds and safer identity checks.",
    keyword: "unclaimed property trends 2026",
    supporting: ["unclaimed money news", "unclaimed funds 2026", "state property search", "electronic refunds", "identity verification", "PBGC database", "unclaimed tax refunds"],
    longTail: ["what is changing in unclaimed property in 2026", "unclaimed money trends to watch this year"],
    image: ["https://images.pexels.com/photos/6694560/pexels-photo-6694560.jpeg", "Data analysis of unclaimed property trends in 2026", "Tima Miroshnichenko", "https://www.pexels.com/@tima-miroshnichenko"],
    answer: "The clearest 2026 unclaimed-property trend is not one new central database: it is a sharper need to search the right official system for the type of money involved.",
    angle: "Recent official updates make that point plainly. PBGC's retirement-benefits search was updated on 5 August 2026, while the IRS reported in March that an estimated $1.2 billion in 2022 refunds remained unclaimed before its filing deadline.",
    steps: ["Separate state property from tax, pension and court-fund searches", "Check whether the official programme publishes a recent update", "Use a name-and-address search before sensitive identifiers", "Save the date and result of each search", "Review your search list when an official source announces a relevant change"],
    pitfalls: ["Treating a headline total as money available to every searcher.", "Relying on a commercial dashboard instead of the responsible programme.", "Repeating an old search without new names, addresses or sources."],
    table: [["Retirement benefits", "PBGC search database", "Updated 5 August 2026"], ["Unfiled 2022 tax refunds", "IRS filing route", "IRS reported $1.2bn estimate in March"], ["State-held property", "Each state programme", "Search every relevant address state"]],
    example: "A worker who saw the IRS refund headline might reasonably search for a cheque. That would be the wrong action if they never filed the relevant return. The right response is to read the IRS eligibility and deadline notice first, then use the appropriate filing route. A public number is a prompt to check facts, not proof of an individual entitlement.",
    quote: "The database is updated quarterly.", quoteAttribution: "PBGC, Find unclaimed retirement benefits (updated 5 August 2026)", officialSource: "https://www.pbgc.gov/workers-retirees/find-unclaimed-retirement-benefits/search-unclaimed", officialLabel: "PBGC's current retirement-benefits search",
    related: ["irs-unclaimed-money-federal-refund", "how-to-find-a-lost-pension", "government-unclaimed-money-full-list"],
  },
  {
    slug: "why-unclaimed-money-searches-are-rising",
    title: "Why Unclaimed Money Searches Are Rising",
    category: "news", format: "trend", published: "2026-09-30",
    description: "Why more people are checking unclaimed money, what official data shows and how to search the fragmented systems safely.",
    keyword: "unclaimed money searches",
    supporting: ["find unclaimed money", "government money search", "unclaimed property search", "lost pension search", "IRS unclaimed refunds", "state treasury funds", "official money finder"],
    longTail: ["why are people searching for unclaimed money", "how to search every official unclaimed money source"],
    image: ["https://images.pexels.com/photos/8124238/pexels-photo-8124238.jpeg", "Senior person reviewing documents before an unclaimed money search", "RDNE Stock project", "https://www.pexels.com/@rdne"],
    answer: "Unclaimed-money searches are gaining attention because more people now know that state programmes, retirement systems and federal agencies hold different kinds of unpaid funds.",
    angle: "The useful response is not to chase every viral post. It is to build a short, repeatable official-search list based on the states, employers and accounts actually connected to you.",
    steps: ["List places you lived, worked, banked and held insurance", "Search each relevant state programme", "Add specialised federal sources only when the asset type fits", "Use official updates to check deadlines or database refreshes", "Keep a small record so you can repeat the search sensibly"],
    pitfalls: ["Confusing a search increase with proof that a particular listing is yours.", "Giving personal data to a social-media link before locating the official source.", "Skipping former names and addresses while trying more and more websites."],
    table: [["Moved between states", "State property offices", "Search every relevant state"], ["Former private employer", "PBGC where the plan fits", "Check retirement benefits"], ["Unfiled tax year", "IRS guidance", "Confirm the legal deadline"]],
    example: "Priya started with a post saying that 'everyone has money waiting'. She did not take it literally. Instead, she made a list of the two states where she had lived, one former employer and one old bank. The result was a quick, bounded search that left her with records she could verify, not a pile of adverts or a sense that she had missed a secret national pot.",
    quote: "There is no single place to look for all unclaimed money.", quoteAttribution: "USAGov, unclaimed-money guidance (accessed 23 September 2026)", officialSource: USA_GOV, officialLabel: "USAGov's official source directory",
    related: ["how-to-find-unclaimed-money-complete-guide", "government-unclaimed-money-full-list", "unclaimed-money-scams-red-flags"],
  },
];

export const september2026PublicationBatch: Post[] = articles.map(makePost);
