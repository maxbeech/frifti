export type QA = { q: string; a: string };

export const HOME_FAQ: QA[] = [
  {
    q: "Is it really free to claim unclaimed property?",
    a: "Yes. Searching for and claiming your own unclaimed property directly from a state treasury is always free. The state is holding the money for you and never charges the owner to return it. Paid 'finder' firms only point you to property you can already claim for free.",
  },
  {
    q: "How do I find unclaimed money in my name?",
    a: "Choose your state on Frifti to open the official state treasury portal, then search your name, former names, and previous addresses. We also generate a free checklist of the exact documents and steps to file the claim.",
  },
  {
    q: "How long does it take to get the money?",
    a: "Most straightforward cash claims are paid in about 6 to 10 weeks after a complete claim. Securities, estate, and high-value claims commonly take 12 to 26 weeks because they require extra verification.",
  },
  {
    q: "What documents do I need?",
    a: "A government photo ID, proof of your Social Security number, and proof of your current address cover most claims. Estate claims add a death certificate and proof of heirship; securities claims add brokerage statements; higher-value claims often need a notarized form.",
  },
  {
    q: "Which states does Frifti cover?",
    a: "All 50 states plus Washington, D.C. and Puerto Rico — 52 official unclaimed-property programs. Each links directly to that government's authoritative search portal.",
  },
  {
    q: "Why is my money being held by the state?",
    a: "When an account, paycheck, refund, or payout is untouched for a dormancy period (often 3 to 5 years), the holder must turn it over to the state through escheatment. The state holds it indefinitely until you claim it.",
  },
];

export function faqJsonLd(faq: QA[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
