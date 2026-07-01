import type { Metadata } from "next";
import Link from "next/link";
import { PrintButton } from "@/components/PrintButton";
import { retrieveCheckoutSession, stripeConfigured } from "@/lib/stripe";
import { buildClaimKit } from "@/lib/kit";
import { getProduct } from "@/lib/products";
import { getState } from "@/lib/states";
import { getAsset } from "@/lib/assets";
import type { OwnerStatus } from "@/lib/claims";

// Post-payment delivery. Verifies the Stripe session server-side, then renders the buyer's
// personalised kit straight from lib/kit.ts using the session metadata — no database. If the
// payment can't be verified, shows an explicit, honest failure state (never a fake unlock).
export const metadata: Metadata = { title: "Your Claim Kit", robots: { index: false } };

function str(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-2xl space-y-8 py-6">{children}</div>;
}

export default async function Success({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const sessionId = str(sp.session_id);

  // No session reference at all → nothing to deliver.
  if (!sessionId) {
    return (
      <Shell>
        <h1 className="text-2xl font-bold text-slate-900">No claim kit to show</h1>
        <p className="text-slate-600">We couldn&apos;t find a purchase reference. If you just paid, use the link in your Stripe receipt email, or start again from the kit page.</p>
        <Link href="/premium" className="inline-block rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">View the Claim Kit →</Link>
      </Shell>
    );
  }

  const session = stripeConfigured() ? await retrieveCheckoutSession(sessionId) : null;

  // Couldn't verify (billing not configured, or Stripe lookup failed) → explicit failure.
  if (!session || !session.paid) {
    return (
      <Shell>
        <h1 className="text-2xl font-bold text-slate-900">We couldn&apos;t verify this payment yet</h1>
        <p className="text-slate-600">
          {session && !session.paid
            ? "Your payment hasn't completed. If you were charged, it may still be processing — refresh in a minute, or use the link in your Stripe receipt."
            : "We couldn't confirm this purchase. If you were charged, contact us with your receipt and we'll sort it out. In the meantime, you can always claim free yourself."}
        </p>
        <Link href="/#search" className="inline-block rounded-lg border border-emerald-600 px-5 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">Start a free claim →</Link>
      </Shell>
    );
  }

  // Verified paid → rebuild the exact kit from session metadata.
  const m = session.metadata;
  const product = getProduct(m.product ?? "claim-kit");
  const state = getState(m.state ?? "");
  const asset = getAsset(m.asset ?? "");
  const ownerStatus: OwnerStatus = (["self", "business", "heir"].includes(m.owner ?? "") ? m.owner : "self") as OwnerStatus;
  const value = Math.max(0, Number(m.value) || 0);

  if (!product || !state || !asset) {
    return (
      <Shell>
        <h1 className="text-2xl font-bold text-slate-900">Payment received</h1>
        <p className="text-slate-600">Thank you. We couldn&apos;t rebuild the claim details from this purchase — please contact us with your Stripe receipt and we&apos;ll send your kit straight over.</p>
      </Shell>
    );
  }

  const kit = buildClaimKit({ stateSlug: state.slug, assetSlug: asset.slug, ownerStatus, estimatedValue: value, product: product.id });

  // Real calendar dates for the follow-up schedule, anchored to today (request time).
  const today = new Date();
  const dateFor = (offsetWeeks: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offsetWeeks * 7);
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <article className="mx-auto max-w-2xl space-y-8 py-6">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 print:hidden">Payment confirmed · {product.name}</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">{kit.title}</h1>
        </div>
        <PrintButton />
      </header>

      <p className="text-slate-600">{kit.intro}</p>
      <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 print:hidden">
        Save this page now — print it or use &ldquo;Save as PDF&rdquo;. It&apos;s your copy; there&apos;s no account to log back into.
      </p>

      <a href={state.portal} target="_blank" rel="noopener noreferrer" className="inline-block rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 print:hidden">
        Open the official {state.name} portal →
      </a>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">1. Your cover letter</h2>
        <p className="text-sm text-slate-600">Replace every [BRACKETED] field, then attach it to your claim.</p>
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl border border-slate-200 bg-white p-5 font-sans text-sm text-slate-700">{kit.coverLetter}</pre>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">2. Document checklist</h2>
        <ul className="space-y-2">
          {kit.checklist.map((c) => (
            <li key={c.item} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="font-medium text-slate-800">☐ {c.item}</p>
              <p className="mt-1 text-sm text-slate-600">{c.why}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">3. Follow-up schedule</h2>
        <ul className="space-y-2">
          {kit.followUps.map((f) => (
            <li key={f.label} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm">
              <span className="shrink-0 font-semibold text-emerald-700">{dateFor(f.offsetWeeks)}</span>
              <span className="text-slate-600"><span className="font-medium text-slate-800">{f.label}:</span> {f.action}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">4. How to submit</h2>
        <ol className="space-y-2 text-sm text-slate-600">
          {kit.submissionSteps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">5. Avoid these rejection reasons</h2>
        <ul className="space-y-2">
          {kit.rejectionTips.map((t) => (
            <li key={t.problem} className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
              <p className="font-medium text-slate-800">{t.problem}</p>
              <p className="mt-1 text-slate-600">{t.fix}</p>
            </li>
          ))}
        </ul>
      </section>

      {kit.estateSections && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">6. Estate & heir guidance</h2>
          {kit.estateSections.map((sec) => (
            <div key={sec.h} className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="font-semibold text-slate-800">{sec.h}</h3>
              {sec.p && <p className="mt-1 text-sm text-slate-600">{sec.p}</p>}
              {sec.ul && (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                  {sec.ul.map((li) => <li key={li}>{li}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      <p className="border-t border-slate-200 pt-5 text-xs text-slate-400">
        Frifti is independent and not affiliated with {state.agency} or any government body. This kit is informational guidance, not legal advice. The official {state.name} portal is always the authoritative source for your claim, and claiming from the state is free.
      </p>
    </article>
  );
}
