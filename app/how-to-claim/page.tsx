import type { Metadata } from "next";
import Link from "next/link";
import { ClaimWizard } from "@/components/ClaimWizard";
import { JsonLd, faqLd, howToLd, breadcrumbLd } from "@/components/JsonLd";
import { CLAIM_FAQ } from "@/lib/faq";

export const metadata: Metadata = {
  title: "How to Claim Unclaimed Property — Step-by-Step Guide",
  description:
    "A free, step-by-step guide to claiming unclaimed money: where to search, the documents you need, when a notary is required, and how long it takes for owners, heirs and businesses.",
  alternates: { canonical: "/how-to-claim" },
};

const STEPS = [
  "Search every official state database where you have lived or worked, plus MissingMoney.com, using current and former names.",
  "Confirm the property is yours by matching the reported name and last-known address.",
  "Start the claim on the official state portal and complete the state claim form.",
  "Gather your documents: photo ID, proof of SSN/Taxpayer ID, and proof tied to the property.",
  "If the claim is high-value or you are an heir or business, have the affidavit notarized.",
  "Submit by the state's accepted method — secure online upload or mail.",
  "Track the claim and respond promptly to any document requests, then receive payment.",
];

export default function HowToClaim() {
  return (
    <div className="space-y-10">
      <JsonLd
        data={[
          howToLd("How to claim unclaimed property", STEPS),
          faqLd(CLAIM_FAQ),
          breadcrumbLd([{ name: "Home", path: "/" }, { name: "How to claim", path: "/how-to-claim" }]),
        ]}
      />

      <section className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">How to claim unclaimed property</h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Claiming money the state is holding for you is free and you can do it yourself. Here is the whole
          process, plus a tool that builds the exact document list and timeline for your situation.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">The 7 steps</h2>
        <ol className="space-y-3">
          {STEPS.map((s, i) => (
            <li key={s} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                {i + 1}
              </span>
              <span className="text-sm text-slate-700">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <ClaimWizard />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Claim FAQ</h2>
        <div className="space-y-3">
          {CLAIM_FAQ.map((qa) => (
            <details key={qa.q} className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer font-medium text-slate-900">{qa.q}</summary>
              <p className="mt-2 text-sm text-slate-600">{qa.a}</p>
            </details>
          ))}
        </div>
      </section>

      <p className="text-sm text-slate-600">
        Ready to search? <Link href="/states" className="text-emerald-700 underline">Pick your state →</Link>
      </p>
    </div>
  );
}
