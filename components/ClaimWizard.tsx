"use client";

import { useState } from "react";
import { ASSET_TYPES } from "@/lib/data/assetTypes";
import { buildClaimGuide, timelineLabel, type ClaimantType } from "@/lib/calc/claim";

const CLAIMANTS: { value: ClaimantType; label: string; hint: string }[] = [
  { value: "owner", label: "It's mine", hint: "You are the person/owner named on the property" },
  { value: "heir", label: "I'm an heir", hint: "The owner has died and you are a relative or estate rep" },
  { value: "business", label: "For a business", hint: "Claiming on behalf of a company or organization" },
];

// Core feature: a deterministic claim-guidance generator. The user picks the
// asset type, who is claiming, and a rough value; the engine returns the exact
// documents, ordered steps, notarization flag and a typical-timeline estimate.
export function ClaimWizard({ defaultAsset = "bank-accounts" }: { defaultAsset?: string }) {
  const [assetSlug, setAssetSlug] = useState(defaultAsset);
  const [claimantType, setClaimantType] = useState<ClaimantType>("owner");
  const [value, setValue] = useState(250);

  const asset = ASSET_TYPES.find((a) => a.slug === assetSlug) ?? ASSET_TYPES[0];
  const guide = buildClaimGuide({ asset, claimantType, estimatedValueUSD: value });

  return (
    <div id="claim-guide" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900">Build your claim guide</h2>
      <p className="mt-1 text-sm text-slate-600">
        Answer three questions and get the exact documents, steps and a typical timeline for your claim.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <label className="block text-sm font-medium text-slate-700">
          Property type
          <select
            value={assetSlug}
            onChange={(e) => setAssetSlug(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none"
          >
            {ASSET_TYPES.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.short}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Who is claiming?
          <select
            value={claimantType}
            onChange={(e) => setClaimantType(e.target.value as ClaimantType)}
            className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none"
          >
            {CLAIMANTS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Estimated value (USD)
          <input
            type="number"
            min={0}
            value={value}
            onChange={(e) => setValue(Math.max(0, Number(e.target.value) || 0))}
            className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Typical timeline</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700">{timelineLabel(guide.timelineWeeks)}</p>
          <p className="mt-1 text-xs text-slate-500">
            General estimate for a straightforward claim — your state sets the exact timeline.
          </p>
          <p className="mt-3 text-sm text-slate-700">
            Notarized affidavit:{" "}
            <span className={guide.notarizationRequired ? "font-semibold text-amber-700" : "font-semibold text-emerald-700"}>
              {guide.notarizationRequired ? "usually required" : "usually not required"}
            </span>
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Documents you&apos;ll need</p>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
            {guide.requiredDocuments.map((d) => (
              <li key={d} className="flex gap-2">
                <span className="mt-0.5 text-emerald-600">✓</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Step-by-step</p>
        <ol className="mt-2 space-y-2 text-sm text-slate-700">
          {guide.steps.map((s, i) => (
            <li key={s} className="flex gap-3">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                {i + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-4 rounded-xl bg-amber-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Avoid these common rejections</p>
        <ul className="mt-2 space-y-1.5 text-sm text-amber-900">
          {guide.commonRejections.map((r) => (
            <li key={r} className="flex gap-2">
              <span className="mt-0.5">!</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
