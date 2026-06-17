// Categories of unclaimed property held by US state treasuries. These are the
// standard NAUPA property-type groupings. Dormancy periods (the time an account
// must be inactive before it is reported as unclaimed) VARY BY STATE; the values
// below are the common ranges under the Revised Uniform Unclaimed Property Act
// (RUUPA, 2016) which many states have adopted — they are presented as TYPICAL
// ranges, not state-specific guarantees (No-Fallbacks: confirm with the state).

export interface AssetType {
  slug: string;
  name: string;
  /** Short label used in grids. */
  short: string;
  summary: string;
  /** Concrete examples of this property type. */
  examples: string[];
  /** Typical dormancy in years before it is reported as unclaimed (range). */
  typicalDormancyYears: [number, number];
  /** Documents commonly required to prove ownership of this asset type. */
  proofDocuments: string[];
}

export const ASSET_TYPES: AssetType[] = [
  {
    slug: "bank-accounts",
    name: "Bank accounts & deposits",
    short: "Bank accounts",
    summary:
      "Dormant checking and savings accounts, certificates of deposit (CDs) and cashier's checks that a bank turned over to the state after a period of inactivity.",
    examples: ["Forgotten checking/savings balances", "Matured CDs", "Uncashed cashier's & certified checks", "Money orders"],
    typicalDormancyYears: [3, 5],
    proofDocuments: ["Government photo ID", "Proof of the account (statement, check or account number) if available", "Proof of address linking you to the reported address"],
  },
  {
    slug: "insurance",
    name: "Insurance proceeds",
    short: "Insurance",
    summary:
      "Unpaid life-insurance benefits, matured policies, premium refunds and demutualization proceeds that an insurer could not deliver to the policyholder or beneficiary.",
    examples: ["Life-insurance death benefits", "Matured endowment policies", "Premium refunds", "Demutualization shares/cash"],
    typicalDormancyYears: [3, 3],
    proofDocuments: ["Government photo ID", "Policy number or insurer name if known", "For beneficiaries: death certificate and proof of beneficiary status"],
  },
  {
    slug: "wages",
    name: "Wages & payroll",
    short: "Wages",
    summary:
      "Final paychecks, payroll, commissions and expense reimbursements that an employer was unable to deliver to a former employee.",
    examples: ["Uncashed final paychecks", "Unclaimed commissions", "Expense reimbursements", "Unused payroll-card balances"],
    typicalDormancyYears: [1, 1],
    proofDocuments: ["Government photo ID", "Former employer name", "Proof of the address on file with the employer"],
  },
  {
    slug: "stocks-dividends",
    name: "Stocks, bonds & dividends",
    short: "Stocks & dividends",
    summary:
      "Uncashed dividend checks, shares of stock, mutual-fund accounts and matured bonds held by a transfer agent and later escheated to the state.",
    examples: ["Uncashed dividend checks", "Forgotten brokerage/stock shares", "Mutual-fund accounts", "Matured corporate bonds"],
    typicalDormancyYears: [3, 3],
    proofDocuments: ["Government photo ID", "Account or certificate number if available", "Proof of your connection to the reported owner name and address"],
  },
  {
    slug: "utility-deposits",
    name: "Utility & rental deposits",
    short: "Utility deposits",
    summary:
      "Refundable deposits and final-bill credits from electric, gas, water, phone and cable companies, plus rental security deposits, that were never returned.",
    examples: ["Electric/gas/water deposits", "Phone & cable deposits", "Final-bill credit balances", "Rental security deposits"],
    typicalDormancyYears: [1, 3],
    proofDocuments: ["Government photo ID", "Old account number or service address if known", "Proof of address at the service location"],
  },
  {
    slug: "safe-deposit-boxes",
    name: "Safe deposit box contents",
    short: "Safe deposit boxes",
    summary:
      "Contents of abandoned safe deposit boxes — jewelry, coins, documents and cash — that a bank delivered to the state, often sold at auction with proceeds held for the owner.",
    examples: ["Cash held for the owner", "Auction proceeds from box contents", "Returned documents and valuables"],
    typicalDormancyYears: [3, 5],
    proofDocuments: ["Government photo ID", "Bank name and box number if known", "Proof of your identity matching the box-holder of record"],
  },
  {
    slug: "refunds-gift-cards",
    name: "Refunds, credits & gift cards",
    short: "Refunds & credits",
    summary:
      "Overpayments, court refunds, vendor credit balances, layaway refunds and (in some states) abandoned gift-card and store-credit balances.",
    examples: ["Court & government overpayment refunds", "Vendor/credit balances", "Layaway & rebate refunds", "Gift-card balances (where applicable)"],
    typicalDormancyYears: [3, 5],
    proofDocuments: ["Government photo ID", "Reference or transaction number if available", "Proof of address linking you to the record"],
  },
];

export function getAssetType(slug: string): AssetType | undefined {
  return ASSET_TYPES.find((a) => a.slug === slug);
}
