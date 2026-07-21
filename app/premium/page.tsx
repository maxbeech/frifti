import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { CheckIcon } from "@/components/icons";
import { SITE } from "@/lib/site";
import { PRODUCTS, getProduct, isProductPurchasable, type Product } from "@/lib/products";
import { getState } from "@/lib/states";
import { getAsset } from "@/lib/assets";
import { buildClaimKit } from "@/lib/kit";
import type { OwnerStatus } from "@/lib/claims";
import { faqJsonLd, type QA } from "@/lib/faq";

// Conversion + SEO page for the optional one-time products. Reads an optional pre-filled
// claim context to personalise the preview. When billing for a product isn't live yet it
// shows an honest "launching shortly" state instead of a buy button, never a dead link.

const OWNER_LABELS: Record<OwnerStatus, string> = {
  self: "yourself",
  business: "a business",
  heir: "a deceased relative",
};

export const metadata: Metadata = {
  title: "Claim Kit & Estate Claim Report: optional help filing your claim",
  description:
    "Optional, one-time help filing an unclaimed-property claim: a pre-written cover letter, personalised document checklist, follow-up schedule and submission walkthrough. Searching and claiming from the state is always free.",
  alternates: { canonical: `${SITE.url}/premium` },
  openGraph: { title: "Frifti Claim Kit & Estate Claim Report", url: `${SITE.url}/premium` },
};

