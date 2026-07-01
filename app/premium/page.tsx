import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { PRODUCTS, getProduct, isProductPurchasable, type Product } from "@/lib/products";
import { getState } from "@/lib/states";
import { getAsset } from "@/lib/assets";
import { buildClaimKit } from "@/lib/kit";
import type { OwnerStatus } from "@/lib/claims";
import { faqJsonLd, type QA } from "@/lib/faq";

// Conversion + SEO page for the optional one-time products. Reads an optional pre-filled
// claim context to personalise the preview. When billing for a product isn't live yet it
// shows an honest "launching shortly" state instead of a buy button — never a dead link.

const OWNER_LABELS: Record<OwnerStatus, string> = {
  self: "yourself",
  business: "a business",
  heir: "a deceased relative",
};

export const metadata: Metadata = {
  title: "Claim Kit & Estate Claim Report — optional help filing your claim",
  description:
    "Optional, one-time help filing an unclaimed-property claim: a pre-written cover letter, personalised document checklist, follow-up schedule and submission walkthrough. Searching and claiming from the state is always free.",
  alternates: { canonical: `${SITE.url}/premium` },
  openGraph: { title: "Frifti Claim Kit & Estate Claim Report", url: `${SITE.url}/premium` },
};

function str(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

const premiumFaq: QA[] = [
  { q: "Do I have to pay to claim my unclaimed property?", a: "No. Searching for and claiming your property from a state is always free, and you can do it yourself with our free wizard. The Claim Kit and Estate Claim Report are optional — they organise and pre-fill the paperwork so a claim is faster and less likely to be rejected." },
  { q: "Is this a subscription?", a: "No. Both products are a single one-time payment. There is nothing recurring to cancel." },
  { q: "What do I actually receive?", a: "A personalised pack for your exact state and property type: a ready-to-send cover letter, a document checklist explaining what each item proves, a dated follow-up schedule, a submission walkthrough, and the most common rejection reasons with fixes. The Estate Claim Report adds multi-state heir-search and affidavit guidance." },
  { q: "How is this different from a paid finder?", a: "Finders take a percentage of money you could claim yourself for free, and we tell people to avoid them. We never take a cut of your property — you pay a small fixed fee only if you want the paperwork done for you, and you still file directly with the state." },
];

export default async function PremiumPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const state = getState(str(sp.state));
  const asset = getAsset(str(sp.asset));
  const ownerRaw = str(sp.owner);
  const ownerStatus: OwnerStatus = (["self", "business", "heir"].includes(ownerRaw) ? ownerRaw : "self") as OwnerStatus;
  const value = Math.max(0, Number(str(sp.value)) || 0);
  const status = str(sp.status); // "soon" | "error" when redirected back from checkout
  const requested = getProduct(str(sp.product));
  const personalised = Boolean(state && asset);

  const productLd = PRODUCTS.map((p) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${SITE.name} ${p.name}`,
    description: p.tagline,
    brand: { "@type": "Brand", name: SITE.name },
    offers: { "@type": "Offer", price: p.priceUsd.toFixed(2), priceCurrency: "USD", availability: "https://schema.org/InStock" },
  }));
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Claim Kit & Estate Report", item: `${SITE.url}/premium` },
    ],
  };

  return (
    <div className="space-y-12">
      <JsonLd data={[...productLd, breadcrumb, faqJsonLd(premiumFaq)]} />

      <nav className="text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-700">Home</Link> <span aria-hidden>/</span> Claim Kit & Estate Report
      </nav>

      <header className="space-y-3">
        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          Optional · one-time · never a fee to claim
        </span>
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Get your unclaimed-property claim done right the first time
        </h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Searching and claiming from the state is always free — and you can do the whole thing yourself with our{" "}
          <Link href="/#search" className="text-emerald-700 underline">free claim wizard</Link>. If you&apos;d rather have the
          paperwork pre-filled and organised, these optional one-time packs do exactly that.
        </p>
      </header>

      {status === "soon" && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Secure checkout for this pack is launching shortly. In the meantime, your free claim checklist is ready —{" "}
          <Link href="/#search" className="underline">start it here</Link>.
        </p>
      )}
      {status === "error" && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          Something went wrong starting checkout. Please try again shortly — and remember you can always claim free yourself.
        </p>
      )}

      {personalised && state && asset && (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Personalised for your claim</p>
          <p className="mt-1 text-sm text-slate-700">
            {state.name} · {asset.name} · claiming for {OWNER_LABELS[ownerStatus]}
          </p>
          {(() => {
            const productId = (requested?.id ?? (ownerStatus === "heir" ? "estate-report" : "claim-kit")) as Product["id"];
            const kit = buildClaimKit({ stateSlug: state.slug, assetSlug: asset.slug, ownerStatus, estimatedValue: value, product: productId });
            return (
              <ul className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                <li>✓ A cover letter pre-addressed to {state.agency}</li>
                <li>✓ {kit.checklist.length}-item document checklist, each explained</li>
                <li>✓ {kit.followUps.length}-step dated follow-up schedule</li>
                <li>✓ {kit.rejectionTips.length} rejection reasons with fixes</li>
                {kit.estateSections && <li>✓ {kit.estateSections.length} estate-specific sections (multi-state, affidavit)</li>}
                <li>✓ Submission walkthrough for {state.name} {asset.name.toLowerCase()}</li>
              </ul>
            );
          })()}
        </section>
      )}

      <section className="grid gap-5 lg:grid-cols-2">
        {PRODUCTS.map((p) => {
          const live = isProductPurchasable(p);
          const buyHref = personalised && state && asset
            ? `/api/checkout?${new URLSearchParams({ product: p.id, state: state.slug, asset: asset.slug, owner: ownerStatus, ...(value > 0 ? { value: String(value) } : {}) }).toString()}`
            : `/api/checkout?product=${p.id}`;
          const highlight = requested?.id === p.id || (!requested && ((ownerStatus === "heir") === (p.id === "estate-report")));
          return (
            <div key={p.id} className={`rounded-2xl border p-6 ${highlight ? "border-emerald-300 bg-white ring-1 ring-emerald-200" : "border-slate-200 bg-white"}`}>
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-bold text-slate-900">{p.name}</h2>
                <span className="text-2xl font-bold text-slate-900">{p.priceLabel}<span className="text-sm font-medium text-slate-500"> one-time</span></span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{p.tagline}</p>
              <p className="mt-2 text-xs font-medium text-slate-500">For: {p.forWho}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
                {p.includes.map((f) => (
                  <li key={f} className="flex gap-2"><span aria-hidden className="mt-0.5 text-emerald-600">✓</span><span>{f}</span></li>
                ))}
              </ul>
              {live ? (
                // Plain anchor: /api/checkout is a route handler that 303-redirects to
                // Stripe, so we want a full browser navigation, not a client RSC transition.
                <a href={buyHref} className="mt-5 inline-block rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
                  Get the {p.name} — {p.priceLabel} →
                </a>
              ) : (
                <div className="mt-5">
                  <span className="inline-block cursor-default rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-400">
                    Launching shortly
                  </span>
                  <p className="mt-2 text-xs text-slate-500">Secure checkout isn&apos;t live yet. Your free claim checklist is ready now.</p>
                </div>
              )}
            </div>
          );
        })}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">You can always claim for free</h2>
        <p className="mt-1 text-sm text-slate-600">
          Every state lets you search and claim your own property at no cost, and our wizard builds the same checklist
          free. These packs are for people who simply want the writing and chasing handled.
        </p>
        <Link href="/#search" className="mt-3 inline-block rounded-lg border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">
          Start a free claim →
        </Link>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-slate-900">Questions</h2>
        {premiumFaq.map((f) => (
          <div key={f.q} className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="font-semibold text-slate-800">{f.q}</h3>
            <p className="mt-2 text-sm text-slate-600">{f.a}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
