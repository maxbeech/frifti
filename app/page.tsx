import Image from "next/image";
import Link from "next/link";
import { ClaimFinder } from "@/components/ClaimFinder";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { AssetIcon } from "@/components/icons/AssetIcon";
import { CheckIcon } from "@/components/icons";
import { SITE } from "@/lib/site";
import { STATES } from "@/lib/states";
import { ASSET_TYPES } from "@/lib/assets";
import { NATIONAL_FACTS } from "@/lib/claims";
import { HOME_FAQ, faqJsonLd } from "@/lib/faq";
import { PRODUCTS } from "@/lib/products";
import { POSTS } from "@/lib/posts";

const CATEGORY_LABEL: Record<string, string> = { academy: "Academy", news: "News", reviews: "Review" };

export default function Home() {
  const latestPosts = [...POSTS].sort((a, b) => (a.published < b.published ? 1 : -1)).slice(0, 3);
  const softwareLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.name,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: SITE.url,
    description: SITE.description,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "50-state official unclaimed-property portal directory",
      "Guided claim wizard with document checklist",
      "Per-state and per-asset-type claim guidance",
    ],
  };

  return (
    <div className="space-y-20">
      <JsonLd data={[softwareLd, faqJsonLd(HOME_FAQ)]} />

      {/* Hero */}
      <section id="search" className="relative -mx-5 overflow-hidden rounded-3xl bg-grain bg-brand px-5 py-8 sm:-mx-0 sm:px-10 sm:py-10">
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-lime/40 blur-[110px]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-lime/20 blur-[100px]" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_1.15fr]">
          <Reveal trigger="mount" className="lg:pt-2">
            <Badge>{STATES.length} official programs · $0 to search or claim</Badge>
            <h1 className="mt-4 font-display text-4xl leading-[1.02] font-medium tracking-tight text-white sm:text-5xl">
              The government owes you money.
            </h1>
            <p className="mt-4 max-w-md text-base text-white/70 sm:text-lg">
              About 1 in 7 Americans has cash, insurance payouts or old paychecks sitting with a state treasury.
              Frifti finds your official portal and builds the exact checklist to get it back. No fee, ever.
            </p>
            <p aria-hidden className="mt-6 hidden font-display text-6xl leading-none font-medium text-lime sm:block">
              ${NATIONAL_FACTS.totalHeldBillions}B<span className="ml-2 align-middle font-sans text-sm font-semibold text-white/50">held nationwide</span>
            </p>
          </Reveal>
          <Reveal trigger="mount" delay={0.12}>
            <ClaimFinder />
          </Reveal>
        </div>
      </section>

      {/* Trust strip */}
      <Reveal
        as="section"
        className="grid grid-cols-1 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface sm:grid-cols-3 sm:divide-x sm:divide-y-0"
      >
        {[
          { n: String(STATES.length), l: "official state and territory programs" },
          { n: "1 in 7", l: "Americans have unclaimed property waiting" },
          { n: "$0", l: "cost to search or claim, always" },
        ].map((s) => (
          <div key={s.l} className="px-6 py-6 text-center sm:text-left">
            <div className="font-display text-3xl text-ink">{s.n}</div>
            <div className="mt-1 text-sm text-body">{s.l}</div>
          </div>
        ))}
      </Reveal>

      {/* Asset types */}
      <Reveal as="section" className="space-y-6">
        <h2 className="font-display text-3xl text-ink">Property we help you claim</h2>
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {ASSET_TYPES.map((a) => (
            <div key={a.slug} className="flex gap-4 border-t border-line pt-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lime/40 text-ink">
                <AssetIcon slug={a.slug} className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-ink">{a.name}</h3>
                <p className="mt-1 text-sm text-body">{a.short}</p>
                <p className="mt-1 text-xs text-muted">{a.examples.join(" · ")}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* State directory */}
      <section id="states" className="scroll-mt-24 space-y-5">
        <h2 className="font-display text-3xl text-ink">Search by state</h2>
        <p className="text-sm text-body">Every link opens that state&apos;s claim guide and official treasury portal.</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
          {STATES.map((s) => (
            <Link key={s.slug} href={`/unclaimed-property/${s.slug}`} className="text-sm text-body hover:text-ink hover:underline">
              {s.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <Reveal as="section" id="pricing" className="space-y-6">
        <h2 className="font-display text-3xl text-ink">Pricing</h2>
        <p className="max-w-2xl text-sm text-body">
          Searching and claiming from the state is always free. The optional one-time kits below are for people who
          want the paperwork pre-filled and organised, never a fee to claim, and never a subscription.
        </p>
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <h3 className="font-semibold text-ink">Free</h3>
            <p className="mt-2 font-display text-4xl text-ink">$0</p>
            <ul className="mt-5 space-y-2 text-sm text-body">
              {[
                "50-state official portal directory",
                "Guided claim wizard and document checklist",
                "Per-state and per-asset claim guides",
                "Timeline and complexity estimate",
              ].map((f) => (
                <li key={f} className="flex gap-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button href="#search" variant="secondary" size="sm" className="mt-6">Start a free claim</Button>
          </div>
          {PRODUCTS.map((p, i) => {
            const featured = i === 0;
            return (
              <div
                key={p.id}
                className={featured ? "rounded-2xl bg-grain bg-brand p-6 text-white" : "rounded-2xl border-2 border-ink bg-surface p-6"}
              >
                <h3 className={featured ? "font-semibold text-white" : "font-semibold text-ink"}>{p.name}</h3>
                <p className={`mt-2 font-display text-4xl ${featured ? "text-lime" : "text-ink"}`}>
                  {p.priceLabel}
                  <span className={`font-sans text-base font-medium ${featured ? "text-white/50" : "text-muted"}`}> one-time</span>
                </p>
                <ul className={`mt-5 space-y-2 text-sm ${featured ? "text-white/75" : "text-body"}`}>
                  {p.includes.slice(0, 4).map((f) => (
                    <li key={f} className="flex gap-2">
                      <CheckIcon className={`mt-0.5 h-4 w-4 shrink-0 ${featured ? "text-lime" : "text-ink"}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button href={`/premium?product=${p.id}`} variant={featured ? "primary" : "secondary"} size="sm" className="mt-6">
                  See what&apos;s inside
                </Button>
              </div>
            );
          })}
        </div>
      </Reveal>

      {/* Guides */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-3xl text-ink">From the guides</h2>
          <Link href="/blog" className="text-sm font-medium text-ink hover:underline">All guides</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {latestPosts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <Link
                href={`/blog/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-ink"
              >
                <div className="relative h-40 w-full overflow-hidden bg-bg">
                  <Image
                    src={p.featuredImage.src}
                    alt={p.featuredImage.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded bg-lime px-2 py-0.5 text-[11px] font-semibold tracking-wide text-ink uppercase">
                    {CATEGORY_LABEL[p.category] ?? p.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-1.5 p-4">
                  <h3 className="font-display text-base leading-snug text-ink">{p.title}</h3>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-6">
        <h2 className="font-display text-3xl text-ink">Frequently asked questions</h2>
        <Accordion items={HOME_FAQ} />
      </section>
    </div>
  );
}
