import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { SITE } from "@/lib/site";
import { STATES } from "@/lib/states";
import { faqJsonLd, type QA } from "@/lib/faq";

export const metadata: Metadata = {
  title: "MissingMoney.com Alternative",
  description: "A free MissingMoney.com alternative: all 52 official state unclaimed-property portals plus a guided claim wizard with document checklists and timelines.",
  alternates: { canonical: `${SITE.url}/missingmoney-alternative` },
};

const faq: QA[] = [
  { q: "Is Frifti better than MissingMoney.com?", a: "MissingMoney.com is a useful multi-state search, but it doesn't cover every state and stops at the search. Frifti links to all 52 official state portals, including states MissingMoney omits, and adds a guided claim wizard that tells you exactly which documents and steps each claim needs." },
  { q: "Does it cost anything?", a: "No. Like searching a state portal directly, Frifti is free. Claiming your own property from a state is always free, never pay a finder." },
];

const rows = [
  { f: "Coverage", mm: "Many states, not all", cw: "All 50 states + DC + Puerto Rico" },
  { f: "Official state portals", mm: "Aggregated search", cw: "Direct link to each authoritative portal" },
  { f: "Document checklist", mm: false, cw: "Generated per state, asset & owner type" },
  { f: "Claim timeline estimate", mm: false, cw: "Per-claim complexity & weeks-to-payout" },
  { f: "Estate / heir guidance", mm: false, cw: "Death-certificate & heirship steps included" },
  { f: "Price", mm: "Free", cw: "Free" },
];

export default function MissingMoneyAlternative() {
  return (
    <div className="space-y-10">
      <JsonLd data={faqJsonLd(faq)} />
      <header className="max-w-2xl space-y-4">
        <h1 className="font-display text-3xl tracking-tight text-ink sm:text-5xl">A free MissingMoney.com alternative</h1>
        <p className="text-lg text-body">
          MissingMoney.com searches several states at once, but it doesn&apos;t cover every state and leaves you to
          figure out the claim yourself. Frifti covers all {STATES.length} official programs and walks you through
          the actual claim, for free.
        </p>
        <Button href="/#search">Search all {STATES.length} states free</Button>
      </header>

      <section className="overflow-hidden rounded-xl border border-line bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg text-body">
            <tr>
              <th className="px-4 py-3 font-semibold">Feature</th>
              <th className="px-4 py-3 font-semibold">MissingMoney.com</th>
              <th className="px-4 py-3 font-semibold text-ink">Frifti</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.f} className="border-t border-line">
                <td className="px-4 py-3 font-medium text-ink">{r.f}</td>
                <td className="px-4 py-3 text-body">{r.mm === false ? <span className="text-muted">Not included</span> : r.mm}</td>
                <td className="px-4 py-3 text-ink">{r.cw}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl text-ink">Questions</h2>
        <Accordion items={faq} />
      </section>

      <p className="text-xs text-muted">
        MissingMoney.com is operated by NAUPA. Frifti is independent and not affiliated with NAUPA or
        MissingMoney.com. Comparison reflects publicly available features as of July 2026.
      </p>
    </div>
  );
}
