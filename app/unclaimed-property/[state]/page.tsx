import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClaimFinder } from "@/components/ClaimFinder";
import { JsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { AssetIcon } from "@/components/icons/AssetIcon";
import { SITE } from "@/lib/site";
import { STATES, getState } from "@/lib/states";
import { ASSET_TYPES } from "@/lib/assets";
import { faqJsonLd, type QA } from "@/lib/faq";

export const dynamicParams = false;
export const revalidate = 604800; // 1 week ISR

export function generateStaticParams() {
  return STATES.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state } = await params;
  const s = getState(state);
  if (!s) return {};
  const title = `${s.name} Unclaimed Property Search: Claim Your Money Free`;
  const description = `Search ${s.name} unclaimed property through the official ${s.agency} portal and follow a free, step-by-step claim guide with the exact documents and timelines.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE.url}/unclaimed-property/${s.slug}` },
    openGraph: { title, description, url: `${SITE.url}/unclaimed-property/${s.slug}` },
  };
}

function stateFaq(name: string, agency: string): QA[] {
  return [
    { q: `How do I search for unclaimed property in ${name}?`, a: `Use the official ${agency} portal to search your name, former names, and previous addresses. Frifti links you straight to it and builds your free claim checklist.` },
    { q: `Is it free to claim unclaimed property in ${name}?`, a: `Yes. ${name} never charges the rightful owner to claim their property. Avoid paid finder firms, you can claim directly from the state for free.` },
    { q: `How long does a ${name} unclaimed property claim take?`, a: `Most straightforward cash claims are paid in roughly 6 to 10 weeks after a complete submission; complex, securities, or estate claims can take 12 to 26 weeks.` },
  ];
}

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const s = getState(state);
  if (!s) notFound();

  const faq = stateFaq(s.name, s.agency);
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Unclaimed Property by State", item: `${SITE.url}/#search` },
      { "@type": "ListItem", position: 3, name: s.name, item: `${SITE.url}/unclaimed-property/${s.slug}` },
    ],
  };
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to claim unclaimed property in ${s.name}`,
    step: [
      { "@type": "HowToStep", name: "Search", text: `Search the official ${s.agency} portal for your name and former addresses.` },
      { "@type": "HowToStep", name: "Verify", text: "Upload a photo ID, proof of SSN, and proof of address." },
      { "@type": "HowToStep", name: "Submit", text: "File the claim online or by mail and track it to payment." },
    ],
  };

  return (
    <div className="space-y-12">
      <JsonLd data={[breadcrumb, howTo, faqJsonLd(faq)]} />

      <nav className="text-xs text-muted">
        <Link href="/" className="hover:text-ink">Home</Link> <span aria-hidden>/</span>{" "}
        <Link href="/#states" className="hover:text-ink">All states</Link> <span aria-hidden>/</span> {s.name}
      </nav>

      <header className="max-w-2xl space-y-4">
        <h1 className="font-display text-3xl tracking-tight text-ink sm:text-5xl">
          {s.name} Unclaimed Property Search
        </h1>
        <p className="text-lg text-body">
          Search the official {s.agency} database for forgotten bank accounts, paychecks, insurance and deposits.
          Then use the free wizard below to gather exactly what {s.name} needs to pay your claim.
        </p>
        <Button href={s.portal} icon="external">Open the official {s.name} portal</Button>
      </header>

      <section>
        <h2 className="mb-4 font-display text-2xl text-ink">Build your free {s.name} claim checklist</h2>
        <ClaimFinder initialState={s.slug} />
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl text-ink">Search {s.name} by property type</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ASSET_TYPES.map((a) => (
            <Link
              key={a.slug}
              href={`/unclaimed-property/${s.slug}/${a.slug}`}
              className="group flex items-start gap-3 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-ink"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-lime/40 text-ink">
                <AssetIcon slug={a.slug} className="h-4 w-4" />
              </span>
              <span>
                <span className="block font-semibold text-ink">{a.name}</span>
                <span className="mt-0.5 block text-sm text-body">{a.short}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl text-ink">{s.name} unclaimed property FAQ</h2>
        <Accordion items={faq} />
      </section>

      <p className="text-xs text-muted">
        Frifti is an independent guide and is not affiliated with {s.agency} or any government body. The
        official portal linked above is always the authoritative source for {s.name} claims.
      </p>
    </div>
  );
}
