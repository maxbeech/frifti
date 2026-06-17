import Link from "next/link";
import { Finder } from "@/components/Finder";
import { ClaimWizard } from "@/components/ClaimWizard";
import { JsonLd, softwareAppLd, faqLd } from "@/components/JsonLd";
import { HOME_FAQ } from "@/lib/faq";
import { ASSET_TYPES } from "@/lib/data/assetTypes";
import { STATES } from "@/lib/data/states";
import { SITE } from "@/lib/site";

export default function Home() {
  return (
    <div className="space-y-12">
      <JsonLd data={[softwareAppLd(), faqLd(HOME_FAQ)]} />

      <section className="space-y-4">
        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          Free · all 50 states + DC · official portals only
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Find &amp; claim your unclaimed money
        </h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Tens of billions of dollars in forgotten bank accounts, insurance, paychecks and deposits sit in US
          state treasuries — and about 1 in 7 Americans has some. {SITE.name} searches every official state
          program in one place, then walks you through claiming it: the exact documents, the steps and a
          realistic timeline. It&apos;s free, and we never take a finder&apos;s fee.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <a href="#finder" className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700">
            Find my money
          </a>
          <a href="#claim-guide" className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:border-slate-400">
            Build a claim guide
          </a>
        </div>
      </section>

      <Finder />

      <ClaimWizard />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Types of unclaimed property</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ASSET_TYPES.map((a) => (
            <Link
              key={a.slug}
              href={`/unclaimed-property/california/${a.slug}`}
              className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-400 hover:shadow-sm"
            >
              <p className="font-medium text-slate-900">{a.name}</p>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">{a.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Search unclaimed property by state</h2>
        <p className="text-sm text-slate-600">
          Each page links to that state&apos;s official, free program and gives a state-specific claim guide.
        </p>
        <div className="flex flex-wrap gap-1.5 text-sm">
          {STATES.map((s) => (
            <Link
              key={s.slug}
              href={`/unclaimed-property/${s.slug}`}
              className="rounded border border-slate-200 bg-white px-2.5 py-1 text-slate-600 hover:border-emerald-400"
            >
              {s.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Frequently asked questions</h2>
        <div className="space-y-3">
          {HOME_FAQ.map((qa) => (
            <details key={qa.q} className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer font-medium text-slate-900">{qa.q}</summary>
              <p className="mt-2 text-sm text-slate-600">{qa.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
