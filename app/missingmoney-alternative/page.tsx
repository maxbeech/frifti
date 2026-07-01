import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { STATES } from "@/lib/states";
import { faqJsonLd, type QA } from "@/lib/faq";

export const metadata: Metadata = {
  title: "MissingMoney.com Alternative — Frifti",
  description: "A free MissingMoney.com alternative: all 52 official state unclaimed-property portals plus a guided claim wizard with document checklists and timelines.",
  alternates: { canonical: `${SITE.url}/missingmoney-alternative` },
};

const faq: QA[] = [
  { q: "Is Frifti better than MissingMoney.com?", a: "MissingMoney.com is a useful multi-state search, but it doesn't cover every state and stops at the search. Frifti links to all 52 official state portals (including states MissingMoney omits) and adds a guided claim wizard that tells you exactly which documents and steps each claim needs." },
  { q: "Does it cost anything?", a: "No. Like searching a state portal directly, Frifti is free. Claiming your own property from a state is always free — never pay a finder." },
];

const rows = [
  { f: "Coverage", mm: "Many states (not all)", cw: "All 50 states + DC + Puerto Rico" },
  { f: "Official state portals", mm: "Aggregated search", cw: "Direct link to each authoritative portal" },
  { f: "Document checklist", mm: "—", cw: "Generated per state, asset & owner type" },
  { f: "Claim timeline estimate", mm: "—", cw: "Per-claim complexity & weeks-to-payout" },
  { f: "Estate / heir guidance", mm: "—", cw: "Death-certificate & heirship steps included" },
  { f: "Price", mm: "Free", cw: "Free" },
];

export default function MissingMoneyAlternative() {
  return (
    <div className="space-y-10">
      <JsonLd data={faqJsonLd(faq)} />
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">A free MissingMoney.com alternative</h1>
        <p className="max-w-2xl text-lg text-slate-600">
          MissingMoney.com searches several states at once, but it doesn&apos;t cover every state and it leaves you to
          figure out the claim yourself. Frifti covers all {STATES.length} official programs and walks you
          through the actual claim — for free.
        </p>
        <Link href="/#search" className="inline-block rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
          Search all 52 states free →
        </Link>
      </header>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Feature</th>
              <th className="px-4 py-3 font-semibold">MissingMoney.com</th>
              <th className="px-4 py-3 font-semibold text-emerald-700">Frifti</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.f} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-700">{r.f}</td>
                <td className="px-4 py-3 text-slate-600">{r.mm}</td>
                <td className="px-4 py-3 text-slate-800">{r.cw}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-slate-900">FAQ</h2>
        {faq.map((f) => (
          <div key={f.q} className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="font-semibold text-slate-800">{f.q}</h3>
            <p className="mt-2 text-sm text-slate-600">{f.a}</p>
          </div>
        ))}
      </section>

      <p className="text-xs text-slate-400">
        MissingMoney.com is operated by NAUPA. Frifti is independent and not affiliated with NAUPA or
        MissingMoney.com. Comparison reflects publicly available features as of June 2026.
      </p>
    </div>
  );
}
