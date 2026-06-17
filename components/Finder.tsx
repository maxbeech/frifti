"use client";

import { useState } from "react";
import { STATES } from "@/lib/data/states";
import { SITE } from "@/lib/site";

// The free search wedge: pick a state, get the official, free portals to search
// — the state's own program and the NAUPA-sponsored MissingMoney.com. We never
// run a paid search; we route to the official free databases as fast as
// possible and remind people to check every state they have lived in.
export function Finder() {
  const [slug, setSlug] = useState("");
  const state = STATES.find((s) => s.slug === slug);

  return (
    <div id="finder" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900">Find your unclaimed money</h2>
      <p className="mt-1 text-sm text-slate-600">
        Choose a state where you have lived or worked. We&apos;ll point you straight to that state&apos;s
        official, free search — no finder&apos;s fee, ever.
      </p>

      <label className="mt-4 block text-sm font-medium text-slate-700">
        State
        <select
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none"
        >
          <option value="">Select a state…</option>
          {STATES.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      {state ? (
        <div className="mt-5 space-y-3 rounded-xl bg-emerald-50 p-4">
          <p className="text-sm text-slate-700">
            <span className="font-semibold">{state.name}</span> unclaimed property is administered by the{" "}
            <span className="font-medium">{state.agency}</span>.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={state.official}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Search the official {state.abbr} portal →
            </a>
            <a
              href={SITE.missingMoney}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-emerald-700 hover:border-emerald-500"
            >
              Also search MissingMoney.com (multi-state)
            </a>
            <a
              href={`/unclaimed-property/${state.slug}`}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400"
            >
              {state.name} claim guide
            </a>
          </div>
          <p className="text-xs text-slate-500">
            Tip: search under your maiden or former names too, and repeat the search in every state where you have
            lived or worked.
          </p>
        </div>
      ) : (
        <p className="mt-5 text-xs text-slate-500">
          No idea where to start? Search the free multi-state{" "}
          <a href={SITE.missingMoney} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">
            MissingMoney.com
          </a>{" "}
          (sponsored by NAUPA) and the{" "}
          <a href={SITE.naupaDirectory} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">
            official NAUPA state directory
          </a>
          .
        </p>
      )}
    </div>
  );
}
