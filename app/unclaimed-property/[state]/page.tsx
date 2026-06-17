import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { STATES, getState } from "@/lib/data/states";
import { ASSET_TYPES } from "@/lib/data/assetTypes";
import { ClaimWizard } from "@/components/ClaimWizard";
import { JsonLd, faqLd, breadcrumbLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import type { QA } from "@/lib/faq";

export function generateStaticParams() {
  return STATES.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state } = await params;
  const s = getState(state);
  if (!s) return {};
  return {
    title: `${s.name} Unclaimed Property Search & Claim Guide`,
    description: `Search ${s.name} unclaimed money for free through the ${s.agency}, then follow a step-by-step claim guide — required documents, notarization rules and a typical timeline.`,
    alternates: { canonical: `/unclaimed-property/${s.slug}` },
  };
}

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const s = getState(state);
  if (!s) notFound();

  const faq: QA[] = [
    {
      q: `How do I search for unclaimed money in ${s.name}?`,
      a: `Search the ${s.agency} unclaimed-property database for free at ${s.official}, and also search MissingMoney.com (the NAUPA-sponsored multi-state search). Try your current and former names, and any address where you have lived in ${s.name}.`,
    },
    {
      q: `Is there a fee to claim unclaimed property in ${s.name}?`,
      a: `No. Searching and claiming through the ${s.agency} is free. ClaimWise HQ never charges a finder's fee — we just route you to the official ${s.name} portal and show you how to claim.`,
    },
    {
      q: `Who holds unclaimed property in ${s.name}?`,
      a: `Unclaimed property in ${s.name} is held and administered by the ${s.agency}. The money is held for you indefinitely until you claim it.`,
    },
    {
      q: `How long does a ${s.name} unclaimed property claim take?`,
      a: `A straightforward owner claim for a single property commonly resolves in about 2 to 8 weeks. Heir and business claims, and higher-value claims that need a notarized affidavit, take longer. The ${s.agency} sets the exact timeline.`,
    },
  ];

  return (
    <div className="space-y-10">
      <JsonLd
        data={[
          faqLd(faq),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "States", path: "/states" },
            { name: s.name, path: `/unclaimed-property/${s.slug}` },
          ]),
        ]}
      />

      <nav className="text-sm text-slate-500">
        <Link href="/states" className="hover:text-slate-900">States</Link> <span className="px-1">/</span>
        <span className="text-slate-700">{s.name}</span>
      </nav>

      <section className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{s.name} unclaimed property search</h1>
        <p className="max-w-2xl text-lg text-slate-600">
          {s.name} unclaimed money is administered by the{" "}
          <span className="font-medium text-slate-800">{s.agency}</span>. Search the official database for free,
          then use the claim guide below to recover it. {SITE.name} never charges a finder&apos;s fee.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <a
            href={s.official}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
          >
            Search the official {s.abbr} portal →
          </a>
          <a
            href={SITE.missingMoney}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:border-slate-400"
          >
            Search MissingMoney.com
          </a>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Types of unclaimed property in {s.name}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ASSET_TYPES.map((a) => (
            <Link
              key={a.slug}
              href={`/unclaimed-property/${s.slug}/${a.slug}`}
              className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-400 hover:shadow-sm"
            >
              <p className="font-medium text-slate-900">{a.name}</p>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">{a.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <ClaimWizard />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">{s.name} unclaimed property FAQ</h2>
        <div className="space-y-3">
          {faq.map((qa) => (
            <details key={qa.q} className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer font-medium text-slate-900">{qa.q}</summary>
              <p className="mt-2 text-sm text-slate-600">{qa.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-900">Other states</h2>
        <div className="flex flex-wrap gap-1.5 text-sm">
          {STATES.filter((x) => x.slug !== s.slug).map((x) => (
            <Link
              key={x.slug}
              href={`/unclaimed-property/${x.slug}`}
              className="rounded border border-slate-200 bg-white px-2 py-0.5 text-slate-600 hover:border-emerald-400"
            >
              {x.abbr}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
