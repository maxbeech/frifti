"use client";

import { useState } from "react";
import Link from "next/link";

const FREE = [
  "Search hub for all 50 states + DC",
  "Step-by-step claim guide for any property type",
  "Owner, heir & business document checklists",
  "Notarization rules & typical timeline",
  "Links to official, free government portals",
];

const PRO = [
  "Everything in Free",
  "Claim tracker: log every claim across states & assets",
  "Status pipeline (started → submitted → paid)",
  "Document checklist per claim, ticked off as you go",
  "30 / 60 / 90-day reminder emails",
  "PDF export of your claim history",
];

export default function Pricing() {
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setMsg(data.error ?? "Checkout is unavailable right now.");
    } catch {
      setMsg("Could not start checkout. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pricing</h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Searching and claiming your money is always free. Pro is for people tracking several claims across
          states — it keeps your paperwork and deadlines organized.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Free</h2>
          <p className="mt-1 text-3xl font-bold text-slate-900">$0</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {FREE.map((f) => (
              <li key={f} className="flex gap-2"><span className="text-emerald-600">✓</span>{f}</li>
            ))}
          </ul>
          <Link href="/#finder" className="mt-6 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            Start searching free
          </Link>
        </div>

        <div className="rounded-2xl border-2 border-emerald-500 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Pro</h2>
          <p className="mt-1 text-3xl font-bold text-slate-900">$9.99<span className="text-base font-normal text-slate-500">/mo</span></p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {PRO.map((f) => (
              <li key={f} className="flex gap-2"><span className="text-emerald-600">✓</span>{f}</li>
            ))}
          </ul>
          <button
            onClick={startCheckout}
            disabled={loading}
            className="mt-6 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
          >
            {loading ? "Starting…" : "Upgrade to Pro"}
          </button>
          {msg ? <p className="mt-3 text-sm text-amber-700">{msg}</p> : null}
        </div>
      </section>

      <p className="text-xs text-slate-400">
        ClaimWise HQ never charges a finder&apos;s fee. The free tier is all you need to find and claim your
        money — Pro only adds organization tools for multiple ongoing claims.
      </p>
    </div>
  );
}
