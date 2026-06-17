import Link from "next/link";
import { ClaimFinder } from "@/components/ClaimFinder";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { STATES } from "@/lib/states";
import { ASSET_TYPES } from "@/lib/assets";
import { NATIONAL_FACTS } from "@/lib/claims";
import { HOME_FAQ, faqJsonLd } from "@/lib/faq";

export default function Home() {
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
    <div className="space-y-16">
      <JsonLd data={[softwareLd, faqJsonLd(HOME_FAQ)]} />

      {/* Hero */}
      <section id="search" className="space-y-6">
        <div className="space-y-3 text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            All 50 states · DC · Puerto Rico · 100% free to claim
          </span>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Find unclaimed money the government is holding in your name
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            U.S. states are holding an estimated ${NATIONAL_FACTS.totalHeldBillions} billion in forgotten bank accounts,
            paychecks, insurance and deposits. ClaimWise HQ takes you straight to the official state portal and
            builds your exact claim checklist — free.
          </p>
        </div>
        <ClaimFinder />
      </section>

      {/* Trust strip */}
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { n: "52", l: "official state programs covered" },
          { n: "~1 in 7", l: "Americans have unclaimed property" },
          { n: "$0", l: "cost to search and claim from the state" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl border border-slate-200 bg-white p-5 text-center">
            <div className="text-2xl font-bold text-emerald-600">{s.n}</div>
            <div className="mt-1 text-sm text-slate-600">{s.l}</div>
          </div>
        ))}
      </section>

      {/* Asset types */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-slate-900">Types of unclaimed property we help you claim</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ASSET_TYPES.map((a) => (
            <div key={a.slug} className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-800">{a.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{a.short}</p>
              <p className="mt-2 text-xs text-slate-500">{a.examples.join(" · ")}</p>
            </div>
          ))}
        </div>
      </section>

      {/* State directory */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-slate-900">Search unclaimed property by state</h2>
        <p className="text-sm text-slate-600">Every link below opens that state&apos;s claim guide and official treasury portal.</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
          {STATES.map((s) => (
            <Link key={s.slug} href={`/unclaimed-property/${s.slug}`} className="text-sm text-slate-700 hover:text-emerald-700">
              {s.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="space-y-5">
        <h2 className="text-2xl font-bold text-slate-900">Pricing</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-800">Free</h3>
            <p className="mt-1 text-3xl font-bold text-slate-900">$0</p>
            <ul className="mt-4 space-y-1 text-sm text-slate-600">
              <li>50-state official portal directory</li>
              <li>Guided claim wizard + document checklist</li>
              <li>Per-state and per-asset claim guides</li>
            </ul>
            <Link href="#search" className="mt-5 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
              Start a free claim
            </Link>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <h3 className="font-semibold text-slate-800">Pro tracker <span className="ml-1 rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white align-middle">SOON</span></h3>
            <p className="mt-1 text-3xl font-bold text-slate-900">$9.99<span className="text-base font-medium text-slate-500">/mo</span></p>
            <ul className="mt-4 space-y-1 text-sm text-slate-600">
              <li>Track multiple claims across states</li>
              <li>Document storage per claim</li>
              <li>30 / 60 / 90-day reminder emails</li>
              <li>Claim-history PDF export</li>
            </ul>
            <Link href="/api/checkout" className="mt-5 inline-block rounded-lg border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-white">
              Join the waitlist
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-slate-900">Frequently asked questions</h2>
        <div className="space-y-4">
          {HOME_FAQ.map((f) => (
            <div key={f.q} className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-800">{f.q}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
