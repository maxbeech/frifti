"use client";

import { useMemo, useState } from "react";
import { STATES } from "@/lib/states";
import { ASSET_TYPES } from "@/lib/assets";
import { buildClaimPlan, type OwnerStatus } from "@/lib/claims";

const OWNER_LABELS: Record<OwnerStatus, string> = {
  self: "Myself",
  business: "A business I represent",
  heir: "A deceased relative (I'm an heir/executor)",
};

export function ClaimFinder({ initialState }: { initialState?: string }) {
  const [stateSlug, setStateSlug] = useState(initialState ?? "");
  const [assetSlug, setAssetSlug] = useState("bank-accounts");
  const [value, setValue] = useState("");
  const [owner, setOwner] = useState<OwnerStatus>("self");

  const plan = useMemo(() => {
    if (!stateSlug) return null;
    return buildClaimPlan({
      stateSlug,
      assetSlug,
      estimatedValue: value ? Number(value) : 0,
      ownerStatus: owner,
    });
  }, [stateSlug, assetSlug, value, owner]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Which state held the property?</span>
          <select
            value={stateSlug}
            onChange={(e) => setStateSlug(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
          >
            <option value="">Select a state…</option>
            {STATES.map((s) => (
              <option key={s.slug} value={s.slug}>{s.name}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">What type of property?</span>
          <select
            value={assetSlug}
            onChange={(e) => setAssetSlug(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
          >
            {ASSET_TYPES.map((a) => (
              <option key={a.slug} value={a.slug}>{a.name}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Estimated amount (optional)</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. 500"
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Who are you claiming for?</span>
          <select
            value={owner}
            onChange={(e) => setOwner(e.target.value as OwnerStatus)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
          >
            {(Object.keys(OWNER_LABELS) as OwnerStatus[]).map((k) => (
              <option key={k} value={k}>{OWNER_LABELS[k]}</option>
            ))}
          </select>
        </label>
      </div>

      {!plan && (
        <p className="mt-4 text-sm text-slate-500">Pick a state to generate your free claim checklist.</p>
      )}

      {plan && (
        <div className="mt-6 border-t border-slate-100 pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={plan.portal}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Search the official {plan.state.name} portal →
            </a>
            <span className="text-xs text-slate-500">{plan.state.agency} · always free to claim</span>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Your claim at a glance</h3>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                <li><span className="font-medium text-slate-700">Property type:</span> {plan.asset.name}</li>
                <li><span className="font-medium text-slate-700">Complexity:</span> <span className="capitalize">{plan.complexity}</span></li>
                <li>
                  <span className="font-medium text-slate-700">Typical timeline:</span>{" "}
                  {plan.timelineWeeks.min}–{plan.timelineWeeks.max} weeks after a complete claim
                </li>
                <li>
                  <span className="font-medium text-slate-700">Notarized form:</span>{" "}
                  {plan.notarizationLikely ? "Likely required" : "Usually not required"}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Documents to gather</h3>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                {plan.documents.map((d) => (
                  <li key={d} className="flex gap-2">
                    <span aria-hidden className="mt-0.5 text-emerald-600">✓</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <ol className="mt-6 space-y-2 text-sm text-slate-600">
            {plan.steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
