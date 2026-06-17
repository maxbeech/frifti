import type { Metadata } from "next";
import Link from "next/link";
import { STATES } from "@/lib/data/states";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Unclaimed Property by State — All 50 States + DC",
  description:
    "Official unclaimed-property search and claim guides for every US state and Washington DC. Each page links to the state's free government portal and shows how to claim.",
  alternates: { canonical: "/states" },
};

export default function StatesIndex() {
  return (
    <div className="space-y-8">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "States", path: "/states" }])} />
      <section className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Unclaimed property by state</h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Pick your state to search its official, free unclaimed-money database and get a state-specific claim
          guide. Search every state where you have lived or worked.
        </p>
      </section>
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {STATES.map((s) => (
          <Link
            key={s.slug}
            href={`/unclaimed-property/${s.slug}`}
            className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-400 hover:shadow-sm"
          >
            <p className="font-medium text-slate-900">{s.name}</p>
            <p className="mt-1 line-clamp-1 text-xs text-slate-500">{s.agency}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
