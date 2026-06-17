import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "A Friendly MissingMoney.com Alternative — Search + Claim Guidance",
  description:
    "MissingMoney.com is the official free multi-state search. ClaimWise HQ adds the missing piece: a guided claim journey — exact documents, notarization rules and a timeline — on top of the same official, free portals.",
  alternates: { canonical: "/missingmoney-alternative" },
};

export default function Alternative() {
  return (
    <div className="space-y-8">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "vs MissingMoney.com", path: "/missingmoney-alternative" }])} />

      <section className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">ClaimWise HQ vs MissingMoney.com</h1>
        <p className="max-w-2xl text-lg text-slate-600">
          We are not a competitor to MissingMoney.com — we send you there. MissingMoney.com, sponsored by NAUPA,
          is the official free multi-state search and the right place to look. What it does not do is walk you
          through the claim once you find money. That is the gap {SITE.name} fills.
        </p>
      </section>

      <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-2.5 font-semibold">Feature</th>
              <th className="px-4 py-2.5 font-semibold">MissingMoney.com</th>
              <th className="px-4 py-2.5 font-semibold">ClaimWise HQ</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {[
              ["Free multi-state name search", "Yes (official)", "Routes you to it"],
              ["Links to every official state portal", "Most states", "All 50 states + DC"],
              ["Guided claim journey (documents, steps)", "No", "Yes — per situation"],
              ["Owner vs heir vs business guidance", "No", "Yes"],
              ["Notarization & timeline estimate", "No", "Yes"],
              ["Charges a finder's fee", "No", "No"],
            ].map((row) => (
              <tr key={row[0]} className="border-b border-slate-100">
                <td className="px-4 py-2.5 font-medium text-slate-800">{row[0]}</td>
                <td className="px-4 py-2.5">{row[1]}</td>
                <td className="px-4 py-2.5 text-emerald-700">{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <p className="text-sm text-slate-600">
        Start free: <Link href="/#finder" className="text-emerald-700 underline">find your money</Link> or{" "}
        <Link href="/how-to-claim" className="text-emerald-700 underline">learn how to claim</Link>.
      </p>
    </div>
  );
}
