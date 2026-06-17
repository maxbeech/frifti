// Categories of unclaimed property states hold. These map to the NAUPA property-type
// codes holders report against. `weight` feeds the deterministic claim-complexity engine
// in lib/claims.ts; `extraDocs` are documents commonly required on top of the standard
// owner-identity set for that property type.

export type AssetType = {
  slug: string;
  name: string;
  short: string;
  blurb: string;
  examples: string[];
  weight: number;
  extraDocs: string[];
  tangible?: boolean;
};

export const ASSET_TYPES: AssetType[] = [
  {
    slug: "bank-accounts",
    name: "Bank Accounts & Cash",
    short: "Dormant checking, savings, CDs and cashier's checks",
    blurb:
      "Forgotten checking and savings balances, certificates of deposit, money orders, cashier's checks and travelers checks that a bank turned over to the state after the dormancy period.",
    examples: ["Closed checking/savings balances", "Matured CDs", "Uncashed cashier's checks", "Money orders"],
    weight: 0,
    extraDocs: ["Account or check number from the original bank, if known"],
  },
  {
    slug: "insurance",
    name: "Insurance Proceeds",
    short: "Unclaimed life, annuity and policy refunds",
    blurb:
      "Life-insurance death benefits, matured annuities, demutualization payouts and premium refunds the insurer could not deliver and escheated to the state.",
    examples: ["Life-insurance death benefits", "Annuity proceeds", "Premium refunds", "Demutualization shares/cash"],
    weight: 1,
    extraDocs: ["Policy number or the name of the insurer, if known"],
  },
  {
    slug: "wages",
    name: "Wages & Payroll",
    short: "Uncashed paychecks, commissions and final pay",
    blurb:
      "Final paychecks, commissions, bonuses and expense reimbursements from a former employer that were never cashed and were reported to the state as unclaimed wages.",
    examples: ["Uncashed final paycheck", "Unpaid commissions", "Expense reimbursements", "Payroll card balances"],
    weight: 0,
    extraDocs: ["Name of the employer and approximate dates of employment, if known"],
  },
  {
    slug: "securities",
    name: "Stocks, Dividends & Bonds",
    short: "Shares, dividends and mutual-fund holdings",
    blurb:
      "Uncashed dividend checks, dematerialized shares, mutual-fund accounts and matured bonds transferred to the state by a transfer agent or broker.",
    examples: ["Uncashed dividend checks", "Dematerialized shares", "Mutual-fund accounts", "Matured bonds"],
    weight: 2,
    extraDocs: [
      "Brokerage or transfer-agent statement showing the shares, if available",
      "Original stock certificate numbers, if you have them",
    ],
  },
  {
    slug: "utility-deposits",
    name: "Utility & Other Deposits",
    short: "Refundable deposits and overpayments",
    blurb:
      "Refundable deposits and credit balances held by electric, gas, water, telecom and cable companies, plus rental and rebate deposits that were never returned.",
    examples: ["Electric/gas/water deposits", "Telecom & cable deposits", "Rental security deposits", "Rebates"],
    weight: 0,
    extraDocs: ["Account number or service address tied to the deposit, if known"],
  },
  {
    slug: "safe-deposit-boxes",
    name: "Safe Deposit Box Contents",
    short: "Tangible contents of abandoned boxes",
    blurb:
      "Contents of abandoned safe-deposit boxes (jewelry, coins, documents) inventoried and held by the state, or the cash proceeds if the contents were sold at auction.",
    examples: ["Jewelry & collectibles", "Coins & bullion", "Important documents", "Auction proceeds"],
    weight: 2,
    tangible: true,
    extraDocs: [
      "The bank branch and box number, if known",
      "Any inventory list or receipt for the box contents",
    ],
  },
];

export function getAsset(slug: string): AssetType | undefined {
  return ASSET_TYPES.find((a) => a.slug === slug);
}
