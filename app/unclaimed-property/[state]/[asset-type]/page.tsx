import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { STATES, getState } from "@/lib/data/states";
import { ASSET_TYPES, getAssetType } from "@/lib/data/assetTypes";
import { ClaimWizard } from "@/components/ClaimWizard";
import { JsonLd, faqLd, breadcrumbLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import type { QA } from "@/lib/faq";

export function generateStaticParams() {
  return STATES.flatMap((s) => ASSET_TYPES.map((a) => ({ state: s.slug, "asset-type": a.slug })));
}

type Params = Promise<{ state: string; "asset-type": string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await params;
  const s = getState(p.state);
  const a = getAssetType(p["asset-type"]);
  if (!s || !a) return {};
  return {
    title: `${s.name} ${a.short} Unclaimed Money — Search & Claim`,
    description: `How to find and claim unclaimed ${a.short.toLowerCase()} in ${s.name} through the ${s.agency}. Documents, dormancy period and a typical claim timeline.`,
    alternates: { canonical: `/unclaimed-property/${s.slug}/${a.slug}` },
  };
}

export default async function StateAssetPage({ params }: { params: Params }) {
  const p = await params;
  const s = getState(p.state);
  const a = getAssetType(p["asset-type"]);
  if (!s || !a) notFound();

  const [dMin, dMax] = a.typicalDormancyYears;
  const dormancy = dMin === dMax ? `${dMin} year${dMin === 1 ? "" : "s"}` : `${dMin}–${dMax} years`;

  const faq: QA[] = [
    {
      q: `How do I find unclaimed ${a.short.toLowerCase()} in ${s.name}?`,
      a: `Search the ${s.agency} database for free at ${s.official} and on MissingMoney.com. ${a.name} is reported as unclaimed after a typical dormancy period of about ${dormancy} of inactivity.`,
    },
    {
      q: `What documents do I need to claim ${a.short.toLowerCase()} in ${s.name}?`,
      a: `You will typically need a government photo ID, the completed ${s.name} claim form, proof of your SSN/Taxpayer ID, and proof tied to the property — for ${a.short.toLowerCase()}: ${a.proofDocuments.join("; ")}.`,
    },
    {
      q: `How long until ${a.short.toLowerCase()} becomes unclaimed property?`,
      a: `${a.name} is generally reported to the state after about ${dormancy} of dormancy, though the exact period is set by ${s.name} law. Confirm with the ${s.agency}.`,
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
            { name: a.short, path: `/unclaimed-property/${s.slug}/${a.slug}` },
          ]),
        ]}
      />

      <nav className="text-sm text-slate-500">
        <Link href="/states" className="hover:text-slate-900">States</Link> <span className="px-1">/</span>
        <Link href={`/unclaimed-property/${s.slug}`} className="hover:text-slate-900">{s.name}</Link>{" "}
        <span className="px-1">/</span>
        <span className="text-slate-700">{a.short}</span>
      </nav>

      <section className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {s.name} {a.short.toLowerCase()}: unclaimed money search &amp; claim
        </h1>
        <p className="max-w-2xl text-lg text-slate-600">{a.summary}</p>
        <p className="max-w-2xl text-sm text-slate-600">
          In {s.name}, this property is held by the <span className="font-medium text-slate-800">{s.agency}</span>{" "}
          after a typical dormancy period of <span className="font-medium text-slate-800">{dormancy}</span>.
          Searching and claiming is free — {SITE.name} never charges a finder&apos;s fee.
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
          <a href="#claim-guide" className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:border-slate-400">
            Build my claim guide
          </a>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Examples</p>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
            {a.examples.map((ex) => (
              <li key={ex} className="flex gap-2">
                <span className="mt-0.5 text-emerald-600">•</span>
                <span>{ex}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Proof of ownership</p>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
            {a.proofDocuments.map((d) => (
              <li key={d} className="flex gap-2">
                <span className="mt-0.5 text-emerald-600">✓</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ClaimWizard defaultAsset={a.slug} />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">FAQ</h2>
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
        <h2 className="text-lg font-semibold text-slate-900">Other property types in {s.name}</h2>
        <div className="flex flex-wrap gap-1.5 text-sm">
          {ASSET_TYPES.filter((x) => x.slug !== a.slug).map((x) => (
            <Link
              key={x.slug}
              href={`/unclaimed-property/${s.slug}/${x.slug}`}
              className="rounded border border-slate-200 bg-white px-2.5 py-1 text-slate-600 hover:border-emerald-400"
            >
              {x.short}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
