import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClaimFinder } from "@/components/ClaimFinder";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { STATES, getState } from "@/lib/states";
import { ASSET_TYPES, getAsset } from "@/lib/assets";
import { buildClaimPlan } from "@/lib/claims";
import { faqJsonLd, type QA } from "@/lib/faq";

export const dynamicParams = false;
export const revalidate = 604800;

export function generateStaticParams() {
  const params: { state: string; asset: string }[] = [];
  for (const s of STATES) for (const a of ASSET_TYPES) params.push({ state: s.slug, asset: a.slug });
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ state: string; asset: string }> }): Promise<Metadata> {
  const { state, asset } = await params;
  const s = getState(state);
  const a = getAsset(asset);
  if (!s || !a) return {};
  const title = `${s.name} ${a.name} — Unclaimed Money Search & Claim`;
  const description = `Find unclaimed ${a.name.toLowerCase()} in ${s.name} via the official ${s.agency} portal, with a free document checklist and claim timeline.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE.url}/unclaimed-property/${s.slug}/${a.slug}` },
    openGraph: { title, description, url: `${SITE.url}/unclaimed-property/${s.slug}/${a.slug}` },
  };
}

export default async function AssetPage({ params }: { params: Promise<{ state: string; asset: string }> }) {
  const { state, asset } = await params;
  const s = getState(state);
  const a = getAsset(asset);
  if (!s || !a) notFound();

  const plan = buildClaimPlan({ stateSlug: s.slug, assetSlug: a.slug });
  const faq: QA[] = [
    { q: `How do I find unclaimed ${a.name.toLowerCase()} in ${s.name}?`, a: `Search the official ${s.agency} portal for your name and former addresses, then open any ${a.name.toLowerCase()} record to start a free claim.` },
    { q: `What documents do I need to claim ${a.name.toLowerCase()} in ${s.name}?`, a: `You'll typically need ${plan.documents.slice(0, 3).join(", ").toLowerCase()}${a.extraDocs.length ? `, plus ${a.extraDocs[0].toLowerCase()}` : ""}.` },
  ];

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: s.name, item: `${SITE.url}/unclaimed-property/${s.slug}` },
      { "@type": "ListItem", position: 3, name: a.name, item: `${SITE.url}/unclaimed-property/${s.slug}/${a.slug}` },
    ],
  };

  return (
    <div className="space-y-12">
      <JsonLd data={[breadcrumb, faqJsonLd(faq)]} />

      <nav className="text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-700">Home</Link> <span aria-hidden>/</span>{" "}
        <Link href={`/unclaimed-property/${s.slug}`} className="hover:text-slate-700">{s.name}</Link>{" "}
        <span aria-hidden>/</span> {a.name}
      </nav>

      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {s.name}: Unclaimed {a.name}
        </h1>
        <p className="max-w-2xl text-lg text-slate-600">{a.blurb}</p>
        <a
          href={s.portal}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Search {s.name} {a.name.toLowerCase()} →
        </a>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-800">Typical claim profile</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li><span className="font-medium text-slate-700">Complexity:</span> <span className="capitalize">{plan.complexity}</span></li>
            <li><span className="font-medium text-slate-700">Timeline:</span> {plan.timelineWeeks.min}–{plan.timelineWeeks.max} weeks</li>
            <li><span className="font-medium text-slate-700">Administered by:</span> {s.agency}</li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-slate-800">Examples in this category</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            {a.examples.map((e) => <li key={e}>{e}</li>)}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-slate-900">Build your {s.name} {a.name.toLowerCase()} checklist</h2>
        <ClaimFinder initialState={s.slug} />
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

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-900">Other property types in {s.name}</h2>
        <div className="flex flex-wrap gap-2">
          {ASSET_TYPES.filter((x) => x.slug !== a.slug).map((x) => (
            <Link key={x.slug} href={`/unclaimed-property/${s.slug}/${x.slug}`} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 hover:border-emerald-300">
              {x.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