function str(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

const premiumFaq: QA[] = [
  { q: "Do I have to pay to claim my unclaimed property?", a: "No. Searching for and claiming your property from a state is always free, and you can do it yourself with our free wizard. The Claim Kit and Estate Claim Report are optional: they organise and pre-fill the paperwork so a claim is faster and less likely to be rejected." },
  { q: "Is this a subscription?", a: "No. Both products are a single one-time payment. There is nothing recurring to cancel." },
  { q: "What do I actually receive?", a: "A personalised pack for your exact state and property type: a ready-to-send cover letter, a document checklist explaining what each item proves, a dated follow-up schedule, a submission walkthrough, and the most common rejection reasons with fixes. The Estate Claim Report adds multi-state heir-search and affidavit guidance." },
  { q: "How is this different from a paid finder?", a: "Finders take a percentage of money you could claim yourself for free, and we tell people to avoid them. We never take a cut of your property. You pay a small fixed fee only if you want the paperwork done for you, and you still file directly with the state." },
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

      <nav className="text-xs text-muted">
        <Link href="/" className="hover:text-ink">Home</Link> <span aria-hidden>/</span> Claim Kit & Estate Report
      </nav>

      <header className="max-w-3xl space-y-4">
        <Badge>Optional · one-time · never a fee to claim</Badge>
        <h1 className="font-display text-3xl tracking-tight text-ink sm:text-5xl">
          Get your claim right the first time
        </h1>
        <p className="max-w-2xl text-lg text-body">
          Searching and claiming from the state is always free, and you can do the whole thing yourself with our{" "}
          <Link href="/#search" className="text-ink underline">free claim wizard</Link>. If you&apos;d rather have the
          paperwork pre-filled and organised, these optional one-time packs do exactly that.
        </p>
      </header>

      {status === "soon" && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Secure checkout for this pack is launching shortly. In the meantime, your free claim checklist is ready.{" "}
          <Link href="/#search" className="underline">Start it here.</Link>
        </p>
      )}
      {status === "error" && (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          Something went wrong starting checkout. Please try again shortly, and remember you can always claim free
          yourself.
        </p>
      )}

      {personalised && state && asset && (
        <section className="rounded-2xl border border-line bg-bg p-6">
          <p className="text-xs font-semibold tracking-wide text-ink uppercase">Personalised for your claim</p>
          <p className="mt-1 text-sm text-ink">
            {state.name} · {asset.name} · claiming for {OWNER_LABELS[ownerStatus]}
          </p>
          {(() => {
            const productId = (requested?.id ?? (ownerStatus === "heir" ? "estate-report" : "claim-kit")) as Product["id"];
            const kit = buildClaimKit({ stateSlug: state.slug, assetSlug: asset.slug, ownerStatus, estimatedValue: value, product: productId });
            const points = [
              `A cover letter pre-addressed to ${state.agency}`,
              `${kit.checklist.length}-item document checklist, each explained`,
              `${kit.followUps.length}-step dated follow-up schedule`,
              `${kit.rejectionTips.length} rejection reasons with fixes`,
              ...(kit.estateSections ? [`${kit.estateSections.length} estate-specific sections (multi-state, affidavit)`] : []),
              `Submission walkthrough for ${state.name} ${asset.name.toLowerCase()}`,
            ];
            return (
              <ul className="mt-3 grid gap-2 text-sm text-ink sm:grid-cols-2">
                {points.map((pt) => (
                  <li key={pt} className="flex gap-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            );
          })()}
        </section>
      )}

      <section className="grid gap-5 lg:grid-cols-2">
        {PRODUCTS.map((p) => {
          const live = isProductPurchasable(p);
          const canBuyNow = live && personalised && state && asset;
          const buyHref = personalised && state && asset
            ? `/api/checkout?${new URLSearchParams({ product: p.id, state: state.slug, asset: asset.slug, owner: ownerStatus, ...(value > 0 ? { value: String(value) } : {}) }).toString()}`
            : `/api/checkout?product=${p.id}`;
          const highlight = requested?.id === p.id || (!requested && ((ownerStatus === "heir") === (p.id === "estate-report")));
          return (
            <div key={p.id} className={`rounded-2xl border p-6 ${highlight ? "border-2 border-ink bg-surface" : "border-line bg-surface"}`}>
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-xl text-ink">{p.name}</h2>
                <span className="font-display text-2xl text-ink">{p.priceLabel}<span className="font-sans text-sm font-medium text-muted"> one-time</span></span>
              </div>
              <p className="mt-1 text-sm text-body">{p.tagline}</p>
              <p className="mt-2 text-xs font-medium text-muted">For: {p.forWho}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-body">
                {p.includes.map((f) => (
                  <li key={f} className="flex gap-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {canBuyNow ? (
                <Button href={buyHref} variant="primary" icon={false} className="mt-5">
                  Get the {p.name}, {p.priceLabel}
                </Button>
              ) : !personalised ? (
                // The kit is generated from a claim's state/asset/owner context, so there is
                // nothing to check out until one exists: send people to build it first rather
                // than linking to a checkout that /api/checkout will always bounce.
                <div className="mt-5">
                  <Button href="/#search" variant="primary">Build your claim to unlock this</Button>
                  <p className="mt-2 text-xs text-muted">Takes under a minute. We personalise the {p.name.toLowerCase()} to your exact state and situation.</p>
                </div>
              ) : (
                <div className="mt-5">
                  <span className="inline-block cursor-default rounded-lg border border-line-strong px-5 py-2.5 text-sm font-semibold text-muted">
                    Launching shortly
                  </span>
                  <p className="mt-2 text-xs text-muted">Secure checkout isn&apos;t live yet. Your free claim checklist is ready now.</p>
                </div>
              )}
            </div>
          );
        })}
      </section>

      <section className="rounded-xl border border-line bg-surface p-6">
        <h2 className="font-display text-lg text-ink">You can always claim for free</h2>
        <p className="mt-1 text-sm text-body">
          Every state lets you search and claim your own property at no cost, and our wizard builds the same
          checklist for free. These packs are for people who simply want the writing and chasing handled.
        </p>
        <Button href="/#search" variant="secondary" size="sm" className="mt-3">Start a free claim</Button>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-3xl text-ink">Questions</h2>
        <Accordion items={premiumFaq} />
      </section>
    </div>
  );
}
