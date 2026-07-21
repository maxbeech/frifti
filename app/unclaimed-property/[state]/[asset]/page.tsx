import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClaimFinder } from "@/components/ClaimFinder";
import { JsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
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
  const title = `${s.name} ${a.name}: Unclaimed Money Search & Claim`;
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

      <nav className="text-xs text-muted">
        <Link href="/" className="hover:text-ink">Home</Link> <span aria-hidden>/</span>{" "}
        <Link href={`/unclaimed-property/${s.slug}`} className="hover:text-ink">{s.name}</Link>{" "}
        <span aria-hidden>/</span> {a.name}
      </nav>

      <header className="max-w-2xl space-y-4">
        <h1 className="font-display text-3xl tracking-tight text-ink sm:text-5xl">
          {s.name}: Unclaimed {a.name}
        </h1>
        <p className="text-lg text-body">{a.blurb}</p>
        <Button href={s.portal} icon="external">Search {s.name} {a.name.toLowerCase()}</Button>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface p-5">
          <h2 className="text-sm font-semibold text-ink">Typical claim profile</h2>
          <ul className="mt-2 space-y-1 text-sm text-body">
            <li><span className="font-medium text-ink">Complexity:</span> <span className="capitalize">{plan.complexity}</span></li>
            <li><span className="font-medium text-ink">Timeline:</span> {plan.timelineWeeks.min}–{plan.timelineWeeks.max} weeks</li>
            <li><span className="font-medium text-ink">Administered by:</span> {s.agency}</li>
          </ul>
        </div>
        <div className="rounded-xl border border-line bg-surface p-5">
          <h2 className="text-sm font-semibold text-ink">Examples in this category</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-body">
            {a.examples.map((e) => <li key={e}>{e}</li>)}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-display text-2xl text-ink">Build your {s.name} {a.name.toLowerCase()} checklist</h2>
        <ClaimFinder initialState={s.slug} initialAsset={a.slug} />
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl text-ink">FAQ</h2>
        <Accordion items={faq} />
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-ink">Other property types in {s.name}</h2>
        <div className="flex flex-wrap gap-2">
          {ASSET_TYPES.filter((x) => x.slug !== a.slug).map((x) => (
            <Link key={x.slug} href={`/unclaimed-property/${s.slug}/${x.slug}`} className="rounded-full border border-line bg-surface px-3 py-1 text-sm text-body hover:border-ink hover:text-ink">
              {x.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
